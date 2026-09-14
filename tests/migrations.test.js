import { beforeEach, describe, expect, test, vi } from 'vitest'

import { getSettingsMigrationVersions, runSettingsMigrations } from '../migrations.js'
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

  test('moves settings into a nested object and applies every rename', async () => {
    loadStorage({
      alwaysUseLatestTweets: false,
      debug: true,
      debugLogTimelineStats: true,
      enabled: false,
      hideAdsNav: false,
      hideMoreTweets: false,
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

    await runSettingsMigrations('4.3.1', '5')

    expect(browser.storage).toEqual({
      debug: true,
      debugLogTimelineStats: true,
      enabled: false,
      settings: {
        defaultToFollowing: false,
        hideAdsNav: false,
        hideDiscoverSuggestions: false,
        hideListRetweets: true,
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

    await runSettingsMigrations('4.9', '5')

    expect(browser.storage.settings).toEqual({ hideListRetweets: false })
  })

  test('does not run without crossing the v5 threshold', async () => {
    loadStorage({ hideAdsNav: false })

    await runSettingsMigrations('5', '5.1')

    expect(browser.storage).toEqual({ hideAdsNav: false })
    expect(browser.chrome.storage.local.set).not.toHaveBeenCalled()
    expect(getSettingsMigrationVersions('5', '5.1')).toEqual([])
  })

  test('can be rerun after completing without losing nested settings', async () => {
    loadStorage({ hideAdsNav: false, replaceLogo: true })

    await runSettingsMigrations('4.9', '5')
    await runSettingsMigrations('4.9', '5')

    expect(browser.storage).toEqual({
      settings: {
        hideAdsNav: false,
        revertXBranding: true,
      },
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

    await runSettingsMigrations('4.9', '5')

    expect(browser.storage).toEqual({
      settings: {
        hideAdsNav: false,
        hideViews: false,
        revertXBranding: true,
      },
    })
  })
})
