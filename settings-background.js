import { OPEN_APP_MESSAGE, SYNC_RESET_MESSAGE } from './settings.js'

//#region Constants
const CONFIG = {
  apiBase: 'https://pro.soitis.dev',
  pullIntervalMinutes: 10,
  // TODO If we need a shorter delay, use setTimeout with an alarm as a backup,
  //      in case the service worker is killed before the timeout fires.
  pushDebounceSeconds: 30,
}
const PULL_ALARM = 'SETTINGS_PULL'
const PUSH_ALARM = 'SETTINGS_PUSH'
//#endregion

//#region Utilities
//#region Async chrome.storage.local wrappers for Firefox MV2
export function get(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result)
      }
    })
  })
}

export function remove(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

export function set(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}
//#endregion

//#region Functions
async function applyServerSettings(settings, lastModified) {
  const { pendingSettingsPatch = {} } = await get('pendingSettingsPatch')

  await set({
    // Records the server version we have applied locally; pending local edits
    // are overlaid below and remain unsynced until a push acknowledges them.
    ...(lastModified != null && { serverLastModified: lastModified }),
    settings: {
      ...settings,
      ...pendingSettingsPatch,
    },
  })
}

async function getHeaders() {
  const { token } = await get('token')
  if (!token) return null
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

async function handleSettingsErrorResponse(res) {
  if (res.status == 401) {
    await set({ syncError: 'auth' })
    await remove('token')
  } else if (res.status == 402) {
    const { subscription } = await res.json()
    await set({ syncError: 'subscription_inactive', subscription })
    await remove('token')
  } else if (res.status == 429) {
    await set({ syncError: 'rate_limited' })
  } else if (res.status >= 500) {
    await set({ syncError: 'server_error' })
  } else {
    await set({ syncError: 'bad_request' })
  }
}

/**
 * @param {{ pushIfMissing?: boolean }} [options]
 */
async function pullSettings({ pushIfMissing = false } = {}) {
  const headers = await getHeaders()
  if (!headers) return

  let res
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/settings`, { headers })
  } catch {
    await set({ syncError: 'network' })
    return
  }

  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return
  }

  await remove('syncError')

  const { hasSettings, settings, lastModified, subscription } = await res.json()
  const { serverLastModified = 0 } = await get('serverLastModified')

  if (subscription !== undefined) {
    await set({ subscription })
  }

  if (!hasSettings) {
    if (pushIfMissing) {
      // Server has no settings yet — push whatever we have locally.
      await pushSettings({ full: true })
    }
    return
  }

  // Only apply server settings if they are newer than the last server version
  // we accepted. Equal/older pulls are subscription/status refreshes only.
  if (lastModified > serverLastModified) {
    await applyServerSettings(settings, lastModified)
  }
}

/**
 * @param {{ full?: boolean }} [options]
 */
async function pushSettings({ full = false } = {}) {
  const headers = await getHeaders()
  if (!headers) return

  const { pendingSettingsPatch = {}, settings = {} } = await get([
    'pendingSettingsPatch',
    'settings',
  ])
  const settingsPatch = full ? settings : pendingSettingsPatch

  if (!full && Object.keys(settingsPatch).length == 0) return

  let res
  try {
    res = await fetch(`${CONFIG.apiBase}/api/extension/settings`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        extensionVersion: chrome.runtime.getManifest().version,
        settings: settingsPatch,
      }),
    })
  } catch {
    await set({ syncError: 'network' })
    return
  }

  if (!res.ok) {
    await handleSettingsErrorResponse(res)
    return
  }

  await remove('syncError')

  // This is the new server version created by our accepted patch. A null
  // timestamp means the server dropped the whole patch as invalid/unknown.
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
      // Some edits happened while this push was in flight; keep them pending
      // but advance the server version if the server actually changed.
      ...(lastModified != null && { serverLastModified: lastModified }),
      pendingSettingsPatch: remainingPendingSettingsPatch,
    })
  } else {
    // No pending edits remain, so this timestamp becomes the baseline used to
    // decide whether future pulls contain newer settings.
    if (lastModified != null) {
      await set({ serverLastModified: lastModified })
    }
    await remove('pendingSettingsPatch')
  }
}

function resetPullTimer() {
  chrome.alarms.create(PULL_ALARM, { periodInMinutes: CONFIG.pullIntervalMinutes })
}

function schedulePush() {
  chrome.alarms.create(PUSH_ALARM, {
    when: Date.now() + CONFIG.pushDebounceSeconds * 1000,
  })
}

function settingsValueMatches(a, b) {
  return JSON.stringify(a) == JSON.stringify(b)
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

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type == OPEN_APP_MESSAGE) {
      chrome.tabs.create({ url: CONFIG.apiBase })
    }
    if (msg.type == SYNC_RESET_MESSAGE) {
      resetPullTimer()
      schedulePush()
    }
  })

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == PULL_ALARM) pullSettings()
    if (alarm.name == PUSH_ALARM) pushSettings()
  })
}

/**
 * Syncs if we've never successfully synced and creates the pull alarm.
 */
export async function startSync() {
  const { serverLastModified } = await get('serverLastModified')

  if (serverLastModified === undefined) {
    await pullSettings({ pushIfMissing: true })
  }

  const existing = await chrome.alarms.get(PULL_ALARM)
  if (!existing) {
    chrome.alarms.create(PULL_ALARM, { periodInMinutes: CONFIG.pullIntervalMinutes })
  }
}
//#endregion
