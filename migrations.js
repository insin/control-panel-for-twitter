import { DEFAULT_SETTINGS } from './default-settings.js'
import { crossesVersionThreshold, isObject, isVersionLessThan } from './ext-shared.js'
import { get, remove, set } from './settings.js'
import { trace } from './trace-background.js'

/**
 * Migrates user settings to a single `settings` object and renames layout state.
 */
async function migrateUserSettingsToSettingsObject() {
  const extensionConfigKeys = new Set([
    'accountEmail',
    'collapsedGroups',
    'debug',
    'debugLogGetElementStats',
    'debugLogTimelineStats',
    'enabled',
    'lastLayout',
    'lastSyncTime',
    'pendingSettingsPatch',
    'pendingStorageMigration',
    'serverLastModified',
    'settings',
    'settingsSyncPhase',
    'stickyHeadings',
    'subscription',
    'syncError',
    'syncSettings',
    'tab',
    'token',
  ])
  const storedConfig = await get()
  const keysToRemove = []
  // Preserve existing nested values when retrying an interrupted migration
  /** @type {Partial<import('./types').UserSettings>} */
  const existingSettings = isObject(storedConfig.settings) ? storedConfig.settings : {}
  const settings = { ...existingSettings }
  /** @type {import('./types').Migrations} */
  const migrations = {
    hideGrokNav: { rename: 'hideGrok' },
    hideMessagesBottomNavItem: { rename: 'hideChatBottomNavItem' },
    hideMessagesDrawer: { rename: 'hideChatDrawer' },
    hideWhoToFollowEtc: { rename: 'hideSuggestedContentTimeline' },
    listRetweets: { rename: 'hideListRetweets', convert: (value) => value == 'hide' },
    sortFollowing: {
      rename: 'defaultFollowingToRecent',
      convert: (value) => value == 'mostRecent',
    },
    // Changed what it was used for over time
    alwaysUseLatestTweets: { rename: 'defaultToFollowing' },
    hideMoreTweets: { rename: 'hideDiscoverSuggestions' },
    hideTotalTweetsMetrics: { rename: 'hideProfileHeaderMetrics' },
    hideVerifiedNotificationsTab: { rename: 'hideVerifiedTabs' },
    replaceLogo: { rename: 'revertXBranding' },
    // Twitter Blue → Premium
    hideTwitterBlueReplies: { rename: 'hidePremiumReplies' },
    hideTwitterBlueUpsells: { rename: 'hidePremiumUpsells' },
    showBlueReplyFollowersCount: { rename: 'showPremiumReplyFollowersCount' },
    showBlueReplyFollowersCountAmount: { rename: 'showPremiumReplyFollowersCountAmount' },
    twitterBlueChecks: { rename: 'premiumBlueChecks' },
  }
  for (const [key, value] of Object.entries(storedConfig)) {
    if (extensionConfigKeys.has(key)) continue
    // Remove all top-level keys which aren't user settings
    keysToRemove.push(key)
    // Migrate or copy expected settings keys
    if (Object.hasOwn(migrations, key)) {
      const migration = migrations[key]
      const target = migration.rename || key
      if (!Object.hasOwn(existingSettings, target)) {
        settings[target] = migration.convert ? migration.convert(value) : value
      }
    } else if (Object.hasOwn(DEFAULT_SETTINGS, key)) {
      if (!Object.hasOwn(existingSettings, key)) settings[key] = value
    }
  }
  await set({
    settings,
    ...(!Object.hasOwn(storedConfig, 'lastLayout') &&
    (storedConfig.version == 'desktop' || storedConfig.version == 'mobile')
      ? { lastLayout: storedConfig.version }
      : {}),
  })
  if (keysToRemove.length > 0) {
    await remove(keysToRemove)
  }
}

/** @type {import('./types').SettingsMigrations} */
const SETTINGS_MIGRATIONS = [['4.999.0', migrateUserSettingsToSettingsObject]]

/**
 * @param {string} previous
 * @param {string} current
 * @param {import('./types').SettingsMigrations} [migrations]
 */
export function getSettingsMigrationVersions(previous, current, migrations = SETTINGS_MIGRATIONS) {
  return migrations
    .filter(([version]) => crossesVersionThreshold(previous, current, version))
    .map(([version]) => version)
}

/**
 * Queue the first crossed release threshold, preserving any earlier pending work.
 * @param {string} previous
 * @param {string} current
 * @param {import('./types').SettingsMigrations} [migrations]
 */
export async function scheduleSettingsMigrations(
  previous,
  current,
  migrations = SETTINGS_MIGRATIONS,
) {
  const { pendingStorageMigration } = await get('pendingStorageMigration')
  const next = getSettingsMigrationVersions(previous, current, migrations)[0]
  if (next && (!pendingStorageMigration || isVersionLessThan(next, pendingStorageMigration))) {
    await set({ pendingStorageMigration: next })
  }
}

/**
 * Run pending migrations in release order up to the installed version.
 * Returns true after completing the pending migration sequence.
 * @param {string} current
 * @param {import('./types').SettingsMigrations} [migrations]
 */
export async function runSettingsMigrations(current, migrations = SETTINGS_MIGRATIONS) {
  const { pendingStorageMigration } = await get('pendingStorageMigration')
  if (!pendingStorageMigration) return false
  const start = migrations.findIndex(([version]) => version == pendingStorageMigration)
  if (start == -1) throw new Error(`Unknown storage migration: ${pendingStorageMigration}`)

  for (let i = start; i < migrations.length; i++) {
    const [version, migration] = migrations[i]
    if (isVersionLessThan(current, version)) return false
    await trace('migration.started', { version })
    try {
      await migration()
      const next = migrations[i + 1]?.[0]
      if (next && !isVersionLessThan(current, next)) {
        await set({ pendingStorageMigration: next })
      } else {
        await remove('pendingStorageMigration')
      }
    } catch (error) {
      await trace('migration.failed', { error: error?.message ?? String(error), version })
      throw error
    }
    await trace('migration.completed', { version })
    if (!migrations[i + 1] || isVersionLessThan(current, migrations[i + 1][0])) return true
  }
  return false
}
