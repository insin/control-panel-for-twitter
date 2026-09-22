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
  hideGrok: true,
  hideGrokTweets: false,
  hideHistoryNav: false,
  hideInlinePrompts: true,
  hideJobsNav: true,
  hideLikeMetrics: true,
  hideListRetweets: true,
  hideListsNav: false,
  hideManageTimelines: false,
  hideMetrics: false,
  hideMoreFromThisAuthor: true,
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
  reducedInteractionMode: false,
  restoreLinkHeadlines: true,
  restoreOtherInteractionLinks: true,
  restoreQuoteTweetsLink: true,
  restoreTweetSource: true,
  retweets: 'separate',
  revertMediaCarousel: true,
  revertProfileTabs: false,
  revertTwemoji: true,
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
export const SERVER_ORIGIN = (() => {
  const manifest = chrome.runtime.getManifest()
  const serverPermissions =
    manifest.manifest_version === 2 ? manifest.permissions : manifest.host_permissions
  return serverPermissions.includes('http://localhost:5173/*')
    ? 'http://localhost:5173'
    : 'https://pro.soitis.dev'
})()
export const ACCOUNT_LINKED_MESSAGE = 'ACCOUNT_LINKED'
export const ACCOUNT_UNLINKED_MESSAGE = 'ACCOUNT_UNLINKED'
export const CLEAR_DEBUG_TRACE_MESSAGE = 'CLEAR_DEBUG_TRACE'
export const GET_DEBUG_TRACE_MESSAGE = 'GET_DEBUG_TRACE'
export const SYNC_SCHEDULE_PUSH_MESSAGE = 'SYNC_SCHEDULE_PUSH'
export const SYNC_SETTINGS_CHANGED_MESSAGE = 'SYNC_SETTINGS_CHANGED'
//#endregion

export function isTargetExtensionMessage(data, runtimeId, extensionsProId) {
  return (
    data != null &&
    typeof data == 'object' &&
    data.runtimeId === runtimeId &&
    data.extensionId === extensionsProId
  )
}

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
        resolve(undefined)
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
        resolve(undefined)
      }
    })
  })
}
//#endregion

//#region Settings functions
export async function setSettings(changes) {
  const {
    pendingSettingsPatch = {},
    settings = {},
    syncSettings = true,
    token,
  } = await get(['pendingSettingsPatch', 'settings', 'syncSettings', 'token'])

  await set({
    ...(syncSettings && token
      ? {
          pendingSettingsPatch: {
            ...pendingSettingsPatch,
            ...changes,
          },
        }
      : {}),
    settings: {
      ...settings,
      ...changes,
    },
  })

  if (syncSettings && token) {
    schedulePush()
  }
}

export function schedulePush() {
  chrome.runtime.sendMessage({ type: SYNC_SCHEDULE_PUSH_MESSAGE }).catch(() => {})
}
//#endregion
