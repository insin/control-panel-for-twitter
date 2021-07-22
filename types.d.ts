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
  hideTopicsNav: boolean
  hideTwitterAdsNav: boolean
  hideWhoToFollowEtc: boolean
  quoteTweets: SharedTweetsConfig
  retweets: SharedTweetsConfig
  tweakQuoteTweetsPage: boolean
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
  [key in LocaleKey]?:string
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
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'RETWEET'
  | 'TWEET'

export type VerifiedAccountsConfig = 'highlight' | 'hide' | 'ignore'
