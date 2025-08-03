export type StoredConfig = {
  // Log and display debug info
  debug?: boolean
  // Log stats on each timeline change
  debugLogTimelineStats?: boolean
  // Disable extension functionality without disabling the extension itself
  enabled?: boolean
  // We only store settings the user has actually interacted with
  settings?: Partial<UserSettings>
  // The last version of Twitter which was active when a content script ran -
  // determines which options the options page displays. Not applicable to most
  // users, but useful for checking mobile options via a desktop browser in
  // Responsive Design / Device Mode.
  version?: 'desktop' | 'mobile'
}

export type StoredConfigKey = keyof StoredConfig

export type StoredConfigMessage = {
  type: 'initial' | 'change'
  config: Partial<StoredConfig>
}

export type UserSettings = {
  // Shared
  addAddMutedWordMenuItem: boolean
  defaultToFollowing: boolean
  defaultToLatestSearch: boolean
  disableHomeTimeline: boolean
  disableTweetTextFormatting: boolean
  disabledHomeTimelineRedirect: 'notifications' | 'messages'
  dontUseChirpFont: boolean
  dropdownMenuFontWeight: boolean
  fastBlock: boolean
  followButtonStyle: 'monochrome' | 'themed'
  hideAdsNav: boolean
  hideBookmarkButton: boolean
  hideBookmarkMetrics: boolean
  hideBookmarksNav: boolean
  hideCommunitiesNav: boolean
  hideComposeTweet: boolean
  hideDiscoverSuggestions: boolean
  hideExplorePageContents: boolean
  hideFollowingMetrics: boolean
  hideForYouTimeline: boolean
  hideGrokNav: boolean
  hideGrokTweets: boolean
  hideInlinePrompts: boolean
  hideJobsNav: boolean
  hideLikeMetrics: boolean
  hideListsNav: boolean
  hideMetrics: boolean
  hideMonetizationNav: boolean
  hideNotificationLikes: boolean,
  hideNotifications: 'ignore' | 'badges' | 'hide'
  hidePremiumReplies: boolean
  hidePremiumUpsells: boolean
  hideProfileHeaderMetrics: boolean
  hideProfileRetweets: boolean
  hideQuoteTweetMetrics: boolean
  hideQuotesFrom: string[]
  hideReplyMetrics: boolean
  hideRetweetMetrics: boolean
  hideSeeNewTweets: boolean
  hideShareTweetButton: boolean
  hideSpacesNav: boolean
  hideSubscriptions: boolean
  hideTweetAnalyticsLinks: boolean
  hideUnavailableQuoteTweets: boolean
  hideVerifiedTabs: boolean
  hideViews: boolean
  hideWhoToFollowEtc: boolean
  listRetweets: 'ignore' | 'hide'
  mutableQuoteTweets: boolean
  mutedQuotes: QuotedTweet[]
  premiumBlueChecks: 'ignore' | 'replace' | 'hide'
  quoteTweets: SharedTweetsConfig
  redirectToTwitter: boolean
  reducedInteractionMode: boolean
  restoreLinkHeadlines: boolean
  restoreOtherInteractionLinks: boolean
  restoreQuoteTweetsLink: boolean
  restoreTweetSource: boolean
  retweets: SharedTweetsConfig
  revertXBranding: boolean
  showBookmarkButtonUnderFocusedTweets: boolean
  showPremiumReplyBusiness: boolean
  showPremiumReplyFollowedBy: boolean
  showPremiumReplyFollowersCount: boolean
  showPremiumReplyFollowersCountAmount: string
  showPremiumReplyFollowing: boolean
  showPremiumReplyGovernment: boolean
  sortReplies: 'relevant' | 'recent' | 'liked'
  tweakNewLayout: boolean
  tweakQuoteTweetsPage: boolean
  unblurSensitiveContent: boolean
  uninvertFollowButtons: boolean
  // Experiments
  customCss: string
  // Desktop only
  fullWidthContent: boolean
  fullWidthMedia: boolean
  hideAccountSwitcher: boolean
  hideExploreNav: boolean
  hideExploreNavWithSidebar: boolean
  hideLiveBroadcasts: boolean
  hideMessagesDrawer: boolean
  hideSidebarContent: boolean
  hideSuggestedFollows: boolean
  hideTimelineTweetBox: boolean
  hideToggleNavigation: boolean
  hideWhatsHappening: boolean
  navBaseFontSize: boolean
  navDensity: 'default' | 'comfortable' | 'compact'
  showRelevantPeople: boolean
  // Mobile only
  hideLiveBroadcastBar: boolean
  hideMessagesBottomNavItem: boolean
  preventNextVideoAutoplay: boolean
}

