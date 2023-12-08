export type Config = {
  debug: boolean
  version?: 'desktop' | 'mobile'
  // Shared
  addAddMutedWordMenuItem: boolean
  // XXX This is now more like "use the Following tab by default"
  alwaysUseLatestTweets: boolean
  defaultToLatestSearch: boolean
  disableHomeTimeline: boolean
  disabledHomeTimelineRedirect: 'notifications' | 'messages'
  disableTweetTextFormatting: boolean
  dontUseChirpFont: boolean
  dropdownMenuFontWeight: boolean
  fastBlock: boolean
  followButtonStyle: 'monochrome' | 'themed'
  hideAnalyticsNav: boolean
  hideBlueReplyFollowedBy: boolean
  hideBlueReplyFollowing: boolean
  hideBookmarkButton: boolean
  hideBookmarkMetrics: boolean
  hideBookmarksNav: boolean
  hideCommunitiesNav: boolean
  hideConnectNav: boolean
  hideFollowingMetrics: boolean
  hideForYouTimeline: boolean
  hideHelpCenterNav: boolean
  hideKeyboardShortcutsNav: boolean
  hideLikeMetrics: boolean
  hideListsNav: boolean
  hideMetrics: boolean
  hideMonetizationNav: boolean
  hideMoreTweets: boolean
  hideOwnRetweetHome : boolean
  hideProfileRetweets: boolean
  hideQuoteTweetMetrics: boolean
  hideReplyMetrics: boolean
  hideRetweetMetrics: boolean
  hideSeeNewTweets: boolean
  hideShareTweetButton: boolean
  hideSubscriptions: boolean
  hideTimelineTweetBox: boolean
  hideTotalTweetsMetrics: boolean
  hideTweetAnalyticsLinks: boolean
  hideTwitterAdsNav: boolean
  hideTwitterBlueReplies: boolean
  hideTwitterBlueUpsells: boolean
  hideUnavailableQuoteTweets: boolean
  // XXX This now also controls hiding Verified Followers
  hideVerifiedNotificationsTab: boolean
  hideViews: boolean
  hideWhoToFollowEtc: boolean
  listRetweets: 'ignore' | 'hide'
  mutableQuoteTweets: boolean
  mutedQuotes: QuotedTweet[]
  quoteTweets: SharedTweetsConfig
  reducedInteractionMode: boolean
  // XXX This now controls all replacement of X brand changes
  replaceLogo: boolean
  restoreLinkHeadlines: boolean
  restoreQuoteTweetsLink: boolean
  restoreOtherInteractionLinks: boolean
  retweets: SharedTweetsConfig
  showBlueReplyFollowersCount: boolean
  showBlueReplyVerifiedAccounts: boolean
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
  hideExploreNavWithSidebar: boolean
  hideMessagesDrawer: boolean
  hideSidebarContent: boolean
  navBaseFontSize: boolean
  navDensity: 'default' | 'comfortable' | 'compact'
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
  | 'LIKES'
  | 'MUTE_THIS_CONVERSATION'
  | 'POST_ALL'
  | 'QUOTE'
  | 'QUOTE_TWEET'
  | 'QUOTE_TWEETS'
  | 'REPOST'
  | 'REPOSTS'
  | 'RETWEET'
  | 'RETWEETED_BY'
  | 'RETWEETS'
  | 'SHARED_TWEETS'
  | 'SHOW'
  | 'SHOW_MORE_REPLIES'
  | 'TURN_OFF_RETWEETS'
  | 'TURN_ON_RETWEETS'
  | 'TWEET'
  | 'TWEETS'
  | 'TWEET_ALL'
  | 'TWEET_INTERACTIONS'
  | 'TWEET_YOUR_REPLY'
  | 'TWITTER'
  | 'UNDO_RETWEET'

export type NamedMutationObserver = MutationObserver & {name?: string}

export type Disconnectable = NamedMutationObserver|{disconnect(): void}

export type QuotedTweet = {
  user: string
  time: string
  text?: string
}

export type SharedTweetsConfig = 'separate' | 'hide' | 'ignore'

export type TweetType =
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
  | 'VERIFIED_ORG_REPLY'
  | 'DISCOVER_MORE_HEADING'
  | 'DISCOVER_MORE_TWEET'
  | 'FOCUSED_TWEET'
  | 'HEADING'
  | 'SHOW_MORE'
  | 'SUBSEQUENT_ITEM'
  | 'UNAVAILABLE'

export type TimelineOptions = {
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
  observers: Disconnectable[]
}

export type UserInfo = {
  following: boolean
  followedBy: boolean
  followersCount: number
}

export type UserInfoObject = {[index: string]: UserInfo}

export type VerifiedType = 'BLUE' | 'VERIFIED_ORG'
