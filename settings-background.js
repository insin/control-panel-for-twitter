import {
  ACCOUNT_LINKED_MESSAGE,
  ACCOUNT_UNLINKED_MESSAGE,
  CLEAR_DEBUG_TRACE_MESSAGE,
  GET_DEBUG_TRACE_MESSAGE,
  get,
  OPEN_APP_MESSAGE,
  remove,
  SET_SETTINGS_MESSAGE,
  SYNC_SETTINGS_CHANGED_MESSAGE,
  set,
} from './settings.js'
import { clearTrace, getTrace, trace } from './trace-background.js'

const CONFIG = {
  accountRefreshIntervalMinutes: 60,
  apiBase: 'https://pro.soitis.dev',
  pullIntervalMinutes: 10,
  pushDebounceSeconds: 30,
}
const IS_PRO = Number(chrome.runtime.getManifest?.().version?.split('.')[0]) >= 5

//#region Constants
export const ACCOUNT_REFRESH_ALARM = 'ACCOUNT_REFRESH'
export const PULL_ALARM = 'SETTINGS_PULL'
export const PUSH_ALARM = 'SETTINGS_PUSH'
//#endregion

//#region Utilities
let settingsWrite = Promise.resolve()

/**
 * Serialise background settings mutations
 * @template T
 * @param {() => T | Promise<T>} task
 * @returns {Promise<T>}
 */
function withSettingsWrite(task) {
  const pending = settingsWrite.then(task)
  settingsWrite = pending.then(
    () => {},
    () => {},
  )
  return pending
}

let syncCycleSequence = 0
let syncEpoch = 0
let syncTask = Promise.resolve()

/**
 * @template T
 * @param {() => T | Promise<T>} task
 * @returns {Promise<T>}
 */
function queueSync(task) {
  const pending = syncTask.then(task)
  syncTask = pending.then(
    () => {},
    () => {},
  )
  return pending
}

async function isCurrentSync(headers, epoch) {
  const { token, syncSettings = true } = await get(['token', 'syncSettings'])
  return syncSettings && epoch == syncEpoch && headers.Authorization == `Bearer ${token}`
}

/**
 * @param {Promise<any>} task
 * @param {(response?: any) => void} sendResponse
 * @returns {true}
 */
function keepMessageChannelOpen(task, sendResponse) {
  runBackgroundTask(task).then(sendResponse)
  return true
}

function runBackgroundTask(task) {
  return task.catch((error) => console.error('[settings-background]', error))
}

// Async alarm wrappers for Firefox MV2
function clearAlarm(name) {
  return new Promise((resolve, reject) => {
    chrome.alarms.clear(name, (cleared) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
      else resolve(cleared)
    })
  })
}

function getAlarm(name) {
  return new Promise((resolve, reject) => {
    chrome.alarms.get(name, (alarm) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError)
      else resolve(alarm)
    })
  })
}

function settingsValueMatches(a, b) {
  return JSON.stringify(a) == JSON.stringify(b)
}
//#endregion

//#region Functions
/**
 * @param {Partial<import('./types').UserSettings>} changes
 * @param {{replace?: boolean}} [options]
 */
function writeSettings(changes, { replace = false } = {}) {
  return withSettingsWrite(async () => {
    const {
      pendingSettingsPatch = {},
      settings = {},
      syncSettings = true,
      token,
    } = await get(['pendingSettingsPatch', 'settings', 'syncSettings', 'token'])
    const sync = IS_PRO && syncSettings && token
    let synced = {}
    if (replace && sync) {
      // Imports require a successful upload before changing local settings
      const epoch = syncEpoch
      const headers = await getHeaders()
      const res = await fetch(`${CONFIG.apiBase}/api/extension/settings`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ settings: changes }),
      })
      if (!res.ok) throw new Error(`Settings import failed (HTTP ${res.status})`)
      const { lastModified } = await res.json()
      if (!(await isCurrentSync(headers, epoch)))
        throw new Error('Sync state changed during import')
      synced = {
        serverLastModified: lastModified,
        lastSyncTime: Date.now(),
        settingsSyncPhase: 'ready',
      }
    }
    if (replace && sync) await remove('syncError')
    await set({
      settings: replace ? changes : { ...settings, ...changes },
      ...(sync
        ? { pendingSettingsPatch: replace ? {} : { ...pendingSettingsPatch, ...changes } }
        : {}),
      ...synced,
    })
    return Boolean(sync && !replace)
  })
}

