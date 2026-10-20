import { beforeEach, describe, expect, test, vi } from 'vitest'

import { DEFAULT_SETTINGS } from '../default-settings.js'
import { getSettingsMigrationVersions, runSettingsMigrations } from '../migrations.js'
import { set } from '../settings.js'
import { createChromeMock } from './helpers/chrome.js'

let browser

function loadStorage(storage = {}) {
  browser = createChromeMock({ storage })
  vi.stubGlobal('chrome', browser.chrome)
}

describe('v5 settings migration', () => {
  beforeEach(() => loadStorage())

  test('creates an empty settings object on a fresh install', async () => {
    await runSettingsMigrations('0', '5')

    expect(browser.storage).toEqual({ settings: {} })
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

    await runSettingsMigrations('0', '5')

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
      version: 'mobile',
    })
  })

  test('converts a visible list-retweets setting to false', async () => {
    loadStorage({ listRetweets: 'show' })

    await runSettingsMigrations('0', '5')

    expect(browser.storage.settings).toEqual({ hideListRetweets: false })
  })

  test.each([
    ['mostRecent', true],
    ['popular', false],
    ['ignore', false],
  ])('converts sortFollowing=%s without hiding the menu', async (sortFollowing, expected) => {
    loadStorage({ sortFollowing })

    await runSettingsMigrations('4.25.0', '4.999.0')

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

    await runSettingsMigrations('5', '5.1')

    expect(browser.storage).toEqual({ hideAdsNav: false })
    expect(browser.chrome.storage.local.set).not.toHaveBeenCalled()
    expect(getSettingsMigrationVersions('5', '5.1')).toEqual([])
  })

  test('can be rerun after completing without losing nested settings', async () => {
    loadStorage({ hideAdsNav: false, replaceLogo: true })

    await runSettingsMigrations('0', '5')
    await runSettingsMigrations('0', '5')

    expect(browser.storage).toEqual({
      settings: {
        hideAdsNav: false,
        revertXBranding: true,
      },
    })
  })

  test('preserves v5 config when rerun before the version marker is updated', async () => {
    loadStorage({ hideAdsNav: false })

    await runSettingsMigrations('0', '5')
    await set({ collapsedGroups: ['sidebar'] })
    await runSettingsMigrations('0', '5')

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

    await runSettingsMigrations('0', '5')

    expect(browser.storage).toEqual({
      settings: {
        hideAdsNav: false,
        hideViews: false,
        revertXBranding: true,
      },
    })
  })
})
