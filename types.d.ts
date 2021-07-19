export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type VerifiedAccountsConfig = 'highlight' | 'hide' | 'ignore'

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
  focusSearchOnExplorePage: boolean
  hideAppNags: boolean
  hideMessagesBottomNavItem: boolean
}