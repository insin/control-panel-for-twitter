function hasAnyValid(validator) {
  return (values) => Array.isArray(values) && values.some(validator)
}

function isBoolean(value) {
  return typeof value == 'boolean'
}

export function isObject(value) {
  return value != null && typeof value == 'object'
}

/** @param {string[]} allowedValues */
function isOneOf(allowedValues) {
  return (value) => typeof value == 'string' && allowedValues.includes(value)
}

function isString(value) {
  return typeof value == 'string'
}

function isQuotedTweet(value) {
  return (
    isObject(value) &&
    isString(value.quotedBy) &&
    isString(value.user) &&
    isString(value.time) &&
    (value.text == null || isString(value.text))
  )
}

/**
 * @type {{K in import("./types").UserSettingsKey]?: (values: any) => any}}
 */
const settingsNormalisers = {
  hideQuotesFrom: (values) => values.filter(isString),
  mutedQuotes: (values) => values.filter(isQuotedTweet),
}

/**
 * @type {{[K in import("./types").UserSettingsKey]: (values: any) => boolean}}
 */
const settingsValidators = {
  // Shared
  addAddMutedWordMenuItem: isBoolean,
  addFocusedTweetAccountLocation: isBoolean,
  bypassAgeVerification: isBoolean,
  defaultToFollowing: isBoolean,
  defaultToLatestSearch: isBoolean,
  disableHomeTimeline: isBoolean,
  disableTweetTextFormatting: isBoolean,
  disabledHomeTimelineRedirect: isOneOf(['notifications', 'messages']),
  dontUseChirpFont: isBoolean,
  dropdownMenuFontWeight: isBoolean,
  fastBlock: isBoolean,
  followButtonStyle: isOneOf(['monochrome', 'themed']),
  hideAdsNav: isBoolean,
  hideBookmarkButton: isBoolean,
  hideBookmarkMetrics: isBoolean,
  hideBookmarksNav: isBoolean,
  hideBusinessNav: isBoolean,
  hideChatNav: isBoolean,
  hideCommunitiesNav: isBoolean,
  hideComposeTweet: isBoolean,
  hideConnectNav: isBoolean,
  hideCreatorStudioNav: isBoolean,
  hideDiscoverSuggestions: isBoolean,
  hideEditImage: isBoolean,
  hideExplorePageContents: isBoolean,
  hideFollowingMetrics: isBoolean,
  hideForYouTimeline: isBoolean,
  hideGrokNav: isBoolean,
  hideGrokTweets: isBoolean,
  hideInlinePrompts: isBoolean,
  hideJobsNav: isBoolean,
  hideLikeMetrics: isBoolean,
  hideListsNav: isBoolean,
  hideMetrics: isBoolean,
  hideNotificationLikes: isBoolean,
  hideNotificationRetweets: isBoolean,
  hideNotifications: isOneOf(['ignore', 'badges', 'hide']),
  hidePremiumReplies: isBoolean,
  hidePremiumUpsells: isBoolean,
  hideProfileHeaderMetrics: isBoolean,
  hideProfileRetweets: isBoolean,
  hideQuoteTweetMetrics: isBoolean,
  hideQuotesFrom: hasAnyValid(isString),
  hideReplyMetrics: isBoolean,
  hideRetweetMetrics: isBoolean,
  hideSeeNewTweets: isBoolean,
  hideShareTweetButton: isBoolean,
  hideSpacesNav: isBoolean,
  hideSubscriptions: isBoolean,
  hideTweetAnalyticsLinks: isBoolean,
  hideUnavailableQuoteTweets: isBoolean,
  hideVerifiedTabs: isBoolean,
  hideViews: isBoolean,
  hideWhoToFollowEtc: isBoolean,
  listRetweets: isOneOf(['ignore', 'hide']),
  mutableQuoteTweets: isBoolean,
  mutedQuotes: hasAnyValid(isQuotedTweet),
  premiumBlueChecks: isOneOf(['ignore', 'replace', 'hide']),
  quoteTweets: isOneOf(['separate', 'hide', 'ignore']),
  redirectChatNav: isBoolean,
  redirectToTwitter: isBoolean,
  reducedInteractionMode: isBoolean,
  restoreLinkHeadlines: isBoolean,
  restoreOtherInteractionLinks: isBoolean,
  restoreQuoteTweetsLink: isBoolean,
  restoreTweetSource: isBoolean,
  retweets: isOneOf(['separate', 'hide', 'ignore']),
  revertXBranding: isBoolean,
  showBookmarkButtonUnderFocusedTweets: isBoolean,
  showPremiumReplyBusiness: isBoolean,
  showPremiumReplyFollowedBy: isBoolean,
  showPremiumReplyFollowersCount: isBoolean,
  showPremiumReplyFollowersCountAmount: isOneOf(['1000', '10000', '100000', '1000000']),
  showPremiumReplyFollowing: isBoolean,
  showPremiumReplyGovernment: isBoolean,
  sortFollowing: isOneOf(['mostRecent', 'popular', 'ignore']),
  sortReplies: isOneOf(['relevant', 'recent', 'liked']),
  tweakQuoteTweetsPage: isBoolean,
  unblurSensitiveContent: isBoolean,
  uninvertFollowButtons: isBoolean,
  // Desktop only
  fullWidthContent: isBoolean,
  fullWidthMedia: isBoolean,
  hideAccountSwitcher: isBoolean,
  hideExploreNav: isBoolean,
  hideExploreNavWithSidebar: isBoolean,
  hideLiveBroadcasts: isBoolean,
  hideMessagesDrawer: isBoolean,
  hideSidebarContent: isBoolean,
  hideSuggestedFollows: isBoolean,
  hideTimelineTweetBox: isBoolean,
  hideTodaysNews: isBoolean,
  hideWhatsHappening: isBoolean,
  navBaseFontSize: isBoolean,
  navDensity: isOneOf(['default', 'comfortable', 'compact']),
  showRelevantPeople: isBoolean,
  // Mobile only
  hideLiveBroadcastBar: isBoolean,
  hideMessagesBottomNavItem: isBoolean,
  preventNextVideoAutoplay: isBoolean,
  // Experiments
  customCss: isString,
  hideToggleNavigation: isBoolean,
  tweakNewLayout: isBoolean,
}

/**
 * @param {string} json
 * @return {{
 *   messages: string[]
 *   settings: Partial<import("./types").UserSettings> | null
 * }}
 */
export function validateSettingsJson(json) {
  let input
  try {
    input = JSON.parse(json)
  } catch(error) {
    return {messages: [`Invalid JSON file: ${error.message}`], settings: null}
  }

  if (!isObject(input) || !isObject(input.settings)) {
    return {messages: ['No settings object found in JSON file'], settings: null}
  }

  let settings = {}
  let invalid = []
  let unknown = []

  for (let [key, value] of Object.entries(input.settings)) {
    let validator = settingsValidators[key]
    if (validator) {
      if (validator(value)) {
        let normaliser = settingsNormalisers[key]
        settings[key] = normaliser ? normaliser(value) : value
      } else {
        invalid.push(key)
      }
      continue
    }

    unknown.push(key)
  }

  return {
    messages: [
      invalid.length > 0 && chrome.i18n.getMessage('invalidSettings', invalid.join(', ')),
      unknown.length > 0 && chrome.i18n.getMessage('unknownSettings', unknown.join(', ')),
    ].filter(Boolean),
    settings: Object.keys(settings).length > 0 ? settings : null,
  }
}