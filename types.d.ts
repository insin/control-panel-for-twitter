export type AlgorithmicTweetsConfig = 'hide' | 'ignore'

export type Config = {
  debug: boolean,
  // Shared
  addAddMutedWordMenuItem: boolean
  alwaysUseLatestTweets: boolean
  dontUseChirpFont: boolean
  fastBlock: boolean
  followButtonStyle: 'monochrome' | 'themed'
  followeesFollows: AlgorithmicTweetsConfig
  hideAnalyticsNav: boolean
  hideBookmarksNav: boolean
  hideCommunitiesNav: boolean
  hideHelpCenterNav: boolean
  hideKeyboardShortcutsNav: boolean
  hideListsNav: boolean
  hideMomentsNav: boolean
  hideMoreTweets: boolean
  hideNewslettersNav: boolean
  hideShareTweetButton: boolean
  hideTopicsNav: boolean
  hideTweetAnalyticsLinks: boolean
  hideTwitterAdsNav: boolean
  hideTwitterBlueNav: boolean
  hideTwitterForProfessionalsNav: boolean
  hideUnavailableQuoteTweets: boolean
  hideWhoToFollowEtc: boolean
  likedTweets: AlgorithmicTweetsConfig
  listTweets: AlgorithmicTweetsConfig
  mutableQuoteTweets: boolean
  mutedQuotes: QuotedTweet[]
  quoteTweets: SharedTweetsConfig
  repliedToTweets: AlgorithmicTweetsConfig
  retweets: SharedTweetsConfig
  suggestedTopicTweets: AlgorithmicTweetsConfig
  tweakQuoteTweetsPage: boolean
  uninvertFollowButtons: boolean
  // Experiments
  disableHomeTimeline: boolean
  disabledHomeTimelineRedirect: 'notifications' | 'messages'
  fullWidthContent: boolean
  fullWidthMedia: boolean
  hideMetrics: boolean
  hideFollowingMetrics: boolean
  hideLikeMetrics: boolean
  hideQuoteTweetMetrics: boolean
  hideReplyMetrics: boolean
  hideRetweetMetrics: boolean
  hideTotalTweetsMetrics: boolean
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
  | 'HOME'
  | 'LATEST_TWEETS'
  | 'MUTE_THIS_CONVERSATION'
  | 'QUOTE_TWEET'
  | 'QUOTE_TWEETS'
  | 'RETWEETS'
  | 'SHARED_TWEETS'
  | 'TIMELINE_OPTIONS'
  | 'TWITTER'

export type QuotedTweet = {
  user: string
  time: string
  text: string
}

export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type TimelineItemType =
  | 'HEADING'
  | 'FOLLOWEES_FOLLOWS'
  | 'LIKED'
  | 'LIST_TWEET'
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'REPLIED'
  | 'RETWEET'
  | 'RETWEETED_QUOTE_TWEET'
  | 'SUGGESTED_TOPIC_TWEET'
  | 'TWEET'
  | 'UNAVAILABLE_QUOTE_TWEET'
  | 'UNAVAILABLE_RETWEET'

export type VerifiedAccountsConfig = 'highlight' | 'hide' | 'ignore'