async function applyServerSettings(settings, lastModified) {
  const { pendingSettingsPatch = {} } = await get('pendingSettingsPatch')
  await set({
    serverLastModified: lastModified,
    settings: { ...settings, ...pendingSettingsPatch },
  })
}

async function disableSettingsSync() {
  syncEpoch++
  await trace('sync.disabled')
  // Settings changes made while sync is off must remain local
  await Promise.all([clearAlarm(PULL_ALARM), clearAlarm(PUSH_ALARM)])
  await trace('alarms.cleared', { names: [PULL_ALARM, PUSH_ALARM], reason: 'sync-disabled' })
  await withSettingsWrite(() => remove('pendingSettingsPatch'))

  // Keep subscription details fresh while sync is off
  const { token } = await get('token')
  if (token) {
    const alarm = await getAlarm(ACCOUNT_REFRESH_ALARM)
    if (!alarm) resetAccountRefreshTimer()
  }
}

async function enableSettingsSync({ phase = 'replace-from-server', reason = 'sync-enabled' } = {}) {
  const { token } = await get('token')
  await trace('sync.enabled', { hasToken: Boolean(token), phase, reason })
  if (!token) {
    await Promise.all([
      clearAlarm(ACCOUNT_REFRESH_ALARM),
      clearAlarm(PULL_ALARM),
      clearAlarm(PUSH_ALARM),
    ])
    await trace('alarms.cleared', {
      names: [ACCOUNT_REFRESH_ALARM, PULL_ALARM, PUSH_ALARM],
      reason: 'no-linked-account',
    })
    return
  }

  // Keep the intended reconciliation mode across failed requests and MV3
  // service worker restarts.
  await set({ settingsSyncPhase: phase })

  // Subscription details are refreshed when pulling settings
  await clearAlarm(ACCOUNT_REFRESH_ALARM)

  // Resume pulling with an initial immediate pull
  await syncSettingsNow(reason)
  if (await isSettingsSyncEnabled()) resetPullTimer()
}

