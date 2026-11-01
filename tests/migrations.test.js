import { beforeEach, describe, expect, test, vi } from 'vitest'

import { DEFAULT_SETTINGS } from '../default-settings.js'
import {
  getSettingsMigrationVersions,
  runSettingsMigrations,
  scheduleSettingsMigrations,
} from '../migrations.js'
import { set } from '../settings.js'
import { createChromeMock } from './helpers/chrome.js'

let browser

function loadStorage(storage = {}) {
  browser = createChromeMock({ storage })
  vi.stubGlobal('chrome', browser.chrome)
}

async function migrateFrom(previous, current) {
  await scheduleSettingsMigrations(previous, current)
  await runSettingsMigrations(current)
}

describe('release-based storage migrations', () => {
  beforeEach(() => loadStorage())

  test('does not infer migrations from empty storage on background startup', async () => {
    await runSettingsMigrations('5')

    expect(browser.storage).toEqual({})
    expect(browser.chrome.storage.local.set).not.toHaveBeenCalled()
  })

  test('migrates v4 user settings to v5', async () => {
    loadStorage({
      alwaysUseLatestTweets: false,
      debug: true,
      debugLogTimelineStats: true,
      enabled: false,
      hideAdsNav: false,
      hideCalls: true,
      hideGrokNav: true,
      hideMoreTweets: false,
      hideMoney: false,
      hideMoreTweetsLegacy: true,
      hideTotalTweetsMetrics: false,
      hideTwitterBlueReplies: false,
      hideTwitterBlueUpsells: false,
      hideVerifiedNotificationsTab: false,
      hideWhoToFollowEtc: false,
      listRetweets: 'hide',
      replaceLogo: false,
      showBlueReplyFollowersCount: false,
      showBlueReplyFollowersCountAmount: '500',
      twitterBlueChecks: 'hide',
      version: 'mobile',
    })

    await migrateFrom('4.25.0', '5')

    expect(browser.storage).toEqual({
      debug: true,
      debugLogTimelineStats: true,
      enabled: false,
      settings: {
        defaultToFollowing: false,
        hideAdsNav: false,
        hideCalls: true,
        hideDiscoverSuggestions: false,
        hideGrok: true,
        hideListRetweets: true,
        hideMoney: false,
        hidePremiumReplies: false,
        hidePremiumUpsells: false,
        hideProfileHeaderMetrics: false,
        hideSuggestedContentTimeline: false,
        hideVerifiedTabs: false,
        premiumBlueChecks: 'hide',
        revertXBranding: false,
        showPremiumReplyFollowersCount: false,
        showPremiumReplyFollowersCountAmount: '500',
      },
      lastLayout: 'mobile',
    })
  })

  test.each(['desktop', 'mobile'])(
    'renames legacy %s layout state at v4.999 and removes version',
    async (layout) => {
      loadStorage({ version: layout })
      await migrateFrom('4.25.0', '4.999.0')
      expect(browser.storage).toEqual({ settings: {}, lastLayout: layout })
    },
  )

  test('preserves newer layout state and renamed settings when retrying', async () => {
    loadStorage({
      version: 'mobile',
      lastLayout: 'desktop',
      hideMessagesDrawer: true,
      hideMessagesBottomNavItem: true,
      settings: { hideChatDrawer: false, hideChatBottomNavItem: false },
    })
    await migrateFrom('4.25.0', '4.999.0')
    await migrateFrom('4.25.0', '4.999.0')
    expect(browser.storage).toEqual({
      lastLayout: 'desktop',
      settings: { hideChatDrawer: false, hideChatBottomNavItem: false },
    })
  })

  test('renames v4 Chat settings without changing their values', async () => {
    loadStorage({ hideMessagesDrawer: false, hideMessagesBottomNavItem: true })
    await migrateFrom('4.25.0', '4.999.0')
    expect(browser.storage).toEqual({
      settings: { hideChatDrawer: false, hideChatBottomNavItem: true },
    })
  })

  test('converts a visible list-retweets setting to false', async () => {
    loadStorage({ listRetweets: 'show' })

    await migrateFrom('4.25.0', '5')

    expect(browser.storage.settings).toEqual({ hideListRetweets: false })
  })

  test.each([
    ['mostRecent', true],
    ['popular', false],
    ['ignore', false],
  ])('converts sortFollowing=%s without hiding the menu', async (sortFollowing, expected) => {
    loadStorage({ sortFollowing })

    await migrateFrom('4.25.0', '4.999.0')

    expect(browser.storage).toEqual({ settings: { defaultFollowingToRecent: expected } })
    expect(DEFAULT_SETTINGS.hideFollowingMenu).toBe(false)
  })

  test('runs at 4.999.0, including direct upgrades to v5, without repeating at v5', () => {
    expect(getSettingsMigrationVersions('4.25.0', '4.999.0')).toEqual(['4.999.0'])
    expect(getSettingsMigrationVersions('4.25.0', '5.0.0')).toEqual(['4.999.0'])
    expect(getSettingsMigrationVersions('4.999.0', '5.0.0')).toEqual([])
  })

  test('does not run without crossing the migration threshold', async () => {
    loadStorage({ hideAdsNav: false })

    await migrateFrom('5', '5.1')

    expect(browser.storage).toEqual({ hideAdsNav: false })
    expect(browser.chrome.storage.local.set).not.toHaveBeenCalled()
    expect(getSettingsMigrationVersions('5', '5.1')).toEqual([])
  })

  test('can be rerun after completing without losing nested settings', async () => {
    loadStorage({ hideAdsNav: false, replaceLogo: true })

    await migrateFrom('4.25.0', '5')
    await migrateFrom('4.25.0', '5')

    expect(browser.storage).toEqual({
      settings: {
        hideAdsNav: false,
        revertXBranding: true,
      },
    })
  })

  test('preserves internal config when a migration is retried', async () => {
    loadStorage({ hideAdsNav: false })

    await migrateFrom('4.25.0', '5')
    await set({ collapsedGroups: ['sidebar'] })
    await migrateFrom('4.25.0', '5')

    expect(browser.storage).toEqual({
      collapsedGroups: ['sidebar'],
      settings: { hideAdsNav: false },
    })
  })

  test('finishes safely from a partially completed migration', async () => {
    loadStorage({
      hideAdsNav: false,
      replaceLogo: true,
      settings: {
        hideAdsNav: false,
        hideViews: false,
        revertXBranding: true,
      },
    })

    await migrateFrom('4.25.0', '5')

    expect(browser.storage).toEqual({
      settings: {
        hideAdsNav: false,
        hideViews: false,
        revertXBranding: true,
      },
    })
  })

  test('persists the threshold before beginning an upgrade migration', async () => {
    loadStorage({ hideGrokNav: true })
    await scheduleSettingsMigrations('4.25.0', '5.1.0')

    expect(browser.storage).toEqual({ hideGrokNav: true, pendingStorageMigration: '4.999.0' })
    await runSettingsMigrations('5.1.0')
    expect(browser.storage).toEqual({ settings: { hideGrok: true } })
  })

  test('does not overwrite nested edits when retrying after legacy cleanup was interrupted', async () => {
    loadStorage({
      pendingStorageMigration: '4.999.0',
      hideGrokNav: true,
      hideAdsNav: true,
      settings: { hideGrok: false, hideAdsNav: false },
    })
    await runSettingsMigrations('5.1.0')
    expect(browser.storage).toEqual({ settings: { hideGrok: false, hideAdsNav: false } })
  })

  test('runs all crossed thresholds in order and retries only the unfinished step after another upgrade', async () => {
    const first = vi.fn(async () => {
      expect(browser.storage.pendingStorageMigration).toBe('4.999.0')
    })
    const second = vi.fn(async () => {
      expect(browser.storage.pendingStorageMigration).toBe('5.2.0')
    })
    second.mockRejectedValueOnce(new Error('broken rename'))
    const third = vi.fn(async () => {
      expect(browser.storage.pendingStorageMigration).toBe('5.3.0')
    })
    /** @type {import('../types.js').SettingsMigrations} */
    const migrations = [
      ['4.999.0', first],
      ['5.2.0', second],
      ['5.3.0', third],
    ]

    await scheduleSettingsMigrations('4.25.0', '5.2.0', migrations)
    await expect(runSettingsMigrations('5.2.0', migrations)).rejects.toThrow('broken rename')
    expect(first).toHaveBeenCalledTimes(1)
    expect(third).not.toHaveBeenCalled()
    expect(browser.storage.pendingStorageMigration).toBe('5.2.0')

    await scheduleSettingsMigrations('5.2.0', '5.3.0', migrations)
    expect(browser.storage.pendingStorageMigration).toBe('5.2.0')
    await runSettingsMigrations('5.3.0', migrations)
    expect(first).toHaveBeenCalledTimes(1)
    expect(second).toHaveBeenCalledTimes(2)
    expect(third).toHaveBeenCalledTimes(1)
    expect(browser.storage.pendingStorageMigration).toBeUndefined()
  })

  test('retains the cursor when legacy cleanup fails and finishes on the next startup', async () => {
    loadStorage({ hideGrokNav: true })
    await scheduleSettingsMigrations('4.25.0', '5.1.0')
    const remove = browser.chrome.storage.local.remove.getMockImplementation()
    browser.chrome.storage.local.remove.mockImplementationOnce((_keys, callback) => {
      Object.assign(browser.chrome.runtime, { lastError: new Error('cleanup failed') })
      callback()
      browser.chrome.runtime.lastError = undefined
    })

    await expect(runSettingsMigrations('5.1.0')).rejects.toThrow('cleanup failed')
    expect(browser.storage).toEqual({
      hideGrokNav: true,
      pendingStorageMigration: '4.999.0',
      settings: { hideGrok: true },
    })

    browser.chrome.storage.local.remove.mockImplementation(remove)
    await runSettingsMigrations('5.1.1')
    expect(browser.storage).toEqual({ settings: { hideGrok: true } })
  })

  test('retries a completed step if saving its next threshold failed', async () => {
    const first = vi.fn(async () => {})
    const second = vi.fn(async () => {})
    /** @type {import('../types.js').SettingsMigrations} */
    const migrations = [
      ['4.999.0', first],
      ['5.2.0', second],
    ]
    await scheduleSettingsMigrations('4.25.0', '5.2.0', migrations)
    browser.chrome.storage.local.set.mockImplementationOnce((_values, callback) => {
      Object.assign(browser.chrome.runtime, { lastError: new Error('checkpoint failed') })
      callback()
      browser.chrome.runtime.lastError = undefined
    })

    await expect(runSettingsMigrations('5.2.0', migrations)).rejects.toThrow('checkpoint failed')
    expect(browser.storage.pendingStorageMigration).toBe('4.999.0')
    expect(second).not.toHaveBeenCalled()

    await runSettingsMigrations('5.2.0', migrations)
    expect(first).toHaveBeenCalledTimes(2)
    expect(second).toHaveBeenCalledTimes(1)
    expect(browser.storage.pendingStorageMigration).toBeUndefined()
  })

  test('does not silently discard an unknown pending migration', async () => {
    loadStorage({ pendingStorageMigration: '5.2.0' })
    await expect(runSettingsMigrations('5.2.0')).rejects.toThrow('Unknown storage migration: 5.2.0')
    expect(browser.storage.pendingStorageMigration).toBe('5.2.0')
  })
})
