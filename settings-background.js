import {
  ACCOUNT_LINKED_MESSAGE,
  ACCOUNT_UNLINKED_MESSAGE,
  get,
  OPEN_APP_MESSAGE,
  remove,
  set,
  SYNC_SCHEDULE_PUSH_MESSAGE,
  SYNC_SETTINGS_CHANGED_MESSAGE,
} from './settings.js'

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
/**
 * @param {Promise<any>} task
 * @param {(response?: any) => void} sendResponse
 * @returns {true}
 */
function keepMessageChannelOpen(task, sendResponse) {
  runBackgroundTask(task).then(() => sendResponse())
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
  // Settings changes made while sync is off must remain local
  await Promise.all([chrome.alarms.clear(PULL_ALARM), chrome.alarms.clear(PUSH_ALARM)])
  await remove('pendingSettingsPatch')

  // Keep subscription details fresh while sync is off
  const { token } = await get('token')
  if (token) {
    const alarm = await chrome.alarms.get(ACCOUNT_REFRESH_ALARM)
    if (!alarm) resetAccountRefreshTimer()
  }
}

async function enableSettingsSync({ phase = 'replace-from-server' } = {}) {
  const { token } = await get('token')
  if (!token) {
    await Promise.all([
      chrome.alarms.clear(ACCOUNT_REFRESH_ALARM),
      chrome.alarms.clear(PULL_ALARM),
      chrome.alarms.clear(PUSH_ALARM),
    ])
    return
  }

  // Keep the intended reconciliation mode across failed requests and MV3
  // service worker restarts.
  await set({ settingsSyncPhase: phase })

  // Subscription details are refreshed when pulling settings
  await chrome.alarms.clear(ACCOUNT_REFRESH_ALARM)

  // Resume pulling with an initial immediate pull
  await syncSettingsNow()
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
  await remove([
    'lastSyncTime',
    'pendingSettingsPatch',
    'serverLastModified',
    'settingsSyncPhase',
    'subscription',
    'syncError',
  ])

  if (await isSettingsSyncEnabled()) {
    await enableSettingsSync({ phase: 'seed-if-missing' })
  } else {
    await refreshAccount()
    await disableSettingsSync()
  }
}

async function handleAccountUnlinked() {
  await Promise.all([
    chrome.alarms.clear(ACCOUNT_REFRESH_ALARM),
    chrome.alarms.clear(PULL_ALARM),
    chrome.alarms.clear(PUSH_ALARM),
  ])
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
async function pullSettings() {
  if (!(await isSettingsSyncEnabled())) return 'failed'

  const headers = await getHeaders()
  if (!headers) return 'failed'

  let res
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/settings`, { headers })
  } catch {
    await set({ syncError: 'network' })
    return 'failed'
  }

  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return 'failed'
  }
  if (!(await isSettingsSyncEnabled())) return 'failed'

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
      return 'seed-server'
    } else if (settingsSyncPhase == 'replace-from-server') {
      // An empty server snapshot means default settings, but we should preserve
      // any changes made immediately after sync was re-enabled.
      const { pendingSettingsPatch = {} } = await get('pendingSettingsPatch')
      await set({ settings: pendingSettingsPatch })
    }
    await set({ settingsSyncPhase: 'ready' })
    return 'reconciled'
  }

  if (settingsSyncPhase != 'ready' || lastModified > serverLastModified) {
    await applyServerSettings(settings, lastModified)
  }
  await set({ settingsSyncPhase: 'ready' })
  return 'reconciled'
}

/**
 * @param {{ full?: boolean }} [options]
 * @returns `true` when the server accepted the settings or there was nothing to
 * push.
 */
async function pushSettings({ full = false } = {}) {
  if (!(await isSettingsSyncEnabled())) return false

  const headers = await getHeaders()
  if (!headers) return false

  const { pendingSettingsPatch = {}, settings = {} } = await get([
    'pendingSettingsPatch',
    'settings',
  ])
  const settingsPatch = full ? settings : pendingSettingsPatch

  if (!full && Object.keys(settingsPatch).length == 0) return true

  let res
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
    return false
  }

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
  return true
}

/**
 * Pull first then push any pending local changes.
 *
 * Pull failures preserve the reconciliation phase; push failures preserve the
 * pending patch. Periodic sync retries both, and startup also retries an
 * incomplete reconciliation.
 */
async function syncSettingsNow() {
  const pullResult = await pullSettings()
  if (pullResult == 'failed') return

  if (pullResult == 'seed-server') {
    if (!(await pushSettings({ full: true }))) return
    await set({ settingsSyncPhase: 'ready' })
  }

  await pushSettings()
}

async function refreshAccount() {
  const headers = await getHeaders()
  if (!headers) return

  let res
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/account`, { headers })
  } catch {
    return
  }

  if (res.status == 401) {
    await set({ syncError: 'auth' })
    await handleAccountUnlinked()
    return
  }
  if (!res.ok) return

  const { subscription } = await res.json()
  await set({ subscription })
}

function resetAccountRefreshTimer() {
  chrome.alarms.create(ACCOUNT_REFRESH_ALARM, {
    periodInMinutes: CONFIG.accountRefreshIntervalMinutes,
  })
}

function resetPullTimer() {
  chrome.alarms.create(PULL_ALARM, { periodInMinutes: CONFIG.pullIntervalMinutes })
}

function schedulePush() {
  chrome.alarms.create(PUSH_ALARM, {
    when: Date.now() + CONFIG.pushDebounceSeconds * 1000,
  })
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

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type == OPEN_APP_MESSAGE) {
      const path = typeof msg.path == 'string' && msg.path.startsWith('/') ? msg.path : '/'
      chrome.tabs.create({ url: new URL(path, CONFIG.apiBase).href })
    }
    if (msg.type == ACCOUNT_LINKED_MESSAGE) {
      return keepMessageChannelOpen(handleAccountLinked(), sendResponse)
    }
    if (msg.type == ACCOUNT_UNLINKED_MESSAGE) {
      return keepMessageChannelOpen(handleAccountUnlinked(), sendResponse)
    }
    if (msg.type == SYNC_SETTINGS_CHANGED_MESSAGE) {
      return keepMessageChannelOpen(
        msg.enabled === false ? disableSettingsSync() : enableSettingsSync(),
        sendResponse,
      )
    }
    if (msg.type == SYNC_SCHEDULE_PUSH_MESSAGE) {
      return keepMessageChannelOpen(
        isSettingsSyncEnabled().then((enabled) => {
          if (!enabled) return
          resetPullTimer()
          schedulePush()
        }),
        sendResponse,
      )
    }
  })

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == ACCOUNT_REFRESH_ALARM) runBackgroundTask(refreshAccount())
    if (alarm.name == PULL_ALARM) runBackgroundTask(syncSettingsNow())
    if (alarm.name == PUSH_ALARM) runBackgroundTask(pushSettings())
  })
}

export async function startSync() {
  const {
    settingsSyncPhase = 'ready',
    subscription,
    syncSettings = true,
    token,
  } = await get(['settingsSyncPhase', 'subscription', 'syncSettings', 'token'])

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
    await syncSettingsNow()
    resetPullTimer()
  }
}
//#endregion
