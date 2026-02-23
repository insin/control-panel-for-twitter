import { crossesVersionThreshold } from './ext-shared.js'
import { runSettingsMigrations } from './migrations.js'
import { get, SERVER_ORIGIN, set } from './settings.js'
import { initSettingsSync, startSync } from './settings-background.js'

//#region Constants
const DISABLED_ICONS = {
  16: 'icons/icon16-disabled.png',
  32: 'icons/icon32-disabled.png',
  48: 'icons/icon48-disabled.png',
  64: 'icons/icon64-disabled.png',
  96: 'icons/icon96-disabled.png',
  128: 'icons/icon128-disabled.png',
}

const ENABLED_ICONS = {
  16: 'icons/icon16.png',
  32: 'icons/icon32.png',
  48: 'icons/icon48.png',
  64: 'icons/icon64.png',
  96: 'icons/icon96.png',
  128: 'icons/icon128.png',
}

const IS_SAFARI = location.protocol.startsWith('safari-web-extension:')
//#endregion

//#region Functions
function updateToolbarIcon(enabled) {
  const title = chrome.i18n.getMessage(enabled ? 'extensionName' : 'extensionNameDisabled')
  if (chrome.runtime.getManifest().manifest_version == 3) {
    chrome.action.setTitle({ title })
    if (!IS_SAFARI) {
      chrome.action.setIcon({ path: enabled ? ENABLED_ICONS : DISABLED_ICONS })
    } else {
      chrome.action.setBadgeText({ text: enabled ? '' : '⏻' })
    }
  } else {
    chrome.browserAction.setTitle({ title })
    chrome.browserAction.setIcon({ path: enabled ? ENABLED_ICONS : DISABLED_ICONS })
  }
}
//#endregion

//#region Main
async function main() {
  const current = chrome.runtime.getManifest().version
  const { extensionVersion, settings } = await get(['extensionVersion', 'settings'])
  // `extensionVersion` is new in v5, so an existing `settings` object means
  // this browser has already crossed the top-level-settings migration boundary.
  const previous =
    typeof extensionVersion == 'string' ? extensionVersion : settings != null ? current : '0'

  await runSettingsMigrations(previous, current)
  await set({ extensionVersion: current })
  await startSync()
}

initSettingsSync({ apiBase: SERVER_ORIGIN })
main().catch((error) => {
  console.error('[background]', error)
})

chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  updateToolbarIcon(enabled)
})

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason == 'install') {
    chrome.tabs.create({
      url: 'https://soitis.dev/control-panel-for-twitter/welcome',
    })
  } else if (details.reason == 'update') {
    const previous = details.previousVersion
    const current = chrome.runtime.getManifest().version
    const significantVersions = [crossesVersionThreshold(previous, current, '5') && '5'].filter(
      Boolean,
    )
    if (significantVersions.length > 0) {
      chrome.tabs.create({
        url: `https://soitis.dev/control-panel-for-twitter/updated?version=${significantVersions[0]}`,
        active: false,
      })
    }
  }
})

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateToolbarIcon(changes.enabled.newValue)
  }
})
//#endregion
