export type Config = {
  enabled: boolean
  debug: boolean
  debugLogTimelineStats: boolean
  version?: 'desktop' | 'mobile'
  // Shared
  addAddMutedWordMenuItem: boolean
  // XXX This is now more like "use the Following tab by default"
  alwaysUseLatestTweets: boolean
  bypassAgeVerification: boolean
  defaultToLatestSearch: boolean
  disableHomeTimeline: boolean
  disabledHomeTimelineRedirect: 'notifications' | 'messages'
  disableTweetTextFormatting: boolean
  dontUseChirpFont: boolean
  dropdownMenuFontWeight: boolean
  fastBlock: boolean
  followButtonStyle: 'monochrome' | 'themed'
  hideAdsNav: boolean
  hideBookmarkButton: boolean
  hideBookmarkMetrics: boolean
  hideBookmarksNav: boolean
  hideChatNav: boolean
  hideCommunitiesNav: boolean
  hideComposeTweet: boolean
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
  // XXX This now controls hiding all "Discover" suggestions
  hideMoreTweets: boolean
  hideNotificationLikes: boolean
  hideNotifications: 'ignore' | 'badges' | 'hide'
  hideProfileRetweets: boolean
  showOwnRetweets: boolean
  hideQuoteTweetMetrics: boolean
  hideQuotesFrom: string[]
  hideReplyMetrics: boolean
  hideRetweetMetrics: boolean
  hideSeeNewTweets: boolean
  hideShareTweetButton: boolean
  hideSpacesNav: boolean
  hideSubscriptions: boolean
  // XXX This now controls hiding profile header metrics
  hideTotalTweetsMetrics: boolean
  hideTweetAnalyticsLinks: boolean
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
  redirectToTwitter: boolean
  reducedInteractionMode: boolean
  // XXX This now controls all replacement of X brand changes
  replaceLogo: boolean
  restoreLinkHeadlines: boolean
  restoreQuoteTweetsLink: boolean
  restoreOtherInteractionLinks: boolean
  restoreTweetSource: boolean
  retweets: SharedTweetsConfig
  showBlueReplyFollowersCount: boolean
  showBlueReplyFollowersCountAmount: string
  showBookmarkButtonUnderFocusedTweets: boolean
  showPremiumReplyBusiness: boolean
  showPremiumReplyFollowedBy: boolean
  showPremiumReplyFollowing: boolean
  showPremiumReplyGovernment: boolean
  sortReplies: 'relevant' | 'recent' | 'liked'
  tweakNewLayout: boolean
  tweakQuoteTweetsPage: boolean
  twitterBlueChecks: 'ignore' | 'replace' | 'hide'
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
  | 'PINNED_TWEET'
  | 'PROMOTED_TWEET'
  | 'QUOTE_TWEET'
  | 'RETWEET'
  | 'RETWEETED_QUOTE_TWEET'
  | 'RETWEET_OF_MINE'
  | 'RETWEETED_QUOTE_TWEET_OF_MINE'
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
  seen: WeakMap<Element, IndividualTweetDetails>
}

export type IndividualTweetDetails = {
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
