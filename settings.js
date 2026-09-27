//#region Constants
export const OPEN_APP_MESSAGE = 'OPEN_APP'
export const SERVER_ORIGIN = (() => {
  const manifest = chrome.runtime.getManifest()
  const serverPermissions =
    manifest.manifest_version === 2 ? manifest.permissions : manifest.host_permissions
  return serverPermissions.includes('http://localhost:5173/*')
    ? 'http://localhost:5173'
    : 'https://pro.soitis.dev'
})()
export const ACCOUNT_LINKED_MESSAGE = 'ACCOUNT_LINKED'
export const ACCOUNT_UNLINKED_MESSAGE = 'ACCOUNT_UNLINKED'
export const CLEAR_DEBUG_TRACE_MESSAGE = 'CLEAR_DEBUG_TRACE'
export const GET_DEBUG_TRACE_MESSAGE = 'GET_DEBUG_TRACE'
export const SYNC_SCHEDULE_PUSH_MESSAGE = 'SYNC_SCHEDULE_PUSH'
export const SYNC_SETTINGS_CHANGED_MESSAGE = 'SYNC_SETTINGS_CHANGED'
//#endregion

export function isTargetExtensionMessage(data, runtimeId, extensionsProId) {
  return (
    data != null &&
    typeof data == 'object' &&
    data.runtimeId === runtimeId &&
    data.extensionId === extensionsProId
  )
}

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
        resolve(undefined)
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
        resolve(undefined)
      }
    })
  })
}
//#endregion

//#region Settings functions
export async function setSettings(changes) {
  const {
    pendingSettingsPatch = {},
    settings = {},
    syncSettings = true,
    token,
  } = await get(['pendingSettingsPatch', 'settings', 'syncSettings', 'token'])

  await set({
    ...(syncSettings && token
      ? {
          pendingSettingsPatch: {
            ...pendingSettingsPatch,
            ...changes,
          },
        }
      : {}),
    settings: {
      ...settings,
      ...changes,
    },
  })

  if (syncSettings && token) {
    schedulePush()
  }
}

export function schedulePush() {
  chrome.runtime.sendMessage({ type: SYNC_SCHEDULE_PUSH_MESSAGE }).catch(() => {})
}
//#endregion