async function getHeaders() {
  const { token } = await get('token')
  if (!token) return null
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function handleAccountLinked({ email, token }) {
  if (typeof token != 'string' || !token || typeof email != 'string')
    throw new Error('Invalid account credentials')
  syncEpoch++
  await trace('account.linked')
  await withSettingsWrite(async () => {
    await remove([
      'lastSyncTime',
      'pendingSettingsPatch',
      'serverLastModified',
      'settingsSyncPhase',
      'subscription',
      'syncError',
    ])
    await set({ accountEmail: email, token })
  })

  if (await isSettingsSyncEnabled()) {
    await enableSettingsSync({ phase: 'seed-if-missing', reason: 'account-linked' })
  } else {
    await refreshAccount()
    await disableSettingsSync()
  }
}

async function handleAccountUnlinked() {
  syncEpoch++
  await trace('account.unlinked')
  await Promise.all([
    clearAlarm(ACCOUNT_REFRESH_ALARM),
    clearAlarm(PULL_ALARM),
    clearAlarm(PUSH_ALARM),
  ])
  await trace('alarms.cleared', {
    names: [ACCOUNT_REFRESH_ALARM, PULL_ALARM, PUSH_ALARM],
    reason: 'account-unlinked',
  })
  await withSettingsWrite(() =>
    remove([
      'accountEmail',
      'lastSyncTime',
      'pendingSettingsPatch',
      'serverLastModified',
      'settingsSyncPhase',
      'subscription',
      'syncError',
      'token',
    ]),
  )
}

async function handleSettingsErrorResponse(res) {
  if (res.status == 401) {
    await set({ syncError: 'auth' })
    await handleAccountUnlinked()
  } else if (res.status == 402) {
    const { subscription } = await res.json()
    await set({ syncError: 'subscription_inactive', subscription })
  } else if (res.status == 429) {
    await set({ syncError: 'rate_limited' })
  } else if (res.status >= 500) {
    await set({ syncError: 'server_error' })
  } else {
    await set({ syncError: 'bad_request' })
  }
}

async function isSettingsSyncEnabled() {
  const { syncSettings = true } = await get('syncSettings')
  return syncSettings
}

/**
 * Pulls and reconciles server settings.
 * @returns `failed` when the pull cannot complete, `seed-server` when the
 * server should be seeded from this browser, or `reconciled` otherwise.
 */
async function pullSettings(cycle) {
  const epoch = syncEpoch
  if (!(await isSettingsSyncEnabled())) {
    await trace('settings.pull.skipped', { cycle, reason: 'sync-disabled' })
    return 'failed'
  }

  const headers = await getHeaders()
  if (!headers) {
    await trace('settings.pull.skipped', { cycle, reason: 'no-linked-account' })
    return 'failed'
  }

  let res
  const startedAt = Date.now()
  await trace('http.request', {
    cycle,
    endpoint: '/api/extension/settings',
    method: 'GET',
  })
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/settings`, { headers })
  } catch {
    if (!(await isCurrentSync(headers, epoch))) return 'failed'
    await set({ syncError: 'network' })
    await trace('http.failed', {
      cycle,
      durationMs: Date.now() - startedAt,
      endpoint: '/api/extension/settings',
      method: 'GET',
      reason: 'network',
    })
    return 'failed'
  }

  await trace('http.response', {
    cycle,
    durationMs: Date.now() - startedAt,
    endpoint: '/api/extension/settings',
    method: 'GET',
    status: res.status,
  })

  if (!(await isCurrentSync(headers, epoch))) return 'failed'
  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return 'failed'
  }
  if (!(await isSettingsSyncEnabled())) {
    await trace('settings.pull.skipped', { cycle, reason: 'disabled-during-request' })
    return 'failed'
  }

  const payload = await res.json()
  return withSettingsWrite(async () => {
    if (!(await isCurrentSync(headers, epoch))) return 'failed'
    await remove('syncError')
    await set({ lastSyncTime: Date.now() })

    const { hasSettings, settings, lastModified, subscription } = payload
    const { serverLastModified = 0, settingsSyncPhase = 'ready' } = await get([
      'serverLastModified',
      'settingsSyncPhase',
    ])

    if (subscription !== undefined) {
      await set({ subscription })
    }

    if (!hasSettings) {
      if (settingsSyncPhase == 'seed-if-missing') {
        await trace('settings.reconciled', {
          cycle,
          outcome: 'seed-server',
          phase: settingsSyncPhase,
        })
        return 'seed-server'
      } else if (settingsSyncPhase == 'replace-from-server') {
        // An empty server snapshot means default settings, but we should
        // preserve any changes made immediately after sync was re-enabled.
        const { pendingSettingsPatch = {} } = await get('pendingSettingsPatch')
        await set({ settings: pendingSettingsPatch })
        await trace('settings.reconciled', {
          cycle,
          outcome: 'replace-with-defaults',
          pendingKeys: Object.keys(pendingSettingsPatch),
          phase: settingsSyncPhase,
        })
      } else {
        await trace('settings.reconciled', {
          cycle,
          outcome: 'server-empty',
          phase: settingsSyncPhase,
        })
      }
      await set({ settingsSyncPhase: 'ready' })
      return 'reconciled'
    }

    const applyServerSnapshot = settingsSyncPhase != 'ready' || lastModified > serverLastModified
    if (applyServerSnapshot) {
      await applyServerSettings(settings, lastModified)
    }
    await set({ settingsSyncPhase: 'ready' })
    await trace('settings.reconciled', {
      cycle,
      outcome: applyServerSnapshot ? 'server-applied' : 'server-not-newer',
      phase: settingsSyncPhase,
    })
    return 'reconciled'
  })
}

/**
 * @param {{ cycle?: number, full?: boolean, reason?: string }} [options]
 * @returns `true` when the server accepted the settings or there was nothing to
 * push.
 */
async function pushSettings({ cycle, full = false, reason = 'pending-settings' } = {}) {
  if (!(await isSettingsSyncEnabled())) {
    await trace('settings.push.skipped', { cycle, reason: 'sync-disabled' })
    return false
  }
  const headers = await getHeaders()
  if (!headers) {
    await trace('settings.push.skipped', { cycle, reason: 'no-linked-account' })
    return false
  }
  const epoch = syncEpoch
  const { pendingSettingsPatch = {}, settings = {} } = await get([
    'pendingSettingsPatch',
    'settings',
  ])
  const settingsPatch = full ? settings : pendingSettingsPatch
  const method = 'PATCH'
  const settingsKeys = Object.keys(settingsPatch)
  if (!full && settingsKeys.length == 0) {
    await trace('settings.push.skipped', { cycle, reason: 'no-pending-settings' })
    return true
  }

  let res
  const startedAt = Date.now()
  await trace('http.request', {
    cycle,
    endpoint: '/api/extension/settings',
    full,
    keyCount: settingsKeys.length,
    ...(full ? {} : { keys: settingsKeys }),
    method,
    reason,
  })
  try {
    const request = await withSettingsWrite(async () => {
      if (!(await isCurrentSync(headers, epoch))) return null
      return {
        response: fetch(`${CONFIG.apiBase}/api/extension/settings`, {
          method,
          headers,
          body: JSON.stringify({ settings: settingsPatch }),
        }),
      }
    })
    if (!request) return false
    res = await request.response
  } catch {
    if (!(await isCurrentSync(headers, epoch))) return false
    await set({ syncError: 'network' })
    await trace('http.failed', {
      cycle,
      durationMs: Date.now() - startedAt,
      endpoint: '/api/extension/settings',
      method,
      reason: 'network',
    })
    return false
  }
  await trace('http.response', {
    cycle,
    durationMs: Date.now() - startedAt,
    endpoint: '/api/extension/settings',
    method,
    status: res.status,
  })
  if (!(await isCurrentSync(headers, epoch))) return false
  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return false
  }
  const { lastModified } = await res.json()
  await withSettingsWrite(async () => {
    if (!(await isCurrentSync(headers, epoch))) return
    await remove('syncError')
    await set({ lastSyncTime: Date.now() })
    const { pendingSettingsPatch: latestPatch = {} } = await get('pendingSettingsPatch')
    const remainingPatch = Object.fromEntries(
      Object.entries(latestPatch).filter(
        ([key, value]) =>
          !(Object.hasOwn(settingsPatch, key) && settingsValueMatches(value, settingsPatch[key])),
      ),
    )
    await set({ serverLastModified: lastModified })
    if (Object.keys(remainingPatch).length) {
      await set({ pendingSettingsPatch: remainingPatch })
    } else {
      await remove('pendingSettingsPatch')
    }
    await trace('settings.push.completed', {
      cycle,
      full,
      remainingKeys: Object.keys(remainingPatch),
      sentKeys: settingsKeys,
    })
  })
  return true
}

/**
 * Pull first then push any pending local changes.
 *
 * Pull failures preserve the reconciliation phase, while push failures preserve
 * the pending patch. Periodic sync retries both, and startup also retries an
 * incomplete reconciliation.
 */
function syncSettingsNow(reason) {
  return queueSync(() => runSettingsSync(reason))
}

async function runSettingsSync(reason) {
  const cycle = ++syncCycleSequence
  await trace('sync.started', { cycle, reason })
  const pullResult = await pullSettings(cycle)
  if (pullResult == 'failed') {
    await trace('sync.completed', { cycle, outcome: 'pull-failed', reason })
    return
  }

  if (pullResult == 'seed-server') {
    if (!(await pushSettings({ cycle, full: true, reason: 'seed-server' }))) {
      await trace('sync.completed', { cycle, outcome: 'seed-failed', reason })
      return
    }
    await set({ settingsSyncPhase: 'ready' })
  }

  const pushed = await pushSettings({ cycle, reason: 'after-pull' })
  await trace('sync.completed', {
    cycle,
    outcome: pushed ? 'completed' : 'push-failed',
    reason,
  })
}

async function refreshAccount() {
  const headers = await getHeaders()
  if (!headers) {
    await trace('account.refresh.skipped', { reason: 'no-linked-account' })
    return
  }

  let res
  const startedAt = Date.now()
  await trace('http.request', { endpoint: '/api/extension/account', method: 'GET' })
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/account`, { headers })
  } catch {
    await trace('http.failed', {
      durationMs: Date.now() - startedAt,
      endpoint: '/api/extension/account',
      method: 'GET',
      reason: 'network',
    })
    return
  }

  await trace('http.response', {
    durationMs: Date.now() - startedAt,
    endpoint: '/api/extension/account',
    method: 'GET',
    status: res.status,
  })

  if (res.status == 401) {
    await set({ syncError: 'auth' })
    await handleAccountUnlinked()
    return
  }
  if (!res.ok) return

  const { subscription } = await res.json()
  await set({ subscription })
  await trace('account.refresh.completed', { hasSubscription: subscription != null })
}

