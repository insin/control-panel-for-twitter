//#region Constants
const IS_SAFARI = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)
/**
 * Config keys whose changes should be passed to the page script.
 * @type {import("./types").StoredConfigKey[]}
 */
const PAGE_SCRIPT_CONFIG_KEYS = ['debug', 'debugLogTimelineStats', 'enabled', 'settings']
/** @type {Set<string>} */
const PAGE_SCRIPT_CONFIG_KEYSET = new Set(PAGE_SCRIPT_CONFIG_KEYS)
const TWITTER_BLUE = 'rgb(29, 155, 240)'
const TWITTER_LOGO_PATH = 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z'
const X_LOGO_PATH = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'
//#endregion

//#region Functions
function error(...messages) {
  console.error('[content]', ...messages)
}

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
//#endregion

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

// TODO Replace with BroadcastChannel
/** @type {HTMLScriptElement} */
let $settings

// Get initial config and inject it and the page script
get({
  debug: false,
  debugLogTimelineStats: false,
  settings: {},
}).then((storedConfig) => {
  $settings = document.createElement('script')
  $settings.type = 'text/json'
  $settings.id = 'cpftSettings'
  document.documentElement.appendChild($settings)
  $settings.innerText = JSON.stringify(storedConfig)

  let $pageScript = document.createElement('script')
  $pageScript.src = chrome.runtime.getURL('script.js')
  /** @this {HTMLScriptElement} */
  $pageScript.onload = function() {
    this.remove()
  }
  document.documentElement.appendChild($pageScript)
  chrome.storage.onChanged.addListener(onStorageChanged)
})


/**
 * Pass relevant storage changes to the page script.
 * @param {{[key: string]: chrome.storage.StorageChange}} storageChanges
 */
function onStorageChanged(storageChanges) {
  if (storageChanges.enabled) localStorage.cpftEnabled = storageChanges.enabled.newValue
  if (storageChanges.settings && storageChanges.settings.newValue?.revertXBranding)
    localStorage.cpftRevertXBranding = storageChanges.settings.newValue.revertXBranding
  let changes = Object.fromEntries(
    Object.entries(storageChanges)
      .filter(([key]) => PAGE_SCRIPT_CONFIG_KEYSET.has(key))
      .map(([key, {newValue}]) => [key, newValue])
  )
  if (Object.keys(changes).length > 0) {
    $settings.innerText = JSON.stringify(changes)
  }
}

// Store settings changes from the page script
window.addEventListener('message', async (event) => {
  if (event.source !== window) return
  if (event.data.type == 'cpft_config_change' && event.data.changes) {
    /** @type {Partial<import("./types").StoredConfig>} */
    let changes = event.data.changes
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
      error('error merging settings change from page script', e)
    }

    chrome.storage.onChanged.removeListener(onStorageChanged)
    try {
      await set(configToStore)
    } catch(e) {
      error('error storing settings change from page script', e)
    } finally {
      chrome.storage.onChanged.addListener(onStorageChanged)
    }
  }
})