export type UserSettingsKey = keyof UserSettings

export type Locale = {
  [key in LocaleKey]?: string
}

export type LocaleKey =
  | 'ADD_ANOTHER_TWEET'
  | 'ADD_MUTED_WORD'
  | 'GROK_ACTIONS'
  | 'HOME'
  | 'LIKES'
  | 'LIVE_ON_X'
  | 'MOST_RELEVANT'
  | 'MUTE_THIS_CONVERSATION'
  | 'POST_ALL'
  | 'POST_UNAVAILABLE'
  | 'PROFILE_SUMMARY'
  | 'QUOTE'
  | 'QUOTES'
  | 'QUOTE_TWEET'
  | 'QUOTE_TWEETS'
  | 'REPOST'
  | 'REPOSTS'
  | 'RETWEET'
  | 'RETWEETED_BY'
  | 'RETWEETS'
  | 'SHARED'
  | 'SHARED_TWEETS'
  | 'SHOW'
  | 'SHOW_MORE_REPLIES'
  | 'SORT_REPLIES_BY'
  | 'TURN_OFF_QUOTE_TWEETS'
  | 'TURN_OFF_RETWEETS'
  | 'TURN_ON_RETWEETS'
  | 'TWEET'
  | 'TWEETS'
  | 'TWEET_ALL'
  | 'TWEET_INTERACTIONS'
  | 'TWEET_YOUR_REPLY'
  | 'TWITTER'
  | 'UNDO_RETWEET'
  | 'VIEW'
  | 'WHATS_HAPPENING'

export type NamedMutationObserver = MutationObserver & {name: string}

export type Disconnectable = {name: string, disconnect(): void}

export type QuotedTweet = {
  quotedBy: string
  user: string
  time: string
  text?: string
}

export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type TweetType =
  | 'COMMUNITY_TWEET'
  | 'PINNED_TWEET'
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'RETWEET'
  | 'RETWEETED_QUOTE_TWEET'
  | 'TWEET'
  | 'UNAVAILABLE'
  | 'UNAVAILABLE_QUOTE_TWEET'
  | 'UNAVAILABLE_RETWEET'

export type TimelineItemType =
  | TweetType
  | 'BLUE_REPLY'
  | 'BUSINESS_REPLY'
  | 'DISCOVER_MORE_HEADING'
  | 'DISCOVER_MORE_TWEET'
  | 'FOCUSED_TWEET'
  | 'GOVERNMENT_REPLY'
  | 'HEADING'
  | 'INLINE_PROMPT'
  | 'SHOW_MORE'
  | 'SUBSEQUENT_ITEM'
  | 'UNAVAILABLE'
  | `NOTIFICATION_${NotificationType}`

export type NotificationType = 'AD' | 'FOLLOW' | 'LIKE' | 'RETWEET'

export type TimelineOptions = {
  checkSocialContext?: boolean
  classifyTweets?: boolean
  hideHeadings?: boolean
  isTabbed?: boolean
  isUserTimeline?: boolean
  onTabChanged?: () => void
  onTimelineAppeared?: () => void
  tabbedTimelineContainerSelector?: string
  timelineSelector?: string
}

export type IndividualTweetTimelineOptions = {
  observers: Map<string, Disconnectable>
}

export type SeenTweetDetails = {
  itemType: TimelineItemType,
  hidden: boolean | null,
}

export type UserInfo = {
  following: boolean
  followedBy: boolean
  followersCount: number
}

export type UserInfoObject = {[index: string]: UserInfo}

export type VerifiedType = 'BLUE' | 'BUSINESS' | 'GOVERNMENT'
