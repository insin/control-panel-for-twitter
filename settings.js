//#region Default settings
/** @type {import("./types").UserSettings} */
export const DEFAULT_SETTINGS = {
  // Pro
  customTheme: '',
  mutedWords: '',
  mutedWordsError: false,
  // Shared
  addAddMutedWordMenuItem: true,
  addFocusedTweetAccountLocation: false,
  bypassAgeVerification: true,
  darkModeTheme: 'lightsOut',
  defaultFollowingToRecent: true,
  defaultToFollowing: true,
  defaultToLatestSearch: false,
  disableHomeTimeline: false,
  disableTweetTextFormatting: false,
  disabledHomeTimelineRedirect: 'notifications',
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  hideAdsNav: true,
  hideBookmarkButton: false,
  hideBookmarkMetrics: true,
  hideBookmarksNav: false,
  hideBusinessNav: true,
  hideChatNav: false,
  hideCommunitiesNav: false,
  hideComposeTweet: false,
  hideConnectNav: true,
  hideCreatorStudioNav: true,
  hideDiscoverSuggestions: true,
  hideEditImage: true,
  hideExplorePageContents: true,
  hideFollowingMenu: false,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideGrokNav: true,
  hideGrokTweets: false,
  hideInlinePrompts: true,
  hideJobsNav: true,
  hideLikeMetrics: true,
  hideListRetweets: true,
  hideListsNav: false,
  hideMetrics: false,
  hideNotificationLikes: false,
  hideNotificationRetweets: false,
  hideNotifications: 'ignore',
  hidePremiumReplies: false,
  hidePremiumUpsells: true,
  hideProfileHeaderMetrics: true,
  hideProfileRetweets: false,
  hideQuoteTweetMetrics: true,
  hideQuotesFrom: [],
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideSeeNewTweets: false,
  hideShareTweetButton: false,
  hideSortRepliesMenu: false,
  hideSubscriptions: true,
  hideSuggestedContentSearch: true,
  hideSuggestedContentTimeline: true,
  hideTweetAnalyticsLinks: false,
  hideUnavailableQuoteTweets: true,
  hideVerifiedTabs: true,
  hideViewActivityLinks: true,
  hideViews: true,
  mutableQuoteTweets: true,
  mutedQuotes: [],
  premiumBlueChecks: 'replace',
  quoteTweets: 'ignore',
  redirectChatNav: false,
  redirectToTwitter: false,
  reducedInteractionMode: false,
  restoreLinkHeadlines: true,
  restoreOtherInteractionLinks: true,
  restoreQuoteTweetsLink: true,
  restoreTweetSource: true,
  retweets: 'separate',
  revertXBranding: true,
  showBookmarkButtonUnderFocusedTweets: true,
  showPremiumReplyBusiness: true,
  showPremiumReplyFollowedBy: true,
  showPremiumReplyFollowersCount: false,
  showPremiumReplyFollowersCountAmount: '1000000',
  showPremiumReplyFollowing: true,
  showPremiumReplyGovernment: true,
  sortReplies: 'relevant',
  tweakQuoteTweetsPage: true,
  unblurSensitiveContent: false,
  uninvertFollowButtons: true,
  // Desktop only
  addUserHoverCardAccountLocation: true,
  fullWidthContent: false,
  fullWidthMedia: true,
  hideAccountSwitcher: false,
  hideExploreNav: true,
  hideExploreNavWithSidebar: true,
  hideLiveBroadcasts: false,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  hideSpacesNav: false,
  hideSuggestedFollows: false,
  hideTimelineTweetBox: false,
  hideTodaysNews: false,
  hideWhatsHappening: false,
  navBaseFontSize: true,
  navDensity: 'default',
  showRelevantPeople: false,
  // Mobile only
  hideLiveBroadcastBar: false,
  hideMessagesBottomNavItem: false,
  preventNextVideoAutoplay: true,
  // Experiments
  customCss: '',
  hideToggleNavigation: false,
  tweakNewLayout: false,
}
//#endregion

//#region Constants
export const OPEN_APP_MESSAGE = 'OPEN_APP'
export const SERVER_ORIGIN = 'http://localhost:5173' // 'https://pro.soitis.dev'
export const SYNC_RESET_MESSAGE = 'SETTINGS_SYNC_RESET_TIMER'
//#endregion

//#region Async chrome.storage.local wrappers for Firefox MV2
export function get(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result)
      }
    })
  })
}

export function remove(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}

export function set(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(keys, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve()
      }
    })
  })
}
//#endregion

//#region Settings functions
/**
 * Signals the background script to reset the pull timer and schedule a
 * debounced push, without writing settings. Use this if you've written to
 * storage and pendingSettingsPatch yourself and want sync to follow.
 */
export function resetSyncTimer() {
  chrome.runtime.sendMessage({ type: SYNC_RESET_MESSAGE }).catch(() => {})
}

/**
 * Merges `changes` into the stored settings object and writes to
 * chrome.storage.local. Resolves once the write is complete, meaning
 * chrome.storage.onChanged will have fired before this returns.
 *
 * Also signals the background script to reset the pull countdown and
 * schedule a debounced push. The signal is best-effort — it is silently
 * dropped if the service worker is not currently running, which is fine
 * because the next alarm-triggered pull will reconcile.
 *
 * @param {Partial<import("./types").UserSettings>} changes - Partial settings to merge in.
 */
export async function setSettings(changes) {
  const { pendingSettingsPatch = {}, settings = {} } = await get([
    'pendingSettingsPatch',
    'settings',
  ])

  await set({
    pendingSettingsPatch: {
      .../** @type {Partial<import("./types").UserSettings>} */ (pendingSettingsPatch),
      ...changes,
    },
    settings: {
      .../** @type {Partial<import("./types").UserSettings>} */ (settings),
      ...changes,
    },
  })

  chrome.runtime.sendMessage({ type: SYNC_RESET_MESSAGE }).catch(() => {})
}
//#endregion
