const isSafari = location.protocol.startsWith('safari-web-extension:')

// DEV MODE: Clear storage on every extension reload for fresh testing
// TODO: Remove this before production release
console.log('[CPFT Background] Clearing storage for dev mode...')
chrome.storage.local.clear(() => {
  console.log('[CPFT Background] Storage cleared - fresh start')
})

const enabledIcons = {
  16: 'icons/icon16.png',
  32: 'icons/icon32.png',
  48: 'icons/icon48.png',
  64: 'icons/icon64.png',
  96: 'icons/icon96.png',
  128: 'icons/icon128.png',
}

const disabledIcons = {
  16: 'icons/icon16-disabled.png',
  32: 'icons/icon32-disabled.png',
  48: 'icons/icon48-disabled.png',
  64: 'icons/icon64-disabled.png',
  96: 'icons/icon96-disabled.png',
  128: 'icons/icon128-disabled.png',
}

function updateToolbarIcon(enabled) {
  let title = chrome.i18n.getMessage(enabled ? 'extensionName' : 'extensionNameDisabled')
  if (chrome.runtime.getManifest().manifest_version == 3) {
    chrome.action.setTitle({title})
    if (!isSafari) {
      chrome.action.setIcon({path: enabled ? enabledIcons : disabledIcons})
    } else {
      chrome.action.setBadgeText({text: enabled ? '' : '⏻'})
    }
  } else {
    chrome.browserAction.setTitle({title})
    chrome.browserAction.setIcon({path: enabled ? enabledIcons : disabledIcons})
  }
}

// Update browser action icon to reflect enabled state
chrome.storage.local.get({enabled: true}, ({enabled}) => {
  updateToolbarIcon(enabled)
})

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateToolbarIcon(changes.enabled.newValue)
  }
})