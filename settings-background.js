import {
  ACCOUNT_LINKED_MESSAGE,
  ACCOUNT_UNLINKED_MESSAGE,
  CLEAR_DEBUG_TRACE_MESSAGE,
  GET_DEBUG_TRACE_MESSAGE,
  get,
  OPEN_APP_MESSAGE,
  remove,
  SYNC_SCHEDULE_PUSH_MESSAGE,
  SYNC_SETTINGS_CHANGED_MESSAGE,
  set,
} from './settings.js'
import { clearTrace, getTrace, trace } from './trace-background.js'

const CONFIG = {
  accountRefreshIntervalMinutes: 60,
  apiBase: 'https://pro.soitis.dev',
  pullIntervalMinutes: 10,
  // TODO If we need a shorter delay, use setTimeout with an alarm as a backup,
  //      in case the service worker is killed before the timeout fires.
  pushDebounceSeconds: 30,
}

//#region Constants
export const ACCOUNT_REFRESH_ALARM = 'ACCOUNT_REFRESH'
export const PULL_ALARM = 'SETTINGS_PULL'
export const PUSH_ALARM = 'SETTINGS_PUSH'
//#endregion

//#region Utilities
let syncCycleSequence = 0

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

function settingsValueMatches(a, b) {
  return JSON.stringify(a) == JSON.stringify(b)
}
//#endregion

//#region Functions
async function applyServerSettings(settings, lastModified) {
  const { pendingSettingsPatch = {} } = await get('pendingSettingsPatch')

  await set({
    serverLastModified: lastModified,
    settings: {
      ...settings,
      ...pendingSettingsPatch,
    },
  })
}

async function disableSettingsSync() {
  await trace('sync.disabled')
  // Settings changes made while sync is off must remain local
  await Promise.all([chrome.alarms.clear(PULL_ALARM), chrome.alarms.clear(PUSH_ALARM)])
  await trace('alarms.cleared', { names: [PULL_ALARM, PUSH_ALARM], reason: 'sync-disabled' })
  await remove('pendingSettingsPatch')

  // Keep subscription details fresh while sync is off
  const { token } = await get('token')
  if (token) {
    const alarm = await chrome.alarms.get(ACCOUNT_REFRESH_ALARM)
    if (!alarm) resetAccountRefreshTimer()
  }
}

