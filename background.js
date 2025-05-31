const isSafari = location.protocol.startsWith('safari-web-extension:')

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

function updateBrowserActionIcon(enabled) {
  chrome.browserAction.setIcon({path: enabled ? enabledIcons : disabledIcons})
}

// Update browser action icon to reflect enabled state
if (!isSafari) {
  chrome.storage.local.get({enabled: true}, ({enabled}) => {
    updateBrowserActionIcon(enabled)
  })

  chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.enabled) {
      updateBrowserActionIcon(changes.enabled.newValue)
    }
  })
}