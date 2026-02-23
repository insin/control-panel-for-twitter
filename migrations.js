import { crossesVersionThreshold } from './ext-shared.js'
import { DEFAULT_SETTINGS, get, remove, set } from './settings.js'

/**
 * One-off migration for v5: move all top-level settings into a settings object.
 */
async function migrateSettingsToV5() {
  let extensionConfigKeys = new Set(['debug', 'debugLogTimelineStats', 'enabled', 'version'])
  let storedConfig = await get()
  let keysToRemove = []
  let settings = {}
  /** @type {import('./types').Migrations} */
  let migrations = {
    'hideWhoToFollowEtc': {rename: 'hideSuggestedContentTimeline'},
    'listRetweets': {rename: 'hideListRetweets', convert: (value) => value == 'hide'},
    // Changed what it was used for over time
    'alwaysUseLatestTweets': {rename: 'defaultToFollowing'},
    'hideMoreTweets': {rename: 'hideDiscoverSuggestions'},
    'hideTotalTweetsMetrics': {rename: 'hideProfileHeaderMetrics'},
    'hideVerifiedNotificationsTab': {rename: 'hideVerifiedTabs'},
    'replaceLogo': {rename: 'revertXBranding'},
    // Twitter Blue → Premium
    'hideTwitterBlueReplies': {rename: 'hidePremiumReplies'},
    'hideTwitterBlueUpsells': {rename: 'hidePremiumUpsells'},
    'showBlueReplyFollowersCount': {rename: 'showPremiumReplyFollowersCount'},
    'showBlueReplyFollowersCountAmount': {rename: 'showPremiumReplyFollowersCountAmount'},
    'twitterBlueChecks': {rename: 'premiumBlueChecks'},
  }
  for (let [key, value] of Object.entries(storedConfig)) {
    if (extensionConfigKeys.has(key)) continue
    // Remove all top-level keys which aren't v4 extension config
    keysToRemove.push(key)
    // Migrate or copy expected settings keys
    if (Object.hasOwn(migrations, key)) {
      let migration = migrations[key]
      settings[migration.rename || key] = migration.convert ? migration.convert(value) : value
    }
    else if (Object.hasOwn(DEFAULT_SETTINGS, key)) {
      settings[key] = value
    }
  }
  await set({settings})
  if (keysToRemove.length > 0) {
    await remove(keysToRemove)
  }
}

/** @type {[string, () => Promise<void>][]} */
const SETTINGS_MIGRATIONS = [
  ['5', migrateSettingsToV5],
]
const SETTINGS_MIGRATIONS_BY_VERSION = new Map(SETTINGS_MIGRATIONS)

/**
 * @param {string} previous
 * @param {string} current
 */
export function getSettingsMigrationVersions(previous, current) {
  return SETTINGS_MIGRATIONS
    .filter(([version]) => crossesVersionThreshold(previous, current, version))
    .map(([version]) => version)
}

/**
 * @param {string} previous
 * @param {string} current
 */
export async function runSettingsMigrations(previous, current) {
  let versions = getSettingsMigrationVersions(previous, current)
  for (let version of versions) {
    let migration = SETTINGS_MIGRATIONS_BY_VERSION.get(version)
    if (migration) {
      await migration()
    }
  }
}
