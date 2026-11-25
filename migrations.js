import { get, remove, set } from './shared/settings.js'
import { isObject } from './shared/settings-schema.js'

import { DEFAULT_SETTINGS } from './default-settings.js'

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
    'lastSiteVersion',
    'lastSyncTime',
    'pendingSettingsPatch',
    'pendingStorageMigration',
    'serverLastModified',
    'settings',
    'settingsSyncPhase',
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
  // Keep the Chat navigation preference for this device's saved layout.
  // An already migrated value takes priority if legacy cleanup is retried.
  if (
    !Object.hasOwn(existingSettings, 'hideChatNav') &&
    (Object.hasOwn(storedConfig, 'hideChatNav') ||
      Object.hasOwn(storedConfig, 'hideChatBottomNavItem') ||
      Object.hasOwn(storedConfig, 'hideMessagesBottomNavItem'))
  ) {
    const layout = storedConfig.lastLayout ?? storedConfig.version
    settings.hideChatNav =
      (layout == 'mobile'
        ? (storedConfig.hideChatBottomNavItem ?? storedConfig.hideMessagesBottomNavItem)
        : storedConfig.hideChatNav) ?? DEFAULT_SETTINGS.hideChatNav
  }
  /** @type {import('./types').Migrations} */
  const migrations = {
    disableNflFeatures: { rename: 'disableUsSportFeatures' },
    hideGrokNav: { rename: 'hideGrok' },
    hideJobsNav: { rename: 'hideJobs' },
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
    twitterBlueChecks: {
      rename: 'premiumBlueChecks',
      convert: (value) => (value == 'dim' ? 'replace' : value),
    },
  }
  for (const [key, value] of Object.entries(storedConfig)) {
    if (extensionConfigKeys.has(key)) continue
    // Remove all top-level keys which aren't user settings
    keysToRemove.push(key)
    // These were merged above using the saved layout rather than copied separately
    if (
      key == 'hideChatNav' ||
      key == 'hideChatBottomNavItem' ||
      key == 'hideMessagesBottomNavItem'
    )
      continue
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

/** @type {import('./shared/types').SettingsMigrations} */
export const SETTINGS_MIGRATIONS = [['4.99.0', migrateUserSettingsToSettingsObject]]