function resetAccountRefreshTimer() {
  chrome.alarms.create(ACCOUNT_REFRESH_ALARM, {
    periodInMinutes: CONFIG.accountRefreshIntervalMinutes,
  })
  trace('alarm.scheduled', {
    name: ACCOUNT_REFRESH_ALARM,
    periodInMinutes: CONFIG.accountRefreshIntervalMinutes,
  })
}

function resetPullTimer() {
  chrome.alarms.create(PULL_ALARM, { periodInMinutes: CONFIG.pullIntervalMinutes })
  trace('alarm.scheduled', { name: PULL_ALARM, periodInMinutes: CONFIG.pullIntervalMinutes })
}

function schedulePush() {
  const when = Date.now() + CONFIG.pushDebounceSeconds * 1000
  chrome.alarms.create(PUSH_ALARM, {
    when,
  })
  trace('alarm.scheduled', { name: PUSH_ALARM, when })
}
//#endregion

//#region Public API
/**
 * Registers settings writes and Pro sync listeners - must be called synchronously in the
 * background script so handlers are in place before queued events are
 * dispatched to it.
 * @param {Partial<typeof CONFIG>} config
 */
export function initSettingsSync(config = {}) {
  Object.assign(CONFIG, config)
  if (IS_PRO) trace('worker.started')

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type == SET_SETTINGS_MESSAGE) {
      const write = () => writeSettings(msg.settings, { replace: msg.replace === true })
      const task = IS_PRO && msg.replace ? queueSync(write) : write()
      task
        .then(async (queued) => {
          if (IS_PRO && queued && (await isSettingsSyncEnabled())) {
            resetPullTimer()
            schedulePush()
          }
          return {}
        })
        .then(sendResponse, (error) => sendResponse({ error: String(error.message || error) }))
      return true
    }
    if (!IS_PRO) return

    if (msg.type == GET_DEBUG_TRACE_MESSAGE) {
      return keepMessageChannelOpen(getTrace(), sendResponse)
    }
    if (msg.type == CLEAR_DEBUG_TRACE_MESSAGE) {
      return keepMessageChannelOpen(clearTrace(), sendResponse)
    }
    if (msg.type == OPEN_APP_MESSAGE) {
      const path = typeof msg.path == 'string' && msg.path.startsWith('/') ? msg.path : '/'
      const url = new URL(path, CONFIG.apiBase)
      if (location.protocol == 'safari-web-extension:') {
        url.searchParams.set('source', 'safari-extension')
      }
      chrome.tabs.create({ url: url.href })
    }
    if (msg.type == ACCOUNT_LINKED_MESSAGE) {
      return keepMessageChannelOpen(
        trace('message.received', { type: msg.type })
          .then(() => handleAccountLinked(msg))
          .then(() => ({})),
        sendResponse,
      )
    }
    if (msg.type == ACCOUNT_UNLINKED_MESSAGE) {
      return keepMessageChannelOpen(
        trace('message.received', { type: msg.type })
          .then(handleAccountUnlinked)
          .then(() => ({})),
        sendResponse,
      )
    }
    if (msg.type == SYNC_SETTINGS_CHANGED_MESSAGE) {
      return keepMessageChannelOpen(
        trace('message.received', { enabled: msg.enabled !== false, type: msg.type }).then(() =>
          msg.enabled === false ? disableSettingsSync() : enableSettingsSync(),
        ),
        sendResponse,
      )
    }
  })

  if (!IS_PRO) return
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == ACCOUNT_REFRESH_ALARM) {
      runBackgroundTask(trace('alarm.fired', { name: alarm.name }).then(refreshAccount))
    }
    if (alarm.name == PULL_ALARM) {
      runBackgroundTask(
        trace('alarm.fired', { name: alarm.name }).then(() => syncSettingsNow('pull-alarm')),
      )
    }
    if (alarm.name == PUSH_ALARM) {
      runBackgroundTask(
        trace('alarm.fired', { name: alarm.name }).then(() =>
          queueSync(() => pushSettings({ reason: 'push-alarm' })),
        ),
      )
    }
  })
}

export async function startSync() {
  const {
    settingsSyncPhase = 'ready',
    subscription,
    syncSettings = true,
    token,
  } = await get(['settingsSyncPhase', 'subscription', 'syncSettings', 'token'])

  await trace('sync.startup', {
    hasSubscription: subscription !== undefined,
    hasToken: Boolean(token),
    phase: settingsSyncPhase,
    syncSettings,
  })

  if (!token) return

  if (!syncSettings) {
    if (subscription === undefined) {
      await refreshAccount()
    }
    await disableSettingsSync()
    return
  }

  await clearAlarm(ACCOUNT_REFRESH_ALARM)

  const pullAlarm = await getAlarm(PULL_ALARM)
  // Pull immediately when reconciliation is incomplete, pulls haven't been
  // scheduled yet, or account details need to be populated by the response.
  if (settingsSyncPhase != 'ready' || !pullAlarm || subscription === undefined) {
    await syncSettingsNow('startup')
    resetPullTimer()
  } else {
    await trace('sync.startup.idle', { reason: 'pull-scheduled-and-account-current' })
  }
}
//#endregion
