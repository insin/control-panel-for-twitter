export type AlgorithmicTweetsConfig = 'hide' | 'ignore'

export type Config = {
  debug: boolean,
  // Shared
  addAddMutedWordMenuItem: boolean
  alwaysUseLatestTweets: boolean
  communityTweets: AlgorithmicTweetsConfig
  dontUseChirpFont: boolean
  dropdownMenuFontWeight: boolean
  fastBlock: boolean
  followButtonStyle: 'monochrome' | 'themed'
  followeesFollows: AlgorithmicTweetsConfig
  hideAnalyticsNav: boolean
  hideBookmarksNav: boolean
  hideCommunitiesNav: boolean
  hideFollowingMetrics: boolean
  hideHelpCenterNav: boolean
  hideKeyboardShortcutsNav: boolean
  hideLikeMetrics: boolean
  hideListsNav: boolean
  hideMetrics: boolean
  hideMomentsNav: boolean
  hideMonetizationNav: boolean
  hideMoreTweets: boolean
  hideNewslettersNav: boolean
  hideQuoteTweetMetrics: boolean
  hideReplyMetrics: boolean
  hideRetweetMetrics: boolean
  hideShareTweetButton: boolean
  hideTopicsNav: boolean
  hideTotalTweetsMetrics: boolean
  hideTweetAnalyticsLinks: boolean
  hideTwitterAdsNav: boolean
  hideTwitterBlueNav: boolean
  hideTwitterCircleNav: boolean
  hideTwitterForProfessionalsNav: boolean
  hideUnavailableQuoteTweets: boolean
  hideVerifiedNotificationsTab: boolean
  hideViews: boolean
  hideWhoToFollowEtc: boolean
  likedTweets: AlgorithmicTweetsConfig
  mutableQuoteTweets: boolean
  mutedQuotes: QuotedTweet[]
  quoteTweets: SharedTweetsConfig
  repliedToTweets: AlgorithmicTweetsConfig
  retweets: SharedTweetsConfig
  suggestedTopicTweets: AlgorithmicTweetsConfig
  tweakQuoteTweetsPage: boolean
  twitterBlueChecks: 'ignore' | 'replace' | 'hide'
  uninvertFollowButtons: boolean
  // Experiments
  disableHomeTimeline: boolean
  disabledHomeTimelineRedirect: 'notifications' | 'messages'
  fullWidthContent: boolean
  fullWidthMedia: boolean
  reducedInteractionMode: boolean
  verifiedAccounts: VerifiedAccountsConfig
  // Desktop only
  hideAccountSwitcher: boolean
  hideExploreNav: boolean
  hideMessagesDrawer: boolean
  hideSidebarContent: boolean
  navBaseFontSize: boolean
  showRelevantPeople: boolean
  // Mobile only
  hideAppNags: boolean
  hideExplorePageContents: boolean
  hideMessagesBottomNavItem: boolean
}

export type Locale = {
  [key in LocaleKey]?: string
}

export type LocaleKey =
  | 'ADD_MUTED_WORD'
  | 'DISCOVER_MORE'
  | 'FOLLOWING'
  | 'HOME'
  | 'MUTE_THIS_CONVERSATION'
  | 'QUOTE_TWEET'
  | 'QUOTE_TWEETS'
  | 'RETWEETS'
  | 'SHARED_TWEETS'
  | 'TWITTER'

export type NamedMutationObserver = MutationObserver & {name?: string}

export type QuotedTweet = {
  user: string
  time: string
  text: string
}

export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type TimelineItemType =
  | 'COMMUNITY_TWEET'
  | 'DISCOVER_MORE_HEADING'
  | 'FOLLOWEES_FOLLOWS'
  | 'HEADING'
  | 'LIKED'
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'REPLIED'
  | 'RETWEET'
  | 'RETWEETED_QUOTE_TWEET'
  | 'SUGGESTED_TOPIC_TWEET'
  | 'TWEET'
  | 'UNAVAILABLE'
  | 'UNAVAILABLE_QUOTE_TWEET'
  | 'UNAVAILABLE_RETWEET'

export type TimelineOptions = {
  classifyTweets?: boolean
  hideHeadings?: boolean
  isTabbed?: boolean
  tabbedTimelineContainerSelector?: string
}

export type VerifiedAccountsConfig = 'highlight' | 'hide' | 'ignore'
