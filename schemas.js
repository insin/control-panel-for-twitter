import {
  arrayOf,
  boolean,
  isObject,
  object,
  oneOf,
  optional,
  string,
  validateSettings,
} from './ext-shared.js'

// Increment for incompatible changes only
export const SETTINGS_SCHEMA_VERSION = 1

const quotedTweet = object({
  quotedBy: string({ maxLength: 50 }),
  user: string({ maxLength: 30 }),
  time: string({ maxLength: 30 }),
  text: optional(string({ maxLength: 280 })),
})

/**
 * @type {Record<import('./types').UserSettingsKey, import('./ext-shared').FieldDescriptor>}
 */
export const currentSettingsSchema = {
  // Pro
  customTheme: string(),
  mutedWords: string(),
  mutedWordsError: boolean(),
  // Shared
  addAddMutedWordMenuItem: boolean(),
  addFocusedTweetAccountLocation: boolean(),
  bypassAgeVerification: boolean(),
  darkModeTheme: oneOf(['dim', 'lightsOut']),
  defaultFollowingToRecent: boolean(),
  defaultToFollowing: boolean(),
  defaultToLatestSearch: boolean(),
  disableHomeTimeline: boolean(),
  disableNflFeatures: boolean(),
  disableTweetTextFormatting: boolean(),
  disabledHomeTimelineRedirect: oneOf(['notifications', 'messages']),
  dontUseChirpFont: boolean(),
  dropdownMenuFontWeight: boolean(),
  fastBlock: boolean(),
  followButtonStyle: oneOf(['monochrome', 'themed']),
  hideAdsNav: boolean(),
  hideBookmarkButton: boolean(),
  hideBookmarkMetrics: boolean(),
  hideBusinessNav: boolean(),
  hideCalls: boolean(),
  hideChatNav: boolean(),
  hideCommunitiesNav: boolean(),
  hideComposeTweet: boolean(),
  hideConnectNav: boolean(),
  hideCreatorStudioNav: boolean(),
  hideDiscoverSuggestions: boolean(),
  hideEditImage: boolean(),
  hideExplorePageContents: boolean(),
  hideFollowingMenu: boolean(),
  hideFollowingMetrics: boolean(),
  hideForYouTimeline: boolean(),
  hideGrok: boolean(),
  hideGrokTweets: boolean(),
  hideHistoryNav: boolean(),
  hideInlinePrompts: boolean(),
  hideJobsNav: boolean(),
  hideLikeMetrics: boolean(),
  hideListRetweets: boolean(),
  hideListsNav: boolean(),
  hideManageTimelines: boolean(),
  hideMetrics: boolean(),
  hideMoney: boolean(),
  hideMoreFromThisAuthor: boolean(),
  hideNotificationLikes: boolean(),
  hideNotificationRetweets: boolean(),
  hideNotifications: oneOf(['ignore', 'badges', 'hide']),
  hidePremiumReplies: boolean(),
  hidePremiumUpsells: boolean(),
  hideProfileHeaderMetrics: boolean(),
  hideProfileRetweets: boolean(),
  hideQuoteTweetMetrics: boolean(),
  hideQuotesFrom: arrayOf(string({ maxLength: 50 }), { maxLength: 10000 }),
  hideReplyMetrics: boolean(),
  hideRetweetMetrics: boolean(),
  hideSeeNewTweets: boolean(),
  hideShareTweetButton: boolean(),
  hideSortRepliesMenu: boolean(),
  hideSpacesNav: boolean(),
  hideSubscriptions: boolean(),
  hideSuggestedContentSearch: boolean(),
  hideSuggestedContentTimeline: boolean(),
  hideTweetAnalyticsLinks: boolean(),
  hideUnavailableQuoteTweets: boolean(),
  hideVerifiedTabs: boolean(),
  hideViewActivityLinks: boolean(),
  hideViews: boolean(),
  mutableQuoteTweets: boolean(),
  mutedQuotes: arrayOf(quotedTweet, { maxLength: 10000 }),
  premiumBlueChecks: oneOf(['ignore', 'replace', 'hide']),
  quoteTweets: oneOf(['separate', 'hide', 'ignore']),
  reducedInteractionMode: boolean(),
  restoreLinkHeadlines: boolean(),
  restoreOtherInteractionLinks: boolean(),
  restoreQuoteTweetsLink: boolean(),
  restoreTweetSource: boolean(),
  retweets: oneOf(['separate', 'hide', 'ignore']),
  revertMediaCarousel: boolean(),
  revertProfileTabs: boolean(),
  revertTwemoji: boolean(),
  revertXBranding: boolean(),
  showBookmarkButtonUnderFocusedTweets: boolean(),
  showPremiumReplyBusiness: boolean(),
  showPremiumReplyFollowedBy: boolean(),
  showPremiumReplyFollowersCount: boolean(),
  showPremiumReplyFollowersCountAmount: oneOf(['1000', '10000', '100000', '1000000']),
  showPremiumReplyFollowing: boolean(),
  showPremiumReplyGovernment: boolean(),
  sortReplies: oneOf(['relevant', 'recent', 'liked']),
  tweakQuoteTweetsPage: boolean(),
  unblurSensitiveContent: boolean(),
  uninvertFollowButtons: boolean(),
  // Desktop only
  addUserHoverCardAccountLocation: boolean(),
  fullWidthContent: boolean(),
  fullWidthMedia: boolean(),
  hideAccountSwitcher: boolean(),
  hideExploreNav: boolean(),
  hideExploreNavWithSidebar: boolean(),
  hideLiveBroadcasts: boolean(),
  hideMessagesDrawer: boolean(),
  hideSidebarContent: boolean(),
  hideSuggestedFollows: boolean(),
  hideTimelineTweetBox: boolean(),
  hideTodaysNews: boolean(),
  hideWhatsHappening: boolean(),
  navBaseFontSize: boolean(),
  navDensity: oneOf(['default', 'comfortable', 'compact']),
  showRelevantPeople: boolean(),
  // Mobile only
  hideLiveBroadcastBar: boolean(),
  hideMessagesBottomNavItem: boolean(),
  preventNextVideoAutoplay: boolean(),
  // Experiments
  customCss: string({ maxLength: 50000 }),
}

/**
 * @param {Record<string, unknown>} settings
 * @param {string} version Extension version, for diagnostics only.
 */
export function createSettingsExport(settings, version) {
  return { schemaVersion: SETTINGS_SCHEMA_VERSION, settings, version }
}

/**
 * @param {unknown} input
 * @returns {import('./ext-shared').ValidateSettingsResult & {
 *   error?: 'noSettingsObject' | 'invalidSettingsSchemaVersion'
 *   warning?: 'newerSettingsSchemaVersion'
 * }}
 */
export function validateSettingsExport(input) {
  const rejected = { settings: {}, invalid: [], unknown: [] }
  if (!isObject(input) || !isObject(input.settings)) {
    return { ...rejected, error: 'noSettingsObject' }
  }
  if (
    typeof input.schemaVersion != 'number' ||
    !Number.isSafeInteger(input.schemaVersion) ||
    input.schemaVersion < 1
  ) {
    return { ...rejected, error: 'invalidSettingsSchemaVersion' }
  }
  const result = validateSettings(input.settings, currentSettingsSchema)
  if (input.schemaVersion > SETTINGS_SCHEMA_VERSION) {
    return { ...result, warning: 'newerSettingsSchemaVersion' }
  }
  return result
}
