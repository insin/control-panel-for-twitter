export type AlgorithmicTweetsConfig = 'hide' | 'ignore'

export type Config = {
  // Shared
  addAddMutedWordMenuItem: boolean
  alwaysUseLatestTweets: boolean
  fastBlock: boolean
  hideAnalyticsNav: boolean
  hideBookmarksNav: boolean
  hideListsNav: boolean
  hideMomentsNav: boolean
  hideMoreTweets: boolean
  hideNewslettersNav: boolean
  hideShareTweetButton: boolean
  hideTopicsNav: boolean
  hideTweetAnalyticsLinks: boolean
  hideTwitterAdsNav: boolean
  hideUnavailableQuoteTweets: boolean
  hideWhoToFollowEtc: boolean
  likedTweets: AlgorithmicTweetsConfig
  quoteTweets: SharedTweetsConfig
  repliedToTweets: AlgorithmicTweetsConfig
  retweets: SharedTweetsConfig
  suggestedTopicTweets: AlgorithmicTweetsConfig
  tweakQuoteTweetsPage: boolean
  // Experiments
  disableTimeline: boolean
  disabledTimelineRedirect: 'notifications' | 'messages'
  hideMetrics: boolean
  reducedInteractionMode: boolean
  verifiedAccounts: VerifiedAccountsConfig
  // Desktop only
  hideAccountSwitcher: boolean
  hideExploreNav: boolean
  hideMessagesDrawer: boolean
  hideSidebarContent: boolean
  navBaseFontSize: boolean
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
  | 'HOME'
  | 'LATEST_TWEETS'
  | 'QUOTE_TWEET'
  | 'QUOTE_TWEETS'
  | 'RETWEETS'
  | 'SHARED_TWEETS'
  | 'TWITTER'

export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type TimelineItemType =
  | 'HEADING'
  | 'LIKED'
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'REPLIED'
  | 'RETWEET'
  | 'SUGGESTED_TOPIC_TWEET'
  | 'TWEET'
  | 'UNAVAILABLE_QUOTE_TWEET'

export type VerifiedAccountsConfig = 'highlight' | 'hide' | 'ignore'
