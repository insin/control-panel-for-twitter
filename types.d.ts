export type Config = {
  debug: boolean
  version?: 'desktop' | 'mobile'
  // Shared
  addAddMutedWordMenuItem: boolean
  // XXX This is now more like "use Following tab by default"
  alwaysUseLatestTweets: boolean
  defaultToLatestSearch: boolean
  disableHomeTimeline: boolean
  disabledHomeTimelineRedirect: 'notifications' | 'messages'
  dontUseChirpFont: boolean
  dropdownMenuFontWeight: boolean
  fastBlock: boolean
  followButtonStyle: 'monochrome' | 'themed'
  hideAnalyticsNav: boolean
  hideBookmarkButton: boolean
  hideBookmarkMetrics: boolean
  hideBookmarksNav: boolean
  hideCommunitiesNav: boolean
  hideConnectNav: boolean
  hideFollowingMetrics: boolean
  hideForYouTimeline: boolean
  hideHelpCenterNav: boolean
  hideHomeHeading: boolean
  hideKeyboardShortcutsNav: boolean
  hideLikeMetrics: boolean
  hideListsNav: boolean
  hideMetrics: boolean
  hideMonetizationNav: boolean
  hideMoreTweets: boolean
  hideQuoteTweetMetrics: boolean
  hideReplyMetrics: boolean
  hideRetweetMetrics: boolean
  hideSeeNewTweets: boolean
  hideShareTweetButton: boolean
  hideTotalTweetsMetrics: boolean
  hideTweetAnalyticsLinks: boolean
  hideTwitterAdsNav: boolean
  hideTwitterBlueNav: boolean
  hideTwitterCircleNav: boolean
  hideTwitterForProfessionalsNav: boolean
  hideUnavailableQuoteTweets: boolean
  hideVerifiedNotificationsTab: boolean
  hideVerifiedOrgsNav: boolean
  hideViews: boolean
  hideWhoToFollowEtc: boolean
  listRetweets: 'ignore' | 'hide'
  mutableQuoteTweets: boolean
  mutedQuotes: QuotedTweet[]
  quoteTweets: SharedTweetsConfig
  reducedInteractionMode: boolean
  retweets: SharedTweetsConfig
  tweakQuoteTweetsPage: boolean
  twitterBlueChecks: 'ignore' | 'replace' | 'hide'
  uninvertFollowButtons: boolean
  // Experiments
  // none currently
  // Desktop only
  fullWidthContent: boolean
  fullWidthMedia: boolean
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
  | 'HOME'
  | 'MUTE_THIS_CONVERSATION'
  | 'QUOTE_TWEET'
  | 'QUOTE_TWEETS'
  | 'RETWEETS'
  | 'SHARED_TWEETS'
  | 'TWITTER'
  | 'TURN_OFF_RETWEETS'
  | 'TURN_ON_RETWEETS'

export type NamedMutationObserver = MutationObserver & {name?: string}

export type Disconnectable = NamedMutationObserver|{disconnect(): void}

export type QuotedTweet = {
  user: string
  time: string
  text: string
}

export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type TimelineItemType =
  | 'DISCOVER_MORE_HEADING'
  | 'HEADING'
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'RETWEET'
  | 'RETWEETED_QUOTE_TWEET'
  | 'TWEET'
  | 'UNAVAILABLE'
  | 'UNAVAILABLE_QUOTE_TWEET'
  | 'UNAVAILABLE_RETWEET'

export type TimelineOptions = {
  classifyTweets?: boolean
  hideHeadings?: boolean
  isTabbed?: boolean
  onTabChanged?: () => void
  onTimelineAppeared?: () => void
  tabbedTimelineContainerSelector?: string
  timelineSelector?: string
}
