import { crossesVersionThreshold, isObject } from './ext-shared.js'
import { runSettingsMigrations, scheduleSettingsMigrations } from './migrations.js'
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
const IS_PRO = Number(chrome.runtime.getManifest().version.split('.')[0]) >= 5
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
let startupTask = Promise.resolve()
let migrationsCompletedThisStartup = false

/** @param {chrome.runtime.InstalledDetails} [details] */
function main(details) {
  const task = startupTask.then(async () => {
    const currentVersion = chrome.runtime.getManifest().version
    if (details?.reason == 'install') {
      const { settings } = await get('settings')
      if (!isObject(settings)) await set({ settings: {} })
    } else if (details?.reason == 'update' && !migrationsCompletedThisStartup) {
      await scheduleSettingsMigrations(details.previousVersion, currentVersion)
    }
    if (await runSettingsMigrations(currentVersion)) migrationsCompletedThisStartup = true
    const { settings, pendingStorageMigration } = await get(['settings', 'pendingStorageMigration'])
    // Don't start until storage is initialised and pending migrations have completed
    if (!isObject(settings) || pendingStorageMigration) return
    if (IS_PRO) await startSync()
  })
  startupTask = task.catch(() => {})
  return task
}

if (IS_PRO) initSettingsSync({ apiBase: SERVER_ORIGIN })
const startup = main().catch((error) => {
  console.error('[background]', error)
})

chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  updateToolbarIcon(enabled)
})

chrome.runtime.onInstalled.addListener((details) => {
  const startup = main(details)
  startup.catch((error) => console.error('[background]', error))
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
  return startup
})

chrome.runtime.onStartup.addListener(() => {
  // Wake the background at browser startup without running main() twice
  return startup
})

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateToolbarIcon(changes.enabled.newValue)
  }
})
//#endregion
