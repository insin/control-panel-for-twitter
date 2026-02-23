//#region Constants
const IS_SAFARI = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)
/**
 * Config keys which should be passed to the page script.
 * @type {import("./types").StoredConfigKey[]}
 */
const PAGE_SCRIPT_CONFIG_KEYS = ['debug', 'debugLogGetElementStats', 'debugLogTimelineStats', 'enabled', 'settings']
/** @type {Set<string>} */
const PAGE_SCRIPT_CONFIG_KEYSET = new Set(PAGE_SCRIPT_CONFIG_KEYS)
const TWITTER_BLUE = 'rgb(29, 155, 240)'
const TWITTER_LOGO_PATH = 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'
const X_LOGO_PATH = 'M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z'
//#endregion

//#region Variables
/** @type {BroadcastChannel} */
let channel
//#endregion

//#region Functions
// Can't import this from storage.js in a content script
function get(keys) {
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

/**
 * @param {chrome.storage.StorageChange} settingsChange
 * @param {import("./types").UserSettingsKey} key
 */
function hasSettingChanged(settingsChange, key) {
  return (
    settingsChange.newValue &&
    Object.hasOwn(settingsChange.newValue, key) && (
    !settingsChange.oldValue ||
    !Object.hasOwn(settingsChange.oldValue, key) ||
    settingsChange.oldValue[key] != settingsChange.newValue[key]
  ))
}

/**
 * Pass relevant storage changes to the page script.
 * @param {{[key: string]: chrome.storage.StorageChange}} storageChanges
 */
function onStorageChanged(storageChanges) {
  if (storageChanges.enabled) {
    localStorage.cpftEnabled = storageChanges.enabled.newValue
  }
  if (storageChanges.settings && hasSettingChanged(storageChanges.settings, 'revertXBranding')) {
    localStorage.cpftRevertXBranding = storageChanges.settings.newValue.revertXBranding
  }

  /** @type {Partial<import("./types").StoredConfig>} */
  let config = Object.fromEntries(
    Object.entries(storageChanges)
      .filter(([key]) => PAGE_SCRIPT_CONFIG_KEYSET.has(key))
      .map(([key, {newValue}]) => [key, newValue])
  )

  // Ignore storage changes which aren't relevant to the page script
  if (Object.keys(config).length == 0) return

  channel.postMessage({type: 'change', config})
}

// Can't import this from storage.js in a content script
function set(keys) {
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

/** @param {MessageEvent<Partial<import("./types").StoredConfig>>} message */
async function storeConfigChangesFromPageScript({data: changes}) {
  let configToStore = {}
  if (changes.version) {
    configToStore.version = changes.version
  }
  try {
    if (changes.settings) {
      let {settings} = await get({settings: {}})
      configToStore.settings = {...settings, ...changes.settings}
    }
  } catch(e) {
    console.error('[content] error merging settings change from page script', e)
  }

  chrome.storage.local.onChanged.removeListener(onStorageChanged)
  try {
    await set(configToStore)
  } catch(e) {
    console.error('[content] error storing settings change from page script', e)
  } finally {
    chrome.storage.local.onChanged.addListener(onStorageChanged)
  }
}
//#endregion

//#region Main
// Replace the X logo on initial load before the page script runs
if (localStorage.cpftEnabled != 'false' && localStorage.cpftRevertXBranding != 'false') {
  if (!IS_SAFARI) {
    let $style = document.createElement('style')
    $style.id = 'cpftLoading'
    $style.textContent = `
      svg path[d="${X_LOGO_PATH}"] {
        fill: ${TWITTER_BLUE};
        d: path("${TWITTER_LOGO_PATH}");
      }
    `
    document.documentElement.append($style)
  } else {
    // XXX This is causing the Safari page script to wait for the full 5 seconds
    let startTime = Date.now()
    new MutationObserver((_, observer) => {
      let $logoPath = document.querySelector(`svg path[d="${X_LOGO_PATH}"]`)
      if ($logoPath) {
        $logoPath.setAttribute('d', TWITTER_LOGO_PATH)
        $logoPath.setAttribute('fill', TWITTER_BLUE)
        observer.disconnect()
      }
      else if (Date.now() - startTime > 1000) {
        observer.disconnect()
      }
    }).observe(document.documentElement, {childList: true, subtree: true})
  }
}

window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data.type != 'init' || !event.data.channelName) return
  channel = new BroadcastChannel(event.data.channelName)
  channel.addEventListener('message', storeConfigChangesFromPageScript)
  chrome.storage.local.get((storedConfig) => {
    let config = Object.fromEntries(
      Object.entries(storedConfig).filter(([key]) => PAGE_SCRIPT_CONFIG_KEYSET.has(key))
    )
    chrome.storage.local.onChanged.addListener(onStorageChanged)
    channel.postMessage({type: 'initial', config})
  })
})
//#endregion