async function enableSettingsSync({ phase = 'replace-from-server', reason = 'sync-enabled' } = {}) {
  const { token } = await get('token')
  await trace('sync.enabled', { hasToken: Boolean(token), phase, reason })
  if (!token) {
    await Promise.all([
      chrome.alarms.clear(ACCOUNT_REFRESH_ALARM),
      chrome.alarms.clear(PULL_ALARM),
      chrome.alarms.clear(PUSH_ALARM),
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
  await chrome.alarms.clear(ACCOUNT_REFRESH_ALARM)

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

async function handleAccountLinked() {
  await trace('account.linked')
  await remove([
    'lastSyncTime',
    'pendingSettingsPatch',
    'serverLastModified',
    'settingsSyncPhase',
    'subscription',
    'syncError',
  ])

  if (await isSettingsSyncEnabled()) {
    await enableSettingsSync({ phase: 'seed-if-missing', reason: 'account-linked' })
  } else {
    await refreshAccount()
    await disableSettingsSync()
  }
}

async function handleAccountUnlinked() {
  await trace('account.unlinked')
  await Promise.all([
    chrome.alarms.clear(ACCOUNT_REFRESH_ALARM),
    chrome.alarms.clear(PULL_ALARM),
    chrome.alarms.clear(PUSH_ALARM),
  ])
  await trace('alarms.cleared', {
    names: [ACCOUNT_REFRESH_ALARM, PULL_ALARM, PUSH_ALARM],
    reason: 'account-unlinked',
  })
  await remove([
    'accountEmail',
    'lastSyncTime',
    'pendingSettingsPatch',
    'serverLastModified',
    'settingsSyncPhase',
    'subscription',
    'syncError',
    'token',
  ])
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

  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return 'failed'
  }
  if (!(await isSettingsSyncEnabled())) {
    await trace('settings.pull.skipped', { cycle, reason: 'disabled-during-request' })
    return 'failed'
  }

  await remove('syncError')
  await set({ lastSyncTime: Date.now() })

  const { hasSettings, settings, lastModified, subscription } = await res.json()
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
      // An empty server snapshot means default settings, but we should preserve
      // any changes made immediately after sync was re-enabled.
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

  const { pendingSettingsPatch = {}, settings = {} } = await get([
    'pendingSettingsPatch',
    'settings',
  ])
  const settingsPatch = full ? settings : pendingSettingsPatch

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
    method: 'PATCH',
    reason,
  })
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/settings`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        settings: settingsPatch,
      }),
    })
  } catch {
    await set({ syncError: 'network' })
    await trace('http.failed', {
      cycle,
      durationMs: Date.now() - startedAt,
      endpoint: '/api/extension/settings',
      method: 'PATCH',
      reason: 'network',
    })
    return false
  }

  await trace('http.response', {
    cycle,
    durationMs: Date.now() - startedAt,
    endpoint: '/api/extension/settings',
    method: 'PATCH',
    status: res.status,
  })

  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return false
  }

  await remove('syncError')
  await set({ lastSyncTime: Date.now() })

  // New server version timestamp
  const { lastModified } = await res.json()

  const { pendingSettingsPatch: latestPendingSettingsPatch = {} } =
    await get('pendingSettingsPatch')
  const remainingPendingSettingsPatch = Object.fromEntries(
    Object.entries(latestPendingSettingsPatch).filter(([key, value]) => {
      return !(Object.hasOwn(settingsPatch, key) && settingsValueMatches(value, settingsPatch[key]))
    }),
  )
  if (Object.keys(remainingPendingSettingsPatch).length > 0) {
    await set({
      serverLastModified: lastModified,
      pendingSettingsPatch: remainingPendingSettingsPatch,
    })
  } else {
    await set({ serverLastModified: lastModified })
    await remove('pendingSettingsPatch')
  }
  await trace('settings.push.completed', {
    cycle,
    full,
    remainingKeys: Object.keys(remainingPendingSettingsPatch),
    sentKeys: settingsKeys,
  })
  return true
}

/**
 * Pull first then push any pending local changes.
 *
 * Pull failures preserve the reconciliation phase; push failures preserve the
 * pending patch. Periodic sync retries both, and startup also retries an
 * incomplete reconciliation.
 */
async function syncSettingsNow(reason) {
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
 * Registers sync event listeners - must be called synchronously in the
 * background script so handlers are in place before queued events are
 * dispatched to it.
 * @param {Partial<typeof CONFIG>} config
 */
export function initSettingsSync(config = {}) {
  Object.assign(CONFIG, config)
  trace('worker.started')

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type == GET_DEBUG_TRACE_MESSAGE) {
      return keepMessageChannelOpen(getTrace(), sendResponse)
    }
    if (msg.type == CLEAR_DEBUG_TRACE_MESSAGE) {
      return keepMessageChannelOpen(clearTrace(), sendResponse)
    }
    if (msg.type == OPEN_APP_MESSAGE) {
      const path = typeof msg.path == 'string' && msg.path.startsWith('/') ? msg.path : '/'
      chrome.tabs.create({ url: new URL(path, CONFIG.apiBase).href })
    }
    if (msg.type == ACCOUNT_LINKED_MESSAGE) {
      return keepMessageChannelOpen(
        trace('message.received', { type: msg.type }).then(handleAccountLinked),
        sendResponse,
      )
    }
    if (msg.type == ACCOUNT_UNLINKED_MESSAGE) {
      return keepMessageChannelOpen(
        trace('message.received', { type: msg.type }).then(handleAccountUnlinked),
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
    if (msg.type == SYNC_SCHEDULE_PUSH_MESSAGE) {
      return keepMessageChannelOpen(
        trace('message.received', { type: msg.type }).then(() =>
          isSettingsSyncEnabled().then((enabled) => {
            if (!enabled) return
            resetPullTimer()
            schedulePush()
          }),
        ),
        sendResponse,
      )
    }
  })

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
          pushSettings({ reason: 'push-alarm' }),
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

  if (!token) {
    await handleAccountUnlinked()
    return
  }

  if (!syncSettings) {
    if (subscription === undefined) {
      await refreshAccount()
    }
    await disableSettingsSync()
    return
  }

  await chrome.alarms.clear(ACCOUNT_REFRESH_ALARM)

  const pullAlarm = await chrome.alarms.get(PULL_ALARM)
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
