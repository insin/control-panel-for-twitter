import {DEFAULT_SETTINGS, UI_ORIGIN} from './settings.js'
import {get, remove, set} from './storage.js'

//#region Constants
const IS_SAFARI = location.protocol.startsWith('safari-web-extension:')

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

const V5_CONFIG_MIGRATION_RENAMES = new Map([
  // Changed meaning over time
  ['alwaysUseLatestTweets', 'defaultToFollowing'],
  ['hideMoreTweets', 'hideDiscoverSuggestions'],
  ['hideTotalTweetsMetrics', 'hideProfileHeaderMetrics'],
  ['hideVerifiedNotificationsTab', 'hideVerifiedTabs'],
  ['replaceLogo', 'revertXBranding'],
  // Twitter Blue → Premium
  ['hideTwitterBlueReplies', 'hidePremiumReplies'],
  ['hideTwitterBlueUpsells', 'hidePremiumUpsells'],
  ['showBlueReplyFollowersCountAmount', 'showPremiumReplyFollowersCountAmount'],
  ['showBlueReplyFollowersCount', 'showPremiumReplyFollowersCount'],
  ['twitterBlueChecks', 'premiumBlueChecks'],
])
//#endregion

//#region Functions
function log(...messages) {
  console.log('[background]', ...messages)
}

async function migrateConfigFromV4ToV5() {
  log('migrating page script settings to a single settings key')
  // Internal config stored in v4
  let internalConfigKeys = new Set(['debug', 'debugLogTimelineStats', 'enabled', 'version'])
  let storedConfig = await get()
  let keysToRemove = []
  let settings = {}
  for (let [key, value] of Object.entries(storedConfig)) {
    if (internalConfigKeys.has(key)) continue
    keysToRemove.push(key)
    if (Object.hasOwn(DEFAULT_SETTINGS, key)) {
      settings[key] = value
    }
    else if (V5_CONFIG_MIGRATION_RENAMES.has(key)) {
      settings[V5_CONFIG_MIGRATION_RENAMES.get(key)] = value
    }
  }
  await set({settings})
  if (keysToRemove.length > 0) {
    await remove(keysToRemove)
  }
  log('migrated page script settings from V4 to V5')
}

function updateToolbarIcon(enabled) {
  let title = chrome.i18n.getMessage(enabled ? 'extensionName' : 'extensionNameDisabled')
  if (chrome.runtime.getManifest().manifest_version == 3) {
    chrome.action.setTitle({title})
    if (!IS_SAFARI) {
      chrome.action.setIcon({path: enabled ? ENABLED_ICONS : DISABLED_ICONS})
    } else {
      chrome.action.setBadgeText({text: enabled ? '' : '⏻'})
    }
  } else {
    chrome.browserAction.setTitle({title})
    chrome.browserAction.setIcon({path: enabled ? ENABLED_ICONS : DISABLED_ICONS})
  }
}
//#endregion

//#region Events
chrome.runtime.onInstalled.addListener(async (details) => {
  log('chrome.runtime.onInstalled', {details})
  if (details.reason == 'install') {
    chrome.tabs.create({
      url: `${UI_ORIGIN}/control-panel-for-twitter/welcome`,
    })
  }
  else if (details.reason == 'update') {
    let version = chrome.runtime.getManifest().version
    if (details.previousVersion.startsWith('4') && !version.startsWith('4')) {
      await migrateConfigFromV4ToV5()
      chrome.tabs.create({
        url: `${UI_ORIGIN}/control-panel-for-twitter/updated?from=${details.previousVersion}&to=${version}`,
      })
    }
  }
})

chrome.storage.local.get({enabled: true}, ({enabled}) => {
  updateToolbarIcon(enabled)
})

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateToolbarIcon(changes.enabled.newValue)
  }
})
//#endregion
