void function() {

//#region Default settings
/**
 * @type {import("./types").UserSettings}
 */
const DEFAULT_SETTINGS = {
  // Pro
  customTheme: '',
  mutedWords: '',
  mutedWordsError: false,
  // Shared
  addAddMutedWordMenuItem: true,
  addFocusedTweetAccountLocation: false,
  bypassAgeVerification: true,
  bypassMediaContextMenu: true,
  cleanTweetLinks: true,
  darkModeTheme: 'lightsOut',
  defaultFollowingToRecent: true,
  defaultToFollowing: true,
  defaultToLatestSearch: false,
  disableHomeTimeline: false,
  disableTweetTextFormatting: false,
  disableUsSportFeatures: true,
  disableVideoLooping: true,
  disabledHomeTimelineRedirect: 'notifications',
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  fontSize: 'default',
  hideAdsNav: true,
  hideAiTweets: false,
  hideBookmarkButton: false,
  hideBookmarkMetrics: true,
  hideBusinessNav: true,
  hideCalls: false,
  hideChatNav: false,
  hideCommunitiesNav: false,
  hideComposeTweet: false,
  hideConnectNav: true,
  hideCreatorStudioNav: true,
  hideDiscoverSuggestions: true,
  hideEditImage: true,
  hideExplorePageContents: true,
  hideFollowingMenu: false,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideGrok: true,
  hideGrokTweets: false,
  hideHistoryNav: false,
  hideInlinePrompts: true,
  hideJobs: true,
  hideLikeMetrics: true,
  hideListRetweets: false,
  hideListsNav: false,
  hideManageTimelines: false,
  hideMetrics: false,
  hideMoney: true,
  hideMoreFromThisAuthor: true,
  hideNotificationLikes: false,
  hideNotificationRetweets: false,
  hideNotifications: 'ignore',
  hidePaidPartnerships: true,
  hidePremiumReplies: false,
  hidePremiumUpsells: true,
  hideProfileHeaderMetrics: true,
  hideProfileRetweets: false,
  hideQuoteTweetMetrics: true,
  hideQuotesFrom: [],
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideSeeNewTweets: false,
  hideShareTweetButton: false,
  hideSortRepliesMenu: false,
  hideSubscriptions: true,
  hideSuggestedContentSearch: true,
  hideSuggestedContentTimeline: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedTabs: true,
  hideViewActivityLinks: true,
  hideViews: true,
  lightModeTheme: 'light',
  mutableQuoteTweets: true,
  mutedQuotes: [],
  premiumBlueChecks: 'replace',
  quoteTweets: 'ignore',
  reducedInteractionMode: false,
  removeSidebarPanelGradients: false,
  restoreLinkHeadlines: true,
  restoreOtherInteractionLinks: true,
  restoreQuoteTweetsLink: true,
  retweets: 'separate',
  revertMediaCarousel: true,
  revertProfileTabs: false,
  revertTwemoji: true,
  revertXBranding: true,
  showBookmarkButtonUnderFocusedTweets: true,
  showPremiumReplyBusiness: true,
  showPremiumReplyFollowedBy: true,
  showPremiumReplyFollowersCount: false,
  showPremiumReplyFollowersCountAmount: '1000000',
  showPremiumReplyFollowing: true,
  showPremiumReplyGovernment: true,
  sortReplies: 'relevant',
  themeFollowButtons: true,
  tweetMediaGrid: false,
  tweakQuoteTweetsPage: true,
  unblurSensitiveContent: false,
  uninvertFollowButtons: true,
  // Desktop only
  addUserHoverCardAccountLocation: true,
  fullWidthContent: false,
  fullWidthMedia: true,
  hideAccountSwitcher: false,
  hideChatDrawer: true,
  hideExploreNav: true,
  hideExploreNavWithSidebar: true,
  hideLiveBroadcasts: false,
  hideSidebarContent: true,
  hideSidebarSearch: false,
  hideSpacesNav: false,
  hideSuggestedFollows: false,
  hideTimelineTweetBox: false,
  hideTodaysNews: false,
  hideWhatsHappening: false,
  navBaseFontSize: true,
  navDensity: 'default',
  showRelevantPeople: false,
  // Mobile only
  hideLiveBroadcastBar: false,
  preventNextVideoAutoplay: true,
  // Advanced
  customCss: '',
  enableCustomCss: true,
}
//#endregion

//#region Locales
/**
 * @type {Record<string, import("./types").Locale>}
 */
const locales = {
  ar: {
    ACCOUNT_BASED_IN: 'الحساب مقره في {country}',
    ADD_ANOTHER_TWEET: 'ضافة تغريدة أخرى',
    ADD_MUTED_WORD: 'إضافة كلمة مكتومة',
    AD_FROM: 'إعلان من {url}',
    EMBED_TWEET: 'تضمين التغريدة',
    FOLLOWING_USER: 'متابعة @{screenName}',
    FOLLOW_BACK_USER: 'رد المتابعة @{screenName}',
    FOLLOW_USER: 'متابعة {screenName}@',
    GROK_ACTIONS: 'إجراءات Grok',
    HOME: 'الرئيسيّة',
    LIKES: 'الإعجابات',
    LIKE_COUNT:
      '{formattedCount} {count, plural, zero {إعجاب} one {إعجاب} two {إعجابان} few {إعجابات} many {إعجابًا} other {إعجاب}}',
    LIVE_ON_X: 'بث مباشر على X',
    MEDIA_VIEWER: 'عارض الوسائط',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثة',
    NEW_TWEET: 'تغريدة جديدة',
    POST: 'نشر',
    POST_ALL: 'نشر الكل',
    POST_TITLE: '{name} على X: "{text}"',
    POST_UNAVAILABLE: 'هذا المنشور غير متاح.',
    PROFILE_SUMMARY: 'ملخص الملف الشخصيّ',
    QUOTE: 'اقتباس',
    QUOTES: 'اقتباسات',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, zero {اقتباس} one {اقتباس} two {اقتباس} few {اقتباس} many {اقتباس} other {اقتباس}}',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, zero {تغريدة اقتباس} one {تغريدة اقتباس واحدة} two {تغريدتا اقتباس} few {تغريدات اقتباس} many {تغريدة اقتباس} other {تغريدة اقتباس}}',
    RECENT: 'الأخيرة',
    REPORT_TWEET: 'الإبلاغ عن التغريدة',
    REPOST: 'إعادة النشر',
    REPOSTS: 'المنشورات المُعاد نشرها',
    REPOST_COUNT:
      '{formattedCount} {count, plural, zero {إعادة نشر} one {إعادة نشر} two {إعادة نشر} few {إعادة نشر} many {إعادة نشر} other {إعادة نشر}}',
    RETWEET: 'إعادة التغريد',
    RETWEETS: 'إعادات التغريد',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, zero {إعادة تغريد} one {إعادة تغريد} two {إعادتا تغريد} few {إعادات تغريد} many {إعادة تغريد} other {إعادة تغريد}}',
    SHARED: 'مشترك',
    SHARED_TWEETS: 'التغريدات المشتركة',
    SHOW: 'إظهار',
    SHOW_MORE_REPLIES: 'عرض المزيد من الردود',
    SHOW_TWEETS:
      '{count, plural, zero {عرض # تغريدة} one {عرض # تغريدة} two {عرض # تغريدتين} few {عرض # تغريدات} many {عرض # تغريدة} other {عرض # تغريدة}}',
    SORT_BY: 'فرز حسب',
    SORT_REPLIES: 'فرز الردود',
    TURN_OFF_QUOTE_TWEETS: 'تعطيل تغريدات اقتباس',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWEET: 'تغريد',
    TWEETED: 'غرَّد',
    TWEETS: 'التغريدات',
    TWEET_ALL: 'تغريد الكل',
    TWEET_ANALYTICS: 'تحليلات التغريدة',
    TWEET_COUNT:
      '{formattedCount} {count, plural, zero {تغريدة} one {تغريدة واحدة} two {تغريدتان} few {تغريدات} many {تغريدةً} other {تغريدة}}',
    TWEET_INTERACTIONS: 'تفاعلات التغريدة',
    TWEET_NOUN: 'تغريدة',
    TWEET_SENT: 'تم إرسال تغريدتك.',
    TWEET_TITLE: '{name} على تويتر: "{text}"',
    TWEET_YOUR_REPLY: 'التغريد بردك',
    TWITTER: 'تويتر',
    UNDO_RETWEET: 'التراجع عن التغريدة',
    UNFOLLOW_USER: 'إلغاء متابعة {screenName}@',
    UNSENT_TWEETS: 'التغريدات غير المرسلة',
    USER_RETWEETED: 'أعاد التغريد {name}',
    VIEW: 'عرض',
    VIEW_TWEET_ANALYTICS: 'عرض تحليلات Twitter',
    YOU_RETWEETED: 'أعدت تغريد',
  },
  'ar-x-fm': {
    ACCOUNT_BASED_IN: 'حساب مقره في {country}',
    ADD_ANOTHER_TWEET: 'ضافة تغريدة أخرى',
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    AD_FROM: 'إعلان من {url}',
    EMBED_TWEET: 'تضمين التغريدة',
    FOLLOWING_USER: 'متابعة @{screenName}',
    FOLLOW_BACK_USER: 'ردي المتابعة لـ @{screenName}',
    FOLLOW_USER: 'متابعة {screenName}@',
    GROK_ACTIONS: 'إجراءات Grok',
    HOME: 'الرئيسيّة',
    LIKES: 'الإعجابات',
    LIKE_COUNT:
      '{formattedCount} {count, plural, zero {إعجاب} one {إعجاب} two {إعجابان} few {إعجابات} many {إعجابًا} other {إعجاب}}',
    LIVE_ON_X: 'بث مباشر على X',
    MEDIA_VIEWER: 'عارض الوسائط',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    NEW_TWEET: 'تغريدة جديدة',
    POST: 'نشر',
    POST_ALL: 'نشر الكل',
    POST_TITLE: '{name} على X: "{text}"',
    POST_UNAVAILABLE: 'هذا المنشور غير متاح.',
    PROFILE_SUMMARY: 'ملخص الملف الشخصيّ',
    QUOTES: 'اقتباسات',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, zero {اقتباس} one {اقتباس} two {اقتباسين} few {اقتباسات} many {اقتباس} other {اقتباس}}',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, zero {تغريدة اقتباس} one {تغريدة اقتباس واحدة} two {تغريدتا اقتباس} few {تغريدات اقتباس} many {تغريدة اقتباس} other {تغريدة اقتباس}}',
    RECENT: 'الحديثة',
    REPORT_TWEET: 'الإبلاغ عن التغريدة',
    REPOST: 'إعادة النشر',
    REPOSTS: 'المنشورات المُعاد نشرها',
    REPOST_COUNT:
      '{formattedCount} {count, plural, zero {إعادة نشر} one {إعادة نشر} two {إعادتا نشر} few {إعادات نشر} many {إعادة نشر} other {إعادة نشر}}',
    RETWEET: 'إعادة التغريد',
    RETWEETS: 'إعادات التغريد',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, zero {إعادة تغريد} one {إعادة تغريد} two {إعادتا تغريد} few {إعادات تغريد} many {إعادة تغريد} other {إعادة تغريد}}',
    SHARED: 'مشترك',
    SHARED_TWEETS: 'التغريدات المشتركة',
    SHOW: 'إظهار',
    SHOW_MORE_REPLIES: 'عرض المزيد من الردود',
    SHOW_TWEETS:
      '{count, plural, zero {عرض # تغريدة} one {عرض # تغريدة} two {عرض # تغريدتين} few {عرض # تغريدات} many {عرض # تغريدة} other {عرض # تغريدة}}',
    SORT_BY: 'فرز حسب',
    SORT_REPLIES: 'فرز الردود',
    TURN_OFF_QUOTE_TWEETS: 'تعطيل تغريدات اقتباس',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWEET: 'غرّدي',
    TWEETED: 'غرّدت',
    TWEETS: 'التغريدات',
    TWEET_ALL: 'تغريد الكل',
    TWEET_ANALYTICS: 'تحليلات التغريدة',
    TWEET_COUNT:
      '{formattedCount} {count, plural, zero {تغريدة} one {تغريدة واحدة} two {تغريدتان} few {تغريدةً} many {تغريدةً} other {تغريدة}}',
    TWEET_INTERACTIONS: 'تفاعلات التغريدة',
    TWEET_NOUN: 'تغريدة',
    TWEET_SENT: 'تم إرسال تغريدتكِ.',
    TWEET_TITLE: '{name} على تويتر: "{text}"',
    TWEET_YOUR_REPLY: 'التغريد بردك',
    TWITTER: 'تويتر',
    UNDO_RETWEET: 'التراجع عن التغريدة',
    UNFOLLOW_USER: 'إلغاء متابِعة @{screenName}',
    UNSENT_TWEETS: 'التغريدات غير المرسلة',
    USER_RETWEETED: 'أعادت التغريد {name}',
    VIEW: 'عرض',
    VIEW_TWEET_ANALYTICS: 'عرض تحليلات Twitter',
    YOU_RETWEETED: 'أعدتِ تغريد',
  },
  bg: {
    ACCOUNT_BASED_IN: 'Профил, базиран в/ъв  {country}',
    ADD_ANOTHER_TWEET: 'Добавяне на друг туит',
    ADD_MUTED_WORD: 'Добавяне на заглушена дума',
    AD_FROM: 'Реклама от {url}',
    EMBED_TWEET: 'Вграждане на туит',
    FOLLOWING_USER: 'Следваш @{screenName}',
    FOLLOW_BACK_USER: 'Следвай обратно @{screenName}',
    FOLLOW_USER: 'Следване на @{screenName}',
    GROK_ACTIONS: 'Действия, свързани с Grok',
    HOME: 'Начало',
    LIKES: 'Харесвания',
    LIKE_COUNT: '{formattedCount} {count, plural, one {харесване} other {харесвания}}',
    LIVE_ON_X: 'На живо в X',
    MEDIA_VIEWER: 'Преглед на мултимедийно съдържание',
    MUTE_THIS_CONVERSATION: 'Заглушаване на разговора',
    NEW_TWEET: 'Нов туит',
    POST: 'Публикуване',
    POST_ALL: 'Публикуване на всичко',
    POST_TITLE: '{name} в X: „{text}“',
    POST_UNAVAILABLE: 'Тази публикация не е налична.',
    PROFILE_SUMMARY: 'Резюме на профила',
    QUOTE: 'Цитат',
    QUOTES: 'Цитати',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {цитат} other {цитати}}',
    QUOTE_TWEET: 'Цитиране на туита',
    QUOTE_TWEETS: 'Туитове с цитат',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Туит с цитат} other {туита с цитат}}',
    RECENT: 'Скорошни',
    REPORT_TWEET: 'Докладване на туита',
    REPOST: 'Препубликуване',
    REPOSTS: 'Препубликувания',
    REPOST_COUNT: '{formattedCount} {count, plural, one {препубликуване} other {препубликувания}}',
    RETWEET: 'Ретуитване',
    RETWEETS: 'Ретуитове',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {ретуит} other {ретуита}}',
    SHARED: 'Споделен',
    SHARED_TWEETS: 'Споделени туитове',
    SHOW: 'Показване',
    SHOW_MORE_REPLIES: 'Показване на още отговори',
    SHOW_TWEETS: '{count, plural, one {Показване на # туит} other {Показване на # туита}}',
    SORT_BY: 'Сортиране по',
    SORT_REPLIES: 'Сортиране на отговорите',
    TURN_OFF_QUOTE_TWEETS: 'Изключване на туитове с цитат',
    TURN_OFF_RETWEETS: 'Изключване на ретуитовете',
    TURN_ON_RETWEETS: 'Включване на ретуитовете',
    TWEET: 'Туит',
    TWEETED: 'туитна',
    TWEETS: 'Туитове',
    TWEET_ALL: 'Туитване на всички',
    TWEET_ANALYTICS: 'Статистика за туита',
    TWEET_COUNT: '{formattedCount} {count, plural, one {туит} other {туита}}',
    TWEET_INTERACTIONS: 'Интеракции с туит',
    TWEET_NOUN: 'Туит',
    TWEET_SENT: 'Туитът ти бе изпратен.',
    TWEET_TITLE: '{name} в Twitter: „{text}“',
    TWEET_YOUR_REPLY: 'туит своя отговор',
    UNDO_RETWEET: 'Отмяна на ретуитването',
    UNFOLLOW_USER: 'Спиране на следването на @{screenName}',
    UNSENT_TWEETS: 'Неизпратени туитове',
    USER_RETWEETED: '{name} ретуитна',
    VIEW: 'Преглед',
    VIEW_TWEET_ANALYTICS: 'Преглед на статистиката за туита',
    YOU_RETWEETED: 'Ретуитна',
  },
  bn: {
    ACCOUNT_BASED_IN: '{country}-এ অবস্থিত অ্যাকাউন্ট ',
    ADD_ANOTHER_TWEET: 'অন্য টুইট যোগ করুন',
    ADD_MUTED_WORD: 'নীরব করা শব্দ যোগ করুন',
    AD_FROM: '{url} থেকে বিজ্ঞাপন',
    EMBED_TWEET: 'এম্বেড করা টুইট',
    FOLLOWING_USER: '@{screenName}-কে অনুসরণ করছেন',
    FOLLOW_BACK_USER: '@{screenName}-কে ফলো ব্যাক করুন',
    FOLLOW_USER: '@{screenName}-কে অনুসরণ করুন',
    GROK_ACTIONS: 'Grok কার্যকলাপ',
    HOME: 'হোম',
    LIKES: 'পছন্দ',
    LIKE_COUNT: '{formattedCount} {count, plural, one {পছন্দ} other {পছন্দগুলো}}',
    LIVE_ON_X: 'X-এ লাইভ',
    MEDIA_VIEWER: 'মিডিয়া ভিউয়ার',
    MUTE_THIS_CONVERSATION: 'এই কথা-বার্তা নীরব করুন',
    NEW_TWEET: 'নতুন টুইট',
    POST: 'পোস্ট',
    POST_ALL: 'সবকটি পোস্ট করুন',
    POST_TITLE: 'X-এ {name}: "{text}"',
    POST_UNAVAILABLE: 'এই পোস্টটি অনুপলভ্য।',
    PROFILE_SUMMARY: 'প্রোফাইল সারসংক্ষেপ',
    QUOTE: 'উদ্ধৃতি',
    QUOTES: 'উদ্ধৃতিগুলো',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {টুইট উদ্ধৃতি} other {টুইট উদ্ধৃতি}}',
    QUOTE_TWEET: 'টুইট উদ্ধৃত করুন',
    QUOTE_TWEETS: 'টুইট উদ্ধৃতিগুলো',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {উদ্ধৃতি টুইট} other {উদ্ধৃতি টুইটগুলি}}',
    RECENT: 'সাম্প্রতিক',
    REPORT_TWEET: 'টুইটের রিপোর্ট করুন',
    REPOST: 'রিপোস্ট',
    REPOSTS: 'রিপোস্ট',
    REPOST_COUNT: '{formattedCount} {count, plural, one {রিপোস্ট} other {রিপোস্ট}}',
    RETWEET: 'পুনঃটুইট',
    RETWEETS: 'পুনঃটুইটগুলো',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {পুনঃ টুইট করুন} other {পুনঃটুইটগুলো}}',
    SHARED: 'ভাগ করা',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
    SHOW: 'দেখান',
    SHOW_MORE_REPLIES: 'আরও উত্তর দেখান',
    SHOW_TWEETS: '{count, plural, one {# টুইট দেখান} other {# টুইটগুলো দেখান}}',
    SORT_BY: 'ক্রমানুসার',
    SORT_REPLIES: 'উত্তরগুলো বাছুন',
    TURN_OFF_QUOTE_TWEETS: 'উদ্ধৃতি টুইটগুলি বন্ধ করুন',
    TURN_OFF_RETWEETS: 'পুনঃ টুইটগুলি বন্ধ করুন',
    TURN_ON_RETWEETS: 'পুনঃ টুইটগুলি চালু করুন',
    TWEET: 'টুইট',
    TWEETED: 'টুইট করেছেন',
    TWEETS: 'টুইটগুলি',
    TWEET_ALL: 'সব টুইট করুন',
    TWEET_ANALYTICS: 'টুইট অ্যানালিটিক্স',
    TWEET_COUNT: '{formattedCount} {count, plural, one {টুইট} other {টুইটগুলি}}',
    TWEET_INTERACTIONS: 'টুইট ইন্টারেকশন',
    TWEET_NOUN: '-এর টুইট',
    TWEET_SENT: 'আপনার টুইট পাঠানো হয়েছে৷',
    TWEET_TITLE: 'Twitter-এ {name}: "{text}"',
    TWEET_YOUR_REPLY: 'আপনার উত্তর টুইট করুন',
    TWITTER: 'টুইটার',
    UNDO_RETWEET: 'পুনঃ টুইট পুর্বাবস্থায় ফেরান',
    UNFOLLOW_USER: '@{screenName} কে অনুসরণ বাতিল করুন',
    UNSENT_TWEETS: 'অপ্রেরিত টুইট',
    USER_RETWEETED: '{name} দ্বারা পুনঃ টুইটকৃত',
    VIEW: 'দেখুন',
    VIEW_TWEET_ANALYTICS: 'টুইটের বিশ্লেষণ দেখুন',
    YOU_RETWEETED: 'আপনি পুনঃ টুইট করেছেন',
  },
  ca: {
    ACCOUNT_BASED_IN: 'Compte amb seu a {country}',
    ADD_ANOTHER_TWEET: 'Afegeix un altre tuit',
    ADD_MUTED_WORD: 'Afegeix una paraula silenciada',
    AD_FROM: 'Anunci de {url}',
    EMBED_TWEET: 'Incrusta el tuit',
    FOLLOWING_USER: 'Seguint @{screenName}',
    FOLLOW_BACK_USER: 'Segueix de nou @{screenName}',
    FOLLOW_USER: 'Segueix @{screenName}',
    GROK_ACTIONS: 'Accions de Grok',
    HOME: 'Inici',
    LIKES: 'Agradaments',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {agradament} many {agradaments} other {agradaments}}',
    LIVE_ON_X: 'En directe a X',
    MEDIA_VIEWER: 'Visualitzador de contingut multimèdia',
    MUTE_THIS_CONVERSATION: 'Silencia la conversa',
    NEW_TWEET: 'Tuit nou',
    POST: 'Publica',
    POST_ALL: 'Publica-ho tot',
    POST_TITLE: '{name} a X: "{text}"',
    POST_UNAVAILABLE: 'Aquesta publicació no està disponible.',
    PROFILE_SUMMARY: 'Resum del perfil',
    QUOTE: 'Cita',
    QUOTES: 'Cites',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {Cita} other {Cita}}',
    QUOTE_TWEET: 'Cita el tuit',
    QUOTE_TWEETS: 'Tuits amb cita',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tuit amb cita} many {Tuits amb cita} other {Tuits amb cita}}',
    RECENT: 'Recents',
    REPORT_TWEET: 'Denuncia el tuit',
    REPOST: 'Republicació',
    REPOSTS: 'Republicacions',
    REPOST_COUNT: '{formattedCount} {count, plural, one {republicació} other {republicació}}',
    RETWEET: 'Retuit',
    RETWEETS: 'Retuits',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retuit} many {Retuits} other {Retuits}}',
    SHARED: 'Compartit',
    SHARED_TWEETS: 'Tuits compartits',
    SHOW: 'Mostra',
    SHOW_MORE_REPLIES: 'Mostra més respostes',
    SHOW_TWEETS:
      '{count, plural, one {Mostra # Tuit} many {Mostra # Tuits} other {Mostra # Tuits}}',
    SORT_BY: 'Ordena per',
    SORT_REPLIES: 'Ordena les respostes',
    TURN_OFF_QUOTE_TWEETS: 'Desactiva els tuits amb cita',
    TURN_OFF_RETWEETS: 'Desactiva els retuits',
    TURN_ON_RETWEETS: 'Activa els retuits',
    TWEET: 'Tuita',
    TWEETED: 'ha tuitat',
    TWEETS: 'Tuits',
    TWEET_ALL: 'Tuita-ho tot',
    TWEET_ANALYTICS: 'Analítica del tuit',
    TWEET_COUNT: '{formattedCount} {count, plural, one {tuit} many {tuits} other {tuits}}',
    TWEET_INTERACTIONS: 'Interaccions amb tuits',
    TWEET_NOUN: 'Tuit',
    TWEET_SENT: "S'ha enviat el tuit.",
    TWEET_TITLE: '{name} al Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tuita la teva resposta',
    UNDO_RETWEET: 'Desfés el retuit',
    UNFOLLOW_USER: 'Deixa de seguir @{screenName}',
    UNSENT_TWEETS: 'Tuits no enviats',
    USER_RETWEETED: '{name} ha retuitat',
    VIEW: 'Mostra',
    VIEW_TWEET_ANALYTICS: 'Mostra les analítiques del tuit',
    YOU_RETWEETED: 'Has retuitat',
  },
  cs: {
    ACCOUNT_BASED_IN: 'Účet se sídlem v {country}',
    ADD_ANOTHER_TWEET: 'Přidat další Tweet',
    ADD_MUTED_WORD: 'Přidat slovo na seznam skrytých slov',
    AD_FROM: 'Reklama z {url}',
    EMBED_TWEET: 'Vložit Tweet',
    FOLLOWING_USER: 'Sledujete uživatele @{screenName}',
    FOLLOW_BACK_USER: 'Sledovat zpět @{screenName}',
    FOLLOW_USER: 'Začít sledovat uživatele @{screenName}',
    GROK_ACTIONS: 'Akce funkce Grok',
    HOME: 'Hlavní stránka',
    LIKES: 'Lajky',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {lajk} few {lajky} many {lajky} other {lajků}}',
    LIVE_ON_X: 'Živě na platformě X',
    MEDIA_VIEWER: 'Prohlížeč médií',
    MUTE_THIS_CONVERSATION: 'Skrýt tuto konverzaci',
    NEW_TWEET: 'Nový Tweet',
    POST_ALL: 'Postovat vše',
    POST_TITLE: '{name} na platformě X: „{text}“',
    POST_UNAVAILABLE: 'Tento post není dostupný.',
    PROFILE_SUMMARY: 'Souhrn profilu',
    QUOTE: 'Citace',
    QUOTES: 'Citace',
    QUOTE_TWEET: 'Citovat Tweet',
    QUOTE_TWEETS: 'Tweety s citací',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet s citací} few {tweety s citací} many {tweetů s citací} other {tweetů s citací}}',
    RECENT: 'Poslední',
    REPORT_TWEET: 'Nahlásit Tweet',
    REPOSTS: 'Reposty',
    RETWEET: 'Retweetnout',
    RETWEETS: 'Retweety',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Retweet} few {Retweety} many {Retweety} other {Retweetů}}',
    SHARED: 'Sdílený',
    SHARED_TWEETS: 'Sdílené tweety',
    SHOW: 'Zobrazit',
    SHOW_MORE_REPLIES: 'Zobrazit další odpovědi',
    SHOW_TWEETS:
      '{count, plural, one {Ukázat # Tweet} few {Ukázat # tweety} many {Ukázat # tweety} other {Ukázat # tweetů}}',
    SORT_BY: 'Seřadit podle',
    SORT_REPLIES: 'Seřadit odpovědi',
    TURN_OFF_QUOTE_TWEETS: 'Vypnout tweety s citací',
    TURN_OFF_RETWEETS: 'Vypnout retweety',
    TURN_ON_RETWEETS: 'Zapnout retweety',
    TWEET: 'Tweetovat',
    TWEETED: 'tweetnul',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnout vše',
    TWEET_ANALYTICS: 'Analýza tweetů',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet} few {tweety} many {tweetů} other {tweetů}}',
    TWEET_INTERACTIONS: 'Interakce s Tweetem',
    TWEET_SENT: 'Váš Tweet byl odeslán.',
    TWEET_TITLE: 'Uživatel {name} na Twitteru: „{text}“',
    TWEET_YOUR_REPLY: 'Tweetujte svou odpověď',
    UNDO_RETWEET: 'Zrušit Retweet',
    UNFOLLOW_USER: 'Přestat sledovat uživatele @{screenName}',
    UNSENT_TWEETS: 'Neodeslané tweety',
    USER_RETWEETED: 'Uživatel {name} retweetnul',
    VIEW: 'Zobrazit',
    VIEW_TWEET_ANALYTICS: 'Zobrazit analýzu tweetů',
    YOU_RETWEETED: 'Retweetnuli jste',
  },
  da: {
    ACCOUNT_BASED_IN: 'Kontoen er hjemmehørende i {country}',
    ADD_ANOTHER_TWEET: 'Tilføj endnu et Tweet',
    ADD_MUTED_WORD: 'Tilføj skjult ord',
    AD_FROM: 'Annonce fra {url}',
    EMBED_TWEET: 'Indlejr Tweet',
    FOLLOWING_USER: 'Følger @{screenName}',
    FOLLOW_BACK_USER: 'Følg tilbage @{screenName}',
    FOLLOW_USER: 'Følg @{screenName}',
    GROK_ACTIONS: 'Grok-handlinger',
    HOME: 'Forside',
    LIKE_COUNT: '{formattedCount} {count, plural, one {like} other {likes}}',
    LIVE_ON_X: 'Direkte på X',
    MEDIA_VIEWER: 'Mediefremviser',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtale',
    NEW_TWEET: 'Nyt Tweet',
    POST_ALL: 'Post alle',
    POST_TITLE: '{name} på X: "{text}"',
    POST_UNAVAILABLE: 'Denne post er ikke tilgængelig.',
    PROFILE_SUMMARY: 'Profilresumé',
    QUOTE: 'Citat',
    QUOTES: 'Citater',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {Citér} other {Citér}}',
    QUOTE_TWEET: 'Citér Tweet',
    QUOTE_TWEETS: 'Citat-Tweets',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Citat-Tweet} other {Citat-Tweets}}',
    RECENT: 'Nye',
    REPORT_TWEET: 'Indberet Tweet',
    REPOST_COUNT: '{formattedCount} {count, plural, one {repost} other {repost}}',
    SHARED: 'Delt',
    SHARED_TWEETS: 'Delte tweets',
    SHOW: 'Vis',
    SHOW_MORE_REPLIES: 'Vis flere svar',
    SHOW_TWEETS: '{count, plural, one {Vis # Tweet} other {Vis # Tweets}}',
    SORT_BY: 'Sorter efter',
    SORT_REPLIES: 'Sortér svar',
    TURN_OFF_QUOTE_TWEETS: 'Slå Citat-Tweets fra',
    TURN_OFF_RETWEETS: 'Slå Retweets fra',
    TURN_ON_RETWEETS: 'Slå Retweets til',
    TWEETED: 'tweetede',
    TWEET_ALL: 'Tweet alt',
    TWEET_ANALYTICS: 'Tweet-statistik',
    TWEET_INTERACTIONS: 'Tweet-interaktioner',
    TWEET_SENT: 'Dit Tweet blev sendt.',
    TWEET_TITLE: '{name} på Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweet dit svar',
    UNDO_RETWEET: 'Fortryd Retweet',
    UNFOLLOW_USER: 'Følg ikke længere @{screenName}',
    UNSENT_TWEETS: 'Usendte Tweets',
    USER_RETWEETED: '{name} retweetede',
    VIEW: 'Vis',
    VIEW_TWEET_ANALYTICS: 'Vis Tweet-statistik',
    YOU_RETWEETED: 'Du retweetede',
  },
  de: {
    ACCOUNT_BASED_IN: 'Account mit Sitz in {country}',
    ADD_ANOTHER_TWEET: 'Weiteren Tweet hinzufügen',
    ADD_MUTED_WORD: 'Stummgeschaltetes Wort hinzufügen',
    AD_FROM: 'Anzeige von {url}',
    EMBED_TWEET: 'Tweet einbetten',
    FOLLOWING_USER: '@{screenName} gefolgt',
    FOLLOW_BACK_USER: '@{screenName} ebenfalls folgen',
    FOLLOW_USER: '@{screenName} folgen',
    GROK_ACTIONS: 'Grok-Aktionen',
    HOME: 'Startseite',
    LIKES: 'Gefällt mir',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {„Gefällt mir“-Angabe} other {„Gefällt mir“-Angaben}}',
    LIVE_ON_X: 'Live auf X',
    MUTE_THIS_CONVERSATION: 'Diesen Konversatiom stummschalten',
    NEW_TWEET: 'Neuer Tweet',
    POST_ALL: 'Alle posten',
    POST_TITLE: '{name} auf X: „{text}“',
    POST_UNAVAILABLE: 'Dieser Post ist nicht verfügbar.',
    PROFILE_SUMMARY: 'Kurzprofil',
    QUOTE: 'Zitat',
    QUOTES: 'Zitate',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {Zitieren} other {Zitieren}}',
    QUOTE_TWEET: 'Tweet zitieren',
    QUOTE_TWEETS: 'Zitierte Tweets',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Zitierter Tweet} other {Zitierte Tweets}}',
    RECENT: 'Neueste',
    REPORT_TWEET: 'Tweet melden',
    REPOST: 'Reposten',
    REPOST_COUNT: '{formattedCount} {count, plural, one {Repost} other {Reposts}}',
    RETWEET: 'Retweeten',
    SHARED: 'Geteilt',
    SHARED_TWEETS: 'Geteilte Tweets',
    SHOW: 'Anzeigen',
    SHOW_MORE_REPLIES: 'Mehr Antworten anzeigen',
    SHOW_TWEETS: '{count, plural, one {# Tweet anzeigen} other {# Tweets anzeigen}}',
    SORT_BY: 'Sortieren nach',
    SORT_REPLIES: 'Antworten sortieren',
    TURN_OFF_QUOTE_TWEETS: 'Zitierte Tweets ausschalten',
    TURN_OFF_RETWEETS: 'Retweets ausschalten',
    TURN_ON_RETWEETS: 'Retweets einschalten',
    TWEET: 'Twittern',
    TWEETED: 'hat getwittert',
    TWEET_ALL: 'Alle twittern',
    TWEET_ANALYTICS: 'Tweet-Statistiken',
    TWEET_INTERACTIONS: 'Tweet-Interaktionen',
    TWEET_SENT: 'Dein Tweet wurde gesendet.',
    TWEET_TITLE: '{name} auf Twitter: „{text}“',
    TWEET_YOUR_REPLY: 'Twittere deine Antwort',
    UNDO_RETWEET: 'Retweet rückgängig machen',
    UNFOLLOW_USER: '@{screenName} entfolgen',
    UNSENT_TWEETS: 'Nicht gesendete Tweets',
    USER_RETWEETED: '{name} hat retweetet',
    VIEW: 'Anzeigen',
    VIEW_TWEET_ANALYTICS: 'Tweet-Statistiken anzeigen',
    YOU_RETWEETED: 'Du hast retweetet',
  },
  el: {
    ACCOUNT_BASED_IN: 'Έδρα λογαριασμού: {country}',
    ADD_ANOTHER_TWEET: 'Προσθήκη άλλου Tweet',
    ADD_MUTED_WORD: 'Προσθήκη λέξης σε σίγαση',
    AD_FROM: 'Διαφήμιση από {url}',
    EMBED_TWEET: 'Ενσωμάτωση Tweet',
    FOLLOWING_USER: 'Σε ακολούθηση του @{screenName}',
    FOLLOW_BACK_USER: 'Ακολουθήστε και εσείς τον χρήστη @{screenName}',
    FOLLOW_USER: 'Ακολουθήστε τον χρήστη @{screenName}',
    GROK_ACTIONS: 'Δράσεις Grok',
    HOME: 'Αρχική σελίδα',
    LIKES: '"Μου αρέσει"',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {επισήμανση "Μου αρέσει"} other {επισημάνσεις "Μου αρέσει"}}',
    LIVE_ON_X: 'Ζωντανά στο X',
    MEDIA_VIEWER: 'Πρόγραμμα προβολής πολυμέσων',
    MUTE_THIS_CONVERSATION: 'Σίγαση αυτής της συζήτησης',
    NEW_TWEET: 'Νέο Tweet',
    POST: 'Δημοσίευση',
    POST_ALL: 'Δημοσίευση όλων',
    POST_TITLE: '{name}στο X: ""{text}',
    POST_UNAVAILABLE: 'Αυτή η ανάρτηση δεν είναι διαθέσιμη.',
    PROFILE_SUMMARY: ' Περίληψη προφίλ',
    QUOTE: 'Παράθεση',
    QUOTES: 'Παραθέσεις',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {Παράθεση ανάρτησης} other {Παράθεση ανάρτησης}}',
    QUOTE_TWEET: 'Παράθεση Tweet',
    QUOTE_TWEETS: 'Tweet με παράθεση',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet με παράθεση} other {Tweet με παράθεση}}',
    RECENT: 'Πρόσφατα',
    REPORT_TWEET: 'Αναφορά Tweet',
    REPOST: 'Αναδημοσίευση',
    REPOSTS: 'Αναδημοσιεύσεις',
    REPOST_COUNT: '{formattedCount} {count, plural, one {αναδημοσίευση} other {αναδημοσιεύσεις}}',
    RETWEETS: 'Retweet',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retweet} other {Retweet}}',
    SHARED: 'Κοινόχρηστο',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
    SHOW: 'Εμφάνιση',
    SHOW_MORE_REPLIES: 'Εμφάνιση περισσότερων απαντήσεων',
    SHOW_TWEETS: '{count, plural, one {Εμφάνιση # Tweet} other {Εμφάνιση # Tweet}}',
    SORT_BY: 'Ταξινόμηση κατά',
    SORT_REPLIES: 'Ταξινόμηση απαντήσεων',
    TURN_OFF_QUOTE_TWEETS: 'Απενεργοποίηση των tweet με παράθεση',
    TURN_OFF_RETWEETS: 'Απενεργοποίηση των Retweet',
    TURN_ON_RETWEETS: 'Ενεργοποίηση των Retweet',
    TWEETED: 'έγραψε Tweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Δημοσίευση όλων ως Tweet',
    TWEET_ANALYTICS: 'Στοιχεία ανάλυσης Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} other {Tweet}}',
    TWEET_INTERACTIONS: 'Αλληλεπιδράσεις με tweet',
    TWEET_SENT: 'Το Tweet σας εστάλη.',
    TWEET_TITLE: 'Ο χρήστης {name} στο Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Στείλτε την απάντησή σας',
    UNDO_RETWEET: 'Αναίρεση Retweet',
    UNFOLLOW_USER: 'Άρση ακολούθησης του χρήστη @{screenName}',
    UNSENT_TWEETS: 'Μη σταλμένα Tweet',
    USER_RETWEETED: 'Ο χρήστης {name} έκανε Retweet',
    VIEW: 'Προβολή',
    VIEW_TWEET_ANALYTICS: 'Προβολή στοιχείων ανάλυσης Tweet',
    YOU_RETWEETED: 'Κάνατε Retweet',
  },
  en: {
    ACCOUNT_BASED_IN: 'Account based in {country}',
    ADD_ANOTHER_TWEET: 'Add another Tweet',
    ADD_MUTED_WORD: 'Add muted word',
    AD_FROM: 'Ad from {url}',
    EMBED_TWEET: 'Embed Tweet',
    FOLLOWING_USER: 'Following @{screenName}',
    FOLLOW_BACK_USER: 'Follow back @{screenName}',
    FOLLOW_USER: 'Follow @{screenName}',
    GROK_ACTIONS: 'Grok actions',
    HOME: 'Home',
    LIKES: 'Likes',
    LIKE_COUNT: '{formattedCount} {count, plural, one {Like} other {Likes}}',
    LIVE_ON_X: 'Live on X',
    MEDIA_VIEWER: 'Media Viewer',
    MUTE_THIS_CONVERSATION: 'Mute this conversation',
    NEW_TWEET: 'New Tweet',
    POST: 'Post',
    POST_ALL: 'Post all',
    POST_TITLE: '{name} on X: "{text}"',
    POST_UNAVAILABLE: 'This post is unavailable.',
    PROFILE_SUMMARY: 'Profile Summary',
    QUOTE: 'Quote',
    QUOTES: 'Quotes',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {quote} other {quotes}}',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Quote Tweet} other {Quote Tweets}}',
    RECENT: 'Recent',
    REPORT_TWEET: 'Report Tweet',
    REPOST: 'Repost',
    REPOSTS: 'Reposts',
    REPOST_COUNT: '{formattedCount} {count, plural, one {repost} other {reposts}}',
    RETWEET: 'Retweet',
    RETWEETS: 'Retweets',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retweet} other {Retweets}}',
    SHARED: 'Shared',
    SHARED_TWEETS: 'Shared Tweets',
    SHOW: 'Show',
    SHOW_MORE_REPLIES: 'Show more replies',
    SHOW_TWEETS: '{count, plural, one {Show # Tweet} other {Show # Tweets}}',
    SORT_BY: 'Sort by',
    SORT_REPLIES: 'Sort replies',
    TURN_OFF_QUOTE_TWEETS: 'Turn off Quote Tweets',
    TURN_OFF_RETWEETS: 'Turn off Retweets',
    TURN_ON_RETWEETS: 'Turn on Retweets',
    TWEET: 'Tweet',
    TWEETED: 'Tweeted',
    TWEETS: 'Tweets',
    TWEET_ALL: 'Tweet all',
    TWEET_ANALYTICS: 'Tweet Analytics',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} other {Tweets}}',
    TWEET_INTERACTIONS: 'Tweet interactions',
    TWEET_NOUN: 'Tweet',
    TWEET_SENT: 'Your Tweet was sent.',
    TWEET_TITLE: '{name} on Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweet your reply',
    TWITTER: 'Twitter',
    UNDO_RETWEET: 'Undo Retweet',
    UNFOLLOW_USER: 'Unfollow @{screenName}',
    UNSENT_TWEETS: 'Unsent Tweets',
    USER_RETWEETED: '{name} Retweeted',
    VIEW: 'View',
    VIEW_TWEET_ANALYTICS: 'View Tweet analytics',
    YOU_RETWEETED: 'You Retweeted',
  },
  es: {
    ACCOUNT_BASED_IN: 'Cuenta con sede en {country}',
    ADD_ANOTHER_TWEET: 'Agregar otro Tweet',
    ADD_MUTED_WORD: 'Añadir palabra silenciada',
    AD_FROM: 'Anuncio de {url}',
    EMBED_TWEET: 'Insertar Tweet',
    FOLLOWING_USER: 'Siguiendo a @{screenName}',
    FOLLOW_BACK_USER: 'Seguir de vuelta @{screenName}',
    FOLLOW_USER: 'Seguir a @{screenName}',
    GROK_ACTIONS: 'Acciones de Grok',
    HOME: 'Inicio',
    LIKES: 'Me gusta',
    LIKE_COUNT: '{formattedCount} {count, plural, one {Me gusta} many {Me gusta} other {Me gusta}}',
    LIVE_ON_X: 'En directo en X',
    MEDIA_VIEWER: 'Visor de contenido multimedia',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversación',
    NEW_TWEET: 'Nuevo Tweet',
    POST_ALL: 'Postear todo',
    POST_TITLE: '{name} en X: "{text}"',
    POST_UNAVAILABLE: 'Este post no está disponible.',
    PROFILE_SUMMARY: 'Resumen del perfil',
    QUOTE: 'Cita',
    QUOTES: 'Citas',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {cita} other {citas}}',
    QUOTE_TWEET: 'Citar Tweet',
    QUOTE_TWEETS: 'Tweets citados',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet citado} many {Tweets citados} other {Tweets citados}}',
    RECENT: 'Recientes',
    REPORT_TWEET: 'Denunciar el Tweet',
    REPOST: 'Repostear',
    RETWEET: 'Retwittear',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Retweet} many {Retweets} other {Retweets}}',
    SHARED: 'Compartido',
    SHARED_TWEETS: 'Tweets compartidos',
    SHOW: 'Mostrar',
    SHOW_MORE_REPLIES: 'Mostrar más respuestas',
    SHOW_TWEETS:
      '{count, plural, one {Mostrar # Tweet} many {Mostrar # Tweets} other {Mostrar # Tweets}}',
    SORT_BY: 'Ordenar por',
    SORT_REPLIES: 'Organizar respuestas',
    TURN_OFF_QUOTE_TWEETS: 'Desactivar tweets citados',
    TURN_OFF_RETWEETS: 'Desactivar Retweets',
    TURN_ON_RETWEETS: 'Activar Retweets',
    TWEET: 'Twittear',
    TWEETED: 'twitteó',
    TWEET_ALL: 'Twittear todo',
    TWEET_ANALYTICS: 'Estadísticas de los Tweets',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} many {Tweets} other {Tweets}}',
    TWEET_INTERACTIONS: 'Interacciones con el Tweet',
    TWEET_SENT: 'Tu Tweet se envió.',
    TWEET_TITLE: '{name} en Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Twittea tu respuesta',
    UNDO_RETWEET: 'Deshacer Retweet',
    UNFOLLOW_USER: 'Dejar de seguir a @{screenName}',
    UNSENT_TWEETS: 'Tweets no enviados',
    USER_RETWEETED: '{name} retwitteó',
    VIEW: 'Ver',
    VIEW_TWEET_ANALYTICS: 'Ver estadísticas del Tweet',
    YOU_RETWEETED: 'Retwitteaste',
  },
  eu: {
    ADD_ANOTHER_TWEET: 'Gehitu beste txio bat',
    ADD_MUTED_WORD: 'Gehitu isilarazitako hitza',
    EMBED_TWEET: 'Kapsulatu txioa',
    HOME: 'Hasiera',
    LIKES: 'Atsegiteak',
    LIKE_COUNT: '{formattedCount} {count, plural, one {atsegite} other {atsegite}}',
    MUTE_THIS_CONVERSATION: 'Isilarazi elkarrizketa hau',
    NEW_TWEET: 'Txio berria',
    QUOTE: 'Aipamena',
    QUOTES: 'Aipamenak',
    QUOTE_TWEET: 'Txioa apaitu',
    QUOTE_TWEETS: 'Aipu-txioak',
    RECENT: 'Azkenak',
    REPORT_TWEET: 'Salatu Txioa',
    RETWEET: 'Bertxiotu',
    RETWEETS: 'Bertxioak',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {bertxio} other {bertxio}}',
    SHARED: 'Partekatua',
    SHARED_TWEETS: 'Partekatutako',
    SHOW: 'Erakutsi',
    SHOW_MORE_REPLIES: 'Erakutsi erantzun gehiago',
    SORT_BY: 'Ordenatzeko irizpidea:',
    TURN_OFF_QUOTE_TWEETS: 'Desaktibatu aipatu txioak',
    TURN_OFF_RETWEETS: 'Desaktibatu birtxioak',
    TURN_ON_RETWEETS: 'Aktibatu birtxioak',
    TWEET: 'Txio',
    TWEETED: 'Txiokatu du',
    TWEETS: 'Txioak',
    TWEET_ALL: 'Txiotu guztiak',
    TWEET_ANALYTICS: 'Txioei buruzko estatistikak',
    TWEET_INTERACTIONS: 'Txio elkarrekintzak',
    TWEET_NOUN: 'Txio',
    TWEET_SENT: 'Bidali da txioa.',
    TWEET_TITLE: '{name} Twitterren: "{text}"',
    TWEET_YOUR_REPLY: 'Txiotu zure erantzuna',
    UNDO_RETWEET: 'Desegin birtxiokatzea',
    UNSENT_TWEETS: 'Bidali gabeko txioak',
    USER_RETWEETED: '{name} erabiltzaileak bertxiotu du',
    VIEW: 'Ikusi',
    VIEW_TWEET_ANALYTICS: 'Ikusi txioen analisiak',
    YOU_RETWEETED: 'Zuk Bertxiotua',
  },
  fa: {
    ACCOUNT_BASED_IN: 'حساب مستقر در {country}',
    ADD_ANOTHER_TWEET: 'افزودن توییت دیگر',
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    AD_FROM: 'تبلیغ از {url}',
    EMBED_TWEET: 'جاسازی توییت',
    FOLLOWING_USER: 'در حال دنبال کردن @{screenName}',
    FOLLOW_BACK_USER: 'فالو بک @{screenName}',
    FOLLOW_USER: 'دنبال کردن @{screenName}',
    GROK_ACTIONS: 'کنش‌های Grok',
    HOME: 'خانه',
    LIKES: 'پسندها',
    LIKE_COUNT: '{formattedCount} {count, plural, one {پسند} other {پسند‌}}',
    LIVE_ON_X: 'زنده در X',
    MEDIA_VIEWER: 'نمایشگر رسانه',
    MUTE_THIS_CONVERSATION: 'خموش‌سازی این گفتگو',
    NEW_TWEET: 'توییت جدید',
    POST: 'پست',
    POST_ALL: 'پست کردن همه',
    POST_TITLE: '{name} در X: «{text}»',
    POST_UNAVAILABLE: 'این پست دردسترس نیست.',
    PROFILE_SUMMARY: 'خلاصه نمایه',
    QUOTE: 'نقل‌قول',
    QUOTES: 'نقل‌قول‌ها',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {نقل‌قول کردن} other {نقل‌قول کردن}}',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت‌ها',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {نقل‌توییت} other {نقل‌توییت}}',
    RECENT: 'اخیر',
    REPORT_TWEET: 'گزارش توییت',
    REPOST: 'بازپست',
    REPOSTS: 'بازپست',
    REPOST_COUNT: '{formattedCount} {count, plural, one {بازپست} other {بازپست‌}}',
    RETWEET: 'بازتوییت',
    RETWEETS: 'بازتوییت‌ها',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {بازتوییت} other {بازتوییت}}',
    SHARED: 'مشترک',
    SHARED_TWEETS: 'توییتهای مشترک',
    SHOW: 'نمایش',
    SHOW_MORE_REPLIES: 'نمایش پاسخ‌های بیشتر',
    SHOW_TWEETS: '{count, plural, one {نمایش # توییت} other {نمایش # توييت}}',
    SORT_BY: 'مرتب‌سازی براساس',
    SORT_REPLIES: 'مرتب‌سازی پاسخ‌ها',
    TURN_OFF_QUOTE_TWEETS: 'غیرفعال‌سازی نقل‌توییت‌ها',
    TURN_OFF_RETWEETS: 'غیرفعال‌سازی بازتوییت‌ها',
    TURN_ON_RETWEETS: 'فعال سازی بازتوییت‌ها',
    TWEET: 'توییت',
    TWEETED: 'توییت کرد',
    TWEETS: 'توييت‌ها',
    TWEET_ALL: 'توییت به همه',
    TWEET_ANALYTICS: 'اطلاعات آماری توییت',
    TWEET_COUNT: '{formattedCount} {count, plural, one {توییت} other {توييت}}',
    TWEET_INTERACTIONS: 'تعاملات توییت',
    TWEET_NOUN: 'توییت',
    TWEET_SENT: 'توییت شما فرستاده شد.',
    TWEET_TITLE: '{name} در توییتر: «{text}»',
    TWEET_YOUR_REPLY: 'پاسختان را توییت کنید',
    TWITTER: 'توییتر',
    UNDO_RETWEET: 'لغو بازتوییت',
    UNFOLLOW_USER: 'دنبال‌ نکردن @{screenName}',
    UNSENT_TWEETS: 'توییت‌های فرستاده‌نشده',
    USER_RETWEETED: '{name} بازتوییت کرد',
    VIEW: 'مشاهده',
    VIEW_TWEET_ANALYTICS: 'مشاهده اطلاعات آماری توییت',
    YOU_RETWEETED: 'شما بازتوییت کردید',
  },
  fi: {
    ACCOUNT_BASED_IN: 'Tili paikassa {country}',
    ADD_ANOTHER_TWEET: 'Lisää vielä twiitti',
    ADD_MUTED_WORD: 'Lisää hiljennetty sana',
    AD_FROM: 'Mainos osoitteesta {url}',
    EMBED_TWEET: 'Upota twiitti',
    FOLLOWING_USER: 'Seurataan käyttäjää @{screenName}',
    FOLLOW_BACK_USER: 'Seuraa käyttäjää @{screenName} takaisin',
    FOLLOW_USER: 'Seuraa käyttäjää @{screenName}',
    GROK_ACTIONS: 'Grok-toiminnat',
    HOME: 'Etusivu',
    LIKES: 'Tykkäykset',
    LIKE_COUNT: '{formattedCount} {count, plural, one {tykkäys} other {tykkäystä}}',
    LIVE_ON_X: 'Livenä X:ssä',
    MUTE_THIS_CONVERSATION: 'Hiljennä tämä keskustelu',
    NEW_TWEET: 'Uusi twiitti',
    POST: 'Julkaise',
    POST_ALL: 'Julkaise kaikki',
    POST_TITLE: '{name} X:ssä: ”{text}”',
    POST_UNAVAILABLE: 'Tämä julkaisu ei ole saatavilla.',
    PROFILE_SUMMARY: 'Profiilin yhteenveto',
    QUOTE: 'Lainaa',
    QUOTES: 'Lainaukset',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {lainaus} other {lainausta}}',
    QUOTE_TWEET: 'Twiitin lainaus',
    QUOTE_TWEETS: 'Twiitin lainaukset',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {twiitin lainaus} other {twiitin lainausta}}',
    RECENT: 'Viimeisimmät',
    REPORT_TWEET: 'Ilmianna twiitti',
    REPOST: 'Uudelleenjulkaise',
    REPOSTS: 'Uudelleenjulkaisut',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {uudelleenjulkaisu} other {uudelleenjulkaisua}}',
    RETWEET: 'Uudelleentwiittaa',
    RETWEETS: 'Uudelleentwiittaukset',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {uudelleentwiittaus} other {uudelleentwiittausta}}',
    SHARED: 'Jaettu',
    SHARED_TWEETS: 'Jaetut twiitit',
    SHOW: 'Näytä',
    SHOW_MORE_REPLIES: 'Näytä lisää vastauksia',
    SHOW_TWEETS: '{count, plural, one {Näytä # twiitti} other {Näytä # twiittiä}}',
    SORT_BY: 'Lajitteluperuste',
    SORT_REPLIES: 'Lajittele vastaukset',
    TURN_OFF_QUOTE_TWEETS: 'Poista twiitin lainaukset käytöstä',
    TURN_OFF_RETWEETS: 'Poista uudelleentwiittaukset käytöstä',
    TURN_ON_RETWEETS: 'Ota uudelleentwiittaukset käyttöön',
    TWEET: 'Twiittaa',
    TWEETED: 'twiittasi',
    TWEETS: 'Twiitit',
    TWEET_ALL: 'Twiittaa kaikki',
    TWEET_ANALYTICS: 'Twiittikohtaiset tilastot',
    TWEET_COUNT: '{formattedCount} {count, plural, one {twiitti} other {twiittiä}}',
    TWEET_INTERACTIONS: 'Twiitin vuorovaikutukset',
    TWEET_NOUN: 'twiitti',
    TWEET_SENT: 'Twiittisi on lähetetty.',
    TWEET_TITLE: '{name} Twitterissä: "{text}"',
    TWEET_YOUR_REPLY: 'Twiittaa vastauksesi',
    UNDO_RETWEET: 'Kumoa uudelleentwiittaus',
    UNFOLLOW_USER: 'Lopeta käyttäjän @{screenName} seuraaminen',
    UNSENT_TWEETS: 'Lähettämättömät twiitit',
    USER_RETWEETED: '{name} uudelleentwiittasi',
    VIEW: 'Näytä',
    VIEW_TWEET_ANALYTICS: 'Näytä twiitin tilastot',
    YOU_RETWEETED: 'Uudelleentwiittasit',
  },
  fil: {
    ACCOUNT_BASED_IN: 'Account base sa {country}',
    ADD_ANOTHER_TWEET: 'Magdagdag ng isa pang Tweet',
    ADD_MUTED_WORD: 'Idagdag ang naka-mute na salita',
    AD_FROM: 'Ad mula sa {url}',
    EMBED_TWEET: 'I-embed ang Tweet',
    FOLLOWING_USER: 'Fina-follow si @{screenName}',
    FOLLOW_BACK_USER: 'I-follow back si @{screenName}',
    FOLLOW_USER: 'Sundan si @{screenName}',
    GROK_ACTIONS: 'Mga aksyon ni Grok',
    LIKES: 'Mga Gusto',
    LIKE_COUNT: '{formattedCount} {count, plural, one {like} other {mga like}}',
    LIVE_ON_X: 'Live sa X',
    MUTE_THIS_CONVERSATION: 'I-mute ang usapang ito',
    NEW_TWEET: 'Bagong Tweet',
    POST_ALL: 'I-post lahat',
    POST_TITLE: '{name} sa X: "{text}"',
    POST_UNAVAILABLE: 'Hindi available ang post na Ito.',
    PROFILE_SUMMARY: 'Buod ng Profile',
    QUOTES: 'Mga Quote',
    QUOTE_TWEET: 'Quote na Tweet',
    QUOTE_TWEETS: 'Mga Quote na Tweet',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Quote na Tweet} other {Quote na Tweet}}',
    RECENT: 'Kamakailan',
    REPORT_TWEET: 'Iulat ang Tweet',
    REPOST: 'I-repost',
    REPOSTS: '(na) Repost',
    RETWEET: 'I-retweet',
    RETWEETS: 'Mga Retweet',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retweet} other {Mga Retweet}}',
    SHARED: 'Ibinahagi',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
    SHOW: 'Ipakita',
    SHOW_MORE_REPLIES: 'Magpakita pa ng mga sagot',
    SHOW_TWEETS: '{count, plural, one {Ipakita ang # Tweet} other {Ipakita ang # (na) Tweet}}',
    SORT_BY: 'Isaayos ayon sa',
    SORT_REPLIES: 'I-sort ang mga reply',
    TURN_OFF_QUOTE_TWEETS: 'I-off ang mga Quote na Tweet',
    TURN_OFF_RETWEETS: 'I-off ang Retweets',
    TURN_ON_RETWEETS: 'I-on ang Retweets',
    TWEET: 'Mag-tweet',
    TWEETED: 'Nag-tweet',
    TWEETS: 'Mga Tweet',
    TWEET_ALL: 'I-tweet lahat',
    TWEET_ANALYTICS: 'Analytics ng Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} other {(na) Tweet}}',
    TWEET_INTERACTIONS: 'Interaksyon sa Tweet',
    TWEET_SENT: 'Naipadala na ang iyong Tweet.',
    TWEET_TITLE: 'Si {name} sa Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'I-Tweet ang reply mo',
    UNDO_RETWEET: 'Huwag nang I-retweet',
    UNFOLLOW_USER: 'I-unfollow si @{screenName}',
    UNSENT_TWEETS: 'Mga Hindi Naipadalang Tweet',
    USER_RETWEETED: 'Ni-retweet ni {name}',
    VIEW: 'Tingnan',
    VIEW_TWEET_ANALYTICS: 'Tingnan ang analytics ng Tweet',
    YOU_RETWEETED: 'Ni-retweet Mo',
  },
  fr: {
    ACCOUNT_BASED_IN: 'Compte basé dans le pays suivant : {country}',
    ADD_ANOTHER_TWEET: 'Ajouter un autre Tweet',
    ADD_MUTED_WORD: 'Ajouter un mot masqué',
    AD_FROM: 'Annonce de {url}',
    EMBED_TWEET: 'Intégrer le Tweet',
    FOLLOWING_USER: 'Abonné à @{screenName}',
    FOLLOW_BACK_USER: 'Suivre en retour @{screenName}',
    FOLLOW_USER: 'Suivre @{screenName}',
    GROK_ACTIONS: 'Actions Grok',
    HOME: 'Accueil',
    LIKES: "J'aime",
    LIKE_COUNT: "{formattedCount} {count, plural, one {J'aime} many {J'aime} other {J'aime}}",
    LIVE_ON_X: 'En direct sur X',
    MEDIA_VIEWER: 'Visionneuse de médias',
    MUTE_THIS_CONVERSATION: 'Masquer cette conversation',
    NEW_TWEET: 'Nouveau Tweet',
    POST_ALL: 'Tout poster',
    POST_TITLE: '{name} sur X : « {text} »',
    POST_UNAVAILABLE: "Ce post n'est pas disponible.",
    PROFILE_SUMMARY: 'Résumé du profil',
    QUOTE: 'Citation',
    QUOTES: 'Citations',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {Citer} other {Citer}}',
    QUOTE_TWEET: 'Citer le Tweet',
    QUOTE_TWEETS: 'Tweets cités',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet cité} many {Tweets cités} other {Tweets cités}}',
    RECENT: 'Récents',
    REPORT_TWEET: 'Signaler le Tweet',
    RETWEET: 'Retweeter',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Retweet} many {Retweets} other {Retweets}}',
    SHARED: 'Partagé',
    SHARED_TWEETS: 'Tweets partagés',
    SHOW: 'Afficher',
    SHOW_MORE_REPLIES: 'Voir plus de réponses',
    SHOW_TWEETS: '{count, plural, one {Voir # Tweet} many {Voir # Tweets} other {Voir # Tweets}}',
    SORT_BY: 'Trier par',
    SORT_REPLIES: 'Trier les réponses',
    TURN_OFF_QUOTE_TWEETS: 'Désactiver les Tweets cités',
    TURN_OFF_RETWEETS: 'Désactiver les Retweets',
    TURN_ON_RETWEETS: 'Activer les Retweets',
    TWEET: 'Tweeter',
    TWEETED: 'a tweeté',
    TWEET_ALL: 'Tout tweeter',
    TWEET_ANALYTICS: 'Statistiques du Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} many {Tweets} other {Tweets}}',
    TWEET_INTERACTIONS: 'Interactions avec le Tweet',
    TWEET_SENT: 'Votre Tweet a été envoyé.',
    TWEET_TITLE: '{name} sur Twitter : "{text}"',
    TWEET_YOUR_REPLY: 'Tweetez votre réponse',
    UNDO_RETWEET: 'Annuler le Retweet',
    UNFOLLOW_USER: 'Se désabonner de @{screenName}',
    UNSENT_TWEETS: 'Tweets non envoyés',
    USER_RETWEETED: '{name} a retweeté',
    VIEW: 'Voir',
    VIEW_TWEET_ANALYTICS: 'Voir les statistiques des Tweets',
    YOU_RETWEETED: 'Vous avez retweeté',
  },
  ga: {
    ADD_ANOTHER_TWEET: 'Cuir Tweet eile leis',
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    EMBED_TWEET: 'Leabaigh an Tweet',
    HOME: 'Baile',
    LIKES: 'Thaitin siad seo le',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {Is maith liom} two {Is maith liom} few {Is maith liom} many {Is maith liom} other {Is maith liom}}',
    MUTE_THIS_CONVERSATION: 'Balbhaigh an comhrá seo',
    NEW_TWEET: 'Tweet nua',
    QUOTE: 'Sliocht',
    QUOTES: 'Sleachta',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Tvuíteanna luaite',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Quote Tweet} two {Quote Tweets} few {Quote Tweets} many {Quote Tweets} other {Quote Tweets}}',
    RECENT: 'Le déanaí',
    REPORT_TWEET: 'Tuairiscigh Tweet',
    RETWEET: 'Atweetáil',
    RETWEETS: 'Atweetanna',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Atweet} two {Atweet} few {Atweet} many {Atweet} other {Atweet}}',
    SHARED: 'Roinnte',
    SHARED_TWEETS: 'Tweetanna Roinnte',
    SHOW: 'Taispeáin',
    SHOW_MORE_REPLIES: 'Taispeáin tuilleadh freagraí',
    SHOW_TWEETS:
      '{count, plural, one {Show # Tweet} two {Show # Tweets} few {Show # Tweets} many {Show # Tweets} other {Show # Tweets}}',
    SORT_BY: 'Sórtáil de réir',
    TURN_OFF_QUOTE_TWEETS: 'Cas as Luaigh Tvuíteanna',
    TURN_OFF_RETWEETS: 'Cas as Atweetanna',
    TURN_ON_RETWEETS: 'Cas Atweetanna air',
    TWEETED: 'Rinne Tweetáil',
    TWEETS: 'Tweetanna',
    TWEET_ALL: 'Tweetáil gach rud',
    TWEET_ANALYTICS: 'Anailísíocht Tweetanna',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet} two {Tweets} few {Tweets} many {Tweets} other {Tweets}}',
    TWEET_INTERACTIONS: 'Idirghníomhaíochtaí le Tweet',
    TWEET_NOUN: 'Tvuít',
    TWEET_SENT: 'Seoladh an Tweet.',
    TWEET_TITLE: '{name} ar Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweetáil do fhreagra',
    UNDO_RETWEET: 'Cuir an Atweet ar ceal',
    UNSENT_TWEETS: 'Tweetanna nár seoladh',
    USER_RETWEETED: 'Rinne {name} Atweetáil',
    VIEW: 'Breathnaigh',
    VIEW_TWEET_ANALYTICS: 'Breathnaigh ar anailísíocht an Tweet',
    YOU_RETWEETED: 'Rinne tú Atweetáil',
  },
  gl: {
    ADD_ANOTHER_TWEET: 'Engadir outro chío',
    ADD_MUTED_WORD: 'Engadir palabra silenciada',
    EMBED_TWEET: 'Inserir chío',
    HOME: 'Inicio',
    LIKES: 'Gústames',
    LIKE_COUNT: '{formattedCount} {count, plural, one {gústame} other {gústames}}',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    NEW_TWEET: 'Novo chío',
    QUOTE: 'Cita',
    QUOTES: 'Citas',
    QUOTE_TWEET: 'Citar chío',
    QUOTE_TWEETS: 'Chíos citados',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Chío citado} other {Chíos citados}}',
    RECENT: 'Recentes',
    REPORT_TWEET: 'Denunciar chío',
    RETWEET: 'Rechouchiar',
    RETWEETS: 'Rechouchíos',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {rechouchío} other {rechouchíos}}',
    SHARED: 'Compartido',
    SHARED_TWEETS: 'Chíos compartidos',
    SHOW: 'Amosar',
    SHOW_MORE_REPLIES: 'Amosar máis respostas',
    SORT_BY: 'Ordenar por',
    TURN_OFF_QUOTE_TWEETS: 'Desactivar os chíos citados',
    TURN_OFF_RETWEETS: 'Desactivar os rechouchíos',
    TURN_ON_RETWEETS: 'Activar os rechouchíos',
    TWEET: 'Chío',
    TWEETED: 'chiou',
    TWEETS: 'Chíos',
    TWEET_ALL: 'Chiar todo',
    TWEET_ANALYTICS: 'Análises dos chíos',
    TWEET_INTERACTIONS: 'Interaccións chío',
    TWEET_NOUN: 'Chío',
    TWEET_SENT: 'Enviouse o teu chío.',
    TWEET_TITLE: '{name} no Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Chío a túa responder',
    UNDO_RETWEET: 'Desfacer rechouchío',
    UNSENT_TWEETS: 'Chíos sen enviar',
    USER_RETWEETED: '{name} rechouchiou',
    VIEW: 'Ver',
    VIEW_TWEET_ANALYTICS: 'Ver análises do chío',
    YOU_RETWEETED: 'Rechouchiaches',
  },
  gu: {
    ACCOUNT_BASED_IN: '{country} માં સ્થિત એકાઉન્ટ',
    ADD_ANOTHER_TWEET: 'અન્ય ટ્વીટ ઉમેરો',
    ADD_MUTED_WORD: 'જોડાણ અટકાવેલો શબ્દ ઉમેરો',
    AD_FROM: '{url} માંથી જાહેરાત',
    EMBED_TWEET: 'ટ્વીટ એમ્બેડ કરો',
    FOLLOWING_USER: 'અનુસરણ @{screenName}',
    FOLLOW_BACK_USER: '@{screenName} ને ફોલો કરો',
    FOLLOW_USER: 'અનુસરો @{screenName}',
    GROK_ACTIONS: 'Grok પગલાં',
    HOME: 'હોમ',
    LIKES: 'લાઈક્સ',
    LIKE_COUNT: '{formattedCount} {count, plural, one {લાઈક} other {લાઈક્સ}}',
    LIVE_ON_X: 'X પર લાઇવ',
    MEDIA_VIEWER: 'મીડિયા વ્યૂઅર',
    MUTE_THIS_CONVERSATION: 'આ વાર્તાલાપનું જોડાણ અટકાવો',
    NEW_TWEET: 'નવી ટ્વીટ',
    POST: 'પોસ્ટ',
    POST_ALL: 'બધા પોસ્ટ કરો',
    POST_TITLE: '{name} X પર: "{text}"',
    POST_UNAVAILABLE: 'આ પોસ્ટ અનુપલબ્ધ છે.',
    PROFILE_SUMMARY: 'પ્રોફાઇલ સારાંશ',
    QUOTE: 'અવતરણ',
    QUOTES: 'અવતરણો',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {અવતરણ} other {અવતરણ}}',
    QUOTE_TWEET: 'અવતરણની સાથે ટ્વીટ કરો',
    QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {અવતરણની સાથે ટ્વીટ} other {અવતરણની સાથે ટ્વીટ}}',
    RECENT: 'તાજેતરનું',
    REPORT_TWEET: 'ટ્વીટની જાણ કરો',
    REPOST: 'રીપોસ્ટ કરો',
    REPOSTS: 'ફરીથી કરવામાં આવેલી પોસ્ટ',
    REPOST_COUNT: '{formattedCount} {count, plural, one {ફરીથી પોસ્ટ કરો} other {ફરીથી પોસ્ટ કરો}}',
    RETWEET: 'પુનટ્વીટ',
    RETWEETS: 'પુનટ્વીટ્સ',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {પુનટ્વીટ} other {પુનટ્વીટ્સ}}',
    SHARED: 'સાંજેડેલું',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
    SHOW: 'બતાવો',
    SHOW_MORE_REPLIES: 'વધુ પ્રત્યુતરો દર્શાવો',
    SHOW_TWEETS: '{count, plural, one {બતાવો # ટ્વીટ} other {બતાવો # ટ્વીટ્સ}}',
    SORT_BY: 'આની દ્વારા સૉર્ટ કરો',
    SORT_REPLIES: 'પ્રત્યુત્તરોને સૉર્ટ કરો',
    TURN_OFF_QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ બંધ કરો',
    TURN_OFF_RETWEETS: 'પુનટ્વીટ્સ બંધ કરો',
    TURN_ON_RETWEETS: 'પુનટ્વીટ્સ ચાલુ કરો',
    TWEET: 'ટ્વીટ',
    TWEETED: 'ટ્વીટ કરી',
    TWEETS: 'ટ્વીટ્સ',
    TWEET_ALL: 'બધાને ટ્વીટ કરો',
    TWEET_ANALYTICS: 'ટ્વીટ વિશ્લેષણો',
    TWEET_COUNT: '{formattedCount} {count, plural, one {ટ્વીટ} other {ટ્વીટ}}',
    TWEET_INTERACTIONS: 'ટ્વીટ ક્રિયાપ્રતિક્રિયાઓ',
    TWEET_NOUN: 'ટ્વીટ',
    TWEET_SENT: 'તમારી ટ્વીટ મોકલી દેવામાં આવી હતી.',
    TWEET_TITLE: '{name} Twitter પર: "{text}"',
    TWEET_YOUR_REPLY: 'તમારા પ્રત્યુત્તરને ટ્વીટ કરો',
    UNDO_RETWEET: 'પુનટ્વીટને પૂર્વવત કરો',
    UNFOLLOW_USER: '@{screenName}ને અનુસરવાનું બંધ કરો',
    UNSENT_TWEETS: 'મોકલ્યા વગરની ટ્વીટ્સ',
    USER_RETWEETED: '{name}એ પુનટ્વીટ કરી',
    VIEW: 'જુઓ',
    VIEW_TWEET_ANALYTICS: 'ટ્વીટ વિશ્લેષણ જુઓ',
    YOU_RETWEETED: 'તમે પુનટ્વીટ કરી',
  },
  he: {
    ACCOUNT_BASED_IN: 'חשבון מבוסס ב{country}',
    ADD_ANOTHER_TWEET: 'הוסף ציוץ נוסף',
    ADD_MUTED_WORD: 'הוסף מילה מושתקת',
    AD_FROM: 'מודעה מ-{url}',
    EMBED_TWEET: 'הטבע ציוץ',
    FOLLOWING_USER: 'במעקב אחר @{screenName}',
    FOLLOW_BACK_USER: 'לעקוב בחזרה @{screenName}',
    FOLLOW_USER: 'עקוב אחרי @{screenName}',
    GROK_ACTIONS: 'פעולות של Grok',
    HOME: 'דף הבית',
    LIKES: 'הערות "אהבתי"',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {סימון אהבתי} two {סימוני אהבתי} other {סימוני אהבתי}}',
    LIVE_ON_X: 'שידור חי ב-X',
    MEDIA_VIEWER: 'מציג מדיה',
    MUTE_THIS_CONVERSATION: 'להשתיק את השיחה הזאת',
    NEW_TWEET: 'ציוץ חדש',
    POST: 'פרסום',
    POST_ALL: 'פרסום הכל',
    POST_TITLE: '{name} ב-X: {text}',
    POST_UNAVAILABLE: 'פוסט זה אינו זמין.',
    PROFILE_SUMMARY: 'סיכום הפרופיל',
    QUOTE: 'ציטוט',
    QUOTES: 'ציטוטים',
    QUOTE_TWEET: 'ציטוט ציוץ',
    QUOTE_TWEETS: 'ציוצי ציטוט',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {ציוץ ציטוט} two {ציוצי ציטוט} other {ציוצי ציטוט}}',
    RECENT: 'אחרונים',
    REPORT_TWEET: 'דיווח על ציוץ',
    REPOST: 'לפרסם מחדש',
    REPOSTS: 'פרסומים מחדש',
    RETWEET: 'צייץ מחדש',
    RETWEETS: 'ציוצים מחדש',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {ציוץ מחדש} two {ציוצים מחדש} other {ציוצים מחדש}}',
    SHARED: 'משותף',
    SHARED_TWEETS: 'ציוצים משותפים',
    SHOW: 'הצג',
    SHOW_MORE_REPLIES: 'הצג תשובות נוספות',
    SHOW_TWEETS: '{count, plural, one {הצג # ציוץ} two {הצג # ציוצים} other {הצג # ציוצים}}',
    SORT_BY: 'סנן לפי',
    SORT_REPLIES: 'מיון תשובות',
    TURN_OFF_QUOTE_TWEETS: 'כבה ציוצי ציטוט',
    TURN_OFF_RETWEETS: 'כבה ציוצים מחדש',
    TURN_ON_RETWEETS: 'הפעל ציוצים מחדש',
    TWEET: 'צייץ',
    TWEETED: 'צייצ/ה',
    TWEETS: 'ציוצים',
    TWEET_ALL: 'צייץ הכול',
    TWEET_ANALYTICS: 'ניתוח ציוצים',
    TWEET_COUNT: '{formattedCount} {count, plural, one {ציוץ} two {ציוצים} other {ציוצים}}',
    TWEET_INTERACTIONS: 'אינטראקציות עם הציוץ',
    TWEET_NOUN: 'ציוץ',
    TWEET_SENT: 'הציוץ שלך נשלח.',
    TWEET_TITLE: '{name} בטוויטר: "{text}"',
    TWEET_YOUR_REPLY: 'צייץ התשובה',
    TWITTER: 'טוויטר',
    UNDO_RETWEET: 'ביטול ציוץ מחדש',
    UNFOLLOW_USER: 'בטל מעקב אחר ‎@{screenName}',
    UNSENT_TWEETS: 'ציוצים שלא נשלחו',
    USER_RETWEETED: '{name} צייץ מחדש',
    VIEW: 'הצג',
    VIEW_TWEET_ANALYTICS: 'הצג את ניתוח הציוצים',
    YOU_RETWEETED: 'צייצת מחדש',
  },
  hi: {
    ACCOUNT_BASED_IN: 'अकाउंट {country} में स्थित',
    ADD_ANOTHER_TWEET: 'एक और ट्वीट जोड़ें',
    ADD_MUTED_WORD: 'म्यूट किया गया शब्द जोड़ें',
    AD_FROM: '{url} से विज्ञापन',
    EMBED_TWEET: 'ट्वीट एम्बेड करें',
    FOLLOWING_USER: '@{screenName} को फ़ॉलो कर रहे हैं',
    FOLLOW_BACK_USER: '@{screenName} को फ़ॉलो बैक करें',
    FOLLOW_USER: '@{screenName} फ़ॉलो करें',
    GROK_ACTIONS: 'Grok कार्रवाई',
    HOME: 'होम',
    LIKES: 'पसंद',
    LIKE_COUNT: '{formattedCount} {count, plural, one {पसंद} other {पसंद}}',
    LIVE_ON_X: 'X पर लाइव',
    MEDIA_VIEWER: 'मीडिया व्यूअर',
    MUTE_THIS_CONVERSATION: 'इस बातचीत को म्यूट करें',
    NEW_TWEET: 'नया ट्वीट',
    POST: 'पोस्ट',
    POST_ALL: 'सभी पोस्ट करें',
    POST_TITLE: 'X पर {name}: "{text}"',
    POST_UNAVAILABLE: 'यह पोस्ट उपलब्ध नहीं है.',
    PROFILE_SUMMARY: 'प्रोफ़ाइल सारांश',
    QUOTE: 'कोट',
    QUOTES: 'कोट',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {क्वोट} other {क्वोट}}',
    QUOTE_TWEET: 'ट्वीट क्वोट करें',
    QUOTE_TWEETS: 'कोट ट्वीट्स',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {कोट ट्वीट} other {कोट ट्वीट्स}}',
    RECENT: 'हाल ही के',
    REPORT_TWEET: 'ट्वीट की रिपोर्ट करें',
    REPOST: 'रीपोस्ट',
    REPOSTS: 'रीपोस्ट्स',
    REPOST_COUNT: '{formattedCount} {count, plural, one {रीपोस्ट} other {रीपोस्ट}}',
    RETWEET: 'रीट्वीट करें',
    RETWEETS: 'रीट्वीट्स',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {रीट्वीट} other {रीट्वीट्स}}',
    SHARED: 'साझा किया हुआ',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
    SHOW: 'दिखाएं',
    SHOW_MORE_REPLIES: 'और अधिक जवाब दिखाएँ',
    SHOW_TWEETS: '{count, plural, one {# ट्वीट दिखाएं} other {# ट्वीट्स दिखाएं}}',
    SORT_BY: 'इसके अनुसार सॉर्ट करें',
    SORT_REPLIES: 'जवाब सॉर्ट करें',
    TURN_OFF_QUOTE_TWEETS: 'कोट ट्वीट्स बंद करें',
    TURN_OFF_RETWEETS: 'रीट्वीट बंद करें',
    TURN_ON_RETWEETS: 'रीट्वीट चालू करें',
    TWEET: 'ट्वीट करें',
    TWEETED: 'ट्वीट किया',
    TWEETS: 'ट्वीट',
    TWEET_ALL: 'सभी ट्वीट करें',
    TWEET_ANALYTICS: 'ट्वीट विश्लेषण',
    TWEET_COUNT: '{formattedCount} {count, plural, one {ट्वीट} other {ट्वीट्स}}',
    TWEET_INTERACTIONS: 'ट्वीट इंटरैक्शन',
    TWEET_NOUN: 'ट्वीट',
    TWEET_SENT: 'आपका ट्वीट भेज दिया गया था.',
    TWEET_TITLE: '{name} Twitter पर: "{text}"',
    TWEET_YOUR_REPLY: 'अपना जवाब ट्वीट करें',
    UNDO_RETWEET: 'रीट्वीट को पूर्ववत करें',
    UNFOLLOW_USER: '@{screenName} को अनफ़ॉलो करें',
    UNSENT_TWEETS: 'बिना भेजे गए ट्वीट',
    USER_RETWEETED: '{name} ने रीट्वीट किया',
    VIEW: 'देखें',
    VIEW_TWEET_ANALYTICS: 'ट्वीट विश्लेषण देखें',
    YOU_RETWEETED: 'आपने रीट्वीट किया',
  },
  hr: {
    ACCOUNT_BASED_IN: 'Lokacija računa: {country}',
    ADD_ANOTHER_TWEET: 'Dodaj drugi Tweet',
    ADD_MUTED_WORD: 'Dodaj onemogućenu riječ',
    AD_FROM: 'Oglas od {url}',
    EMBED_TWEET: 'Ugradi Tweet',
    FOLLOWING_USER: 'Pratite korisnika/cu @{screenName}',
    FOLLOW_BACK_USER: 'Prati natrag @{screenName}',
    FOLLOW_USER: 'Počni pratiti korisnika/cu @{screenName}',
    GROK_ACTIONS: 'Grokove radnje',
    HOME: 'Naslovnica',
    LIKES: 'Oznake „sviđa mi se”',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {oznaka „sviđa mi se”} few {oznake „sviđa mi se”} other {oznaka „sviđa mi se”}}',
    LIVE_ON_X: 'Uživo na platformi X',
    MEDIA_VIEWER: 'Preglednik medija',
    MUTE_THIS_CONVERSATION: 'Isključi zvuk ovog razgovora',
    NEW_TWEET: 'Novi Tweet',
    POST: 'Objavi',
    POST_ALL: 'Objavi sve',
    POST_TITLE: '{name} na platformi X: „{text}”',
    POST_UNAVAILABLE: 'Ta objava nije dostupna.',
    PROFILE_SUMMARY: 'Sažetak profila',
    QUOTE: 'Citat',
    QUOTES: 'Citati',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {citiranje} few {citiranja} other {citiranja}}',
    QUOTE_TWEET: 'Citiraj Tweet',
    QUOTE_TWEETS: 'Citirani tweetovi',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {citirani Tweet} few {citirana tweeta} other {citiranih tweetova}}',
    RECENT: 'Nedavno',
    REPORT_TWEET: 'Prijavi Tweet',
    REPOST: 'Proslijedi objavu',
    REPOSTS: 'Proslijeđene objave',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {ponovna objava} few {ponovne objave} other {ponovnih objava}}',
    RETWEET: 'Proslijedi tweet',
    RETWEETS: 'Proslijeđeni tweetovi',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {proslijeđeni Tweet} few {proslijeđena tweeta} other {proslijeđenih tweetova}}',
    SHARED: 'Podijeljeno',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
    SHOW: 'Prikaži',
    SHOW_MORE_REPLIES: 'Prikaži još odgovora',
    SHOW_TWEETS:
      '{count, plural, one {Prikaži # Tweet} few {Prikaži # tweeta} other {Prikaži # tweetova}}',
    SORT_BY: 'Sortiraj prema',
    SORT_REPLIES: 'Sortiraj odgovore',
    TURN_OFF_QUOTE_TWEETS: 'Isključi citirane tweetove',
    TURN_OFF_RETWEETS: 'Isključi proslijeđene tweetove',
    TURN_ON_RETWEETS: 'Uključi proslijeđene tweetove',
    TWEETED: 'objavio/la je Tweet',
    TWEETS: 'Tweetovi',
    TWEET_ALL: 'Tweetaj sve',
    TWEET_ANALYTICS: 'Analitika tweeta',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} few {tweeta} other {tweetova}}',
    TWEET_INTERACTIONS: 'Interakcije s Tweetom',
    TWEET_SENT: 'Tweet je poslan.',
    TWEET_TITLE: '{name} na Twitteru: "{text}"',
    TWEET_YOUR_REPLY: 'Tweetajte odgovor',
    UNDO_RETWEET: 'Poništi prosljeđivanje tweeta',
    UNFOLLOW_USER: 'Prestani pratiti korisnika/cu @{screenName}',
    UNSENT_TWEETS: 'Neposlani tweetovi',
    USER_RETWEETED: '{name} proslijedio/la je Tweet',
    VIEW: 'Prikaz',
    VIEW_TWEET_ANALYTICS: 'Prikaži analitičke podatke o tweetovima',
    YOU_RETWEETED: 'Proslijedili ste Tweet',
  },
  hu: {
    ACCOUNT_BASED_IN: 'A felhasználói fiók székhelye: {country}',
    ADD_ANOTHER_TWEET: 'Másik Tweet hozzáadása',
    ADD_MUTED_WORD: 'Elnémított szó hozzáadása',
    AD_FROM: 'Hirdetés innen: {url}',
    EMBED_TWEET: 'Tweet beágyazása',
    FOLLOWING_USER: '@{screenName} követése',
    FOLLOW_BACK_USER: '@{screenName} visszakövetése',
    FOLLOW_USER: '@{screenName} követése',
    GROK_ACTIONS: 'Grok-műveletek',
    HOME: 'Kezdőlap',
    LIKES: 'Kedvelések',
    LIKE_COUNT: '{formattedCount} {count, plural, one {kedvelés} other {kedvelés}}',
    LIVE_ON_X: 'Élőben az X-en',
    MEDIA_VIEWER: 'Médiamegjelenítő',
    MUTE_THIS_CONVERSATION: 'Beszélgetés némítása',
    NEW_TWEET: 'Új Tweet',
    POST: 'Bejegyzés',
    POST_ALL: 'Az összes közzététele',
    POST_TITLE: '{name} az X-en: „{text}”',
    POST_UNAVAILABLE: 'Ez a bejegyzés nem elérhető.',
    PROFILE_SUMMARY: 'Profil összegzése',
    QUOTE: 'Idézés',
    QUOTES: 'Idézések',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {idézés} other {idézés}}',
    QUOTE_TWEET: 'Tweet idézése',
    QUOTE_TWEETS: 'Tweet-idézések',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {idéző Tweet} other {idéző Tweet}}',
    RECENT: 'Legutóbbi',
    REPORT_TWEET: 'Tweet jelentése',
    REPOST: 'Újraposztolás',
    REPOSTS: 'Újraposztolások',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {újraposztolt bejegyzés} other {újraposztolt bejegyzés}}',
    RETWEETS: 'Retweetek',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retweet} other {Retweet}}',
    SHARED: 'Megosztott',
    SHARED_TWEETS: 'Megosztott tweetek',
    SHOW: 'Megjelenítés',
    SHOW_MORE_REPLIES: 'Több válasz megjelenítése',
    SHOW_TWEETS: '{count, plural, one {# Tweet megjelenítése} other {# Tweet megjelenítése}}',
    SORT_BY: 'Rendezési szempont',
    SORT_REPLIES: 'Válaszok rendezése',
    TURN_OFF_QUOTE_TWEETS: 'Tweet-idézések kikapcsolása',
    TURN_OFF_RETWEETS: 'Retweetek kikapcsolása',
    TURN_ON_RETWEETS: 'Retweetek bekapcsolása',
    TWEET: 'Tweetelj',
    TWEETED: 'Tweetelt',
    TWEETS: 'Tweetek',
    TWEET_ALL: 'Tweet küldése mindenkinek',
    TWEET_ANALYTICS: 'Tweet-elemzések',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} other {Tweet}}',
    TWEET_INTERACTIONS: 'Tweet interakciók',
    TWEET_NOUN: 'Tweetje',
    TWEET_SENT: 'A Tweetedet elküldtük.',
    TWEET_TITLE: '{name} a Twitteren: "{text}"',
    TWEET_YOUR_REPLY: 'Tweeteld válaszodat',
    UNDO_RETWEET: 'Retweet visszavonása',
    UNFOLLOW_USER: '@{screenName} követésének megszüntetése',
    UNSENT_TWEETS: 'Elküldetlen Tweetek',
    USER_RETWEETED: '{name} Retweetelte',
    VIEW: 'Megtekintés',
    VIEW_TWEET_ANALYTICS: 'Tweet-elemzések megtekintése',
    YOU_RETWEETED: 'Retweetelted',
  },
  id: {
    ACCOUNT_BASED_IN: 'Akun berbasis di {country}',
    ADD_ANOTHER_TWEET: 'Tambahkan Tweet lain',
    ADD_MUTED_WORD: 'Tambahkan kata kunci yang dibisukan',
    AD_FROM: 'Iklan dari {url}',
    EMBED_TWEET: 'Lekatkan Tweet',
    FOLLOWING_USER: 'Mengikuti @{screenName}',
    FOLLOW_BACK_USER: 'Ikuti balik @{screenName}',
    FOLLOW_USER: 'Ikuti @{screenName}',
    GROK_ACTIONS: 'Tindakan Grok',
    HOME: 'Beranda',
    LIKES: 'Suka',
    LIKE_COUNT: '{formattedCount} {count, plural, other {suka}}',
    LIVE_ON_X: 'Langsung di X',
    MEDIA_VIEWER: 'Penampil Media',
    MUTE_THIS_CONVERSATION: 'Bisukan percakapan ini',
    NEW_TWEET: 'Tweet Baru',
    POST: 'Posting',
    POST_ALL: 'Posting semua',
    POST_TITLE: '{name} di X: "{text}"',
    POST_UNAVAILABLE: 'Postingan ini tidak tersedia.',
    PROFILE_SUMMARY: 'Ringkasan Profil',
    QUOTE: 'Kutipan',
    QUOTES: 'Kutipan',
    QUOTE_COUNT: '{formattedCount} {count, plural, other {kutip}}',
    QUOTE_TWEET: 'Kutip Tweet',
    QUOTE_TWEETS: 'Tweet Kutipan',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {Tweet Kutipan}}',
    RECENT: 'Terkini',
    REPORT_TWEET: 'Laporkan Tweet',
    REPOST: 'Posting ulang',
    REPOSTS: 'Posting ulang',
    REPOST_COUNT: '{formattedCount} {count, plural, other {posting ulang}}',
    RETWEETS: 'Retweet',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {Retweet}}',
    SHARED: 'Dibagikan',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
    SHOW: 'Tampilkan',
    SHOW_MORE_REPLIES: 'Tampilkan balasan lainnya',
    SHOW_TWEETS: '{count, plural, other {Tampilkan # Tweet}}',
    SORT_BY: 'Urutkan berdasarkan',
    SORT_REPLIES: 'Urutkan balasan',
    TURN_OFF_QUOTE_TWEETS: 'Matikan Tweet Kutipan',
    TURN_OFF_RETWEETS: 'Matikan Retweet',
    TURN_ON_RETWEETS: 'Nyalakan Retweet',
    TWEETED: 'menge-tweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Tweet semua',
    TWEET_ANALYTICS: 'Analitik Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, other {Tweet}}',
    TWEET_INTERACTIONS: 'Interaksi Tweet',
    TWEET_SENT: 'Tweet Anda terkirim.',
    TWEET_TITLE: '{name} di Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweet balasan Anda',
    UNDO_RETWEET: 'Batalkan Retweet',
    UNFOLLOW_USER: 'Setop ikuti @{screenName}',
    UNSENT_TWEETS: 'Tweet yang Belum Terkirim',
    USER_RETWEETED: '{name} me-retweet',
    VIEW: 'Penayangan',
    VIEW_TWEET_ANALYTICS: 'Lihat analitik Tweet',
    YOU_RETWEETED: 'Anda me-Retweet',
  },
  it: {
    ACCOUNT_BASED_IN: 'Posizione account: {country}',
    ADD_ANOTHER_TWEET: 'Aggiungi altro Tweet',
    ADD_MUTED_WORD: 'Aggiungi parola o frase silenziata',
    AD_FROM: 'Annuncio da {url}',
    EMBED_TWEET: 'Incorpora Tweet',
    FOLLOWING_USER: 'Segui già @{screenName}',
    FOLLOW_BACK_USER: 'Segui @{screenName} anche tu',
    FOLLOW_USER: 'Segui @{screenName}',
    GROK_ACTIONS: 'Azioni di Grok',
    LIKES: 'Mi piace',
    LIKE_COUNT: '{formattedCount} {count, plural, one {Mi piace} many {Mi piace} other {Mi piace}}',
    LIVE_ON_X: 'In diretta su X',
    MEDIA_VIEWER: 'Visualizzatore multimediale',
    MUTE_THIS_CONVERSATION: 'Silenzia questa conversazione',
    NEW_TWEET: 'Nuovo Tweet',
    POST_ALL: 'Posta tutto',
    POST_TITLE: '{name} su X: "{text}"',
    POST_UNAVAILABLE: 'Questo post non è disponibile.',
    PROFILE_SUMMARY: 'Riepilogo del profilo',
    QUOTE: 'Citazione',
    QUOTES: 'Citazioni',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {cita} other {cite}}',
    QUOTE_TWEET: 'Cita Tweet',
    QUOTE_TWEETS: 'Tweet di citazione',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet di citazione} many {Tweet di citazione} other {Tweet di citazione}}',
    RECENT: 'Recenti',
    REPORT_TWEET: 'Segnala Tweet',
    REPOSTS: 'Repost',
    REPOST_COUNT: '{formattedCount} {count, plural, one {repost} other {repost}}',
    RETWEET: 'Ritwitta',
    RETWEETS: 'Retweet',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retweet} many {Retweet} other {Retweet}}',
    SHARED: 'Condiviso',
    SHARED_TWEETS: 'Tweet condivisi',
    SHOW: 'Mostra',
    SHOW_MORE_REPLIES: 'Mostra altre risposte',
    SHOW_TWEETS:
      '{count, plural, one {Mostra # Tweet} many {Mostra # Tweet} other {Mostra # Tweet}}',
    SORT_BY: 'Ordina per',
    SORT_REPLIES: 'Ordina risposte',
    TURN_OFF_QUOTE_TWEETS: 'Disattiva i Tweet di citazione',
    TURN_OFF_RETWEETS: 'Disattiva Retweet',
    TURN_ON_RETWEETS: 'Attiva Retweet',
    TWEET: 'Twitta',
    TWEETED: 'ha twittato',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Twitta tutto',
    TWEET_ANALYTICS: 'Statistiche Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} many {Tweet} other {Tweet}}',
    TWEET_INTERACTIONS: 'Interazioni con Tweet',
    TWEET_SENT: 'Il tuo Tweet è stato inviato.',
    TWEET_TITLE: '{name} su Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Twitta la tua risposta',
    UNDO_RETWEET: 'Annulla Retweet',
    UNFOLLOW_USER: 'Smetti di seguire @{screenName}',
    UNSENT_TWEETS: 'Tweet non inviati',
    USER_RETWEETED: 'Ritwittato da {name}',
    VIEW: 'Visualizza',
    VIEW_TWEET_ANALYTICS: 'Visualizza statistiche Tweet',
    YOU_RETWEETED: 'Hai ritwittato',
  },
  ja: {
    ACCOUNT_BASED_IN: 'アカウントの拠点: {country}',
    ADD_ANOTHER_TWEET: '別のツイートを追加する',
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    AD_FROM: '{url} からの広告',
    EMBED_TWEET: 'ツイートを埋め込む',
    FOLLOWING_USER: '@{screenName}さんをフォローしています',
    FOLLOW_BACK_USER: '@{screenName}さんをフォローバック',
    FOLLOW_USER: '@{screenName}さんをフォロー',
    GROK_ACTIONS: 'Grokのアクション',
    HOME: 'ホーム',
    LIKES: 'いいね',
    LIKE_COUNT: '{formattedCount} {count, plural, other {件のいいね}}',
    LIVE_ON_X: 'Xでライブ放送する',
    MEDIA_VIEWER: 'メディアビューアー',
    MUTE_THIS_CONVERSATION: 'この会話をミュート',
    NEW_TWEET: '新しいツイート',
    POST: 'ポスト',
    POST_ALL: 'すべてポスト',
    POST_TITLE: 'Xユーザーの{name}さん: 「{text}」',
    POST_UNAVAILABLE: 'このポストは表示できません。',
    PROFILE_SUMMARY: 'プロフィールの要約',
    QUOTE: '引用',
    QUOTES: '引用',
    QUOTE_COUNT: '{formattedCount}{count, plural, other {件の引用}}',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {件の引用ツイート}}',
    RECENT: '最新',
    REPORT_TWEET: 'ツイートを報告',
    REPOST: 'リポスト',
    REPOSTS: 'リポスト',
    REPOST_COUNT: '{formattedCount}{count, plural, other {件のリポスト}}',
    RETWEET: 'リツイート',
    RETWEETS: 'リツイート',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {件のリツイート}}',
    SHARED: '共有',
    SHARED_TWEETS: '共有ツイート',
    SHOW: '表示',
    SHOW_MORE_REPLIES: '返信をさらに表示',
    SHOW_TWEETS: '{count, plural, other {# 件のツイートを表示}}',
    SORT_BY: '並べ替え',
    SORT_REPLIES: '返信を並べ替え',
    TURN_OFF_QUOTE_TWEETS: '引用ツイートをオフにする',
    TURN_OFF_RETWEETS: 'リツイートをオフにする',
    TURN_ON_RETWEETS: 'リツイートをオンにする',
    TWEET: 'ツイートする',
    TWEETED: 'ツイートしました',
    TWEETS: 'ツイート',
    TWEET_ALL: 'すべてツイート',
    TWEET_ANALYTICS: 'ツイートアナリティクス',
    TWEET_COUNT: '{formattedCount} {count, plural, other {件のツイート}}',
    TWEET_INTERACTIONS: 'ツイートアクティビティ',
    TWEET_NOUN: 'ツイート',
    TWEET_SENT: 'ツイートを送信しました。',
    TWEET_TITLE: '{name}さんはTwitterを使っています: 「{text}」',
    TWEET_YOUR_REPLY: '返信をツイート',
    UNDO_RETWEET: 'リツイートを取り消す',
    UNFOLLOW_USER: '@{screenName}さんのフォローを解除',
    UNSENT_TWEETS: '未送信ツイート',
    USER_RETWEETED: '{name}さんがリツイートしました',
    VIEW: '表示',
    VIEW_TWEET_ANALYTICS: 'ツイートアナリティクスを表示',
    YOU_RETWEETED: 'リツイート済み',
  },
  kn: {
    ACCOUNT_BASED_IN: '{country}ನಲ್ಲಿ ಆಧಾರಿತ ಖಾತೆ',
    ADD_ANOTHER_TWEET: 'ಮತ್ತೊಂದು ಟ್ವೀಟ್ ಸೇರಿಸಿ',
    ADD_MUTED_WORD: 'ಸದ್ದಡಗಿಸಿದ ಪದವನ್ನು ಸೇರಿಸಿ',
    AD_FROM: '{url} ನಿಂದ ಜಾಹೀರಾತು',
    EMBED_TWEET: 'ಟ್ವೀಟ್ ಎಂಬೆಡ್ ಮಾಡಿ',
    FOLLOWING_USER: '@{screenName} ಅವರನ್ನು ಹಿಂಬಾಲಿಸಲಾಗುತ್ತಿದೆ',
    FOLLOW_BACK_USER: 'ಮತ್ತೆ ಹಿಂಬಾಲಿಸು @{screenName}',
    FOLLOW_USER: '@{screenName} ಅವರನ್ನು ಹಿಂಬಾಲಿಸಿ',
    GROK_ACTIONS: 'Grok ಕ್ರಮಗಳು',
    HOME: 'ಹೋಮ್',
    LIKES: 'ಇಷ್ಟಗಳು',
    LIKE_COUNT: '{formattedCount} {count, plural, one {ಇಷ್ಟ} other {ಇಷ್ಟಗಳು}}',
    LIVE_ON_X: 'X ನಲ್ಲಿ ಲೈವ್',
    MEDIA_VIEWER: 'ಮೀಡಿಯಾ ವೀಕ್ಷಕ',
    MUTE_THIS_CONVERSATION: 'ಈ ಸಂವಾದವನ್ನು ಸದ್ದಡಗಿಸಿ',
    NEW_TWEET: 'ಹೊಸ ಟ್ವೀಟ್',
    POST: 'ಪೋಸ್ಟ್',
    POST_ALL: 'ಎಲ್ಲವನ್ನೂ ಪೋಸ್ಟ್ ಮಾಡಿ',
    POST_TITLE: 'X ನಲ್ಲಿ {name}: "{text}"',
    POST_UNAVAILABLE: 'ಈ ಪೋಸ್ಟ್ ಲಭ್ಯವಿಲ್ಲ.',
    PROFILE_SUMMARY: 'ಪ್ರೊಫೈಲ್ ಸಾರಾಂಶ',
    QUOTE: 'ಕೋಟ್‌',
    QUOTES: 'ಉಲ್ಲೇಖಗಳು',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {ಕೋಟ್} other {ಕೋಟ್‌ಗಳು}}',
    QUOTE_TWEET: 'ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ',
    QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {ಕೋಟ್ ಟ್ವೀಟ್} other {ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು}}',
    RECENT: 'ಇತ್ತೀಚಿನ',
    REPORT_TWEET: 'ಟ್ವೀಟ್ ವರದಿ ಮಾಡಿ',
    REPOST: 'ಮರುಪೋಸ್ಟ್ ಮಾಡಿ',
    REPOSTS: 'ಮರುಪೋಸ್ಟ್‌ಗಳು',
    REPOST_COUNT: '{formattedCount} {count, plural, one {ರೀಪೋಸ್ಟ್} other {ರೀಪೋಸ್ಟ್‌ಗಳು}}',
    RETWEET: 'ಮರುಟ್ವೀಟಿಸಿ',
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {ಮರುಟ್ವೀಟಿಸಿ} other {ಮರುಟ್ವೀಟ್‌ಗಳು}}',
    SHARED: 'ಹಂಚಲಾಗಿದೆ',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
    SHOW: 'ತೋರಿಸಿ',
    SHOW_MORE_REPLIES: 'ಇನ್ನಷ್ಟು ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ತೋರಿಸಿ',
    SHOW_TWEETS: '{count, plural, one {ತೋರಿಸಿ # ಟ್ವೀಟ್} other {ತೋರಿಸಿ # ಟ್ವೀಟ್‌ಗಳು}}',
    SORT_BY: 'ಈ ರೀತಿ ಆಯೋಜಿಸಿ',
    SORT_REPLIES: 'ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಆಯೋಜಿಸಿ',
    TURN_OFF_QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ',
    TURN_OFF_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ',
    TURN_ON_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆನ್ ಮಾಡಿ',
    TWEET: 'ಟ್ವೀಟ್',
    TWEETED: 'ಟ್ವೀಟ್ ಮಾಡಿದ್ದಾರೆ',
    TWEETS: 'ಟ್ವೀಟ್‌ಗಳು',
    TWEET_ALL: 'ಎಲ್ಲಾ ಟ್ವೀಟ್ ಮಾಡಿ',
    TWEET_ANALYTICS: 'ಟ್ವೀಟ್ ಅನಾಲಿಟಿಕ್ಸ್',
    TWEET_COUNT: '{formattedCount} {count, plural, one {ಟ್ವೀಟ್} other {ಟ್ವೀಟ್‌ಗಳು}}',
    TWEET_INTERACTIONS: 'ಟ್ವೀಟ್ ಸಂವಾದಗಳು',
    TWEET_NOUN: 'ಟ್ವೀಟ್',
    TWEET_SENT: 'ನಿಮ್ಮ ಟ್ವೀಟ್ ಕಳುಹಿಸಲಾಗಿದೆ.',
    TWEET_TITLE: '{name} Twitter ನಲ್ಲಿ: "{text}"',
    TWEET_YOUR_REPLY: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಟ್ವೀಟ್ ಮಾಡಿ',
    UNDO_RETWEET: 'ಮರುಟ್ವೀಟಿಸುವುದನ್ನು ರದ್ದುಮಾಡಿ',
    UNFOLLOW_USER: '@{screenName} ಅವರನ್ನು ಹಿಂಬಾಲಿಸದಿರಿ',
    UNSENT_TWEETS: 'ಕಳುಹಿಸದೇ ಇರುವ ಟ್ವೀಟ್‌ಗಳು',
    USER_RETWEETED: '{name} ಮರುಟ್ವೀಟಿಸಿದ್ದಾರೆ',
    VIEW: 'ವೀಕ್ಷಿಸಿ',
    VIEW_TWEET_ANALYTICS: 'ಟ್ವೀಟ್ ಅನಾಲಿಟಿಕ್ಸ್ ಅನ್ನು ನೋಡಿ',
    YOU_RETWEETED: 'ನೀವು ಮರುಟ್ವೀಟಿಸಿದ್ದೀರಿ',
  },
  ko: {
    ACCOUNT_BASED_IN: '계정 소재 국가: {country}',
    ADD_ANOTHER_TWEET: '다른 트윗 추가하기',
    ADD_MUTED_WORD: '뮤트할 단어 추가하기',
    AD_FROM: '{url}의 광고',
    EMBED_TWEET: '트윗 담아가기',
    FOLLOWING_USER: '@{screenName} 님 팔로우 중',
    FOLLOW_BACK_USER: '@{screenName} 님 맞팔로우하기',
    FOLLOW_USER: '@{screenName} 님 팔로우하기',
    GROK_ACTIONS: 'Grok 작업',
    HOME: '홈',
    LIKES: '마음에 들어요',
    LIKE_COUNT: '{formattedCount} {count, plural, other {마음에 들어요}}',
    LIVE_ON_X: 'X 생방송',
    MEDIA_VIEWER: '미디어 뷰어',
    MUTE_THIS_CONVERSATION: '이 대화 뮤트하기',
    NEW_TWEET: '새 트윗',
    POST: '게시',
    POST_ALL: '모두 게시하기',
    POST_TITLE: 'X에서 {name} 님: "{text}"',
    POST_UNAVAILABLE: '이 게시물을 볼 수 없습니다.',
    PROFILE_SUMMARY: '프로필 요약',
    QUOTE: '인용',
    QUOTES: '인용',
    QUOTE_COUNT: '{formattedCount} {count, plural, other {인용}}',
    QUOTE_TWEET: '트윗 인용하기',
    QUOTE_TWEETS: '인용 트윗',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {개의 인용 트윗}}',
    RECENT: '최근',
    REPORT_TWEET: '트윗 신고하기',
    REPOST: '재게시',
    REPOSTS: '재게시',
    REPOST_COUNT: '{formattedCount} {count, plural, other {재게시물}}',
    RETWEET: '리트윗',
    RETWEETS: '리트윗',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {리트윗}}',
    SHARED: '공유된',
    SHARED_TWEETS: '공유 트윗',
    SHOW: '표시',
    SHOW_MORE_REPLIES: '더 많은 답글 보기',
    SHOW_TWEETS: '{count, plural, other {보기 # 트윗}}',
    SORT_BY: '정렬 기준',
    SORT_REPLIES: '답글 정렬하기',
    TURN_OFF_QUOTE_TWEETS: '인용 트윗 끄기',
    TURN_OFF_RETWEETS: '리트윗 끄기',
    TURN_ON_RETWEETS: '리트윗 켜기',
    TWEET: '트윗',
    TWEETED: '트윗했습니다',
    TWEETS: '트윗',
    TWEET_ALL: '모두 트윗하기',
    TWEET_ANALYTICS: '트윗 애널리틱스',
    TWEET_COUNT: '{formattedCount} {count, plural, other {트윗개}}',
    TWEET_INTERACTIONS: '트윗 상호작용',
    TWEET_NOUN: '트윗',
    TWEET_SENT: '트윗을 보냈습니다.',
    TWEET_TITLE: '{name} 님의 트위터: "{text}"',
    TWEET_YOUR_REPLY: '답글을 트윗하세요',
    TWITTER: '트위터',
    UNDO_RETWEET: '리트윗 취소',
    UNFOLLOW_USER: '@{screenName} 님 언팔로우하기',
    UNSENT_TWEETS: '전송하지 않은 트윗',
    USER_RETWEETED: '{name} 님이 리트윗했습니다',
    VIEW: '보기',
    VIEW_TWEET_ANALYTICS: '트윗 애널리틱스 보기',
    YOU_RETWEETED: '내가 리트윗함',
  },
  mr: {
    ACCOUNT_BASED_IN: 'खाते {country} मध्ये आधारित',
    ADD_ANOTHER_TWEET: 'दुसरे ट्विट सामील करा',
    ADD_MUTED_WORD: 'म्यूट केलेले शब्द सामील करा',
    AD_FROM: '{url} कडून जाहिरात',
    EMBED_TWEET: 'एम्बेडेड ट्विट',
    FOLLOWING_USER: '@{screenName} यांना फॉलो करत आहे',
    FOLLOW_BACK_USER: 'परत फॉलो करा @{screenName}',
    FOLLOW_USER: '@{screenName} यांना फॉलो करा',
    GROK_ACTIONS: 'Grok कृती',
    HOME: 'होम',
    LIKES: 'पसंती',
    LIKE_COUNT: '{formattedCount} {count, plural, one {पसंती} other {पसंत्या}}',
    LIVE_ON_X: 'X वर लाइव्ह',
    MEDIA_VIEWER: 'मीडिया व्ह्यूअर',
    MUTE_THIS_CONVERSATION: 'ही चर्चा म्यूट करा',
    NEW_TWEET: 'नवीन ट्विट',
    POST: 'पोस्ट करा',
    POST_ALL: 'सर्व पोस्ट करा',
    POST_TITLE: '{name} X वर: "{text}"',
    POST_UNAVAILABLE: 'हे पोस्ट अनुपलब्ध आहे.',
    PROFILE_SUMMARY: 'प्रोफाइल सारांश',
    QUOTE: 'भाष्य',
    QUOTES: 'भाष्य',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {भाष्य} other {भाष्य}}',
    QUOTE_TWEET: 'ट्विट वर भाष्य करा',
    QUOTE_TWEETS: 'भाष्य ट्विट्स',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {भाष्य ट्विट} other {भाष्य ट्विट्स}}',
    RECENT: 'अलीकडील',
    REPORT_TWEET: 'ट्विट रिपोर्ट करा',
    REPOST: 'पुन्हा पोस्ट करा',
    REPOSTS: 'रिपोस्ट',
    REPOST_COUNT: '{formattedCount} {count, plural, one {रिपोस्ट} other {रिपोस्ट}}',
    RETWEET: 'पुन्हा ट्विट',
    RETWEETS: 'पुनर्ट्विट्स',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {पुन्हा ट्विट करा} other {पुनर्ट्विट्स}}',
    SHARED: 'सामायिक',
    SHARED_TWEETS: 'सामायिक ट्विट',
    SHOW: 'दाखवा',
    SHOW_MORE_REPLIES: 'अधिक प्रत्युत्तरे दाखवा',
    SHOW_TWEETS: '{count, plural, one {# ट्विट दाखवा} other {# ट्विट्स दाखवा}}',
    SORT_BY: 'यानुसार विभागीत करा',
    SORT_REPLIES: 'प्रत्युत्तरांची क्रमवारी करा',
    TURN_OFF_QUOTE_TWEETS: 'भाष्य ट्विट्स बंद करा',
    TURN_OFF_RETWEETS: 'पुनर्ट्विट्स बंद करा',
    TURN_ON_RETWEETS: 'पुनर्ट्विट्स चालू करा',
    TWEET: 'ट्विट',
    TWEETED: 'ट्विट केले',
    TWEETS: 'ट्विट्स',
    TWEET_ALL: 'सर्व ट्विट करा',
    TWEET_ANALYTICS: 'ट्विट विश्लेषणे',
    TWEET_COUNT: '{formattedCount} {count, plural, one {ट्विट} other {ट्विट्स}}',
    TWEET_INTERACTIONS: 'ट्वीट इंटरऍक्शन्स',
    TWEET_NOUN: 'ट्विट',
    TWEET_SENT: 'आपले ट्विट पाठविले होते.',
    TWEET_TITLE: '{name} Twitter वर: "{text}"',
    TWEET_YOUR_REPLY: 'आपले प्रत्युत्तर ट्विट करा',
    UNDO_RETWEET: 'पुनर्ट्विट पूर्ववत करा',
    UNFOLLOW_USER: '@{screenName} यांना अनफॉलो करा',
    UNSENT_TWEETS: 'न पाठविलेली ट्विट्स',
    USER_RETWEETED: '{name} यांनी पुन्हा ट्विट केले',
    VIEW: 'पहा',
    VIEW_TWEET_ANALYTICS: 'ट्विटची विश्लेषणे पहा',
    YOU_RETWEETED: 'आपण पुन्हा ट्विट केले',
  },
  msa: {
    ACCOUNT_BASED_IN: 'Akaun berpangkalan di {country}',
    ADD_ANOTHER_TWEET: 'Tambahkan Tweet lain',
    ADD_MUTED_WORD: 'Tambahkan perkataan yang disenyapkan',
    AD_FROM: 'Iklan daripada {url}',
    EMBED_TWEET: 'Tweet dibenamkan',
    FOLLOWING_USER: 'Mengikuti @{screenName}',
    FOLLOW_BACK_USER: 'Ikut kembali @{screenName}',
    FOLLOW_USER: 'Ikut @{screenName}',
    GROK_ACTIONS: 'Tindakan Grok',
    HOME: 'Laman Utama',
    LIKES: 'Suka',
    LIKE_COUNT: '{formattedCount} {count, plural, other {suka}}',
    LIVE_ON_X: 'Secara Langsung di X',
    MEDIA_VIEWER: 'Penonton Media',
    MUTE_THIS_CONVERSATION: 'Senyapkan perbualan ini',
    NEW_TWEET: 'Tweet Baharu',
    POST: 'Siaran',
    POST_ALL: 'Siarkan semua',
    POST_TITLE: '{name} di X: "{text}"',
    POST_UNAVAILABLE: 'Siaran ini tidak tersedia.',
    PROFILE_SUMMARY: 'Ringkasan Profil',
    QUOTE: 'Petikan',
    QUOTES: 'Petikan',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {petikan} other {petikan}}',
    QUOTE_TWEET: 'Petik Tweet',
    QUOTE_TWEETS: 'Tweet Petikan',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {Tweet Petikan}}',
    RECENT: 'Terkini',
    REPORT_TWEET: 'Laporkan Tweet',
    REPOST: 'Siaran semula',
    REPOSTS: 'Siaran semula',
    REPOST_COUNT: '{formattedCount} {count, plural, one {siaran semula} other {siaran semula}}',
    RETWEET: 'Tweet semula',
    RETWEETS: 'Tweet semula',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {Tweet semula}}',
    SHARED: 'Dikongsi',
    SHARED_TWEETS: 'Tweet Berkongsi',
    SHOW: 'Tunjukkan',
    SHOW_MORE_REPLIES: 'Tunjukkan lagi balasan',
    SHOW_TWEETS: '{count, plural, other {Tunjukkan # Tweet}}',
    SORT_BY: 'Isih Mengikut',
    SORT_REPLIES: 'Isih balasan',
    TURN_OFF_QUOTE_TWEETS: 'Matikan Tweet Petikan',
    TURN_OFF_RETWEETS: 'Matikan Tweet semula',
    TURN_ON_RETWEETS: 'Hidupkan Tweet semula',
    TWEETED: 'telah mengetweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Tweet semua',
    TWEET_ANALYTICS: 'Analitis Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, other {Tweet}}',
    TWEET_INTERACTIONS: 'Interaksi Tweet',
    TWEET_SENT: 'Tweet anda telah dihantar.',
    TWEET_TITLE: '{name} di Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweet balasan anda',
    UNDO_RETWEET: 'Buat asal Tweet semula',
    UNFOLLOW_USER: 'Nyahikut @{screenName}',
    UNSENT_TWEETS: 'Tweet yang tidak dihantar',
    USER_RETWEETED: '{name} Tweet semula',
    VIEW: 'Lihat',
    VIEW_TWEET_ANALYTICS: 'Lihat analitis Tweet',
    YOU_RETWEETED: 'Anda Mengetweet semula',
  },
  nl: {
    ACCOUNT_BASED_IN: 'Account vanuit {country}',
    ADD_ANOTHER_TWEET: 'Nog een Tweet toevoegen',
    ADD_MUTED_WORD: 'Genegeerd woord toevoegen',
    AD_FROM: 'Advertentie van {url}',
    EMBED_TWEET: 'Tweet insluiten',
    FOLLOWING_USER: '@{screenName} volgend',
    FOLLOW_BACK_USER: 'Volg @{screenName} terug',
    FOLLOW_USER: '@{screenName} volgen',
    GROK_ACTIONS: 'Grok-acties',
    HOME: 'Startpagina',
    LIKES: 'Vind-ik-leuks',
    LIKE_COUNT: '{formattedCount} {count, plural, one {vind-ik-leuk} other {vind-ik-leuks}}',
    LIVE_ON_X: 'Live op X',
    MEDIA_VIEWER: 'Mediaweergave',
    MUTE_THIS_CONVERSATION: 'Dit gesprek negeren',
    NEW_TWEET: 'Nieuwe Tweet',
    POST_ALL: 'Alles plaatsen',
    POST_TITLE: "{name} op X: '{text}'",
    POST_UNAVAILABLE: 'Deze post is niet beschikbaar.',
    PROFILE_SUMMARY: 'Profieloverzicht',
    QUOTE: 'Geciteerd',
    QUOTES: 'Geciteerd',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {citaat} other {citaten}}',
    QUOTE_TWEET: 'Citeer Tweet',
    QUOTE_TWEETS: 'Geciteerde Tweets',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Geciteerde Tweet} other {Geciteerde Tweets}}',
    REPORT_TWEET: 'Tweet rapporteren',
    RETWEET: 'Retweeten',
    SHARED: 'Gedeeld',
    SHARED_TWEETS: 'Gedeelde Tweets',
    SHOW: 'Weergeven',
    SHOW_MORE_REPLIES: 'Meer antwoorden tonen',
    SHOW_TWEETS: '{count, plural, one {# Tweet weergeven} other {# Tweets weergeven}}',
    SORT_BY: 'Sorteren op',
    SORT_REPLIES: 'Antwoorden sorteren',
    TURN_OFF_QUOTE_TWEETS: 'Geciteerde Tweets uitschakelen',
    TURN_OFF_RETWEETS: 'Retweets uitschakelen',
    TURN_ON_RETWEETS: 'Retweets inschakelen',
    TWEET: 'Tweeten',
    TWEETED: 'heeft getweet',
    TWEET_ALL: 'Alles tweeten',
    TWEET_ANALYTICS: 'Tweet-analyses',
    TWEET_INTERACTIONS: 'Tweet-interacties',
    TWEET_SENT: 'Je Tweet is verstuurd.',
    TWEET_TITLE: '{name} op Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweet je antwoord',
    UNDO_RETWEET: 'Retweet ongedaan maken',
    UNFOLLOW_USER: '@{screenName} ontvolgen',
    UNSENT_TWEETS: 'Niet-verstuurde Tweets',
    USER_RETWEETED: '{name} heeft geretweet',
    VIEW: 'Bekijken',
    VIEW_TWEET_ANALYTICS: 'Tweet-analyses bekijken',
    YOU_RETWEETED: 'Je hebt geretweet',
  },
  no: {
    ACCOUNT_BASED_IN: 'Konto basert i {country}',
    ADD_ANOTHER_TWEET: 'Legg til en annen Tweet',
    ADD_MUTED_WORD: 'Legg til skjult ord',
    AD_FROM: 'Annonse fra {url}',
    EMBED_TWEET: 'Bygg inn tweeten',
    FOLLOWING_USER: 'Følger @{screenName}',
    FOLLOW_BACK_USER: 'Følg @{screenName} tilbake',
    FOLLOW_USER: 'Følg @{screenName}',
    GROK_ACTIONS: 'Grok-handlinger',
    HOME: 'Hjem',
    LIKES: 'Liker',
    LIKE_COUNT: '{formattedCount} {count, plural, one {likerklikk} other {likerklikk}}',
    LIVE_ON_X: 'Direkte på X',
    MEDIA_VIEWER: 'Medievisning',
    MUTE_THIS_CONVERSATION: 'Dempe denne samtalen',
    NEW_TWEET: 'Ny Tweet',
    POST: 'Publiser',
    POST_ALL: 'Publiser alle',
    POST_TITLE: '{name} på X: «{text}»',
    POST_UNAVAILABLE: 'Dette innlegget er utilgjengelig.',
    PROFILE_SUMMARY: 'Profilsammendrag',
    QUOTE: 'Sitat',
    QUOTES: 'Sitater',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {site} other {siter}}',
    QUOTE_TWEET: 'Sitat-Tweet',
    QUOTE_TWEETS: 'Sitat-Tweets',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Sitat-Tweet} other {Sitat-Tweets}}',
    RECENT: 'Nylig',
    REPORT_TWEET: 'Rapporter tweeten',
    REPOST: 'Republiser',
    REPOSTS: 'Republiseringer',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {republisert innlegg} other {republiserte innlegg}}',
    SHARED: 'Delt',
    SHARED_TWEETS: 'Delte tweets',
    SHOW: 'Vis',
    SHOW_MORE_REPLIES: 'Vis flere svar',
    SHOW_TWEETS: '{count, plural, one {Vis # Tweet} other {Vis # Tweets}}',
    SORT_BY: 'Sorter etter',
    SORT_REPLIES: 'Sorter svar',
    TURN_OFF_QUOTE_TWEETS: 'Slå av sitat-tweets',
    TURN_OFF_RETWEETS: 'Slå av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
    TWEETED: 'tweetet',
    TWEET_ALL: 'Tweet alle',
    TWEET_ANALYTICS: 'Tweet-statistikk',
    TWEET_COUNT: '{formattedCount} {count, plural, one {tweet} other {tweets}}',
    TWEET_INTERACTIONS: 'Tweet-interaksjoner',
    TWEET_SENT: 'Tweeten din ble sendt.',
    TWEET_TITLE: '{name} på Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweet svaret ditt',
    UNDO_RETWEET: 'Angre Retweet',
    UNFOLLOW_USER: 'Avfølg @{screenName}',
    UNSENT_TWEETS: 'Usendte Tweets',
    USER_RETWEETED: '{name} retweetet',
    VIEW: 'Vis',
    VIEW_TWEET_ANALYTICS: 'Se tweetstatistikk',
    YOU_RETWEETED: 'Du retweetet',
  },
  pl: {
    ACCOUNT_BASED_IN: 'Konto zarejestrowane w {country}',
    ADD_ANOTHER_TWEET: 'Dodaj kolejnego Tweeta',
    ADD_MUTED_WORD: 'Dodaj wyciszone słowo',
    AD_FROM: 'Reklama z {url}',
    EMBED_TWEET: 'Zamieść Tweeta',
    FOLLOWING_USER: 'Obserwujesz użytkownika @{screenName}',
    FOLLOW_BACK_USER: 'Również obserwuj @{screenName}',
    FOLLOW_USER: 'Obserwuj @{screenName}',
    GROK_ACTIONS: 'Akcje Groka',
    HOME: 'Strona Główna',
    LIKES: 'Polubienia',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {polubienie} few {polubienia} many {polubień} other {polubień}}',
    LIVE_ON_X: 'Na żywo w serwisie X',
    MEDIA_VIEWER: 'Przeglądarka multimediów',
    MUTE_THIS_CONVERSATION: 'Wycisz tę rozmowę',
    NEW_TWEET: 'Nowy Tweet',
    POST: 'Wpis',
    POST_ALL: 'Opublikuj wszystko',
    POST_TITLE: '{name} w serwisie X: „{text}”',
    POST_UNAVAILABLE: 'Ten wpis jest niedostępny.',
    PROFILE_SUMMARY: 'Podsumowanie profilu',
    QUOTE: 'Cytuj',
    QUOTES: 'Cytaty',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {cytat} few {cytaty} many {cytatów} other {cytatu}}',
    QUOTE_TWEET: 'Cytuj Tweeta',
    QUOTE_TWEETS: 'Tweety z cytatami',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet z cytatem} few {Tweety z cytatami} many {Tweetów z cytatami} other {Tweetów z cytatami}}',
    RECENT: 'Najnowsze',
    REPORT_TWEET: 'Zgłoś Tweeta',
    REPOST: 'Podaj dalej wpis',
    REPOSTS: 'Wpisy podane dalej',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {podany dalej wpis} few {podane dalej wpisy} many {podanych dalej wpisów} other {podanych dalej wpisów}}',
    RETWEET: 'Podaj dalej',
    RETWEETS: 'Tweety podane dalej',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet podany dalej} few {Tweety podane dalej} many {Tweetów podanych dalej} other {Tweetów podanych dalej}}',
    SHARED: 'Udostępniony',
    SHARED_TWEETS: 'Udostępnione Tweety',
    SHOW: 'Pokaż',
    SHOW_MORE_REPLIES: 'Pokaż więcej odpowiedzi',
    SHOW_TWEETS:
      '{count, plural, one {Pokaż # Tweeta} few {Pokaż # Tweety} many {Pokaż # Tweetów} other {Pokaż # Tweetów}}',
    SORT_BY: 'Sortuj według',
    SORT_REPLIES: 'Sortuj odpowiedzi',
    TURN_OFF_QUOTE_TWEETS: 'Wyłącz tweety z cytatem',
    TURN_OFF_RETWEETS: 'Wyłącz Tweety podane dalej',
    TURN_ON_RETWEETS: 'Włącz Tweety podane dalej',
    TWEETED: 'wysłał/a Tweeta',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnij wszystko',
    TWEET_ANALYTICS: 'Statystyki Tweetów',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet} few {Tweety} many {Tweetów} other {Tweetów}}',
    TWEET_INTERACTIONS: 'Interakcje z Tweetem',
    TWEET_SENT: 'Twój Tweet został wysłany.',
    TWEET_TITLE: '{name} na Twitterze: „{text}”',
    TWEET_YOUR_REPLY: 'Tweeta swoją odpowiedź',
    UNDO_RETWEET: 'Cofnij podanie dalej',
    UNFOLLOW_USER: 'Przestań obserwować użytkownika @{screenName}',
    UNSENT_TWEETS: 'Niewysłane Tweety',
    USER_RETWEETED: '{name} podał/a dalej Tweeta',
    VIEW: 'Wyświetl',
    VIEW_TWEET_ANALYTICS: 'Zobacz statystyki dotyczące Tweeta',
    YOU_RETWEETED: 'Podałeś/aś dalej',
  },
  pt: {
    ACCOUNT_BASED_IN: 'Conta com sede em {country}',
    ADD_ANOTHER_TWEET: 'Adicionar outro Tweet',
    ADD_MUTED_WORD: 'Adicionar palavra silenciada',
    AD_FROM: 'Anúncio de {url}',
    EMBED_TWEET: 'Incorporar Tweet',
    FOLLOWING_USER: 'Seguindo @{screenName}',
    FOLLOW_BACK_USER: 'Seguir de volta @{screenName}',
    FOLLOW_USER: 'Seguir @{screenName}',
    GROK_ACTIONS: 'Ações do Grok',
    HOME: 'Página Inicial',
    LIKES: 'Curtidas',
    LIKE_COUNT: '{formattedCount} {count, plural, one {curtida} many {curtidas} other {curtidas}}',
    LIVE_ON_X: 'Ao vivo no X',
    MEDIA_VIEWER: 'Visualizador de mídia',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    NEW_TWEET: 'Novo Tweet',
    POST: 'Postar',
    POST_ALL: 'Postar tudo',
    POST_TITLE: '{name} no X: "{text}"',
    POST_UNAVAILABLE: 'Este post está indisponível.',
    PROFILE_SUMMARY: 'Resumo do perfil',
    QUOTE: 'Comentar',
    QUOTES: 'Comentários',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {comentar} other {comentar}}',
    QUOTE_TWEET: 'Comentar o Tweet',
    QUOTE_TWEETS: 'Tweets com comentário',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet com comentário} many {Tweets com comentário} other {Tweets com comentário}}',
    RECENT: 'Recente',
    REPORT_TWEET: 'Denunciar Tweet',
    REPOST: 'Repostar',
    RETWEET: 'Retweetar',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Retweet} many {Retweets} other {Retweets}}',
    SHARED: 'Compartilhado',
    SHARED_TWEETS: 'Tweets Compartilhados',
    SHOW: 'Mostrar',
    SHOW_MORE_REPLIES: 'Mostrar mais respostas',
    SHOW_TWEETS:
      '{count, plural, one {Mostrar # Tweet} many {Mostrar # Tweets} other {Mostrar # Tweets}}',
    SORT_BY: 'Classificar por',
    SORT_REPLIES: 'Ordenar respostas',
    TURN_OFF_QUOTE_TWEETS: 'Desativar Tweets com comentário',
    TURN_OFF_RETWEETS: 'Desativar Retweets',
    TURN_ON_RETWEETS: 'Ativar Retweets',
    TWEET: 'Tweetar',
    TWEETED: 'Tweetou',
    TWEET_ALL: 'Tweetar tudo',
    TWEET_ANALYTICS: 'Estatísticas do Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} many {Tweets} other {Tweets}}',
    TWEET_INTERACTIONS: 'Interações com Tweet',
    TWEET_SENT: 'Seu Tweet foi enviado.',
    TWEET_TITLE: '{name} no Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Tweetar sua resposta',
    UNDO_RETWEET: 'Desfazer Retweet',
    UNFOLLOW_USER: 'Deixar de seguir @{screenName}',
    UNSENT_TWEETS: 'Tweets não enviados',
    USER_RETWEETED: '{name} Retweetou',
    VIEW: 'Ver',
    VIEW_TWEET_ANALYTICS: 'Ver estatísticas do Tweet',
    YOU_RETWEETED: 'Você retweetou',
  },
  ro: {
    ACCOUNT_BASED_IN: 'Cont cu sediul în {country}',
    ADD_ANOTHER_TWEET: 'Adaugă alt Tweet',
    ADD_MUTED_WORD: 'Adaugă cuvântul ignorat',
    AD_FROM: 'Reclamă de la {url}',
    EMBED_TWEET: 'Încorporează un Tweet',
    FOLLOWING_USER: 'Urmărite de @{screenName}',
    FOLLOW_BACK_USER: 'Urmărește-l la rândul tău pe @{screenName}',
    FOLLOW_USER: 'Urmărește pe @{screenName}',
    GROK_ACTIONS: 'Acțiuni Grok',
    HOME: 'Pagina principală',
    LIKES: 'Aprecieri',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {apreciere} few {aprecieri} other {de aprecieri}}',
    LIVE_ON_X: 'În direct pe X',
    MEDIA_VIEWER: 'Vizualizator media',
    MUTE_THIS_CONVERSATION: 'Ignoră această conversație',
    NEW_TWEET: 'Tweet nou',
    POST: 'Postează',
    POST_ALL: 'Postează tot',
    POST_TITLE: '{name} pe X: „{text}”',
    POST_UNAVAILABLE: 'Această postare este indisponibilă.',
    PROFILE_SUMMARY: 'Sumarul profilului',
    QUOTE: 'Citat',
    QUOTES: 'Citate',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {citat} few {citate} other {de citate}}',
    QUOTE_TWEET: 'Citează Tweetul',
    QUOTE_TWEETS: 'Tweeturi cu citat',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet cu citat} few {(de) Tweeturi cu citat} other {(de) Tweeturi cu citat}}',
    RECENT: 'Recente',
    REPORT_TWEET: 'Raportează Tweetul',
    REPOST: 'Repostează',
    REPOSTS: 'Repostări',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {repostare} few {repostări} other {de repostări}}',
    RETWEET: 'Redistribuie',
    RETWEETS: 'Retweeturi',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {Retweet} few {Retweeturi} other {de Retweeturi}}',
    SHARED: 'Partajat',
    SHARED_TWEETS: 'Tweeturi partajate',
    SHOW: 'Afișează',
    SHOW_MORE_REPLIES: 'Afișează mai multe răspunsuri',
    SHOW_TWEETS:
      '{count, plural, one {Afișează # Dă Tweet} few {Afișează # Tweeturi} other {Afișează # Tweeturi}}',
    SORT_BY: 'Sortează după',
    SORT_REPLIES: 'Sortare răspunsuri',
    TURN_OFF_QUOTE_TWEETS: 'Dezactivează tweeturile cu citat',
    TURN_OFF_RETWEETS: 'Dezactivează Retweeturile',
    TURN_ON_RETWEETS: 'Activează Retweeturile',
    TWEETED: 'a dat Tweetul',
    TWEETS: 'Tweeturi',
    TWEET_ALL: 'Dă Tweeturi cu tot',
    TWEET_ANALYTICS: 'Analize Tweet',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet} few {(de) Tweeturi} other {(de) Tweeturi}}',
    TWEET_INTERACTIONS: 'Interacțiuni cu Tweetul',
    TWEET_SENT: 'Tweetul tău a fost trimis.',
    TWEET_TITLE: '{name} pe Twitter: „{text}”',
    TWEET_YOUR_REPLY: 'Dă Tweet cu răspunsul',
    UNDO_RETWEET: 'Anulează Retweetul',
    UNFOLLOW_USER: 'Anulează urmărirea utilizatorului @{screenName}',
    UNSENT_TWEETS: 'Tweeturi netrimise',
    USER_RETWEETED: '{name} a redistribuit',
    VIEW: 'Vezi',
    VIEW_TWEET_ANALYTICS: 'Vezi analiza Tweet',
    YOU_RETWEETED: 'Ai redistribuit',
  },
  ru: {
    ACCOUNT_BASED_IN: 'Страна учётной записи: {country}',
    ADD_ANOTHER_TWEET: 'Добавить еще один твит',
    ADD_MUTED_WORD: 'Добавить игнорируемое слово',
    AD_FROM: 'Реклама от {url}',
    EMBED_TWEET: 'Встроить твит',
    FOLLOWING_USER: 'Вы читаете @{screenName}',
    FOLLOW_BACK_USER: 'Подписаться в ответ на @{screenName}',
    FOLLOW_USER: 'Начать читать @{screenName}',
    GROK_ACTIONS: 'Действия Grok',
    HOME: 'Главная',
    LIKES: 'Нравится',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {отметка «Нравится»} few {отметки «Нравится»} many {отметок «Нравится»} other {отметки «Нравится»}}',
    LIVE_ON_X: 'Прямой эфир в X',
    MEDIA_VIEWER: 'Окно просмотра медиафайлов',
    MUTE_THIS_CONVERSATION: 'Игнорировать эту переписку',
    NEW_TWEET: 'Новый твит',
    POST: 'Опубликовать пост',
    POST_ALL: 'Опубликовать все',
    POST_TITLE: '{name} в X: «{text}»',
    POST_UNAVAILABLE: 'Этот пост недоступен.',
    PROFILE_SUMMARY: 'Сводка профиля',
    QUOTE: 'Цитата',
    QUOTES: 'Цитаты',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {цитировать} few {цитировать} many {цитировать} other {цитировать}}',
    QUOTE_TWEET: 'Цитировать',
    QUOTE_TWEETS: 'Твиты с цитатами',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Твит с цитатой} few {Твита с цитатами} many {Твитов с цитатами} other {Твита с цитатами}}',
    RECENT: 'Последние',
    REPORT_TWEET: 'Пожаловаться на твит',
    REPOST: 'Сделать репост',
    REPOSTS: 'Репосты',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {репост} few {репоста} many {репостов} other {репостов}}',
    RETWEET: 'Ретвитнуть',
    RETWEETS: 'Ретвиты',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {ретвит} few {ретвита} many {ретвитов} other {ретвита}}',
    SHARED: 'Общий',
    SHARED_TWEETS: 'Общие твиты',
    SHOW: 'Показать',
    SHOW_MORE_REPLIES: 'Показать ещё ответы',
    SHOW_TWEETS:
      '{count, plural, one {Показать # твит} few {Показать # твита} many {Показать # твитов} other {Показать # твита}}',
    SORT_BY: 'Сортировать по',
    SORT_REPLIES: 'Упорядочить ответы',
    TURN_OFF_QUOTE_TWEETS: 'Отключить твиты с цитатами',
    TURN_OFF_RETWEETS: 'Отключить ретвиты',
    TURN_ON_RETWEETS: 'Включить ретвиты',
    TWEET: 'Твитнуть',
    TWEETED: 'твитнул(а)',
    TWEETS: 'Твиты',
    TWEET_ALL: 'Твитнуть все',
    TWEET_ANALYTICS: 'Аналитика твитов',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {Твит} few {Твита} many {Твитов} other {Твита}}',
    TWEET_INTERACTIONS: 'Взаимодействия с твитом',
    TWEET_NOUN: 'Твит',
    TWEET_SENT: 'Твит отправлен.',
    TWEET_TITLE: '{name} в Твиттере: «{text}»',
    TWEET_YOUR_REPLY: 'Твитните свой ответ',
    TWITTER: 'Твиттер',
    UNDO_RETWEET: 'Отменить ретвит',
    UNFOLLOW_USER: 'Перестать читать @{screenName}',
    UNSENT_TWEETS: 'Неотправленные твиты',
    USER_RETWEETED: '{name} ретвитнул(а)',
    VIEW: 'Посмотреть',
    VIEW_TWEET_ANALYTICS: 'Смотреть аналитику твита',
    YOU_RETWEETED: 'Вы ретвитнули',
  },
  sk: {
    ACCOUNT_BASED_IN: 'Účet registrovaný v krajine {country}',
    ADD_ANOTHER_TWEET: 'Pridať ďalší Tweet',
    ADD_MUTED_WORD: 'Pridať stíšené slovo',
    AD_FROM: 'Reklama od {url}',
    EMBED_TWEET: 'Vložiť Tweet',
    FOLLOWING_USER: 'Sleduje sa používateľ @{screenName}',
    FOLLOW_BACK_USER: 'Sledovať späť @{screenName}',
    FOLLOW_USER: 'Sledovať používateľa @{screenName}',
    GROK_ACTIONS: 'Akcie Groka',
    HOME: 'Domov',
    LIKES: 'Páči sa',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {označenie Páči sa} few {označenia Páči sa} many {označenia Páči sa} other {označení Páči sa}}',
    LIVE_ON_X: 'Naživo na X',
    MEDIA_VIEWER: 'Prehliadač médií',
    MUTE_THIS_CONVERSATION: 'Stíšiť túto konverzáciu',
    NEW_TWEET: 'Nový Tweet',
    POST: 'Uverejniť',
    POST_ALL: 'Uverejniť všetko',
    POST_TITLE: '{name} v službe X: „{text}“',
    POST_UNAVAILABLE: 'Tento príspevok je nedostupný.',
    PROFILE_SUMMARY: 'Súhrn profilu',
    QUOTE: 'Citát',
    QUOTES: 'Citáty',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {citovanie} few {citovania} many {citovaní} other {citovaní}}',
    QUOTE_TWEET: 'Tweet s citátom',
    QUOTE_TWEETS: 'Tweety s citátom',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet s citátom} few {Tweety s citátom} many {Tweetu s citátom} other {Tweetov s citátom}}',
    RECENT: 'Nedávne',
    REPORT_TWEET: 'Nahlásiť Tweet',
    REPOST: 'Repostnúť',
    REPOSTS: 'reposty',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {repost} few {reposty} many {repostov} other {repostov}}',
    RETWEET: 'Retweetnuť',
    RETWEETS: 'Retweety',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {retweet} few {retweety} many {retweetu} other {retweetov}}',
    SHARED: 'Zdieľaný',
    SHARED_TWEETS: 'Zdieľané Tweety',
    SHOW: 'Zobraziť',
    SHOW_MORE_REPLIES: 'Zobraziť viac odpovedí',
    SHOW_TWEETS:
      '{count, plural, one {Zobraziť # Tweet} few {Zobraziť # Tweety} many {Zobraziť # Tweetu} other {Zobraziť # Tweetov}}',
    SORT_BY: 'Spôsob zoradenia',
    SORT_REPLIES: 'Zoradiť odpovede',
    TURN_OFF_QUOTE_TWEETS: 'Vypnúť tweety s citátom',
    TURN_OFF_RETWEETS: 'Vypnúť retweety',
    TURN_ON_RETWEETS: 'Zapnúť retweety',
    TWEET: 'Tweetnuť',
    TWEETED: 'tweetoval',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnuť všetko',
    TWEET_ANALYTICS: 'Štatistika Tweetov',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {Tweet} few {Tweety} many {Tweetu} other {Tweetov}}',
    TWEET_INTERACTIONS: 'Interakcie s Tweetom',
    TWEET_SENT: 'Váš Tweet bol odoslaný.',
    TWEET_TITLE: '{name} na Twitteri: "{text}"',
    TWEET_YOUR_REPLY: 'Tweetnite odpoveď',
    UNDO_RETWEET: 'Zrušiť retweet',
    UNFOLLOW_USER: 'Nesledovať používateľa @{screenName}',
    UNSENT_TWEETS: 'Neodoslané Tweety',
    USER_RETWEETED: 'Retweetol používateľ {name}',
    VIEW: 'Zobraziť',
    VIEW_TWEET_ANALYTICS: 'Zobraziť štatistiku Tweetu',
    YOU_RETWEETED: 'Retweetli ste',
  },
  sr: {
    ACCOUNT_BASED_IN: 'Налог са седиштем у {country}',
    ADD_ANOTHER_TWEET: 'Додај још један твит',
    ADD_MUTED_WORD: 'Додај игнорисану реч',
    AD_FROM: 'Оглас од {url}',
    EMBED_TWEET: 'Угради твит',
    FOLLOWING_USER: 'Пратиш корисника @{screenName}',
    FOLLOW_BACK_USER: 'Прати назад @{screenName}',
    FOLLOW_USER: 'Прати корисника @{screenName}',
    GROK_ACTIONS: 'Grok радње',
    HOME: 'Почетна',
    LIKES: 'Свиђања',
    LIKE_COUNT: '{formattedCount} {count, plural, one {свиђање} few {свиђања} other {свиђања}}',
    LIVE_ON_X: 'Уживо на мрежи X',
    MEDIA_VIEWER: 'Прегледач медија',
    MUTE_THIS_CONVERSATION: 'Игнориши овај разговор',
    NEW_TWEET: 'Нови твит',
    POST: 'Објава',
    POST_ALL: 'Објави све',
    POST_TITLE: '{name} на мрежи X: „{text}“',
    POST_UNAVAILABLE: 'Ова објава није доступна.',
    PROFILE_SUMMARY: 'Резиме профила',
    QUOTE: 'Цитат',
    QUOTES: 'Цитати',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {цитат} few {цитата} other {цитата}}',
    QUOTE_TWEET: 'твит са цитатом',
    QUOTE_TWEETS: 'Твитови са цитатом',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Твит са цитатом} few {Твита са цитатом} other {Твитова са цитатом}}',
    RECENT: 'Недавни',
    REPORT_TWEET: 'Пријави твит',
    REPOST: 'Поново објави',
    REPOSTS: 'Понвне објаве',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {поновна објава} few {поновне објаве} other {поновних објава}}',
    RETWEET: 'Ретвитуј',
    RETWEETS: 'Ретвитови',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {ретвит} few {ретвита} other {ретвитова}}',
    SHARED: 'Подељено',
    SHARED_TWEETS: 'Дељени твитови',
    SHOW: 'Прикажи',
    SHOW_MORE_REPLIES: 'Прикажи још одговора',
    SHOW_TWEETS:
      '{count, plural, one {Прикажи # твит} few {Прикажи # твита} other {Прикажи # твитова}}',
    SORT_BY: 'Сортирај по',
    SORT_REPLIES: 'Сортирање одговора',
    TURN_OFF_QUOTE_TWEETS: 'Искључи твит(ов)е са цитатом',
    TURN_OFF_RETWEETS: 'Искључи ретвитове',
    TURN_ON_RETWEETS: 'Укључи ретвитове',
    TWEET: 'Твитуј',
    TWEETED: 'је твитовао/ла',
    TWEETS: 'Твитови',
    TWEET_ALL: 'Твитуј све',
    TWEET_ANALYTICS: 'Аналитика твита',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Твит} few {Твита} other {Твитова}}',
    TWEET_INTERACTIONS: 'Интеракције са твитом',
    TWEET_NOUN: 'Твит',
    TWEET_SENT: 'Твит је послат.',
    TWEET_TITLE: '{name} на Твитеру: "{text}"',
    TWEET_YOUR_REPLY: 'Твитуј свој одговор',
    TWITTER: 'Твитер',
    UNDO_RETWEET: 'Опозови ретвит',
    UNFOLLOW_USER: 'Не прати корисника @{screenName}',
    UNSENT_TWEETS: 'Непослати твитови',
    USER_RETWEETED: '{name} је ретвитовао/ла',
    VIEW: 'Погледај',
    VIEW_TWEET_ANALYTICS: 'Погледај аналитику твита',
    YOU_RETWEETED: 'Ретвитовао/ла си',
  },
  sv: {
    ACCOUNT_BASED_IN: 'Konto baserat i {country}',
    ADD_ANOTHER_TWEET: 'Lägg till en Tweet till',
    ADD_MUTED_WORD: 'Lägg till ignorerat ord',
    AD_FROM: 'Annons från {url}',
    EMBED_TWEET: 'Bädda in Tweeten',
    FOLLOWING_USER: 'Följer @{screenName}',
    FOLLOW_BACK_USER: 'Följ du också @{screenName}',
    FOLLOW_USER: 'Följ @{screenName}',
    GROK_ACTIONS: 'Grok-åtgärder',
    HOME: 'Hem',
    LIKES: 'Gilla-markeringar',
    LIKE_COUNT: '{formattedCount} {count, plural, one {gilla-markering} other {gilla-markeringar}}',
    LIVE_ON_X: 'Live på X',
    MEDIA_VIEWER: 'Medievisare',
    MUTE_THIS_CONVERSATION: 'Ignorera den här konversationen',
    NEW_TWEET: 'Ny Tweet',
    POST: 'Lägg upp',
    POST_ALL: 'Lägg upp allt',
    POST_TITLE: '{name} på X: {text}',
    POST_UNAVAILABLE: 'Detta inlägg är inte tillgängligt.',
    PROFILE_SUMMARY: 'Profilöversikt',
    QUOTE: 'Citat',
    QUOTES: 'Citat',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {citat} other {citat}}',
    QUOTE_TWEET: 'Citera Tweet',
    QUOTE_TWEETS: 'Citat-tweets',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Citat-tweet} other {Citat-tweets}}',
    RECENT: 'Senaste',
    REPORT_TWEET: 'Anmäl Tweeten',
    REPOST: 'Återpublicera',
    REPOSTS: 'Återpubliceringar',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {återpublicering} other {återpubliceringar}}',
    RETWEET: 'Retweeta',
    SHARED: 'Delad',
    SHARED_TWEETS: 'Delade tweetsen',
    SHOW: 'Visa',
    SHOW_MORE_REPLIES: 'Visa fler svar',
    SHOW_TWEETS: '{count, plural, one {Visa # Tweet} other {Visa # Tweets}}',
    SORT_BY: 'Sortera efter',
    SORT_REPLIES: 'Sortera svar',
    TURN_OFF_QUOTE_TWEETS: 'Stäng av citat-tweets',
    TURN_OFF_RETWEETS: 'Stäng av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
    TWEET: 'Tweeta',
    TWEETED: 'tweetade',
    TWEET_ALL: 'Tweeta allt',
    TWEET_ANALYTICS: 'Tweet-statistik',
    TWEET_INTERACTIONS: 'Interaktioner med Tweet',
    TWEET_SENT: 'Din Tweet skickades.',
    TWEET_TITLE: '{name} på Twitter: ”{text}”',
    TWEET_YOUR_REPLY: 'Tweeta ditt svar',
    UNDO_RETWEET: 'Ångra retweeten',
    UNFOLLOW_USER: 'Avfölj @{screenName}',
    UNSENT_TWEETS: 'Tweets som inte har skickats',
    USER_RETWEETED: '{name} retweetade',
    VIEW: 'Visa',
    VIEW_TWEET_ANALYTICS: 'Visa Tweet-statistik',
    YOU_RETWEETED: 'Du Retweetade',
  },
  ta: {
    ACCOUNT_BASED_IN: '{country}-ஐச் சேர்ந்த கணக்கு\n',
    ADD_ANOTHER_TWEET: 'வேறொரு கீச்சைச் சேர்',
    ADD_MUTED_WORD: 'செயல்மறைத்த வார்த்தையைச் சேர்',
    AD_FROM: '{url} இலிருந்து விளம்பரம்',
    EMBED_TWEET: 'கீச்சை உட்பொதி',
    FOLLOWING_USER: 'பின்வருபவை @{screenName}',
    FOLLOW_BACK_USER: '@{screenName}ஐ மீண்டும் பின்தொடரவும்',
    FOLLOW_USER: '@{screenName}-ஐப் பின்தொடர்',
    GROK_ACTIONS: 'Grok செயல்கள்',
    HOME: 'முகப்பு',
    LIKES: 'விருப்பங்கள்',
    LIKE_COUNT: '{formattedCount} {count, plural, one {விருப்பம்} other {விருப்பங்கள்}}',
    LIVE_ON_X: 'X -இல் நேரலை',
    MEDIA_VIEWER: 'மீடியா பார்வையாளர்',
    MUTE_THIS_CONVERSATION: 'இந்த உரையாடலை செயல்மறை',
    NEW_TWEET: 'புதிய கீச்சு',
    POST: 'இடுகை',
    POST_ALL: 'எல்லாம் இடுகையிடு',
    POST_TITLE: 'X இல் {name}: "{text}"',
    POST_UNAVAILABLE: 'இந்த இடுகை கிடைக்கவில்லை.',
    PROFILE_SUMMARY: 'சுயவிவரச் சுருக்கம்',
    QUOTE: 'மேற்கோள்',
    QUOTES: 'மேற்கோள்கள்',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {மேற்கோள் காட்டு} other {மேற்கோள் காட்டு}}',
    QUOTE_TWEET: 'ட்விட்டை மேற்கோள் காட்டு',
    QUOTE_TWEETS: 'மேற்கோள் கீச்சுகள்',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {மேற்கோள் கீச்சு} other {மேற்கோள் கீச்சுகள்}}',
    RECENT: 'சமீபத்தியவை',
    REPORT_TWEET: 'கீச்சைப் பற்றி புகாரளி',
    REPOST: 'மறுஇடுகை',
    REPOSTS: 'மறுஇடுகைகள்',
    REPOST_COUNT: '{formattedCount} {count, plural, one {மறுஇடுகை} other {மறுஇடுகைகள்}}',
    RETWEET: 'மறுட்விட் செய்',
    RETWEETS: 'மறுகீச்சுகள்',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {மறுகீச்சு} other {மறுகீச்சுகள்}}',
    SHARED: 'பகிரப்பட்டது',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
    SHOW: 'காண்பி',
    SHOW_MORE_REPLIES: 'மேலும் பதில்களைக் காண்பி',
    SHOW_TWEETS: '{count, plural, one {# கீச்சு-ஐக் காண்பி} other {# கீச்சுகள்-ஐக் காண்பி}}',
    SORT_BY: 'இதன்படி வரிசைப்படுத்து:',
    SORT_REPLIES: 'பதில்களை வகைப்படுத்து',
    TURN_OFF_QUOTE_TWEETS: 'மேற்கோள் கீச்சுகளை அணை',
    TURN_OFF_RETWEETS: 'மறுகீச்சுகளை அணை',
    TURN_ON_RETWEETS: 'மறுகீச்சுகளை இயக்கு',
    TWEET: 'ட்விட் செய்',
    TWEETED: 'ட்விட் செய்துள்ளார்',
    TWEETS: 'கீச்சுகள்',
    TWEET_ALL: 'அனைத்தையும் ட்விட் செய்',
    TWEET_ANALYTICS: 'கீச்சுப் பகுப்பாய்வு',
    TWEET_COUNT: '{formattedCount} {count, plural, one {கீச்சு} other {கீச்சுகள்}}',
    TWEET_INTERACTIONS: 'கீச்சின் செயல்பாடுகள்',
    TWEET_NOUN: 'கீச்சு',
    TWEET_SENT: 'உங்கள் கீச்சு அனுப்பப்பட்டது.',
    TWEET_TITLE: '{name} Twitter -இல் உள்ளார்: "{text}"',
    TWEET_YOUR_REPLY: 'உங்கள் பதிலை ட்விட் செய்யவும்',
    UNDO_RETWEET: 'மறுகீச்சை செயல்தவிர்',
    UNFOLLOW_USER: '@{screenName} -ஐப் பின்தொடராதே',
    UNSENT_TWEETS: 'அனுப்பப்படாத கீச்சுகள்',
    USER_RETWEETED: '{name} மறுட்வீட் செய்துள்ளார்',
    VIEW: 'காண்பி',
    VIEW_TWEET_ANALYTICS: 'கீச்சுப் பகுப்பாய்வைக் காட்டு',
    YOU_RETWEETED: 'நீங்கள் மறுட்விட் செய்தது',
  },
  th: {
    ACCOUNT_BASED_IN: 'บัญชีตั้งอยู่ใน {country}',
    ADD_ANOTHER_TWEET: 'เพิ่มอีกทวีต',
    ADD_MUTED_WORD: 'เพิ่มคำที่ซ่อน',
    AD_FROM: 'โฆษณาจาก {url}',
    EMBED_TWEET: 'ฝังทวีต',
    FOLLOWING_USER: 'กําลังติดตาม @{screenName}',
    FOLLOW_BACK_USER: 'ติดตาม @{screenName} กลับ',
    FOLLOW_USER: 'ติดตาม @{screenName}',
    GROK_ACTIONS: 'การดำเนินการของ Grok',
    HOME: 'หน้าแรก',
    LIKES: 'ความชอบ',
    LIKE_COUNT: '{formattedCount} {count, plural, other {ความชอบ}}',
    LIVE_ON_X: 'ถ่ายทอดสดบน X',
    MEDIA_VIEWER: 'ตัวแสดงสื่อ',
    MUTE_THIS_CONVERSATION: 'ซ่อนบทสนทนานี้',
    NEW_TWEET: 'ทวีตใหม่',
    POST: 'โพสต์',
    POST_ALL: 'โพสต์ทั้งหมด',
    POST_TITLE: '{name} บน X: "{text}"',
    POST_UNAVAILABLE: 'โพสต์นี้ไม่สามารถใช้งานได้',
    PROFILE_SUMMARY: 'ข้อมูลส่วนตัวโดยย่อ',
    QUOTE: 'การอ้างอิง',
    QUOTES: 'คำพูด',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {การอ้างอิง} other {การอ้างอิง}}',
    QUOTE_TWEET: 'อ้างอิงทวีต',
    QUOTE_TWEETS: 'ทวีตอ้างอิง',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {ทวีตอ้างอิง}}',
    RECENT: 'ล่าสุด',
    REPORT_TWEET: 'รายงานทวีต',
    REPOST: 'รีโพสต์',
    REPOSTS: 'รีโพสต์',
    REPOST_COUNT: '{formattedCount} {count, plural, one {รีโพสต์} other {รีโพสต์}}',
    RETWEET: 'รีทวีต',
    RETWEETS: 'รีทวีต',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {รีทวีต}}',
    SHARED: 'แบ่งปัน',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    SHOW: 'แสดง',
    SHOW_MORE_REPLIES: 'แสดงการตอบกลับเพิ่มเติม',
    SHOW_TWEETS: '{count, plural, other {แสดง # ทวีต}}',
    SORT_BY: 'เรียงตาม',
    SORT_REPLIES: 'จัดเรียงการตอบกลับ',
    TURN_OFF_QUOTE_TWEETS: 'ปิดทวีตและคำพูด',
    TURN_OFF_RETWEETS: 'ปิดรีทวีต',
    TURN_ON_RETWEETS: 'เปิดรีทวีต',
    TWEET: 'ทวีต',
    TWEETED: 'ได้ทวีต',
    TWEETS: 'ทวีต',
    TWEET_ALL: 'ทวีตทั้งหมด',
    TWEET_ANALYTICS: 'การวิเคราะห์ทวีต',
    TWEET_COUNT: '{formattedCount} {count, plural, other {ทวีต}}',
    TWEET_INTERACTIONS: 'การโต้ตอบของทวีต',
    TWEET_NOUN: 'ทวีต',
    TWEET_SENT: 'ทวีตของคุณถูกส่งแล้ว',
    TWEET_TITLE: '{name} บนทวิตเตอร์: "{text}"',
    TWEET_YOUR_REPLY: 'ทวีตการตอบกลับของคุณ',
    TWITTER: 'ทวิตเตอร์',
    UNDO_RETWEET: 'ยกเลิกการรีทวีต',
    UNFOLLOW_USER: 'เลิกติดตาม @{screenName}',
    UNSENT_TWEETS: 'ทวีตที่ไม่ได้ส่ง',
    USER_RETWEETED: '{name} ได้รีทวีต',
    VIEW: 'ดู',
    VIEW_TWEET_ANALYTICS: 'ดูการวิเคราะห์ทวีต',
    YOU_RETWEETED: 'คุณรีทวีต',
  },
  tr: {
    ACCOUNT_BASED_IN: 'Hesap konumu: {country}',
    ADD_ANOTHER_TWEET: 'Başka bir Tweet ekle',
    ADD_MUTED_WORD: 'Sessize alınacak kelime ekle',
    AD_FROM: '{url} adresinden reklam',
    EMBED_TWEET: 'Tweeti katıştır',
    FOLLOWING_USER: '@{screenName} adlı kullanıcı takip ediliyor',
    FOLLOW_BACK_USER: '@{screenName} geri takip et',
    FOLLOW_USER: '@{screenName} adlı kişiyi takip et',
    GROK_ACTIONS: 'Grok işlemleri',
    HOME: 'Anasayfa',
    LIKES: 'Beğeni',
    LIKE_COUNT: '{formattedCount} {count, plural, one {beğeni} other {beğeni}}',
    LIVE_ON_X: "X'te Canlı",
    MEDIA_VIEWER: 'Medya Görüntüleyici',
    MUTE_THIS_CONVERSATION: 'Bu sohbeti sessize al',
    NEW_TWEET: 'Yeni Tweet',
    POST: 'Gönderi',
    POST_ALL: 'Tümünü gönder',
    POST_TITLE: 'X\'te {name}: "{text}"',
    POST_UNAVAILABLE: 'Bu gönderi kullanılamıyor.',
    PROFILE_SUMMARY: 'Profil Özeti',
    QUOTE: 'Alıntı',
    QUOTES: 'Alıntılar',
    QUOTE_COUNT: '{formattedCount} {count, plural, one {alıntı} other {alıntı}}',
    QUOTE_TWEET: 'Tweeti Alıntıla',
    QUOTE_TWEETS: 'Alıntı Tweetler',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {Alıntı Tweet} other {Alıntı Tweet}}',
    RECENT: 'En yeni',
    REPORT_TWEET: 'Tweeti Bildir',
    REPOST: 'Yeniden gönder',
    REPOSTS: 'Yeniden gönderiler',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {yeniden paylaşım} other {yeniden paylaşım}}',
    RETWEETS: 'Retweetler',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {Retweet} other {Retweet}}',
    SHARED: 'Paylaşılan',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
    SHOW: 'Göster',
    SHOW_MORE_REPLIES: 'Daha fazla yanıt göster',
    SHOW_TWEETS: '{count, plural, one {Göster # Tweet} other {Göster # Tweet}}',
    SORT_BY: 'Şuna göre sırala:',
    SORT_REPLIES: 'Yanıtları sırala',
    TURN_OFF_QUOTE_TWEETS: 'Alıntı Tweetleri kapat',
    TURN_OFF_RETWEETS: 'Retweetleri kapat',
    TURN_ON_RETWEETS: 'Retweetleri aç',
    TWEET: 'Tweetle',
    TWEETED: 'Tweetledi',
    TWEETS: 'Tweetler',
    TWEET_ALL: 'Hepsini Tweetle',
    TWEET_ANALYTICS: 'Tweet İstatistikleri',
    TWEET_COUNT: '{formattedCount} {count, plural, one {Tweet} other {Tweet}}',
    TWEET_INTERACTIONS: 'Tweet etkileşimleri',
    TWEET_SENT: 'Tweetin gönderildi.',
    TWEET_TITLE: '{name} Twitter\'da: "{text}"',
    TWEET_YOUR_REPLY: 'Yanıtını Tweetle',
    UNDO_RETWEET: 'Retweeti Geri Al',
    UNFOLLOW_USER: '@{screenName} adlı kullanıcıyı takibi bırak',
    UNSENT_TWEETS: 'Gönderilmemiş Tweetler',
    USER_RETWEETED: '{name} Retweetledi',
    VIEW: 'Görüntüle',
    VIEW_TWEET_ANALYTICS: 'Tweet istatistiklerini görüntüle',
    YOU_RETWEETED: 'Retweetledin',
  },
  uk: {
    ACCOUNT_BASED_IN: 'Країна чи регіон: {country}',
    ADD_ANOTHER_TWEET: 'Додати ще один твіт',
    ADD_MUTED_WORD: 'Додати слово до списку ігнорування',
    AD_FROM: 'Реклама від {url}',
    EMBED_TWEET: 'Вбудувати твіт',
    FOLLOWING_USER: 'Ви читаєте @{screenName}',
    FOLLOW_BACK_USER: 'Читати у відповідь @{screenName}',
    FOLLOW_USER: 'Читати @{screenName}',
    GROK_ACTIONS: 'Дії Grok',
    HOME: 'Головна',
    LIKES: 'Вподобання',
    LIKE_COUNT:
      '{formattedCount} {count, plural, one {уподобання} few {уподобання} many {уподобань} other {уподобання}}',
    LIVE_ON_X: 'Прямий ефір в X',
    MEDIA_VIEWER: 'Засіб перегляду медіафайлів',
    MUTE_THIS_CONVERSATION: 'Ігнорувати цю розмову',
    NEW_TWEET: 'Новий твіт',
    POST: 'Опублікувати пост',
    POST_ALL: 'Опублікувати все',
    POST_TITLE: '{name} в X: «{text}»',
    POST_UNAVAILABLE: 'Цей пост недоступний.',
    PROFILE_SUMMARY: 'Зведення профілю',
    QUOTE: 'Цитата',
    QUOTES: 'Цитати',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {цитата} few {цитати} many {цитат} other {цитати}}',
    QUOTE_TWEET: 'Цитувати твіт',
    QUOTE_TWEETS: 'Цитовані твіти',
    QUOTE_TWEET_COUNT:
      '{formattedCount} {count, plural, one {Цитований твіт} few {цитовані твіти} many {цитованих твітів} other {цитованого твіта}}',
    RECENT: 'Нещодавні',
    REPORT_TWEET: 'Поскаржитися на твіт',
    REPOST: 'Зробити репост',
    REPOSTS: 'Репости',
    REPOST_COUNT:
      '{formattedCount} {count, plural, one {репост} few {репости} many {репостів} other {репости}}',
    RETWEET: 'Ретвітнути',
    RETWEETS: 'Ретвіти',
    RETWEET_COUNT:
      '{formattedCount} {count, plural, one {ретвіт} few {ретвіти} many {ретвітів} other {ретвіта}}',
    SHARED: 'Спільний',
    SHARED_TWEETS: 'Спільні твіти',
    SHOW: 'Показати',
    SHOW_MORE_REPLIES: 'Показати більше відповідей',
    SHOW_TWEETS:
      '{count, plural, one {Показати # твіт} few {Показати # твіти} many {Показати # твітів} other {Показати # твіта}}',
    SORT_BY: 'Сортування за',
    SORT_REPLIES: 'Сортувати відповіді',
    TURN_OFF_QUOTE_TWEETS: 'Вимкнути цитовані твіти',
    TURN_OFF_RETWEETS: 'Вимкнути ретвіти',
    TURN_ON_RETWEETS: 'Увімкнути ретвіти',
    TWEET: 'Твіт',
    TWEETED: 'твітнув(ла)',
    TWEETS: 'Твіти',
    TWEET_ALL: 'Твітнути все',
    TWEET_ANALYTICS: 'Аналітика твіта',
    TWEET_COUNT:
      '{formattedCount} {count, plural, one {твіт} few {твіти} many {твітів} other {твіта}}',
    TWEET_INTERACTIONS: 'Взаємодія твітів',
    TWEET_NOUN: 'Твіт',
    TWEET_SENT: 'Ваш твіт надіслано.',
    TWEET_TITLE: '{name} у Твіттері: «{text}»',
    TWEET_YOUR_REPLY: 'Твітніть відповідь',
    TWITTER: 'Твіттер',
    UNDO_RETWEET: 'Скасувати ретвіт',
    UNFOLLOW_USER: 'Не читати @{screenName}',
    UNSENT_TWEETS: 'Ненадіслані твіти',
    USER_RETWEETED: '{name} ретвітнув(ла)',
    VIEW: 'Переглянути',
    VIEW_TWEET_ANALYTICS: 'Переглянути аналітику твіта',
    YOU_RETWEETED: 'Ви ретвітнули',
  },
  ur: {
    ADD_ANOTHER_TWEET: 'ایک اور ٹویٹ شامل کریں',
    ADD_MUTED_WORD: 'میوٹ شدہ لفظ شامل کریں',
    EMBED_TWEET: 'ٹویٹ ایمبیڈ کریں',
    FOLLOWING_USER: 'فالو کر رہے ہیں @{screenName}',
    FOLLOW_USER: '@{screenName} کو فالو کریں',
    HOME: 'ہوم',
    LIKES: 'لائک',
    LIKE_COUNT: '{formattedCount} {count, plural, one {لائک} other {لائک}}',
    MUTE_THIS_CONVERSATION: 'اس گفتگو کو میوٹ کریں',
    NEW_TWEET: 'نیا ٹویٹ',
    QUOTE: 'نقل کریں',
    QUOTES: 'منقول',
    QUOTE_TWEET: 'ٹویٹ کا حوالہ دیں',
    QUOTE_TWEETS: 'حوالہ ٹویٹس',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, one {حوالہ ٹویٹ} other {حوالہ ٹویٹس}}',
    RECENT: 'حالیہ',
    REPORT_TWEET: 'ٹویٹ کو رپورٹ کریں',
    RETWEET: 'ریٹویٹ',
    RETWEETS: 'ریٹویٹس',
    RETWEET_COUNT: '{formattedCount} {count, plural, one {ریٹویٹ} other {ریٹویٹس}}',
    SHARED: 'مشترکہ',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
    SHOW: 'دکھائیں',
    SHOW_MORE_REPLIES: 'مزید جوابات دکھائیں',
    SHOW_TWEETS: '{count, plural, one {دکھائیں # ٹویٹ} other {دکھائیں # ٹویٹس}}',
    SORT_BY: 'چھانٹیں بلحاظ',
    TURN_OFF_QUOTE_TWEETS: 'ٹویٹ کو نقل کرنا بند کریں',
    TURN_OFF_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TURN_ON_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TWEET: 'ٹویٹ',
    TWEETED: 'ٹویٹ کیا',
    TWEETS: 'ٹویٹس',
    TWEET_ALL: 'سب کو ٹویٹ کریں',
    TWEET_ANALYTICS: 'ٹویٹ کے اینالیٹکس',
    TWEET_COUNT: '{formattedCount} {count, plural, one {ٹویٹ} other {ٹویٹس}}',
    TWEET_INTERACTIONS: 'ٹویٹ تعاملات',
    TWEET_NOUN: 'ٹویٹ',
    TWEET_SENT: 'آپ کا ٹویٹ بھیج دیا گیا۔',
    TWEET_TITLE: '{name} Twitter پر۔ "{text}"',
    TWEET_YOUR_REPLY: 'اپنا جواب ٹویٹ کریں',
    TWITTER: 'ٹوئٹر',
    UNDO_RETWEET: 'ری ٹویٹ کو کالعدم کریں',
    UNFOLLOW_USER: '@{screenName} کو ان فالو کریں',
    UNSENT_TWEETS: 'غیر ارسال شدہ ٹویٹس',
    USER_RETWEETED: '{name} نے ریٹویٹ کیا',
    VIEW: 'دیکھیں',
    VIEW_TWEET_ANALYTICS: 'ٹویٹ کے تجزیات دیکھیں',
    YOU_RETWEETED: 'آپ نے ریٹویٹ کیا',
  },
  vi: {
    ACCOUNT_BASED_IN: 'Tài khoản tại {country}',
    ADD_ANOTHER_TWEET: 'Thêm Tweet khác',
    ADD_MUTED_WORD: 'Thêm từ bị ẩn',
    AD_FROM: 'Quảng cáo từ {url}',
    EMBED_TWEET: 'Tweet nhúng',
    FOLLOWING_USER: 'Đang theo dõi @{screenName}',
    FOLLOW_BACK_USER: 'Theo dõi lại @{screenName}',
    FOLLOW_USER: 'Theo dõi @{screenName}',
    GROK_ACTIONS: 'Hành động của Grok',
    HOME: 'Trang chủ',
    LIKES: 'Lượt thích',
    LIKE_COUNT: '{formattedCount} {count, plural, other {thích}}',
    LIVE_ON_X: 'Trực tuyến trên X',
    MEDIA_VIEWER: 'Trình xem nội dung đa phương tiện',
    MUTE_THIS_CONVERSATION: 'Tắt tiếng cuộc trò chuyện này',
    NEW_TWEET: 'Tweet Mới',
    POST: 'Đăng',
    POST_ALL: 'Đăng tất cả',
    POST_TITLE: '{name} trên X: "{text}"',
    POST_UNAVAILABLE: 'Không có bài đăng này.',
    PROFILE_SUMMARY: 'Tóm tắt hồ sơ',
    QUOTE: 'Trích dẫn',
    QUOTES: 'Trích dẫn',
    QUOTE_COUNT:
      '{formattedCount} {count, plural, one {bài đăng trích dẫn} other {bài đăng trích dẫn}}',
    QUOTE_TWEET: 'Trích dẫn Tweet',
    QUOTE_TWEETS: 'Tweet trích dẫn',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {Tweet trích dẫn}}',
    RECENT: 'Gần đây',
    REPORT_TWEET: 'Báo cáo Tweet',
    REPOST: 'Đăng lại',
    REPOSTS: 'Bài đăng lại',
    REPOST_COUNT: '{formattedCount} {count, plural, one {bài đăng lại} other {bài đăng lại}}',
    RETWEET: 'Tweet lại',
    RETWEETS: 'Các Tweet lại',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {Tweet lại}}',
    SHARED: 'Đã chia sẻ',
    SHARED_TWEETS: 'Tweet được chia sẻ',
    SHOW: 'Hiện',
    SHOW_MORE_REPLIES: 'Hiển thị thêm trả lời',
    SHOW_TWEETS: '{count, plural, other {Hiển thị # Tweet}}',
    SORT_BY: 'Sắp xếp theo',
    SORT_REPLIES: 'Sắp xếp câu trả lời',
    TURN_OFF_QUOTE_TWEETS: 'Tắt Tweet trích dẫn',
    TURN_OFF_RETWEETS: 'Tắt Tweet lại',
    TURN_ON_RETWEETS: 'Bật Tweet lại',
    TWEETED: 'đã Tweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Đăng Tweet tất cả',
    TWEET_ANALYTICS: 'Số liệu thống kê Tweet',
    TWEET_COUNT: '{formattedCount} {count, plural, other {Các Tweet}}',
    TWEET_INTERACTIONS: 'Tương tác Tweet',
    TWEET_SENT: 'Tweet của bạn đã được gửi.',
    TWEET_TITLE: '{name} trên Twitter: "{text}"',
    TWEET_YOUR_REPLY: 'Đăng Tweet câu trả lời của bạn',
    UNDO_RETWEET: 'Hoàn tác Tweet lại',
    UNFOLLOW_USER: 'Ngừng theo dõi @{screenName}',
    UNSENT_TWEETS: 'Tweet chưa gửi',
    USER_RETWEETED: '{name} đã Tweet lại',
    VIEW: 'Xem',
    VIEW_TWEET_ANALYTICS: 'Xem phân tích Tweet',
    YOU_RETWEETED: 'Bạn đã Tweet lại',
  },
  'zh-cn': {
    ACCOUNT_BASED_IN: '账号位于 {country}',
    ADD_ANOTHER_TWEET: '添加另一条推文',
    ADD_MUTED_WORD: '添加要隐藏的字词',
    AD_FROM: '来自 {url} 的广告',
    EMBED_TWEET: '嵌入推文',
    FOLLOWING_USER: '正在关注 @{screenName}',
    FOLLOW_BACK_USER: '回关 @{screenName}',
    FOLLOW_USER: '关注 @{screenName}',
    GROK_ACTIONS: 'Grok 操作',
    HOME: '主页',
    LIKES: '喜欢',
    LIKE_COUNT: '{formattedCount} {count, plural, other {喜欢}}',
    LIVE_ON_X: 'X 上的直播',
    MEDIA_VIEWER: '媒体浏览器',
    MUTE_THIS_CONVERSATION: '隐藏此对话',
    NEW_TWEET: '新推文',
    POST: '发帖',
    POST_ALL: '全部发帖',
    POST_TITLE: 'X 上的 {name}：“{text}”',
    POST_UNAVAILABLE: '这个帖子不可用。',
    PROFILE_SUMMARY: '个人资料概要',
    QUOTE: '引用',
    QUOTES: '引用',
    QUOTE_COUNT: '{formattedCount} {count, plural, other {引用}}',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用推文',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {条引用推文}}',
    RECENT: '最近',
    REPORT_TWEET: '举报推文',
    REPOST: '转帖',
    REPOSTS: '转帖',
    REPOST_COUNT: '{formattedCount} {count, plural, other {转帖}}',
    RETWEET: '转推',
    RETWEETS: '转推',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {转推}}',
    SHARED: '共享',
    SHARED_TWEETS: '分享的推文',
    SHOW: '显示',
    SHOW_MORE_REPLIES: '显示更多回复',
    SHOW_TWEETS: '{count, plural, other {显示 # 推文}}',
    SORT_BY: '排序方式',
    SORT_REPLIES: '对回复排序',
    TURN_OFF_QUOTE_TWEETS: '关闭引用推文',
    TURN_OFF_RETWEETS: '关闭转推',
    TURN_ON_RETWEETS: '开启转推',
    TWEET: '推文',
    TWEETED: '发布了推文',
    TWEETS: '推文',
    TWEET_ALL: '全部发推',
    TWEET_ANALYTICS: '推文分析',
    TWEET_COUNT: '{formattedCount} {count, plural, other {推文}}',
    TWEET_INTERACTIONS: '推文互动',
    TWEET_NOUN: '推文',
    TWEET_SENT: '你的推文已发送。',
    TWEET_TITLE: '{name} 在 Twitter: "{text}"',
    TWEET_YOUR_REPLY: '发布你的回复',
    UNDO_RETWEET: '撤销转推',
    UNFOLLOW_USER: '取消关注 @{screenName}',
    UNSENT_TWEETS: '未发布的推文',
    USER_RETWEETED: '{name} 已转推',
    VIEW: '查看',
    VIEW_TWEET_ANALYTICS: '查看推文分析',
    YOU_RETWEETED: '你转推了',
  },
  'zh-tw': {
    ACCOUNT_BASED_IN: '帳號位於 {country}',
    ADD_ANOTHER_TWEET: '加入另一則推文',
    ADD_MUTED_WORD: '加入靜音文字',
    AD_FROM: '來自 {url} 的廣告',
    EMBED_TWEET: '嵌入推文',
    FOLLOWING_USER: '正在跟隨 @{screenName}',
    FOLLOW_BACK_USER: '回跟隨 @{screenName}',
    FOLLOW_USER: '跟隨 @{screenName}',
    GROK_ACTIONS: 'Grok 動作',
    HOME: '首頁',
    LIKES: '喜歡的內容',
    LIKE_COUNT: '{formattedCount} {count, plural, other {個喜歡}}',
    LIVE_ON_X: 'X 上的直播',
    MEDIA_VIEWER: '媒體檢視器',
    MUTE_THIS_CONVERSATION: '將此對話靜音',
    NEW_TWEET: '新推文',
    POST: '貼文',
    POST_ALL: '全部發佈',
    POST_TITLE: 'X 上的 {name}：「{text}」',
    POST_UNAVAILABLE: '此貼文無法查看。',
    PROFILE_SUMMARY: '個人檔案摘要',
    QUOTE: '引用',
    QUOTES: '引用',
    QUOTE_COUNT: '{formattedCount} {count, plural, other {引用貼文}}',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用的推文',
    QUOTE_TWEET_COUNT: '{formattedCount} {count, plural, other {則引用推文}}',
    RECENT: '最近',
    REPORT_TWEET: '檢舉推文',
    REPOST: '轉發',
    REPOSTS: '轉發',
    REPOST_COUNT: '{formattedCount} {count, plural, other {轉貼}}',
    RETWEET: '轉推',
    RETWEETS: '轉推',
    RETWEET_COUNT: '{formattedCount} {count, plural, other {則轉推}}',
    SHARED: '共享',
    SHARED_TWEETS: '分享的推文',
    SHOW: '顯示',
    SHOW_MORE_REPLIES: '顯示更多回覆',
    SHOW_TWEETS: '{count, plural, other {顯示 # 則推文}}',
    SORT_BY: '排序方式',
    SORT_REPLIES: '將回覆排序',
    TURN_OFF_QUOTE_TWEETS: '關閉引用的推文',
    TURN_OFF_RETWEETS: '關閉轉推',
    TURN_ON_RETWEETS: '開啟轉推',
    TWEET: '推文',
    TWEETED: '已推文',
    TWEETS: '推文',
    TWEET_ALL: '推全部內容',
    TWEET_ANALYTICS: '推文分析',
    TWEET_COUNT: '{formattedCount} {count, plural, other {則推文}}',
    TWEET_INTERACTIONS: '推文互動',
    TWEET_NOUN: '推文',
    TWEET_SENT: '你的推文已發送。',
    TWEET_TITLE: 'Twitter 上的 {name}："{text}"',
    TWEET_YOUR_REPLY: '推你的回覆',
    UNDO_RETWEET: '取消轉推',
    UNFOLLOW_USER: '取消跟隨 @{screenName}',
    UNSENT_TWEETS: '未發送的推文',
    USER_RETWEETED: '{name} 已轉推',
    VIEW: '查看',
    VIEW_TWEET_ANALYTICS: '查看推文分析',
    YOU_RETWEETED: '你已轉推',
  },
}

//#region Locale functions
/**
 * @param {import("./types").LocaleKey} key
 * @param {number} count
 * @param {string} formattedCount - Omit the number when formatting a separate label
 */
function formatCountString(key, count, formattedCount = '') {
  let template = getString(key)
  let plural = parseCountTemplate(template)
  if (plural) {
    let category = new Intl.PluralRules(lang).select(count)
    let branch = plural.forms.get(`=${count}`) ?? plural.forms.get(category) ?? plural.forms.get('other')
    template = template.replace(plural.clause, () => branch.replaceAll('#', () => formattedCount))
  }
  return template.replaceAll('{formattedCount}', () => formattedCount)
}

/**
 * @param {import("./types").LocaleKey} key
 * @param {string} placeholder
 * @param {string | number} value
 */
function formatString(key, placeholder, value) {
  return getString(key).replaceAll(`{${placeholder}}`, () => String(value))
}

/**
 * @param {import("./types").LocaleKey} key
 */
function getString(key) {
  return (locales[lang] || locales['en'])[key] || locales['en'][key];
}

/**
 * @param {string} template
 * @param {string} text
 */
function matchTemplate(template, text) {
  let placeholders = new Map()
  let pattern = template.split(/(\{\w+\})/).map(part => {
    if (/^\{\w+\}$/.test(part)) {
      if (placeholders.has(part)) return `\\k<value${placeholders.get(part)}>`
      let index = placeholders.size
      placeholders.set(part, index)
      return `(?<value${index}>[\\s\\S]*?)`
    }
    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }).join('')
  let match = new RegExp(`^${pattern}(?![\\s\\S])`, 'u').exec(text)
  if (!match) return null
  return new Map(Array.from(placeholders, ([placeholder, index]) => [placeholder, match.groups[`value${index}`]]))
}

/** @param {string} template */
function parseCountTemplate(template) {
  let match = template.match(/\{\w+,\s*plural,\s*((?:(?:zero|one|two|few|many|other|=\d+)\s*\{[^{}]*\}\s*)+)\}/u)
  if (!match) return null
  let forms = new Map(Array.from(match[1].matchAll(/(zero|one|two|few|many|other|=\d+)\s*\{([^{}]*)\}/gu),
    ([, category, branch]) => [category, branch]))
  return {clause: match[0], forms}
}

/**
 * Matches a simple translation template and carries its placeholder values into
 * the replacement template. Returns the original text if it doesn't match.
 * @param {import("./types").LocaleKey} key
 * @param {string} text
 * @param {string} replacement
 */
function replaceString(key, text, replacement) {
  return replaceTemplate(getString(key), text, replacement)
}

/**
 * @param {string} template
 * @param {string} text
 * @param {string} replacement
 */
function replaceTemplate(template, text, replacement) {
  let values = matchTemplate(template, text)
  if (!values) return text
  return replacement.replace(/\{\w+\}/g, placeholder => values.get(placeholder) ?? placeholder)
}
//#endregion
//#endregion

//#region Constants
/** @enum {string} */
const Images = {
  TWITTER_FAVICON: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA0pJREFUWAntVk1oE1EQnnlJbFK3KUq9VJPYWgQVD/5QD0qpfweL1YJQoZAULBRPggp6kB78PQn14kHx0jRB0UO9REVFb1YqVBEsbZW2SbVS0B6apEnbbMbZ6qbZdTempqCHPAjvzcw3P5mdmfcAiquYgX+cAVwu/+5AdDMQnSPCHUhQA0hf+Rxy2OjicIvzm+qnKhito0qpb2wvJhWeJgCPP7oPELeHvdJ1VSGf3eOPnSWga0S0Qo9HxEkEusDBuNjbEca8G291nlBxmgDc/ukuIvAJxI6wr+yKCsq1ewLxQ2lZfpQLo8oQ4ZXdCkfnACrGWpyDCl+oQmVn5xuVPU102e2P3qoJkFOhzVb9S7KSnL5jJs/mI+As01PJFPSlZeFSZZoAGBRXBZyq9lk5NrC+e7pJ5en30c+JWk59pZ5vRDOuhAD381c/H/FKz1SMNgCE16rg505r5TT0uLqme93d0fbq+1SeLSeU83Ke0RHYFPGVPcjQfNDUwIa7M665+dQAEEjZoMwZMcEF9RxIDAgBQ2mCcqJ0Z0b+h4MNbZ4RnyOSDbNmE2iRk5jCNgIIckFoZAs4IgfLGrlKGjkzS16iwj6pV9I4mUvCPf73JVytH9nRJj24QHrqU8NCIWrMaGqAC+Ut/3ZzAS63cx4v2K/x/IvQBOCwWzu5KmJGwEJ5PIgeG9nQBDDcXPpFoDjJ7ThvBC6EZxXWkJG+JgAFwGM4KBAOcibeGCn8FQ/hyajXPmSk+1sACogn4hYk7OdiHDFSWipPkPWSmY6mCzIghEEuxJvcEYUvxIdhX2mvmSHDDPBF9AJRnDZTyp+P40671JYLbxiAohDxSTfQIg4oNxgPzCWPHaWQBViOf2jGqVwBaEaxGbAqOFMrp+SefC8eNhoFIY5lXzpmtnMGUB2IbU3JdIqVW9m5zcxINn/hAYKiIexdaTh4srHKORMAP0b28PNgJyGt5gvHzQVYx91QpVcwpRFl/p63HSR1DLbid1OcTpAJQOG7u+KH+aI5Qwj13IsamU5vkUSIc8uGLDa8OtoivV8U5HcydFLtT7hlSDVy2nfxI2Ibg9awuVU8IeJAOMF5m2B6jFs1tM5R9rS3GRP5uSuiihn4DzPwA7z7GDH+43gqAAAAAElFTkSuQmCC',
  TWITTER_PIP_FAVICON: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALASURBVHgB7VZNchJBFP5eM9FoRWV2WiZmbmBuIJ4g5ASBRWJlRXIC4ASQVUqxCo4QTwDegJzAiYlFXM1YZWmVQD9fQ6YyAwMMGBZW8i2G6e7He1+/3wHuOih4+fWieJhiKsirA0ZbE44fXZUaWDIGBH4/L+UUUB897DMfPf5ermKJUOaRIhTiDlNEBSwZlnkwY2vCuYOEWD/xMrCoKC41utISRlcc3Or2dfnqwHbDcj9X0fbztn9DAHxOoM0xrZILSIBXtR9F0VGKbJIhz7kVi3Lr770yAz4p2iYm188/awVi6lo4Ns4mETEDLz94uTHjIxDDRaWoohhOSjwi/9mKEFjtlKsayAuRM7M2HmFJwCRVIIqLSAAJjS822v0Vaip1E1oKC6XrXtrExjnxnJ6ldoVKFj0+ujywW3FKTTzJoibmAXP+Yt9uBEsrfLbWRelJzS/0B8z4WoKa6zW/1dd83Hlnn0Z0peAQkqNHvNPZi+qIELBWUNU97LLJ4hDESMZSlNmo+b5UTEvC85m0JCipTQREE+BhdzypIwSkLvyn4LKYrEzQkSZCloiyw+xJbnygfxX+VAJrPWnBoC9ixBXdDm4XflD7YajIinFq3L0E45J7fBa3HyEg7mhgeWjPJODu223J/iMsATzhcmp04+ueXTW1OsiD2zIuVfNNLockBAyIkdaaPxHGs3YR0JTQWnGbWkFCQZX5imwCmBoX++nGpONYD1zu2S0a9IN/g3jSNcNnqsy0ww2ZdPJzCKLXWAAy1N6ay2BRAgEcGZ+aqDnaoqdbjw6dhQgYwz1S2xKOQyQ0Phy7vDPr5iH5ITY+elmtpddLFyQzZBTP3xGl3FJ95NzQJ1hiAgMSw5jnJOZvMA/EMBNKSW89kUAAp+45+g+yojRjljL9NoP4GxdLYzk334vy3lYP0HBjhsw97vHf4C/b8RLHAOr+CQAAAABJRU5ErkJggg==',
}

const MUTE_SPLIT_LANGUAGE_EXCEPTIONS = new Set('ja,ko,th,vi,zh-cn,zh-tw'.split(','))

/** @enum {RegExp} */
const RegExps = {
  LINE_BREAKS: /[\n\r\v\f\u2028\u2029]+/,
  PUNCTUATION: /\p{P}+/u,
  PUNCTUATION_OR_SPACE: /(?:\p{P}|\s)+?/u,
  REGEXP: /^\/(.*)\/$/,
  WILDCARD: /(?<!\\)\*/,
  WORD_BOUNDARIES: /[\s\n\r\v\f\u2028\u2029]+?/,
}

/** @enum {RegExp} */
const ReplaceRegExps = {
  ESCAPE: /[.*+?^${}()|[\]\\]/g,
  ESCAPED_ASTERISK: /\\\*/g,
  LEADING_TRAILING_PUNCTUATION: /(?:^\p{P}+|\p{P}+$)/gu,
}

/** @enum {string} */
const Svgs = {
  TWITTER_BLUE_LOGO_PATH: 'M16.5 3H2v18h15c3.038 0 5.5-2.46 5.5-5.5 0-1.4-.524-2.68-1.385-3.65-.08-.09-.089-.22-.023-.32.574-.87.908-1.91.908-3.03C22 5.46 19.538 3 16.5 3zm-.796 5.99c.457-.05.892-.17 1.296-.35-.302.45-.684.84-1.125 1.15.004.1.006.19.006.29 0 2.94-2.269 6.32-6.421 6.32-1.274 0-2.46-.37-3.459-1 .177.02.357.03.539.03 1.057 0 2.03-.35 2.803-.95-.988-.02-1.821-.66-2.109-1.54.138.03.28.04.425.04.206 0 .405-.03.595-.08-1.033-.2-1.811-1.1-1.811-2.18v-.03c.305.17.652.27 1.023.28-.606-.4-1.004-1.08-1.004-1.85 0-.4.111-.78.305-1.11 1.113 1.34 2.775 2.22 4.652 2.32-.038-.17-.058-.33-.058-.51 0-1.23 1.01-2.22 2.256-2.22.649 0 1.235.27 1.647.7.514-.1.997-.28 1.433-.54-.168.52-.526.96-.992 1.23z',
  MUTE: '<g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g>',
  PROMOTED_PATH: 'M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z',
  RETWEET: '<g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>',
  RETWEETS_OFF: '<g><path d="M3.707 21.707l18-18-1.414-1.414-2.088 2.088C17.688 4.137 17.11 4 16.5 4H11v2h5.5c.028 0 .056 0 .084.002l-10.88 10.88c-.131-.266-.204-.565-.204-.882V7.551l2.068 1.93 1.365-1.462L4.5 3.882.068 8.019l1.365 1.462 2.068-1.93V16c0 .871.278 1.677.751 2.334l-1.959 1.959 1.414 1.414zM18.5 9h2v7.449l2.068-1.93 1.365 1.462-4.433 4.137-4.432-4.137 1.365-1.462 2.067 1.93V9zm-8.964 9l-2 2H13v-2H9.536z"></path></g>',
  TWITTER_FEATHER_PLUS_PATH: 'M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z',
  TWITTER_HOME_ACTIVE_PATH: 'M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z',
  TWITTER_HOME_INACTIVE_PATH: 'M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z',
  TWITTER_LOGO_PATH: 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z',
  X_HOME_ACTIVE_PATH: 'M10.059 2.593c1.175-.784 2.707-.784 3.882 0l6.5 4.333C21.415 7.575 22 8.668 22 9.838V18.5c0 1.933-1.567 3.5-3.5 3.5h-4.25v-5.25c0-1.243-1.007-2.25-2.25-2.25s-2.25 1.007-2.25 2.25V22H5.5C3.567 22 2 20.433 2 18.5V9.838c0-1.17.585-2.263 1.559-2.912l6.5-4.333z',
  X_HOME_INACTIVE_PATH: 'M20 9.838c0-.502-.25-.97-.668-1.248l-6.5-4.333c-.504-.336-1.16-.336-1.664 0l-6.5 4.333C4.251 8.868 4 9.336 4 9.838V18.5c0 .828.672 1.5 1.5 1.5h3v-3.5c0-1.933 1.567-3.5 3.5-3.5s3.5 1.567 3.5 3.5V20h3c.828 0 1.5-.672 1.5-1.5V9.838zm2 8.662c0 1.933-1.567 3.5-3.5 3.5h-5v-5.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5 1.5V22h-5C3.567 22 2 20.433 2 18.5V9.838c0-1.17.585-2.263 1.559-2.912l6.5-4.333c1.175-.784 2.707-.784 3.882 0l6.5 4.333C21.415 7.575 22 8.668 22 9.838V18.5z',
  PLUS_PATH: 'M10.938 4.5H9.9c-1.136 0-1.929 0-2.546.05-.605.05-.953.143-1.216.277-.564.288-1.023.747-1.31 1.31-.135.264-.228.612-.277 1.218C4.5 7.97 4.5 8.765 4.5 9.9v4.2c0 1.136 0 1.929.05 2.546.05.605.143.953.277 1.216.288.565.747 1.023 1.31 1.31.264.135.612.228 1.217.277.617.05 1.41.051 2.546.051h4.2c1.136 0 1.929 0 2.545-.05.606-.05.954-.143 1.217-.277.565-.288 1.023-.746 1.31-1.31.135-.264.228-.612.277-1.217.05-.617.051-1.41.051-2.546v-1.037h2V14.1c0 1.103.001 1.992-.058 2.709-.06.728-.185 1.368-.487 1.96-.48.941-1.245 1.707-2.185 2.186-.593.302-1.233.428-1.961.488-.718.058-1.606.057-2.71.057H9.9c-1.103 0-1.991.001-2.709-.058-.728-.06-1.368-.185-1.96-.487-.941-.48-1.707-1.245-2.186-2.185-.302-.593-.428-1.233-.487-1.961-.059-.718-.058-1.606-.058-2.71V9.9c0-1.103-.001-1.991.058-2.709.06-.728.185-1.368.487-1.96.48-.941 1.245-1.707 2.185-2.186.593-.302 1.233-.428 1.961-.487.718-.059 1.606-.058 2.71-.058h1.037v2z',
}

//#region Themes
/** @type {import("./types").XTheme} */
const DIM_THEME = {
  mode: 'dark',
  tokens: {
    '--x-bg-primary': '#15202b',
    '--x-bg-secondary': '#1b2733',
    '--x-bg-tertiary': '#28323d',
    '--x-bg-modal': '#28323d',
    '--x-bg-sheets': '#28323d',
    '--x-fg-primary': '#f7f9f9',
    '--x-fg-secondary': '#8b98a5',
    '--x-fg-tertiary': '#657786',
    '--x-fg-inverted': '#15202b',
    '--x-border-normal': '#38444d',
    '--x-border-divider': '#253341',
    '--x-border-hover': '#657786',
    '--x-border-active': '#8899a6',
    '--x-btn-secondary': '#28323d',
    '--x-btn-secondary-hover': '#303f4e',
    '--x-btn-secondary-pressed': '#38444d',
  },
  highContrastTokens: {
    '--x-fg-secondary': 'var(--x-white-85)',
    '--x-fg-tertiary': 'var(--x-white-70)',
    '--x-border-normal': 'var(--x-white-50)',
  },
  embedTokens: {
    '--background': '210 34% 13%',
    '--border': '206 16% 26%',
    '--color-background': '210 34% 13%',
    '--color-gray-50': '213 25% 16%',
    '--color-gray-100': '211 34% 24%',
  },
  embedHighContrastTokens: {
    '--border': '0 0% 50%',
  },
}
// Neutral palette adapted from https://github.com/jonschlinkert/sublime-monokai-extended
/** @type {import("./types").XTheme} */
const MONOKAI_EXTENDED_THEME = {
  mode: 'dark',
  tokens: {
    '--x-bg-primary': '#222222',
    '--x-bg-secondary': '#333333',
    '--x-bg-tertiary': '#444444',
    '--x-bg-modal': '#333333',
    '--x-bg-sheets': '#333333',
    '--x-fg-primary': '#f8f8f2',
    '--x-fg-secondary': '#c8cecc',
    '--x-fg-tertiary': 'color-mix(in srgb, #f8f8f2 65%, #222222)',
    '--x-fg-inverted': '#222222',
    '--x-border-normal': '#444444',
    '--x-border-divider': '#333333',
    '--x-border-hover': '#75715e',
    '--x-border-active': '#c8cecc',
    '--x-btn-secondary': '#333333',
    '--x-btn-secondary-hover': '#444444',
    '--x-btn-secondary-pressed': 'color-mix(in srgb, #444444 80%, #f8f8f2)',
  },
  highContrastTokens: {
    '--x-fg-secondary': 'var(--x-white-85)',
    '--x-fg-tertiary': 'var(--x-white-70)',
    '--x-border-normal': 'var(--x-white-50)',
  },
  embedTokens: {
    '--background': '0 0% 13%',
    '--border': '0 0% 27%',
    '--color-background': '0 0% 13%',
    '--color-gray-50': '0 0% 20%',
    '--color-gray-100': '0 0% 27%',
  },
  embedHighContrastTokens: {
    '--border': '0 0% 50%',
  },
}
// Soft-contrast neutral palette adapted from https://github.com/morhetz/gruvbox
/** @type {import("./types").XTheme} */
const GRUVBOX_DARK_SOFT_THEME = {
  mode: 'dark',
  tokens: {
    '--x-bg-primary': '#32302f',
    '--x-bg-secondary': '#3c3836',
    '--x-bg-tertiary': '#504945',
    '--x-bg-modal': '#3c3836',
    '--x-bg-sheets': '#3c3836',
    '--x-fg-primary': '#ebdbb2',
    '--x-fg-secondary': '#d5c4a1',
    '--x-fg-tertiary': '#bdae93',
    '--x-fg-inverted': '#32302f',
    '--x-border-normal': '#665c54',
    '--x-border-divider': '#3c3836',
    '--x-border-hover': '#7c6f64',
    '--x-border-active': '#a89984',
    '--x-btn-secondary': '#3c3836',
    '--x-btn-secondary-hover': '#504945',
    '--x-btn-secondary-pressed': '#665c54',
  },
  highContrastTokens: {
    '--x-fg-primary': '#fbf1c7',
    '--x-fg-secondary': '#ebdbb2',
    '--x-fg-tertiary': '#d5c4a1',
    '--x-border-normal': '#a89984',
  },
  embedTokens: {
    '--background': '20 3% 19%',
    '--border': '27 10% 36%',
    '--color-background': '20 3% 19%',
    '--color-gray-50': '20 5% 22%',
    '--color-gray-100': '22 7% 29%',
  },
  embedHighContrastTokens: {
    '--border': '35 17% 59%',
  },
}
// Neutral palette adapted from https://catppuccin.com/palette/#latte
/** @type {import("./types").XTheme} */
const CATPPUCCIN_LATTE_THEME = {
  mode: 'light',
  tokens: {
    '--x-bg-primary': '#eff1f5',
    '--x-bg-secondary': '#e6e9ef',
    '--x-bg-tertiary': '#dce0e8',
    '--x-bg-modal': '#eff1f5',
    '--x-bg-sheets': '#eff1f5',
    '--x-fg-primary': '#4c4f69',
    '--x-fg-secondary': '#5c5f77',
    '--x-fg-tertiary': '#6c6f85',
    '--x-fg-inverted': '#eff1f5',
    '--x-border-normal': '#ccd0da',
    '--x-border-divider': '#dce0e8',
    '--x-border-hover': '#9ca0b0',
    '--x-border-active': '#8c8fa1',
    '--x-btn-secondary': '#dce0e8',
    '--x-btn-secondary-hover': '#ccd0da',
    '--x-btn-secondary-pressed': '#bcc0cc',
  },
  highContrastTokens: {
    '--x-fg-secondary': '#4c4f69',
    '--x-fg-tertiary': '#5c5f77',
    '--x-border-normal': '#7c7f93',
  },
  embedTokens: {
    '--background': '220 23% 95%',
    '--border': '223 16% 83%',
    '--color-background': '220 23% 95%',
    '--color-gray-50': '220 22% 92%',
    '--color-gray-100': '220 21% 89%',
  },
  embedHighContrastTokens: {
    '--border': '232 10% 53%',
  },
}
// Neutral palette adapted from https://github.com/morhetz/gruvbox
/** @type {import("./types").XTheme} */
const GRUVBOX_LIGHT_THEME = {
  mode: 'light',
  tokens: {
    '--x-bg-primary': '#fbf1c7',
    '--x-bg-secondary': '#ebdbb2',
    '--x-bg-tertiary': '#d5c4a1',
    '--x-bg-modal': '#fbf1c7',
    '--x-bg-sheets': '#fbf1c7',
    '--x-fg-primary': '#3c3836',
    '--x-fg-secondary': '#504945',
    '--x-fg-tertiary': '#665c54',
    '--x-fg-inverted': '#fbf1c7',
    '--x-border-normal': '#d5c4a1',
    '--x-border-divider': '#ebdbb2',
    '--x-border-hover': '#bdae93',
    '--x-border-active': '#a89984',
    '--x-btn-secondary': '#ebdbb2',
    '--x-btn-secondary-hover': '#d5c4a1',
    '--x-btn-secondary-pressed': '#bdae93',
  },
  highContrastTokens: {
    '--x-fg-primary': '#282828',
    '--x-fg-secondary': '#3c3836',
    '--x-fg-tertiary': '#504945',
    '--x-border-normal': '#7c6f64',
  },
  embedTokens: {
    '--background': '48 87% 88%',
    '--border': '40 38% 73%',
    '--color-background': '48 87% 88%',
    '--color-gray-50': '43 59% 81%',
    '--color-gray-100': '40 38% 73%',
  },
  embedHighContrastTokens: {
    '--border': '28 11% 44%',
  },
}
// Neutral palette adapted from https://ethanschoonover.com/solarized/
/** @type {import("./types").XTheme} */
const SOLARIZED_LIGHT_THEME = {
  mode: 'light',
  tokens: {
    '--x-bg-primary': '#fdf6e3',
    '--x-bg-secondary': '#eee8d5',
    '--x-bg-tertiary': '#eee8d5',
    '--x-bg-modal': '#fdf6e3',
    '--x-bg-sheets': '#fdf6e3',
    '--x-fg-primary': '#586e75',
    '--x-fg-secondary': '#657b83',
    '--x-fg-tertiary': '#657b83',
    '--x-fg-inverted': '#fdf6e3',
    '--x-border-normal': '#93a1a1',
    '--x-border-divider': '#eee8d5',
    '--x-border-hover': '#839496',
    '--x-border-active': '#657b83',
    '--x-btn-secondary': '#eee8d5',
    '--x-btn-secondary-hover': 'color-mix(in srgb, #eee8d5 90%, #586e75)',
    '--x-btn-secondary-pressed': 'color-mix(in srgb, #eee8d5 80%, #586e75)',
  },
  highContrastTokens: {
    '--x-fg-primary': '#073642',
    '--x-fg-secondary': '#586e75',
    '--x-fg-tertiary': '#586e75',
    '--x-border-normal': '#586e75',
  },
  embedTokens: {
    '--background': '44 87% 94%',
    '--border': '180 7% 60%',
    '--color-background': '44 87% 94%',
    '--color-gray-50': '46 42% 88%',
    '--color-gray-100': '46 42% 88%',
  },
  embedHighContrastTokens: {
    '--border': '194 14% 40%',
  },
}
//#endregion

/** Matches any notification count at the start of the title */
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
//#endregion

//#region State
let debug = false
let debugLogGetElementStats = false
let debugLogTimelineStats = false
let enabled = true
let pro = false

/** @type {BroadcastChannel} */
let channel
/** @type {import("./types").UserSettings} */
let settings
/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile

let isSafari = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)

/** @type {HTMLHtmlElement} */
let $html = /** @type {HTMLHtmlElement} */ (document.documentElement)
/** @type {HTMLElement} */
let $body
/** @type {string} */
let lang
/** @type {string} */
let dir
/** @type {boolean} */
let ltr

/** Title of the rendered page, or the virtual separated tweets timeline */
let currentPage = ''

/** Path of the rendered page, even when the URL points to a desktop modal */
let currentPagePath = ''

/** @type {Map<string, import("./types").Disconnectable>} */
let globalObservers = new Map()

/** URL pathname from the last handled title change */
let lastUrlPath = ''

let logObserverDisconnects = true

/**
 * Observers and pending setup to clean up when the current modal changes.
 * @type {Map<string, import("./types").Disconnectable>}
 */
let modalObservers = new Map()

/** @type {import("./types").MutedWord[]} */
let mutedWords = null

/**
 * MutationObservers active on the current page, or anything else we want to
 * clean up when the user moves off the current page.
 * @type {Map<string, import("./types").Disconnectable>}
 */
let pageObservers = new Map()
//#endregion

//#region Logging
function log(...args) {
  if (debug) {
    let page = currentPage?.replace(/(\r?\n)+/g, ' ')
    console.log(`${page ? `(${
      page.length < 42 ? page : page.slice(0, 42) + '…'
    })` : ''}`, ...args)
  }
}

function warn(...args) {
  if (debug) {
    console.log(`❗ ${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

function error(...args) {
  console.log(`❌ ${currentPage ? `(${currentPage})` : ''}`, ...args)
}
//#endregion

//#region Muted words
/**
 * Check RegExps and phrases against the tweet, check phrases and words against
 * words.
 * @param {string} tweet
 */
function hasMutedWord(tweet) {
  if (mutedWords == null || mutedWords.length == 0) return false

  tweet = tweet.toLowerCase()
  /** @type {string[]} */
  let words = null

  for (let muteWord of mutedWords) {
    if (muteWord.type == 'REGEXP' || muteWord.type == 'WILDCARD') {
      if (muteWord.mutedWord.test(tweet)) return true
      continue
    }

    let mutedWord = muteWord.mutedWord.toLowerCase()
    // For languages where we don't split the tweet, just do an includes check
    if (MUTE_SPLIT_LANGUAGE_EXCEPTIONS.has(lang)) {
      if (tweet.includes(mutedWord)) return true
      continue
    }

    if (mutedWord.length == 1 && tweet.includes(mutedWord)) return true
    if (mutedWord.length > tweet.length) continue
    if (mutedWord == tweet) return true
    if (muteWord.type == 'PHRASE' && tweet.includes(mutedWord)) return true

    if (words == null) {
      words = tweet.split(RegExps.WORD_BOUNDARIES)
    }
    for (let word of words) {
      if (mutedWord == word) return true
      let wordTrimmedPunctuation = word.replace(ReplaceRegExps.LEADING_TRAILING_PUNCTUATION, '')
      if (mutedWord == wordTrimmedPunctuation) return true
      if (mutedWord.length > wordTrimmedPunctuation.length) continue
      if (/\p{P}+/u.test(wordTrimmedPunctuation)) {
        // Don't fuzzy match /, e.g. Andor shouldn't match and/or
        if (/[/]+/.test(wordTrimmedPunctuation)) continue

        let spacedWord = wordTrimmedPunctuation.replace(/\p{P}+/gu, ' ')
        if (mutedWord == spacedWord) return true

        let contiguousWord = spacedWord.replace(/\s/gu, '')
        if (mutedWord == contiguousWord) return true

        let wordParts = wordTrimmedPunctuation.split(/\p{P}+/u)
        for (let wordPart of wordParts) {
          if (mutedWord == wordPart) return true
        }
      }
    }
  }

  return false
}

function prepareMutedWords() {
  mutedWords = null
  if (!pro || !settings.mutedWords || settings.mutedWordsError) {
    return
  }
  mutedWords = []
  let words = settings.mutedWords
    .toLowerCase()
    .split(RegExps.LINE_BREAKS)
    .map(word => word.trim())
    .filter(Boolean)
  for (let mutedWord of words) {
    let regexpMatch = mutedWord.match(RegExps.REGEXP)
    if (regexpMatch) {
      mutedWords.push({
        type: 'REGEXP',
        mutedWord: new RegExp(regexpMatch[1], 'i')
      })
      continue
    }

    let wildcard = RegExps.WILDCARD.test(mutedWord)
    if (wildcard) {
      mutedWords.push({
        type: 'WILDCARD',
        mutedWord: new RegExp(
          mutedWord
            .split(RegExps.WILDCARD)
            .map(part =>
              part.replace(ReplaceRegExps.ESCAPED_ASTERISK, '*')
                  .replace(ReplaceRegExps.ESCAPE, '\\$&'))
            .join('.*?'),
          'i'
        )
      })
      continue
    }

    let phrase = RegExps.PUNCTUATION_OR_SPACE.test(mutedWord)
    mutedWords.push({type: phrase ? 'PHRASE' : 'WORD', mutedWord})
  }
}
//#endregion

//#region Utility functions
function addQuestionMark(text, add) {
  if (!add) return text
  return ltr ? `${text}?` : `؟${text}`
}

function addStyle(css = '') {
  let $style = document.createElement('style')
  if (css) {
    $style.textContent = css
  }
  document.head.appendChild($style)
  return $style
}

/**
 * @param {string} str
 * @returns {string}
 */
function dedent(str) {
  str = str.replace(/^[ \t]*\r?\n/, '')
  let indent = /^[ \t]+/m.exec(str)
  if (indent) str = str.replace(new RegExp('^' + indent[0], 'gm'), '')
  return str.replace(/(\r?\n)[ \t]+$/, '$1')
}

/**
 * @param {Map<string, import("./types").Disconnectable>} observers
 * @param {'global' | 'page' | 'modal'} scope
 */
function disconnectObservers(observers, scope) {
  if (observers.size == 0) return
  log(
    `disconnecting ${observers.size} ${scope} observer${s(observers.size)}`,
    Array.from(observers.keys())
  )
  logObserverDisconnects = false
  for (let observer of observers.values()) observer.disconnect()
  logObserverDisconnects = true
}

/**
 * @param {MutationRecord[]} mutations
 * @param {($el: Node) => boolean | HTMLElement} fn - return `true` to use [$el]
 * as the result, or return a different HTMLElement to use it as the result.
 * @returns {Node | HTMLElement | null}
 */
function findAddedNode(mutations, fn) {
  for (let mutation of mutations) {
    for (let el of mutation.addedNodes) {
      let result = fn(el)
      if (result) {
        return result === true ? el : result
      }
    }
  }
  return null
}

function findRouter() {
  let visited = new Set()
  for (let $element of [document.querySelector('main'), document.querySelector('article'), document]) {
    if (!$element) continue
    for (let key of Object.keys($element).filter(key => /^__react(?:Fiber|Container)\$/.test(key))) {
      let fiber = $element[key]
      while (fiber?.return) fiber = fiber.return
      let root = fiber?.stateNode?.current
      if (!root) continue
      let stack = [root]
      while (stack.length) {
        let node = stack.pop()
        if (!node || visited.has(node)) continue
        visited.add(node)
        for (let candidate of [node.memoizedProps?.router, node.memoizedProps?.value]) {
          if (typeof candidate?.navigate == 'function' && typeof candidate?.subscribe == 'function' &&
              typeof candidate?.options?.context?.relayEnvironment?.getStore == 'function') return candidate
        }
        if (node.sibling) stack.push(node.sibling)
        if (node.child) stack.push(node.child)
      }
    }
  }
  return null
}

/**
 * @param {Element} $el
 * @param {Element} $ancestor
 */
function getClosestChild($el, $ancestor) {
  let $child = $el
  while ($child && $child.parentElement !== $ancestor) {
    $child = $child.parentElement
  }
  return $child
}

/** @param {string} title */
function formatBrandedTitle(title) {
  let count = TITLE_NOTIFICATION_RE.exec(title)?.[0] || ''
  title = title.slice(count.length)
  let twitter = getString('TWITTER')
  let suffix = title.endsWith(' / X') ? ' / X' : ''
  title = replaceString(
    'POST_TITLE',
    title.slice(0, title.length - suffix.length),
    getString('TWEET_TITLE')
  ) + suffix
  if (title == 'X') title = twitter
  else if (title.endsWith(' / X')) title = title.slice(0, -1) + twitter
  else if (title.startsWith('X \\ ')) title = twitter + title.slice(1)
  return count + title
}

/**
 * @param {string} selector
 * @param {{
 *   context?: HTMLElement
 *   mutationObserverOptions?: MutationObserverInit
 *   name?: string
 *   observers?: Map<string, import("./types").Disconnectable>
 *   stopIf?: () => boolean
 *   timeout?: number
 * }?} options
 * @returns {Promise<HTMLElement | null>}
 */
function getElement(selector, {
  context = document.body || document.documentElement,
  mutationObserverOptions = {childList: true, subtree: true},
  name = null,
  observers = pageObservers,
  stopIf = null,
  timeout = Infinity,
} = {}) {
  return new Promise((resolve) => {
    let startTime = Date.now()
    let observer
    let intervalId
    let timeoutId
    let resolved = false
    let queryCount = 0

    function stop($element, stopReason) {
      if (resolved) return warn(`getElement: ${name || selector} already resolved`, {stopReason})
      resolved = true
      if ($element != null) {
        if (debugLogGetElementStats && stopReason != 'initial query') {
          log(`getElement: got ${name || selector} after ${Date.now() - startTime}ms (${queryCount} quer${s(queryCount, 'y', 'ies')})`)
        }
      } else {
        log(`getElement: stopped waiting for ${name || selector} after ${stopReason}`)
      }
      observer?.disconnect()
      if (timeoutId) clearTimeout(timeoutId)
      if (intervalId) clearInterval(intervalId)
      resolve($element)
    }

    if (stopIf?.() === true) return stop(null, 'stopIf condition met (initial query)')

    let $element = context.querySelector(selector)
    if ($element) return stop($element, 'initial query')

    observer = observeElement(context, () => {
      if (stopIf?.() === true) return stop(null, 'stopIf condition met (observer)')
      queryCount++
      let $element = context.querySelector(selector)
      if ($element) return stop($element)
    }, {
      name: `getElement: ${name || selector}`,
      observers,
      onDisconnect() {
        if (!resolved) stop(null, 'observer disconnected')
      },
    }, mutationObserverOptions)

    if (stopIf) {
      intervalId = setInterval(() => {
        if (stopIf() === true) stop(null, 'stopIf condition met (interval)')
      }, 250)
    }

    if (timeout !== Infinity) {
      timeoutId = setTimeout(stop, timeout, null, `${timeout}ms timeout`)
    }
  })
}

/**
 * @param {*} value
 * @returns {value is string}
 */
function isString(value) {
  return Object.getPrototypeOf(value) === String.prototype
}

/**
 * Convenience wrapper for the MutationObserver API:
 * - Observers have associated names - existing observers in the given scope map
 *   will be disconnected first.
 * - Optional leading call for callback
 * - MutationObserver options default to `{childList: true}`
 * @param {Node} $target
 * @param {MutationCallback} callback
 * @param {string | {
 *   leading?: boolean
 *   logElement?: boolean
 *   name: string
 *   observers: Map<string, import("./types").Disconnectable>
 *   onDisconnect?: () => void
 * }} nameOrOptions
 * @param {MutationObserverInit} mutationObserverOptions
 * @returns {import("./types").NamedMutationObserver}
 */
function observeElement($target, callback, nameOrOptions, mutationObserverOptions = {childList: true}) {
  // Passing just a name opts out of the rest of the wrapper features
  if (isString(nameOrOptions)) {
    let observer = Object.assign(new MutationObserver(callback), {name: nameOrOptions})
    observer.observe($target, mutationObserverOptions)
    return observer
  }

  let {leading, logElement, name, observers, onDisconnect} = nameOrOptions

  let observer = Object.assign(new MutationObserver(callback), {name})
  let disconnect = observer.disconnect.bind(observer)
  let disconnected = false
  observer.disconnect = () => {
    if (disconnected) return
    disconnected = true
    disconnect()
    onDisconnect?.()
    observers.delete(name)
    if (logObserverDisconnects) {
      log(`disconnected ${name} observer`)
    }
  }

  if (observers.has(name)) {
    log(`disconnecting existing ${name} observer`)
    logObserverDisconnects = false
    observers.get(name).disconnect()
    logObserverDisconnects = true
  }

  observers.set(name, observer)
  if (logElement) {
    log(`observing ${name}`, $target)
  } else {
    log(`observing ${name}`)
  }
  observer.observe($target, mutationObserverOptions)
  if (leading) {
    callback([], observer)
  }
  return observer
}

/**
 * @param {string} page
 * @returns {() => boolean}
 */
function pageIsNot(page) {
  return function() {
    let pageChanged = page != currentPage
    if (pageChanged) {
      log('pageIsNot', {page, currentPage})
    }
    return pageChanged
  }
}

/**
 * @param {string} path
 * @returns {() => boolean}
 */
function pathIsNot(path) {
  return () => path != lastUrlPath
}

/**
 * Register pending modal setup so disconnecting modalObservers cancels it too.
 * @param {string} name
 * @returns {() => boolean}
 */
function registerModalSetup(name) {
  let cancelled = false
  modalObservers.get(name)?.disconnect()
  let setup = {
    name,
    disconnect() {
      cancelled = true
      if (modalObservers.get(name) == setup) modalObservers.delete(name)
    },
  }
  modalObservers.set(name, setup)
  return () => cancelled
}

/**
 * @template T
 * @param {() => T} fn
 */
function run(fn) {
  return fn()
}

/**
 * @param {number} n
 * @returns {string}
 */
function s(n, singular = '', plural = 's') {
  return n == 1 ? singular : plural
}

/**
 * @param {Element} $tweetButtonText
 */
function setTweetButtonText($tweetButtonText) {
  let currentText = $tweetButtonText.textContent
  if (currentText == getString('TWEET') || currentText == getString('TWEET_ALL')) return
  $tweetButtonText.textContent = currentText == getString('POST_ALL') ? getString('TWEET_ALL') : getString('TWEET')
}

function getEmbeddedBrandingRules() {
  return getThemeTokenRules('.bg-btn-primary.text-inverted', {
    '--x-btn-primary': 'var(--x-btn-brand)',
    '--x-btn-primary-hover': 'var(--x-btn-brand-hover)',
    '--x-btn-primary-pressed': 'var(--x-btn-brand-pressed)',
    '--x-fg-inverted': 'var(--x-fg-on-brand)',
  })
}

/** @param {string} color Hex, RGB or HSL custom theme */
function getEmbeddedCustomAccentRules(color) {
  if (!color) return ''
  color = color.trim()
  let hslMatch = color.match(/^hsl\(\s*([\d.]+)(deg|rad|grad|turn)?\s*[, ]\s*(\d{1,3})%\s*[, ]\s*(\d{1,3})%\s*\)$/i)
  let hsl
  if (hslMatch) {
    if (!Number.isFinite(Number(hslMatch[1])) || Number(hslMatch[3]) > 100 || Number(hslMatch[4]) > 100) return ''
    hsl = `${hslMatch[1]}${hslMatch[2] || ''} ${hslMatch[3]}% ${hslMatch[4]}%`
  } else {
    let hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1]
    let rgb = color.match(/^rgb\(\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)\s*\)$/i)
    let channels
    if (hex) {
      if (hex.length == 3) hex = hex.split('').map(channel => channel.repeat(2)).join('')
      channels = hex.match(/.{2}/g).map(channel => parseInt(channel, 16) / 255)
    } else if (rgb) {
      channels = rgb.slice(1).map(channel => channel.endsWith('%') ? parseFloat(channel) / 100 : Number(channel) / 255)
      if (channels.some(channel => channel > 1)) return ''
    } else return ''
    let [r, g, b] = channels
    let max = Math.max(r, g, b)
    let min = Math.min(r, g, b)
    let delta = max - min
    let lightness = (max + min) / 2
    let hue = delta == 0 ? 0 : max == r ? ((g - b) / delta) % 6 : max == g ? (b - r) / delta + 2 : (r - g) / delta + 4
    let saturation = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1))
    hsl = `${((hue * 60 + 360) % 360).toFixed(2)} ${(saturation * 100).toFixed(2)}% ${(lightness * 100).toFixed(2)}%`
  }
  return getThemeTokenRules(':host, [data-theme], .light-theme, .dark-theme', {
    '--x-fg-brand': color,
    '--color-brand': hsl,
    '--chat-accent': hsl,
  })
}

/** @param {import("./types").XTheme} theme */
function getEmbeddedThemeRules(theme, highContrast = false) {
  let selector = `:is([data-xchat-root], [data-xchat-portal], [data-xcalls-root], [data-xcalls-portal])[data-theme="${theme.mode}"]`
  let tokens = {...theme.embedTokens, ...(highContrast ? theme.embedHighContrastTokens : {})}
  return getThemeRules(selector, theme, highContrast) + getThemeTokenRules(selector, tokens)
}

/** @param {import("./types").XTheme} theme */
function getThemeRules(selector, theme, highContrast = false) {
  let hover = `color-mix(in srgb, var(--x-fg-primary) ${theme.mode == 'light' ? 4 : 8}%, transparent)`
  let tokens = {
    '--x-btn-ghost-hover': hover,
    '--x-btn-ghost-pressed': 'color-mix(in srgb, var(--x-fg-primary) 15%, transparent)',
    '--x-hover-subtle': hover,
    '--x-hover-faint': 'color-mix(in srgb, var(--x-fg-primary) 3%, transparent)',
    ...theme.tokens,
    ...(highContrast ? theme.highContrastTokens : {}),
  }
  let rgb = tokens['--x-bg-primary'].slice(1).match(/.{2}/g).map(channel => parseInt(channel, 16)).join(' ')
  for (let alpha of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30, 40, 50, 60, 70, 80, 85, 90, 95, 100]) {
    tokens[`--x-bg-alpha-${String(alpha).padStart(2, '0')}`] = `rgb(${rgb} / ${alpha / 100})`
  }
  return getThemeTokenRules(selector, tokens)
}

/** @param {Record<string, string>} tokens */
function getThemeTokenRules(selector, tokens) {
  return `${selector} { ${Object.entries(tokens).map(([name, value]) => `${name}: ${value} !important;`).join('\n')} }`
}
//#endregion

//#region Requests
const getAccountLocation = (() => {
  let cache = new Map()
  /**
   * @param {string} screenName
   * @param {'rweb' | 'xweb'} site
   */
  return function getAccountLocation(screenName, site = 'rweb') {
    if (!/^[a-zA-Z\d_]{1,20}$/.test(screenName)) return Promise.resolve(null)
    let key = `${site}:${screenName.toLowerCase()}`
    let existing = cache.get(key)
    if (existing && Date.now() - existing.created < 300000) return existing.promise
    let promise = (async () => {
      try {
        let csrfToken = (document.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith('ct0='))?.slice(4)
        if (!csrfToken) return null
        let variables = site == 'xweb'
          ? {screenName, __relay_internal__pv__xclientsfeaturesappviewerisloggedinrelayprovider: true}
          : {screenName}
        let endpoint = site == 'xweb'
          ? 'https://api.x.com/graphql/bRnrA7UOXQ6H9sQwe9202Q/AboutAccountQuery'
          : '/i/api/graphql/XRqGa7EeokUU5kppkh13EA/AboutAccountQuery'
        let response = await fetch(`${endpoint}?variables=${encodeURIComponent(JSON.stringify(variables))}`, {
          credentials: 'include',
          headers: {
            'authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA',
            'content-type': 'application/json',
            'x-twitter-active-user': 'yes',
            'x-twitter-auth-type': 'OAuth2Session',
            'x-twitter-client-language': lang,
            'x-csrf-token': csrfToken,
          },
        })
        if (!response.ok) return null
        return (await response.json()).data?.user_result_by_screen_name?.result?.about_profile || null
      } catch (e) {
        // No session headers or response bodies are logged.
        warn('account location lookup failed', screenName)
        return null
      }
    })()
    cache.set(key, {created: Date.now(), promise})
    return promise
  }
})()

/**
 * @param {($video: HTMLVideoElement) => (() => void) | null} [preventReplay]
 */
function configureVideoLooping(preventReplay) {
  let name = 'video looping'
  if (!enabled || !settings.disableVideoLooping) {
    globalObservers.get(name)?.disconnect()
    return
  }
  if (globalObservers.has(name)) return
  let pending = new Set()

  function onEnded(event) {
    let $video = event.target
    if (!enabled || !settings.disableVideoLooping || !($video instanceof HTMLVideoElement) ||
        !$video.closest('article, [data-testid="videoPlayer"], [role="dialog"]') ||
        /\/tweet_video(?:_thumb)?\//.test($video.poster + ' ' + $video.currentSrc)) return
    if (preventReplay) {
      let restore = preventReplay($video)
      if (restore) {
        let timer = setTimeout(cleanup, 0)
        function cleanup() {
          clearTimeout(timer)
          pending.delete(cleanup)
          restore()
        }
        pending.add(cleanup)
      }
      return
    }
    let descriptor = Object.getOwnPropertyDescriptor($video, 'play')
    let original = $video.play
    let armed = true
    let timer
    function restore() {
      armed = false
      clearTimeout(timer)
      if ($video.play === play) {
        if (descriptor) Object.defineProperty($video, 'play', descriptor)
        else delete $video.play
      }
      pending.delete(restore)
    }
    function play(...args) {
      let block = armed && event.eventPhase != 0 && enabled && settings.disableVideoLooping
      restore()
      if (!block) return original.apply(this, args)
      log('disableVideoLooping: prevented video replay')
      return Promise.reject(new DOMException('Automatic video replay disabled', 'AbortError'))
    }
    try {
      Object.defineProperty($video, 'play', {configurable: true, writable: true, value: play})
      pending.add(restore)
      // Expire an unused interceptor after the native ended handlers finish
      timer = setTimeout(restore, 0)
    } catch {
      restore()
    }
  }

  document.addEventListener('ended', onEnded, true)
  globalObservers.set(name, {name, disconnect() {
    document.removeEventListener('ended', onEnded, true)
    for (let restore of pending) restore()
    globalObservers.delete(name)
  }})
}

function bypassMediaContextMenu() {
  let name = 'media context menu'
  if (!enabled || !settings.bypassMediaContextMenu) {
    globalObservers.get(name)?.disconnect()
    return
  }
  if (globalObservers.has(name)) return
  function onContextMenu(event) {
    if (!enabled || !settings.bypassMediaContextMenu) return
    let $target = event.target
    let $rwebPlayer = $target?.closest?.('[data-testid="videoPlayer"], [data-testid="videoComponent"]')
    let $trigger = $rwebPlayer?.querySelector('video') ? $rwebPlayer :
      $target?.closest?.('[data-slot="xds-context-menu-trigger"], [data-testid="tweetPhoto"]')
    if (!$trigger && $target?.matches?.('video')) $trigger = $target.parentElement?.querySelector(':scope > [data-slot="xds-context-menu-trigger"]')
    if (!$trigger) return
    let video = $trigger === $rwebPlayer || $trigger.matches('[data-slot="xds-context-menu-trigger"]') &&
      ($trigger.querySelector('video') || $trigger.parentElement?.querySelector(':scope > video'))
    if (!video && ($target.closest('button, [data-press-control], [data-testid="videoPlayer"], [data-testid="videoComponent"]') ||
        $trigger.querySelector('video') ||
        !$trigger.querySelector('img[src^="https://pbs.twimg.com/media/"]'))) return
    log('bypassMediaContextMenu: bypassing media context menu')
    event.stopImmediatePropagation()
  }
  document.addEventListener('contextmenu', onContextMenu, true)
  globalObservers.set(name, {name, disconnect() {
    document.removeEventListener('contextmenu', onContextMenu, true)
    globalObservers.delete(name)
  }})
}

function cleanTweetLink(text) {
  try {
    let url = new URL(text)
    if (url.protocol != 'https:' || !['x.com', 'twitter.com'].includes(url.hostname) ||
        !/^\/(?:[a-zA-Z\d_]{1,20}\/status|i\/web\/status)\/\d+(?:\/(?:photo|video)\/\d+)?\/?$/.test(url.pathname)) return text
    url.search = ''
    return url.href
  } catch {
    return text
  }
}

/** @param {string} url */
function isFollowingTimelineRequest(url) {
  try {
    let request = new URL(url, location.origin)
    return ['x.com', 'twitter.com', 'api.x.com', 'api.twitter.com'].includes(request.hostname) &&
      /^\/(?:i\/api\/)?graphql\/[^/]+\/HomeLatestTimeline(?:Query)?$/.test(request.pathname)
  } catch { return false }
}

/** @param {any} variables */
function forceRecentFollowing(variables) {
  if (variables?.enableRanking !== true) return false
  variables.enableRanking = false
  log('defaultFollowingToRecent: forcing sort to Recent')
  return true
}

/** @param {string} body */
function patchFollowingBody(body) {
  try {
    let data = JSON.parse(body)
    return forceRecentFollowing(data?.variables) ? JSON.stringify(data) : body
  } catch (e) { error('defaultFollowingToRecent: error patching body', e); return body }
}

/** @param {string} url */
function patchFollowingUrl(url) {
  if (!isFollowingTimelineRequest(url)) return url
  try {
    let request = new URL(url, location.origin)
    let variables = JSON.parse(request.searchParams.get('variables'))
    if (!forceRecentFollowing(variables)) return url
    request.searchParams.set('variables', JSON.stringify(variables))
    return request.href
  } catch (e) { error('defaultFollowingToRecent: error patching URL', e); return url }
}

/**
 * @param {{
 *   patchUrl: (method: string, url: string) => string
 *   shouldPatchBody: (method: string, url: string) => boolean
 *   patchBody: (body: string) => string
 *   patchResponse?: (response: Response, url: string, headers?: HeadersInit) => Response | Promise<Response>
 * }} patches
 */
function patchRequests({patchUrl, shouldPatchBody, patchBody, patchResponse}) {
  if (typeof XMLHttpRequest != 'undefined') {
    let open = XMLHttpRequest.prototype.open
    let send = XMLHttpRequest.prototype.send
    let requests = new WeakMap()
    XMLHttpRequest.prototype.open = function(...args) {
      let method = String(args[0]).toUpperCase()
      let url = String(args[1])
      requests.set(this, {method, url})
      if (enabled && settings) {
        let patched = patchUrl(method, url)
        if (patched != url) args[1] = patched
      }
      return open.apply(this, args)
    }
    XMLHttpRequest.prototype.send = function(body) {
      let request = requests.get(this)
      if (enabled && settings && typeof body == 'string' && request && shouldPatchBody(request.method, request.url)) body = patchBody(body)
      return send.call(this, body)
    }
  }
  if (typeof fetch == 'function') {
    let originalFetch = fetch
    globalThis.fetch = function(input, init) {
      if (!enabled || !settings) return originalFetch.call(this, input, init)
      let request = typeof Request != 'undefined' && input instanceof Request ? input : null
      let url = request ? request.url : String(input)
      let method = String(init?.method || request?.method || 'GET').toUpperCase()
      let patchedUrl = patchUrl(method, url)
      let patch = shouldPatchBody(method, url)
      let send = (body) => {
        let options = body == null ? init : {...init, body}
        let result = request && patchedUrl != url
          ? originalFetch.call(this, new Request(patchedUrl, new Request(request, options)))
          : originalFetch.call(this, patchedUrl != url ? patchedUrl : input, options)
        return patchResponse ? result.then(response => enabled && settings ? patchResponse(response, url, options?.headers ?? request?.headers) : response) : result
      }
      if (patch && typeof init?.body == 'string') {
        let body = patchBody(init.body)
        return send(body == init.body ? null : body)
      }
      if (patch && request && !Object.hasOwn(init || {}, 'body')) {
        try {
          return request.clone().text().then(body => {
            if (!enabled || !settings || !shouldPatchBody(method, url)) return originalFetch.call(this, input, init)
            let patched = patchBody(body)
            return send(patched == body ? null : patched)
          }, () => originalFetch.call(this, input, init))
        } catch { return originalFetch.call(this, input, init) }
      }
      return send(null)
    }
  }
}
//#endregion

//#region Custom CSS
/** @type {HTMLStyleElement} */
let $customCssStyle

function configureCustomCss() {
  if (!enabled || !settings.enableCustomCss) {
    if ($customCssStyle) {
      log('removing custom CSS')
      $customCssStyle.remove()
      $customCssStyle = null
    }
    return
  }
  if (settings.customCss) {
    if ($customCssStyle == null) {
      $customCssStyle = addStyle(settings.customCss)
    } else {
      $customCssStyle.textContent = settings.customCss
    }
  } else if ($customCssStyle) {
    $customCssStyle.remove()
    $customCssStyle = null
  }
}
//#endregion

//#region Setup
/**
 * Set up the selected app's config bridge. Shared state is updated before any
 * app callbacks run, including when multiple config keys change together.
 * @param {{
 *   main: (options?: {processImmediately?: boolean}) => void | Promise<void>
 *   onSettingsChanged?: (changedSettings: Set<import("./types").UserSettingsKey>) => void
 *   onDisabled?: () => void
 *   onDebugChanged?: () => void
 * }} callbacks
 */
function setupConfig({main, onSettingsChanged, onDisabled, onDebugChanged}) {
  let channelName = crypto.randomUUID()
  channel = new BroadcastChannel(channelName)

  /** @param {MessageEvent<import("./types").StoredConfigMessage>} message */
  function receiveConfigFromContentScript({data: {type, config}}) {
    let initial = type == 'initial'
    let wasEnabled = enabled
    let wasPro = pro
    let debugChanged = Object.hasOwn(config, 'debug') && config.debug != debug
    if (debugChanged) log('disabling debug mode')
    if (Object.hasOwn(config, 'debug')) debug = config.debug
    if (debugChanged) log('enabled debug mode')
    if (Object.hasOwn(config, 'enabled')) enabled = config.enabled
    if (Object.hasOwn(config, 'debugLogGetElementStats')) {
      debugLogGetElementStats = config.debugLogGetElementStats
      log(`${debugLogGetElementStats ? 'en' : 'dis'}abled logging of getElement() stats`)
    }
    if (Object.hasOwn(config, 'debugLogTimelineStats')) {
      debugLogTimelineStats = config.debugLogTimelineStats
      log(`${debugLogTimelineStats ? 'en' : 'dis'}abled logging of timeline stats`)
    }
    if (Object.hasOwn(config, 'subscription')) {
      pro = config.subscription?.active === true
    }

    /** @type {Set<import("./types").UserSettingsKey>} */
    let changedSettings = new Set()
    if (initial || Object.hasOwn(config, 'settings')) {
      // Storage events contain a complete snapshot, including removed overrides
      let nextSettings = {...DEFAULT_SETTINGS, ...config.settings}
      if (!initial) {
        let keys = /** @type {import("./types").UserSettingsKey[]} */ (Object.keys(nextSettings))
        changedSettings = new Set(keys.filter(key => nextSettings[key] != settings[key]))
      }
      settings = nextSettings
    }

    let proChanged = pro != wasPro
    if (initial || proChanged || changedSettings.has('mutedWords') || changedSettings.has('mutedWordsError')) {
      prepareMutedWords()
    }

    if (initial) {
      main()
      return
    }

    if (enabled != wasEnabled) {
      log(`${enabled ? 'en' : 'dis'}abling extension functionality`)
      if (enabled) {
        main({processImmediately: true})
      } else {
        onDisabled?.()
        disconnectObservers(modalObservers, 'modal')
        disconnectObservers(pageObservers, 'page')
        disconnectObservers(globalObservers, 'global')
      }
    } else if (changedSettings.size > 0 || proChanged) {
      onSettingsChanged?.(changedSettings)
    }
    // Startup and teardown already apply the current debug state
    if (debugChanged && enabled == wasEnabled) onDebugChanged?.()
  }

  channel.addEventListener('message', receiveConfigFromContentScript)
  window.postMessage({type: 'init', channelName}, location.origin)
}

/** @param {Partial<import("./types").StoredConfig>} changes */
function storeConfigChanges(changes) {
  channel.postMessage(changes)
}
//#endregion

//#region rweb
const rweb = function() {

//#region Constants
/** @enum {string} */
const PagePaths = {
  ACCESSIBILITY_SETTINGS: '/settings/accessibility',
  ADD_MUTED_WORD: '/settings/add_muted_keyword',
  BOOKMARKS: '/i/bookmarks',
  COMPOSE_TWEET: '/compose/post',
  CONNECT: '/i/connect',
  DISPLAY_SETTINGS: '/settings/display',
  HISTORY: '/i/history',
  HOME: '/home',
  NOTIFICATION_TIMELINE: '/i/timeline',
  PROFILE_SETTINGS: '/settings/profile',
  SEARCH: '/search',
}

/** @enum {string} */
const Selectors = {
  BLOCK_MENU_ITEM: '[data-testid="block"]',
  DESKTOP_TIMELINE_HEADER: 'div[data-testid="primaryColumn"] > div > div:first-of-type',
  MODAL_TIMELINE: 'section > h1 + div[aria-label] > div',
  MOBILE_TIMELINE_HEADER: 'div[data-testid="TopNavBar"]',
  NAV_HOME_LINK: 'a[data-testid="AppTabBar_Home_Link"]',
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV_DESKTOP: 'header nav',
  PRIMARY_NAV_MOBILE: '#layers nav',
  PROMOTED_TWEET_CONTAINER: '[data-testid="placementTracking"]',
  SIDEBAR: 'div[data-testid="sidebarColumn"]',
  SORT_REPLIES_PATH: 'svg path[d="M14 6V3h2v8h-2V8H3V6h11zm7 2h-3.5V6H21v2zM8 16v-3h2v8H8v-3H3v-2h5zm13 2h-9.5v-2H21v2z"]',
  TIMELINE: 'div[data-testid="primaryColumn"] section > h1 + div[aria-label] > div',
  TIMELINE_HEADING: 'h2[role="heading"]',
  TWEET: '[data-testid="tweet"]',
  TWEET_ACTIONS: '[role="group"]:has(> div > button[data-testid="reply"])',
  VERIFIED_TICK: 'svg[data-testid="icon-verified"]',
  X_LOGO_PATH: 'svg path[d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z"]',
  X_DARUMA_LOGO_PATH: 'svg path[d="M18.436 1.92h3.403l-7.433 8.495 8.745 11.563h-6.849l-5.363-7.012-6.136 7.012H1.4l7.951-9.088L.96 1.92h7.02l4.848 6.41 5.608-6.41zm-1.194 18.021h1.886L6.958 3.851H4.933l12.308 16.09z"]',
}

/**
 * @param {{primary: number[], accent: number[], hover: number[]}} channels
 */
function createThemePalette({primary, accent, hover}) {
  return {
    primary: `rgb(${primary.join(', ')})`,
    accent: `rgb(${accent.join(', ')})`,
    hover: `rgb(${hover.join(', ')})`,
    primaryHex: `#${primary.map(n => n.toString(16).padStart(2, '0')).join('')}`,
    rolesByRgb: new Map([
      [primary.join(','), 'primary'],
      [accent.join(','), 'accent'],
      [hover.join(','), 'hover'],
    ]),
  }
}

const THEME_PALETTES = new Map([
  ['blue500', createThemePalette({
    primary: [29, 155, 240],
    accent: [142, 205, 248],
    hover: [26, 140, 216],
  })],
  ['yellow500', createThemePalette({
    primary: [255, 212, 0],
    accent: [255, 234, 128],
    hover: [230, 191, 0],
  })],
  ['magenta500', createThemePalette({
    primary: [249, 24, 128],
    accent: [252, 140, 192],
    hover: [224, 22, 115],
  })],
  ['purple500', createThemePalette({
    primary: [120, 86, 255],
    accent: [188, 171, 255],
    hover: [108, 77, 230],
  })],
  ['orange500', createThemePalette({
    primary: [255, 122, 0],
    accent: [255, 189, 128],
    hover: [230, 110, 0],
  })],
  ['green500', createThemePalette({
    primary: [0, 186, 124],
    accent: [128, 221, 190],
    hover: [0, 167, 122],
  })],
])
const HIGH_CONTRAST_LIGHT_PALETTES = new Map([
  ['blue500', createThemePalette({
    primary: [0, 56, 134],
    accent: [128, 156, 195],
    hover: [26, 76, 146],
  })],
  ['yellow500', createThemePalette({
    primary: [111, 62, 0],
    accent: [183, 159, 128],
    hover: [125, 81, 26],
  })],
  ['magenta500', createThemePalette({
    primary: [137, 10, 70],
    accent: [196, 133, 163],
    hover: [149, 35, 89],
  })],
  ['purple500', createThemePalette({
    primary: [82, 52, 183],
    accent: [169, 154, 219],
    hover: [99, 72, 190],
  })],
  ['orange500', createThemePalette({
    primary: [137, 43, 0],
    accent: [196, 149, 128],
    hover: [149, 64, 26],
  })],
  ['green500', createThemePalette({
    primary: [0, 97, 61],
    accent: [128, 176, 158],
    hover: [26, 113, 80],
  })],
])
const HIGH_CONTRAST_DARK_PALETTES = new Map([
  ['blue500', createThemePalette({
    primary: [107, 201, 251],
    accent: [181, 228, 253],
    hover: [96, 181, 226],
  })],
  ['yellow500', createThemePalette({
    primary: [255, 235, 107],
    accent: [255, 245, 181],
    hover: [230, 212, 96],
  })],
  ['magenta500', createThemePalette({
    primary: [251, 112, 176],
    accent: [253, 184, 216],
    hover: [226, 101, 158],
  })],
  ['purple500', createThemePalette({
    primary: [172, 151, 255],
    accent: [214, 203, 255],
    hover: [155, 136, 230],
  })],
  ['orange500', createThemePalette({
    primary: [255, 173, 97],
    accent: [255, 214, 176],
    hover: [230, 156, 87],
  })],
  ['green500', createThemePalette({
    primary: [97, 214, 163],
    accent: [176, 235, 209],
    hover: [87, 193, 147],
  })],
])
const THEME_BLUE = THEME_PALETTES.get('blue500').primary
// <body> pseudo-selector for pages the full-width content feature works on
const FULL_WIDTH_BODY_PSEUDO = ':is(.Community, .List, .HomeTimeline)'
// The Communities nav item takes you to /yourusername/communities
const URL_COMMUNITIES_RE = /^\/[a-zA-Z\d_]{1,20}\/communities(?:\/explore)?\/?$/
const URL_COMMUNITY_RE = /^\/i\/communities\/\d+(?:\/about)?\/?$/
const URL_COMMUNITY_MEMBERS_RE = /^\/i\/communities\/\d+\/(?:members|moderators)\/?$/
const URL_DISCOVER_COMMUNITIES_RE = /^\/i\/communities\/suggested\/?/
const URL_LIST_RE = /\/i\/lists\/\d+\/?$/
const URL_LISTS_RE = /^\/[a-zA-Z\d_]{1,20}\/lists\/?$/
const URL_MEDIA_RE = /\/(?:photo|video)\/\d\/?$/
const URL_MEDIAVIEWER_RE = /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/mediaviewer$/i
// Matches URLs which show one of the tabs on a user profile page
const URL_PROFILE_RE = /^\/([a-zA-Z\d_]{1,20})(?:\/(affiliates|with_replies|superfollows|highlights|articles|media|likes))?\/?$/
// Matches URLs which show a user's Followers you know / Followers / Following tab
const URL_PROFILE_FOLLOWS_RE = /^\/[a-zA-Z\d_]{1,20}\/(?:verified_followers|follow(?:ing|ers|ers_you_follow)|creator-subscriptions\/subscriptions)\/?$/
/** Matches the start of any individual Tweet URL, capturing the user and id */
const URL_TWEET_BASE_RE = /^\/([a-zA-Z\d_]{1,20})\/status\/(\d+)/
/** Matches the entire URL when viewing an individual Tweet, including optional end slash */
const URL_TWEET_RE = /^\/([a-zA-Z\d_]{1,20})\/status\/(\d+)\/?$/
/** Matches Tweet interactions page URLs, capturing the path segment for the current tab */
const URL_TWEET_INTERACTIONS_RE = /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/(quotes|retweets|reposts|likes)\/?$/

// The Twitter Media Assist exension adds a new button at the end of the action
// bar (#346)
const TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR = '.tva-download-icon, .tva-modal-download-icon'
//#endregion

//#region State
/** @type {HTMLElement} */
let $reactRoot

/** `true` when the 'Block @${user}' menu item was clicked in the last popup */
let blockMenuItemClicked = false

/** `true` when the 'Block @${user}' menu item was seen in the last popup */
let blockMenuItemSeen = false

/** Whether the last handled URL was a desktop modal */
let lastUrlWasModal = false

/** Notification count in the title (including trailing space), e.g. `'(1) '` */
let currentNotificationCount = ''

/** The last notification count we hid from the title */
let hiddenNotificationCount = ''

/**
 * React Native stylesheet rule for the blur filter for sensitive content.
 * @type {CSSStyleRule}
 */
let filterBlurRule = null

/**
 * React Native stylesheet rule for the Chirp font-family.
 * @type {CSSStyleRule}
 */
let fontFamilyRule = null

/** @type {string} */
let fontSize = null

/** Set to `true` when a Home/Following heading or Home nav link is used */
let homeNavigationIsBeingUsed = false

/** Set to `true` when the compose tweet modal is open on desktop */
let isDesktopComposeTweetModalOpen = false

/** Set to `true` when the media modal is open on desktop */
let isDesktopMediaModalOpen = false

/**
 * flex-direction on the element wrapping the app is used to determine the
 * current mode (mobile or desktop).
 */
let lastFlexDirection = null

/**
 * Cache for the last page title which was used for the Home timeline.
 * @type {string}
 */
let lastHomeTimelineTitle = null

/** Native theme colour palette */
let nativePalette = THEME_PALETTES.get('blue500')

/**
 * `true` after the app has initialised.
 * @type {boolean}
 */
let observingPageChanges = false

/**
 * The quoted Tweet associated with a caret menu that's just been opened.
 * @type {import("./types").QuotedTweet}
 */
let quotedTweet = null

/** @type {number} */
let selectedHomeTabIndex = -1

/**
 * Title for the fake timeline used to separate out retweets and quote tweets.
 * @type {string}
 */
let separatedTweetsTimelineTitle = null

/**
 * Custom theme CSS for rules in the React Native stylesheet.
 * @type {Map<CSSRule, string>}
 */
let themeRules = new Map()

/** @type {CSSStyleSheet} */
let reactNativeStylesheet = null

/**
 * Rebuild theme overrides after a change to the native palette.
 * @type {(reason?: string) => void}
 */
let refreshThemeRules = () => {}

/** `true` if the user has used the Following "Sort by" menu */
let userSortedFollowing = false

/** `true` if the user has used the "Sort replies" menu */
let userSortedReplies = false

/**
 * `true` when "For you" was the last tab selected on the Home timeline.
 */
let wasForYouTabSelected = false

/** @type {HTMLElement} */
let $desktopComposeTweetModalPopup = null

/** Popup container which can survive app re-renders. @type {HTMLElement} */
let $popupContainer = null

//#endregion

//#region Page functions
function isOnAccessibilitySettingsPage() {
  return currentPagePath == PagePaths.ACCESSIBILITY_SETTINGS
}

function isOnCallsPage() {
  return currentPagePath.startsWith('/i/calls')
}

function isOnChatPage() {
  return currentPagePath.startsWith('/i/chat')
}

function isOnCommunitiesPage() {
  return URL_COMMUNITIES_RE.test(currentPagePath)
}

function isOnCommunityMembersPage() {
  return URL_COMMUNITY_MEMBERS_RE.test(currentPagePath)
}

function isOnCommunityPage() {
  return URL_COMMUNITY_RE.test(currentPagePath)
}

function isOnComposeTweetPage() {
  return lastUrlPath.startsWith(PagePaths.COMPOSE_TWEET)
}

function isOnDiscoverCommunitiesPage() {
  return URL_DISCOVER_COMMUNITIES_RE.test(currentPagePath)
}

function isOnDisplaySettingsPage() {
  return currentPagePath == PagePaths.DISPLAY_SETTINGS
}

function isOnExplorePage() {
  return currentPagePath == '/explore' || currentPagePath.startsWith('/explore/')
}

function isOnFollowListPage() {
  return URL_PROFILE_FOLLOWS_RE.test(currentPagePath)
}

function isOnGrokPage() {
  return currentPagePath.startsWith('/i/grok')
}

function isOnHistoryPage() {
  return currentPagePath.startsWith(PagePaths.HISTORY)
}

function isOnHomeTimelinePage() {
  return currentPagePath == PagePaths.HOME
}

function isOnIndividualTweetPage() {
  return URL_TWEET_RE.test(currentPagePath)
}

function isOnOwnTweetPage(tweetPath = currentPagePath) {
  let screenName = getUserScreenName()
  return screenName != null && screenName == tweetPath.match(URL_TWEET_BASE_RE)?.[1]
}

function isOnListPage() {
  return URL_LIST_RE.test(currentPagePath)
}

function isOnListsPage() {
  return URL_LISTS_RE.test(currentPagePath)
}

function isOnNotificationsPage() {
  return currentPagePath.startsWith('/notifications')
}

function isOnPremiumSignupPage() {
  return lastUrlPath.startsWith('/i/premium_sign_up')
}

function isOnProfilePage() {
  let profilePathUsername = currentPagePath.match(URL_PROFILE_RE)?.[1]
  if (!profilePathUsername) return false
  // twitter.com/user and its sub-URLs put @user in the title
  return currentPage.toLowerCase().includes(`${ltr ? '@' : ''}${profilePathUsername.toLowerCase()}${!ltr ? '@' : ''}`)
}

function isOnQuoteTweetsPage() {
  return currentPagePath.match(URL_TWEET_INTERACTIONS_RE)?.[1] == 'quotes'
}

function isOnSearchPage() {
  return currentPagePath.startsWith('/search') || currentPagePath.startsWith('/hashtag/')
}

function isOnSeparatedTweetsTimeline() {
  return currentPage == separatedTweetsTimelineTitle
}

function isOnSettingsPage() {
  return currentPagePath.startsWith('/settings')
}

function shouldHideSidebar() {
  return isOnExplorePage() || isOnDiscoverCommunitiesPage()
}

function shouldShowSeparatedTweetsTab() {
  return settings.retweets == 'separate' || settings.quoteTweets == 'separate'
}
//#endregion

//#region Utility functions
function configureCleanTweetLinks() {
  let name = 'clean tweet links'
  if (!enabled || !settings.cleanTweetLinks) {
    globalObservers.get(name)?.disconnect()
    return
  }
  if (globalObservers.has(name)) return
  let restore = () => {}
  function onClick(event) {
    if (!enabled || !settings.cleanTweetLinks) return
    if (event.type == 'click' ? event.button != 0 : !['Enter', ' '].includes(event.key)) return
    let $item = event.target?.closest?.('[role="menuitem"]')
    if (!$item?.closest('[role="menu"]') || $item.getAttribute('aria-disabled') == 'true' ||
        !$item.querySelector('svg path[d^="M18.36 5.64"]')) return
    restore()
    let timer = null
    function reset() {
      if (timer != null) clearTimeout(timer)
      document.removeEventListener('copy', onCopy, true)
    }
    function onCopy(event) {
      reset()
      if (!enabled || !settings.cleanTweetLinks || !event.clipboardData) return
      // rweb selects its temporary URL span before calling execCommand('copy')
      let value = window.getSelection()?.toString() || ''
      let text = cleanTweetLink(value)
      if (text == value) return
      event.clipboardData.setData('text/plain', text)
      event.preventDefault()
      log('cleanTweetLinks: removed tracking from copied link', {url: text})
    }
    document.addEventListener('copy', onCopy, true)
    restore = reset
    timer = setTimeout(reset, 0)
  }
  document.addEventListener('click', onClick, true)
  document.addEventListener('keydown', onClick, true)
  document.addEventListener('keyup', onClick, true)
  globalObservers.set(name, {name, disconnect() {
    restore()
    document.removeEventListener('click', onClick, true)
    document.removeEventListener('keydown', onClick, true)
    document.removeEventListener('keyup', onClick, true)
    globalObservers.delete(name)
  }})
}

/** Read the URL and underlying page together for navigation decisions */
function getCurrentRoute() {
  let urlPath = location.pathname
  let history = desktop ? getTopLevelProps()?.history : null
  let isModal = Boolean(history?.getIsModalRoute?.())
  let pagePath = urlPath
  if (isModal) {
    pagePath = history.getLastNonModalLocationPathname?.() || getRenderedPagePath(urlPath)
  }
  return {urlPath, pagePath, isModal}
}

/** @param {string} fallbackPath */
function getRenderedPagePath(fallbackPath) {
  // Direct modal URLs have no previous route, find the rendered fallback page
  let $column = document.querySelector(Selectors.PRIMARY_COLUMN)
  if (!$column) return fallbackPath
  let reactFiberKey = Object.keys($column).find(key => key.startsWith('__reactFiber$'))
  for (let fiber = $column[reactFiberKey], depth = 0; fiber && depth < 50; fiber = fiber.return, depth++) {
    let routePath = (fiber.stateNode?.props || fiber.memoizedProps)?.location?.pathname
    if (typeof routePath == 'string' && routePath != fallbackPath) return routePath
  }
  return fallbackPath
}
//#endregion

//#region React state functions
function getTopLevelProps() {
  if (!$reactRoot?.firstElementChild) {
    warn('React top level props element not available yet')
    return
  }
  let reactPropsKey = Object.keys($reactRoot.firstElementChild).find(key => key.startsWith('__reactProps'))
  if (reactPropsKey) {
    return $reactRoot.firstElementChild[reactPropsKey].children?.props?.children?.props
  } else {
    warn('React props key not found')
  }
}

function getState() {
  let props = getTopLevelProps()
  if (props) {
    let state = props.store?.getState()
    if (state) return state
    warn('React state not found')
  }
}

function getNotificationCount() {
  let state = getState()
  if (!state || !state.badgeCount) {
    warn('could not get notification count from state')
    return 0
  }
  return state.badgeCount.unreadDMCount + state.badgeCount.unreadNTabCount;
}

function getStateEntities() {
  let state = getState()
  if (state) {
    if (state.entities) return state.entities
    warn('React state entities not found')
  }
}

/** @returns {ReturnType<typeof createThemePalette> | null} */
function getThemePaletteFromState() {
  let localState = getState()?.settings?.local
  let color = localState?.themeColor
  let highContrast = localState?.highContrastEnabled
  $body.classList.toggle('HighContrast', highContrast)
  let palettes = THEME_PALETTES
  if (highContrast) {
    palettes = getColorScheme() == 'Default' ? HIGH_CONTRAST_LIGHT_PALETTES : HIGH_CONTRAST_DARK_PALETTES
  }
  let palette = palettes.get(color)
  if (!palette) {
    warn(color ? `${color} not found in theme palettes` : 'could not get themeColor from React state')
    return null
  }
  return palette
}

/**
 * Gets cached tweet info from React state.
 */
function getTweetInfo(tweetId) {
  let tweetEntities = getStateEntities()?.tweets?.entities
  if (tweetEntities) {
    let tweetInfo = tweetEntities[tweetId]
    if (!tweetInfo) {
      warn('tweet info not found', tweetId)
    }
    return tweetInfo
  } else {
    warn('tweet entities not found', tweetId)
  }
}

/**
 * Gets cached user info from React state.
 * @returns {import("./types").UserInfoObject}
 */
function getUserInfo() {
  /** @type {import("./types").UserInfoObject} */
  let userInfo = {}
  let userEntities = getStateEntities()?.users?.entities
  if (userEntities) {
    for (let user of Object.values(userEntities)) {
      userInfo[user.screen_name] = {
        following: user.following,
        followedBy: user.followed_by,
        followersCount: user.followers_count,
      }
    }
  } else {
    warn('user entities not found')
  }
  return userInfo
}

function getUserScreenName() {
  let state = getState()
  return state?.entities?.users?.entities?.[state?.session?.user_id]?.screen_name
}

/** @param {HTMLVideoElement} $video */
function preventVideoReplay($video) {
  let fiber = null
  for (let $element = /** @type {Element} */ ($video); $element && !fiber; $element = $element.parentElement) {
    let key = Object.keys($element).find(key => key.startsWith('__reactFiber$'))
    if (key) fiber = $element[key]
  }
  for (let depth = 0; fiber && depth < 50; fiber = fiber.return, depth++) {
    let api = fiber.stateNode?.videoPlayer || fiber.stateNode?._playerInternal
    let player = api?.video
    if (player?.getVideoTag?.() !== $video) continue
    let track = player.getCurrentTrack()
    if (!track?.shouldLoop || track.displayType != 'content' || track.isLive) return null
    let shouldLoop = track.shouldLoop
    // Native completion computes its replay controls from the current track
    track.shouldLoop = false
    log('disableVideoLooping: prevented video replay')
    return () => {
      track.shouldLoop = shouldLoop
      if (!$video.isConnected) return
      let current = player.getCurrentTrack()
      if (track.contentId != null && current?.contentId === track.contentId && current.id === track.id) current.shouldLoop = shouldLoop
    }
  }
  return null
}
//#endregion

//#region Global observers
/**
 * Update theme hooks and colours when <body>'s backgroundColor changes.
 */
function observeBodyBackgroundColor() {
  let lastBackgroundColor = null

  observeElement($body, () => {
    let backgroundColor = $body.style.backgroundColor
    if (backgroundColor == lastBackgroundColor) return

    $body.classList.toggle('Default', backgroundColor == 'rgb(255, 255, 255)')
    $body.classList.toggle('LightsOut', backgroundColor == 'rgb(0, 0, 0)' || backgroundColor == 'rgb(5, 5, 5)')

    if (lastBackgroundColor != null) {
      log('Background setting changed')
      // This also updates body.HighContrast
      updateNativePalette('background setting change')
    }
    styleEmbed.update()
    lastBackgroundColor = backgroundColor
  }, {
    leading: true,
    name: '<body> style attribute for background colour changes',
    observers: globalObservers,
  }, {
    attributes: true,
    attributeFilter: ['style']
  })
}

const styleEmbed = (() => {
  /** @type {Set<{colorStyle: HTMLStyleElement, darkModeStyle: HTMLStyleElement, notificationStyle: HTMLStyleElement, rafId: number | null}>} */
  let embeddedStyles = new Set()

  function updateStyles() {
    let media = settings.darkModeTheme == 'dim' && $body.classList.contains('LightsOut') ? 'all' : 'not all'
    let themeCss = getEmbeddedThemeRules(DIM_THEME, $body.classList.contains('HighContrast'))
    let accentCss = pro ? getEmbeddedCustomAccentRules(settings.customTheme) : ''
    for (let {colorStyle, darkModeStyle, notificationStyle} of embeddedStyles) {
      colorStyle.textContent = accentCss + (settings.revertXBranding ? getEmbeddedBrandingRules() : '')
      darkModeStyle.textContent = themeCss
      darkModeStyle.media = media
      notificationStyle.media = settings.hideNotifications != 'ignore' ? 'all' : 'not all'
    }
  }

  /**
   * @param {string} selector
   * @param {string} rootSelector
   * @param {Document | HTMLElement} context
   */
  function styleEmbed(selector, rootSelector, context = document) {
    log('styleEmbed: waiting for root', {selector, path: currentPagePath})
    let colorStyle = document.createElement('style')
    let darkModeStyle = document.createElement('style')
    let notificationStyle = document.createElement('style')
    notificationStyle.textContent = dedent(`
      [data-testid="xchat-drawer-unread-badge"] {
        display: none !important;
      }
    `)
    let styles = {colorStyle, darkModeStyle, notificationStyle, rafId: null}
    embeddedStyles.add(styles)
    updateStyles()

    function disconnect() {
      if (styles.rafId != null) cancelAnimationFrame(styles.rafId)
      colorStyle.remove()
      darkModeStyle.remove()
      notificationStyle.remove()
      embeddedStyles.delete(styles)
    }

    function attachStyles() {
      styles.rafId = null
      if (!context.isConnected) {
        disconnect()
        return
      }
      let $host = context.querySelector(selector)
      let $shadowRoot = $host?.shadowRoot
      let $root = $shadowRoot?.querySelector(rootSelector)
      // Wait for the embed, its shadow root and initial render
      if (!$root) {
        styles.rafId = requestAnimationFrame(attachStyles)
        return
      }
      $shadowRoot.append(colorStyle, darkModeStyle, notificationStyle)
      if (debug) {
        let rootStyle = getComputedStyle($root)
        log('styleEmbed: styles attached', JSON.stringify({
          selector, path: currentPagePath, theme: $root.getAttribute('data-theme'),
          darkModeTheme: settings.darkModeTheme, darkModeMedia: darkModeStyle.media,
          inheritedBackground: rootStyle.getPropertyValue('--cpft-background'),
          background: rootStyle.getPropertyValue('--x-bg-primary'),
        }))
      }
    }

    attachStyles()
    return {disconnect}
  }
  styleEmbed.update = updateStyles
  return styleEmbed
})()

/** @param {HTMLElement} $drawerLayer */
function observeChatDrawer($drawerLayer) {
  let selector = '[data-testid="xchatEmbedDrawer"]'
  /** @type {Element | null} */
  let $embed = null
  /** @type {{disconnect()} | null} */
  let styles = null

  return observeElement($drawerLayer, () => {
    let $host = $drawerLayer.querySelector(selector)
    if ($host == $embed) return

    styles?.disconnect()
    $embed = $host
    styles = $embed ? styleEmbed(selector, ':is([data-xchat-root], [data-xchat-portal])', $drawerLayer) : null
  }, {
    leading: true,
    name: 'Chat embed drawer',
    observers: globalObservers,
    onDisconnect() {
      styles?.disconnect()
    },
  })
}

/**
 * @param {HTMLElement} $popup
 */
async function observeDesktopComposeTweetModal($popup) {
  $popup.classList.add('ComposeTweetModal')
  if (!settings.revertXBranding) return

  let modalCancelled = registerModalSetup('Compose Tweet modal setup')
  let $firstEditorRoot = await getElement('.DraftEditor-root', {
    context: $popup,
    name: 'Compose Tweet first editor root',
    observers: modalObservers,
    stopIf: modalCancelled,
  })
  if (!$firstEditorRoot || modalCancelled()) return

  let $tweetButtonText = $popup.querySelector('button[data-testid="tweetButton"] span > span')
  if ($tweetButtonText) {
    setTweetButtonText($tweetButtonText)
  }

  let $container = $firstEditorRoot.closest('div:not([class])')?.parentElement
  if (!$container) {
    warn('could not find container to observe in compose Tweet modal')
    return
  }

  observeElement($container, () => {
    let $editorRoots = $popup.querySelectorAll('.DraftEditor-root')
    $editorRoots.forEach((/** @type {HTMLElement} */ $editorRoot, index) => {
      if (index == 0) return
      $editorRoot.setAttribute('data-placeholder', getString('ADD_ANOTHER_TWEET'))
      observeDesktopTweetEditorPlaceholder($editorRoot, {
        name: `Modal Tweet editor root ${index} (for placeholder)`,
        observers: modalObservers,
      })
    })
  }, {
    leading: true,
    name: 'Compose Tweet modal Tweets container (for Tweets being added or removed)',
    observers: modalObservers,
  })

  // The Tweet button gets moved around when Tweets are added or removed
  observeElement($container, (mutations) => {
    for (let mutation of mutations) {
      for (let $addedNode of mutation.addedNodes) {
        if (!($addedNode instanceof HTMLElement) || $addedNode.nodeName != 'DIV') continue
        let $tweetButtonText = $addedNode.querySelector('button[data-testid="tweetButton"] span > span')
        if ($tweetButtonText) {
          setTweetButtonText($tweetButtonText)
        }
      }
    }
  }, {
    name: 'Compose Tweet modal contents (for Tweet button moving)',
    observers: modalObservers,
  }, {
    childList: true,
    subtree: true,
  })
}

/**
 * The timeline Tweet box is removed when you navigate to a pinned Communities
 * tab and re-added when you navigate to another Home timeline tab.
 */
async function observeDesktopHomeTimelineTweetBox() {
  let $container = await getElement(`${Selectors.PRIMARY_COLUMN} > div`, {
    name: 'Home timeline Tweet box container',
  })
  if (!$container) return

  /**
   * @param {HTMLElement} $tweetBox
   */
  function observeTweetBox($tweetBox) {
    $tweetBox.classList.add('TweetBox')

    if (settings.revertXBranding) tweakTweetButton()
  }

  /** @type {HTMLElement} */
  let $timelineTweetBox = $container.querySelector(':scope > div:has([data-testid^="tweetTextarea"]')
  if ($timelineTweetBox) {
    log('Home timeline Tweet box present')
    observeTweetBox($timelineTweetBox)
  }

  observeElement($container, (mutations) => {
    for (let mutation of mutations) {
      for (let $addedNode of mutation.addedNodes) {
        if (!($addedNode instanceof HTMLElement)) continue
        if ($addedNode.querySelector('[data-testid^="tweetTextarea"]')) {
          log('Home timeline Tweet box appeared')
          $timelineTweetBox = $addedNode
          observeTweetBox($timelineTweetBox)
        }
      }
      for (let $removedNode of mutation.removedNodes) {
        if (!($removedNode instanceof HTMLElement)) continue
        if ($removedNode === $timelineTweetBox) {
          log('Home timeline Tweet box removed')
          $timelineTweetBox = null
        }
      }
    }
  }, {
    name: 'Home timeline Tweet box container',
    observers: pageObservers,
  })
}

/**
 * @param {HTMLElement} $popup
 */
async function observeDesktopModalTimeline($popup) {
  let modalCancelled = registerModalSetup('media modal setup')
  // Media modals remember if they were previously collapsed, so we could be
  // waiting for the initial timeline to be either rendered or expanded.
  let $initialTimeline = await getElement(Selectors.MODAL_TIMELINE, {
    context: $popup,
    name: 'initial modal timeline',
    observers: modalObservers,
    stopIf: modalCancelled,
  })

  if ($initialTimeline == null || modalCancelled()) return

  /**
   * @param {HTMLElement} $timeline
   */
  function observeModalTimelineItems($timeline) {
    let seen = new Map()
    observeElement($timeline, () => {
      onIndividualTweetTimelineChange($timeline, seen, {observers: modalObservers})
    }, {
      leading: true,
      name: 'modal timeline',
      observers: modalObservers,
    })

    // If other media in the modal is clicked, the timeline is replaced.
    observeElement($timeline.parentElement, (mutations) => {
      for (let mutation of mutations) {
        for (let $newTimeline of mutation.addedNodes) {
          if (!($newTimeline instanceof HTMLElement)) continue
          log('modal timeline replaced')
          seen = new Map()
          observeElement($newTimeline, () => {
            onIndividualTweetTimelineChange($newTimeline, seen, {observers: modalObservers})
          }, {
            leading: true,
            name: 'modal timeline',
            observers: modalObservers,
          })
        }
      }
    }, {
      name: 'modal timeline parent',
      observers: modalObservers,
    })
  }

  /**
   * @param {HTMLElement} $timeline
   */
  function observeModalTimeline($timeline) {
    // If the inital timeline doesn't have a style attribute it's a placeholder
    if ($timeline.hasAttribute('style')) {
      observeModalTimelineItems($timeline)
    }
    else {
      log('waiting for modal timeline')
      let startTime = Date.now()
      observeElement($timeline.parentElement, (mutations, observer) => {
        for (let mutation of mutations) {
          for (let $addedNode of mutation.addedNodes) {
            if (!($addedNode instanceof HTMLElement)) continue
            if (Date.now() > startTime) {
              log(`modal timeline appeared after ${Date.now() - startTime}ms`, $addedNode)
            }
            observer.disconnect()
            observeModalTimelineItems($addedNode)
          }
        }
      }, {
        name: 'modal timeline parent',
        observers: modalObservers,
      })
    }
  }

  // The modal timeline can be expanded and collapsed
  let $expandedContainer = $initialTimeline.closest('[aria-expanded="true"]')
  observeElement($expandedContainer.parentElement, async (mutations) => {
    if (mutations.some(mutation => mutation.removedNodes.length > 0)) {
      log('modal timeline collapsed')
      modalObservers.get('modal timeline parent')?.disconnect()
      modalObservers.get('modal timeline')?.disconnect()
    }
    else if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
      log('modal timeline expanded')
      let $timeline = await getElement(Selectors.MODAL_TIMELINE, {
        context: $popup,
        name: 'expanded modal timeline',
        observers: modalObservers,
        stopIf: modalCancelled,
      })
      if ($timeline == null || modalCancelled()) return
      observeModalTimeline($timeline)
    }
  }, {
    name: 'collapsible modal timeline container',
    observers: modalObservers,
  })

  observeModalTimeline($initialTimeline)
}

const observeFavicon = (() => {
  /** @type {HTMLLinkElement} */
  let $shortcutIcon

  async function observeFavicon() {
    $shortcutIcon = /** @type {HTMLLinkElement} */ (await getElement('link[rel~="icon"]', {
      name: 'shortcut icon',
      context: document.head || document.documentElement,
      observers: globalObservers,
    }))
    observeElement($shortcutIcon, () => {
      let href = $shortcutIcon.href
      if (settings.revertXBranding) {
        // Once we replace the favicon, Twitter stops updating it when
        // notification status changes, so this only handles initial switchover
        // to the Twitter version of the icon.
        if (href.startsWith('data:')) return
        let icon = settings.hideNotifications != 'ignore' && href.includes('-pip') ? (
          Images.TWITTER_PIP_FAVICON
        ) : (
          // Make ths initial icon URL different so forceUpdate() replaces it
          Images.TWITTER_FAVICON + '?init'
        )
        $shortcutIcon.href = icon
      } else {
        // If we're hiding notifications, detect when Twitter tries to use the
        // pip version and switch back.
        if (settings.hideNotifications != 'ignore' && href.includes('-pip')) {
          $shortcutIcon.href = href.replace('-pip', '')
        }
      }
    }, {
      leading: true,
      name: 'shortcut icon href',
      observers: globalObservers,
    }, {
      attributes: true,
      attributeFilter: ['href'],
    })
  }

  observeFavicon.forceUpdate = function(showPip) {
    let href = $shortcutIcon.href
    if (settings.revertXBranding) {
      href = settings.hideNotifications == 'ignore' && showPip ? (
        Images.TWITTER_PIP_FAVICON
      ) : (
        Images.TWITTER_FAVICON
      )
    } else {
      href = `//abs.twimg.com/favicons/twitter${
        settings.hideNotifications == 'ignore' && showPip ? '-pip' : ''
      }.3.ico`
    }
    if (href != $shortcutIcon.href) {
      $shortcutIcon.href = href
    }
  }

  return observeFavicon
})()

/**
 * Twitter displays popups in the #layers element. It also reuses open popups
 * in certain cases rather than creating one from scratch, so we also need to
 * deal with nested popups, e.g. if you hover over the caret menu in a Tweet, a
 * popup will be created to display a "More" tootip and clicking to open the
 * menu will create a nested element in the existing popup, whereas clicking the
 * caret quickly without hovering over it will display the menu in new popup.
 * Use of nested popups can also differ between desktop and mobile, so features
 * need to be mindful of that.
 */
async function observePopups() {
  let $layers = await getElement('#layers', {
    name: 'layers',
    observers: globalObservers,
  })
  if (!$layers || $layers == $popupContainer) return
  /** @type {HTMLElement | null} */
  let $drawerLayer = null
  /** @type {Map<HTMLElement, {disconnect()} | null>} */
  let nestedObservers = new Map()

  observeElement($layers, () => {
    // The first layer contains persistent overlays, popups are siblings
    let $firstLayer = /** @type {HTMLElement} */ ($layers.firstElementChild)
    if ($firstLayer != $drawerLayer) {
      $drawerLayer = $firstLayer
      if ($drawerLayer) observeChatDrawer($drawerLayer)
    }

    for (let [$popup, observer] of nestedObservers) {
      if ($popup.parentElement != $layers || $popup == $firstLayer) {
        observer?.disconnect()
        nestedObservers.delete($popup)
      }
    }

    // A modal can already be open if we start on its URL
    for (let $popup of $layers.children) {
      if (!($popup instanceof HTMLElement) || $popup == $firstLayer || nestedObservers.has($popup)) continue
      nestedObservers.set($popup, onPopup($popup))
    }
  }, {
    leading: true,
    name: 'popup container',
    observers: globalObservers,
    onDisconnect() {
      $popupContainer = null
      for (let observer of nestedObservers.values()) {
        observer?.disconnect()
      }
      nestedObservers.clear()
    },
  })
  $popupContainer = $layers
}

async function observeReRenderBoundary() {
  let $rerenderBoundary = await getElement('#react-root > div > div', {
    name: 'app re-render boundary',
    observers: globalObservers,
  })
  if (!$rerenderBoundary) return
  observeElement($rerenderBoundary, () => {
    log('app re-rendered')
    observePopups()
    observeSideNavItems()
    if (observingPageChanges) {
      updateNativePalette('app rerender')
      if (currentPagePath) processCurrentPage()
    }
  }, {
    name: 'app re-render boundary',
    observers: globalObservers,
  })
}

async function observeTitle() {
  let $title = await getElement('title', {
    name: '<title>',
    context: document.head || document.documentElement,
    observers: globalObservers,
  })
  observeElement($title, () => {
    let title = $title.textContent
    if (title.match(/^Intervention for (X|Twitter)$/)) {
      log('Ignoring one sec extension title')
      return
    }
    if (settings.revertXBranding) title = formatBrandedTitle(title)
    if (settings.hideNotifications != 'ignore' && TITLE_NOTIFICATION_RE.test(title)) {
      hiddenNotificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
      title = title.replace(TITLE_NOTIFICATION_RE, '')
    }
    if (title != $title.textContent) {
      document.title = title
      // If Twitter is opened in the background, changing the title might not
      // re-fire the title MutationObserver, preventing the initial page from
      // being processed.
      if (observingPageChanges && !currentPagePath) {
        onTitleChange(title)
      }
      return
    }
    if (observingPageChanges) {
      onTitleChange(title)
    }
  }, {
    leading: true,
    name: '<title>',
    observers: globalObservers,
  })
}

function observeReactNativeStylesheet() {
  let $style = /** @type {HTMLStyleElement} */ (document.querySelector('style#react-native-stylesheet'))
  if (!$style) {
    warn('React Native stylesheet not found')
    return
  }

  let name = 'React Native stylesheet (for rules being added)'
  globalObservers.get(name)?.disconnect()
  let sheet = reactNativeStylesheet = $style.sheet
  let insertRule = sheet.insertRule
  /** @type {Set<CSSRule>} */
  let pendingRules = new Set()
  let timeout
  let cleanup = {
    name,
    disconnect() {
      clearTimeout(timeout)
      sheet.insertRule = insertRule
      pendingRules.clear()
      themeRules.clear()
      reactNativeStylesheet = null
      refreshThemeRules = () => {}
      globalObservers.delete(cleanup.name)
      log(`customTheme: disconnected ${cleanup.name} observer`)
    }
  }
  globalObservers.set(cleanup.name, cleanup)

  sheet.insertRule = function(rule, index) {
    let insertedIndex = insertRule.call(this, rule, index)
    pendingRules.add(this.cssRules[insertedIndex])
    clearTimeout(timeout)
    timeout = setTimeout(checkRules, 100)
    return insertedIndex
  }

  /**
   * @param {CSSRule} rule
   * @returns `true` if we found native theme colours in the rule.
   */
  function checkRule(rule) {
    if (!(rule instanceof CSSStyleRule)) return false

    if (fontFamilyRule == null &&
        rule.style.fontFamily?.includes('TwitterChirp') &&
        !rule.style.fontFamily.includes('TwitterChirpExtendedHeavy')) {
      fontFamilyRule = rule
      log('found Chirp fontFamily CSS rule in React Native stylesheet', fontFamilyRule)
      configureFont()
    }

    if (filterBlurRule == null && rule.style.filter?.includes('blur(30px)')) {
      filterBlurRule = rule
      log('found filter: blur(30px) rule in React Native stylesheet', filterBlurRule)
      configureDynamicCss()
    }

    let cssRules = []
    for (let property of rule.style) {
      let original = rule.style.getPropertyValue(property)
      let themed = original.replace(/rgba?\(([\d.,\s]+)\)/g, (color, channels) => {
        let [r, g, b, alpha = '1'] = channels.split(',').map(part => part.trim())
        let role = nativePalette.rolesByRgb.get([r, g, b].join(','))
        if (!role) return color
        let variable = `var(--cpft-theme-${role})`
        return Number(alpha) == 1 ? variable : `rgb(from ${variable} r g b / ${alpha})`
      })
      if (themed == original) continue
      let selector = rule.selectorText
      if (property == 'color' || property == 'background-color') {
        let exclusions = `${Selectors.TWEET_ACTIONS} *`
        if (property == 'color') exclusions += ', svg'
        selector += `:where(:not(${exclusions}))`
      }
      cssRules.push(`${selector} { ${property}: ${themed} !important; }`)
    }

    if (cssRules.length == 0) return false
    themeRules.set(rule, cssRules.join('\n'))
    return true
  }

  function checkRules() {
    let newCount = 0
    for (let rule of pendingRules) {
      if (checkRule(rule)) newCount++
    }
    pendingRules.clear()
    if (newCount > 0) {
      log(`customTheme: found ${newCount} new rule${s(newCount)} to override`, {total: themeRules.size})
      if (settings.customTheme) configureThemeCss()
    }
  }

  refreshThemeRules = (reason = 'manual') => {
    clearTimeout(timeout)
    pendingRules.clear()
    themeRules.clear()
    for (let rule of sheet.cssRules) checkRule(rule)
    log('customTheme: rebuilt theme overrides', {
      reason, scanned: sheet.cssRules.length, themeRules: themeRules.size,
    })
  }
  refreshThemeRules('initial scan')
}

const observeThemeMeta = (() => {
  /** @type {HTMLElement} */
  let $themeMeta
  /** @type {string} */
  let lastDarkModeBg

  function updateContent() {
    let content = $themeMeta?.getAttribute('content')
    if (enabled && settings.darkModeTheme == 'dim') {
      if (content == '#000000' || content == '#050505') {
        lastDarkModeBg = content
        $themeMeta.setAttribute('content', '#15202b')
      }
    }
    else if (content == '#15202b' && lastDarkModeBg) {
      $themeMeta.setAttribute('content', lastDarkModeBg)
      lastDarkModeBg = null
    }
  }

  async function observeThemeMeta() {
    $themeMeta = await getElement('meta[name="theme-color"]', {
      name: 'theme <meta>',
      context: document.head || document.documentElement,
    })
    observeElement($themeMeta, () => {
      updateContent()
    }, {
      leading: true,
      name: 'theme <meta>',
      observers: globalObservers,
      onDisconnect() {
        updateContent()
      },
    }, {
      attributes: true,
      attributeFilter: ['content'],
    })
  }

  observeThemeMeta.update = function() {
    updateContent()
  }

  return observeThemeMeta
})()
//#endregion

//#region Page observers
/**
 * @param {HTMLElement} $editorRoot
 * @param {{
 *   name: string
 *   observers: Map<string, import("./types").Disconnectable>
 *   placeholder?: string
 * }} options
 */
function observeDesktopTweetEditorPlaceholder($editorRoot, {
  name,
  observers,
  placeholder = '',
}) {
  observeElement($editorRoot, () => {
    if ($editorRoot.firstElementChild.classList.contains('public-DraftEditorPlaceholder-root')) {
      let $placeholder = $editorRoot.querySelector('.public-DraftEditorPlaceholder-inner')
      placeholder = $editorRoot.getAttribute('data-placeholder') || placeholder
      if ($placeholder && $placeholder.textContent != placeholder) {
        $placeholder.textContent = placeholder
      }
    }
  }, {leading: true, name, observers})
}

/**
 * @param {string} page
 */
async function observeIndividualTweetTimeline(page) {
  let $timeline = await getElement(Selectors.TIMELINE, {
    name: 'initial individual tweet timeline',
  })

  if ($timeline == null) return

  /**
   * @param {HTMLElement} $timeline
   */
  function observeTimelineItems($timeline) {
    let seen = new WeakMap()
    observeElement($timeline, () => {
      onIndividualTweetTimelineChange($timeline, seen, {observers: pageObservers})
    }, {
      leading: true,
      name: 'individual tweet timeline',
      observers: pageObservers,
    })
  }

  // If the inital timeline doesn't have a style attribute it's a placeholder
  if ($timeline.hasAttribute('style')) {
    observeTimelineItems($timeline)
  }
  else {
    log('waiting for individual tweet timeline')
    let startTime = Date.now()
    observeElement($timeline.parentElement, (mutations, observer) => {
      for (let mutation of mutations) {
        for (let $addedNode of mutation.addedNodes) {
          if (!($addedNode instanceof HTMLElement)) continue
          if (Date.now() > startTime) {
            log(`individual tweet timeline appeared after ${Date.now() - startTime}ms`, $addedNode)
          }
          observer.disconnect()
          observeTimelineItems($addedNode)
        }
      }
    }, {
      name: 'individual tweet timeline parent',
      observers: pageObservers,
    })
  }
}

async function observeSearchForm() {
  let $searchForm = await getElement('form[role="search"]', {
    name: 'search form',
    // The sidebar on Profile pages can be really slow
    timeout: 2000,
  })
  if (!$searchForm) return
  let $results =  /** @type {HTMLElement} */ ($searchForm.lastElementChild)
  observeElement($results, () => {
    processBlueChecks($results)
  }, {
    leading: true,
    name: 'search results',
    observers: pageObservers,
  }, {
    childList: true,
    subtree: true,
  })
}

async function observeSidebar() {
  let $primaryColumn = await getElement(Selectors.PRIMARY_COLUMN, {
    name: 'primary column',
  })
  let $sidebarContainer = $primaryColumn.parentElement
  observeElement($sidebarContainer, async () => {
    let $sidebar = /** @type {HTMLElement} */ ($sidebarContainer.querySelector(Selectors.SIDEBAR))
    log(`sidebar ${$sidebar ? 'appeared' : 'disappeared'}`)
    $body.classList.toggle('Sidebar', Boolean($sidebar))
    if (!$sidebar) {
      if (!settings.hideSidebarContent) {
        pageObservers.get('sidebar contents (for Live on X loading)')?.disconnect()
        pageObservers.get("sidebar What's happening timeline")?.disconnect()
      }
      return
    }
    let $sidebarContents = await getElement('div[data-testid="sidebarColumn"] > div > div > div > div > div', {
      name: 'sidebar contents',
      context: $sidebarContainer,
    })
    $sidebarContents.classList.add('SidebarContents')

    // Process blue checks in the sidebar search dropdown
    if (settings.premiumBlueChecks != 'ignore' && !isOnSearchPage() && !isOnExplorePage()) {
      observeSearchForm()
    }
    // Process blue checks in the sidebar user box
    if (!settings.hideSidebarContent || settings.showRelevantPeople && isOnIndividualTweetPage()) {
      void async function() {
        // Avoid false positive from upsells in the sidebar
        let $aside = await getElement('aside[role="complementary"]:not(:has(a:is([href^="/i/premium"], [href^="https://grok.com/imagine"])))', {
          name: 'sidebar aside box',
          context: $sidebar,
          timeout: 2000,
        })
        if (!$aside) return
        if (settings.premiumBlueChecks != 'ignore') processBlueChecks($aside)
        let $container = $aside.parentElement
        while (!$container.nextElementSibling) $container = $container.parentElement
        $container.classList.toggle(
          'SuggestedFollows',
          settings.hideSuggestedFollows && !(settings.showRelevantPeople && isOnIndividualTweetPage())
        )
      }()
    }
    if (!settings.hideSidebarContent && !isOnExplorePage()) {
      // Hide the ad in sidebar What's happening
      void async function() {
        // What's happening has a unique DOM structure we can look for
        let $whatsHappeningTimeline = await getElement('section > div[aria-label] > div', {
          name: "sidebar What's happening timeline",
          context: $sidebar,
          timeout: 2000,
        })
        if (!$whatsHappeningTimeline) return
        // What's happening loads asynchronously and refreshes every time the
        // page regains refocus.
        observeElement($whatsHappeningTimeline, () => {
          let $firstTrend = $whatsHappeningTimeline.querySelector(':scope > div:has([data-testid="trend"])')
          if ($firstTrend && !$firstTrend.previousElementSibling.classList.contains('HiddenAd')) {
            $firstTrend.previousElementSibling.classList.toggle('HiddenAd', !$firstTrend.previousElementSibling.querySelector('h2'))
          }
        }, {
          name: "sidebar What's happening timeline",
          observers: pageObservers,
        }, {childList: true, subtree: true})
        if (settings.hideWhatsHappening) $whatsHappeningTimeline.closest('section').parentElement.classList.add('WhatsHappening')
      }()
    }
    if (!settings.hideSidebarContent) {
      // Observe the Live on X section
      void async function() {
        /**
         * @param {HTMLElement} $liveOnX
         * @param {HTMLElement} $heading
         */
        function handleLiveOnX($liveOnX, $heading) {
          $liveOnX.classList.add('LiveBroadcasts')
          if (settings.premiumBlueChecks != 'ignore') {
            // XXX This is sometimes too early, observe changes for them appearing?
            processBlueChecks($liveOnX)
          }
          let branding = $heading.getAttribute('data-branding') || 'x'
          if (settings.revertXBranding ? branding == 'x' : branding == 'twitter') {
            let $span = $heading.querySelector('span')
            if ($span) {
              $span.textContent = branding == 'x' ? $span.textContent.replace('X', getString('TWITTER')) : getString('TWITTER')
              $heading.setAttribute('data-branding', branding == 'x' ? 'twitter' : 'x')
            }
          }
        }
        // The heading should be available if the component is already loaded
        let $liveOnXHeading = Array.from($sidebar.querySelectorAll('h2')).find((h2) =>
          h2.hasAttribute('data-branding') || h2.textContent == getString('LIVE_ON_X')
        )
        if ($liveOnXHeading) {
          handleLiveOnX($liveOnXHeading.parentElement.parentElement, $liveOnXHeading)
        }
        // The Live on X box can pop in and out of  existence while you're
        // sitting on a page, so always oveserve for it.
        observeElement($sidebarContents, (mutations) => {
          for (let mutation of mutations) {
            for (let $addedNode of mutation.addedNodes) {
              if (!($addedNode instanceof HTMLElement)) continue
              let $heading = $addedNode.querySelector('h2')
              if ($heading?.textContent == getString('LIVE_ON_X')) {
                log('Live on X appeared')
                handleLiveOnX($addedNode, $heading)
                return
              }
            }
          }
        }, {
          name: 'sidebar contents (for Live on X loading)',
          observers: pageObservers,
        })
      }()
    }
  }, {
    leading: true,
    name:'sidebar container',
    observers: pageObservers,
  })
}

function observeSideNavItems() {
  observeSideNavTweetButton()
}

const observeSideNavTweetButton = (() => {
  /** @type {MutationObserver} */
  let observer

  return async function observeSideNavTweetButton() {
    if (observer) {
      observer.disconnect()
      observer = null
    }

    if (!desktop || !settings.revertXBranding) return

    // This element is updated when text is added or removed on resize
    let $buttonTextContainer = await getElement('a[data-testid="SideNav_NewTweet_Button"] span', {
      name: 'sidenav tweet button text container',
      observers: globalObservers,
    })
    if (!$buttonTextContainer) return
    observer = observeElement($buttonTextContainer, () => {
      if ($buttonTextContainer.childElementCount > 0) {
        let $buttonText = /** @type {HTMLElement} */ ($buttonTextContainer.querySelector('span > span'))
        if ($buttonText) {
          setTweetButtonText($buttonText)
        } else {
          warn('could not find tweet button text')
        }
      }
      if (isSafari && settings.revertXBranding) {
        tweakTweetIcon()
      }
    }, {
      leading: true,
      name: 'sidenav tweet button',
      observers: globalObservers,
    })
  }
})()

/**
 * @param {string} page
 * @param {import("./types").TimelineOptions?} options
 */
async function observeTimeline(page, options = {}) {
  let {
    isTabbed = false,
    onTabChanged = null,
    onTimelineAppeared = null,
    tabbedTimelineContainerSelector = null,
    timelineSelector = Selectors.TIMELINE,
  } = options

  let $timeline = await getElement(timelineSelector, {
    name: 'initial timeline',
  })

  if ($timeline == null) return

  /**
   * @param {HTMLElement} $timeline
   */
  function observeTimelineItems($timeline) {
    let seen = new WeakMap()
    observeElement($timeline, () => {
      onTimelineChange($timeline, page, seen, options)
    }, {
      leading: true,
      name: 'timeline',
      observers: pageObservers,
    })
    onTimelineAppeared?.()
    if (isTabbed) {
      // When a tab which has been viewed before is revisited, the timeline is
      // replaced.
      observeElement($timeline.parentElement, (mutations) => {
        for (let mutation of mutations) {
          for (let $addedNode of mutation.addedNodes) {
            if (!($addedNode instanceof HTMLElement)) continue
            let $newTimeline = $addedNode
            log('tab changed')
            onTabChanged?.()
            seen = new WeakMap()
            observeElement($newTimeline, () => {
              onTimelineChange($newTimeline, page, seen, options)
            }, {
              leading: true,
              name: 'timeline',
              observers: pageObservers,
            })
          }
        }
      }, {
        name: 'timeline parent',
        observers: pageObservers,
      })
    }
  }

  // If the inital timeline doesn't have a style attribute it's a placeholder
  if ($timeline.hasAttribute('style')) {
    observeTimelineItems($timeline)
  }
  else {
    log('waiting for timeline')
    let startTime = Date.now()
    observeElement($timeline.parentElement, (mutations, observer) => {
      for (let mutation of mutations) {
        for (let $addedNode of mutation.addedNodes) {
          if (!($addedNode instanceof HTMLElement)) continue
          observer.disconnect()
          if (Date.now() > startTime) {
            log(`timeline appeared after ${Date.now() - startTime}ms`, $addedNode)
          }
          observeTimelineItems($addedNode)
        }
      }
    }, {
      name: 'timeline parent',
      observers: pageObservers,
    })
  }

  // On some tabbed timeline pages, the first time a new tab is navigated to,
  // the element containing the timeline is replaced with a loading spinner.
  if (isTabbed && tabbedTimelineContainerSelector) {
    let $tabbedTimelineContainer = document.querySelector(tabbedTimelineContainerSelector)
    if ($tabbedTimelineContainer) {
      let waitingForNewTimeline = false
      observeElement($tabbedTimelineContainer, async (mutations) => {
        // This is going to fire twice on a new tab, as the spinner is added
        // then replaced with the new timeline element.
        if (!mutations.some(mutation => mutation.addedNodes.length > 0) || waitingForNewTimeline) return

        waitingForNewTimeline = true
        let $newTimeline = await getElement(timelineSelector, {
          name: 'new timeline',
        })
        waitingForNewTimeline = false
        if (!$newTimeline) return

        log('tab changed')
        onTabChanged?.()
        observeTimelineItems($newTimeline)
      }, {
        name: 'tabbed timeline container',
        observers: pageObservers,
      })
    } else {
      warn('tabbed timeline container not found', tabbedTimelineContainerSelector)
    }
  }
}
//#endregion

//#region CSS
const configureCss = (() => {
  let $style

  return function configureCss() {
    if (!enabled) {
      log('removing main stylesheet')
      $style?.remove()
      $style = null
      return
    }

    let cssRules = [`
      .cpft_font_family, .cpft_text {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      .cpft_separator {
        padding: 0 4px;
      }
      .cpft_text {
        color: var(--cpft-text-secondary);
      }
    `]
    let hideCssSelectors = [
      '.HiddenTweet',
      '.HiddenTweet + [role="separator"]',
      '.HiddenAd',
      // Hide promoted trends
      `[data-testid="trend"]:has(path[d="${Svgs.PROMOTED_PATH}"])`,
    ]
    let menuRole = `[role="${desktop ? 'menu' : 'dialog'}"]`

    // Theme colours for custom UI items
    cssRules.push(`
      body.Default {
        --cpft-active-bg: rgb(239, 243, 244);
        --cpft-border: rgb(239, 243, 244);
        --cpft-hover-bg: rgb(247, 249, 249);
        --cpft-menu-hover-bg: rgba(0, 0, 0, 0.03);
        --cpft-tab-hover-backdrop: rgba(15, 20, 25, 0.1);
        --cpft-text-primary: rgb(15, 20, 25);
        --cpft-text-secondary: rgb(83, 100, 113);
      }
      body.LightsOut {
        --cpft-active-bg: rgb(32, 35, 39);
        --cpft-border: rgb(47, 51, 54);
        --cpft-hover-bg: rgb(22, 24, 28);
        --cpft-menu-hover-bg: rgba(255, 255, 255, 0.03);
        --cpft-tab-hover-backdrop: rgba(231, 233, 234, 0.1);
        --cpft-text-primary: rgb(231, 233, 234);
        --cpft-text-secondary: rgb(113, 118, 123);
      }
      .cpft_menu_item, .cpft_menu_item a {
        background-color: transparent !important;
      }
      .cpft_menu_item:hover {
        background-color: var(--cpft-menu-hover-bg) !important;
        /* The nav menu is still using the old color */
        &:has(> a[href="/settings/add_muted_keyword"]) {
          background-color: var(--cpft-hover-bg) !important;
        }
      }
    `)

    if (settings.darkModeTheme == 'dim') {
      cssRules.push(`
        body.LightsOut {
          background-color: var(--cpft-background) !important;
          scrollbar-color: var(--cpft-border) var(--cpft-hover-bg) !important;

          [data-testid="dm-search-bar"].bg-gray-0,
          :is(.animate-pulse, .motion-safe\\:animate-pulse).bg-gray-100, /* Chat skeletons */
          .r-z32n2g {
            background-color: var(--cpft-active-bg);
          }
          :is([data-testid^="dm-conversation-item-"], [data-radix-popper-content-wrapper]) .bg-gray-0,
          .r-14tof1o {
            background-color: var(--cpft-active-bg-dark);
          }
          [style*="background-color: rgb(0, 0, 0)"] {
            background-color: var(--cpft-background) !important;
          }
          [data-testid="dm-conversation-header"] > div:first-child.absolute > div {
            mask-image: linear-gradient(360deg, transparent 0%, var(--cpft-background) 100%) !important;
          }
          .bg-background,
          .jf-element .j-vdda9x11,
          .r-kemksi {
            background-color: var(--cpft-background);
          }
          .r-gu4em3, /* horizontal border */
          .r-1bnu78o /* thread line */ {
            background-color: var(--cpft-border);
          }
          .r-5zmot {
            background-color: var(--cpft-backdrop);
          }
          .r-cl2sl0 {
            background-color: var(--cpft-raised-bg);
          }
          .r-qo02w8,
          .r-1uusn97 {
            box-shadow: var(--cpft-box-shadow);
          }
          .r-1kqtdi0, /* all */
          .r-1igl3o0, /* bottom */
          .r-2sztyj,  /* top */
          .r-vpktly,  /* bottom (brighter) */
          .r-1roi411  /* input */ {
            border-color: var(--cpft-border);
          }
          .r-g2wdr4,
          .r-cuuowz {
            background-color: var(--cpft-hover-bg);
          }
          [data-testid="dm-conversation-header"] button.bg-gray-0,
          .jf-element .j-cw4uj611 {
            background-color: var(--cpft-hover-bg);
          }
          [data-testid="dm-empty-conversation-state"] .bg-gray-0,
          .r-1hdo0pc {
            background-color: var(--cpft-tab-hover-backdrop);
          }
          .jf-element .j-4t3tug11 {
            color: var(--cpft-text-primary);
          }
          [style*="color: rgb(113, 118, 123);"],
          [data-testid="dm-container"] .\\!text-gray-700:not([data-state="active"]),
          .public-DraftEditorPlaceholder-hasFocus,
          .public-DraftEditorPlaceholder-root {
            color: var(--cpft-text-secondary) !important;
          }
          [data-testid="dm-container"] .text-gray-700,
          [data-testid="dm-message-list"] .text-subtext2,
          .jf-element .j-tibd4011,
          .r-1bwzh9t /* icons */ {
            color: var(--cpft-text-secondary);
          }
          [role="dialog"][id^="radix"] {
            &.bg-gray-0 {
              background-color: var(--cpft-background);
            }
            .text-gray-700 {
              color: var(--cpft-text-secondary);
            }
          }
          .scrollbar-thin-custom {
            scrollbar-color: var(--cpft-border) var(--cpft-hover-bg);
            &::-webkit-scrollbar-thumb {
              background-color: var(--cpft-border);
            }
            &::-webkit-scrollbar-track {
              background: var(--cpft-hover-bg);
            }
          }
        }
        body.LightsOut.HighContrast {
          [style*="background-color: rgb(5, 5, 5)"] {
            background-color: var(--cpft-background) !important;
          }
          .r-16331v6 {
            background-color: var(--cpft-background);
          }
          .r-1wh73dq /* horizontal border */ {
            background-color: var(--cpft-border);
          }
          .r-dgm4ly /* all */ {
            border-color: var(--cpft-border);
          }
        }
      `)
      if (settings.darkModeTheme == 'dim') {
        cssRules.push(`
          body.LightsOut {
            /* Theme */
            --cpft-active-bg-dark: rgb(27, 36, 47);
            --cpft-active-bg: rgb(40, 50, 61);
            --cpft-backdrop: rgba(21, 32, 43, .85);
            --cpft-background: rgb(21, 32, 43);
            --cpft-border: rgb(56, 68, 77);
            --cpft-box-shadow: rgba(136, 153, 166, 0.2) 0px 0px 15px, rgba(136, 153, 166, 0.15) 0px 0px 3px 1px;
            --cpft-hover-bg: rgb(30, 39, 50);
            --cpft-raised-bg: rgb(40, 50, 61);
            --cpft-tab-hover-backdrop: rgba(247, 249, 249, 0.1);
            --cpft-tab-hover-bg: rgba(44, 53, 64);
            --cpft-text-primary: rgb(247, 249, 249);
            --cpft-text-secondary: rgb(139, 152, 165);
          }
        `)
      }
    }

    if (settings.addFocusedTweetAccountLocation) {
      cssRules.push('.AccountLocation[hidden] { display: inline; }')
    }
    if (settings.defaultToFollowing && settings.hideForYouTimeline) {
      cssRules.push(`
        /* Prevent the For you tab container taking up space */
        body.HomeTimeline nav.TimelineTabs div[role="tablist"] > div:first-child {
          flex-grow: 0;
          flex-shrink: 1;
        }
        /* Hide the For you tab link */
        body.HomeTimeline nav.TimelineTabs div[role="tablist"] > div:first-child > [role="tab"] {
          display: none;
        }
      `)
    }
    if (settings.defaultFollowingToRecent && settings.hideFollowingMenu) {
      hideCssSelectors.push('.FollowingTabContainer svg')
    }
    if (settings.disableTweetTextFormatting) {
      cssRules.push(`
        div[data-testid="tweetText"] span {
          font-style: normal;
          font-weight: normal;
        }
      `)
    }
    if (settings.dropdownMenuFontWeight) {
      cssRules.push(`
        [data-testid="${desktop ? 'Dropdown' : 'sheetDialog'}"] [role="menuitem"] [dir] {
          font-weight: normal;
        }
      `)
    }
    if (settings.hideBookmarkButton) {
      // Under timeline tweets
      hideCssSelectors.push(
        'body:not(.Bookmarks) [data-testid="tweet"][tabindex="0"] [role="group"] > div:has(> button[data-testid$="ookmark"])',
      )
      if (!settings.showBookmarkButtonUnderFocusedTweets) {
        // Under the focused tweet
        hideCssSelectors.push(
          '[data-testid="tweet"][tabindex="-1"] [role="group"][id^="id__"] > div:has(> button[data-testid$="ookmark"])',
        )
      }
    }
    if (settings.hideCalls) {
      hideCssSelectors.push(`${menuRole} a[href="/i/calls"]`)
    }
    if (settings.hideConnectNav) {
      hideCssSelectors.push(`${menuRole} a:is([href$="/i/connect_people"], [href$="/i/follow_people"])`)
    }
    if (settings.hideCreatorStudioNav) {
      hideCssSelectors.push(
        `${menuRole} a[href$="/creators/studio"]`,
        // Monetization and Subscriptions items in Settings
        'body.Settings a[href="/settings/monetization"]',
        'body.Settings a[href="/settings/manage_subscriptions"]',
      )
      if (desktop) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/creators/studio"]`)
      }
    }
    if (settings.hideEditImage) {
      let isImagineSelector = ':is([href^="/i/imagine"], [href^="https://grok.com/imagine"], [href^="/i/grok-redirect"])'
      hideCssSelectors.push(
        // Manually-tagged
        '.EditImage',
        // On images in Tweets
        `[data-testid="tweet"] div[aria-labelledby] a${isImagineSelector}`,
        `[data-testid="tweet"] [data-testid="tweetText"] a${isImagineSelector}`,
        // In menus
        `[role="menuitem"]${isImagineSelector}`,
        // In media modal
        `[aria-modal="true"] > div > div:first-of-type a${isImagineSelector}`,
      )
    }
    if (!settings.hideExplorePageContents) {
      hideCssSelectors.push(
        // Hide the ad at the top of Explore…
        'body.Explore [data-testid="eventHero"]',
        // …and its floating button
        'body.Explore [data-testid="eventHero"] + div',
      )
    }
    if (settings.hideListsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/lists"]`)
    }
    if (settings.hideHistoryNav) {
      hideCssSelectors.push(`${menuRole} a[href$="${PagePaths.HISTORY}"]`)
    }
    if (settings.hideCommunitiesNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/communities"]`)
    }
    if (settings.hideManageTimelines) {
      hideCssSelectors.push('.ManageTimelines')
    }
    if (settings.hideShareTweetButton) {
      hideCssSelectors.push(
        // Under timeline tweets
        `[data-testid="tweet"][tabindex="0"] [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        // Under the focused tweet
        `[data-testid="tweet"][tabindex="-1"] [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
      )
    }
    if (settings.hideSortRepliesMenu) {
      hideCssSelectors.push('.SortRepliesMenu')
    }
    if (settings.hideMoney) {
      hideCssSelectors.push(
        `${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/money"]`,
        `${Selectors.PRIMARY_NAV_MOBILE} a[href="/i/money"]`,
        `${menuRole} a[href="/i/money"]`,
        // Money icon and balance buttons beside Edit Profile
        '[data-testid="ownProfilePaymentsButton"]',
        '[data-testid="ownProfilePaymentsButtonWithBalance"]',
        // Embedded payment card in Tweets
        'article .jetfuel-style-root:has([data-icon="icon-logo-x"])',
      )
    }
    if (settings.hideSubscriptions) {
      hideCssSelectors.push(
        // Subscribe buttons in profile (multiple locations)
        'body.Profile [role="button"][style*="border-color: rgb(201, 54, 204)"]',
        // Subscriptions count in profile
        'body.Profile a[href$="/creator-subscriptions/subscriptions"]',
        // Subs tab in profile
        'body.Profile .SubsTab',
        // Subscribe button in focused tweet
        '[data-testid="tweet"][tabindex="-1"] [data-testid$="-subscribe"]',
        // "Subscribe to" dropdown item (desktop)
        '[data-testid="Dropdown"] > [data-testid="subscribe"]',
        // "Subscribe to" menu item (mobile)
        '[data-testid="sheetDialog"] > [data-testid="subscribe"]',
        // "Subscriber" indicator in replies from subscribers
        '[data-testid="tweet"] [data-testid="icon-subscriber"]',
        // Subscriptions tab link in Following/Follows
        `.SubscriptionsTab > [role="tab"]`,
      )
      // Subscriptions tab in Following/Follows
      cssRules.push(`
        .SubscriptionsTab {
          flex: 0;
        }
      `)
    }
    if (settings.hideMetrics) {
      configureHideMetricsCss(cssRules, hideCssSelectors)
    }
    if (settings.hideDiscoverSuggestions) {
      hideCssSelectors.push('.SuggestedContent')
    }
    if (settings.hideCommunitiesNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/communities"]`)
    }
    if (settings.hideGrok) {
      hideCssSelectors.push(
        // In menus
        `${menuRole} a[href="/i/grok"]`,
        // Grok Actions button
        `button[aria-label="${getString('GROK_ACTIONS')}"]`,
        // "Generate image" button in the Tweet editor
        'button[data-testid="grokImgGen"]',
        // Any Grok buttons we manually tag
        '.GrokButton',
        // Grok suggested prompts in Tweets
        '[data-testid="tweet"] [data-testid^="followups_"]',
        '[data-testid="tweet"] [data-testid^="followups_"] + nav',
        // Ask Grok button in Tweets
        '[data-testid="tweet"] a[href="/i/grok"]',
        // Profile Summary button
        `button[aria-label="${getString('PROFILE_SUMMARY')}"]`,
        // Grok summary at the top of search results
        'body.Search [data-testid="primaryColumn"] > div > div:has(> [data-testid="followups_search"])',
        // Install button card in Grok tweets
        '[data-testid="card.wrapper"]:has(> div > a[href="https://itunes.apple.com/app/id6670324846"])',
      )
    }
    if (settings.hideAdsNav) {
      hideCssSelectors.push(`${menuRole} a:is([href*="ads.twitter.com"], [href*="ads.x.com"])`)
    }
    if (settings.hideBusinessNav) {
      hideCssSelectors.push(`${menuRole} a:is([href^="/i/premium-business"], [href^="/i/verified-orgs-signup"])`)
      if (desktop) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a:is([href^="/i/premium-business"], [href^="/i/verified-orgs-signup"])`)
      }
    }
    if (settings.hideJobs) {
      hideCssSelectors.push(
        // Jobs navigation item
        `${menuRole} a[href="/jobs"]`,
        // Jobs section in profiles
        '.Profile [data-testid="jobs"]',
      )
    }
    if (settings.hideViewActivityLinks) {
      hideCssSelectors.push(
        // Manually-tagged View activity link
        '.ViewActivity',
        // View post activity menu item
        `${menuRole} a[href$="/quotes"]`,
      )
    }
    if (settings.hidePremiumUpsells) {
      hideCssSelectors.push(
        // Manually-tagged upsells
        '.PremiumUpsell',
        // Premium menu item
        `${menuRole} a[href^="/i/premium_sign_up"]`,
        // Analytics menu item
        `${menuRole} a[href="/i/account_analytics"]`,
        // "Highlight on your profile" on your tweets
        '[role="menuitem"][data-testid="highlightUpsell"]',
        // "Edit" upsell on recent tweets
        '[role="menuitem"][data-testid="editWithPremium"]',
        // Premium item in Settings
        'body.Settings a[href^="/i/premium_sign_up"]',
        // Misc upsells in your own profile
        `.OwnProfile ${Selectors.PRIMARY_COLUMN} a[href^="/i/premium_sign_up"]`,
        // Unlock Analytics button in your own profile
        '.OwnProfile [data-testid="analytics-preview"]',
        // Button in Communities header
        `body.Communities ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} a:is([href^="/i/premium"], [href^="/i/verified"])`,
        // "This profile is verified" upsell
        '[data-testid="verified_profile_upsell"]',
        // Get Premium Analytics upsell
        '[data-testid="profileAnalyticsUpsell"]',
        // "you aren't verified yet" in Premium user profile
        '[data-testid="verified_profile_visitor_upsell"]',
        // "Upgrade to Premium+ to write longer posts" in Tweet composer
        `${mobile ? 'body.ComposeTweetPage' : ':is(.ComposeTweetModal, .TweetBox)'} [aria-live="polite"][role="status"]:has(a[href^="/i/premium_sign_up"])`,
        // Box in focused Tweet with "Upgrade to Premium+" / "Get Verified" upsell
        '[data-testid="tweet"][tabindex="-1"] [aria-live="polite"][role="status"]:has(a[href^="/i/premium_sign_up"])',
        // Upsell on the Likes tab in your own profile
        `body.OwnProfile ${Selectors.PRIMARY_COLUMN} nav + div:has(a[href^="/i/premium"])`,
      )
      // Hide Highlights and Articles tabs in your own profile if you don't have Premium
      let profileTabsList = `body.OwnProfile:not(.PremiumProfile) ${Selectors.PRIMARY_COLUMN} nav div[role="tablist"]`
      let upsellTabLinks = 'a:is([href$="/highlights"], [href$="/articles"], [href$="/highlights?mx=1"], [href$="/articles?mx=1"])'
      cssRules.push(`
        ${profileTabsList} > div:has(> ${upsellTabLinks}) {
          flex: 0;
        }
        ${profileTabsList} > div > ${upsellTabLinks} {
          display: none;
        }
      `)
    }
    if (settings.hideVerifiedTabs) {
      cssRules.push(`
        .VerifiedFollowersTab {
          flex: 0;
        }
        .VerifiedFollowersTab > [role="tab"] {
          display: none;
        }
      `)
    }
    if (settings.hideViews) {
      // "Views" under the focused tweet
      hideCssSelectors.push('.Views')
    }
    if (settings.hideSuggestedContentTimeline) {
      hideCssSelectors.push(`body.Profile ${Selectors.PRIMARY_COLUMN} aside[role="complementary"]`)
    }
    if (settings.reducedInteractionMode) {
      hideCssSelectors.push(
        '[data-testid="tweet"] [role="group"]',
        'body.Tweet [data-testid="tweet"] + div > div [role="group"]',
      )
    }
    if (settings.restoreLinkHeadlines) {
      cssRules.push(`
        .cpft_link_headline[hidden] {
          display: block;
          border-top: 1px solid var(--cpft-border);
          padding: 14px;
          line-height: normal;
        }
      `)
      hideCssSelectors.push(
        // Existing headline overlaid on the card
        '.cpft_overlay_headline',
        // From <domain> link after the card
        'div[data-testid="card.wrapper"] + div',
      )
    }
    if (settings.restoreQuoteTweetsLink || settings.restoreOtherInteractionLinks) {
      cssRules.push(`
        #cpftInteractionLinks[hidden] {
          display: block;
        }
        #cpftInteractionLinks a {
          text-decoration: none;
          color: var(--cpft-text-secondary);
        }
        #cpftInteractionLinks a:hover span:last-child {
          text-decoration: underline;
        }
        #cpftQuoteTweetCount, #cpftRetweetCount, #cpftLikeCount {
          margin-right: 2px;
          font-weight: 700;
          color: var(--cpft-text-primary);
        }
        /* Replaces the "View activity" link under your own tweets */
        .ViewActivity {
          display: none;
        }
      `)
    }
    if (!settings.restoreQuoteTweetsLink) {
      hideCssSelectors.push('#cpftQuoteTweetsLink')
    }
    if (!settings.restoreOtherInteractionLinks) {
      hideCssSelectors.push('#cpftRetweetsLink', '#cpftLikesLink')
    }
    if (settings.tweakQuoteTweetsPage) {
      // Hide the quoted tweet, which is repeated in every quote tweet
      hideCssSelectors.push('body.QuoteTweets [data-testid="tweet"] [aria-labelledby] > div:last-child')
    }
    if (settings.premiumBlueChecks == 'hide') {
      hideCssSelectors.push('.cpft_blue_check')
    }
    if (settings.premiumBlueChecks == 'replace') {
      cssRules.push(`
        :is(${Selectors.VERIFIED_TICK}, svg[data-testid="verificationBadge"]).cpft_blue_check path {
          d: path("${Svgs.TWITTER_BLUE_LOGO_PATH}");
        }
      `)
    }

    if (shouldShowSeparatedTweetsTab()) {
      cssRules.push(`
        /* Sometimes the cloned tab has a hover background color class */
        body:not(.SeparatedTweets) #cpftSeparatedTweetsTab > [role="tab"] {
          background-color: transparent !important;
        }
        body.Desktop #cpftSeparatedTweetsTab:hover,
        body.Mobile:not(.SeparatedTweets) #cpftSeparatedTweetsTab:hover,
        body.Mobile #cpftSeparatedTweetsTab:active {
          background-color: var(--cpft-tab-hover-backdrop) !important;
        }
        body:not(.SeparatedTweets) #cpftSeparatedTweetsTab > [role="tab"] > div > div,
        body.HomeTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#cpftSeparatedTweetsTab) > [role="tab"] > div > div {
          font-weight: normal !important;
          color: var(--cpft-text-secondary) !important;
        }
        body.SeparatedTweets #cpftSeparatedTweetsTab > [role="tab"] > div > div {
          font-weight: bold;
          color: var(--cpft-text-primary) !important;
        }
        /* Active tab underline */
        body:not(.SeparatedTweets) #cpftSeparatedTweetsTab > [role="tab"] > div > div > div,
        body.HomeTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#cpftSeparatedTweetsTab) > [role="tab"] > div > div > div {
          height: 0 !important;
        }
        body.SeparatedTweets #cpftSeparatedTweetsTab > [role="tab"] > div > div > div {
          height: 4px !important;
          min-width: 56px;
          width: 100%;
          position: absolute;
          bottom: 0;
          border-radius: 9999px;
        }
        /* Following menu indicator */
        body.HomeTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(2) > [role="tab"] svg {
          display: none;
        }
      `)
    }

    //#region Desktop-only
    if (desktop) {
      if (settings.navDensity == 'comfortable' || settings.navDensity == 'compact') {
        cssRules.push(`
          header nav > a,
          header nav > div[data-testid="AppTabBar_More_Menu"] {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        `)
      }
      if (settings.navDensity == 'compact') {
        cssRules.push(`
          header nav > a > div,
          header nav > div[data-testid="AppTabBar_More_Menu"] > div {
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        `)
      }
      if (settings.hideSeeNewTweets) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.PRIMARY_COLUMN} > div > div:first-child > div[style^="transform"]`)
      }
      if (settings.hideTimelineTweetBox) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.PRIMARY_COLUMN} .TweetBox`)
      }
      if (settings.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/home"]`)
      }
      if (settings.hideNotifications != 'ignore') {
        // Hide notification badges and indicators
        hideCssSelectors.push(
          // Notifications & Chat in primary nav
          `${Selectors.PRIMARY_NAV_DESKTOP} > :is(a[href^="/notifications"], a[href="/i/chat"]) div[aria-live]`,
          // Account switcher
          'button[data-testid="SideNav_AccountSwitcher_Button"] > div > div[aria-label]',
          // Account switcher accounts
          '[data-testid="HoverCard"] button[data-testid="UserCell"] div[aria-live]',
        )
        if (settings.hideNotifications == 'hide') {
          hideCssSelectors.push(
            // Nav item
            `${Selectors.PRIMARY_NAV_DESKTOP} a[href^="/notifications"]`,
          )
        }
      }
      if (settings.fullWidthContent) {
        cssRules.push(`
          /* Use full width when the sidebar is visible */
          body.Sidebar${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN},
          body.Sidebar${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:last-child {
            max-width: 990px;
          }
          /* Make the "What's happening" input keep its original width */
          body.HomeTimeline ${Selectors.PRIMARY_COLUMN} > div:first-child > div:nth-of-type(3) div[role="progressbar"] + div {
            max-width: 598px;
          }
          /* Use full width when the sidebar is not visible */
          body:not(.Sidebar)${FULL_WIDTH_BODY_PSEUDO} header[role="banner"] {
            flex-grow: 0;
          }
          body:not(.Sidebar)${FULL_WIDTH_BODY_PSEUDO} main[role="main"] > div {
            width: 100%;
          }
          body:not(.Sidebar)${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN} {
            max-width: unset;
            width: 100%;
          }
          body:not(.Sidebar)${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:first-child div,
          body:not(.Sidebar)${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:last-child {
            max-width: unset;
          }
        `)
        if (!settings.fullWidthMedia) {
          // Make media & cards keep their original width
          cssRules.push(`
            body${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN} ${Selectors.TWEET} > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div[id][aria-labelledby]:not(:empty) {
              max-width: 504px;
            }
          `)
        }
        // Hide the sidebar when present
        hideCssSelectors.push(`body.Sidebar${FULL_WIDTH_BODY_PSEUDO} ${Selectors.SIDEBAR}`)
      }
      if (settings.hideAccountSwitcher) {
        cssRules.push(`
          header[role="banner"] > div > div > div > div:last-child {
            flex-shrink: 1 !important;
            align-items: flex-end !important;
          }
        `)
        hideCssSelectors.push(
          '[data-testid="SideNav_AccountSwitcher_Button"] > div:first-child:not(:only-child)',
          '[data-testid="SideNav_AccountSwitcher_Button"] > div:first-child + div',
        )
      }
      if (settings.hideExplorePageContents) {
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.DESKTOP_TIMELINE_HEADER} nav`,
          // Content
          `body.Explore ${Selectors.TIMELINE}`,
        )
      }
      if (settings.hideComposeTweet) {
        hideCssSelectors.push('[data-testid="SideNav_NewTweet_Button"]')
      }
      if (settings.hideConnectNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/i/connect_people"]`)
      }
      if (settings.hideCalls) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/calls"]`)
      }
      if (settings.hideChatNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/i/chat"]`)
      }
      if (settings.hideGrok) {
        hideCssSelectors.push(
          // Nav item
          `${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/i/grok"]`,
          // Grok drawer
          'div[data-testid="GrokDrawer"]',
        )
      }
      if (settings.hideJobs) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/jobs"]`)
      }
      if (settings.hideListsNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/lists"]`)
      }
      if (settings.hideSpacesNav) {
        hideCssSelectors.push(`${menuRole} a[href="/i/spaces/start"]`)
      }
      if (settings.hidePremiumUpsells) {
        hideCssSelectors.push(
          // Nav items
          `${Selectors.PRIMARY_NAV_DESKTOP} a:is([href^="/i/premium"], [href^="/i/verified"])`,
          // Premium link in hovercard
          '[data-testid="HoverCard"] a[href^="/i/premium"]',
        )
        if (!settings.hideSidebarContent) {
          hideCssSelectors.push(
            // Upsell in sidebar
            '.SidebarContents > aside[role="complementary"]:has(a[href^="/i/premium_sign_up"])',
            '.SidebarContents > div:has(aside[role="complementary"] a[href^="/i/premium_sign_up"])',
            '.SidebarContents > div:has(> div > div[data-testid="super-upsell-UpsellCardRenderProperties"])',
          )
        }
      }
      if (settings.hideGrok && !settings.hideSidebarContent) {
        hideCssSelectors.push(
          '.SidebarContents > div:has(> aside[role="complementary"] > a[href^="https://grok.com/imagine"])'
        )
      }
      if (settings.hideSidebarContent) {
        // Only show the first sidebar item by default
        // Re-show subsequent non-algorithmic sections on specific pages
        cssRules.push(`
          .SidebarContents > :is(div, aside):not(:first-child) {
            display: none;
          }
          /* Preserve an empty spacer below the search box */
          .SidebarContents > div:has([data-testid="SearchBox_Search_Input"]) + div:empty,
          body.Community .SidebarContents > div:nth-of-type(3),
          body.Search .SidebarContents > div:nth-of-type(2) {
            display: block;
          }
        `)
        if (settings.showRelevantPeople) {
          cssRules.push(`
            body.Tweet .SidebarContents > div:is(:nth-of-type(2), :nth-of-type(3)) {
              display: block;
            }
          `)
        }
        hideCssSelectors.push(`body.HideSidebar ${Selectors.SIDEBAR}`)
      } else {
        if (settings.hideLiveBroadcasts) {
          hideCssSelectors.push('.LiveBroadcasts')
        }
        if (settings.hideTodaysNews) {
          hideCssSelectors.push('.SidebarContents > div:has(> [data-testid="news_sidebar"])')
        }
        if (settings.hideWhatsHappening) {
          hideCssSelectors.push('.WhatsHappening')
        }
        if (settings.hideSuggestedFollows) {
          hideCssSelectors.push('.SuggestedFollows')
        }
      }
      if (settings.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media modal
          `[aria-modal="true"] div > div:first-of-type [role="group"] > div[style]:not([role]):not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        )
      }
      if (settings.hideSidebarSearch) {
        hideCssSelectors.push(
          `${Selectors.SIDEBAR} form[role="search"]`,
          '.SidebarContents > div:first-of-type:has(form[role="search"])',
        )
        if (settings.hideSidebarContent && !settings.fullWidthContent) {
          let centerBody = `body:not(.Search)${settings.showRelevantPeople ? ':not(.Tweet)' : ''}`
          hideCssSelectors.push(`${centerBody} ${Selectors.SIDEBAR}`)
          cssRules.push(`
            ${centerBody} div:has(> header[role="banner"] + main[role="main"])::after {
              content: "";
              display: block;
              flex: 1 1 0px;
              min-width: 0;
              pointer-events: none;
            }
            ${centerBody} header[role="banner"] {
              flex: 1 1 0px !important;
            }
            ${centerBody} main[role="main"] {
              flex: 0 1 600px !important;
              align-items: center !important;
            }
            ${centerBody} main[role="main"] > div {
              width: 100% !important;
              max-width: 600px !important;
            }
          `)
        }
      }
      if (settings.hideExploreNav) {
        // When configured, hide Explore only when the sidebar is showing, or
        // when on a page full-width content is enabled on.
        if (!(settings.hideExploreNavWithSidebar && settings.hideSidebarSearch)) {
          let bodySelector = `${settings.hideExploreNavWithSidebar ? `body.Sidebar${settings.fullWidthContent ? `:not(${FULL_WIDTH_BODY_PSEUDO})` : ''} ` : ''}`
          hideCssSelectors.push(`${bodySelector}${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`)
        }
      }
      if (settings.hideHistoryNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="${PagePaths.HISTORY}"]`)
      }
      if (settings.hideCommunitiesNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/communities"]`)
      }
      if (settings.hideChatDrawer) {
        cssRules.push(`div[data-testid="chat-drawer-root"] { visibility: hidden; }`)
      }
      if (settings.hideViews) {
        hideCssSelectors.push(
          // Under timeline tweets
          '[data-testid="tweet"][tabindex="0"] [role="group"] > div:has(> a[href$="/analytics"])',
          // In media modal
          '[aria-modal="true"] > div > div:first-of-type [role="group"] > div:has(> a[href$="/analytics"])',
        )
      }
      if (settings.retweets != 'separate' && settings.quoteTweets != 'separate') {
        hideCssSelectors.push('#cpftSeparatedTweetsTab')
      }
    }
    //#endregion

    //#region Mobile only
    if (mobile) {
      if (settings.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`)
      }
      if (settings.hideComposeTweet) {
        hideCssSelectors.push('[data-testid="FloatingActionButtons_Tweet_Button"]')
      }
      if (settings.hideNotifications != 'ignore') {
        // Hide notification badges and indicators
        hideCssSelectors.push(
          // Notifications & Chat in primary nav
          `${Selectors.PRIMARY_NAV_MOBILE} > :is(a[href^="/notifications"], a[href="/i/chat"]) div[aria-label]`,
          // Account switcher
          `button[data-testid="DashButton_ProfileIcon_Link"] div[aria-label]`,
          // Account switcher accounts
          '[role="dialog"] [data-testid^="UserAvatar-Container"] div[dir]',
        )
        if (settings.hideNotifications == 'hide') {
          hideCssSelectors.push(
            // Nav item
            `${Selectors.PRIMARY_NAV_MOBILE} a[href^="/notifications"]`
          )
        }
      }
      if (settings.hideLiveBroadcastBar) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.MOBILE_TIMELINE_HEADER} + div[style^="transform"]`)
        // Reclaim the height reserved for the bar
        cssRules.push(`
          body.HomeTimeline header[role="banner"] > div[style="height: 162px;"] {
            height: 102px !important;
          }
        `)
      }
      if (settings.hideSeeNewTweets) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.MOBILE_TIMELINE_HEADER} ~ div[style^="transform"]:last-child`)
      }
      if (settings.hideExplorePageContents) {
        // Hide explore page contents so we don't get a brief flash of them
        // before automatically switching the page to search mode.
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.MOBILE_TIMELINE_HEADER} > div > div:nth-of-type(2)`,
          // Content
          `body.Explore ${Selectors.TIMELINE}`,
        )
      }
      if (settings.hideCalls) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/i/calls"]`)
      }
      if (settings.hideGrok) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/i/grok"]`)
      }
      if (settings.hideCommunitiesNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href$="/communities"]`)
      }
      if (settings.hideChatNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/i/chat"]`)
      }
      if (settings.hideJobs) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/jobs"]`)
      }
      if (settings.hidePremiumUpsells) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_MOBILE} a[href^="/i/premium"]`,
          `${Selectors.MOBILE_TIMELINE_HEADER} a[href^="/i/premium"]`,
        )
      }
      if (settings.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media viewer and media modal
          `body:is(.MediaViewer, .MobileMedia) [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        )
      }
      if (settings.hideViews) {
        hideCssSelectors.push(
          // Under timeline tweets
          '[data-testid="tweet"][tabindex="0"] [role="group"] > div:has(> a[href$="/analytics"])',
          // In media viewer and media modal
          'body:is(.MediaViewer, .MobileMedia) [role="group"] > div:has(> a[href$="/analytics"])',
        )
      }
    }
    //#endregion

    if (hideCssSelectors.length > 0) {
      cssRules.push(`
        ${hideCssSelectors.join(',\n')} {
          display: none !important;
        }
      `)
    }

    let css = cssRules.map(dedent).join('\n')
    if ($style == null) {
      $style = addStyle(css)
    } else {
      $style.textContent = css
    }
  }
})()

/**
 * CSS which depends on anything we need to get from the page.
 */
const configureDynamicCss = (() => {
  let $style

  return function configureDynamicCss() {
    if (!enabled) {
      log('removing dynamic CSS')
      $style?.remove()
      $style = null
      return
    }

    let cssRules = []

    if (fontSize != null && settings.navBaseFontSize) {
      cssRules.push(`
        /* Regular React Native for Web markup */
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir]:not([aria-live]) span,
        /* New inline style markup */
        ${Selectors.PRIMARY_NAV_DESKTOP} span[style] > span {
          font-size: ${fontSize} !important;
          font-weight: normal !important;
        }
      `)
    }

    if (filterBlurRule != null && settings.unblurSensitiveContent) {
      cssRules.push(`
        ${filterBlurRule.selectorText} {
          filter: none !important;
        }
        ${filterBlurRule.selectorText} + div {
          display: none !important;
        }
      `)
    }

    let css = cssRules.map(dedent).join('\n')
    if ($style == null) {
      $style = addStyle(css)
    } else {
      $style.textContent = css
    }
  }
})()

const configureFeatureFlags = (() => {
  let isTrue
  return function configureFeatureFlags() {
    let props = getTopLevelProps()
    if (!props) return
    let featureSwitches = props?.contextProviderProps?.featureSwitches
    if (!featureSwitches) {
      warn('featureSwitches not found')
      return
    }

    if (!enabled) {
      if (isTrue) {
        log('restoring original featureSwitches')
        featureSwitches.isTrue = isTrue
        isTrue = null
      }
      return
    }

    if (isTrue) return

    isTrue = featureSwitches.isTrue
    featureSwitches.isTrue = (flag) => {
      if (settings.bypassAgeVerification && flag == 'rweb_age_assurance_flow_enabled') return false
      if (settings.disableUsSportFeatures && [
        'responsive_web_mlb_enabled',
        'responsive_web_nba_enabled',
        'responsive_web_ncaafb_enabled',
        'responsive_web_nfl_enabled',
        'responsive_web_nhl_enabled',
      ].includes(flag)) return false
      if (settings.revertMediaCarousel && flag == 'rweb_media_carousel_enabled') return false
      if (settings.revertProfileTabs && flag == 'responsive_web_profile_redesign_enabled') return false
      if (settings.revertTwemoji && flag == 'responsive_web_native_emojis_enabled') return false
      return isTrue(flag)
    }
    log('featureSwitches patched')
  }
})()

function configureFont() {
  if (!fontFamilyRule) {
    warn('no fontFamilyRule found for configureFont to use')
    return
  }

  let hasChirp = fontFamilyRule.style.fontFamily.includes('TwitterChirp')
  if (enabled) {
    if (settings.dontUseChirpFont) {
      if (hasChirp) {
        fontFamilyRule.style.fontFamily = fontFamilyRule.style.fontFamily.replace(/"?TwitterChirp"?, ?/, '')
        log('dontUseChirpFont: disabled Chirp font')
      }
    }
    else if (!hasChirp) {
      fontFamilyRule.style.fontFamily = `"TwitterChirp", ${fontFamilyRule.style.fontFamily}`
      log(`dontUseChirpFont: re-enabled Chirp font`)
    }
  }
  else if (!hasChirp) {
     fontFamilyRule.style.fontFamily = `"TwitterChirp", ${fontFamilyRule.style.fontFamily}`
     log(`re-enabled Chirp font`)
  }
}

/**
 * @param {string[]} cssRules
 * @param {string[]} hideCssSelectors
 */
function configureHideMetricsCss(cssRules, hideCssSelectors) {
  if (settings.hideFollowingMetrics) {
    // User profile hover card and page metrics
    hideCssSelectors.push(
      ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/verified_followers"]) > span:first-child'
    )
    // Fix display of whitespace after hidden metrics
    cssRules.push(
      ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/verified_followers"]) { white-space: pre-line; }'
    )
  }

  if (settings.hideProfileHeaderMetrics) {
    // Metrics under username header on profile pages
    hideCssSelectors.push(`
      body.Profile ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 + div[dir]
    `)
  }

  let timelineMetricSelectors = [
    settings.hideReplyMetrics   && '[data-testid="reply"]',
    settings.hideRetweetMetrics && '[data-testid$="retweet"]',
    settings.hideLikeMetrics    && '[data-testid$="like"]',
    settings.hideBookmarkMetrics && '[data-testid$="bookmark"], [data-testid$="removeBookmark"]',
  ].filter(Boolean).join(', ')

  if (timelineMetricSelectors) {
    cssRules.push(
      `[role="group"] button:is(${timelineMetricSelectors}) span { visibility: hidden; }`
    )
  }

  if (settings.hideQuoteTweetMetrics) {
    hideCssSelectors.push('#cpftQuoteTweetCount')
  }
  if (settings.hideRetweetMetrics) {
    hideCssSelectors.push('#cpftRetweetCount')
  }
  if (settings.hideLikeMetrics) {
    hideCssSelectors.push('#cpftLikeCount')
  }
}

const configureThemeCss = (() => {
  let $style

  return function configureThemeCss() {
    if (!enabled) {
      log('removing theme stylesheet')
      $style?.remove()
      $style = null
      return
    }

    let customTheme = pro ? settings.customTheme : ''
    let cssRules = []

    cssRules.push(`
      body {
        --cpft-theme-primary: ${customTheme || nativePalette.primary};
        --cpft-theme-accent: ${nativePalette.accent};
        --cpft-theme-hover: ${nativePalette.hover};
      }
    `)
    if (pro) {
      cssRules.push(`
        .cpft_swatch {
          cursor: pointer;
        }
        .cpft_swatch[hidden] {
          position: relative;
          display: flex;
          align-items: center;
        }
        .cpft_swatch > label {
          width: 45px;
          height: 45px;
          border-radius: 9999px;
        }
        .cpft_swatch > label > svg {
          width: 45px;
          height: 45px;
        }
        .cpft_swatch > label > svg circle {
          ${customTheme && `fill: ${customTheme} !important;`}
        }
        .cpft_swatch > label > input {
          display: none;
        }
        .cpft_swatch > div {
          position: absolute;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .cpft_swatch > div > svg {
          width: 25px;
          height: 25px;
          color: #fff;
          fill: currentcolor;
        }
      `)
    }
    if (customTheme) {
      cssRules.push(`
        body {
          --cpft-theme-accent: color-mix(in srgb, var(--cpft-theme-primary) 60%, white);
          --cpft-theme-hover: color-mix(in srgb, var(--cpft-theme-primary) 80%, black);
        }
        body.HighContrast.Default {
          --cpft-theme-accent: color-mix(in srgb, var(--cpft-theme-primary) 30%, white);
          --cpft-theme-hover: color-mix(in srgb, var(--cpft-theme-primary) 75%, black);
        }
        body.HighContrast.LightsOut {
          --cpft-theme-accent: color-mix(in srgb, var(--cpft-theme-primary) 80%, black);
          --cpft-theme-hover: color-mix(in srgb, var(--cpft-theme-primary) 80%, black);
        }
        /* Hide the active native swatch tick */
        .DisplaySwatches > div > div {
          display: none;
        }
        /* Apply custom theme */
        [style*="background-color: ${nativePalette.primary}"]:not(.UseNativeTheme):where(:not(${Selectors.TWEET_ACTIONS} *)) {
          background-color: var(--cpft-theme-primary) !important;
        }
        [style*="background-color: ${nativePalette.hover}"]:not(.UseNativeTheme):where(:not(${Selectors.TWEET_ACTIONS} *)) {
          background-color: var(--cpft-theme-hover) !important;
        }
        [style*="border-color: ${nativePalette.primary}"]:not(.UseNativeTheme) {
          border-color: var(--cpft-theme-primary) !important;
        }
        [style*="color: ${nativePalette.primary}"]:not(.UseNativeTheme):where(:not(svg, ${Selectors.TWEET_ACTIONS} *)) {
          color: var(--cpft-theme-primary) !important;
        }
        /* Spinner */
        [style*="stroke: ${nativePalette.primary}"] {
          stroke: var(--cpft-theme-primary) !important;
        }
        /* Slider track */
        div[style="height: 20px; width: 40px;"] > div:first-child,
        /* Settings font size slider track */
        div[style="background-color: ${nativePalette.accent};"]:where(:not(${Selectors.TWEET_ACTIONS} *)) {
          background-color: var(--cpft-theme-accent) !important;
        }
        /* Tweet length circle in editor */
        [data-testid="countdown-circle"] circle[stroke-dasharray] {
          stroke: var(--cpft-theme-primary) !important;
        }
      `)
      // Preserve rule order when applying theme overrides
      for (let rule of reactNativeStylesheet?.cssRules || []) {
        let override = themeRules.get(rule)
        if (override) cssRules.push(override)
      }
    }

    if (debug) {
      cssRules.push(`
        [data-item-type]::after {
          position: absolute;
          top: 0;
          ${ltr ? 'right': 'left'}: 50px;
          content: attr(data-item-type);
          font-family: ${fontFamilyRule?.style.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial'};
          background-color: rgb(242, 29, 29);
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 4px 6px;
          border-bottom-left-radius: 1em;
          border-bottom-right-radius: 1em;
        }
      `)
    }

    // Active tab colour for custom tabs
    if (shouldShowSeparatedTweetsTab()) {
      cssRules.push(`
        body.SeparatedTweets #cpftSeparatedTweetsTab > [role="tab"] > div > div > div {
          background-color: var(--cpft-theme-primary) !important;
        }
      `)
    }

    if (settings.revertXBranding) {
      cssRules.push(`
        ${Selectors.X_LOGO_PATH}, ${Selectors.X_DARUMA_LOGO_PATH} {
          fill: ${THEME_BLUE};
          d: path("${Svgs.TWITTER_LOGO_PATH}");
        }
        .cpft_logo {
          fill: ${THEME_BLUE};
        }
        svg path[d="${Svgs.X_HOME_ACTIVE_PATH}"] {
          d: path("${Svgs.TWITTER_HOME_ACTIVE_PATH}");
        }
        svg path[d="${Svgs.X_HOME_INACTIVE_PATH}"] {
          d: path("${Svgs.TWITTER_HOME_INACTIVE_PATH}");
        }
        /* Replace the edit icon in the Tweet button with the feather */
        :is([data-testid="SideNav_NewTweet_Button"], [data-testid="FloatingActionButtons_Tweet_Button"]) {
          path[d="${Svgs.PLUS_PATH}"] {
            d: path("${Svgs.TWITTER_FEATHER_PLUS_PATH}");
          }
          path[clip-rule="evenodd"] {
            display: none;
          }
        }
        /* Restore theme to Tweet composer icons */
        [data-testid="toolBar"] [role="tablist"] > [role="presentation"],
        [data-testid="toolBar"] [role="tablist"] > [role="presentation"] * {
          filter: none !important;
        }
        [data-testid="toolBar"] [role="tablist"] > [role="presentation"] svg {
          fill: var(--cpft-theme-primary);
        }
      `)
      if (desktop) {
        // Revert the Tweet buttons being made monochrome
        cssRules.push(`
          [data-testid="SideNav_NewTweet_Button"],
          [data-testid="tweetButtonInline"],
          [data-testid="tweetButton"] {
            background-color: var(--cpft-theme-primary) !important;
          }
          [data-testid="SideNav_NewTweet_Button"]:hover,
          [data-testid="tweetButtonInline"]:hover:not(:disabled),
          [data-testid="tweetButton"]:hover:not(:disabled) {
            background-color: var(--cpft-theme-hover) !important;
          }
          body:is(.LightsOut):not(.HighContrast) [data-testid="SideNav_NewTweet_Button"] > div,
          body:is(.LightsOut):not(.HighContrast) [data-testid="tweetButtonInline"] > div,
          body:is(.LightsOut):not(.HighContrast) [data-testid="tweetButton"] > div,
          body:is(.LightsOut):not(.HighContrast) [data-testid="SideNav_NewTweet_Button"] > div > svg {
            color: rgb(255, 255, 255) !important;
          }
        `)
      }
    }

    if (settings.uninvertFollowButtons) {
      let themed = settings.revertXBranding && settings.themeFollowButtons
      // Shared styles for Following and Follow buttons
      cssRules.push(`
        [role="button"][data-testid$="-unfollow"]:not(:hover) {
          border-color: rgba(0, 0, 0, 0) !important;
        }
        [role="button"][data-testid$="-follow"] {
          background-color: rgba(0, 0, 0, 0) !important;
        }
      `)
      if (!themed) {
        cssRules.push(`
          /* Following button */
          body.Default [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: rgb(15, 20, 25) !important;
          }
          body.Default [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          body:is(.LightsOut) [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: rgb(255, 255, 255) !important;
          }
          body:is(.LightsOut) [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(15, 20, 25) !important;
          }
          /* Follow button */
          body.Default [role="button"][data-testid$="-follow"] {
            border-color: rgb(207, 217, 222) !important;
          }
          body:is(.LightsOut) [role="button"][data-testid$="-follow"] {
            border-color: rgb(83, 100, 113) !important;
          }
          body.Default [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: rgb(15, 20, 25) !important;
          }
          body:is(.LightsOut) [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          body.Default [role="button"][data-testid$="-follow"]:hover {
            background-color: rgba(15, 20, 25, 0.1) !important;
          }
          body:is(.LightsOut) [role="button"][data-testid$="-follow"]:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        `)
      }
      if (themed) {
        cssRules.push(`
          /* Following button */
          [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: var(--cpft-theme-primary) !important;
          }
          [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          /* Follow button */
          [role="button"][data-testid$="-follow"] {
            border-color: var(--cpft-theme-primary) !important;
          }
          [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: var(--cpft-theme-primary) !important;
          }
          [role="button"][data-testid$="-follow"]:hover {
            background-color: var(--cpft-theme-primary) !important;
          }
          [role="button"][data-testid$="-follow"]:hover > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
        `)
      }
      if (mobile) {
        cssRules.push(`
          body.MediaViewer [role="button"][data-testid$="follow"] {
            border: none !important;
            background: transparent !important;
          }
          body.MediaViewer [role="button"][data-testid$="follow"] > div {
            color: ${themed ? 'var(--cpft-theme-primary)' : 'rgb(255, 255, 255)'} !important;
          }
        `)
      }
    }

    let css = cssRules.map(dedent).join('\n')
    if ($style == null) {
      $style = addStyle(css)
    } else {
      $style.textContent = css
    }
    styleEmbed.update()
  }
})()
//#endregion

//#region Tweak functions
async function addAccountLocationToFocusedTweet($permalinkBar, screenName) {
  if (!settings.addFocusedTweetAccountLocation) return
  if ($permalinkBar.hasAttribute('cpft-account-location-added')) return
  if (!screenName) return
  let accountLocation = await getAccountLocation(screenName)
  if (!accountLocation || !accountLocation.account_based_in) return
  let $separator = document.createElement('span')
  $separator.className = 'AccountLocation cpft_separator cpft_text'
  $separator.setAttribute('aria-hidden', 'true')
  $separator.setAttribute('hidden', '')
  $separator.textContent = '·'
  let $locationLabel = document.createElement('span')
  $locationLabel.className = 'AccountLocation cpft_text'
  $locationLabel.setAttribute('hidden', '')
  $locationLabel.textContent = addQuestionMark(accountLocation.account_based_in, !accountLocation.location_accurate)
  $permalinkBar.append($separator, $locationLabel)
  $permalinkBar.setAttribute('cpft-account-location-added', '')
}

function addCaretMenuListenerForQuoteTweet($tweet) {
  let $caret = /** @type {HTMLElement} */ ($tweet.querySelector('[data-testid="caret"]'))
  if ($caret && !$caret.dataset.cpftListener) {
    $caret.addEventListener('click', () => {
      quotedTweet = getQuotedTweetDetails($tweet, {getText: true})
    })
    $caret.dataset.cpftListener = 'true'
  }
}

/**
 * @param {HTMLElement} $blockMenuItem
 */
async function addMuteQuotesMenuItems($blockMenuItem) {
  log('mutableQuoteTweets: adding "Mute this conversation" and "Turn off Quote Tweets" menu item')

  // Wait for the menu to render properly on desktop
  if (desktop) {
    $blockMenuItem = await getElement(`:scope > div > div > div > ${Selectors.BLOCK_MENU_ITEM}`, {
      context: $blockMenuItem.parentElement,
      name: 'rendered block menu item',
      timeout: 250,
    })
    if (!$blockMenuItem) return
  }

  let $muteQuotes = /** @type {HTMLElement} */ ($blockMenuItem.previousElementSibling.cloneNode(true))
  $muteQuotes.classList.add('cpft_menu_item')
  $muteQuotes.querySelector('span').textContent = getString('MUTE_THIS_CONVERSATION')
  $muteQuotes.addEventListener('click', (e) => {
    e.preventDefault()
    log('mutableQuoteTweets: muting quotes of a tweet', quotedTweet)
    settings.mutedQuotes = settings.mutedQuotes.concat(quotedTweet)
    storeConfigChanges({settings: {mutedQuotes: settings.mutedQuotes}})
    processCurrentPage()
    // Dismiss the menu
    let $menuLayer = /** @type {HTMLElement} */ ($blockMenuItem.closest('[role="group"]')?.firstElementChild?.firstElementChild)
    if (!$menuLayer) {
      warn('mutableQuoteTweets: could not find menu layer to dismiss menu')
    }
    $menuLayer?.click()
  })

  if (quotedTweet?.quotedBy) {
    let $toggleQuotes = /** @type {HTMLElement} */ ($blockMenuItem.previousElementSibling.cloneNode(true))
    $toggleQuotes.classList.add('cpft_menu_item')
    $toggleQuotes.querySelector('span').textContent = getString(`TURN_OFF_QUOTE_TWEETS`)
    $toggleQuotes.querySelector('svg').innerHTML = Svgs.RETWEETS_OFF
    $toggleQuotes.addEventListener('click', (e) => {
      e.preventDefault()
      log('mutableQuoteTweets: toggling quotes from', quotedTweet.quotedBy)
      if (settings.hideQuotesFrom.includes(quotedTweet.quotedBy)) {
        settings.hideQuotesFrom = settings.hideQuotesFrom.filter(user => user != quotedTweet.quotedBy)
      } else {
        settings.hideQuotesFrom = settings.hideQuotesFrom.concat(quotedTweet.quotedBy)
      }
      storeConfigChanges({settings: {hideQuotesFrom: settings.hideQuotesFrom}})
      processCurrentPage()
      // Dismiss the menu
      let $menuLayer = /** @type {HTMLElement} */ ($blockMenuItem.closest('[role="group"]')?.firstElementChild?.firstElementChild)
      if (!$menuLayer) {
        warn('mutableQuoteTweets: could not find menu layer to dismiss menu')
      }
      $menuLayer?.click()
    })
    $blockMenuItem.insertAdjacentElement('beforebegin', $toggleQuotes)
  } else {
    warn('mutableQuoteTweets: quotedBy not available when Tweet menu was opened')
  }

  $blockMenuItem.insertAdjacentElement('beforebegin', $muteQuotes)
}

/**
 * Add an "Add muted word" menu item after the given link which takes you
 * straight to entering a new muted word (by clicking its way through all the
 * individual screens!).
 * @param {HTMLElement} $link
 * @param {string} linkSelector
 */
async function addAddMutedWordMenuItem($link, linkSelector) {
  log('addAddMutedWordMenuItem: adding "Add muted word" menu item')

  // Wait for the dropdown to appear on desktop
  if (desktop) {
    $link = await getElement(`#layers div[data-testid="Dropdown"] ${linkSelector}`, {
      name: 'rendered menu item (addAddMutedWordMenuItem)',
      timeout: 100,
    })
    if (!$link) return
  }

  let $addMutedWord = /** @type {HTMLElement} */ ($link.parentElement.cloneNode(true))
  $addMutedWord.classList.add('cpft_menu_item')
  $addMutedWord.querySelector('a').href = PagePaths.ADD_MUTED_WORD
  $addMutedWord.querySelector('span').textContent = getString('ADD_MUTED_WORD')
  $addMutedWord.querySelector('svg').innerHTML = Svgs.MUTE
  $addMutedWord.addEventListener('click', (e) => {
    e.preventDefault()
    History_push?.({
      pathname: PagePaths.ADD_MUTED_WORD,
      hash: '',
      query: {},
      search: '',
    })
    if (desktop) {
      // Dismiss the menu
      let $menuLayer = /** @type {HTMLElement} */ ($link.closest('[role="group"]')?.firstElementChild?.firstElementChild)
      if (!$menuLayer) {
        warn('addAddMutedWordMenuItem: could not find menu layer to dismiss menu')
      }
      $menuLayer?.click()
    }
  })
  $link.parentElement.insertAdjacentElement('beforebegin', $addMutedWord)
}

/**
 * Add a "Turn on/off Retweets" menu item to a List's menu.
 * @param {HTMLElement} $switchMenuItem
 */
async function addToggleListRetweetsMenuItem($switchMenuItem) {
  log('adding "Turn on/off Retweets" menu item')

  // Wait for the menu to render properly on desktop
  if (desktop) {
    $switchMenuItem = await getElement(':scope > div > div > div > [role="menuitem"]', {
      context: $switchMenuItem.parentElement,
      name: 'rendered switch menu item',
      timeout: 100,
    })
    if (!$switchMenuItem) return
  }

  let $toggleRetweets = /** @type {HTMLElement} */ ($switchMenuItem.cloneNode(true))
  $toggleRetweets.classList.add('cpft_menu_item')
  $toggleRetweets.querySelector('span').textContent = getString(`TURN_${!settings.hideListRetweets ? 'OFF' : 'ON'}_RETWEETS`)
  $toggleRetweets.querySelector('svg').innerHTML = !settings.hideListRetweets ? Svgs.RETWEETS_OFF : Svgs.RETWEET
  // Remove subtitle if the cloned menu item has one
  $toggleRetweets.querySelector('div[dir] + div[dir]')?.remove()
  $toggleRetweets.addEventListener('click', (e) => {
    e.preventDefault()
    log('toggling list retweets')
    settings.hideListRetweets = !settings.hideListRetweets
    storeConfigChanges({settings: {hideListRetweets: settings.hideListRetweets}})
    processCurrentPage()
    // Dismiss the menu
    let $menuLayer = /** @type {HTMLElement} */ ($switchMenuItem.closest('[role="group"]')?.firstElementChild?.firstElementChild)
    if (!$menuLayer) {
      log('could not find menu layer to dismiss menu')
    }
    $menuLayer?.click()
  })

  $switchMenuItem.insertAdjacentElement('beforebegin', $toggleRetweets)
}

/**
 * Redirects away from the Home timeline if we're on it and it's been disabled.
 * @returns {boolean} `true` if redirected as a result of this call
 */
function checkForDisabledHomeTimeline() {
  if (settings.disableHomeTimeline && location.pathname == PagePaths.HOME) {
    log(`Home timeline disabled, redirecting to /${settings.disabledHomeTimelineRedirect}`)
    let primaryNavSelector = desktop ? Selectors.PRIMARY_NAV_DESKTOP : Selectors.PRIMARY_NAV_MOBILE
    void (async () => {
      let $navLink = await getElement(`${primaryNavSelector} a[href="/${settings.disabledHomeTimelineRedirect}"]`, {
        name: `${settings.disabledHomeTimelineRedirect} nav link`,
        stopIf: () => location.pathname != PagePaths.HOME,
      })
      if (!$navLink) return
      $navLink.click()
    })()
    return true
  }
}

/**
 * Configures – or re-configures – the separated tweets timeline title.
 *
 * If we're currently on the separated tweets timeline and…
 * - …its title has changed, the page title will be changed to "navigate" to it.
 * - …the separated tweets timeline is no longer needed, we'll change the page
 *   title to "navigate" back to the Home timeline.
 *
 * @returns {boolean} `true` if "navigation" was triggered by this call
 */
function configureSeparatedTweetsTimelineTitle() {
  let wasOnSeparatedTweetsTimeline = isOnSeparatedTweetsTimeline()
  let previousTitle = separatedTweetsTimelineTitle

  if (settings.retweets == 'separate' && settings.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = getString(settings.revertXBranding ? 'SHARED_TWEETS' : 'SHARED')
  } else if (settings.retweets == 'separate') {
    separatedTweetsTimelineTitle = getString(settings.revertXBranding ? 'RETWEETS' : 'REPOSTS')
  } else if (settings.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = getString(settings.revertXBranding ? 'QUOTE_TWEETS' : 'QUOTES')
  } else {
    separatedTweetsTimelineTitle = null
  }

  let titleChanged = previousTitle != separatedTweetsTimelineTitle
  if (wasOnSeparatedTweetsTimeline) {
    if (separatedTweetsTimelineTitle == null) {
      log('moving from separated tweets timeline to Home timeline after config change')
      setTitle(getString('HOME'))
      return true
    }
    if (titleChanged) {
      log('applying new separated tweets timeline title after config change')
      setTitle(separatedTweetsTimelineTitle)
      return true
    }
  } else {
    if (titleChanged && previousTitle != null && lastHomeTimelineTitle == previousTitle) {
      log('updating lastHomeTimelineTitle with new separated tweets timeline title')
      lastHomeTimelineTitle = separatedTweetsTimelineTitle
    }
  }
}

function getColorScheme() {
  return {
    'rgb(255, 255, 255)': 'Default',
    'rgb(0, 0, 0)': 'LightsOut',
    // High contrast
    'rgb(5, 5, 5)': 'LightsOut',
  }[$body.style.backgroundColor]
}

/**
 * @param {HTMLElement} $tweet
 * @param {{getText?: boolean}} [options]
 * @returns {import("./types").QuotedTweet}
 */
 function getQuotedTweetDetails($tweet, options = {}) {
  let {getText = false} = options
  let $quotedByLink = /** @type {HTMLAnchorElement} */ ($tweet.querySelector('[data-testid="User-Name"] a'))
  let $quotedTweet = $tweet.querySelector('div[id^="id__"] > div[dir] > span').parentElement.nextElementSibling
  let $userName = $quotedTweet?.querySelector('[data-testid="User-Name"]')
  let quotedBy = $quotedByLink?.pathname?.substring(1)
  let user = $userName?.querySelector('[tabindex="-1"]')?.textContent
  let time = $userName?.querySelector('time')?.dateTime
  if (!getText) return {quotedBy, user, time}

  let $heading = $quotedTweet?.querySelector(':scope > div > div:first-child')
  let $qtText = $heading?.nextElementSibling?.querySelector('[lang]')
  let text = $qtText && Array.from($qtText.childNodes, node => {
    if (node.nodeType == 1) {
      if (node.nodeName == 'IMG') return /** @type {HTMLImageElement} */ (node).alt
      return node.textContent
    }
    return node.nodeValue
  }).join('')
  return {quotedBy, user, time, text}
}

/**
 * Attempts to determine the type of a timeline Tweet given the element with
 * data-testid="tweet" on it, falling back to TWEET if it doesn't appear to be
 * one of the particular types we care about.
 * @param {HTMLElement} $tweet
 * @param {boolean} [checkSocialContext]
 * @returns {import("./types").TweetType}
 */
function getTweetType($tweet, checkSocialContext = false) {
  if ($tweet.closest(Selectors.PROMOTED_TWEET_CONTAINER)) {
    return 'PROMOTED_TWEET'
  }
  if ($tweet.querySelector('[data-testid="socialContext"]')) {
    // Assume social context tweets are Retweets if we're not checking
    if (checkSocialContext) {
      let svgPath = $tweet.querySelector('svg path')?.getAttribute('d') ?? ''
      if (svgPath.startsWith('M7.471 21H.472l.029-1.027c.184')) return 'COMMUNITY_TWEET'
      if (svgPath.startsWith('M13 21l-1 2-1-2v-5H4.5v-2.287l')) return 'PINNED_TWEET'
    }
    // Quoted tweets from accounts you blocked or muted are displayed as an
    // <article> with "This Tweet is unavailable."
    if ($tweet.querySelector('article')) {
      return 'UNAVAILABLE_RETWEET'
    }
    // Quoted tweets are preceded by visually-hidden "Quote" text
    if ($tweet.querySelector('div[id^="id__"] > div[dir] > span')?.textContent.includes(getString('QUOTE'))) {
      return 'RETWEETED_QUOTE_TWEET'
    }
    return 'RETWEET'
  }
  // Quoted tweets are preceded by visually-hidden "Quote" text
  if ($tweet.querySelector('div[id^="id__"] > div[dir] > span')?.textContent.includes(getString('QUOTE'))) {
    return 'QUOTE_TWEET'
  }
  // Quoted tweets from accounts you blocked or muted are displayed as an
  // <article> with "This Tweet is unavailable."
  if ($tweet.querySelector('article')) {
    return 'UNAVAILABLE_QUOTE_TWEET'
  }
  return 'TWEET'
}

/** @param {HTMLElement} $tweet */
function shouldHideContentDisclosure($tweet) {
  if (!settings.hideAiTweets && !settings.hidePaidPartnerships) return false
  let $time = $tweet.querySelector('a[href*="/status/"]:has(time)')
  let match = /^\/([a-zA-Z\d_]{1,20})\/status\/(\d+)/.exec($time?.getAttribute('href') || '')
  let id = match?.[2]
  if (!id) return false
  // Exclude the user's own Tweets
  if (match[1].toLowerCase() == getUserScreenName()?.toLowerCase()) return false
  let disclosure = getTweetInfo(id)?.content_disclosure
  return Boolean(settings.hidePaidPartnerships && disclosure?.advertising_disclosure?.is_paid_promotion === true ||
    settings.hideAiTweets && disclosure?.ai_generated_disclosure?.has_ai_generated_media === true)
}

// Add 1 every time this gets broken: 6
function getVerifiedProps($svg) {
  let propsGetter = (props) => props?.children?.props?.children?.[0]?.[0]?.props
  let $parent = $svg.parentElement.parentElement
  // Verified badge button on the profile screen
  if (isOnProfilePage() && $svg.parentElement.getAttribute('role') == 'button') {
    $parent = $svg.closest('span').parentElement
  }
  // Link variant in "user followed/liked/retweeted" notifications
  else if (isOnNotificationsPage() && $parent.getAttribute('role') == 'link') {
    propsGetter = (props) => {
      let linkChildren = props?.children?.props?.children?.[0]
      return linkChildren?.[linkChildren.length - 1]?.props
    }
  }
  if ($parent.wrappedJSObject) {
    $parent = $parent.wrappedJSObject
  }
  let reactPropsKey = Object.keys($parent).find(key => key.startsWith('__reactProps$'))
  let props = propsGetter($parent[reactPropsKey])
  if (!props) {
    warn('React props not found for', $svg)
  }
  else if (!('isBlueVerified' in props)) {
    warn('isBlueVerified not in React props for', $svg, {props})
  }
  return props
}

/**
 * @returns {import("./types").VerifiedType}
 */
function getVerifiedType($svg) {
  let props = getVerifiedProps($svg)
  if (props) {
    if (props.affiliateBadgeInfo?.userLabelType == 'BusinessLabel' &&
        props.affiliateBadgeInfo?.description == 'X')
      // Ignore Twitter associated checks
      return null
    if (props.verifiedType == 'Business')
      return 'BUSINESS'
    if (props.verifiedType == 'Government')
      return 'GOVERNMENT'
    if (props.isBlueVerified)
      return 'BLUE'
  }
  return null
}

/**
 * @param {HTMLElement} $popup
 * @returns {{tookAction: boolean, onPopupClosed?: () => void}}
 */
function handlePopup($popup) {
  let result = {tookAction: false, onPopupClosed: null}

  // Automatically close the Premium sign up popup
  if (desktop && settings.hidePremiumUpsells && location.pathname === '/i/premium_sign_up') {
    tweakPremiumSignUpPage()
    result.tookAction = true
    return result
  }

  // Automatically close any sheet dialog which contains a Premium link
  if (desktop && settings.hidePremiumUpsells &&
      $popup.querySelector('[data-testid="mask"]') &&
      $popup.querySelector('[data-testid="sheetDialog"]') &&
      $popup.querySelector('a[href^="/i/premium"]')) {
    log('hidePremiumUpsells: automatically closing Premium upsell dialog')
    let mask = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="mask"]'))
    mask.click()
    result.tookAction = true
    return result
  }

  if (desktop && settings.hideEditImage && location.pathname == PagePaths.PROFILE_SETTINGS) {
    log('hideEditImage: profile settings opened')
    tweakProfileSettingsPage()
    result.tookAction = true
    return result
  }

  if (isOnHomeTimelinePage() &&
      settings.defaultFollowingToRecent &&
      !settings.hideFollowingMenu &&
      !userSortedFollowing &&
      $popup.innerHTML.includes(`>${getString('SORT_BY')}<`)) {
    // Pinned Communities also have a Sort by menu, which we should ignore
    let isFollowingTabSelected = Boolean(document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(2) > [role="tab"][aria-selected="true"]`))
    if (!isFollowingTabSelected) return result

    log('sortFollowing: Following Sort by menu opened')
    void (async () => {
      // The Following Sort by menu is hydrated asynchronously on desktop
      let $dropdown = await getElement(mobile ? '[data-testid="sheetDialog"]' : '[role="menu"] [data-testid="Dropdown"]', {
        name: 'Rendered Following Sort by dropdown',
        context: $popup,
      })
      let $menuItems =  /** @type {NodeListOf<HTMLElement>} */ ($dropdown.querySelectorAll('div[role="menuitem"]'))
      let $selectedSvg = $popup.querySelector('div[role="menuitem"] svg')
      for (let [index, $menuItem] of $menuItems.entries()) {
        let shouldBeSelected = index == 1
        if (shouldBeSelected) {
          $menuItem.lastElementChild.append($selectedSvg)
        }
        $menuItem.addEventListener('click', () => {
          userSortedFollowing = true
        })
      }
    })()
    result.tookAction = true
    return result
  }

  if (isOnIndividualTweetPage() &&
      settings.sortReplies != 'relevant' &&
      !userSortedReplies &&
      $popup.innerHTML.includes(`>${getString('SORT_REPLIES')}<`)) {
    log('sortReplies: Sort replies menu opened')
    void (async () => {
      // The Sort replies menu is hydrated asynchronously
      let $dropdown = await getElement('[role="menu"] [data-testid="Dropdown"]', {
        name: 'Rendered Sort replies dropdown',
        context: $popup,
      })
      let $menuItems =  /** @type {NodeListOf<HTMLElement>} */ ($dropdown.querySelectorAll('div[role="menuitem"]'))
      let $selectedSvg = $popup.querySelector('div[role="menuitem"] svg')
      for (let [index, $menuItem] of $menuItems.entries()) {
        let shouldBeSelected = index == {recent: 1, liked: 2}[settings.sortReplies]
        if (shouldBeSelected) {
          $menuItem.lastElementChild.append($selectedSvg)
        }
        $menuItem.addEventListener('click', () => {
          userSortedReplies = true
        })
      }
    })()
    result.tookAction = true
    return result
  }

  if (desktop && !isDesktopComposeTweetModalOpen &&
      location.pathname.startsWith(PagePaths.COMPOSE_TWEET)) {
    log('Compose Tweet modal opened')
    isDesktopComposeTweetModalOpen = true
    $desktopComposeTweetModalPopup = $popup
    observeDesktopComposeTweetModal($popup)
    return {
      tookAction: true,
      onPopupClosed() {
        log('Compose Tweet modal closed')
        isDesktopComposeTweetModalOpen = false
        $desktopComposeTweetModalPopup = null
        disconnectObservers(modalObservers, 'modal')
        // The Tweet button will re-render if the modal was opened to edit
        // multiple Tweets on the Home timeline.
        if (settings.revertXBranding && isOnHomeTimelinePage()) {
          tweakTweetButton()
        }
      }
    }
  }

  if (desktop && !isDesktopMediaModalOpen &&
      URL_MEDIA_RE.test(location.pathname)) {
    log('media modal opened')
    isDesktopMediaModalOpen = true
    observeDesktopModalTimeline($popup)
    return {
      tookAction: true,
      onPopupClosed() {
        log('media modal closed')
        isDesktopMediaModalOpen = false
        disconnectObservers(modalObservers, 'modal')
      }
    }
  }

  if (settings.revertXBranding) {
    let $retweetDropdownItem = $popup.querySelector('div:is([data-testid="retweetConfirm"], [data-testid="repostConfirm"])')
    if ($retweetDropdownItem) {
      tweakRetweetDropdown($retweetDropdownItem, 'div:is([data-testid="retweetConfirm"], [data-testid="repostConfirm"])', 'RETWEET')
      return {tookAction: true}
    }

    let $unretweetDropdownItem = $popup.querySelector('div:is([data-testid="unretweetConfirm"], [data-testid="unrepostConfirm"])')
    if ($unretweetDropdownItem) {
      tweakRetweetDropdown($unretweetDropdownItem, 'div:is([data-testid="unretweetConfirm"], [data-testid="unrepostConfirm"])', 'UNDO_RETWEET')
      return {tookAction: true}
    }

    let $hoverLabel = $popup.querySelector('span[data-testid="HoverLabel"] > span')
    if ($hoverLabel?.textContent == getString('REPOST')) {
      $hoverLabel.textContent = getString('RETWEET')
    }
  }

  if (isOnListPage()) {
    let $switchSvg = $popup.querySelector(`svg path[d="M3 2h18.61l-3.5 7 3.5 7H5v6H3V2zm2 12h13.38l-2.5-5 2.5-5H5v10z"]`)
    if ($switchSvg) {
      addToggleListRetweetsMenuItem($popup.querySelector(`[role="menuitem"]`))
      return {tookAction: true}
    }
  }

  if (settings.mutableQuoteTweets) {
    if (quotedTweet) {
      let $blockMenuItem = /** @type {HTMLElement} */ ($popup.querySelector(Selectors.BLOCK_MENU_ITEM))
      if ($blockMenuItem) {
        addMuteQuotesMenuItems($blockMenuItem)
        result.tookAction = true
        // Clear the quoted tweet when the popup closes
        result.onPopupClosed = () => {
          quotedTweet = null
        }
      } else {
        quotedTweet = null
      }
    }
  }

  if (settings.fastBlock) {
    if (blockMenuItemSeen && blockMenuItemClicked && $popup.querySelector('[data-testid="confirmationSheetConfirm"]')) {
      log('fastBlock: fast blocking')
      ;/** @type {HTMLElement} */ ($popup.querySelector('[data-testid="confirmationSheetConfirm"]')).click()
      blockMenuItemSeen = false
      blockMenuItemClicked = false
      result.tookAction = true
    }
    else if ($popup.querySelector(Selectors.BLOCK_MENU_ITEM)) {
      log('fastBlock: preparing for fast blocking')
      blockMenuItemSeen = true
      blockMenuItemClicked = false
      document.addEventListener('click', (e) => {
        if (e.target instanceof Element && e.target.closest(Selectors.BLOCK_MENU_ITEM)) {
          log('fastBlock: block clicked')
          blockMenuItemClicked = true
        }
      }, {capture: true, once: true})
      // Create a nested observer for mobile, as it reuses the menu popup to
      // display the block dialog.
      result.tookAction = !mobile
    }
    else {
      blockMenuItemSeen = false
      blockMenuItemClicked = false
    }
  }

  if (mobile) {
    let $sidebarSettingsLink = $popup.querySelector('a[href$="/settings"]')
    if ($sidebarSettingsLink) {
      getElement('div:has(> a[href^="https://apps.apple.com/app/apple-store/id333903271"])', {
        name: 'get the app link',
        context: $popup,
        timeout: 100,
      }).then($appAd => $appAd?.classList?.add('HiddenAd'))
    }
  }

  if (settings.addAddMutedWordMenuItem) {
    let linkSelector = 'a[href$="/settings"]'
    let $link = /** @type {HTMLElement} */ ($popup.querySelector(linkSelector))
    if ($link) {
      addAddMutedWordMenuItem($link, linkSelector)
      result.tookAction = true
    }
  }

  if (settings.premiumBlueChecks != 'ignore') {
    // User typeahead dropdown
    let $typeaheadDropdown = /** @type {HTMLElement} */ ($popup.querySelector('div[id^="typeaheadDropdown"]'))
    if ($typeaheadDropdown) {
      log('typeahead dropdown appeared')
      let observer = observeElement($typeaheadDropdown, () => {
        processBlueChecks($typeaheadDropdown)
      }, 'popup typeahead dropdown')
      return {
        tookAction: true,
        onPopupClosed() {
          log('typeahead dropdown closed')
          observer.disconnect()
        }
      }
    }
  }

  if (desktop && (
      settings.addUserHoverCardAccountLocation ||
      settings.hideGrok ||
      settings.premiumBlueChecks != 'ignore'
    )) {
    // User hovercard popup
    let $hoverCard = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="HoverCard"]'))
    if ($hoverCard) {
      result.tookAction = true
      getElement('div[data-testid^="UserAvatar-Container"]', {
        context: $hoverCard,
        name: 'user hovercard contents',
        timeout: 500,
      }).then(($contents) => {
        if (!$contents) return
        if (settings.addUserHoverCardAccountLocation) {
          let $followingLink = /** @type {HTMLAnchorElement} */ ($popup.querySelector('[href$="/following"]'))
          if (!$followingLink) return
          let screenName = $followingLink.pathname.split('/')[1]
          if (!screenName) return
          getAccountLocation(screenName).then((accountLocation) => {
            if (!accountLocation || !accountLocation.account_based_in) return
            let $insertionPoint = $followingLink.parentElement.parentElement.parentElement
            let fontSizeNum = parseInt(fontSize)
            $insertionPoint?.insertAdjacentHTML('afterend', `<div class="cpft_text" style="margin-top: ${fontSizeNum - 4}px; line-height: ${fontSizeNum + 1}px; font-size: ${fontSizeNum - 1}px;">
  ${addQuestionMark(formatString('ACCOUNT_BASED_IN', 'country', accountLocation.account_based_in), !accountLocation.location_accurate)}
            </div>`)
          })
        }
        if (settings.hideGrok) {
          // Tag Grok "Profile Summary" button
          let $grokButton = $popup.querySelector('[data-testid="HoverCard"] > div > div > div:last-child:has(> button)')
          if ($grokButton) {
            $grokButton.classList.add('GrokButton')
          }
        }
        if (settings.premiumBlueChecks != 'ignore') {
          processBlueChecks($popup)
        }
      })
    }
  }

  // Verified account popup when you press the check button on a profile page
  if (settings.premiumBlueChecks == 'replace' && isOnProfilePage()) {
    if (mobile) {
      let $verificationBadge = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="sheetDialog"] [data-testid="verificationBadge"]'))
      if ($verificationBadge) {
        result.tookAction = true
        let $headerBlueCheck = document.querySelector(`body.Profile ${Selectors.MOBILE_TIMELINE_HEADER} .cpft_blue_check`)
        if ($headerBlueCheck) {
          blueCheck($verificationBadge)
        }
      }
    } else {
      let $hoverCard = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="HoverCard"]'))
      if ($hoverCard) {
        result.tookAction = true
        getElement(':scope > div > div > div > svg[data-testid="verificationBadge"]', {
          context: $hoverCard,
          name: 'verified account hovercard verification badge',
          timeout: 500,
        }).then(($verificationBadge) => {
          if (!$verificationBadge) return

          let $headerBlueCheck = document.querySelector(`body.Profile ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 .cpft_blue_check`)
          if (!$headerBlueCheck) return

          // Wait for the hovercard to render its contents
          observeElement($popup, (mutations, observer) => {
            blueCheck($popup.querySelector('svg[data-testid="verificationBadge"]'))
            observer.disconnect()
          }, {
            name: 'verified popup render',
            observers: pageObservers,
           }, {
            childList: true,
            subtree: true,
          })
        })
      }
    }
  }

  return result
}

function interceptMediaButton() {
  document.addEventListener('click', (e) => {
    if (!enabled || !settings.hideGrok) return
    if (!(e.target instanceof Element)) return

    let $button = e.target.closest('button')
    if (!$button) return

    let $fileInput = $button.previousElementSibling
    if (!($fileInput instanceof HTMLInputElement) ||
        $fileInput.type != 'file' ||
        $fileInput.dataset.testid != 'fileInput') {
      return
    }

    log('hideGrok: opening media file picker')
    e.preventDefault()
    e.stopImmediatePropagation()
    $fileInput.click()
  }, true)
}

function isBlueVerified($svg) {
  let props = getVerifiedProps($svg)
  return Boolean(props && props.isBlueVerified && !(
    props.verifiedType || (
      props.affiliateBadgeInfo?.userLabelType == 'BusinessLabel' &&
      props.affiliateBadgeInfo?.description == 'X'
    )
  ))
}

/**
 * Checks if a tweet is preceded by an element creating a vertical reply line.
 * @param {HTMLElement} $tweet
 * @returns {boolean}
 */
function isReplyToPreviousTweet($tweet) {
  let $replyLine = $tweet.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild
  if ($replyLine) {
    return getComputedStyle($replyLine).width == '2px'
  }
}

/**
 * @param {HTMLElement} $timeline
 * @param {WeakMap<Element, import("./types").SeenTweetDetails>} seen
 * @param {import("./types").IndividualTweetTimelineOptions} options
 */
function onIndividualTweetTimelineChange($timeline, seen, options) {
  let startTime = Date.now()

  let itemTypes = {}
  let hiddenItemCount = 0
  let hiddenItemTypes = {}
  let processedCount = 0

  /** @type {?boolean} */
  let hidPreviousItem
  /** @type {boolean} */
  let hideAllSubsequentItems = false
  /** @type {string} */
  let tweetPath = options.observers == modalObservers ? location.pathname : currentPagePath
  /** @type {?string} */
  let opScreenName = URL_TWEET_BASE_RE.exec(tweetPath)?.[1]?.toLowerCase()
  /** @type {string} */
  let userScreenName = getUserScreenName()
  /** @type {{$item: Element, hideItem?: boolean}[]} */
  let changes = []
  /** @type {import("./types").UserInfoObject} */
  let userInfo = getUserInfo()
  /** @type {?HTMLElement} */
  let $focusedTweet

  let items = Array.from($timeline.children)
  for (let i = 0; i < items.length; i++) {
    let $item = items[i]
    if (seen.has($item) &&
        // Reprocess Discover More Tweets if they were processed before the Discover More heading
        !(hideAllSubsequentItems && seen.get($item).hidden != settings.hideDiscoverSuggestions)) {
      let details = seen.get($item)
      hidPreviousItem = details.hidden
      // The focused Tweet renders before any Tweets it was a reply to
      if (details.itemType == 'FOCUSED_TWEET') {
        changes = []
        hiddenItemCount = 0
        hiddenItemTypes = {}
      }
      // The Discover More heading renders after Discover more Tweets(?)
      else if (details.itemType == 'DISCOVER_MORE_HEADING') {
        hideAllSubsequentItems = settings.hideDiscoverSuggestions
      }
      continue
    }

    /** @type {?import("./types").TimelineItemType} */
    let itemType = null
    /** @type {?boolean} */
    let hideItem = null
    /** @type {?HTMLElement} */
    let $tweet = $item.querySelector(Selectors.TWEET)
    /** @type {boolean} */
    let isFocusedTweet = false
    /** @type {boolean} */
    let isReply = false
    /** @type {import("./types").VerifiedType} */
    let tweetVerifiedType = null
    /** @type {?string} */
    let screenName = null
    /** @type {boolean} */
    let isOp = false
    /** @type {boolean} */
    let isUser = false

    if (hideAllSubsequentItems) {
      hideItem = true
      itemType = 'DISCOVER_MORE_TWEET'
    }
    else if ($tweet != null) {
      isFocusedTweet = $tweet.tabIndex == -1
      isReply = isReplyToPreviousTweet($tweet)
      if (isFocusedTweet) {
        itemType = 'FOCUSED_TWEET'
        hideItem = false
        $focusedTweet = $tweet
      } else {
        itemType = getTweetType($tweet)
        if (isReply && hidPreviousItem != null) {
          hideItem = hidPreviousItem
        } else {
          hideItem = shouldHideIndividualTweetTimelineItem(itemType)
        }
      }

      if (!isFocusedTweet && !hideItem && shouldHideContentDisclosure($tweet)) hideItem = true

      if (!hideItem && settings.hideGrokTweets && $tweet.querySelector('a[href^="/i/grok/share/"]')) {
        hideItem = true
      }

      if (!hideItem && (settings.premiumBlueChecks != 'ignore' || settings.hidePremiumReplies)) {
        for (let $svg of $tweet.querySelectorAll(Selectors.VERIFIED_TICK)) {
          let verifiedType = getVerifiedType($svg)
          if (!verifiedType) continue

          if (settings.premiumBlueChecks != 'ignore' && verifiedType == 'BLUE') {
            blueCheck($svg)
          }

          // Don't count a tweet as verified if the check is in a quoted tweet
          let $userProfileLink = /** @type {HTMLAnchorElement} */ ($svg.closest('a[role="link"]:not([href^="/i/status"])'))
          if (!$userProfileLink) continue

          tweetVerifiedType = verifiedType
          screenName = $userProfileLink.href.split('/').pop()
          isOp = screenName.toLowerCase() == opScreenName
          isUser = screenName == userScreenName
        }

        if (tweetVerifiedType &&
            // Don't hide the focused tweet
            !isFocusedTweet &&
            // Replies to the focused tweet don't have the reply indicator
            !isReply &&
            // Don't hide replies by the OP, as it's their thread
            !isOp &&
            // Don't hide replies by the user if they have Premium
            !isUser) {
          itemType = `${tweetVerifiedType}_REPLY`
          if (settings.hidePremiumReplies) {
            let user = userInfo[screenName]
            if (!user && debugLogTimelineStats) {
              log('hidePremiumReplies: user info not found for', screenName)
            }
            hideItem = !(
              settings.showPremiumReplyBusiness && tweetVerifiedType == 'BUSINESS' ||
              settings.showPremiumReplyGovernment && tweetVerifiedType == 'GOVERNMENT' ||
              (user != null && (
                settings.showPremiumReplyFollowing && user.following ||
                settings.showPremiumReplyFollowedBy && user.followedBy ||
                settings.showPremiumReplyFollowersCount && user.followersCount >= Number(settings.showPremiumReplyFollowersCountAmount)
              ))
            )
          }
        }
      }

      if (!hideItem && mutedWords) {
        hideItem = shouldMuteTweet($tweet)
      }

      if (!hideItem && settings.restoreLinkHeadlines) {
        restoreLinkHeadline($tweet)
      }
    }
    else {
      let $article = $item.querySelector('article')
      if ($article) {
        // Deleted or private, unless…
        itemType = 'UNAVAILABLE'
        let $button = $article.querySelector('[role="button"]')
        if ($button) {
          if ($button.textContent == getString('SHOW')) {
            itemType = 'SHOW_MORE'
          }
          else if ($button.textContent == getString('VIEW')) {
            // "This Tweet is from an account you (blocked|muted)." with a View button
            hideItem = settings.hideUnavailableQuoteTweets
          }
        }
        else if ($article.textContent == getString('POST_UNAVAILABLE')) {
          // Likely blocked or muted
          hideItem = settings.hideUnavailableQuoteTweets
        }
      } else {
        // We need to identify "Show more replies" so it doesn't get hidden if the
        // item immediately before it was hidden.
        let $button = $item.querySelector('button[role="button"]')
        if ($button) {
          if ($button?.textContent == getString('SHOW_MORE_REPLIES')) {
            itemType = 'SHOW_MORE'
          }
        }

        // Hide "More From This Author" → Up to 3 Tweets → "See more" link,
        // working backwards from "See more" once it renders.
        if (itemType == null) {
          let $userLink = $item.querySelector(':scope > div > div > a[href^="/i/user/"]')
          if ($userLink) {
            for (let headingOffset = 2; headingOffset <= 4; headingOffset++) {
              if (seen.get(items[i - headingOffset])?.itemType == 'HEADING') {
                itemType = 'SEE_MORE'
                hideItem = settings.hideMoreFromThisAuthor
                for (let j = i - headingOffset; j < i; j++) {
                  if (j < 0 || !items[j]?.firstElementChild) continue
                  changes.push({
                    $item: items[j],
                    hideItem: settings.hideMoreFromThisAuthor || seen.get(items[j])?.hidden == true,
                  })
                }
                break
              }
            }
          }
        }

        if (itemType == null) {
          let $heading = $item.querySelector(Selectors.TIMELINE_HEADING)
          if ($heading) {
            // Discover More headings have a description next to them
            if ($heading.nextElementSibling &&
                $heading.nextElementSibling.tagName == 'DIV' &&
                $heading.nextElementSibling.getAttribute('dir') != null) {
              itemType = 'DISCOVER_MORE_HEADING'
              hideItem = settings.hideDiscoverSuggestions
              hideAllSubsequentItems = settings.hideDiscoverSuggestions
            } else {
              itemType = 'HEADING'
            }
          }
        }
      }
    }

    if (debug && itemType != null) {
      $item.firstElementChild.setAttribute('data-item-type', `${itemType}${isReply ? ' / REPLY' : ''}${isOp ? ' / OP' : ''}`)
    }

    // Assume a non-identified item following an identified item is related
    if (itemType == null && hidPreviousItem != null) {
      hideItem = hidPreviousItem
      itemType = 'SUBSEQUENT_ITEM'
    }

    if (itemType != null) {
      itemTypes[itemType] ||= 0
      itemTypes[itemType]++
    }

    if (hideItem) {
      hiddenItemCount++
      hiddenItemTypes[itemType] ||= 0
      hiddenItemTypes[itemType]++
    }

    if (isFocusedTweet) {
      // Tweets prior to the focused tweet should never be hidden
      changes = []
      hiddenItemCount = 0
      hiddenItemTypes = {}
    }
    else if (hideItem != null && $item.firstElementChild) {
      let hidden = $item.firstElementChild.classList.contains('HiddenTweet')
      if (hidden != hideItem) {
        changes.push({$item, hideItem})
      }
    }

    if (debug && debugLogTimelineStats && (itemType == null || hideItem == null)) {
      warn('unhandled timeline item', {$item, itemType, hideItem})
    }

    hidPreviousItem = hideItem
    seen.set($item, {itemType, hidden: hideItem})
    processedCount++
  }

  for (let change of changes) {
    change.$item.firstElementChild.classList.toggle('HiddenTweet', change.hideItem)
  }

  if ($focusedTweet && !seen.has($focusedTweet)) {
    tweakFocusedTweet($focusedTweet, options)
    seen.set($focusedTweet, {itemType: 'FOCUSED_TWEET', hidden: false})
  }

  if (debug && debugLogTimelineStats) {
    log(
      `processed ${processedCount} new thread item${s(processedCount)} in ${Date.now() - startTime}ms`,
      itemTypes, `hid ${hiddenItemCount}`, hiddenItemTypes
    )
  }
}

/**
 * @returns {{disconnect()}}
 */
function onPopup($popup) {
  log('popup appeared', $popup, location.pathname)

  // If handlePopup did something, we don't need to observe nested popups
  let {tookAction, onPopupClosed} = handlePopup($popup)
  if (tookAction) {
    return onPopupClosed ? {disconnect: onPopupClosed} : null
  }

  /** @type {HTMLElement} */
  let $nestedPopup

  let nestedObserver = observeElement($popup, (mutations) => {
    for (let mutation of mutations) {
      for (let $addedNode of mutation.addedNodes) {
        if (!($addedNode instanceof HTMLElement)) continue
        log('nested popup appeared', $addedNode)
        $nestedPopup = $addedNode
        onPopupClosed = handlePopup($addedNode).onPopupClosed
      }
      for (let $removedNode of mutation.removedNodes) {
        if (!($removedNode instanceof HTMLElement) || $removedNode !== $nestedPopup) continue
        if (onPopupClosed) {
          log('cleaning up after nested popup removed')
          onPopupClosed()
        }
      }
    }
  }, 'nested popup observer')

  let disconnect = nestedObserver.disconnect.bind(nestedObserver)
  nestedObserver.disconnect = () => {
    if (onPopupClosed) {
      log('cleaning up after nested popup observer disconnected')
      onPopupClosed()
    }
    disconnect()
  }

  return nestedObserver
}

/**
 * @param {HTMLElement} $timeline
 * @param {string} page
 * @param {WeakMap<Element, import("./types").SeenTweetDetails>} seen
 * @param {import("./types").TimelineOptions?} options
 */
function onTimelineChange($timeline, page, seen, options = {}) {
  let startTime = Date.now()
  let {
    checkSocialContext = false,
    classifyTweets = true,
    hideHeadings = true,
    isUserTimeline = false,
  } = options

  let isOnHomeTimeline = isOnHomeTimelinePage()
  let isOnListTimeline = isOnListPage()
  let isOnProfileTimeline = isOnProfilePage()
  let isOnNotificationsTimeline = isOnNotificationsPage()
  let timelineHasSpecificTweetHandling = isOnHomeTimeline || isOnListTimeline || isOnProfileTimeline

  if (settings.premiumBlueChecks != 'ignore' && (isUserTimeline || !timelineHasSpecificTweetHandling)) {
    processBlueChecks($timeline)
  }

  if (isSafari && settings.revertXBranding && isOnNotificationsTimeline) {
    processTwitterLogos($timeline)
  }

  if (isUserTimeline || !classifyTweets) return

  let itemTypes = {}
  let hiddenItemCount = 0
  let hiddenItemTypes = {}
  let processedCount = 0

  /** @type {?boolean} */
  let hidPreviousItem = null
  /** @type {{$item: Element, hideItem?: boolean}[]} */
  let changes = []

  for (let $item of $timeline.children) {
    if (seen.has($item)) {
      hidPreviousItem = seen.get($item).hidden
      continue
    }

    /** @type {?import("./types").TimelineItemType} */
    let itemType = null
    /** @type {?boolean} */
    let hideItem = null
    /** @type {?HTMLElement} */
    let $tweet = $item.querySelector(Selectors.TWEET)
    /** @type {boolean} */
    let isReply = false
    /** @type {boolean} */
    let isBlueTweet = false

    if ($tweet != null) {
      itemType = getTweetType($tweet, checkSocialContext)
      if (timelineHasSpecificTweetHandling) {
        isReply = isReplyToPreviousTweet($tweet)
        if (isReply && hidPreviousItem != null) {
          hideItem = hidPreviousItem
        } else {
          if (isOnHomeTimeline) {
            hideItem = shouldHideHomeTimelineItem(itemType, page)
            if (settings.mutableQuoteTweets && !hideItem && itemType == 'QUOTE_TWEET' && settings.hideQuotesFrom.length > 0) {
              let $quotedByLink = /** @type {HTMLAnchorElement} */ ($tweet.querySelector('[data-testid="User-Name"] a'))
              let quotedBy = $quotedByLink?.pathname.substring(1)
              if (quotedBy) {
                hideItem = settings.hideQuotesFrom.includes(quotedBy)
              } else {
                warn('hideQuotesFrom: unable to get quote tweet user')
              }
            }
          }
          else if (isOnListTimeline) {
            hideItem = shouldHideListTimelineItem(itemType)
          }
          else if (isOnProfileTimeline) {
            hideItem = shouldHideProfileTimelineItem(itemType)
          }
        }

        if (!hideItem && settings.hideGrokTweets && $tweet.querySelector('a[href^="/i/grok/share/"]')) {
          hideItem = true
        }

        if (!hideItem && settings.mutableQuoteTweets && (itemType == 'QUOTE_TWEET' || itemType == 'RETWEETED_QUOTE_TWEET')) {
          if (settings.mutedQuotes.length > 0) {
            let quotedTweet = getQuotedTweetDetails($tweet)
            hideItem = settings.mutedQuotes.some(muted => muted.user == quotedTweet.user && muted.time == quotedTweet.time)
          }
          if (!hideItem) {
            addCaretMenuListenerForQuoteTweet($tweet)
          }
        }

        if (settings.premiumBlueChecks != 'ignore') {
          for (let $svg of $tweet.querySelectorAll(Selectors.VERIFIED_TICK)) {
            let isBlueCheck = isBlueVerified($svg)
            if (!isBlueCheck) continue

            blueCheck($svg)

            // Don't count a tweet as blue if the check is in a quoted tweet
            let userProfileLink = $svg.closest('a[role="link"]:not([href^="/i/status"])')
            if (!userProfileLink) continue

            isBlueTweet = true
          }
        }
      }

      if (!hideItem && shouldHideContentDisclosure($tweet)) hideItem = true

      if (!hideItem && mutedWords) {
        hideItem = shouldMuteTweet($tweet)
      }

      if (!hideItem && settings.restoreLinkHeadlines) {
        restoreLinkHeadline($tweet)
      }
    }
    else if (isOnNotificationsTimeline) {
      /** @type {?import("./types").NotificationType} */
      let notificationType = null
      let $iconPath = $item.querySelector('[data-testid="notification"] svg path')?.getAttribute('d')
      if ($iconPath) {
        if ($iconPath.startsWith('M18.766 2H7.323l-4.8 12h5.324l')) {
          notificationType = 'AD'
          hideItem = true
        }
        else if ($iconPath.startsWith('M20.884 13.19c-1.351 2.48-4.00')) {
          notificationType = 'LIKE'
          hideItem = settings.hideNotificationLikes
        }
        else if ($iconPath.startsWith('M17.863 13.44c1.477 1.58 2.366')) {
          notificationType = 'FOLLOW'
        }
        else if ($iconPath.startsWith('M4.75 3.79l4.603 4.3-1.706 1.8')) {
          notificationType = 'RETWEET'
          hideItem = settings.hideNotificationRetweets
        }
      }
      if (notificationType) {
        itemType = `NOTIFICATION_${notificationType}`
      }
    }
    else if (!timelineHasSpecificTweetHandling) {
      if ($item.querySelector(':scope > div > div > div > article')) {
        itemType = 'UNAVAILABLE'
      }
    }

    if (!timelineHasSpecificTweetHandling && !isOnNotificationsTimeline) {
      if (!hideItem && itemType != null) {
        hideItem = shouldHideOtherTimelineItem(itemType)
      }
    }

    // Special handling for non-Tweet timeline items
    if (itemType == null) {
      if ($item.querySelector('[data-testid="inlinePrompt"]')) {
        itemType = 'INLINE_PROMPT'
        hideItem = settings.hideInlinePrompts || (
          settings.hidePremiumUpsells && Boolean($item.querySelector('a[href^="/i/premium"]'))
        )
      } else if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        hideItem = hideHeadings && settings.hideSuggestedContentTimeline
      }
    }

    if (debug && itemType != null) {
      $item.firstElementChild.setAttribute('data-item-type', `${itemType}${isReply ? ' / REPLY' : ''}${isBlueTweet ? ' / BLUE' : ''}`)
    }

    // Assume a non-identified item following an identified item is related
    if (itemType == null && hidPreviousItem != null && !isOnNotificationsTimeline) {
      hideItem = hidPreviousItem
      itemType = 'SUBSEQUENT_ITEM'
    }

    if (itemType != null) {
      itemTypes[itemType] ||= 0
      itemTypes[itemType]++
    }

    if (hideItem) {
      hiddenItemCount++
      hiddenItemTypes[itemType] ||= 0
      hiddenItemTypes[itemType]++
    }

    if (hideItem != null && $item.firstElementChild) {
      let hidden = $item.firstElementChild.classList.contains('HiddenTweet')
      if (hidden != hideItem) {
        changes.push({$item, hideItem})
      }
    }

    hidPreviousItem = hideItem
    seen.set($item, {itemType, hidden: hideItem})
    processedCount++
  }

  for (let change of changes) {
    change.$item.firstElementChild.classList.toggle('HiddenTweet', change.hideItem)
  }

  if (debug && debugLogTimelineStats) {
    log(
      `processed ${processedCount} new timeline item${s(processedCount)} in ${Date.now() - startTime}ms`,
      itemTypes, `hid ${hiddenItemCount}`, hiddenItemTypes
    )
  }
}

/**
 * Title format (including notification count):
 * - LTR: (3) ${title} / X
 * - RTL: (3) X \ ${title}
 * @param {string} title
 */
function onTitleChange(title) {
  log('title changed', {title, path: location.pathname})

  if (checkForDisabledHomeTimeline()) return

  // Ignore leading notification counts in titles
  let notificationCount = ''
  if (TITLE_NOTIFICATION_RE.test(title)) {
    notificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
    title = title.replace(TITLE_NOTIFICATION_RE, '')
  }

  // After we replace the shortcut icon, Twitter stops updating it to add/remove
  // the notifications pip, so we need to manage the pip ourselves.
  if (settings.revertXBranding) {
    observeFavicon.forceUpdate(Boolean(notificationCount))
  }

  let route = getCurrentRoute()

  // Ignore Flash of Uninitialised Title when navigating to a page for the first
  // time, except on pages we've identified as not setting a title, including
  // when they're rendered beneath a desktop modal.
  if (!title || title == 'X' || title == getString('TWITTER')) {
    // On mobile, the media viewer sets an empty title
    if (mobile && (URL_MEDIA_RE.test(route.urlPath) || URL_MEDIAVIEWER_RE.test(route.urlPath))) {
      log('viewing media on mobile')
    }
    // On mobile, the Premium sign up page sets an empty title
    else if (mobile && route.urlPath == '/i/premium_sign_up') {
      log('viewing Premium sign up page on mobile')
    }
    // On desktop, the root Settings page sets an empty title when the sidebar
    // is hidden.
    else if (desktop && route.pagePath == '/settings') {
      log('viewing root Settings page')
    }
    // Chat and its embedded settings have an empty title
    else if (route.pagePath.startsWith('/i/chat') || route.pagePath == '/settings/direct_messages') {
      log('viewing Chat page')
    }
    else {
      log('ignoring Flash of Uninitialised Title')
      return
    }
  }

  let homeNavigationWasUsed = homeNavigationIsBeingUsed
  homeNavigationIsBeingUsed = false

  // Remove " / Twitter" or "Twitter \ " from the title
  let newPage = title
  if (newPage != 'X' && newPage != getString('TWITTER')) {
    newPage = title.slice(...ltr ? [0, title.lastIndexOf('/') - 1] : [title.indexOf('\\') + 2])
  }

  let hasDesktopModalRouteChanged = lastUrlPath != route.urlPath && (lastUrlWasModal || route.isModal)
  // Closing a modal can rebuild its background without changing the title
  let hasDesktopModalBeenClosed = lastUrlWasModal && !route.isModal
  lastUrlWasModal = route.isModal

  // A modal can change screens without changing the underlying page or title
  if (desktop && lastUrlPath != route.urlPath) {
    handleDesktopModalRouteChange(route.urlPath)
  }

  if (newPage == currentPage && route.pagePath == currentPagePath && !hasDesktopModalBeenClosed) {
    // The History page re-renders everything when you switch tabs
    if (route.urlPath.startsWith(PagePaths.HISTORY) && lastUrlPath != route.urlPath) {
      log('viewing History page')
    }
    else if (isOnCommunitiesPage() && URL_COMMUNITIES_RE.test(route.urlPath) && lastUrlPath != route.urlPath) {
      log('navigated between Communities tabs (no title change)')
    }
    else {
      log(`ignoring duplicate title change`)
      currentNotificationCount = notificationCount
      lastUrlPath = route.urlPath
      return
    }
  }

  // Search terms are shown in the title
  if (lastUrlPath == PagePaths.SEARCH && route.urlPath == PagePaths.SEARCH) {
    log('ignoring title change on Search page')
    currentNotificationCount = notificationCount
    return
  }

  // On desktop, stay on the separated tweets timeline when…
  if (desktop && currentPage == separatedTweetsTimelineTitle &&
      // …the title has changed back to the Home timeline…
      (newPage == getString('HOME')) &&
      // …the Home nav link or Following / Home header _wasn't_ clicked and…
      !homeNavigationWasUsed &&
      (
        // …a desktop modal route changed.
        hasDesktopModalRouteChanged ||
        // …the notification count in the title changed.
        notificationCount != currentNotificationCount
      )) {
    log('ignoring title change on separated tweets timeline')
    currentNotificationCount = notificationCount
    lastUrlPath = route.urlPath
    setTitle(separatedTweetsTimelineTitle)
    if (hasDesktopModalBeenClosed) processCurrentPage(route)
    return
  }

  // Restore display of the separated tweets timelne if it's the last one we
  // saw, and the user navigated back home without using the Home navigation
  // item.
  if (route.urlPath == PagePaths.HOME &&
      lastUrlPath != PagePaths.HOME &&
      !homeNavigationWasUsed &&
      lastHomeTimelineTitle != null &&
      separatedTweetsTimelineTitle != null &&
      lastHomeTimelineTitle == separatedTweetsTimelineTitle) {
    log('restoring display of the separated tweets timeline')
    currentNotificationCount = notificationCount
    lastUrlPath = route.urlPath
    setTitle(separatedTweetsTimelineTitle)
    return
  }

  // Assumption: all non-FOUT, non-duplicate title changes are navigation, which
  // need the page to be re-processed.

  currentPage = newPage
  currentNotificationCount = notificationCount
  lastUrlPath = route.urlPath

  if (route.pagePath == PagePaths.HOME) {
    lastHomeTimelineTitle = currentPage
  }

  log('processing new page')

  processCurrentPage(route)
}

let History_push
let History_replace

function patchHistory() {
  let props = getTopLevelProps()
  if (!props) return
  if (!props.history) return warn('history not found')
  if (!props.history.push) return warn('history.push not found')
  if (props.history.push.patched) return
  History_push = props.history.push
  History_replace = props.history.replace
  props.history.push = function (...args) {
    if (enabled && args[0] != null) {
      if (settings.hideVerifiedTabs && typeof args[0] == 'object' && typeof args[0].pathname == 'string') {
        if (args[0].pathname.endsWith('/verified_followers')) {
          log('Redirecting /verified_followers to /followers')
          args[0].pathname = args[0].pathname.replace(/verified_followers$/, 'followers')
        }
      }
    }
    return History_push(...args)
  }
  props.history.push.patched = true
  log('history patched')
}

/** @param {string} path */
function handleDesktopModalRouteChange(path) {
  if (!isDesktopComposeTweetModalOpen) return
  // Any sub-screen can replace the editor, including ones outside /compose/post
  if (lastUrlPath == PagePaths.COMPOSE_TWEET && path != PagePaths.COMPOSE_TWEET) {
    log('navigated away from Compose Tweet editor')
    disconnectObservers(modalObservers, 'modal')
  }
  else if (lastUrlPath != PagePaths.COMPOSE_TWEET && path == PagePaths.COMPOSE_TWEET) {
    log('navigated back to Compose Tweet editor')
    observeDesktopComposeTweetModal($desktopComposeTweetModalPopup)
  }
}

/**
 * Processes all Premium Blue checks inside an element.
 * @param {HTMLElement} $el
 */
function processBlueChecks($el) {
  for (let $svg of $el.querySelectorAll(`${Selectors.VERIFIED_TICK}:not(.cpft_blue_check)`)) {
    if (isBlueVerified($svg)) {
      blueCheck($svg)
    }
  }
}

/**
 * Processes all Twitter logos inside an element.
 */
function processTwitterLogos($el) {
  for (let $svgPath of $el.querySelectorAll(Selectors.X_LOGO_PATH)) {
    twitterLogo($svgPath)
  }
}

function processCurrentPage(route = getCurrentRoute()) {
  // Startup can re-render before the initial page title has been handled
  if (!lastUrlPath) return
  disconnectObservers(pageObservers, 'page')
  currentPagePath = route.pagePath

  // Hooks for styling pages
  if (!$body) $body = document.body
  $body.classList.toggle('Community', isOnCommunityPage())
  $body.classList.toggle('Communities', isOnCommunitiesPage())
  $body.classList.toggle('Display', isOnDisplaySettingsPage())
  $body.classList.toggle('Explore', isOnExplorePage())
  $body.classList.toggle('HideSidebar', shouldHideSidebar())
  $body.classList.toggle('History', isOnHistoryPage())
  $body.classList.toggle('List', isOnListPage())
  $body.classList.toggle('HomeTimeline', isOnHomeTimelinePage())
  $body.classList.toggle('Notifications', isOnNotificationsPage())
  $body.classList.toggle('Profile', isOnProfilePage())
  if (!isOnProfilePage()) {
    $body.classList.remove('OwnProfile', 'PremiumProfile')
  }
  if (!isOnFollowListPage()) {
    $body.classList.remove('Subscriptions')
  }
  $body.classList.toggle('QuoteTweets', isOnQuoteTweetsPage())
  $body.classList.toggle('Tweet', isOnIndividualTweetPage())
  $body.classList.toggle('Search', isOnSearchPage())
  $body.classList.toggle('Settings', isOnSettingsPage())
  $body.classList.toggle('MobileMedia', mobile && URL_MEDIA_RE.test(location.pathname))
  $body.classList.toggle('MediaViewer', mobile && URL_MEDIAVIEWER_RE.test(location.pathname))
  $body.classList.toggle('ComposeTweetPage', mobile && isOnComposeTweetPage())
  // Always remove this as it's a fake page
  $body.classList.remove('SeparatedTweets')

  if (desktop) {
    if (!isOnCallsPage() && !isOnChatPage() && !isOnGrokPage() && !isOnSettingsPage()) {
      observeSidebar()
    } else {
      $body.classList.remove('Sidebar')
    }
    if (isSafari && settings.revertXBranding) {
      tweakDesktopLogo()
    }
  }

  if (isSafari && settings.revertXBranding) {
    tweakHomeIcon()
    tweakTweetIcon()
  }

  if (settings.premiumBlueChecks != 'ignore' && (isOnSearchPage() || isOnExplorePage())) {
    observeSearchForm()
  }

  if (isOnHomeTimelinePage()) {
    tweakHomeTimelinePage()
  }
  else {
    removeMobileTimelineHeaderElements()
  }

  if (isOnProfilePage()) {
    tweakProfilePage()
  }
  else if (isOnFollowListPage()) {
    tweakFollowListPage()
  }
  else if (isOnIndividualTweetPage()) {
    tweakIndividualTweetPage()
  }
  else if (isOnNotificationsPage()) {
    tweakNotificationsPage()
  }
  else if (isOnSearchPage()) {
    tweakSearchPage()
  }
  else if (URL_TWEET_INTERACTIONS_RE.test(currentPagePath)) {
    tweakTweetEngagementPage()
  }
  else if (isOnListPage()) {
    tweakListPage()
  }
  else if (isOnListsPage()) {
    tweakListsPage()
  }
  else if (isOnExplorePage()) {
    tweakExplorePage()
  }
  else if (isOnHistoryPage()) {
    tweakHistoryPage()
  }
  else if (isOnCommunitiesPage()) {
    tweakCommunitiesPage()
  }
  else if (isOnCommunityPage()) {
    tweakCommunityPage()
  }
  else if (isOnCommunityMembersPage()) {
    tweakCommunityMembersPage()
  }
  else if (isOnCallsPage()) {
    tweakCallsPage()
  }
  else if (isOnChatPage() || currentPagePath == '/settings/direct_messages') {
    tweakChatPage()
  }
  else if (isOnDisplaySettingsPage() || isOnAccessibilitySettingsPage()) {
    tweakDisplaySettingsPage()
  }
  else if (isOnPremiumSignupPage()) {
    tweakPremiumSignUpPage()
  }

  // On mobile, these are pages instead of modals
  if (mobile) {
    if (isOnComposeTweetPage()) {
      tweakMobileComposeTweetPage()
    }
    else if (URL_MEDIAVIEWER_RE.test(lastUrlPath)) {
      tweakMobileMediaViewerPage()
    }
    else if (lastUrlPath.startsWith(PagePaths.PROFILE_SETTINGS)) {
      tweakProfileSettingsPage()
    }
  }
}

/**
 * The mobile version of Twitter reuses heading elements between screens, so we
 * always remove any elements which could be there from the previous page and
 * re-add them later when needed.
 */
function removeMobileTimelineHeaderElements() {
  if (mobile) {
    document.querySelector('#cpftSeparatedTweetsTab')?.remove()
  }
}

/**
 * @param {HTMLElement} $tweet
 */
function restoreLinkHeadline($tweet) {
  let $link = /** @type {HTMLElement} */ ($tweet.querySelector(
    // Exclude Install button cards in Grok tweets
    'div[data-testid="card.layoutLarge.media"] > a[rel][aria-label]:not([href="https://itunes.apple.com/app/id6670324846"])'
  ))
  if ($link && !$link.dataset.headlineRestored) {
    let [site, ...rest] = $link.getAttribute('aria-label').split(' ')
    let headline = rest.join(' ')
    $link.lastElementChild?.classList.add('cpft_overlay_headline')
    $link.insertAdjacentHTML('beforeend', `<div class="cpft_link_headline ${fontFamilyRule?.selectorText?.replace('.', '') || 'cpft_font_family'}" hidden>
      <div style="color: var(--cpft-text-secondary); margin-bottom: 2px;">${site}</div>
      <div style="color: var(--cpft-text-primary)">${headline}</div>
    </div>`)
    $link.dataset.headlineRestored = 'true'
  }
}

/**
 * @param {{
 *   $actionBar: HTMLElement
 *   $focusedTweet: HTMLElement
 *   tweetInfo: any
 *   isOwnTweet: boolean
 *   tweetPath: string
 * }} options
 */
function restoreTweetInteractionsLinks({$actionBar, $focusedTweet, tweetInfo, isOwnTweet, tweetPath}) {
  if (!settings.restoreQuoteTweetsLink && !settings.restoreOtherInteractionLinks) return

  if (!tweetInfo) {
    warn('restoreTweetInteractionsLinks: focused tweet info not available')
    return
  }

  let shouldDisplayLinks = (
    (settings.restoreQuoteTweetsLink && tweetInfo.quote_count > 0) ||
    (settings.restoreOtherInteractionLinks && (tweetInfo.retweet_count > 0 || isOwnTweet && tweetInfo.favorite_count > 0))
  )
  let $existingLinks = $focusedTweet.querySelector('#cpftInteractionLinks')
  if (!shouldDisplayLinks || $existingLinks) {
    if (!shouldDisplayLinks) $existingLinks?.remove()
    return
  }

  let tweetLink = tweetPath.match(URL_TWEET_BASE_RE)?.[0]
  $actionBar.insertAdjacentHTML('beforebegin', `
    <div id="cpftInteractionLinks" hidden>
      <div class="${fontFamilyRule?.selectorText?.replace('.', '') || 'cpft_font_family'}" style="padding: 16px 4px; border-top: 1px solid var(--cpft-border); display: flex; gap: 20px;">
        ${tweetInfo.quote_count > 0 ? `<a id="cpftQuoteTweetsLink" class="quoteTweets" href="${tweetLink}/quotes" dir="auto" role="link">
          <span id="cpftQuoteTweetCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.quote_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.quote_count)}
          </span>
          <span>${formatCountString(settings.revertXBranding ? 'QUOTE_TWEET_COUNT' : 'QUOTE_COUNT', tweetInfo.quote_count).trim()}</span>
        </a>` : ''}
        ${tweetInfo.retweet_count > 0 ? `<a id="cpftRetweetsLink" data-tab="2" href="${tweetLink}/retweets" dir="auto" role="link">
          <span id="cpftRetweetCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.retweet_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.retweet_count)}
          </span>
          <span>${formatCountString(settings.revertXBranding ? 'RETWEET_COUNT' : 'REPOST_COUNT', tweetInfo.retweet_count).trim()}</span>
        </a>` : ''}
        ${isOwnTweet && tweetInfo.favorite_count > 0 ? `<a id="cpftLikesLink" data-tab="3" href="${tweetLink}/likes" dir="auto" role="link">
          <span id="cpftLikeCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.favorite_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.favorite_count)}
          </span>
          <span>${formatCountString('LIKE_COUNT', tweetInfo.favorite_count).trim()}</span>
        </a>` : ''}
      </div>
    </div>
  `)

  let $links = /** @type {NodeListOf<HTMLAnchorElement>} */ ($focusedTweet.querySelectorAll('#cpftInteractionLinks a'))
  for (let $link of $links) {
    $link.addEventListener('click', (e) => {
      e.preventDefault()
      History_push?.({
        pathname: $link.pathname,
        hash: '',
        query: {},
        search: '',
      })
    })
  }
}

/**
 * Sets the page name in <title>, retaining any current notification count.
 * @param {string} page
 */
function setTitle(page) {
  let name = settings.revertXBranding ? getString('TWITTER') : 'X'
  let notificationCount = settings.hideNotifications != 'ignore' ? (
    ''
  ) : (
    hiddenNotificationCount || currentNotificationCount
  )
  document.title = ltr ? (
    `${notificationCount}${page} / ${name}`
  ) : (
    `${notificationCount}${name} \\ ${page}`
  )
}

/**
 * @param {import("./types").TimelineItemType} type
 * @returns {boolean}
 */
 function shouldHideIndividualTweetTimelineItem(type) {
  switch (type) {
    case 'QUOTE_TWEET':
    case 'RETWEET':
    case 'RETWEETED_QUOTE_TWEET':
    case 'TWEET':
      return false
    case 'UNAVAILABLE_QUOTE_TWEET':
    case 'UNAVAILABLE_RETWEET':
      return settings.hideUnavailableQuoteTweets
    default:
      return true
  }
}

/**
 * @param {import("./types").TimelineItemType} type
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideHomeTimelineItem(type, page) {
  switch (type) {
    case 'QUOTE_TWEET':
      return shouldHideSharedTweet(settings.quoteTweets, page)
    case 'RETWEET':
      return selectedHomeTabIndex >= 2 ? settings.hideListRetweets : shouldHideSharedTweet(settings.retweets, page)
    case 'RETWEETED_QUOTE_TWEET':
      return selectedHomeTabIndex >= 2 ? (
          settings.hideListRetweets
        ) : (
          page != separatedTweetsTimelineTitle ? (
            shouldHideSharedTweet(settings.retweets, page) || shouldHideSharedTweet(settings.quoteTweets, page)
          ) : (
            shouldHideSharedTweet(settings.retweets, page) && shouldHideSharedTweet(settings.quoteTweets, page)
          )
        )
    case 'COMMUNITY_TWEET':
    case 'TWEET':
      return page == separatedTweetsTimelineTitle
    case 'UNAVAILABLE_QUOTE_TWEET':
      return settings.hideUnavailableQuoteTweets || shouldHideSharedTweet(settings.quoteTweets, page)
    case 'UNAVAILABLE_RETWEET':
      return settings.hideUnavailableQuoteTweets || selectedHomeTabIndex >= 2 ? settings.hideListRetweets : shouldHideSharedTweet(settings.retweets, page)
    default:
      return true
  }
}

/**
 * @param {import("./types").TimelineItemType} type
 * @returns {boolean}
 */
function shouldHideListTimelineItem(type) {
  switch (type) {
    case 'RETWEET':
    case 'RETWEETED_QUOTE_TWEET':
      return settings.hideListRetweets
    case 'UNAVAILABLE_QUOTE_TWEET':
      return settings.hideUnavailableQuoteTweets
    case 'UNAVAILABLE_RETWEET':
      return settings.hideUnavailableQuoteTweets || settings.hideListRetweets
    default:
      return false
  }
}

/**
 * @param {import("./types").TimelineItemType} type
 * @returns {boolean}
 */
 function shouldHideOtherTimelineItem(type) {
  switch (type) {
    case 'COMMUNITY_TWEET':
    case 'PINNED_TWEET':
    case 'QUOTE_TWEET':
    case 'RETWEET':
    case 'RETWEETED_QUOTE_TWEET':
    case 'TWEET':
    case 'UNAVAILABLE':
    case 'UNAVAILABLE_QUOTE_TWEET':
    case 'UNAVAILABLE_RETWEET':
      return false
    default:
      return true
  }
}

/**
 * @param {import("./types").TimelineItemType} type
 * @returns {boolean}
 */
function shouldHideProfileTimelineItem(type) {
  switch (type) {
    case 'COMMUNITY_TWEET':
    case 'PINNED_TWEET':
    case 'QUOTE_TWEET':
    case 'TWEET':
      return false
    case 'RETWEET':
    case 'RETWEETED_QUOTE_TWEET':
      return settings.hideProfileRetweets
    case 'UNAVAILABLE_QUOTE_TWEET':
      return settings.hideUnavailableQuoteTweets
    default:
      return true
  }
}

/**
 * @param {import("./types").SharedTweetsConfig} config
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideSharedTweet(config, page) {
  switch (config) {
    case 'hide': return true
    case 'ignore': return page == separatedTweetsTimelineTitle
    case 'separate': return page != separatedTweetsTimelineTitle
  }
}

/** @param {HTMLElement} $tweet */
function shouldMuteTweet($tweet) {
  // Quoted Tweets also have tweetText
  for (let $tweetText of $tweet.querySelectorAll('[data-testid="tweetText"]')) {
    if (hasMutedWord($tweetText.textContent)) return true
  }
  return false
}

function tweakCallsPage() {
  let styles = styleEmbed('[data-testid="xcallsRemoteHost"]', ':is([data-xcalls-root], [data-xcalls-portal])')
  let name = 'Calls page styles'
  pageObservers.set(name, {
    name,
    disconnect() {
      styles.disconnect()
      pageObservers.delete(name)
    },
  })
}

function tweakChatPage() {
  let styles = null
  function applyStyles() {
    styles?.disconnect()
    styles = styleEmbed(':is([data-testid="xchatEmbedRoute"], [data-testid="xchatEmbedSettings"])', ':is([data-xchat-root], [data-xchat-portal])')
  }
  applyStyles()
  if (currentPagePath == '/settings/direct_messages') observeSettingsNavRerenderBoundary(applyStyles)
  let name = 'Chat page styles'
  pageObservers.set(name, {
    name,
    disconnect() {
      styles.disconnect()
      pageObservers.delete(name)
    },
  })
}

async function tweakHistoryPage() {
  if (settings.premiumBlueChecks != 'ignore' || settings.restoreLinkHeadlines) {
    observeTimeline(currentPage)
  }
}

function tweakCommunitiesPage() {
  observeTimeline(currentPage, {
    checkSocialContext: true,
    isTabbed: true,
    tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
  })
}

function tweakCommunityPage() {
  observeTimeline(currentPage, {
    checkSocialContext: true,
    hideHeadings: false,
    isTabbed: true,
    tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
    onTimelineAppeared() {
      // The About tab has static content at the top which can include a check
      if (/\/about\/?$/.test(currentPagePath)) {
        processBlueChecks(document.querySelector(Selectors.PRIMARY_COLUMN))
      }
    }
  })
}

function tweakCommunityMembersPage() {
  if (settings.premiumBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
      isTabbed: true,
      timelineSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
    })
  }
}

async function tweakDesktopLogo() {
  let $logoPath = await getElement(`h1 ${Selectors.X_LOGO_PATH}, h1 ${Selectors.X_DARUMA_LOGO_PATH}`, {
    name: 'desktop nav logo',
    timeout: 5000,
    observers: globalObservers,
  })
  if ($logoPath) {
    twitterLogo($logoPath)
  }
}

/** @param {() => void} onRerender */
async function observeSettingsNavRerenderBoundary(onRerender) {
  if (!desktop) return
  let path = currentPagePath
  let $boundary = await getElement('main > div > div', {
    name: 'settings nav re-render boundary',
    observers: pageObservers,
  })
  if (!$boundary || !enabled || currentPagePath != path) return
  observeElement($boundary, () => {
    log('settings nav caused a re-render', {path})
    onRerender()
  }, {
    name: 'settings nav re-render boundary',
    observers: pageObservers,
  })
}

function tweakDisplaySettingsPage() {
  async function addCustomThemeSwatch() {
    if (!pro || !isOnDisplaySettingsPage()) return
    let $swatchGroup = await getElement('[role="radiogroup"]', {
      name: 'swatches',
    })
    if (!$swatchGroup) return
    $swatchGroup.classList.add('DisplaySwatches')
    if (!$swatchGroup.hasAttribute('cpft-swatches-tagged')) {
      function clearCustomTheme() {
        if (settings.customTheme) {
          settings.customTheme = ''
          configureThemeCss()
          storeConfigChanges({settings: {customTheme: ''}})
        }
      }
      let $swatches = Array.from($swatchGroup.querySelectorAll(':scope > div'))
      for (let $swatch of $swatches) {
        $swatch.addEventListener('click', clearCustomTheme)
      }
      let cleanup = {
        name: 'native swatch click handlers',
        disconnect() {
          for (let $swatch of $swatches) {
            $swatch.removeEventListener('click', clearCustomTheme)
          }
          pageObservers.delete(cleanup.name)
        }
      }
      pageObservers.set(cleanup.name, cleanup)
      for (let $styledElement of $swatchGroup.querySelectorAll('[style]')) {
        $styledElement.classList.add('UseNativeTheme')
      }
      $swatchGroup.setAttribute('cpft-swatches-tagged', '')
    }
    let $h2 = $swatchGroup.parentElement.parentElement.previousElementSibling.querySelector('h2')
    if (!$h2) return
    let $customThemeSwatch = $h2.querySelector('.cpft_swatch')
    if ($customThemeSwatch) return
    let swatchColor = settings.customTheme || nativePalette.primaryHex
    if (swatchColor.length == 4) {
      swatchColor = `#${swatchColor.slice(1).split('').map(c => c.repeat(2)).join('')}`
    }
    $h2.insertAdjacentHTML('beforeend', `<div class="cpft_swatch" hidden>
      <label>
        <svg viewBox="0 0 24 24">
          <defs>
            <linearGradient id="rainbow" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stop-color="#FF0000" />
              <stop offset="20%"  stop-color="#FFA500" />
              <stop offset="40%"  stop-color="#FFFF00" />
              <stop offset="60%"  stop-color="#00FF00" />
              <stop offset="80%"  stop-color="#0000FF" />
              <stop offset="100%" stop-color="#EE82EE" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="12" r="10.3" fill="url(#rainbow)">
        </svg>
        <input type="color" value="${swatchColor}">
      </label>
      <div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g>
            <path stroke="#000" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" d="M22.21 2.793c-1.22-1.217-3.18-1.26-4.45-.097l-10.17 9.32C5.02 12.223 3 14.376 3 17v5h5c2.62 0 4.78-2.022 4.98-4.593L22.3 7.239c1.17-1.269 1.12-3.229-.09-4.446zM8 20H5v-3c0-1.657 1.34-3 3-3s3 1.343 3 3-1.34 3-3 3zM20.83 5.888l-8.28 9.033c-.5-1.09-1.38-1.971-2.47-2.47l9.03-8.28c.48-.44 1.22-.424 1.68.036s.48 1.201.04 1.681z">
          </g>
        </svg>
      </div>
    </div>
    `)
    $customThemeSwatch = $h2.querySelector('.cpft_swatch')
    let $color = $customThemeSwatch.querySelector('input')
    $customThemeSwatch.addEventListener('click', () => $color.click())
    $color.addEventListener('input', () => {
      settings.customTheme = $color.value
      configureThemeCss()
      storeConfigChanges({settings: {customTheme: $color.value}})
    })
  }

  addCustomThemeSwatch()
  if (pro) observeSettingsNavRerenderBoundary(addCustomThemeSwatch)

  if (desktop) {
    observeElement($html, () => {
      if (!$html.style.fontSize) return

      if ($html.style.fontSize != fontSize) {
        fontSize = $html.style.fontSize
        log(`<html> fontSize has changed to ${fontSize}`)
        addCustomThemeSwatch()
        configureDynamicCss()
      }
    }, {
      name: '<html> style attribute for font size changes',
      observers: pageObservers,
    }, {
      attributes: true,
      attributeFilter: ['style']
    })
  }
}

async function tweakExplorePage() {
  if (!settings.hideExplorePageContents) {
    if (settings.premiumBlueChecks != 'ignore') {
      observeTimeline(currentPage, {
        classifyTweets: false,
        isTabbed: true,
        tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child > div`,
      })
    }
    return
  }

  let $searchInput = await getElement('input[data-testid="SearchBox_Search_Input"]', {
    name: 'explore page search input',
    stopIf: () => !isOnExplorePage(),
  })
  if (!$searchInput) return

  log('focusing search input')
  $searchInput.focus()

  if (mobile) {
    // The back button appears after the search input is focused on mobile. When
    // you tap it or otherwise navigate back, it's replaced with the slide-out
    // menu button and Explore page contents are shown - we want to skip that.
    let $backButton = await getElement('div[data-testid="app-bar-back"]', {
      name: 'back button',
      stopIf: () => !isOnExplorePage(),
    })
    if (!$backButton) return

    observeElement($backButton.parentElement, (mutations) => {
      for (let mutation of mutations) {
        for (let $addedNode of mutation.addedNodes) {
          if (!($addedNode instanceof HTMLElement)) continue
          if ($addedNode.querySelector('[data-testid="DashButton_ProfileIcon_Link"]')) {
            log('slide-out menu button appeared, going back to skip Explore page')
            history.go(-2)
            return
          }
        }
      }
    }, {
      name: 'back button parent',
      observers: pageObservers,
    })
  }
}

/**
 * @param {HTMLElement} $focusedTweet
 * @param {import("./types").IndividualTweetTimelineOptions} options
 */
async function tweakFocusedTweet($focusedTweet, options) {
  log('tweaking focused tweet')
  let {observers} = options
  let $permalinkBar = $focusedTweet.querySelector('div:has(> div > a > time)')
  let tweetPath = $permalinkBar?.querySelector('a:has(> time)')?.getAttribute('href') || (
    observers == modalObservers ? location.pathname : currentPagePath
  )
  let focusedTweetUrlMatch = tweetPath.match(URL_TWEET_BASE_RE)
  let screenName = focusedTweetUrlMatch?.[1]
  let tweetId = focusedTweetUrlMatch?.[2]
  let tweetInfo = getTweetInfo(tweetId)
  let isOwnTweet = isOnOwnTweetPage(tweetPath)

  // Tag View elements and add account location
  if ($permalinkBar) {
    $permalinkBar.children[1]?.classList.toggle('Views', settings.hideViews)
    $permalinkBar.children[2]?.classList.toggle('Views', settings.hideViews)
    addAccountLocationToFocusedTweet($permalinkBar, screenName)
  } else {
    warn('focused tweet permalink bar not found')
  }

  let $actionBar = /** @type {HTMLElement} */ ($focusedTweet.querySelector('div:has(> [role="group"][id^="id__"])'))
  let $underActionBar = $actionBar?.nextElementSibling
  if ($actionBar) {
    $actionBar.id = 'cpftFocusedTweetActionBar'
    restoreTweetInteractionsLinks({$actionBar, $focusedTweet, tweetInfo, isOwnTweet, tweetPath})
  } else {
    warn('focused tweet action bar not found')
  }

  if ($underActionBar) {
    let $sortRepliesButton = $underActionBar.querySelector('button[aria-haspopup="menu"]')
    if ($sortRepliesButton) {
      if (settings.hideSortRepliesMenu) {
        getClosestChild($sortRepliesButton, $underActionBar)?.classList.add('SortRepliesMenu')
      }
      // Replace the default Sort replies text with the sort we're applying
      else if (settings.sortReplies != 'relevant' && !userSortedReplies) {
        let $buttonText = $sortRepliesButton.querySelector('span')
        if ($buttonText) $buttonText.textContent = {
          liked: getString('LIKES'),
          recent: getString('RECENT'),
        }[settings.sortReplies]
      }
    }

    let $viewActivity = $underActionBar.querySelector('a[href$="/quotes"]')
    getClosestChild($viewActivity, $underActionBar)?.classList.add('ViewActivity')
  }

  if (isOwnTweet) {
    if (settings.hidePremiumUpsells && !$focusedTweet.hasAttribute('cpft-premium-upsells-tagged')) {
      run(async () => {
        let $premiumUpsell = await getElement('div:has(> div[style] > button ~ div a:is([href="/i/account_analytics"], [href^="/i/premium"]))', {
          context: $focusedTweet,
          name: 'own focused Tweet premium upsell',
          timeout: 500,
          stopIf: pageIsNot(currentPage)
        })
        if (!$premiumUpsell) return
        $premiumUpsell.classList.add('PremiumUpsell')
      })
      $focusedTweet.setAttribute('cpft-premium-upsells-tagged', 'true')
    }
  }

  if (desktop && settings.revertXBranding) {
    void async function() {
      let $editorRoot = await getElement('.DraftEditor-root', {
        context: $focusedTweet.parentElement,
        name: 'tweet editor in focused tweet',
        timeout: 1000,
        observers,
      })
      if (!$editorRoot) return
      observeDesktopTweetEditorPlaceholder($editorRoot, {
        name: 'tweet editor',
        placeholder: getString('TWEET_YOUR_REPLY'),
        observers,
      })
    }()
  }
}

async function tweakFollowListPage() {
  // Fallback for direct navigation
  if (settings.hideVerifiedTabs && lastUrlPath.endsWith('/verified_followers')) {
    History_replace?.(lastUrlPath.replace(/verified_followers$/, 'followers'))
    return
  }

  if (settings.premiumBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
    })
  }

  let $followListTabs = await getElement(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`, {
    name: 'Follow list tabs',
    stopIf: () => !isOnFollowListPage(),
  })
  if (!$followListTabs) return
  let $tabsContainer = $followListTabs.parentElement
  // Tabs <nav> will be replaced when dynamic tabs load
  observeElement($tabsContainer, () => {
    $tabsContainer.querySelector('div:has(> a[href$="/verified_followers"])')?.classList?.add('VerifiedFollowersTab')
    $tabsContainer.querySelector('div:has(> a[href$="/subscriptions"])')?.classList?.add('SubscriptionsTab')
  }, {
    name: 'Follow list tabs container',
    observers: pageObservers,
    leading: true,
  })
}

async function tweakHomeIcon() {
  let $homeIconPath = await getElement(`${Selectors.NAV_HOME_LINK} svg path`, {
    name: 'Home icon',
  })
  if (!$homeIconPath) return
  // Safari doesn't support using `d: path(…)` to replace paths in an SVG, so
  // we have to manually patch the path in it.
  let replacementPath = {
    [Svgs.X_HOME_ACTIVE_PATH]: Svgs.TWITTER_HOME_ACTIVE_PATH,
    [Svgs.X_HOME_INACTIVE_PATH]: Svgs.TWITTER_HOME_INACTIVE_PATH,
  }[$homeIconPath.getAttribute('d')]
  if (replacementPath) {
    $homeIconPath.setAttribute('d', replacementPath)
  }
}

function tweakHomeTimelinePage() {
  let $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)

  // Hook for styling when on the separated tweets tab
  $body.classList.toggle('SeparatedTweets', isOnSeparatedTweetsTimeline())

  if ($timelineTabs == null) {
    warn('could not find Home timeline tabs')
    return
  }

  let $manageTimelinesButton = $timelineTabs.parentElement.nextElementSibling
  if ($manageTimelinesButton?.querySelector('path[d="M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z"]')) {
    $manageTimelinesButton.classList.add('ManageTimelines')
  } else {
    $manageTimelinesButton = null
  }

  tweakTimelineTabs($timelineTabs)
  if (mobile && isSafari && settings.revertXBranding) {
    processTwitterLogos(document.querySelector(Selectors.MOBILE_TIMELINE_HEADER))
  }

  function updateSelectedHomeTabIndex() {
    let $selectedHomeTabLink = $timelineTabs.querySelector('div[role="tablist"] [aria-selected="true"]')
    if ($selectedHomeTabLink) {
      selectedHomeTabIndex = Array.from($selectedHomeTabLink.parentElement.parentElement.children).indexOf($selectedHomeTabLink.parentElement)
    } else {
      warn('could not find selected Home tab link')
      selectedHomeTabIndex = -1
    }
  }

  updateSelectedHomeTabIndex()

  // If there are pinned lists, the timeline tabs <nav> will be replaced the
  // first time they load in the current session.
  observeElement($timelineTabs.parentElement, (mutations) => {
    let timelineTabsReplaced = mutations.some(mutation => Array.from(mutation.removedNodes).includes($timelineTabs))
    if (timelineTabsReplaced &&
        // On mobile, navigating to a different tabbed screen can switch tabs before the title changes
        isOnHomeTimelinePage()) {
      log('Home timeline tabs replaced')
      $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)
      tweakTimelineTabs($timelineTabs)
    }
  }, {
    name: 'timeline tabs nav container',
    observers: pageObservers,
  })

  observeTimeline(currentPage, {
    checkSocialContext: true,
    isTabbed: true,
    onTabChanged: () => {
      updateSelectedHomeTabIndex()
      wasForYouTabSelected = selectedHomeTabIndex == 0
    },
    tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
  })

  if (desktop) {
    observeDesktopHomeTimelineTweetBox()
  }
}

async function tweakIndividualTweetPage() {
  userSortedReplies = false
  observeIndividualTweetTimeline(currentPage)

  if (settings.revertXBranding) {
    (async () => {
      let $headingText = await getElement(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} h2 span`, {
        name: 'tweet thread heading',
      })
      if ($headingText && $headingText.textContent != getString('TWEET_NOUN')) {
        $headingText.textContent = getString('TWEET_NOUN')
      }
    })()
  }
}

function tweakListPage() {
  observeTimeline(currentPage, {
    checkSocialContext: true,
    hideHeadings: false,
  })
}

async function tweakListsPage() {
  if (settings.hideDiscoverSuggestions) {
    // Hide Discover new Lists
    let $showMoreLink = await getElement('a[href="/i/lists/suggested"]', {
      name: 'Show more link',
    })
    if (!$showMoreLink) return
    let $timelineItem = $showMoreLink.closest('[data-testid="cellInnerDiv"]')
    if (!$timelineItem) {
      warn('could not find timeline item containing Show more link')
      return
    }
    let $timelineItems = $timelineItem.parentElement.children
    let showMoreIndex = Array.prototype.indexOf.call($timelineItems, $timelineItem)
    for (let i = 1; i <= showMoreIndex + 2; i++) {
      $timelineItems[i].classList.add('SuggestedContent')
    }
  }
}

async function tweakMobileComposeTweetPage() {
  if (!settings.revertXBranding && settings.premiumBlueChecks == 'ignore') return

  function observeUserTypeaheadDropdown($tweetTextareaContainer) {
    if (!$tweetTextareaContainer) {
      warn('could not find Tweet textarea container to observe user dropdown')
      return
    }

    let $dropdownContainer = $tweetTextareaContainer.parentElement.parentElement.parentElement.parentElement
    /** @type {HTMLElement} */
    let $typeaheadDropdown = $dropdownContainer.querySelector(':scope > [id^="typeaheadDropdown"]')
    function observeDropdown() {
      observeElement($typeaheadDropdown, () => {
        processBlueChecks($typeaheadDropdown)
      }, {
        name: 'Tweet box typeahead dropdown',
        observers: pageObservers,
      })
    }
    // If the list was re-rendered to display a dropdown for an additional
    // Tweet, it will already be in the DOM.
    if ($typeaheadDropdown) {
      observeDropdown()
    }
    observeElement($dropdownContainer, (mutations) => {
      for (let mutation of mutations) {
        if ($typeaheadDropdown &&
            mutations.some(mutation => Array.from(mutation.removedNodes).includes($typeaheadDropdown))) {
          pageObservers.get('Tweet box typeahead dropdown')?.disconnect()
          $typeaheadDropdown = null
        }
        for (let $addedNode of mutation.addedNodes) {
          if ($addedNode instanceof HTMLElement &&
              $addedNode.getAttribute('id')?.startsWith('typeaheadDropdown')) {
            $typeaheadDropdown = $addedNode
            observeDropdown()
          }
        }
      }
    }, {
      name:'Tweet box typeahead dropdown container',
      observers: pageObservers,
    })
  }

  let isReply = Boolean(document.querySelector('article[data-testid="tweet"]'))
  if (isReply) {
    // Restore old placeholder in Tweet textarea
    if (settings.revertXBranding) {
      let $textarea = /** @type {HTMLTextAreaElement} */ (
        document.querySelector('main div[data-testid^="tweetTextarea"] textarea')
      )
      if ($textarea) {
        $textarea.placeholder = getString('TWEET_YOUR_REPLY')
      } else {
        warn('could not find Tweet textarea')
      }
    }
    // Observe username typeahead dropdown in Tweet box
    if (settings.premiumBlueChecks != 'ignore') {
      observeUserTypeaheadDropdown(document.querySelector('main div[data-testid^="tweetTextarea"]'))
    }
  } else {
    let $tweetTextarea =  await getElement('main div[data-testid^="tweetTextarea"]', {
      name: 'first Tweet textarea',
      stopIf: pageIsNot(currentPage),
    })
    if (!$tweetTextarea) return
    let $tweetsContainer = $tweetTextarea.closest('div:not([class])')?.parentElement
    let $tweetButtonText = document.querySelector('main button[data-testid^="tweetButton"] span > span')
    if ($tweetsContainer && $tweetButtonText) {
      // We need to re-apply tweaks every time the child list changes. When
      // you use the username typeahead dropdown in any Tweet box, the list
      // re-renders so it's the only Tweet while the dropdown is open.
      observeElement($tweetsContainer, () => {
        let $containers = document.querySelectorAll('main div[data-testid^="tweetTextarea"]')
        $containers.forEach(($container, index) => {
          if (settings.revertXBranding) {
            let $textarea = $container.querySelector('textarea')
            if (index > 0) {
              $textarea.placeholder = getString('ADD_ANOTHER_TWEET')
            }
          }
          if (index == 0 && settings.premiumBlueChecks) {
            observeUserTypeaheadDropdown($container)
          }
        })
        // Don't update the Tweet button if the list was re-rendered to display
        // a user dropdown, in which case it will already be in the DOM.
        if (settings.revertXBranding && !document.querySelector('main [id^="typeaheadDropdown"]')) {
          $tweetButtonText.textContent = getString($containers.length <= 1 ? 'TWEET' : 'TWEET_ALL')
        }
      }, {
        name: 'Tweets container',
        observers: pageObservers,
      })
    } else {
      warn('could not find all elements needed to tweak the Compose Tweet page', {$tweetsContainer, $tweetButtonText})
    }
  }
}

async function tweakMobileMediaViewerPage() {
  let $timeline = await getElement('[data-testid="vss-scroll-view"] > div', {
    name: 'media viewer timeline',
    stopIf: () => !URL_MEDIAVIEWER_RE.test(location.pathname),
  })
  if (!$timeline) return

  /** @param {HTMLVideoElement} $video */
  function processVideo($video) {
    if ($video.loop != settings.preventNextVideoAutoplay) {
      $video.loop = settings.preventNextVideoAutoplay
    }
  }

  // Process initial contents
  let $videos = $timeline.querySelectorAll('video')
  log($videos.length, `initial video${s($videos.length)}`)
  $videos.forEach(processVideo)
  if (settings.premiumBlueChecks != 'ignore') {
    processBlueChecks($timeline)
  }

  observeElement($timeline, (mutations) => {
    for (let mutation of mutations) {
      for (let $addedNode of mutation.addedNodes) {
        if (!($addedNode instanceof HTMLElement) || $addedNode.nodeName != 'DIV') continue
        let $video = $addedNode.querySelector('video')
        if ($video) {
          processVideo($video)
        }
        if (settings.premiumBlueChecks != 'ignore') {
          let $videoInfo = $addedNode.querySelector('[data-testid^="immersive-tweet-ui-content-container"]')
          if ($videoInfo) {
            processBlueChecks($addedNode)
          }
        }
      }
    }
  }, {
    name: 'media viewer timeline',
    observers: pageObservers,
  }, {childList: true, subtree: true})
}

function tweakNotificationsPage() {
  observeTimeline(currentPage, {
    isTabbed: true,
    tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
  })
}

async function tweakPremiumSignUpPage() {
  if (!settings.hidePremiumUpsells) return
  let $closeButton = await getElement('[data-testid="app-bar-close"]', {
    name: 'Premium sign up close button',
    stopIf: () => location.pathname != '/i/premium_sign_up',
  })
  if (!$closeButton) return
  log('Closing Premium sign up page')
  $closeButton.click()
}

async function tweakProfilePage() {
  let $initialContent = await getElement(desktop ? Selectors.PRIMARY_COLUMN : Selectors.MOBILE_TIMELINE_HEADER, {
    name: 'initial profile content',
  })
  if (!$initialContent) return

  if (settings.premiumBlueChecks != 'ignore') {
    processBlueChecks($initialContent)
  }

  let tab = currentPagePath.match(URL_PROFILE_RE)?.[2] || 'tweets'
  log(`on ${tab} tab`)
  observeTimeline(currentPage, {
    checkSocialContext: tab == 'tweets' || tab == 'with_replies',
    isUserTimeline: tab == 'affiliates'
  })

  getElement('a[href="/settings/profile"]', {
    name: 'edit profile button',
    timeout: 500,
  }).then($editProfileButton => {
    $body.classList.toggle('OwnProfile', Boolean($editProfileButton))
    if (settings.hidePremiumUpsells) {
      // This selector is _extremely_ specific to try to avoid false positives
      getElement(mobile ? (
        '[data-testid="primaryColumn"] > div > div > div > div > div > div > div > div > div:has(> div > div > div > a[href^="/i/premium"])'
      ) : (
        '[data-testid="primaryColumn"] > div > div > div > div > div > div:has(> div > div > div > a[href^="/i/premium"])'
      ), {
        name: "you aren't verified yet premium upsell",
        timeout: 2000,
      }).then($upsell => {
        if ($upsell) {
          $upsell.classList.add('PremiumUpsell')
        }
      })
    }
  })
  let $headerVerifiedIcon = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.TIMELINE_HEADING} [data-testid="icon-verified"]`)
  $body.classList.toggle('PremiumProfile', Boolean($headerVerifiedIcon))

  if (settings.revertXBranding || settings.hideSubscriptions) {
    let $profileTabs = await getElement(`${Selectors.PRIMARY_COLUMN} nav`, {
      name: 'profile tabs',
    })
    if (!$profileTabs) return
    // The Profile tabs <nav> can be replaced
    observeElement($profileTabs.parentElement, async (mutations) => {
      if (mutations.length > 0) {
        let $newProfileTabs = findAddedNode(mutations, ($el) => $el instanceof HTMLElement && $el.tagName == 'NAV')
        if ($newProfileTabs == null) return
        $profileTabs = /** @type {HTMLElement} */ ($newProfileTabs)
      }
      if (settings.revertXBranding) {
        let $tweetsTabText = await getElement('[data-testid="ScrollSnap-List"] > [role="presentation"]:first-child div[dir] > span:first-child', {
          context: $profileTabs,
          name: 'Tweets tab text',
        })
        if ($tweetsTabText && $tweetsTabText.textContent != getString('TWEETS')) {
          $tweetsTabText.textContent = getString('TWEETS')
        }
      }
      if (settings.hideSubscriptions) {
        let $subscriptionsTabLink = await getElement('a[href$="/superfollows"]', {
          context: $profileTabs,
          name: 'Subscriptions tab link',
          timeout: 1000,
        })
        if ($subscriptionsTabLink) {
          $subscriptionsTabLink.parentElement.classList.add('SubsTab')
        }
      }
    }, {
      leading: true,
      name: 'profile tabs',
      observers: pageObservers,
    }, {childList: true})
  }
}

function tweakProfileSettingsPage() {
  getElement('input[type="file"] + button:has(path[d^="M17.084 7.5c0-1.163 0-1.744-.14"])', {
    name: 'profile header button (hideEditImage)',
    timeout: 2000,
  }).then($headerButton => $headerButton?.classList?.add('EditImage'))
  if (desktop) {
    getElement('div:has(> div + button path[d^="M17.084 7.5c0-1.163 0-1.744-.14"])', {
      name: 'profile Edit Photo box (hideEditImage)',
      timeout: 2000,
    }).then($editPhotoBox => $editPhotoBox?.classList?.add('EditImage'))
  }
}

/**
 * @param {Element} $dropdownItem
 * @param {string} dropdownItemSelector
 * @param {import("./types").LocaleKey} localeKey
 */
async function tweakRetweetDropdown($dropdownItem, dropdownItemSelector, localeKey) {
  log('tweaking Retweet/Quote Tweet dropdown')

  if (desktop) {
    $dropdownItem = await getElement(`
      #layers div[data-testid="Dropdown"] ${dropdownItemSelector}
    `, {
      name: 'rendered menu item',
      timeout: 100,
    })
    if (!$dropdownItem) return
  }

  let $text = $dropdownItem.querySelector('div[dir] > span')
  if ($text) $text.textContent = getString(localeKey)

  let $quoteTweetText = $dropdownItem.nextElementSibling?.querySelector('div[dir] > span')
  if ($quoteTweetText) $quoteTweetText.textContent = getString('QUOTE_TWEET')
}

function tweakSearchPage() {
  let $searchTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)
  if ($searchTabs != null) {
    if (settings.defaultToLatestSearch) {
      let isTopTabSelected = Boolean($searchTabs.querySelector('div[role="tablist"] > div:nth-child(1) > [role="tab"][aria-selected="true"]'))
      if (isTopTabSelected) {
        log('switching to Latest tab')
        let $latestTab = /** @type {HTMLAnchorElement} */ (
          $searchTabs.querySelector('div[role="tablist"] > div:nth-child(2) > [role="tab"]')
        )
        $latestTab?.click()
      }
    }
  } else {
    warn('could not find Search tabs')
  }

  observeTimeline(currentPage, {
    hideHeadings: settings.hideSuggestedContentSearch,
    isTabbed: true,
    tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
  })

  if (desktop) {
    let $emptyFirstSidebarItem = document.querySelector(`.SidebarContents > div:first-child:empty`)
    if ($emptyFirstSidebarItem) {
      log('removing empty first sidebar item from Search sidebar')
      $emptyFirstSidebarItem.remove()
    }
  }
}

async function tweakTimelineTabs($timelineTabs) {
  $timelineTabs.classList.add('TimelineTabs')
  let $followingTabLink = /** @type {HTMLElement} */ ($timelineTabs.querySelector('div[role="tablist"] > div:nth-child(2) > [role="tab"]'))
  if (!$followingTabLink) {
    warn('could not find Following tab link')
    return
  }
  $followingTabLink.parentElement.classList.add('FollowingTabContainer')

  if (settings.defaultToFollowing && !document.title.startsWith(separatedTweetsTimelineTitle)) {
    let isForYouTabSelected = Boolean($timelineTabs.querySelector('div[role="tablist"] > div:first-child > [role="tab"][aria-selected="true"]'))
    if (isForYouTabSelected && (!wasForYouTabSelected || settings.hideForYouTimeline)) {
      log('switching to Following timeline')
      $followingTabLink.click()
      wasForYouTabSelected = false
    } else {
      wasForYouTabSelected = isForYouTabSelected
    }
  }

  let homeNavLinkPromise = getElement(Selectors.NAV_HOME_LINK, {
    name: 'home nav link',
    stopIf: pathIsNot(lastUrlPath),
  })

  if (shouldShowSeparatedTweetsTab()) {
    let $newTab = /** @type {HTMLElement} */ ($timelineTabs.querySelector('#cpftSeparatedTweetsTab'))
    if ($newTab) {
      log('separated tweets timeline tab already present')
      $newTab.querySelector('span').textContent = separatedTweetsTimelineTitle
    } else {
      run(async() => {
        let $forYouTabLink = /** @type {HTMLElement} */ ($timelineTabs.querySelector('div[role="tablist"] > div:first-child > [role="tab"]'))
        if (!$forYouTabLink) {
          warn('could not find For you tab to clone for separated tweets tab')
          return
        }
        log('inserting separated tweets tab')
        $newTab = /** @type {HTMLElement} */ ($forYouTabLink.parentElement.cloneNode(true))
        $newTab.id = 'cpftSeparatedTweetsTab'
        $newTab.querySelector('span').textContent = separatedTweetsTimelineTitle
        let $link = $newTab.querySelector('[role="tab"]')
        if (!$link) {
          warn('could not find tab link in separated tweets tab')
          return
        }
        $link.removeAttribute('aria-selected')

        // We assume navigation has occurred when the document title changes, so
        // by changing the title we fake navigation to a non-existent page
        // representing the separated tweets timeline.
        $link.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!document.title.startsWith(separatedTweetsTimelineTitle)) {
            // The separated tweets tab belongs to the Following tab
            if ($followingTabLink.getAttribute('aria-selected') != 'true') {
              log('switching to the Following tab for separated tweets')
              $followingTabLink.click()
            }
            setTitle(separatedTweetsTimelineTitle)
          }
          window.scrollTo({top: 0})
        })
        $followingTabLink.parentElement.insertAdjacentElement('afterend', $newTab)

        // Return to the Home timeline when any other tab is clicked
        $followingTabLink.parentElement.parentElement.addEventListener('click', () => {
          if (location.pathname == PagePaths.HOME && currentPage != getString('HOME')) {
            log('setting title to Home')
            homeNavigationIsBeingUsed = true
            setTitle(getString('HOME'))
          }
        })

        let $homeNavLink = await homeNavLinkPromise
        if (!$homeNavLink) return

        // Return to the Home timeline when the Home nav link is clicked
        if (!$homeNavLink.dataset.cpftListener) {
          $homeNavLink.addEventListener('click', () => {
            homeNavigationIsBeingUsed = true
            if (location.pathname == PagePaths.HOME && currentPage != getString('HOME')) {
              setTitle(getString('HOME'))
            }
          })
          $homeNavLink.dataset.cpftListener = 'true'
        }

        // Click the Home nav link when the Following tab is clicked while on
        // the separated Tweets timeline to switch back to Following without
        // opening the menu.
        $followingTabLink.parentElement.addEventListener('click', (e) => {
          if (currentPage != getString('HOME')) {
            e.preventDefault()
            e.stopPropagation()
            log('clicking the Home nav link to return to Following')
            $homeNavLink.click()
          }
        })
      })
    }
  } else {
    removeMobileTimelineHeaderElements()
  }

  if (settings.hideFollowingMenu) {
    run(async () => {
      let $homeNavLink = await homeNavLinkPromise
      if (!$homeNavLink) return
      $followingTabLink.parentElement.addEventListener('click', (e) => {
        if (selectedHomeTabIndex == 1) {
          e.preventDefault()
          e.stopPropagation()
          log('clicking the Home nav link to refresh Following')
          $homeNavLink.click()
        }
      })
    })
  }
}

/**
 * Restores "Tweet" button text.
 */
async function tweakTweetButton() {
  let $tweetButton = await getElement(`${desktop ? Selectors.PRIMARY_COLUMN: 'main'} button[data-testid^="tweetButton"]`, {
    name: 'tweet button',
  })
  if ($tweetButton) {
    let $text = $tweetButton.querySelector('span > span')
    if ($text) {
      setTweetButtonText($text)
    } else {
      warn('could not find Tweet button text')
    }
  }
}

function tweakTweetEngagementPage() {
  if (settings.revertXBranding) {
    let $headingText = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} h2 span`)
    if ($headingText) {
      if ($headingText.textContent != getString('TWEET_INTERACTIONS')) {
        $headingText.textContent = getString('TWEET_INTERACTIONS')
      }
    } else {
      warn('could not find Post engagement heading')
    }
  }

  let $tabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)
  if ($tabs == null) {
    warn('could not find Post engagement tabs')
    return
  }

  if (settings.revertXBranding) {
    let $quoteTweetsTabText = $tabs.querySelector('div[role="tablist"] > div:nth-child(1) div[dir] > span')
    if ($quoteTweetsTabText) $quoteTweetsTabText.textContent = getString('QUOTE_TWEETS')
    let $retweetsTabText = $tabs.querySelector('div[role="tablist"] > div:nth-child(2) div[dir] > span')
    if ($retweetsTabText) $retweetsTabText.textContent = getString('RETWEETS')
  }

  if (settings.premiumBlueChecks != 'ignore') {
    observeTimeline(currentPage, {classifyTweets: false})
  }
}

function tweakTweetIcon() {
  let $iconPath = document.querySelector(`:is([data-testid="SideNav_NewTweet_Button"], [data-testid="FloatingActionButtons_Tweet_Button"]) path[d="${Svgs.PLUS_PATH}"]`)
  if ($iconPath) {
    // Safari doesn't support using `d: path(…)` to replace paths in an SVG, so
    // we have to manually patch the path in it.
    if ($iconPath.getAttribute('d') != Svgs.TWITTER_FEATHER_PLUS_PATH) {
      $iconPath.setAttribute('d', Svgs.TWITTER_FEATHER_PLUS_PATH)
    }
  }
}

/** @param {string} reason */
function updateNativePalette(reason) {
  let palette = getThemePaletteFromState()
  if (!palette || palette == nativePalette) return
  log('customTheme: native palette changed', {primary: palette.primary})
  nativePalette = palette
  refreshThemeRules(reason)
  configureThemeCss()
}

//#region Safari icon patchers
// Safari doesn't support using `d: path(…)` to replace paths in an SVG, so we
// have to manually patch paths for it.
/**
 * @param {Element} $svg
 */
function blueCheck($svg) {
  if (!$svg) {
    warn('blueCheck was given', $svg)
    return
  }
  $svg.classList.add('cpft_blue_check')
  if (isSafari && settings.premiumBlueChecks == 'replace') {
    $svg.firstElementChild.firstElementChild.setAttribute('d', Svgs.TWITTER_BLUE_LOGO_PATH)
  }
}

/**
 * @param {Element} $svgPath
 */
function twitterLogo($svgPath) {
  $svgPath.setAttribute('d', Svgs.TWITTER_LOGO_PATH)
  $svgPath.classList.add('cpft_logo')
}
//#endregion
//#endregion

//#region Main
async function main({processImmediately = false} = {}) {
  log('site version', 'rweb')
  storeConfigChanges({lastSiteVersion: 'rweb'})
  if (!enabled) return

  // Reset state so initial setup runs again when re-enabled
  currentPage = ''
  currentPagePath = ''
  lastUrlPath = ''
  lastUrlWasModal = false
  observingPageChanges = false
  filterBlurRule = null
  fontFamilyRule = null
  fontSize = null
  lastFlexDirection = null

  observeFavicon()
  observeTitle()
  observeThemeMeta()

  $body = await getElement('body', {
    name: '<body>',
    observers: globalObservers,
    context: document.documentElement,
    mutationObserverOptions: {childList: true},
  })

  let $appWrapper = await getElement('#layers + div', {
    name: 'app wrapper',
    observers: globalObservers,
  })

  $reactRoot = document.querySelector('#react-root')
  // Locales use xweb's catalog codes
  let languageAliases = {ms: 'msa', nb: 'no', zh: 'zh-cn', 'zh-Hant': 'zh-tw'}
  lang = languageAliases[$html.lang] || $html.lang
  dir = $html.dir
  ltr = dir == 'ltr'

  observeElement($appWrapper, () => {
    let flexDirection = getComputedStyle($appWrapper).flexDirection

    mobile = flexDirection == 'column'
    desktop = !mobile

    /** @type {'mobile' | 'desktop'} */
    let lastLayout = mobile ? 'mobile' : 'desktop'
    // Let the options page know the last layout which was active
    storeConfigChanges({lastLayout})

    if (lastFlexDirection == null) {
      log('initial config', {enabled, config: settings, lang, lastLayout})

      // One-time setup
      nativePalette = getThemePaletteFromState() || nativePalette
      observeBodyBackgroundColor()
      observeReRenderBoundary()
      observeReactNativeStylesheet()
      patchHistory()
      interceptMediaButton()
      if (desktop) {
        fontSize = $html.style.fontSize
        if (!fontSize) {
          warn('initial fontSize not set on <html>')
        }
      }

      // Repeatable configuration setup
      configureSeparatedTweetsTimelineTitle()
      configureCss()
      configureDynamicCss()
      configureFeatureFlags()
      configureThemeCss()
      configureCustomCss()
      bypassMediaContextMenu()
      configureCleanTweetLinks()
      configureVideoLooping(preventVideoReplay)
      observePopups()
      observeSideNavItems()

      // Start taking action on page changes
      observingPageChanges = true

      // Replay the initial title after setup if its observer ran before startup
      if ((processImmediately || !currentPagePath) && document.querySelector('title')) {
        processImmediately = false
        onTitleChange(document.title)
      }

      // Remove the loading stylesheet if the content script added one
      let $loadingStylesheet = document.querySelector('style#cpftLoading')
      if ($loadingStylesheet) {
        requestAnimationFrame(() => $loadingStylesheet.remove())
      }
    }
    else if (flexDirection != lastFlexDirection) {
      log('layout changed', {lastLayout})
      fontSize = desktop ? $html.style.fontSize : null
      // Reconfigure for the new layout
      onSettingsChanged()
    }

    $body.classList.toggle('Mobile', mobile)
    $body.classList.toggle('Desktop', desktop)

    lastFlexDirection = flexDirection
  }, {
    leading: true,
    name: 'app wrapper class attribute for version changes (mobile ↔ desktop)',
    observers: globalObservers,
  }, {
    attributes: true,
    attributeFilter: ['class']
  })
}

function onDisabled() {
  // These functions have teardowns when disabled
  configureCss()
  configureFeatureFlags()
  configureFont()
  configureDynamicCss()
  configureThemeCss()
  configureCustomCss()
  bypassMediaContextMenu()
  configureCleanTweetLinks()
  configureVideoLooping(preventVideoReplay)
  // Manually remove custom UI elements which clone existing elements, as
  // adding a hidden attribute won't hide them by default.
  document.querySelector('#cpftSeparatedTweetsTab')?.remove()
  document.querySelectorAll('.cpft_menu_item').forEach(el => el.remove())
}

/**
 * @param {Set<import("./types").UserSettingsKey>} changedSettings
 */
function onSettingsChanged(changedSettings = new Set()) {
  configureCss()
  configureFont()
  configureDynamicCss()
  configureThemeCss()
  configureCustomCss()
  bypassMediaContextMenu()
  configureCleanTweetLinks()
  configureVideoLooping(preventVideoReplay)
  observePopups()
  observeSideNavItems()

  if (changedSettings.has('darkModeTheme')) {
    observeThemeMeta.update()
  }
  if (changedSettings.has('revertXBranding') || changedSettings.has('hideNotifications')) {
    observeFavicon.forceUpdate(getNotificationCount() > 0)
  }
  // Store the current notification count if hiding notifications was enabled
  if (changedSettings.has('hideNotifications') && settings.hideNotifications != 'ignore') {
    hiddenNotificationCount = currentNotificationCount
  }

  let navigationTriggered = (
    configureSeparatedTweetsTimelineTitle() ||
    checkForDisabledHomeTimeline()
  )

  if (changedSettings.has('hideNotifications')) {
    // Hide or show the notification count in the title. The title will already
    // have been updated if other navigation was triggered.
    if (!navigationTriggered) {
      setTitle(currentPage)
      navigationTriggered = true
    }
    // Clear the stored notification count if hiding notifications was disabled
    if (settings.hideNotifications == 'ignore') {
      hiddenNotificationCount = ''
    }
  }

  // Only re-process the current page if navigation wasn't already triggered
  // while applying config changes.
  if (!navigationTriggered) {
    processCurrentPage()
  }
}

function configureRequestPatches() {
  patchRequests({
    patchUrl(method, url) {
      if (settings.sortReplies != 'relevant' && !userSortedReplies && url.includes('/TweetDetail?')) {
        try {
          let request = new URL(url)
          let params = new URLSearchParams(request.search)
          let variables = JSON.parse(decodeURIComponent(params.get('variables')))
          if (typeof variables?.rankingMode == 'string') {
            let rankingMode = {
              liked: 'Likes',
              recent: 'Recency',
            }[settings.sortReplies]
            if (variables.rankingMode != rankingMode) {
              log('sortReplies: forcing sort by', settings.sortReplies)
              variables.rankingMode = rankingMode
              params.set('variables', JSON.stringify(variables))
              url = `${request.origin}${request.pathname}?${params.toString()}`
            }
          } else {
            warn('sortReplies: typeof variables.rankingMode is', typeof variables?.rankingMode)
          }
        } catch (e) {
          error('sortReplies: error patching rankingMode', e)
        }
      }
      if (method == 'GET' && settings.defaultFollowingToRecent && !userSortedFollowing) return patchFollowingUrl(url)
      return url
    },
    shouldPatchBody(method, url) {
      return method == 'POST' && settings.defaultFollowingToRecent && !userSortedFollowing && isFollowingTimelineRequest(url)
    },
    patchBody: patchFollowingBody,
  })
}
//#endregion

return function init() {
  configureRequestPatches()
  setupConfig({main, onSettingsChanged, onDisabled, onDebugChanged: configureThemeCss})
}

}()
//#endregion

//#region xweb
const xweb = function() {

//#region Constants
/** @type {Record<string, import('./types').LocaleKey>} */
const BRANDING_TRANSLATIONS = {
  'Embed post': 'EMBED_TWEET',
  'New post': 'NEW_TWEET',
  'Post Analytics': 'TWEET_ANALYTICS',
  'Post activity': 'TWEET_INTERACTIONS',
  'Post all': 'TWEET_ALL',
  'Post your reply': 'TWEET_YOUR_REPLY',
  'Post': 'TWEET_NOUN',
  'Posts': 'TWEETS',
  'Post{verb}': 'TWEET',
  'Quote': 'QUOTE_TWEET',
  'Quotes': 'QUOTE_TWEETS',
  'Report post': 'REPORT_TWEET',
  'Repost': 'RETWEET',
  'Reposts': 'RETWEETS',
  'Show {count, plural, one {# post} other {# posts}}': 'SHOW_TWEETS',
  'Turn off reposts': 'TURN_OFF_RETWEETS',
  'Turn on reposts': 'TURN_ON_RETWEETS',
  'Undo repost': 'UNDO_RETWEET',
  'Unsent posts': 'UNSENT_TWEETS',
  'View post activity': 'TWEET_INTERACTIONS',
  'View post analytics': 'VIEW_TWEET_ANALYTICS',
  'You reposted': 'YOU_RETWEETED',
  'Your post was sent.': 'TWEET_SENT',
  '{formattedCount} {count, plural, one {post} other {posts}}': 'TWEET_COUNT',
  '{formattedCount} {count, plural, one {quote} other {quotes}}': 'QUOTE_TWEET_COUNT',
  '{formattedCount} {count, plural, one {repost} other {reposts}}': 'RETWEET_COUNT',
  '{name} on X: "{text}"': 'TWEET_TITLE',
  '{name} reposted': 'USER_RETWEETED',
}
const COMPOSER_SELECTOR = '[data-media-upload-dropzone] form'
const COMPOSER_MODAL_SELECTOR = `[data-slot="xds-modal-surface"]:has(${COMPOSER_SELECTOR})`
const COMPOSER_SUBMIT_BUTTON_SELECTOR = `${COMPOSER_SELECTOR} button.bg-btn-primary`
const COMPOSER_TOOLBAR_SELECTOR = `${COMPOSER_SELECTOR} div:has(> [data-truncated-list], > [class~="group/carousel"])`
const COMPOSE_BUTTON_SELECTOR = ':is(#sidebar-compose-post, button[data-compose-fab="true"])'
const COMPOSE_ICON_SELECTOR = `${COMPOSE_BUTTON_SELECTOR} svg:is([data-icon="icon-edit-plus"], [data-icon="icon-new-chat"])`
const DESKTOP_NAV_CONTAINER_SELECTOR = 'body > div > div.hidden[class~="sm:block"]'
const DESKTOP_NAV_SELECTOR = 'nav:has(> a[href="/home"])'
const EMBED_ACCENT_TOKENS = ['--x-fg-brand', '--x-fg-on-brand', '--x-btn-brand', '--x-btn-brand-hover', '--x-btn-brand-pressed']
const FOCUSED_TWEET_SELECTOR = ':is([data-navigation-stop][tabindex="-1"], [data-cpft-focused-tweet]):has(> article)'
const HOME_TIMELINE_TAB_SELECTOR = 'main [role="tab"][data-pinned-timeline]'
const LOGO_PATH_SELECTOR = ':is(a[href="/home"], header[data-page-header]) svg[data-icon="icon-logo-x"] > path'
const MEDIA_VIEWER_SELECTOR = () => `[role="dialog"][data-slot="xds-modal-surface"][aria-label=${JSON.stringify(getString('MEDIA_VIEWER'))}]`
const MOBILE_NAV_SELECTOR = 'nav:has(> div > a[href="/home"], > div svg:is([data-icon="icon-home"], [data-icon="icon-home-fill"]))'
const HOME_ICON_SELECTOR = `:is(nav:has(> a[href="/home"]) a[href="/home"], ${MOBILE_NAV_SELECTOR} > div > :is(a, button)) svg`
const SETTINGS_MODAL_SELECTOR = '[data-base-ui-portal] [role="dialog"][data-slot="xds-modal-surface"]:has(nav a[href="/settings/account"])'
const TAB_UNDERLINE_SELECTOR = '[role="tab"] > span[class~="h-[3px]"]'
const TWEET_ENGAGEMENT_PATH_RE = /^(\/[a-zA-Z\d_]{1,20}\/status\/\d+)\/(quotes|retweets|reposts|likes)\/?$/
const TWITTER_BLUE = 'rgb(29, 155, 240)'

//#region Routes
/** @type {[string, RegExp][]} */
const PAGE_ROUTES = [
  ['Calls', /^\/i\/calls(?:\/|$)/],
  ['Chat', /^\/i\/chat(?:\/|$)/],
  ['Communities', /^\/(?:[a-zA-Z\d_]{1,20}\/communities(?:\/explore)?|i\/communities(?:\/suggested)?)\/?$/],
  ['Community', /^\/i\/communities\/\d+(?:\/(?:latest|media|about))?\/?$/],
  ['CommunityMembers', /^\/i\/communities\/\d+\/(?:members|moderators)\/?$/],
  ['ComposeTweetPage', /^\/compose\/post(?:\/|$)/],
  ['Connect', /^\/i\/(?:connect_people|follow_people)(?:\/|$)/],
  ['Explore', /^\/explore(?:\/|$)/],
  ['FollowList', /^\/[a-zA-Z\d_]{1,20}\/(?:verified_followers|follow(?:ing|ers|ers_you_follow)|creator-subscriptions\/subscriptions)\/?$/],
  ['Grok', /^\/i\/grok(?:\/|$)/],
  ['History', /^\/i\/history(?:\/|$)/],
  ['HomeTimeline', /^\/home\/?$/],
  ['List', /^\/i\/lists\/\d+(?:\/|$)/],
  ['Lists', /^\/[a-zA-Z\d_]{1,20}\/lists\/?$/],
  ['MediaViewer', /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/(?:(?:photo|video)\/\d+|mediaviewer)\/?$/],
  ['Notifications', /^\/notifications(?:\/|$)/],
  ['PremiumSignup', /^\/i\/premium_sign_up(?:\/|$)/],
  ['Search', /^\/(?:search|hashtag)(?:\/|$)/],
  ['Settings', /^\/settings(?:\/|$)/],
  ['Trending', /^\/i\/trending\/\d+\/?$/],
  ['Tweet', /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/?$/],
  ['QuoteTweets', /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/quotes\/?$/],
  ['TweetEngagement', /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/(?:retweets|reposts|likes)\/?$/],
]
const PERSISTENT_TAB_PAGES = new Set(['Communities', 'Community', 'History', 'Notifications', 'Profile', 'Search'])
const ROUTED_MODAL_SELECTORS = new Map([
  ['Settings', () => SETTINGS_MODAL_SELECTOR],
  ['ComposeTweetPage', () => '[data-base-ui-portal] [role="dialog"][data-slot="xds-modal-surface"]'],
  ['MediaViewer', () => `[data-base-ui-portal] ${MEDIA_VIEWER_SELECTOR()}`],
])
//#endregion
//#endregion

//#region State
let $pageMain = null
/** @type {string | null} */
let appliedDocumentTitle = null
let brandingTranslator = null
let currentNotificationCount = ''
let currentPageType = ''
let currentPageUrl = ''
/** @type {string | null} */
let nativeDocumentTitle = null
let refreshHomeTimeline = null
let requestedFollowing = null
let selectedHomeTab = ''
let separatedTweetsTimelineSelected = false
let userSortedFollowing = false
let viewerRouter = null
let wasForYouTabSelected = false
let replySortTweetId = ''
let userSortedReplies = false
let requestedReplySort = ''
//#endregion

//#region React state functions
function createConversationStateReader() {
  let router = null
  let lastSource = null
  let indexed = false
  let recordIds = new Map()
  /** @param {Set<string>} ids */
  function readConversationState(ids) {
    router ||= findRouter()
    let context = router?.options?.context
    let source = context?.relayEnvironment?.getStore()?.getSource()
    if (typeof source?.get != 'function') return null
    if (source != lastSource) {
      lastSource = source
      recordIds.clear()
      indexed = false
    }
    let authors = new Map()
    let counts = new Map()
    for (let id of ids) {
      // Relay normally keys tweets by base64 Tweet:<rest_id> - other keys need an index
      let tweet = source.get(btoa(`Tweet:${id}`))
      if (tweet?.__typename != 'Tweet' || String(tweet.rest_id) != id) {
        if (!indexed && typeof source.getRecordIDs == 'function') {
          for (let key of source.getRecordIDs()) {
            let record = source.get(key)
            if (record?.__typename == 'Tweet') recordIds.set(String(record.rest_id), key)
          }
          indexed = true
        }
        let key = recordIds.get(id)
        tweet = key ? source.get(key) : null
      }
      if (tweet?.__typename == 'Tweet' && String(tweet.rest_id) == id) {
        authors.set(id, getRelayTweetAuthor(source, tweet))
        // Relay stores tweet counts in a separate normalized record
        let metrics = typeof tweet.counts?.__ref == 'string' ? source.get(tweet.counts.__ref) : tweet.counts
        let count = key => typeof metrics?.[key] == 'number' && Number.isFinite(metrics[key]) && metrics[key] >= 0 ? metrics[key] : null
        counts.set(id, {quotes: count('quote_count'), retweets: count('retweet_count'), likes: count('favorite_count'), bookmarks: count('bookmark_count')})
      }
    }
    return {viewer: {id: context.viewerId, screenName: context.viewerScreenName}, authors, counts}
  }

  function subscribeCounts(id, onChange) {
    readConversationState(new Set([id]))
    let store = router?.options?.context?.relayEnvironment?.getStore()
    if (typeof store?.lookup != 'function' || typeof store?.subscribe != 'function') return null
    let node = {
      kind: 'Fragment', name: 'CPFTFocusedMetrics', type: 'Tweet', metadata: null,
      abstractKey: null, argumentDefinitions: [],
      selections: [{
        kind: 'LinkedField', name: 'counts', alias: null, args: null,
        concreteType: 'ApiCounts', plural: false, storageKey: null,
        selections: ['quote_count', 'retweet_count', 'favorite_count'].map(name => ({
          kind: 'ScalarField', name, alias: null, args: null, storageKey: null,
        })),
      }],
    }
    // Relay's reader requires a request owner even for this local-only read
    let owner = {
      identifier: `cpft-focused-metrics:${id}`, variables: {}, cacheConfig: {},
      node: {
        kind: 'Request', fragment: node,
        operation: {kind: 'Operation', name: node.name, argumentDefinitions: [], selections: []},
        params: {name: node.name, operationKind: 'query', id: null, text: null, metadata: {}},
      },
    }
    try {
      let snapshot = store.lookup({dataID: recordIds.get(id) || btoa(`Tweet:${id}`), node, variables: {}, owner})
      let subscription = store.subscribe(snapshot, onChange)
      return () => subscription.dispose()
    } catch {
      return null
    }
  }
  return Object.assign(readConversationState, {subscribeCounts})
}

function getRelayTweetAuthor(source, tweet) {
  function at(record, ...fields) {
    for (let field of fields) {
      record = record?.[field]
      if (typeof record?.__ref == 'string') record = source.get(record.__ref)
    }
    return record ?? null
  }
  let result = at(tweet, 'core', 'user_results', 'result')
  let user = at(result, 'user') || result
  if (!user) return null
  return {
    id: user.rest_id ?? null,
    screenName: at(user, 'core', 'screen_name'),
    following: at(user, 'relationship_perspectives', 'following'),
    followedBy: at(user, 'relationship_perspectives', 'followed_by'),
    followersCount: at(user, 'relationship_counts', 'followers'),
    blueVerified: at(user, 'verification', 'is_blue_verified'),
    verifiedType: at(user, 'verification', 'verified_type'),
  }
}

function viewerHasPremium() {
  let context = findRouter()?.options?.context
  let claims = context?.viewerClaims
  if (!context?.viewerId || !Array.isArray(context.viewerClaimEntries) || typeof claims?.hasSubscription != 'function') return null
  // Premium tiers and verified organizations qualify under X's general Premium check
  return ['premium_basic', 'premium_standard', 'premium_plus'].some(tier => claims.hasSubscription(tier)) ||
    claims.isPaidVerifiedOrg?.() === true || claims.isVerifiedOrgAffiliate?.() === true || claims.isLegacyVerifiedOrg?.() === true
}

function viewerCanAddWorkExperience() {
  let context = findRouter()?.options?.context
  let claims = context?.viewerClaims
  if (!context?.viewerId || !Array.isArray(context.viewerClaimEntries) || typeof claims?.hasSubscription != 'function') return null
  return claims.hasSubscription('premium_standard') || claims.hasSubscription('premium_plus')
}
//#endregion

//#region Title handling
/**
 * xweb always applies the current notification count when the title changes. To
 * avoid causing an infinite loop when removing the notification count for the
 * hideNotifications feature, we remove it in the document.title setter, before
 * the write reaches the DOM.
 */
const configureTitleSetter = (() => {
  let name = 'title setter'
  /** @type {PropertyDescriptor | null} */
  let original = null
  /** @type {PropertyDescriptor | undefined} */
  let own
  let setter = null
  /** @type {{native: string, display: string} | null} */
  let pending = null

  function configure() {
    if (!enabled || settings.hideNotifications == 'ignore') {
      globalObservers.get(name)?.disconnect()
      return
    }
    if (setter) return
    own = Object.getOwnPropertyDescriptor(document, 'title')
    let owner = document
    let descriptor = own
    while (!descriptor && (owner = Object.getPrototypeOf(owner))) descriptor = Object.getOwnPropertyDescriptor(owner, 'title')
    if (own?.configurable === false || !descriptor?.get || !descriptor?.set) {
      warn('title count hiding unavailable: title accessor cannot be wrapped')
      return
    }
    let accessor = descriptor
    let wrapped = function(value) {
      // Other extensions may retain our retired setter - it must keep delegating
      if (this != document || setter != wrapped || !enabled || settings.hideNotifications == 'ignore') return accessor.set.call(this, value)
      let title = `${value}`
      let display = formatPageTitle(title)
      nativeDocumentTitle = title
      appliedDocumentTitle = display
      currentNotificationCount = TITLE_NOTIFICATION_RE.exec(title)?.[0] || ''
      if (accessor.get.call(document) != display) {
        pending = {native: title, display}
        accessor.set.call(document, display)
      } else if (pending?.display == display) pending.native = title
      // A suppressed count-only write has no DOM mutation to notify our observer
      observeFavicon.update()
    }
    try {
      Object.defineProperty(document, 'title', {
        configurable: true, enumerable: accessor.enumerable,
        get: accessor.get, set: wrapped,
      })
    } catch {
      warn('title count hiding unavailable: title accessor cannot be wrapped')
      return
    }
    original = accessor
    setter = wrapped
    globalObservers.set(name, {name, disconnect() {
      // Leave a later accessor installed by another extension intact
      if (Object.getOwnPropertyDescriptor(document, 'title')?.set == wrapped) {
        if (own) Object.defineProperty(document, 'title', own)
        else delete document.title
      }
      setter = null
      original = null
      pending = null
      globalObservers.delete(name)
    }})
  }

  configure.active = () => setter != null && Object.getOwnPropertyDescriptor(document, 'title')?.set == setter
  configure.consume = title => {
    let incoming = pending?.display == title ? pending.native : title
    pending = null
    return incoming
  }
  configure.write = title => {
    pending = null
    // Our formatted writes must not overwrite the cached native count
    if (original) original.set.call(document, title)
    else document.title = title
  }
  return configure
})()

/** @param {string} title */
function onTitleChange(title, {force = false, native = false} = {}) {
  if (!enabled) return
  title = configureTitleSetter.consume(title)
  title = updatePageTitle((title || '').trim(), {native})
  currentNotificationCount = TITLE_NOTIFICATION_RE.exec(title)?.[0] || ''
  let background = getModalBackgroundLocation()
  if (background) {
    if (currentPagePath != background.pathname || ROUTED_MODAL_SELECTORS.has(currentPageType)) {
      currentPagePath = background.pathname
      lastUrlPath = background.pathname
      currentPageUrl = background.pathname + background.search
      currentPage = getString('HOME')
      processCurrentPage()
    } else if (force) processCurrentPage()
    return
  }
  title = title.replace(TITLE_NOTIFICATION_RE, '')
  // Tweet text and search terms can contain slashes - strip only brand prefixes/suffixes
  for (let brand of ['X', getString('TWITTER')]) {
    if (title.endsWith(` / ${brand}`)) title = title.slice(0, -` / ${brand}`.length)
    else if (title.startsWith(`${brand} \\ `)) title = title.slice(`${brand} \\ `.length)
  }
  let path = location.pathname
  let url = path + location.search
  let isTweet = getPageType(path, '') == 'Tweet'
  let genericTitle = !title || title == 'X' || title == getString('TWITTER')
  // A cached focused Tweet can render while its route still has a generic title
  if (genericTitle && !isTweet) return
  if (!force && isTweet && currentPageType == 'Tweet' && url == currentPageUrl) {
    if (!genericTitle) currentPage = title
    return
  }
  if (!force && title == currentPage &&
      (url == currentPageUrl || (PERSISTENT_TAB_PAGES.has(currentPageType) && syncPageUrl()))) return
  currentPage = title
  currentPagePath = path
  lastUrlPath = path
  currentPageUrl = url
  processCurrentPage()
}

function restorePageTitle() {
  if (nativeDocumentTitle != null && document.title == appliedDocumentTitle) writeDocumentTitle(nativeDocumentTitle)
  nativeDocumentTitle = null
  appliedDocumentTitle = null
}

/** @param {string} title */
function formatPageTitle(title) {
  let count = TITLE_NOTIFICATION_RE.exec(title)?.[0] || ''
  title = title.slice(count.length)
  // Some route heads translate the page label, then append " / X" themselves.
  if (enabled && settings.revertXBranding) {
    let twitter = getString('TWITTER')
    if (title == 'X') title = twitter
    else if (title.endsWith(' / X')) title = title.slice(0, -1) + twitter
    else if (title.startsWith('X \\ ')) title = twitter + title.slice(1)
  }
  if (enabled && settings.hideNotifications != 'ignore' && configureTitleSetter.active()) count = ''
  return count + title
}

function updatePageTitle(title, {native = false} = {}) {
  if (native || nativeDocumentTitle == null || title != appliedDocumentTitle) nativeDocumentTitle = title
  let display = formatPageTitle(nativeDocumentTitle)
  appliedDocumentTitle = display
  writeDocumentTitle(display)
  return nativeDocumentTitle
}

function writeDocumentTitle(title) {
  if (document.title == title) return
  configureTitleSetter.write(title)
  // Extension title writes must not be reprocessed as native updates
  let observer = /** @type {import("./types").NamedMutationObserver} */ (globalObservers.get('page title'))
  observer?.takeRecords?.()
}
//#endregion

//#region Page functions
function getModalBackgroundLocation() {
  let selector = ROUTED_MODAL_SELECTORS.get(getPageType(location.pathname, ''))?.()
  if (!selector || !document.querySelector(selector)) return null
  // Identify Home by its tabs
  if (document.querySelector(HOME_TIMELINE_TAB_SELECTOR)) return {pathname: '/home', search: ''}
  if (currentPagePath && !ROUTED_MODAL_SELECTORS.has(currentPageType) && $pageMain?.isConnected &&
      document.querySelector('main') == $pageMain) {
    return {pathname: currentPagePath, search: currentPageUrl.slice(currentPagePath.length)}
  }
  return null
}

function getPageType(path, title) {
  for (let [type, pattern] of PAGE_ROUTES) {
    if (pattern.test(path)) return type
  }
  let username = /^\/([a-zA-Z\d_]{1,20})(?:\/(?:all|affiliates|with_replies|reposts|subs|superfollows|highlights|articles|media|likes))?\/?$/.exec(path)?.[1]?.toLowerCase()
  if (username && (title.toLowerCase().includes(`@${username}`) || title.toLowerCase().includes(`${username}@`))) {
    return 'Profile'
  }
  return ''
}

// Routed overlays leave the rendered page and its observers intact
function getPageLocation() {
  return getModalBackgroundLocation() || {pathname: location.pathname, search: location.search}
}

function getSeparatedTweetsTimelineTitle() {
  if (settings.retweets == 'separate' && settings.quoteTweets == 'separate') {
    return getString(settings.revertXBranding ? 'SHARED_TWEETS' : 'SHARED')
  }
  if (settings.quoteTweets == 'separate') {
    return getString(settings.revertXBranding ? 'QUOTE_TWEETS' : 'QUOTES')
  }
  return getString(settings.revertXBranding ? 'RETWEETS' : 'REPOSTS')
}

function hasSeparatedTweetsTimeline() {
  return settings.retweets == 'separate' || settings.quoteTweets == 'separate'
}

function isOnSeparatedTweetsTimeline() {
  return currentPageType == 'HomeTimeline' && separatedTweetsTimelineSelected && hasSeparatedTweetsTimeline()
}

function processCurrentPage() {
  if (!enabled || !currentPagePath || !document.body) return
  disconnectObservers(pageObservers, 'page')
  $pageMain = document.querySelector('main')
  let type = getPageType(currentPagePath, currentPage)
  if (currentPageType && currentPageType != type) document.body.classList.remove(currentPageType)
  if (type) document.body.classList.add(type)
  currentPageType = type
  if (type != 'Tweet' && getPageType(location.pathname, '') != 'MediaViewer') {
    replySortTweetId = ''
    userSortedReplies = false
    requestedReplySort = ''
  }
  log('processing page', {type, title: currentPage, path: currentPagePath, url: currentPageUrl})
  configureCss.refreshPremium()
  configureBranding()
  if (configureRedirects()) return
  if (type == 'PremiumSignup') dismissPremiumSignupModal()
  if (type == 'Chat' || type == 'Calls') observeEmbeddedTheme(type)

  if (type == 'QuoteTweets' || type == 'TweetEngagement') {
    tweakTweetEngagementPage()
  } else if (type == 'Explore') {
    tweakExplorePage()
  } else if (type == 'HomeTimeline') {
    tweakHomeTimelinePage()
  } else if (ROUTED_MODAL_SELECTORS.has(type)) {
    tweakRoutedModalPage(type)
  } else {
    requestedFollowing = null
    if (type == 'List' || type == 'Profile' || type == 'Trending' || type == 'Community') {
      if (type == 'Profile' && settings.hideSubscriptions) observeProfileSubscriptions()
      observePageTimeline({containerSelector: ':scope > div'})
    } else if (type == 'FollowList' && settings.hideVerifiedTabs) {
      // A direct visit can reach title setup before the follow-list UI mounts
      getElement('main [role="tablist"] > a[role="tab"][href$="/followers"]', {
        name: 'follow list tabs', observers: pageObservers,
      }).then($tabs => { if ($tabs && syncPageUrl()) configureRedirects() })
    } else if (type == 'Tweet') {
      tweakIndividualTweetPage()
    } else if (type == 'History') {
      observePageTimeline({
        containerSelector: 'header[data-page-header] + *',
        // Search retains the hidden bookmarks timeline while mounting results separately
        timelineSelector: () => new URLSearchParams(getPageLocation().search).get('search') == 'true'
          ? '[id^="urt:bookmark-search:"]'
          : '[id^="urt:"]:not([id^="urt:bookmark-search:"])',
      })
    } else if (PERSISTENT_TAB_PAGES.has(type)) {
      observePageTimeline({containerSelector: 'header[data-page-header] + div'})
    }
  }
}

function resetPage() {
  if (currentPageType) document.body?.classList.remove(currentPageType)
  $pageMain = null
  currentNotificationCount = ''
  currentPage = ''
  currentPagePath = ''
  currentPageType = ''
  currentPageUrl = ''
  lastUrlPath = ''
  requestedFollowing = null
  selectedHomeTab = ''
  separatedTweetsTimelineSelected = false
  wasForYouTabSelected = false
  viewerRouter = null
  replySortTweetId = ''
  userSortedReplies = false
  requestedReplySort = ''
}

/** @param {boolean} separated */
function selectHomeTimeline(separated) {
  if (separatedTweetsTimelineSelected == separated) return
  separatedTweetsTimelineSelected = separated
  refreshHomeTimeline?.()
}

/**
 * Tabbed pages retain their observers across URL changes within the same page type.
 * @returns {boolean}
 */
function syncPageUrl() {
  let {pathname: path, search} = getPageLocation()
  let persistent = PERSISTENT_TAB_PAGES.has(currentPageType)
  if (path != currentPagePath && (!persistent || getPageType(path, currentPage) != currentPageType)) return false
  let url = path + search
  if (persistent && url != currentPageUrl) {
    log('page tab URL changed', {type: currentPageType, from: currentPageUrl, to: url})
    currentPagePath = path
    lastUrlPath = path
    currentPageUrl = url
  }
  return true
}

//#endregion

//#region Global observers
/**
 * @param {Element} $target
 * @param {string} screenName
 * @param {{focused?: boolean, isCurrent: () => boolean}} options
 */
function addXwebAccountLocation($target, screenName, {focused = false, isCurrent}) {
  let cancelled = false
  let $label = null
  let $separator = null
  if (!focused) {
    $label = document.createElement('div')
    $label.className = 'cpft-account-location cpft-hovercard-account-location text-subtext2 text-secondary truncate'
    $label.textContent = '\u00a0'
    $label.setAttribute('aria-hidden', 'true')
    $target.appendChild($label)
  }
  getAccountLocation(screenName, 'xweb').then(location => {
    let setting = focused ? 'addFocusedTweetAccountLocation' : 'addUserHoverCardAccountLocation'
    if (cancelled || !enabled || !settings[setting] || !$target.isConnected || !isCurrent() || !location?.account_based_in) return
    if (focused) {
      $label = document.createElement('span')
      $label.className = 'cpft-account-location text-body text-secondary'
    }
    $label.removeAttribute('aria-hidden')
    $label.textContent = addQuestionMark(focused ? location.account_based_in : formatString('ACCOUNT_BASED_IN', 'country', location.account_based_in), !location.location_accurate)
    if (!focused) $label.setAttribute('title', $label.textContent)
    if (focused) {
      $separator = document.createElement('span')
      $separator.className = 'cpft-account-location shrink-0 px-1'
      $separator.setAttribute('aria-hidden', 'true')
      $separator.textContent = '·'
      $target.appendChild($separator)
      $target.appendChild($label)
    } else $target.appendChild($label)
  })
  return () => {
    cancelled = true;
    $separator?.remove()
    $label?.remove()
  }
}

const configureBlueChecks = (() => {
  let name = 'blue check symbol'
  /** @type {MutationObserver} */
  let observer
  /** @type {Element | null} */
  let $path = null
  let originalD = null

  function restore() {
    if ($path?.getAttribute('d') == Svgs.TWITTER_BLUE_LOGO_PATH) {
      if (originalD == null) $path.removeAttribute('d')
      else $path.setAttribute('d', originalD)
    }
    $path = null
    originalD = null
  }

  function update() {
    observer.disconnect()
    let $sprite = document.querySelector('body > svg[aria-hidden="true"]')
    let $symbol = $sprite?.querySelector('symbol#icon-verified-premium-color')
    let $nextPath = $symbol?.querySelector(':scope > path') || null
    if ($nextPath != $path) {
      restore()
      $path = $nextPath
      originalD = $path?.getAttribute('d') ?? null
    }
    if ($path && $path.getAttribute('d') != Svgs.TWITTER_BLUE_LOGO_PATH) {
      originalD = $path.getAttribute('d')
      $path.setAttribute('d', Svgs.TWITTER_BLUE_LOGO_PATH)
    }
    observer.observe(document.body || document.documentElement, {childList: true})
    if ($sprite) observer.observe($sprite, {childList: true})
    if ($symbol) observer.observe($symbol, {childList: true})
  }

  return function configureBlueChecks() {
    if (!enabled || settings.premiumBlueChecks != 'replace') {
      globalObservers.get(name)?.disconnect()
      return
    }
    if (globalObservers.has(name)) {
      update()
      return
    }
    observer = observeElement(document.documentElement, update, name)
    globalObservers.set(name, {
      name,
      disconnect() {
        observer.disconnect()
        restore()
        globalObservers.delete(name)
      },
    })
    update()
  }
})()

const configureBrandingMessages = (() => {
  let name = 'branding messages'

  return function configureBrandingMessages() {
    if (!enabled || !settings.revertXBranding) {
      globalObservers.get(name)?.disconnect()
      return
    }
    let i18n = findRouter()?.options?.context?.i18n
    let translator = i18n?.translator
    if (translator == brandingTranslator && translator != null) return
    globalObservers.get(name)?.disconnect()
    if (typeof translator?.getResource != 'function') return
    let original = translator.getResource
    let descriptor = Object.getOwnPropertyDescriptor(translator, 'getResource')
    // Components may already hold the original translation functions, so
    // replacing i18n.t would miss their calls. Those functions still call this
    // resource lookup. Return our templates here so the app formats counts and
    // inserts names/text.
    function getResource(language, namespace, key, options) {
      // Callers can request a specific language through getFixedT(), even when
      // the page uses another language. Choose translations using this call's
      // language.
      if (enabled && settings.revertXBranding && namespace == 'translation' && language != 'en-ss' && language != 'en-xx') {
        if (key == '{label} / X') {
          let template = original.call(this, language, namespace, key, options) || key
          return typeof template == 'string' ? (
            template.replace(/\bX\b/g, () => locales[language]?.TWITTER || locales.en.TWITTER)
          ) : template
        }
        if (Object.hasOwn(BRANDING_TRANSLATIONS, key)) {
          let code = BRANDING_TRANSLATIONS[key]
          return locales[language]?.[code] || locales.en[code]
        }
      }
      return original.call(this, language, namespace, key, options)
    }
    translator.getResource = getResource
    brandingTranslator = translator
    globalObservers.set(name, {
      name,
      disconnect() {
        if (translator.getResource == getResource) {
          if (descriptor) Object.defineProperty(translator, 'getResource', descriptor)
          else delete translator.getResource
        }
        brandingTranslator = null
        globalObservers.delete(name)
      }
    })
    log('Branding message overrides enabled')
  }
})()

// SVG path attributes need patching only in Safari
const configureBranding = (() => {
  let name = 'branding'
  let desktopSidebarObserverName = 'desktop sidebar container'
  let mobileHomeObserverName = 'mobile Home navigation item'
  /** @type {(() => void)[]} */
  let restorers = []

  function restore() {
    globalObservers.get(desktopSidebarObserverName)?.disconnect()
    globalObservers.get(mobileHomeObserverName)?.disconnect()
    for (let restore of restorers) restore()
    restorers = []
  }

  /**
   * @param {Element} $path
   * @param {string} replacement
   */
  function patchSvgPath($path, replacement) {
    let original = $path.getAttribute('d')
    $path.setAttribute('d', replacement)
    return () => {
      // Don't overwrite a subsequent change made by the app itself
      if ($path.getAttribute('d') != replacement) return
      if (original == null) $path.removeAttribute('d')
      else $path.setAttribute('d', original)
    }
  }

  function tweakLogos() {
    // Desktop startup can replace the sidebar independently of page/layout changes
    for (let $path of document.querySelectorAll(LOGO_PATH_SELECTOR)) {
      restorers.push(patchSvgPath($path, Svgs.TWITTER_LOGO_PATH))
    }
  }

  function tweakHomeIcons() {
    for (let $path of document.querySelectorAll(`${HOME_ICON_SELECTOR}[data-icon="icon-home"] > path`)) {
      restorers.push(patchSvgPath($path, Svgs.TWITTER_HOME_INACTIVE_PATH))
    }
    for (let $path of document.querySelectorAll(`${HOME_ICON_SELECTOR}[data-icon="icon-home-fill"] > path`)) {
      restorers.push(patchSvgPath($path, Svgs.TWITTER_HOME_ACTIVE_PATH))
    }
  }

  function observeDesktopSidebar() {
    let $container = document.querySelector(DESKTOP_NAV_CONTAINER_SELECTOR)
    if (!$container) return
    // The sm:block wrapper survives sidebar hydration
    observeElement($container, configureBranding, {
      name: desktopSidebarObserverName,
      observers: globalObservers,
      logElement: true,
    })
  }

  function observeMobileHomeIcon() {
    let $item = document.querySelector(`${MOBILE_NAV_SELECTOR} > div:has(svg:is([data-icon="icon-home"], [data-icon="icon-home-fill"]))`)
    if (!$item) return
    let restoreIcon = () => {}
    // Sidebar collapse swaps link/button children but preserves the keyed item div
    observeElement($item, () => {
      restoreIcon()
      restoreIcon = () => {}
      let $path = $item.querySelector('svg:is([data-icon="icon-home"], [data-icon="icon-home-fill"]) > path')
      if (!$path) return
      let active = $path.parentElement.getAttribute('data-icon') == 'icon-home-fill'
      restoreIcon = patchSvgPath($path, active ? Svgs.TWITTER_HOME_ACTIVE_PATH : Svgs.TWITTER_HOME_INACTIVE_PATH)
    }, {
      name: mobileHomeObserverName,
      observers: globalObservers,
      logElement: true,
      onDisconnect() { restoreIcon() },
    })
  }

  function tweakComposeButtons() {
    // Resize hides sidebar text, while startup can replace the sidebar contents
    if (isSafari) {
      for (let $path of document.querySelectorAll(`${COMPOSE_ICON_SELECTOR} > path:first-child`)) {
        restorers.push(patchSvgPath($path, Svgs.TWITTER_FEATHER_PLUS_PATH))
      }
    }
  }

  return function configureBranding() {
    configureBrandingMessages()
    restore()
    if (!enabled || !settings.revertXBranding) {
      globalObservers.delete(name)
      return
    }
    // Navigation items can be replaced without a page/layout change
    if (isSafari) {
      tweakLogos()
      tweakHomeIcons()
      if (mobile) observeMobileHomeIcon()
    }
    if (isSafari) tweakComposeButtons()
    if (desktop && isSafari) observeDesktopSidebar()
    globalObservers.set(name, {
      name,
      disconnect() {
        restore()
        globalObservers.delete(name)
      },
    })
  }
})()

function configureFastBlock() {
  let name = 'fast block clicks'
  if (!enabled || !settings.fastBlock) {
    globalObservers.get(name)?.disconnect()
    return
  }
  if (globalObservers.has(name)) return
  let attempt = null
  function cancel() {
    attempt = null
    pageObservers.get('getElement: block confirmation')?.disconnect()
  }
  function normalized(text) {
    return text.toLowerCase().replace(/[\p{P}\p{Cf}\s]/gu, '')
  }
  function onClick(event) {
    cancel()
    if (!enabled || !settings.fastBlock || event.button != 0) return
    let $item = event.target?.closest?.('[data-slot="xds-menu-item"]')
    if (!$item?.querySelector('svg[data-icon="icon-block"]') || $item.getAttribute('aria-disabled') == 'true') return
    let text = $item.textContent.trim()
    let username = /@[a-zA-Z\d_]{1,20}\b/.exec(text)?.[0]
    if (!username) return
    let action = normalized(text.replace(username, ''))
    if (!action) return
    let token = attempt = {}
    getElement('[data-base-ui-portal] > [role="dialog"][data-slot="xds-modal-surface"] [data-slot="xds-modal-footer-actions"] > button[data-slot="xds-button"].bg-btn-destructive', {
      name: 'block confirmation', observers: pageObservers,
    }).then($button => {
      if (!$button || attempt != token || !enabled || !settings.fastBlock || !$button.isConnected) return
      attempt = null
      let $dialog = $button.closest('[role="dialog"]')
      let heading = $dialog.querySelector('h2')?.textContent || ''
      // Match selected account and action
      let accounts = heading.match(/@[a-zA-Z\d_]{1,20}\b/g) || []
      if (!accounts.some(account => account.toLowerCase() == username.toLowerCase()) || normalized($button.textContent) != action) return
      log('fastBlock: confirming block', {username})
      $button.click()
    })
  }
  document.addEventListener('click', onClick, true)
  globalObservers.set(name, {name, disconnect() {
    cancel()
    document.removeEventListener('click', onClick, true)
    globalObservers.delete(name)
  }})
}

function configureCleanTweetLinks() {
  let name = 'clean tweet links'
  if (!enabled || !settings.cleanTweetLinks) {
    globalObservers.get(name)?.disconnect()
    return
  }
  if (globalObservers.has(name)) return
  let restore = () => {}
  let i18n = null
  function translate(text) {
    i18n ||= findRouter()?.options?.context?.i18n
    return i18n?.t(text) || text
  }
  function onCopy(event) {
    if (!enabled || !settings.cleanTweetLinks || event.button != 0) return
    let $item = event.target?.closest?.('[data-slot="xds-menu-item"]')
    if (!$item?.closest('[data-slot="xds-menu-content"]') || $item.getAttribute('aria-disabled') == 'true') return
    let text = $item.textContent.trim()
    if (text != translate('Copy link') && text != translate('Copy link to ad')) return
    let clipboard = navigator.clipboard
    if (typeof clipboard?.writeText != 'function') return
    restore()
    let original = clipboard.writeText
    let descriptor = Object.getOwnPropertyDescriptor(clipboard, 'writeText')
    let armed = true
    let timer = null
    function reset() {
      armed = false
      if (timer != null) clearTimeout(timer)
      if (clipboard.writeText != writeText) return
      if (descriptor) Object.defineProperty(clipboard, 'writeText', descriptor)
      else delete clipboard.writeText
    }
    function writeText(value) {
      let text = armed && enabled && settings.cleanTweetLinks ? cleanTweetLink(value) : value
      if (text != value) log('cleanTweetLinks: removed tracking from copied link', {url: text})
      reset()
      return original.call(this, text)
    }
    try {
      Object.defineProperty(clipboard, 'writeText', {configurable: true, writable: true, value: writeText})
    } catch {
      return
    }
    restore = reset
    // Keep the wrapper through event propagation, then restore if X never calls it.
    timer = setTimeout(reset, 0)
  }
  document.addEventListener('click', onCopy, true)
  globalObservers.set(name, {name, disconnect() {
    restore()
    document.removeEventListener('click', onCopy, true)
    globalObservers.delete(name)
  }})
}

const configureRedirects = (() => {
  let name = 'router navigation'
  let router = null
  let redirect = () => false
  let followersPath = /^\/(?:[a-zA-Z\d_]{1,20}|\$username)\/verified_followers\/?$/
  let homePath = /^\/(?:home\/?)?$/

  function redirectedPath(path) {
    if (!enabled || typeof path != 'string') return null
    if (settings.disableHomeTimeline && homePath.test(path.split(/[?#]/)[0])) {
      return settings.disabledHomeTimelineRedirect == 'messages' || settings.hideNotifications == 'hide'
        ? '/i/chat' : '/notifications'
    }
    if (settings.hideVerifiedTabs && followersPath.test(path)) {
      return path.replace(/verified_followers\/?$/, 'followers')
    }
    return null
  }

  return function configureRouterNavigation() {
    if (!enabled || (!settings.hideVerifiedTabs && !settings.disableHomeTimeline)) {
      globalObservers.get(name)?.disconnect()
      return false
    }
    let nextRouter = findRouter()
    if (!nextRouter) return false
    if (nextRouter == router) return redirect()
    globalObservers.get(name)?.disconnect()
    router = nextRouter
    let originalNavigate = router.navigate
    let patchedRouter = router
    function navigate(options) {
      // A masked Settings/Compose route may legitimately retain Home underneath
      let target = options?.mask?.to || options?.to
      let to = redirectedPath(target)
      if (to) {
        log('Redirecting native navigation', {from: target, to})
        options = {...options, to}
        if (homePath.test(target.split(/[?#]/)[0])) {
          options = {...options, search: {}, hash: ''}
        }
      }
      return originalNavigate.call(this, options)
    }
    router.navigate = navigate
    let pending = null
    redirect = () => {
      // Use the actual URL, not the rendered background behind a routed modal
      let path = location.pathname
      let to = redirectedPath(path)
      if (!to) return false
      let key = `${path}:${to}`
      if (pending == key) return true
      pending = key
      let options = homePath.test(path)
        ? {to, replace: true, search: {}, hash: ''}
        : {to, replace: true, search: true, hash: true}
      Promise.resolve(router.navigate(options)).catch(error => {
        pending = null
        warn('Native redirect failed', {path, to, error})
      })
      return true
    }
    let unsubscribe = router.subscribe('onResolved', () => {
      pending = null
      redirect()
    })
    globalObservers.set(name, {
      name,
      disconnect() {
        unsubscribe?.()
        if (patchedRouter.navigate == navigate) patchedRouter.navigate = originalNavigate
        router = null
        redirect = () => false
        globalObservers.delete(name)
      },
    })
    return redirect()
  }
})()

const dismissPremiumSignupModal = (() => {
  let dismissed = new WeakSet()
  return function dismissPremiumSignupModal() {
    if (!enabled || !settings.hidePremiumUpsells || !/^\/i\/premium_sign_up\/?$/.test(location.pathname)) return
    let $surface = document.querySelector('[data-base-ui-portal] > [role="dialog"][data-slot="xds-modal-surface"].x-commerce-modal[data-open]')
    if (!$surface || dismissed.has($surface)) return
    let $backdrop = /** @type {HTMLElement} */ ($surface.parentElement.querySelector(':scope > [data-slot="xds-modal-backdrop"][data-open]'))
    if (!$backdrop) return
    dismissed.add($surface)
    log('hidePremiumUpsells: automatically closing Premium signup modal')
    $backdrop.click()
  }
})()

/** @param {Element} $shell */
function observeAccountHovercard($shell) {
  let $card = null
  let screenName = ''
  let cleanup = () => {}
  let observer = observeElement($shell, update, 'account hovercard')
  function update() {
    observer.disconnect()
    let $avatar = $shell.querySelector('a:has(> .x-avatar)')
    let profilePath = $avatar?.getAttribute('href') || ''
    let nextName = /^\/([a-zA-Z\d_]{1,20})\/?$/.exec(profilePath)?.[1] || ''
    let $following = nextName ? $shell.querySelector(`a[href="/${nextName}/following"]`) : null
    if (!$following) {
      cleanup()
      cleanup = () => {}
      $card = null
      screenName = ''
      // Avatar and counts can mount separately inside loading content
      observer.observe($shell, {childList: true, subtree: true})
      return
    }
    let $nextCard = $avatar.parentElement
    while ($nextCard != $shell && !$nextCard.contains($following)) $nextCard = $nextCard.parentElement
    for (let $node of [$avatar, $following]) {
      for (let $parent = $node.parentElement; $parent; $parent = $parent.parentElement) {
        observer.observe($parent, {childList: true})
        if ($parent == $shell) break
      }
    }
    if ($nextCard == $card && nextName == screenName) return
    cleanup()
    $card = $nextCard
    screenName = nextName
    let card = $card
    let account = screenName
    cleanup = addXwebAccountLocation($following.parentElement.parentElement, account, {isCurrent: () =>
      $card == card && screenName == account && $following.getAttribute('href') == `/${account}/following` &&
      card.querySelector('a:has(> .x-avatar)')?.getAttribute('href') == profilePath})
  }
  update()
  return () => {
    observer.disconnect()
    observer = null
    cleanup()
  }
}

/** @param {'Chat' | 'Calls'} type */
async function observeEmbeddedTheme(type) {
  let $main = /** @type {HTMLElement} */ (document.querySelector('main'))
  if (!$main) return
  let path = currentPagePath
  let $container = await getElement(':scope > div', {
    context: $main, name: `${type} embed container`, observers: pageObservers,
    mutationObserverOptions: {childList: true},
  })
  if (!$container || !enabled || currentPagePath != path) return
  let rootSelector = type == 'Chat' ? '[data-xchat-root]' : '[data-xcalls-root]'
  let $host = null
  let $style = null
  let rafId = null
  function clear() {
    if (rafId != null) cancelAnimationFrame(rafId)
    rafId = null
    if ($style) observeTheme.removeEmbed($style)
    $style = null
    $host = null
  }
  function attach() {
    if (!enabled || !$container.isConnected || currentPagePath != path) {
      clear()
      return
    }
    let $nextHost = Array.from($container.children).find($child => $child.shadowRoot?.querySelector(rootSelector))
    if ($nextHost && $nextHost == $host) return
    clear()
    $host = $nextHost
    if (!$host) {
      // Shadow attachment and the embed's first render don't mutate page DOM
      rafId = requestAnimationFrame(attach)
      return
    }
    $style = document.createElement('style')
    observeTheme.addEmbed($style)
    $host.shadowRoot.appendChild($style)
    log(`${type} embed theme attached`)
  }
  observeElement($container, attach, {
    name: `${type} embed host`, observers: pageObservers, leading: true, logElement: true,
    onDisconnect: clear,
  })
}

const observeFavicon = (() => {
  let name = 'favicon metadata'
  let attributes = ['href', 'type', 'sizes']
  /** @type {HTMLHeadElement | null} */
  let $head = null
  /** @type {Map<Element, {native: Record<string, string | null>, applied: Record<string, string | null>, contested: Set<string>}>} */
  let icons = new Map()

  function read($icon) {
    return Object.fromEntries(attributes.map(attribute => [attribute, $icon.getAttribute(attribute)]))
  }

  function write($icon, values) {
    for (let attribute of attributes) {
      if ($icon.getAttribute(attribute) == values[attribute]) continue
      if (values[attribute] == null) $icon.removeAttribute(attribute)
      else $icon.setAttribute(attribute, values[attribute])
    }
  }

  function restore($icon, record) {
    let current = read($icon)
    for (let attribute of attributes) {
      if (current[attribute] == record.applied[attribute]) current[attribute] = record.native[attribute]
    }
    write($icon, current)
  }

  function update() {
    if (!enabled || (!settings.revertXBranding && settings.hideNotifications == 'ignore')) return
    let mounted = new Set(document.querySelectorAll('head > link[rel~="icon"]'))
    for (let [$icon, record] of icons) {
      if (!mounted.has($icon)) {
        restore($icon, record)
        icons.delete($icon)
      }
    }
    for (let $icon of mounted) {
      let record = icons.get($icon)
      if (!record) {
        record = {native: read($icon), applied: {}, contested: new Set()}
        icons.set($icon, record)
      }
      let current = read($icon)
      for (let attribute of attributes) {
        if (current[attribute] == record.applied[attribute]) continue
        // Yield metadata restored by another owner to avoid an observer loop
        if (Object.hasOwn(record.applied, attribute) && current[attribute] == record.native[attribute]) {
          record.contested.add(attribute)
        } else {
          record.contested.delete(attribute)
        }
        record.native[attribute] = current[attribute]
      }
      let desired = {...record.native}
      if (settings.revertXBranding) {
        let hasCount = TITLE_NOTIFICATION_RE.test(nativeDocumentTitle ?? document.title) ||
          nativeDocumentTitle == null && record.native.href?.includes('-pip')
        desired.href = settings.hideNotifications == 'ignore' && hasCount ? Images.TWITTER_PIP_FAVICON : Images.TWITTER_FAVICON
        desired.type = 'image/png'
        desired.sizes = '32x32'
      } else if (settings.hideNotifications != 'ignore' && desired.href?.includes('-pip')) {
        desired.href = desired.href.replace('-pip', '')
      }
      for (let attribute of record.contested) desired[attribute] = current[attribute]
      write($icon, desired)
      record.applied = desired
    }
    let observer = /** @type {import("./types").NamedMutationObserver} */ (globalObservers.get(name))
    observer?.takeRecords?.()
  }

  function configure() {
    if (!enabled || (!settings.revertXBranding && settings.hideNotifications == 'ignore')) {
      globalObservers.get('favicon head')?.disconnect()
      globalObservers.get(name)?.disconnect()
      return
    }
    if (!document.head) {
      getElement('head', {context: document.documentElement, name: 'favicon head', observers: globalObservers})
        .then($found => { if ($found) configure() })
      return
    }
    if ($head == document.head && globalObservers.has(name)) {
      // Explicit preference changes may retry previously contested metadata
      for (let record of icons.values()) record.contested.clear()
      update()
      return
    }
    observeElement(document.head, mutations => {
      if (!mutations.length || mutations.some(mutation => mutation.target == document.head ||
          mutation.type == 'attributes' && (icons.has(/** @type {Element} */ (mutation.target)) ||
            /** @type {Element} */ (mutation.target).matches('link[rel~="icon"]')))) update()
    }, {
      leading: true,
      name,
      observers: globalObservers,
      onDisconnect() {
        for (let [$icon, record] of icons) restore($icon, record)
        icons.clear()
        $head = null
      },
    }, {childList: true, subtree: true, attributes: true, attributeFilter: ['href', 'rel', 'type', 'sizes']})
    $head = document.head
  }

  configure.update = update
  return configure
})()

function observeLayout() {
  let name = 'layout media query'
  globalObservers.get(name)?.disconnect()

  let mediaQuery = window.matchMedia('(width < 512px)')
  function updateLayout() {
    mobile = mediaQuery.matches
    desktop = !mobile
    /** @type {'mobile' | 'desktop'} */
    let lastLayout = mobile ? 'mobile' : 'desktop'
    log('layout', lastLayout)
    storeConfigChanges({lastLayout})
    configureCss()
    if (currentPagePath) processCurrentPage()
  }

  mediaQuery.addEventListener('change', updateLayout)
  globalObservers.set(name, {
    name,
    disconnect() {
      mediaQuery.removeEventListener('change', updateLayout)
      globalObservers.delete(name)
    },
  })
  updateLayout()
}

const observeOverlays = (() => {
  let name = 'portals'
  let checkedFollowingMenus = new WeakSet()
  let checkedReplyMenus = new WeakSet()
  let observer = null
  let $viewer = null
  /** @type {Map<string, import("./types").Disconnectable>} */
  let mediaViewerObservers = new Map()
  /** @type {Map<Element, () => void>} */
  let hovercards = new Map()
  /** @type {Map<Element, Map<string, import("./types").Disconnectable>>} */
  // Each portal owns a temporary subtree wait; it ends on discovery or close.
  let modalDiscoveryObservers = new Map()
  function clearHovercards() {
    for (let cleanup of hovercards.values()) cleanup()
    hovercards.clear()
  }

  function tweetPath($items, id) {
    let focusedId = /^urt:conversation:(\d+)(?::|$)/.exec(id)?.[1]
    if (!focusedId) return ''
    let $focused = $items.find($item => $item.matches(FOCUSED_TWEET_SELECTOR))
    // A media portal's focused permalink can precede the router URL update
    let paths = Array.from($focused?.querySelectorAll('a[href]') || []).map($link => $link.getAttribute('href'))
    paths.push(location.pathname)
    for (let path of paths) {
      let match = /^(\/[a-zA-Z\d_]{1,20}\/status\/(\d+))(?:\/|$)/.exec(path)
      if (match?.[2] == focusedId) return match[1]
    }
    return ''
  }

  function clear() {
    disconnectObservers(mediaViewerObservers, 'modal')
    $viewer = null
  }

  function update() {
    if (!observer) return
    observer.disconnect()
    // Hovercard portals can mount inside a media viewer's portal
    let portals = document.querySelectorAll('[data-base-ui-portal]')
    observer.observe(document.body || document.documentElement, {childList: true})
    for (let $wrapper of document.querySelectorAll('body > .contents')) observer.observe($wrapper, {childList: true})
    dismissPremiumSignupModal()
    let $nextViewer = null
    let nextHovercards = new Set()
    for (let $portal of portals) {
      for (let $parent = $portal.parentElement; $parent && $parent != document.body; $parent = $parent.parentElement) {
        observer.observe($parent, {childList: true})
      }
      observer.observe($portal, {childList: true})
      // Base UI can insert menu contents after their positioning wrapper
      for (let $positioner of $portal.querySelectorAll(':scope > [role="presentation"]')) observer.observe($positioner, {childList: true})
      let $surface = $portal.querySelector('[data-slot="xds-modal-surface"]')
      if ($surface) {
        let waits = modalDiscoveryObservers.get($portal)
        if (waits) disconnectObservers(waits, 'modal')
        modalDiscoveryObservers.delete($portal)
        // Persistent lifecycle checks: detect surface removal/replacement after discovery.
        for (let $parent = $surface.parentElement; $parent && $parent != $portal; $parent = $parent.parentElement) {
          observer.observe($parent, {childList: true})
        }
        if ($surface.matches(MEDIA_VIEWER_SELECTOR())) $nextViewer ||= $surface
      } else if (!modalDiscoveryObservers.has($portal)) {
        let waits = new Map()
        modalDiscoveryObservers.set($portal, waits)
        getElement('[data-slot="xds-modal-surface"]', {
          context: /** @type {HTMLElement} */ ($portal), name: 'modal surface', observers: waits,
        }).then($found => {
          if ($found && observer && modalDiscoveryObservers.get($portal) == waits) update()
        })
      }
      if (settings.addUserHoverCardAccountLocation) {
        for (let $shell of $portal.querySelectorAll(':scope > [role="presentation"] > [data-base-ui-focusable]')) {
          nextHovercards.add($shell)
          if (!hovercards.has($shell)) hovercards.set($shell, observeAccountHovercard($shell))
        }
      }
      if (settings.defaultFollowingToRecent && currentPageType == 'HomeTimeline') {
        let $following = document.querySelector('[data-pinned-timeline="following"]')
        let $menu = $portal.querySelector('[data-slot="xds-menu-content"]')
        if ($following?.id && $menu?.getAttribute('aria-labelledby') == $following.id && !checkedFollowingMenus.has($menu)) {
          let $recent = /** @type {HTMLElement} */ (Array.from($menu.querySelectorAll('[role="menuitemradio"]')).find($item =>
            $item.querySelector(':scope > span:first-child')?.textContent.trim() == getString('RECENT')))
          if ($recent) {
            checkedFollowingMenus.add($menu)
            if (settings.hideFollowingMenu || !userSortedFollowing && $recent.getAttribute('aria-checked') != 'true') $recent.click()
            $menu.addEventListener('click', event => {
              if (!enabled || !settings.defaultFollowingToRecent || settings.hideFollowingMenu ||
                  !/** @type {Element} */ (event.target)?.closest?.('[role="menuitemradio"]')) return
              userSortedFollowing = true
            }, true)
          }
        }
      }
      if (settings.sortReplies != 'relevant' && replySortTweetId) {
        let label = findRouter()?.options?.context?.i18n?.t?.('Sort replies') || getString('SORT_REPLIES')
        let $group = $portal.querySelector(`[data-slot="xds-menu-content"] [aria-label=${JSON.stringify(label)}]`)
        if ($group && !checkedReplyMenus.has($group)) {
          checkedReplyMenus.add($group)
          let id = replySortTweetId
          $group.addEventListener('click', event => {
            if (enabled && replySortTweetId == id && /** @type {Element} */ (event.target)?.closest?.('[role="menuitemradio"]')) {
              userSortedReplies = true
            }
          }, true)
        }
      }
    }
    for (let [$portal, waits] of modalDiscoveryObservers) {
      if (!$portal.isConnected) {
        disconnectObservers(waits, 'modal')
        modalDiscoveryObservers.delete($portal)
      }
    }
    for (let [$shell, cleanup] of hovercards) {
      if (!nextHovercards.has($shell)) {
        cleanup()
        hovercards.delete($shell)
      }
    }
    if ($nextViewer == $viewer) return
    clear()
    $viewer = $nextViewer
    if (!$viewer) return
    // Timeline discovery follows loading content and Hide/View post panel replacements
    let path = ''
    let processItems = null
    let initialFocused = observeInitialFocusedTweet($viewer, {isCurrent: () => Boolean($viewer?.isConnected)})
    observeTimeline($viewer, {
      observers: mediaViewerObservers,
      isCurrent: () => Boolean($viewer?.isConnected),
      timelineSelector: '[id^="urt:conversation:"]',
      onItemsChanged($items, id, changedItems) {
        if ($items.some($item => $item.matches(FOCUSED_TWEET_SELECTOR))) initialFocused.disconnect()
        let idMatch = /^urt:conversation:(\d+)(?::|$)/.exec(id)?.[1]
        let nextPath = tweetPath($items, id) || (idMatch == /\/status\/(\d+)/.exec(path)?.[1] ? path : '')
        if (!nextPath) return
        if (nextPath != path) {
          path = nextPath
          processItems = createIndividualTweetTimelineProcessor(path)
        }
        return processItems($items, id, changedItems)
      },
      onContentChanged() { initialFocused.update() },
      onDisconnect() { initialFocused.disconnect() },
    })
  }

  function observePortals() {
    globalObservers.get(name)?.disconnect()
    if (!enabled) return
    log('observing xweb portals')
    observer = observeElement(document.body || document.documentElement, update, name)
    globalObservers.set(name, {name, disconnect() {
      observer?.disconnect()
      observer = null
      clear()
      clearHovercards()
      for (let waits of modalDiscoveryObservers.values()) disconnectObservers(waits, 'modal')
      modalDiscoveryObservers.clear()
      globalObservers.delete(name)
    }})
    update()
  }
  observePortals.refresh = () => {
    clear()
    clearHovercards()
    update()
  }
  return observePortals
})()

/** Browser chrome and embed activation follow the native root theme */
const observeTheme = (() => {
  let name = 'theme'
  /** @type {Map<Element, {original: string, replacement: string}>} */
  let originals = new Map()
  /** @type {Set<HTMLStyleElement>} */
  let embedStyles = new Set()

  function updateEmbeds() {
    let theme = enabled && getConfiguredTheme(document.documentElement.getAttribute?.('data-theme'))
    for (let $style of embedStyles) {
      $style.media = enabled ? 'all' : 'not all'
      $style.textContent = enabled ? getEmbeddedAccentRules() +
        getFontSizeRules(':host, [data-theme], .light-theme, .dark-theme') +
        (theme ? getEmbeddedThemeRules(theme, document.documentElement.getAttribute?.('data-high-contrast') == 'true') : '') +
        (settings.revertXBranding ? getEmbeddedBrandingRules() : '') : ''
    }
  }

  function restoreMeta() {
    for (let [$meta, {original, replacement}] of originals) {
      if ($meta.getAttribute('content') == replacement) $meta.setAttribute('content', original)
    }
    originals.clear()
  }

  function observeTheme() {
    globalObservers.get(name)?.disconnect()
    if (!enabled) return
    let observer = observeElement(document.documentElement, update, name, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-high-contrast'],
    })
    function update() {
      observer.disconnect()
      restoreMeta()
      let theme = getConfiguredTheme(document.documentElement.getAttribute?.('data-theme'))
      for (let $meta of document.querySelectorAll('meta[name="theme-color"]')) {
        let content = $meta.getAttribute('content')
        let nativeColour = theme?.mode == 'dark' ? /^#(?:000000|050505)$/i : /^#(?:fff|ffffff)$/i
        if (theme && nativeColour.test(content)) {
          let replacement = theme.tokens['--x-bg-primary']
          originals.set($meta, {original: content, replacement})
          $meta.setAttribute('content', replacement)
        }
        observer.observe($meta, {attributes: true, attributeFilter: ['content']})
      }
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme', 'data-high-contrast'],
      })
      if (document.head) observer.observe(document.head, {childList: true})
      updateEmbeds()
    }
    globalObservers.set(name, {name, disconnect() {
      observer.disconnect()
      restoreMeta()
      globalObservers.delete(name)
      updateEmbeds()
    }})
    update()
  }
  observeTheme.addEmbed = ($style) => { embedStyles.add($style); updateEmbeds() }
  observeTheme.removeEmbed = ($style) => { embedStyles.delete($style); $style.remove() }
  return observeTheme
})()

function observePageChanges() {
  // Home links include both the desktop logo/navigation and mobile bottom nav
  function onHomeClick(event) {
    if (event.button != 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!event.target?.closest?.('a[href="/home"]')) return
    if (separatedTweetsTimelineSelected) {
      if (/^\/home\/?$/.test(location.pathname)) selectHomeTimeline(false)
      else separatedTweetsTimelineSelected = false
    }
  }
  document.addEventListener('click', onHomeClick, true)
  globalObservers.set('Home navigation', {
    name: 'Home navigation',
    disconnect() {
      document.removeEventListener('click', onHomeClick, true)
      globalObservers.delete('Home navigation')
    },
  })

  let $title = null
  observeElement(document.head || document.documentElement, () => {
    let $nextTitle = document.querySelector('head > title')
    if ($nextTitle == $title) return
    globalObservers.get('page title')?.disconnect()
    $title = $nextTitle
    if (!$title) return
    observeElement($title, () => {
      onTitleChange(document.title, {native: true})
      observeFavicon.update()
    }, {
      leading: true,
      name: 'page title',
      observers: globalObservers,
    }, {childList: true, characterData: true, subtree: true})
  }, {
    leading: true,
    name: 'title element',
    observers: globalObservers,
    onDisconnect() {
      globalObservers.get('page title')?.disconnect()
      $title = null
    },
  })

  // Main replacement occurs along the app's ancestor chain
  let name = 'page content'
  globalObservers.get(name)?.disconnect()
  let $main = document.querySelector('main')
  let observer = observeElement(document.documentElement, update, name)
  function update() {
    observer.disconnect()
    let $nextMain = document.querySelector('main')
    // Before main mounts, its future parent can be anywhere in the app shell
    observer.observe(document.documentElement, {childList: true, ...(!$nextMain && {subtree: true})})
    for (let $el = $nextMain?.parentElement; $el && $el != document.documentElement; $el = $el.parentElement) {
      observer.observe($el, {childList: true})
    }
    configureBrandingMessages()
    configureRedirects()
    if (currentPageType == 'QuoteTweets' || currentPageType == 'TweetEngagement') tweakTweetEngagementPage()
    if ($nextMain == $main) return
    $main = $nextMain
    if ($main) onTitleChange(document.title, {force: true})
  }
  globalObservers.set(name, {name, disconnect: () => observer.disconnect()})
  update()
}
//#endregion

//#region CSS
/** @param {string} selector */
function getFontSizeRules(selector) {
  let scale = {xSmall: '0.9', small: '0.95', large: '1.1', xLarge: '1.2'}[settings.fontSize]
  return scale ? getThemeTokenRules(selector, {'--x-font-scale': scale}) : ''
}

/** @returns {import("./types").XTheme | null} */
function getConfiguredTheme(mode) {
  if (mode == 'light') {
    if (settings.lightModeTheme == 'catppuccinLatte') return CATPPUCCIN_LATTE_THEME
    if (settings.lightModeTheme == 'gruvboxLight') return GRUVBOX_LIGHT_THEME
    if (settings.lightModeTheme == 'solarizedLight') return SOLARIZED_LIGHT_THEME
  }
  if (mode == 'dark') {
    if (settings.darkModeTheme == 'dim') return DIM_THEME
    if (settings.darkModeTheme == 'monokaiExtended') return MONOKAI_EXTENDED_THEME
    if (settings.darkModeTheme == 'gruvboxDarkSoft') return GRUVBOX_DARK_SOFT_THEME
  }
  return null
}

function getEmbeddedAccentRules() {
  return getThemeTokenRules(':host, [data-theme], .light-theme, .dark-theme',
    Object.fromEntries(EMBED_ACCENT_TOKENS.map(token =>
      [token, `var(--cpft-embed-${token.slice(4)})`])))
}

/** @param {boolean} following */
function getFollowButtonSelector(following) {
  let labels = locales[lang] || locales.en
  // English is also needed when a native catalog falls back to its source keys
  let templates = following
    ? [labels.UNFOLLOW_USER, labels.FOLLOWING_USER, locales.en.UNFOLLOW_USER, locales.en.FOLLOWING_USER]
    : [labels.FOLLOW_USER, labels.FOLLOW_BACK_USER, locales.en.FOLLOW_USER, locales.en.FOLLOW_BACK_USER]
  let selectors = []
  for (let template of new Set(templates)) {
    if (!template) continue
    let [prefix, suffix] = template.split('{screenName}')
    if (suffix == null) continue
    // Following opens a confirmation dialog even where Follow/Following translations overlap
    let state = following ? '[aria-haspopup="dialog"]' : ':not([aria-haspopup])'
    let label = (prefix ? `[aria-label^=${JSON.stringify(prefix)}]` : '') +
      (suffix ? `[aria-label$=${JSON.stringify(suffix)}]` : '')
    selectors.push(`span.inline-grid > button[data-slot="xds-button"]${state}${label}`)
  }
  return `:is(${selectors.join(', ')})`
}

function getPageAccentRules() {
  // Resolve the app accent here so embed defaults cannot turn it blue again
  return getThemeTokenRules(':root', Object.fromEntries(EMBED_ACCENT_TOKENS.map(token =>
    [`--cpft-embed-${token.slice(4)}`, `var(${token})`])))
}

/** @param {import("./types").XTheme} theme */
function getPageThemeRules(theme) {
  let root = `:root[data-theme="${theme.mode}"]`
  let nested = `:is([data-theme="${theme.mode}"], .${theme.mode}-theme)`
  let highContrastRoot = `${root}[data-high-contrast="true"]`
  return getThemeRules(`${root}, ${root} ${nested}`, theme) + `
    ${root}, ${root} body { background-color: var(--x-bg-primary) !important; }
  ` + getThemeTokenRules(`${highContrastRoot}, ${highContrastRoot} ${nested}`, theme.highContrastTokens)
}

const configureCss = (() => {
  /** @type {HTMLStyleElement} */
  let $style
  let premium = null
  let workExperience = null

  function configureCss() {
    if (!enabled) {
      $style?.remove()
      $style = null
      return
    }
    premium = viewerHasPremium()
    workExperience = viewerCanAddWorkExperience()

    /** @type {string[]} */
    let cssRules = [getPageAccentRules(), getFontSizeRules(':root'), `
      .cpft-unavailable-content, .cpft-unavailable-tweet { display: none !important; }
      .cpft-hovercard-account-location { order: 1; min-height: 1lh; }
      .cpft-interaction-links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 20px;
        margin-top: 6px;
        padding: 14px 0;
        border-top: 1px solid var(--x-border-divider);
        border-bottom: 1px solid var(--x-border-divider);
      }
      .cpft-interaction-links a { color: inherit; text-decoration: none; }
      .cpft-interaction-links a:hover { text-decoration: underline; }
      [id^="urt:"] > ul > li[data-index]:has(> :is(.HiddenAd, .HiddenTweet)):not(:has(> :not(.HiddenAd, .HiddenTweet))) {
        height: 1px !important;
        min-height: 1px !important;
        overflow: hidden !important;
      }
      [id^="urt:"] > ul > li[data-index] > :is(.HiddenAd, .HiddenTweet) {
        display: none !important;
      }
    `]
    /** @type {string[]} */
    let hideCssSelectors = [
      // Promoted trends share a timeline row with ordinary trends
      '[id^="urt:explore-sidebar:"] [data-navigation-stop]:has([data-icon="icon-promoted-square-fill"])',
      // Mobile account-menu app promotion
      '[role="dialog"]:has(nav a[href="/logout"]) > div:not(:has(nav)):has([data-icon="icon-logo-x"]):has(button [data-icon="icon-close-md"])',
    ]

    if (settings.tweetMediaGrid) {
      cssRules.push(`
        [data-cpft-media-grid-frame] {
          height: auto !important;
          padding-bottom: 0 !important;
        }
        [data-cpft-media-grid-layer] {
          position: static !important;
        }
        [data-cpft-media-grid-carousel], [data-cpft-media-grid-wrap] {
          height: auto !important;
          margin: 0 !important;
          --x-carousel-bleed-start: 0px;
          --x-carousel-bleed-end: 0px;
        }
        [data-cpft-media-grid-container] > [aria-hidden="true"],
        [data-cpft-media-grid-carousel] > :not([data-cpft-media-grid-wrap]) {
          display: none !important;
        }
        [data-cpft-media-grid] {
          display: grid !important;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-template-rows: repeat(2, minmax(0, 1fr));
          gap: 2px !important;
          aspect-ratio: 16 / 9;
          width: 100% !important;
          height: auto !important;
          padding: 0 !important;
          overflow: hidden !important;
          border: 1px solid var(--x-border-normal);
          border-radius: var(--radius-md, 12px);
          scroll-snap-type: none !important;
        }
        [data-cpft-media-grid] > * {
          grid-column: span 2;
          position: relative;
          min-width: 0 !important;
          min-height: 0 !important;
          width: auto !important;
          height: 100% !important;
          aspect-ratio: auto !important;
          border: 0 !important;
          border-radius: 0 !important;
        }
        [data-cpft-media-grid]:is([data-cpft-media-grid="2"], [data-cpft-media-grid="3"], [data-cpft-media-grid="4"]) {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        [data-cpft-media-grid]:is([data-cpft-media-grid="2"], [data-cpft-media-grid="3"], [data-cpft-media-grid="4"]) > * {
          grid-column: auto;
        }
        [data-cpft-media-grid="2"] { grid-template-rows: minmax(0, 1fr); }
        [data-cpft-media-grid="3"] > :first-child { grid-row: span 2; }
        [data-cpft-media-grid="5"] > :nth-child(-n+2) { grid-column: span 3; }
        [data-cpft-media-grid]:not([data-cpft-media-grid-expanded]) > :nth-child(n+7) {
          display: none !important;
        }
        [data-cpft-media-grid-expanded] {
          aspect-ratio: auto;
          grid-template-rows: none;
        }
        [data-cpft-media-grid-expanded] > * {
          height: auto !important;
          aspect-ratio: 32 / 27 !important;
        }
        [data-cpft-media-grid] a[href*="/photo/"] {
          display: block;
          width: 100%;
          height: 100%;
        }
        [data-cpft-media-grid] > * [style*="aspect-ratio"] {
          aspect-ratio: auto !important;
          height: 100% !important;
        }
        [data-cpft-media-grid] img[src*="pbs.twimg.com/media/"] {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
        [data-cpft-media-grid-more] {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: grid;
          place-items: center;
          width: 100%;
          border: 0;
          padding: 0;
          background: rgb(0 0 0 / 50%);
          color: white;
          font: inherit;
          font-size: 24px;
          font-weight: bold;
          cursor: pointer;
        }
        [data-cpft-media-grid-more]:hover { background: rgb(0 0 0 / 60%); }
        [data-cpft-media-grid-more]:focus-visible { outline: 2px solid white; outline-offset: -4px; }
      `)
    }

    if (settings.dontUseChirpFont) {
      let font = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Twemoji Mozilla", sans-serif'
      cssRules.push(`
        :root { --x-font-sans: ${font} !important; }
        body, .font-chirp, [lang]:not(:lang(ja)) { font-family: ${font} !important; }
      `)
    }

    for (let mode of ['light', 'dark']) {
      let theme = getConfiguredTheme(mode)
      if (theme) cssRules.push(getPageThemeRules(theme))
    }

    if (debug) {
      cssRules.push(`
        [id^="urt:"] > ul > li[data-index] > [data-item-type] {
          position: relative;
        }
        [id^="urt:"] > ul > li[data-index] > [data-item-type]::after {
          position: absolute;
          top: 0;
          inset-inline-end: 50px;
          z-index: 1;
          pointer-events: none;
          content: attr(data-item-type);
          font-family: inherit;
          background-color: rgb(242, 29, 29);
          color: white;
          font-size: 11px;
          font-weight: bold;
          padding: 4px 6px;
          border-bottom-left-radius: 1em;
          border-bottom-right-radius: 1em;
        }
      `)
    }

    let fullWidthPages = ':is(.HomeTimeline, .List, .Community, .Profile, .History, .Tweet, .Notifications)'
    if (desktop && settings.fullWidthContent) {
      let main = `body${fullWidthPages} main`
      let grid = `body${fullWidthPages} div:has(> main)`
      // Timelines and their loading skeletons share this width token
      cssRules.push(`
        ${main} {
          --x-timeline-max-width: none !important;
          max-width: none !important;
        }
        ${grid} {
          grid-template-columns: minmax(0, 1fr) !important;
        }
      `)
      hideCssSelectors.push(`${main} + aside`)
      if (!settings.fullWidthMedia) {
        // Portrait media can be narrower than the normal tweet content width
        cssRules.push(`
          ${main} :is([data-navigation-stop], [data-cpft-focused-tweet]) > article [class~="empty:hidden"]:has([style*="aspect-ratio:"], [data-slot="embedded-tweet-frame"], a[href^="https://t.co/"]) {
            max-width: 520px;
          }
        `)
      }
    }

    if (settings.dropdownMenuFontWeight) {
      cssRules.push(`
        [data-slot="xds-menu-content"] :is([role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"]) {
          font-weight: var(--font-weight-normal,400) !important;
        }
      `)
    }

    if (desktop && settings.navBaseFontSize) {
      cssRules.push(`
        ${DESKTOP_NAV_SELECTOR} [class~="group/sidebar-item"] .text-headline2 {
          font-size: calc(15 / var(--x-root-font-size,16) * 1rem * var(--x-font-scale,1)) !important;
          font-weight: var(--font-weight-normal,400) !important;
        }
      `)
    }

    if (hasSeparatedTweetsTimeline()) {
      cssRules.push(`
        body.HomeTimeline header[data-page-header] [role="tablist"]:has(> #cpftSeparatedTweetsTab) > :is([data-pinned-timeline-indicator], [data-cpft-timeline-indicator]) {
          left: var(--cpft-active-tab-left, var(--active-tab-left)) !important;
          width: var(--cpft-active-tab-width, var(--active-tab-width)) !important;
        }
        [role="tablist"] > [data-cpft-timeline-indicator] {
          position: absolute;
          bottom: 0;
          height: 3px;
          border-radius: 9999px;
          pointer-events: none;
          background-color: var(--x-fg-primary);
          transition: left 200ms cubic-bezier(.4,0,.2,1), width 200ms cubic-bezier(.4,0,.2,1);
        }
        [role="tablist"]:has(> [data-cpft-timeline-indicator]) > ${TAB_UNDERLINE_SELECTOR} {
          visibility: hidden !important;
        }
        @media (prefers-reduced-motion: reduce) {
          [role="tablist"] > [data-cpft-timeline-indicator] { transition: none; }
        }
        .cpft-separated-tweets-selected [data-pinned-timeline][data-active] {
          color: var(--x-fg-secondary) !important;
        }
      `)
    }

    let bottomNav = MOBILE_NAV_SELECTOR
    let bottomNavItems = `${bottomNav} > div`
    let navItems = ':is(nav:has(> a[href="/home"]), [role="dialog"]:has(nav a[href="/logout"]) nav, [data-slot="xds-menu-content"]) a'
    let sidebarContents = 'main + aside > div > div'
    let sidebarSections = `${sidebarContents} > section`
    if (settings.uninvertFollowButtons) {
      let themed = settings.revertXBranding && settings.themeFollowButtons
      let follow = getFollowButtonSelector(false)
      // Native hover/focus applies the destructive Unfollow state
      let following = `${getFollowButtonSelector(true)}:not(.bg-btn-destructive)`
      let colour = themed ? 'var(--x-btn-brand)' : 'var(--x-fg-primary)'
      cssRules.push(`
        ${follow} {
          background-color: transparent !important;
          border-color: ${themed ? 'var(--x-btn-brand)' : 'var(--x-border-normal)'} !important;
          color: ${colour} !important;
        }
        ${follow}:hover {
          background-color: ${themed ? 'color-mix(in srgb, var(--x-btn-brand) 10%, transparent)' : 'var(--x-btn-ghost-hover)'} !important;
        }
        ${follow}:active {
          background-color: ${themed ? 'color-mix(in srgb, var(--x-btn-brand) 20%, transparent)' : 'var(--x-btn-ghost-pressed)'} !important;
        }
        ${following} {
          background-color: ${themed ? 'var(--x-btn-brand)' : 'var(--x-btn-primary)'} !important;
          border-color: ${themed ? 'var(--x-btn-brand)' : 'var(--x-btn-primary)'} !important;
          color: ${themed ? 'var(--x-fg-on-brand)' : 'var(--x-fg-inverted)'} !important;
        }
      `)
    }
    if (settings.removeSidebarPanelGradients) {
      cssRules.push(`
        ${sidebarSections} { background-image: none !important; }
        ${sidebarSections}.border-fg-alpha-06 { border-color: var(--x-border-normal) !important; }
      `)
    }
    let relevantPeopleSection = 'section:has(> div > [data-href] .x-avatar):not(:has([data-who-to-follow]))'
    let relevantPeople = `${sidebarContents} > ${relevantPeopleSection}`

    if (settings.disableHomeTimeline) {
      hideCssSelectors.push(
        `${navItems}[href="/home"]`,
        `${bottomNavItems}:has(> a[href="/home"])`,
      )
    }
    if (settings.hideAdsNav) {
      hideCssSelectors.push(`${navItems}[href^="https://ads.x.com/"]`)
    }
    if (settings.hideBookmarkButton) {
      let keepFocused = settings.showBookmarkButtonUnderFocusedTweets ? `:not(${FOCUSED_TWEET_SELECTOR} *)` : ''
      hideCssSelectors.push(`[data-engagement-action="bookmark"]${keepFocused}`)
    }
    if (settings.hideBusinessNav) {
      hideCssSelectors.push(`${navItems}[href^="/i/premium-business"]`)
    }
    if (settings.hideCalls) {
      hideCssSelectors.push(`${navItems}[href="/i/calls"]`)
    }
    if (settings.hideChatNav) {
      hideCssSelectors.push(`${navItems}[href="/i/chat"]`)
    }
    if (settings.hideCommunitiesNav) {
      hideCssSelectors.push(`${navItems}[href$="/communities"]`)
    }
    if (settings.hideComposeTweet) {
      hideCssSelectors.push(desktop ? '#sidebar-compose-post' : 'body > div > div > button[data-compose-fab="true"]')
    }
    if (settings.hideConnectNav) {
      hideCssSelectors.push(`${navItems}[href="/i/connect_people"]`)
    }
    if (settings.hideCreatorStudioNav) {
      hideCssSelectors.push(`${navItems}[href="/i/jf/creators/studio"]`)
    }
    if (desktop && settings.hideExploreNav) {
      // Resize can empty the sidebar, and navigation can remove it
      if (!(settings.hideExploreNavWithSidebar && settings.hideSidebarSearch)) {
        let sidebar = settings.hideExploreNavWithSidebar
          ? `body${settings.fullWidthContent ? `:not(${fullWidthPages})` : ''}:has(> div > div > main + aside > *) `
          : ''
        hideCssSelectors.push(`${sidebar}${navItems}[href="/explore"]`)
      }
    }
    if (settings.defaultToFollowing && settings.hideForYouTimeline) {
      hideCssSelectors.push('body.HomeTimeline header[data-page-header] [role="tab"][data-pinned-timeline="for-you"]')
    }
    if (settings.hideEditImage) {
      let editProfile = '[role="dialog"][data-slot="xds-modal-surface"]:has([data-edit-profile-bar])'
      hideCssSelectors.push(
        // Imagine edit links on Tweet images, including media viewers
        'a[data-slot="xds-button"][href^="https://grok.com/imagine"]',
        // Profile banner edit action
        `${editProfile} button:has([data-icon="icon-photo-edit"])`,
        // Profile photo promotion
        `${editProfile} .bg-secondary:has(> button [data-icon="icon-photo-edit"])`,
      )
    }
    if (settings.hideGrok) {
      hideCssSelectors.push(
        // Navigation link
        `${navItems}[href="/i/grok"]`,
        // Mobile bottom navigation
        `${bottomNavItems}:has(> a[href="/i/grok"])`,
        // Floating Grok dock launcher
        '[data-slot="xds-dock"] > [data-slot="xds-dock-window"]:has(> [data-slot="xds-dock-launcher"] [data-icon="icon-logo-grok"])',
        // Grok actions in Tweets, profiles and hovercards
        'button:has([data-icon="icon-logo-grok"])',
      )
    }
    if (settings.hideHistoryNav) {
      hideCssSelectors.push(`${navItems}[href="/i/history"]`)
    }
    if (settings.hideListsNav) {
      hideCssSelectors.push(`${navItems}[href$="/lists"]`)
    }
    if (settings.hideMoney) {
      hideCssSelectors.push(
        // Navigation/menu entry
        `${navItems}[href="/i/money"]`,
        // Profile payment link
        'body.Profile main a[href^="/i/money/pay"]',
        // Profile action and profile-edit visitor preview
        'button[data-slot="xds-button"]:has(svg[data-icon="icon-xmoney"])',
        // Embedded payment card in Tweets
        'article .jetfuel-style-root:has([data-icon="icon-logo-x"])',
      )
    }
    if (hasSeparatedTweetsTimeline() || settings.defaultFollowingToRecent && settings.hideFollowingMenu) {
      let following = '[data-pinned-timeline="following"]'
      if (!(settings.defaultFollowingToRecent && settings.hideFollowingMenu)) {
        following = `:is(.cpft-separated-tweets-selected ${following}, ${following}:not([data-active]))`
      }
      hideCssSelectors.push(
        `${following} [class~="group-data-active/tab:w-4"]`,
        `${following} span:has(> [data-icon="icon-chevron-down-md"])`,
      )
      cssRules.push(`
        ${following} [class~="group-data-active/tab:pe-2"] {
          padding-inline-end: 0 !important;
        }
      `)
    }
    if (settings.hideManageTimelines) {
      hideCssSelectors.push('body.HomeTimeline header[data-page-header] [role="tablist"] + button[data-slot="xds-button"]:has([data-icon="icon-plus"])')
    }
    if (mobile && settings.hideChatNav) {
      hideCssSelectors.push(`${bottomNavItems}:has(> a[href="/i/chat"])`)
    }
    if (desktop && settings.hideChatDrawer) {
      hideCssSelectors.push('[data-slot="xds-dock-window"]:has(> [data-slot="xds-dock-launcher"] [data-icon="icon-chat"])')
    }
    if (settings.hideMetrics) {
      for (let [type, hidden] of [['quote', settings.hideQuoteTweetMetrics], ['retweet', settings.hideRetweetMetrics], ['like', settings.hideLikeMetrics]]) {
        if (hidden) hideCssSelectors.push(`.cpft-interaction-links [data-cpft-metric="${type}"] > [data-cpft-metric-count]`)
      }
      let actions = [
        settings.hideBookmarkMetrics && 'bookmark',
        settings.hideLikeMetrics && 'like',
        settings.hideReplyMetrics && 'reply',
        settings.hideRetweetMetrics && 'retweet',
      ].filter(Boolean)
      for (let action of actions) {
        // Liked hearts also have a span wrapper - target only the count
        hideCssSelectors.push(`[data-engagement-action="${action}"] .x-engagement-pill > span:has(.x-animated-count-visual)`)
      }
      if (settings.hideFollowingMetrics) {
        hideCssSelectors.push(
          'body.Profile main a:is([href$="/following"], [href$="/followers"], [href$="/verified_followers"]) span.font-bold',
          '[data-base-ui-portal] a:is([href$="/following"], [href$="/followers"], [href$="/verified_followers"]) span.font-bold',
        )
      }
      if (settings.hideProfileHeaderMetrics) {
        hideCssSelectors.push('body.Profile main > div > div:first-of-type .text-subtext2')
      }
    }
    if (desktop && settings.hideLiveBroadcasts) {
      hideCssSelectors.push('section:has(> [data-fleetline-rows])')
    }
    if (mobile && settings.hideLiveBroadcastBar) {
      hideCssSelectors.push('header[data-page-header] [class~="group/carousel"]:has(a:is([href^="/i/broadcasts/"], [href^="/i/spaces/"]))')
    }
    if (settings.hideSeeNewTweets) {
      hideCssSelectors.push('main [role="status"]:has(button[aria-keyshortcuts="."])')
    }
    if (settings.hideNotifications != 'ignore') {
      let badgeContainers = `:is(${navItems}, nav a:is([href="/notifications"], [href="/i/chat"]), nav button:has([data-icon="icon-bell"], [data-icon="icon-bell-fill"], [data-icon="icon-chat"], [data-icon="icon-chat-fill"]), button:has(.x-avatar), a[href="/account/switch"], [data-slot="xds-dock"] button:has([data-icon="icon-chat"]), [data-slot="xds-menu-content"]:has(a[href="/account/switch"]), [role="dialog"][data-slot="xds-modal-surface"]:has(a[href^="/i/jf/onboarding/web"]))`
      hideCssSelectors.push(
        `${badgeContainers} span.bg-btn-brand:is([aria-label], [aria-hidden="true"])`,
        '[data-slot="xds-menu-content"]:has(a[href="/account/switch"]) [role="menuitemradio"]:has(.bg-btn-brand) .sr-only',
      )
    }
    if (settings.hideExplorePageContents) {
      hideCssSelectors.push(
        'body.Explore main > div > :not(:first-child)',
        'body.Explore main > div > :first-child > :not(:has(form[role="search"]))',
        'body.Explore main > div > :first-child a[href="/settings/explore"]',
      )
      // Keep Explore's search row visible in both layouts
      cssRules.push('body.Explore main > div > :first-child > :has(form[role="search"]) { display: flex !important; }')
    }
    if (settings.hideNotifications == 'hide') {
      hideCssSelectors.push(
        `${navItems}[href="/notifications"]`,
        `${bottomNavItems}:has(> a[href="/notifications"])`,
      )
    }
    if (settings.hidePremiumUpsells) {
      hideCssSelectors.push(
        // Navigation/menu entry
        `${navItems}[href^="/i/premium_sign_up"]`,
        // Settings category
        `${SETTINGS_MODAL_SELECTOR} nav a[href^="/i/premium_sign_up"]`,
        // Page-header button
        'header[data-page-header] a[data-slot="xds-button"][href^="/i/premium_sign_up"]',
        // Sidebar module
        `${sidebarContents} > :is(section, [role="complementary"]):has(a[href^="/i/premium_sign_up"])`,
        // Inline upgrade callout
        '[data-slot="xds-callout"]:has(a[href^="/i/premium_sign_up"])',
        '.mx-4.my-3:has([data-slot="xds-callout"] a[href^="/i/premium_sign_up"])',
        // Own-Tweet analytics upsell
        'article .bg-secondary:has(a[href="/i/account_analytics"])',
        // Profile Get verified button
        'body.Profile main a[data-slot="xds-button"][href^="/i/premium_sign_up"]',
      )
      if (premium === false) {
        let ownTweetMenu = '[data-slot="xds-menu-content"]:has([data-icon="icon-trashcan"]):has([data-icon="icon-pin"])'
        hideCssSelectors.push(
          // Highlight action in an own-tweet menu
          `${ownTweetMenu} [data-slot="xds-menu-item"]:has([data-icon="icon-sparkles"])`,
          // Edit action in an own-tweet menu
          `${ownTweetMenu} [data-slot="xds-menu-item"]:has([data-icon="icon-edit-line"])`,
          // Add to Folder action in the bookmark confirmation toast
          '[data-sonner-toast]:has(use[href="#icon-bookmark"]) button[data-slot="xds-button"]',
        )
      }
      // Work experience is a premium upsell if you don't have acccess to it
      if (workExperience === false) {
        hideCssSelectors.push(
          // Own-profile entry point
          'body.Profile main span:has(> a[href="/settings/profile?work_role=new"])',
          // Profile editor
          '[role="dialog"][data-slot="xds-modal-surface"]:has([data-edit-profile-bar]) div:has(> .border-dashed > button [data-icon="icon-briefcase"])',
        )
      }
    }
    if (settings.hideShareTweetButton) {
      hideCssSelectors.push('[data-engagement-action="share"]')
    }
    if (settings.reducedInteractionMode) {
      // Native action bars have a direct data-engagement-action child
      hideCssSelectors.push('[role="group"]:has(> [data-engagement-action="reply"])')
    }
    if (settings.hideSortRepliesMenu) {
      hideCssSelectors.push(`${FOCUSED_TWEET_SELECTOR} > article button[data-slot="xds-menu-trigger"]:has([data-icon="icon-chevron-down-sm"])`)
    }
    if (settings.hideSubscriptions) {
      hideCssSelectors.push(
        // Subscriber account badge
        'svg[data-icon="icon-superfollow-fill"]',
        // Subscribe link/button
        'a[href$="/creator-subscriptions/subscribe"]',
        // Subscriptions count in profiles and hovercards, and follow-list tab
        'a[href$="/creator-subscriptions/subscriptions"]',
        // Standalone profile action wrapper (wide or compact)
        '.cpft-subscribe-action',
        // Profile Subs tab
        'body.Profile main [role="tablist"] > a[role="tab"][href$="/subs"]',
        // Connect Creators for you tab
        '[role="tab"][href="/i/connect_people?is_creator_only=true"]',
        // Subscribe menu item
        '[data-slot="xds-menu-item"]:has([data-icon="icon-superfollow"])',
      )
    }
    if (settings.hideVerifiedTabs) {
      hideCssSelectors.push('body.FollowList main [role="tablist"] > a[role="tab"][href$="/verified_followers"]')
    }
    if (desktop && settings.hideSidebarContent) {
      let keepRelevantPeople = settings.showRelevantPeople ? `:not(${relevantPeopleSection})` : ''
      let keepSearchFilters = ':not(body.Search section:has(a[href^="/search-advanced"]))'
      hideCssSelectors.push(`${sidebarContents} > :not(:has(form[role="search"]))${keepSearchFilters}${keepRelevantPeople}`)
    }
    if (desktop && settings.hideSidebarSearch) {
      hideCssSelectors.push(
        `${sidebarContents} > :has(form[role="search"])`,
        'main + aside form[role="search"]',
      )
      if (settings.hideSidebarContent && !settings.fullWidthContent) {
        let centerBody = `body:not(.Search)${settings.showRelevantPeople ? ':not(.Tweet)' : ''}`
        hideCssSelectors.push(`${centerBody} main + aside`)
        cssRules.push(`
          ${centerBody} div:has(> main + aside) {
            grid-template-columns: minmax(0, 1fr) !important;
            flex: 1 1 var(--x-main-column-width, 600px) !important;
          }
          ${centerBody} div:has(> div > main + aside)::after {
            content: "";
            display: block;
            flex: 0 10000 calc(72px + 184px * var(--x-sidebar-wide, 0));
            min-width: 0;
            pointer-events: none;
          }
          @media (width < 640px) {
            ${centerBody} div:has(> div > main + aside)::after {
              display: none !important;
            }
          }
        `)
      }
    }
    if (desktop && settings.hideTimelineTweetBox) {
      hideCssSelectors.push('body.HomeTimeline main > div > [data-media-upload-dropzone]:has(> form)')
    }
    if (desktop && !settings.hideSidebarContent && settings.hideSuggestedFollows) {
      hideCssSelectors.push(`${sidebarSections}:has([data-who-to-follow])`)
      if (!settings.showRelevantPeople) hideCssSelectors.push(relevantPeople)
    }
    if (desktop && !settings.hideSidebarContent && settings.hideTodaysNews) {
      hideCssSelectors.push(`${sidebarSections}:has(a[href^="/i/trending/"])`)
    }
    if (desktop && settings.hideSpacesNav) {
      hideCssSelectors.push(`${navItems}[href="/i/spaces/start"]`)
    }
    if (settings.hideViews) {
      hideCssSelectors.push(
        '[data-cpft-focused-timestamp] > a[href$="/analytics"]',
        '[data-cpft-focused-timestamp] > [aria-hidden="true"]:has(+ a[href$="/analytics"])',
        // Empty engagement bars omit role="group"
        'div:has(> a.x-engagement-button[href$="/analytics"])',
        '[role="group"] > div:has(> a[href$="/analytics"])',
      )
    }
    if (settings.restoreQuoteTweetsLink || settings.restoreOtherInteractionLinks) {
      hideCssSelectors.push(`${FOCUSED_TWEET_SELECTOR}:has(.cpft-interaction-links) > article a[href$="/quotes"]:has([data-icon="icon-chevron-right-sm"])`)
      if (settings.hideSortRepliesMenu) {
        // The row can contain controls besides the ones being hidden
        hideCssSelectors.push(`${FOCUSED_TWEET_SELECTOR}:has(.cpft-interaction-links) > article div:has(> button[data-slot="xds-menu-trigger"] [data-icon="icon-chevron-down-sm"]):has(> a[href$="/quotes"] [data-icon="icon-chevron-right-sm"]):has(> :first-child + :last-child)`)
      }
    }
    if (settings.restoreLinkHeadlines) {
      // Subgrid places the domain in the image footer without moving React-owned links
      let card = 'article div:has(> a[href^="https://t.co/"][target="_blank"]:first-child:nth-last-child(2) > div > img[src*="/card_img/"]):has(> a:first-child > div.absolute > div > div):has(> a[href^="https://t.co/"][target="_blank"]:last-child > div)'
      cssRules.push(`
        ${card} {
          display: grid !important;
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto auto auto;
          gap: 0 !important;
        }
        ${card} > a:first-child {
          display: grid !important;
          grid-column: 1;
          grid-row: 1 / 4;
          grid-template-rows: subgrid;
          background: var(--x-bg-primary) !important;
        }
        ${card} > a:first-child > div:first-child {
          grid-row: 1;
        }
        ${card} > a:first-child > div.absolute {
          grid-row: 3;
          position: static !important;
          padding: 0 14px 14px;
          min-width: 0;
        }
        ${card} > a:first-child > div.absolute > div {
          display: block !important;
          height: auto !important;
          max-width: none !important;
          background: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
        }
        ${card} > a:first-child > div.absolute > div > div {
          display: block !important;
          font-size: inherit !important;
          line-height: inherit !important;
          color: var(--x-fg-primary) !important;
          -webkit-line-clamp: unset !important;
          white-space: normal;
        }
        ${card} > a:last-child {
          grid-column: 1;
          grid-row: 2;
          align-self: end;
          margin: 14px 14px 2px;
          z-index: 1;
        }
        ${card} > a:last-child > div {
          font-size: inherit !important;
          line-height: inherit !important;
        }
      `)
    }
    if (settings.tweakQuoteTweetsPage) {
      hideCssSelectors.push('body.QuoteTweets main [data-slot="embedded-tweet-frame"]')
    }
    if (desktop && !settings.hideSidebarContent && settings.hideWhatsHappening) {
      hideCssSelectors.push(`${sidebarSections}:has([id^="urt:explore-sidebar:"])`)
    }
    if (settings.premiumBlueChecks == 'hide') {
      hideCssSelectors.push('svg:has(> use[href="#icon-verified-premium-color"])')
    }
    if (settings.revertXBranding) {
      if (desktop) {
        let navItem = `${DESKTOP_NAV_SELECTOR} [class~="group/sidebar-item"]`
        let interactingNav = `${navItem}:is(:hover, :active, :focus-visible)`
        cssRules.push(`
          ${navItem} > span {
            --x-btn-ghost-hover: color-mix(in srgb, var(--x-btn-brand) 10%, transparent) !important;
            --x-btn-ghost-pressed: color-mix(in srgb, var(--x-btn-brand) 20%, transparent) !important;
          }
          ${navItem} > span > span[aria-hidden="true"] > span.absolute > span.bg-btn-brand[aria-label]:not([aria-hidden="true"]) {
            box-shadow: 0 0 0 1px var(--x-bg-primary);
          }
          ${interactingNav},
          ${interactingNav} .text-headline2,
          ${interactingNav} > span > span[aria-hidden="true"] > span.grid svg {
            color: var(--x-btn-brand) !important;
          }
        `)
      }
      cssRules.push(`
        [role="tablist"] > [role="presentation"][style*="--active-tab-left:"][style*="--active-tab-width:"],
        [role="tablist"] > [data-cpft-timeline-indicator],
        [role="tablist"] > ${TAB_UNDERLINE_SELECTOR} {
          background-color: var(--x-btn-brand) !important;
        }
        ${LOGO_PATH_SELECTOR} {
          fill: ${TWITTER_BLUE};
          d: path("${Svgs.TWITTER_LOGO_PATH}");
        }
        ${HOME_ICON_SELECTOR}[data-icon="icon-home"] > path {
          d: path("${Svgs.TWITTER_HOME_INACTIVE_PATH}");
        }
        ${HOME_ICON_SELECTOR}[data-icon="icon-home-fill"] > path {
          d: path("${Svgs.TWITTER_HOME_ACTIVE_PATH}");
        }
        :is(${COMPOSE_BUTTON_SELECTOR}, ${COMPOSER_SUBMIT_BUTTON_SELECTOR}) {
          background-color: var(--x-btn-brand) !important;
          color: var(--x-fg-on-brand) !important;
        }
        :is(${COMPOSE_BUTTON_SELECTOR}, ${COMPOSER_SUBMIT_BUTTON_SELECTOR}):hover {
          background-color: var(--x-btn-brand-hover) !important;
        }
        :is(${COMPOSE_BUTTON_SELECTOR}, ${COMPOSER_SUBMIT_BUTTON_SELECTOR}):active {
          background-color: var(--x-btn-brand-pressed) !important;
        }
        ${COMPOSER_TOOLBAR_SELECTOR} button,
        ${COMPOSER_SELECTOR} button:has([data-icon="icon-plus"]) {
          color: var(--x-btn-brand) !important;
          --x-fg-secondary: var(--x-btn-brand) !important;
          --x-btn-ghost-hover: color-mix(in srgb, var(--x-btn-brand) 10%, transparent) !important;
          --x-btn-ghost-pressed: color-mix(in srgb, var(--x-btn-brand) 20%, transparent) !important;
        }
        ${COMPOSER_SELECTOR} [role="progressbar"][aria-valuemax] circle.text-primary[stroke-dasharray]:not(.text-warning, .text-destructive) {
          color: var(--x-fg-brand) !important;
        }
        ${COMPOSER_MODAL_SELECTOR} [data-slot="xds-modal-header"] button:not(:has(svg)) {
          color: var(--x-fg-brand) !important;
          --x-btn-ghost-hover: color-mix(in srgb, var(--x-btn-brand) 10%, transparent) !important;
          --x-btn-ghost-pressed: color-mix(in srgb, var(--x-btn-brand) 20%, transparent) !important;
          font-size: calc(14 / var(--x-root-font-size,16) * 1rem * var(--x-font-scale,1)) !important;
          line-height: var(--tw-leading,calc(16 / var(--x-root-font-size,16) * 1rem * var(--x-font-scale,1))) !important;
          font-weight: var(--font-weight-medium,500) !important;
        }
        ${COMPOSE_ICON_SELECTOR} > path:first-child {
          d: path("${Svgs.TWITTER_FEATHER_PLUS_PATH}");
          fill-rule: nonzero;
        }
        ${COMPOSE_ICON_SELECTOR} > path:not(:first-child) {
          display: none;
        }
      `)
    }

    if (mobile && (settings.disableHomeTimeline || settings.hideGrok ||
        settings.hideChatNav || settings.hideNotifications == 'hide')) {
      // The native highlight retains the original item count and index
      let visiblePaths = [
        !settings.disableHomeTimeline && '/home',
        '/explore',
        !settings.hideGrok && '/i/grok',
        settings.hideNotifications != 'hide' && '/notifications',
        !settings.hideChatNav && '/i/chat',
      ].filter(Boolean)
      cssRules.push(`
        ${bottomNav} {
          --cpft-bottom-nav-direction: 1;
        }
        ${bottomNav}:dir(rtl) {
          --cpft-bottom-nav-direction: -1;
        }
      `)
      visiblePaths.forEach((path, index) => {
        cssRules.push(`
          ${bottomNav}:has(> div > a[href="${path}"][aria-current="page"]) > span[aria-hidden="true"] > span {
            width: ${100 / visiblePaths.length}% !important;
            transform: translateX(calc(${index * 100}% * var(--cpft-bottom-nav-direction))) !important;
          }
        `)
      })
    }

    if (hideCssSelectors.length > 0) {
      cssRules.push(`
        ${hideCssSelectors.join(',\n')} {
          display: none !important;
        }
      `)
    }

    let css = cssRules.map(dedent).join('\n')
    if (!css) {
      $style?.remove()
      $style = null
    } else if ($style == null) {
      $style = addStyle(css)
    } else {
      $style.textContent = css
    }
  }
  configureCss.refreshPremium = () => {
    if (enabled && (premium !== viewerHasPremium() || workExperience !== viewerCanAddWorkExperience())) configureCss()
  }
  return configureCss
})()
//#endregion

//#region Tweet functions
/**
 * Owns grids for the Tweets currently mounted in one timeline or loading card.
 * @param {Element} $container
 * @param {string} timelineId
 * @param {{isCurrent?: () => boolean}} options
 */
function createTweetMediaGrid($container, timelineId, {isCurrent = syncPageUrl} = {}) {
  let selector = '[class~="group/carousel"]'
  let records = new Map()
  let rows = new Map()
  let expanded = new Set()
  let pending = new Set()
  let frame = null
  let scope = null

  function clear($carousel) {
    let record = records.get($carousel)
    if (!record) return
    record.button?.remove()
    for (let [$element, attribute] of record.tags) $element.removeAttribute(attribute)
    record.scroller.removeAttribute('data-cpft-media-grid-expanded')
    records.delete($carousel)
  }

  function update($carousel) {
    if (!$carousel.isConnected || !$carousel.matches(selector) || !$carousel.closest('article')) {
      clear($carousel)
      return
    }
    let $scroller = $carousel.querySelector('.overflow-x-auto')
    let $wrap = $scroller?.parentElement
    let $layer = $carousel.parentElement
    let $frame = $layer?.parentElement
    let $container = $frame?.parentElement
    let items = Array.from($scroller?.children || [])
    let links = items.map($item => $item.querySelector('a[href*="/photo/"]'))
    let paths = links.map($link => $link?.getAttribute('href') || '')
    let media = paths.map(path => /^(\/[a-zA-Z\d_]{1,20}\/status\/\d+)\/photo\/(\d+)(?:[?#]|$)/.exec(path))
    if (items.length < 2 || !$frame?.style.paddingBottom || $wrap?.parentElement != $carousel ||
        media.some((match, i) => !match || match[1] != media[0]?.[1] || Number(match[2]) != i + 1) ||
        items.some($item => $item.querySelector('video'))) {
      clear($carousel)
      return
    }
    // Use native dimensions: measuring overflow after applying the grid would make it toggle itself off
    let heightRatio = Number(/([\d.]+)%/.exec($frame.style.paddingBottom)?.[1]) / 100
    let totalAspectRatio = items.reduce((total, $item) => {
      let [width, height = 1] = $item.style.aspectRatio.split('/').map(Number)
      return total + width / height
    }, 0)
    // Allow for rounding in the native percentage and aspect ratios
    if (!(heightRatio * totalAspectRatio > 1.0001)) {
      clear($carousel)
      return
    }
    let signature = paths.join('\n')
    let record = records.get($carousel)
    if (record && (record.signature != signature || record.scroller != $scroller || record.container != $container)) {
      clear($carousel)
      record = null
    }
    if (!record) {
      let tags = [
        [$scroller, 'data-cpft-media-grid'],
        [$wrap, 'data-cpft-media-grid-wrap'],
        [$carousel, 'data-cpft-media-grid-carousel'],
        [$layer, 'data-cpft-media-grid-layer'],
        [$frame, 'data-cpft-media-grid-frame'],
        [$container, 'data-cpft-media-grid-container'],
      ]
      record = {signature, scroller: $scroller, container: $container, tags, expanded: expanded.has(signature), button: null}
      records.set($carousel, record)
      for (let [$element, attribute] of tags) $element.setAttribute(attribute, '')
      $scroller.setAttribute('data-cpft-media-grid', String(Math.min(items.length, 6)))
      if (record.expanded) $scroller.setAttribute('data-cpft-media-grid-expanded', '')
    }
    if (record.expanded || items.length <= 6) return
    if (record.button?.parentElement == items[5]) return
    record.button?.remove()
    let $button = document.createElement('button')
    $button.type = 'button'
    $button.setAttribute('data-cpft-media-grid-more', '')
    $button.setAttribute('aria-expanded', 'false')
    $button.textContent = `+${Intl.NumberFormat(lang).format(items.length - 6)}`
    $button.setAttribute('aria-label', `${getString('SHOW')} ${$button.textContent}`)
    items[5].appendChild($button)
    record.button = $button
  }

  function processItem($item) {
    let carousels = new Set($item.querySelectorAll(selector))
    for (let $carousel of rows.get($item) || []) if (!carousels.has($carousel)) clear($carousel)
    for (let $carousel of carousels) update($carousel)
    rows.set($item, carousels)
  }

  function observeItems() {
    for (let $item of rows.keys()) observer.observe($item, {childList: true, subtree: true})
  }

  function flush() {
    frame = null
    if (!enabled || !isCurrent()) return
    observer.disconnect()
    for (let $item of pending) if (rows.has($item) && $container.contains($item)) processItem($item)
    pending.clear()
    observeItems()
  }

  function queueItems(mutations) {
    for (let mutation of mutations) {
      let $item = mutation.target
      while ($item && !rows.has($item)) $item = $item.parentElement
      if ($item) pending.add($item)
    }
  }
  let observer = new MutationObserver(mutations => {
    queueItems(mutations)
    if (pending.size && frame == null) frame = requestAnimationFrame(flush)
  })
  function onClick(event) {
    let $button = event.target?.closest?.('[data-cpft-media-grid-more]')
    if (!$button || event.button != 0) return
    let $carousel = $button.closest(selector)
    let record = records.get($carousel)
    if (!record || record.button != $button) return
    event.preventDefault()
    event.stopImmediatePropagation()
    record.expanded = true
    expanded.add(record.signature)
    record.scroller.setAttribute('data-cpft-media-grid-expanded', '')
    if (document.activeElement == $button) {
      let $nextPhoto = /** @type {HTMLElement} */ (record.scroller.children[6]?.querySelector('a[href*="/photo/"]'))
      $nextPhoto?.focus({preventScroll: true})
    }
    $button.remove()
    record.button = null
  }
  $container.addEventListener('click', onClick, true)
  return {
    update($items, changedItems) {
      queueItems(observer.takeRecords())
      observer.disconnect()
      let nextScope = timelineId.startsWith('urt:home:following:') ? separatedTweetsTimelineSelected : false
      let scopeChanged = scope != nextScope
      if (scopeChanged) {
        for (let $carousel of records.keys()) clear($carousel)
        expanded.clear()
        scope = nextScope
      }
      let mounted = new Set($items)
      for (let [$item, carousels] of rows) {
        if (mounted.has($item)) continue
        for (let $carousel of carousels) clear($carousel)
        rows.delete($item)
        pending.delete($item)
      }
      for (let $item of $items) {
        if (!scopeChanged && rows.has($item) && !changedItems.has($item) && !pending.has($item)) continue
        if (!rows.has($item) && !$item.querySelector('article')) continue
        processItem($item)
      }
      pending.clear()
      if (frame != null) cancelAnimationFrame(frame)
      frame = null
      observeItems()
    },
    disconnect() {
      observer.disconnect()
      $container.removeEventListener('click', onClick, true)
      if (frame != null) cancelAnimationFrame(frame)
      for (let $carousel of records.keys()) clear($carousel)
      rows.clear()
      pending.clear()
      expanded.clear()
    },
  }
}

/** @param {Element} $item */
function clearUnavailableTweetContent($item) {
  $item.classList.remove('cpft-unavailable-tweet')
  for (let $content of $item.querySelectorAll('.cpft-unavailable-content, .cpft-unavailable-tweet')) {
    $content.classList.remove('cpft-unavailable-content', 'cpft-unavailable-tweet')
  }
}

/**
 * Reply groups follow their initial reply - focused tweets and ancestors stay visible.
 * @returns {import("./types").XwebTimelineProcessor}
 */
function createIndividualTweetTimelineProcessor(tweetPath = currentPagePath) {
  let readState = createConversationStateReader()
  let focusedId = /\/status\/(\d+)/.exec(tweetPath)?.[1]
  // Keep the focus boundary while virtual scrolling unmounts its row
  /** @type {number | null} */
  let focusedIndex = null
  let $timeline = null
  let timelineId = ''
  let op = /^\/([a-zA-Z\d_]{1,20})\/status\//.exec(tweetPath)?.[1]?.toLowerCase()
  let classifications = new WeakMap()
  let focusedTargets = []
  let cleanupFocused = null
  function cleanup() {
    cleanupFocused?.()
    cleanupFocused = null
    focusedTargets = []
  }
  /** @type {Record<string, import("./types").TimelineItemType>} */
  let replyTypes = {
    '#icon-verified-premium-color': 'BLUE_REPLY',
    '#icon-verified-business-color': 'BUSINESS_REPLY',
    '#icon-verified-government-color': 'GOVERNMENT_REPLY',
  }
  return function processIndividualTweetTimelineItems($items, id, changedItems) {
    let processed = 0
    let $nextTimeline = $items[0]?.closest('[id^="urt:conversation:"]')
    let nextTimelineId = $nextTimeline?.id || ''
    let matchesConversation = /^urt:conversation:(\d+)(?::|$)/.exec(nextTimelineId)?.[1] == focusedId
    if ($nextTimeline && ($nextTimeline != $timeline || nextTimelineId != timelineId)) {
      $timeline = $nextTimeline
      timelineId = nextTimelineId
      focusedIndex = null
    }
    let $focused = $items.find($item => $item.matches(FOCUSED_TWEET_SELECTOR))
    if ($focused) {
      let index = Number($focused.closest('li[data-index]').getAttribute('data-index'))
      focusedIndex = Number.isInteger(index) && index >= 0 ? index : null
    }
    let ids = new Set(focusedId ? [focusedId] : [])
    for (let $item of $items) {
      let path = $item.getAttribute('data-href') || $item.children[0]?.getAttribute('data-href') || ''
      let id = /\/status\/(\d+)/.exec(path)?.[1]
      if (id) ids.add(id)
    }
    let state = settings.hidePremiumReplies || debug ? readState(ids) : null
    let opId = state?.authors.get(focusedId)?.id
    for (let $item of $items) {
      let cached = classifications.get($item)
      let changed = !cached || changedItems.has($item)
      if (changed) {
        cached = {type: getTimelineItemType($item, true)}
        classifications.set($item, cached)
      }
      let type = cached.type
      if (type == 'DISCOVER_MORE' || type == 'WHO_TO_FOLLOW') {
        if (!changed) continue
        processed++
        if (debug) $item.setAttribute('data-item-type', type)
        else $item.removeAttribute('data-item-type')
        $item.classList.remove('HiddenAd')
        $item.classList.toggle('HiddenTweet', type == 'DISCOVER_MORE' ? settings.hideDiscoverSuggestions : settings.hideSuggestedContentTimeline)
        if (type == 'DISCOVER_MORE') {
          for (let $tweet of $item.querySelectorAll('[data-href]:has(> article)')) {
            $tweet.classList.toggle('cpft-unavailable-tweet', processUnavailableTweetContent($tweet))
          }
        }
        continue
      }
      // Continuations, including OP replies, share the initial reply's hide decision
      let $tweet = $item.hasAttribute('data-href') || type == 'FOCUSED_TWEET' ? $item :
        type == 'THREAD' || $item.children.length == 1 ? $item.children[0] : null
      if (changed) {
        cached.tweetType = type == 'THREAD' ? getTweetType($tweet) : type
        cached.unavailable = processUnavailableTweetContent($item, $tweet || $item)
        cached.isAi = (settings.hideAiTweets || debug) && hasAiDisclosure($tweet)
      }
      processTweet($item, cached, $tweet, changed)
    }

    let targets = $focused ? [$focused, $focused.querySelector(':scope > article'),
      getFocusedTweetTimestamp($focused, tweetPath), getFocusedTweetActions($focused)] : []
    if (targets.length != focusedTargets.length || targets.some(($target, i) => $target != focusedTargets[i])) {
      cleanup()
      focusedTargets = targets
      if ($focused) cleanupFocused = tweakFocusedTweet($focused, tweetPath, readState)
    }
    return {processed, cleanup}

    function processTweet($item, cached, $tweet, changed) {
      let type = cached.tweetType
      let unavailable = cached.unavailable
      let match = /^\/([a-zA-Z\d_]{1,20})\/status\/(\d+)/.exec($tweet?.getAttribute('data-href') || '')
      let author = match?.[1]?.toLowerCase()
      let user = state?.authors.get(match?.[2])
      let isOp = author == op || (opId != null && user?.id == opId)
      let isUser = state && ((user?.id != null && user.id == state.viewer.id) ||
        (author && author == state.viewer.screenName?.toLowerCase()))
      let index = Number($item.closest('li[data-index]').getAttribute('data-index'))
      // VerticalConversation wraps replies - ancestors and the focus are individual cards
      let replyGroup = Boolean(matchesConversation && !$item.hasAttribute('data-href') &&
        $item.children[0]?.matches('[data-href]:has(> article)'))
      let reply = focusedIndex != null ? index > focusedIndex : replyGroup
      let context = JSON.stringify([reply, isOp, isUser, user])
      if (!changed && cached.context == context) return
      cached.context = context
      processed++
      let isAi = cached.isAi
      let own = isUser || ((settings.hideAiTweets && isAi || settings.hidePaidPartnerships && type == 'PAID_PARTNERSHIP') && isOwnTweet($tweet || $item))
      let hidden = unavailable && reply
      hidden ||= settings.hidePremiumUpsells && type == 'PREMIUM_UPSELL'
      hidden ||= settings.hideAiTweets && reply && isAi && !own
      // Exempt ancestors/focus and groups whose initial reply is by OP/self
      if (reply && author && !isOp && !isUser && ['TWEET', 'QUOTE_TWEET'].includes(type)) {
        if (user?.verifiedType == 'Business') type = 'BUSINESS_REPLY'
        else if (user?.verifiedType == 'Government') type = 'GOVERNMENT_REPLY'
        else if (user?.blueVerified === true) type = 'BLUE_REPLY'
        else if (user?.blueVerified == null && user?.verifiedType == null) {
          if (cached.badgeType === undefined) {
            cached.badgeType = null
            let $article = $tweet?.querySelector(':scope > article')
            let $header = $article?.querySelector('[class~="@container/post-actions"]')
            for (let $badge of $header?.querySelectorAll('use[href^="#icon-verified-"]') || []) {
              // Match the reply author's badge in its own article
              if ($badge.closest('article') != $article) continue
              let verifiedType = replyTypes[$badge.getAttribute('href')]
              if (verifiedType) {
                cached.badgeType = verifiedType
                break
              }
            }
          }
          type = cached.badgeType || type
        }
        if (!hidden && state && user && ['BLUE_REPLY', 'BUSINESS_REPLY', 'GOVERNMENT_REPLY'].includes(type) &&
            shouldHidePremiumReply(type, user, state.viewer)) {
          hidden = true
        }
      }
      if (debug) $item.setAttribute('data-item-type', `${type}${isAi ? ' / AI' : ''}`)
      else $item.removeAttribute('data-item-type')
      // Paid partnerships preserve focus/ancestor context - ad placements always hide
      let ad = type == 'PROMOTED_TWEET' || settings.hidePaidPartnerships && type == 'PAID_PARTNERSHIP' && reply && !own
      $item.classList.toggle('HiddenAd', ad)
      $item.classList.toggle('HiddenTweet', hidden)
    }
  }
}

/**
 * @param {Element} $item
 * @returns {import("./types").TimelineItemType}
 */
function getTimelineItemType($item, conversation = currentPageType == 'Tweet') {
  // Suggested-user modules combine profile cards with a heading or connect-people footer
  if ($item.querySelector(':scope > [data-href]:not(:has(article)) .x-avatar') &&
      ($item.querySelector(':scope > a:is([href="/i/connect_people"], [href^="/i/connect_people?"])') ||
       $item.querySelector(':scope > div:not([data-href]) h2'))) return 'WHO_TO_FOLLOW'
  if (conversation && $item.matches(FOCUSED_TWEET_SELECTOR)) return 'FOCUSED_TWEET'
  if (conversation && $item.children.length > 1 &&
      $item.children[0].querySelector('h2') && !$item.children[0].querySelector('article') &&
      Array.from($item.children).slice(1).every($tweet => getTweetType($tweet) != null)) return 'DISCOVER_MORE'
  let type = getTweetType($item)
  if (type != null) return type
  // Conversation groups start with a reply, followed by continuations or controls
  if (conversation && !$item.hasAttribute('data-href') && $item.children.length > 0) {
    let replyType = getTweetType($item.children[0])
    if (replyType != null) return $item.children.length > 1 ? 'THREAD' : replyType
  }
  if (currentPageType == 'Notifications') {
    // Notification summaries put the event icon before the actors and preview
    let icon = $item.querySelector('[data-icon]')?.getAttribute('data-icon')
    if (icon == 'icon-person-fill') return 'NOTIFICATION_FOLLOW'
    if (icon == 'icon-repost-fill') return 'NOTIFICATION_RETWEET'
    if (icon == 'icon-heart-fill') return 'NOTIFICATION_LIKE'
  }
  if ($item.children.length > 1 &&
      Array.from($item.children).every($tweet => ['TWEET', 'QUOTE_TWEET'].includes(getTweetType($tweet)))) {
    return 'THREAD'
  }
  if (!$item.querySelector('article')) {
    if ($item.querySelector('a:is([href^="/i/premium_sign_up"], [href^="https://x.com/i/premium_sign_up"])')) return 'PREMIUM_UPSELL'
    if ($item.querySelector('button [data-icon="icon-close-md"]')) return 'INLINE_PROMPT'
    if ($item.querySelector('h2')) return 'HEADING'
  }
  return 'UNKNOWN'
}

/**
 * @param {Element} $tweet
 * @returns {import("./types").TweetType | null}
 */
function getTweetType($tweet) {
  let path = $tweet.getAttribute('data-href') || ''
  let author = /^\/([a-zA-Z\d_]{1,20})\/status\/\d+(?:[/?#]|$)/.exec(path)?.[1]
  let $article = $tweet.querySelector(':scope > article')
  if (!author || !$article) return null
  let $body = $article.querySelector(':scope > article') || $article
  // "Ad" disclosures link to a profile beside More
  let $disclosure = $body.querySelector('a[href]:has(+ button use[href="#icon-more-dots-hor"])')
  if (/^\/[a-zA-Z\d_]{1,20}$/.test($disclosure?.getAttribute('href') || '')) return 'PROMOTED_TWEET'
  // Cards share a translated ad disclosure inside their destination link
  for (let $label of $body.querySelectorAll('a[href][target="_blank"] div:not(:has(div))')) {
    if ($label.closest('[data-slot="embedded-tweet-frame"]')) continue
    if (matchTemplate(getString('AD_FROM'), $label.textContent.trim())?.get('{url}')) return 'PROMOTED_TWEET'
  }
  // Boosted disclosures use a span or a button which opens the booster details
  if ($body.querySelector(':scope > :is(span, button) [data-icon="icon-rocket"]')) return 'PROMOTED_TWEET'
  // Paid partnerships retain their policy link outside promoted placements
  if ($body.querySelector('a[href^="https://help.x.com/"][href$="/rules-and-policies/paid-partnerships-policy"]:has([data-icon="icon-promoted-square-fill"])')) return 'PAID_PARTNERSHIP'
  let $socialIcon = $article.children.length > 1 ? $article.children[0].querySelector('[data-icon]') : null
  let socialIcon = $socialIcon?.closest('article') == $article ? $socialIcon.getAttribute('data-icon') : null
  if (socialIcon == 'icon-pin-fill') return 'PINNED_TWEET'
  if (socialIcon == 'icon-communities-fill') return 'COMMUNITY_TWEET'
  let quote = Boolean($body.querySelector('[data-slot="embedded-tweet-frame"]'))
  if (socialIcon == 'icon-repost-fill') {
    return quote ? 'RETWEETED_QUOTE_TWEET' : 'RETWEET'
  }
  return quote ? 'QUOTE_TWEET' : 'TWEET'
}

/** @param {Element | null} $tweet */
function hasAiDisclosure($tweet) {
  let $article = $tweet?.querySelector(':scope > article')
  let $body = $article?.querySelector(':scope > article') || $article
  // Only count icons whose nearest article is the Tweet's own article
  let icons = $body?.querySelectorAll('svg[data-icon="icon-sparkles-fill"]') || []
  return Array.from(icons).some($icon => $icon.closest('article') == $body)
}

/**
 * Filter ordinary feed items.
 * @param {Element[]} $items
 * @param {string} timelineId
 */
function processTimelineItems($items, timelineId) {
  for (let $item of $items) {
    let type = getTimelineItemType($item)
    let isAi = (settings.hideAiTweets || debug) && hasAiDisclosure(type == 'THREAD' ? $item.children[0] : $item)
    if (debug) $item.setAttribute('data-item-type', `${type}${isAi ? ' / AI' : ''}`)
    else $item.removeAttribute('data-item-type')
    let own = (settings.hideAiTweets && isAi || settings.hidePaidPartnerships && type == 'PAID_PARTNERSHIP') && isOwnTweet($item)
    let ad = type == 'PROMOTED_TWEET' || settings.hidePaidPartnerships && type == 'PAID_PARTNERSHIP' && !own
    // Grouped threads follow their initial tweet's shared-content setting
    let tweetType = type == 'THREAD' ? getTweetType($item.children[0]) : type
    let hidden = shouldHideTimelineTweet(tweetType, timelineId)
    hidden ||= processUnavailableTweetContent($item)
    hidden ||= settings.hideAiTweets && isAi && !own
    if (type == 'NOTIFICATION_LIKE') hidden = settings.hideNotificationLikes
    if (type == 'NOTIFICATION_RETWEET') hidden = settings.hideNotificationRetweets
    if (type == 'WHO_TO_FOLLOW') hidden = settings.hideSuggestedContentTimeline
    if (type == 'INLINE_PROMPT') hidden = settings.hideInlinePrompts
    if (type == 'PREMIUM_UPSELL') hidden = settings.hidePremiumUpsells
    $item.classList.toggle('HiddenAd', ad)
    $item.classList.toggle('HiddenTweet', hidden)
  }
}

/** @param {Element} $tweet */
function isOwnTweet($tweet) {
  let path = $tweet.getAttribute('data-href') ||
    $tweet.children[0]?.getAttribute('data-href') ||
    $tweet.querySelector('a[href*="/status/"][data-base-ui-tooltip-trigger]:not([data-slot="embedded-tweet-frame"] a)')?.getAttribute('href') || ''
  let author = /^\/([a-zA-Z\d_]{1,20})\/status\/\d+(?:[/?#]|$)/.exec(path)?.[1]
  if (!author) return false
  viewerRouter ||= findRouter()
  let viewer = viewerRouter?.options?.context?.viewerScreenName
  return Boolean(viewer && author.toLowerCase() == viewer.toLowerCase())
}

/**
 * @param {Element} $item
 * @param {Element} [$tweet]
 */
function processUnavailableTweetContent($item, $tweet = $item) {
  let unavailable = false
  for (let $frame of $item.querySelectorAll('[data-slot="embedded-tweet-frame"]')) {
    // Resolved quotes and loading skeletons must not be mistaken for warnings
    let warning = !$frame.querySelector('article') && (
      $frame.textContent.trim() == getString('POST_UNAVAILABLE') ||
      Array.from($frame.querySelectorAll('button')).some($button => $button.textContent.trim() == getString('VIEW'))
    )
    let hidden = settings.hideUnavailableQuoteTweets && warning
    if (hidden) {
      let $owner = $frame.closest('[data-href]:not([data-slot="embedded-tweet-frame"]), [data-cpft-focused-tweet], [data-navigation-stop][tabindex="-1"]') || $tweet
      hidden = !isOwnTweet($owner)
    }
    $frame.classList.toggle('cpft-unavailable-content', hidden)
    // Clean up all warnings, but let the initial tweet control a joined group
    unavailable ||= hidden && $tweet.contains($frame)
  }
  // Standalone generic unavailable placeholder
  let $article = $tweet.querySelector(':scope > article')
  unavailable ||= $article?.textContent?.trim() == getString('POST_UNAVAILABLE')
  return settings.hideUnavailableQuoteTweets && unavailable && !isOwnTweet($tweet)
}

function shouldHidePremiumReply(type, user, viewer) {
  if (!settings.hidePremiumReplies || (!viewer.id && !viewer.screenName)) return false
  if (type == 'BUSINESS_REPLY' && settings.showPremiumReplyBusiness) return false
  if (type == 'GOVERNMENT_REPLY' && settings.showPremiumReplyGovernment) return false
  if (settings.showPremiumReplyFollowing && user.following !== false) return false
  if (settings.showPremiumReplyFollowedBy && user.followedBy !== false) return false
  if (settings.showPremiumReplyFollowersCount &&
      (user.followersCount == null || user.followersCount >= Number(settings.showPremiumReplyFollowersCountAmount))) return false
  return user.blueVerified === true || user.verifiedType == 'Business' || user.verifiedType == 'Government'
}

/** @param {import("./types").TimelineItemType | null} type */
function shouldHideTimelineTweet(type, timelineId) {
  let retweet = type == 'RETWEET' || type == 'RETWEETED_QUOTE_TWEET'
  let quote = type == 'QUOTE_TWEET' || type == 'RETWEETED_QUOTE_TWEET'
  if (isOnSeparatedTweetsTimeline()) {
    if (!retweet && !quote && !['TWEET', 'PINNED_TWEET', 'COMMUNITY_TWEET'].includes(type)) return false
    // The virtual view belongs to Following - native tab switching is asynchronous
    // An explicit Hide takes precedence when a tweet belongs to both categories
    return !timelineId.startsWith('urt:home:following:') ||
      retweet && settings.retweets == 'hide' || quote && settings.quoteTweets == 'hide' ||
      !(retweet && settings.retweets == 'separate' || quote && settings.quoteTweets == 'separate')
  }
  if (retweet) {
    if (timelineId.startsWith('urt:reposts:')) return false
    if (timelineId.startsWith('urt:list-tweets:')) return settings.hideListRetweets
    if (currentPageType == 'Profile') return settings.hideProfileRetweets
  }
  return currentPageType == 'HomeTimeline' &&
    (retweet && settings.retweets != 'ignore' || quote && settings.quoteTweets != 'ignore')
}
//#endregion

//#region Page observers
async function observeProfileSubscriptions() {
  let $main = /** @type {HTMLElement} */ (document.querySelector('main'))
  if (!$main) return
  let selector = '[class*="--profile-avatar-size:"]'
  let $header = await getElement(selector, {context: $main, name: 'profile header', observers: pageObservers})
  if (!$header?.isConnected || !enabled || !settings.hideSubscriptions || currentPageType != 'Profile' || !syncPageUrl()) return
  let name = 'profile subscriptions'
  pageObservers.get(name)?.disconnect()
  let $container = $header.parentElement
  let tagged = new Set()
  let observer = observeElement($container, update, name)

  function update() {
    observer.disconnect()
    observer.observe($container, {childList: true})
    $header = /** @type {HTMLElement} */ ($container.querySelector(`:scope > ${selector}`))
    let next = new Set()
    if ($header) {
      observer.observe($header, {childList: true, subtree: true})
      if (settings.hideSubscriptions) {
        for (let $link of $header.querySelectorAll('a[href$="/creator-subscriptions/subscribe"]')) {
          let $span = $link.parentElement
          let $wrapper = $span?.parentElement
          if (!$span?.matches('span.inline-grid:only-child')) continue
          // Wide column beside Message, or compact action beside More
          if ($wrapper?.matches('div:is(.flex-1, [class~="empty:hidden"])')) next.add($wrapper)
        }
      }
    }
    for (let $wrapper of tagged) if (!next.has($wrapper)) $wrapper.classList.remove('cpft-subscribe-action')
    for (let $wrapper of next) $wrapper.classList.add('cpft-subscribe-action')
    tagged = next
  }

  pageObservers.set(name, {name, disconnect() {
    observer.disconnect()
    for (let $wrapper of tagged) $wrapper.classList.remove('cpft-subscribe-action')
    pageObservers.delete(name)
  }})
  update()
}

/**
 * Find the timeline root within the page content.
 * @param {Element} $container
 * @param {string | (() => string)} selector
 * @returns {HTMLDivElement | null}
 */
function getTimelineElement($container, selector = '[id^="urt:"]') {
  return $container.querySelector(typeof selector == 'function' ? selector() : selector)
}

/**
 * xweb keeps positioning the indicator under Following when our virtual tab
 * is selected. Use separate position variables so native updates don't move
 * it away from the selected tab.
 * @param {HTMLElement} $tabs
 * @param {Element} $tab
 */
function updateHomeTimelineIndicator($tabs, $tab) {
  if (!$tab) return
  let tab = $tab.getBoundingClientRect()
  let list = $tabs.getBoundingClientRect()
  let left = tab.left - list.left + $tabs.scrollLeft - $tabs.clientLeft
  $tabs.style.setProperty('--cpft-active-tab-left', `${left}px`)
  $tabs.style.setProperty('--cpft-active-tab-width', `${tab.width}px`)
}

/**
 * @param {HTMLElement} $tabs
 * @param {() => Element | null} getSelectedTab
 */
function observeHomeTimelineIndicator($tabs, getSelectedTab) {
  let $indicator = $tabs.querySelector(':scope > [data-cpft-timeline-indicator]')
  if (!$indicator && !$tabs.querySelector(':scope > [data-pinned-timeline-indicator]')) {
    if (!$tabs.querySelector(`:scope > ${TAB_UNDERLINE_SELECTOR}`)) return null
    // Native per-tab underlines animate through React's layout group. Our
    // virtual tab shares a DOM indicator instead.
    $indicator = document.createElement('span')
    $indicator.setAttribute('data-cpft-timeline-indicator', '')
    $indicator.setAttribute('aria-hidden', 'true')
    $tabs.appendChild($indicator)
  }
  let $observedTab = null
  let observer = new ResizeObserver(() => update())
  observer.observe($tabs)

  function update() {
    let $tab = getSelectedTab()
    if ($tab != $observedTab) {
      if ($observedTab) observer.unobserve($observedTab)
      if ($tab) observer.observe($tab)
      $observedTab = $tab
    }
    if ($indicator && $indicator.parentElement != $tabs) $tabs.appendChild($indicator)
    updateHomeTimelineIndicator($tabs, $tab)
  }

  return {
    update,
    disconnect() {
      observer.disconnect()
      $indicator?.remove()
      $tabs.style.removeProperty('--cpft-active-tab-left')
      $tabs.style.removeProperty('--cpft-active-tab-width')
    },
  }
}

/**
 * Refreshes X's cached row sizes after filtering. CSS can collapse a row before
 * the native ResizeObserver attaches, leaving its earlier size in the cache.
 * @param {Element} $list
 * @param {Set<Element>} previousHiddenRows
 * @returns {Set<Element>}
 */
function syncTimelineRowSizes($list, previousHiddenRows) {
  let hiddenRows = new Set(Array.from($list.children).filter($row => $row.matches('li[data-index]') &&
    $row.children.length > 0 && Array.from($row.children).every($item => $item.matches('.HiddenAd, .HiddenTweet'))))
  if (!hiddenRows.size && !previousHiddenRows.size) return hiddenRows
  let reactKey = Object.keys($list).find(key => key.startsWith('__reactFiber$'))
  let virtualizer = null
  // The Scroller component rendering this ul receives its virtualizer as a prop
  for (let fiber = $list[reactKey], depth = 0; fiber && depth < 50; fiber = fiber.return, depth++) {
    let candidate = fiber.memoizedProps?.virtualizer
    if (typeof candidate?.resizeItem == 'function' && typeof candidate?.options?.getItemKey == 'function' &&
        typeof candidate?.itemSizeCache?.get == 'function') {
      virtualizer = candidate
      break
    }
  }
  if (!virtualizer || virtualizer.options.horizontal || !$list.isConnected) return hiddenRows
  let updates = []
  // Read all heights before resizeItem can trigger a native render or scroll adjustment
  for (let $row of $list.children) {
    if (!$row.matches('li[data-index]')) continue
    if (!hiddenRows.has($row) && !previousHiddenRows.has($row)) continue
    let index = Number($row.getAttribute('data-index'))
    if (!Number.isInteger(index) || index < 0 || index >= virtualizer.options.count) continue
    let height = /** @type {HTMLElement} */ ($row).offsetHeight
    if (!(height > 0)) continue
    let key = virtualizer.options.getItemKey(index)
    if (virtualizer.itemSizeCache.get(key) != height) updates.push({$row, index, key, height})
  }
  for (let {$row, index, key, height} of updates) {
    if (!$list.isConnected) break
    if ($row.parentElement == $list && Number($row.getAttribute('data-index')) == index &&
        virtualizer.options.getItemKey(index) == key) virtualizer.resizeItem(index, height)
  }
  return hiddenRows
}

/**
 * Preserves filtering when live notification updates replace unread classes.
 * @param {Element} $list
 * @param {string} timelineId
 * @param {{isCurrent: () => boolean, onRestore: () => void}} options
 */
function observeNotificationClasses($list, timelineId, {isCurrent, onRestore}) {
  let hiddenClasses = new Map()
  let observer = new MutationObserver(() => {
    if (!enabled || !isCurrent()) return
    if (restore()) onRestore()
  })

  function restore() {
    let restored = false
    for (let [$item, classes] of hiddenClasses) {
      if ($item.parentElement?.parentElement != $list) continue
      for (let name of classes) {
        if ($item.classList.contains(name)) continue
        $item.classList.add(name)
        restored = true
      }
    }
    if (restored) log('notification filtering: restored hiding classes', {id: timelineId})
    return restored
  }

  return {
    pause() {
      observer.disconnect()
      restore()
    },
    update(items) {
      hiddenClasses.clear()
      for (let $item of items) {
        let classes = ['HiddenAd', 'HiddenTweet'].filter(name => $item.classList.contains(name))
        if (!classes.length) continue
        hiddenClasses.set($item, classes)
        observer.observe($item, {attributes: true, attributeFilter: ['class']})
      }
    },
    disconnect() {
      observer.disconnect()
      hiddenClasses.clear()
    },
  }
}

/**
 * Tracks mounted rows as they enter and leave the virtualized list.
 * @param {HTMLDivElement} $timeline
 * @param {string} timelineId
 * @param {import("./types").XwebTimelineProcessor} [onItemsChanged]
 * @returns {(() => void) & {refresh: () => void}}
 */
function observeTimelineItems($timeline, timelineId, onItemsChanged, {
  observers = pageObservers,
  isCurrent = syncPageUrl,
} = {}) {
  let $list = $timeline.querySelector(':scope > ul')
  if (!$list) {
    // Timeline roots can mount before their lists
    let waits = new Map()
    let cancelled = false
    let cleanupRows = null
    getElement(':scope > ul', {
      context: $timeline, name: 'timeline list', observers: waits,
      mutationObserverOptions: {childList: true},
    }).then($found => {
      if (!cancelled && $found && enabled && $timeline.isConnected && isCurrent()) {
        cleanupRows = observeTimelineItems($timeline, timelineId, onItemsChanged, {observers, isCurrent})
      }
    })
    return Object.assign(() => {
      cancelled = true
      disconnectObservers(waits, 'modal')
      cleanupRows?.()
    }, {refresh() { cleanupRows?.refresh() }})
  }
  /** @type {Set<Element>} */
  let processedItems = new Set()
  let hiddenRows = new Set()
  let cleanupProcessedItems = null
  let mediaGrid = settings.tweetMediaGrid ? createTweetMediaGrid($list, timelineId, {isCurrent}) : null
  let notificationClasses = timelineId.startsWith('urt:notifications:')
    ? observeNotificationClasses($list, timelineId, {
      isCurrent,
      onRestore: () => {
        hiddenRows = syncTimelineRowSizes($list, hiddenRows)
      },
    }) : null

  function clearItem($item) {
    clearUnavailableTweetContent($item)
    $item.classList.remove('HiddenAd', 'HiddenTweet')
    $item.removeAttribute('data-item-type')
  }

  function processRows(mutations = []) {
    if (!enabled || !isCurrent()) return
    let start = Date.now()
    notificationClasses?.pause()
    let items = []
    for (let $row of $list.children) {
      if ($row.matches('li[data-index]')) items.push(...$row.children)
    }
    let changedItems = new Set(items.filter($item => !processedItems.has($item)))
    // Explicit refreshes re-evaluate the mounted content
    if (!mutations.length) for (let $item of items) changedItems.add($item)
    let result = onItemsChanged?.(items, timelineId, changedItems) || null
    if (!onItemsChanged) processTimelineItems(items.filter($item => changedItems.has($item)), timelineId)
    mediaGrid?.update(items, changedItems)
    let nextCleanup = result?.cleanup || null
    if (nextCleanup != cleanupProcessedItems) cleanupProcessedItems?.()
    cleanupProcessedItems = nextCleanup
    let nextItems = new Set(items)
    for (let $item of processedItems) {
      if (!nextItems.has($item)) clearItem($item)
    }
    processedItems = nextItems
    notificationClasses?.update(items)
    hiddenRows = syncTimelineRowSizes($list, hiddenRows)
    if (debug && debugLogTimelineStats) {
      let categories = {}
      let hiddenCount = 0
      for (let $item of items) {
        if (!$item.classList.contains('HiddenAd') && !$item.classList.contains('HiddenTweet')) continue
        let type = $item.getAttribute('data-item-type') || 'UNKNOWN'
        categories[type] = (categories[type] || 0) + 1
        hiddenCount++
      }
      let processed = result?.processed ?? changedItems.size
      log('timeline rows processed', {id: timelineId, mounted: items.length, processed, reused: items.length - processed, hidden: hiddenCount, categories, ms: Date.now() - start})
    }
  }
  let observer = observeElement($list, processRows, {
    leading: true,
    name: 'timeline rows',
    observers,
    onDisconnect() {
      notificationClasses?.disconnect()
      mediaGrid?.disconnect()
      cleanupProcessedItems?.()
      cleanupProcessedItems = null
      for (let $item of processedItems) clearItem($item)
      processedItems.clear()
      syncTimelineRowSizes($list, hiddenRows)
      hiddenRows.clear()
    },
  })
  return Object.assign(() => observer.disconnect(), {refresh: () => processRows()})
}

/**
 * @param {Element} $container
 * @param {{
 *   timelineSelector?: string | (() => string)
 *   onItemsChanged?: import("./types").XwebTimelineProcessor
 *   onTimelineChanged?: ($timeline: HTMLDivElement | null, id: string) => void | (() => void)
 *   onContentChanged?: ($container: Element) => void
 *   onDisconnect?: () => void
 *   observers?: Map<string, import("./types").Disconnectable>
 *   isCurrent?: () => boolean
 * }} options
 */
function observeTimeline($container, {timelineSelector, onItemsChanged, onTimelineChanged, onContentChanged, onDisconnect, observers = pageObservers, isCurrent = syncPageUrl} = {}) {
  /** @type {HTMLDivElement | null} */
  let $timeline = null
  let timelineId = ''
  let initialized = false
  /** @type {(() => void) | null} */
  let cleanupTimeline = null
  let timelineDiscoveryObservers = new Map()
  let name = 'timeline container'
  observers.get(name)?.disconnect()
  let active = true
  let refreshItems = () => {}
  let observer = Object.assign(observeElement($container, update, name), {
    refreshItems() { if (active) refreshItems() },
  })
  let disconnect = observer.disconnect.bind(observer)
  observer.disconnect = () => {
    if (!active) return
    active = false
    disconnect()
    disconnectObservers(timelineDiscoveryObservers, 'page')
    cleanupTimeline?.()
    cleanupTimeline = null
    $timeline = null
    observers.delete(name)
    onDisconnect?.()
  }
  observers.set(name, observer)
  log('observing timeline container', $container)
  update()
  return observer

  function update() {
    if (!active || !enabled || !isCurrent()) return
    disconnect()
    let $nextTimeline = getTimelineElement($container, timelineSelector)
    let nextId = $nextTimeline?.id || ''
    if (!initialized || $nextTimeline != $timeline || nextId != timelineId) {
      initialized = true
      cleanupTimeline?.()
      cleanupTimeline = null
      $timeline = $nextTimeline
      timelineId = nextId
      log('timeline changed', {id: timelineId || null})
      // A replacement timeline element can reuse the same urt id
      let cleanupItems = $timeline ? observeTimelineItems($timeline, timelineId, onItemsChanged, {observers, isCurrent}) : null
      refreshItems = () => cleanupItems?.refresh()
      let cleanupPage = onTimelineChanged?.($timeline, timelineId) || null
      cleanupTimeline = () => {
        cleanupItems?.()
        cleanupPage?.()
      }
    }
    onContentChanged?.($container)
    if (!active) return
    // Once discovered, follow the actual ancestry for replacement/removal.
    for (let $parent = $nextTimeline?.parentElement; $parent && $parent != $container; $parent = $parent.parentElement) {
      observer.observe($parent, {childList: true})
    }
    observer.observe($container, {childList: true})
    if ($nextTimeline) disconnectObservers(timelineDiscoveryObservers, 'page')
    else if (!timelineDiscoveryObservers.size) {
      let selector = typeof timelineSelector == 'function' ? timelineSelector() : timelineSelector || '[id^="urt:"]'
      getElement(selector, {
        context: /** @type {HTMLElement} */ ($container), name: 'timeline root', observers: timelineDiscoveryObservers,
      }).then($found => { if ($found && active && isCurrent()) update() })
    }
  }
}

/**
 * @param {Parameters<typeof observeTimeline>[1] & {containerSelector?: string}} options
 */
function observePageTimeline({containerSelector, ...options}) {
  let path = currentPagePath
  let timeline = null
  let isCurrent = () => enabled && currentPagePath == path && getPageLocation().pathname == path
  function attach($main) {
    if (!$main?.isConnected || !isCurrent()) return
    function observe($container) {
      if ($container?.isConnected && isCurrent()) timeline = observeTimeline($container, options)
    }
    let $container = containerSelector ? $main.querySelector(containerSelector) : $main
    if ($container) observe($container)
    else getElement(containerSelector, {
      name: 'page timeline container', context: $main, observers: pageObservers,
    }).then(observe)
  }
  let $main = document.querySelector('main')
  if ($main) attach($main)
  else getElement('main', {name: 'page main', observers: pageObservers}).then(attach)
  return {refreshItems() { timeline?.refreshItems() }}
}
//#endregion

//#region Tweak functions
async function tweakRoutedModalPage(type) {
  // Routes can precede their modal or background Home content
  let selector = ROUTED_MODAL_SELECTORS.get(type)?.()
  let name = type == 'Settings' ? 'Settings' : type == 'MediaViewer' ? 'Media viewer' : 'Compose'
  let isCurrent = () => enabled && currentPageType == type && getPageType(location.pathname, '') == type
  let $modal = await getElement(selector, {name: `${name} modal`, observers: pageObservers})
  if (!$modal || !isCurrent()) return
  let $tab = await getElement(HOME_TIMELINE_TAB_SELECTOR, {name: `${name} background Home`, observers: pageObservers})
  if ($tab?.isConnected && $modal.isConnected && isCurrent()) onTitleChange(document.title, {force: true})
}

function tweakTweetEngagementPage() {
  let name = 'engagement route'
  if (pageObservers.has(name)) return
  let router = findRouter()
  if (!router) return
  let unsubscribe = router.subscribe('onResolved', () => {
    if (enabled && TWEET_ENGAGEMENT_PATH_RE.test(location.pathname) &&
        location.pathname + location.search != currentPageUrl) {
      // Engagement tabs can share a title; listen to navigation rather than DOM changes
      onTitleChange(document.title, {force: true})
    }
  })
  pageObservers.set(name, {name, disconnect() {
    unsubscribe?.()
    pageObservers.delete(name)
  }})
}

async function tweakExplorePage() {
  if (!settings.hideExplorePageContents) return
  let $main = /** @type {HTMLElement} */ (document.querySelector('main'))
  if (!$main) return
  let path = currentPagePath
  let $input = await getElement('form[role="search"] input[data-slot="xds-combobox-input"]', {
    context: $main, name: 'Explore search input', observers: pageObservers,
  })
  if ($input && enabled && settings.hideExplorePageContents && $input.isConnected &&
      currentPagePath == path && location.pathname == path && $input.getClientRects().length) $input.focus()
}

/** @param {Element} $focused */
function getFocusedTweetActions($focused) {
  let $article = $focused.querySelector(':scope > article')
  return Array.from($article?.querySelectorAll('[role="group"]') || []).find(
    $group => $group.closest('article') == $article && $group.querySelector('[data-engagement-action="like"]')
  )
}

/**
 * Restore legacy interaction links using the normalized Tweet.counts record.
 * @param {Element} $focused
 * @param {string} tweetPath
 * @param {ReturnType<typeof createConversationStateReader>} readState
 */
function restoreFocusedTweetMetrics($focused, tweetPath, readState) {
  let signature = ''
  let id = /\/status\/(\d+)/.exec(tweetPath)?.[1]
  let $actions = getFocusedTweetActions($focused)
  if (!id || !$actions) return () => {}
  let $row = null
  function update() {
    if (!enabled || !$focused.isConnected) return
    let state = readState(new Set([id]))
    let counts = state?.counts.get(id)
    if (!state || !counts || Object.values(counts).every(count => count == null)) return
    let author = state.authors.get(id)
    let own = author && ((author.id && author.id == state.viewer.id) ||
      (author.screenName && author.screenName.toLowerCase() == state.viewer.screenName?.toLowerCase()))
    let items = [
      settings.restoreQuoteTweetsLink && {type: 'quote', count: counts.quotes, path: 'quotes', label: formatCountString(settings.revertXBranding ? 'QUOTE_TWEET_COUNT' : 'QUOTE_COUNT', counts.quotes).trim()},
      settings.restoreOtherInteractionLinks && {type: 'retweet', count: counts.retweets, path: 'retweets', label: formatCountString(settings.revertXBranding ? 'RETWEET_COUNT' : 'REPOST_COUNT', counts.retweets).trim()},
      settings.restoreOtherInteractionLinks && own && {type: 'like', count: counts.likes, path: 'likes', label: formatCountString('LIKE_COUNT', counts.likes).trim()},
    ].filter(item => item && item.count > 0)
    if (!items.length) {
      $row?.remove()
      $row = null
      signature = ''
      return
    }
    let nextSignature = JSON.stringify(items)
    if ($row?.isConnected && nextSignature == signature) return
    signature = nextSignature
    $row?.remove()
    $row = document.createElement('div')
    $row.className = 'cpft-interaction-links text-subtext1 text-secondary'
    for (let item of items) {
      let $link = document.createElement('a')
      let href = `${tweetPath}/${item.path}`
      $link.setAttribute('href', href)
      $link.setAttribute('data-cpft-metric', item.type)
      $link.className = 'inline-flex items-center gap-1 hover:underline'
      let $count = document.createElement('span')
      $count.setAttribute('data-cpft-metric-count', '')
      $count.className = 'font-bold text-primary'
      $count.textContent = Intl.NumberFormat(lang, {notation: item.count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(item.count)
      let $label = document.createElement('span')
      $label.textContent = item.label
      $link.appendChild($count)
      $link.appendChild($label)
      $link.addEventListener('click', event => {
        if (event.button != 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        let router = findRouter()
        if (typeof router?.navigate != 'function') return
        event.preventDefault()
        router.navigate({to: href})
      })
      $row.appendChild($link)
    }
    let $target = $actions.parentElement?.children.length == 1 ? $actions.parentElement : $actions
    $target.insertAdjacentElement('beforebegin', $row)
  }
  let observer = observeElement($actions, () => update(), 'focused metrics')
  observer.disconnect()
  observer.observe($actions, {attributes: true, attributeFilter: ['aria-label']})
  for (let $button of $actions.querySelectorAll('[data-engagement-action] button[aria-label]')) {
    observer.observe($button, {attributes: true, attributeFilter: ['aria-label']})
  }
  let unsubscribe = readState.subscribeCounts(id, update)
  update()
  return () => {
    unsubscribe?.()
    observer.disconnect()
    $row?.remove()
  }
}

/** @param {Element} $focused
 * @param {string} tweetPath
 */
function getFocusedTweetTimestamp($focused, tweetPath) {
  let $article = $focused.querySelector(':scope > article')
  return Array.from($focused.querySelectorAll(`a:is([href=${JSON.stringify(tweetPath)}], [href=${JSON.stringify(tweetPath + '/history')}]):not([aria-hidden="true"])`))
    .find($link => $link.closest('article') == $article) || null
}

/**
 * The focused Tweet can render before the virtualized timeline, so its changes
 * need to apply to both the initial standalone card and its later timeline row.
 * @param {Element} $focused
 * @param {string} tweetPath
 * @param {ReturnType<typeof createConversationStateReader>} readState
 */
function tweakFocusedTweet($focused, tweetPath, readState) {
  configureReplySort(tweetPath)
  processUnavailableTweetContent($focused)
  let $time = getFocusedTweetTimestamp($focused, tweetPath)
  let $row = $time?.closest('div')
  // Tag the confirmed timestamp row so later Views hydration is covered by CSS
  $row?.setAttribute('data-cpft-focused-timestamp', '')
  let cleanupLocation = null
  if (settings.addFocusedTweetAccountLocation) {
    let author = /^\/([a-zA-Z\d_]{1,20})\/status\//.exec(tweetPath)?.[1]
    if ($row && author) cleanupLocation = addXwebAccountLocation($row, author, {focused: true,
      isCurrent: () => $time.isConnected && getFocusedTweetTimestamp($focused, tweetPath) == $time && $focused.contains($time)})
  }
  let cleanupMetrics = settings.restoreQuoteTweetsLink || settings.restoreOtherInteractionLinks
    ? restoreFocusedTweetMetrics($focused, tweetPath, readState) : null
  return () => {
    clearUnavailableTweetContent($focused)
    $row?.removeAttribute('data-cpft-focused-timestamp')
    cleanupLocation?.()
    cleanupMetrics?.()
  }
}

/** @param {string} tweetPath */
function configureReplySort(tweetPath) {
  let id = /\/status\/(\d+)/.exec(tweetPath)?.[1]
  if (!id) return
  if (replySortTweetId != id) {
    replySortTweetId = id
    userSortedReplies = false
    requestedReplySort = ''
  }
  if (settings.sortReplies == 'relevant' || userSortedReplies ||
      location.pathname != tweetPath && !(location.pathname.startsWith(`${tweetPath}/`) && getPageType(location.pathname, '') == 'MediaViewer')) return
  let sort = settings.sortReplies == 'liked' ? 'likes' : 'recency'
  let key = `${id}:${sort}`
  if (new URLSearchParams(location.search).get('sort_replies') == sort || requestedReplySort == key) return
  let router = findRouter()
  if (!router?.navigate) return
  requestedReplySort = key
  log('sortReplies: synchronising native sort', {id, sort})
  Promise.resolve(router.navigate({to: location.pathname, replace: true,
    search: search => ({...search, sort_replies: sort}), hash: true, state: state => state,
  })).catch(error => {
    if (requestedReplySort == key) requestedReplySort = ''
    warn('sortReplies: native sort failed', error)
  })
}

/**
 * Apply focused tweaks to the loading card before it becomes a virtualized row.
 * @param {Element} $container
 * @param {{tweetPath?: string, isCurrent: () => boolean}} options
 */
function observeInitialFocusedTweet($container, {tweetPath, isCurrent}) {
  let waits = new Map()
  let $focused = null
  let cleanup = () => {}
  let observer = observeElement($container, update, 'initial focused content')
  let binding = 0
  let href = tweetPath ? `:is([href=${JSON.stringify(tweetPath)}], [href=${JSON.stringify(tweetPath + '/history')}])` : '[href*="/status/"]'
  // The loading card has a timestamp, but is not yet a timeline row or a quote
  let selector = `article a${href}:not([aria-hidden="true"], li[data-index] a, [data-slot="embedded-tweet-frame"] a, article article a)`
  function disconnect() {
    binding++
    observer.disconnect()
    disconnectObservers(waits, 'modal')
    cleanup()
    cleanup = () => {}
    $focused?.removeAttribute('data-cpft-focused-tweet')
    $focused = null
  }
  function update() {
    if (!enabled || !$container.isConnected || !isCurrent()) {
      disconnect()
      return
    }
    if ($focused?.isConnected && $container.contains($focused) && !$focused.closest('li[data-index]')) {
      return
    }
    disconnect()
    let generation = binding
    function apply($time) {
      if (!$time?.isConnected || generation != binding || !enabled || !isCurrent() || !$container.contains($time) || !$time.matches(selector)) return
      let path = /^(\/[a-zA-Z\d_]{1,20}\/status\/\d+)(?:\/history)?\/?$/.exec($time.getAttribute('href'))?.[1]
      let $card = $time.closest('article')?.parentElement
      if (!path || !$card) return
      $focused = $card
      $focused.setAttribute('data-cpft-focused-tweet', '')
      // Temporary loading-card observation ends when the timeline takes over
      observer.observe($container, {childList: true, subtree: true})
      let cleanupFocused = tweakFocusedTweet($focused, path, createConversationStateReader())
      let mediaGrid = settings.tweetMediaGrid ? createTweetMediaGrid($focused, path, {isCurrent}) : null
      mediaGrid?.update([$focused], new Set([$focused]))
      cleanup = () => {
        mediaGrid?.disconnect()
        cleanupFocused()
      }
    }
    let $time = $container.querySelector(selector)
    if ($time) apply($time)
    else {
      if ($container.querySelector(`li[data-index] ${FOCUSED_TWEET_SELECTOR}`)) return
      getElement(selector, {context: /** @type {HTMLElement} */ ($container), name: 'initial focused timestamp', observers: waits}).then(apply)
    }
  }
  update()
  return {update, disconnect}
}

function tweakIndividualTweetPage() {
  let tweetPath = currentPagePath
  let processItems = createIndividualTweetTimelineProcessor(tweetPath)
  let initialFocused = null
  observePageTimeline({
    timelineSelector: '[id^="urt:conversation:"]',
    onItemsChanged($items, id, changedItems) {
      // Row processing precedes onContentChanged, even when React reuses the focused card
      if ($items.some($item => $item.matches(FOCUSED_TWEET_SELECTOR))) initialFocused?.disconnect()
      return processItems($items, id, changedItems)
    },
    onContentChanged($content) {
      if (!initialFocused) {
        initialFocused = observeInitialFocusedTweet($content, {tweetPath, isCurrent: syncPageUrl})
      } else initialFocused.update()
    },
    onDisconnect() {
      initialFocused?.disconnect()
    },
  })
}

function tweakHomeTimelinePage() {
  let $content = null
  let timeline = null
  refreshHomeTimeline = () => {
    if ($content) tweakTimelineTabs($content)
    timeline?.refreshItems()
  }
  let $nativeSelectedTab = null
  let $newTab = null
  let $tabs = null
  let indicator = null
  let nativeTabIndex = null
  let switchingToFollowing = false
  let $waitingHeader = null
  let tabWait = 0

  function cancelTabWait() {
    tabWait++
    $waitingHeader = null
    pageObservers.get('getElement: Home Following tab')?.disconnect()
  }

  function waitForFollowing($header, $content) {
    if ($waitingHeader == $header) return
    cancelTabWait()
    $waitingHeader = $header
    let generation = tabWait
    getElement('[role="tablist"] [role="tab"][data-pinned-timeline="following"]', {
      context: $header, name: 'Home Following tab', observers: pageObservers,
      mutationObserverOptions: {childList: true, subtree: true, attributes: true, attributeFilter: ['role', 'data-pinned-timeline']},
    }).then($following => {
      if (generation != tabWait) return
      $waitingHeader = null
      if ($following?.isConnected && $content.isConnected && enabled && currentPageType == 'HomeTimeline' &&
          syncPageUrl() && $content.querySelector(':scope > header[data-page-header]') == $header) {
        tweakTimelineTabs($content)
      }
    })
  }

  log('Home tabs setup', {
    path: location.pathname, pagePath: currentPagePath, retweets: settings.retweets, quoteTweets: settings.quoteTweets,
    disableHomeTimeline: settings.disableHomeTimeline,
    mainFound: Boolean(document.querySelector('main')),
  })

  function restoreNativeSelection() {
    if (!$nativeSelectedTab) return
    if ($nativeSelectedTab.hasAttribute('data-active')) {
      $nativeSelectedTab.setAttribute('aria-selected', 'true')
      if (nativeTabIndex == null) $nativeSelectedTab.removeAttribute('tabindex')
      else $nativeSelectedTab.setAttribute('tabindex', nativeTabIndex)
    }
    $nativeSelectedTab = null
  }

  function removeTab() {
    indicator?.disconnect()
    indicator = null
    restoreNativeSelection()
    $newTab?.remove()
    $newTab = null
    $tabs?.classList.remove('cpft-separated-tweets-selected')
  }

  function clickFollowing($following) {
    if (!$following || $following.disabled || $following.getAttribute('aria-disabled') == 'true' || requestedFollowing == $following) return
    requestedFollowing = $following
    switchingToFollowing = true
    try {
      $following.click()
    } finally {
      switchingToFollowing = false
    }
  }

  function onTabPointerDown(event) {
    if (event.button != 0 || switchingToFollowing) return
    let $tab = event.target?.closest?.('[data-pinned-timeline="following"]')
    if (!$tab || !$tabs.contains($tab) || selectedHomeTab != 'following' ||
        !separatedTweetsTimelineSelected && !(settings.defaultFollowingToRecent && settings.hideFollowingMenu)) return
    // Returning from Retweets or refreshing via Home bypasses the native
    // menu/composite pointer handler, while preserving keyboard focus.
    event.preventDefault()
    event.stopPropagation()
  }

  function onTabClick(event) {
    let $tab = /** @type {Element} */ (event.target)?.closest?.('[role="tab"]')
    if (!$tab || !$tabs.contains($tab)) return
    if ($tab == $newTab) {
      event.preventDefault()
      event.stopPropagation()
      if (!separatedTweetsTimelineSelected) {
        restoreNativeSelection()
        selectHomeTimeline(true)
      }
      window.scrollTo({top: 0})
      return
    }
    if (switchingToFollowing) return
    restoreNativeSelection()
    let tab = $tab.getAttribute('data-pinned-timeline')
    if (tab == 'following' && selectedHomeTab == 'following' && settings.defaultFollowingToRecent && settings.hideFollowingMenu) {
      event.preventDefault()
      event.stopPropagation()
      let $home = /** @type {HTMLElement} */ (document.querySelector('a[href="/home"]'))
      $home?.click()
      window.scrollTo({top: 0})
      return
    }
    wasForYouTabSelected = tab == 'for-you'
    if (wasForYouTabSelected) requestedFollowing = null
    if (separatedTweetsTimelineSelected) {
      if (tab == 'following') {
        event.preventDefault()
        event.stopPropagation()
      }
      selectHomeTimeline(false)
      if (tab == 'following') window.scrollTo({top: 0})
    }
    if (indicator && $tab.getAttribute('aria-disabled') != 'true') updateHomeTimelineIndicator($tabs, $tab)
  }

  function onTabKeyDown(event) {
    let $target = event.target?.closest?.('[data-pinned-timeline="following"]')
    if ($target && settings.defaultFollowingToRecent && settings.hideFollowingMenu && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    if (!$newTab || event.altKey || event.ctrlKey || event.metaKey) return
    let $tab = event.target?.closest?.('[role="tab"]')
    if (!$tab || !$tabs.contains($tab) || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    let tabs = Array.from($tabs.querySelectorAll(':scope > [role="tab"]')).filter(($tab) =>
      $tab.getClientRects().length && $tab.getAttribute('aria-disabled') != 'true')
    let index = tabs.indexOf($tab)
    if (index < 0 || !tabs.length) return
    let direction = (event.key == 'ArrowRight' ? 1 : -1) * (ltr ? 1 : -1)
    let nextIndex = event.key == 'Home' ? 0 : event.key == 'End' ? tabs.length - 1 : (index + direction + tabs.length) % tabs.length
    event.preventDefault()
    event.stopPropagation()
    tabs[nextIndex].focus()
    if (tabs[nextIndex] != $tab) tabs[nextIndex].click()
  }

  timeline = observePageTimeline({
    containerSelector: ':scope > div:has(> header[data-page-header])',
    onContentChanged($nextContent) {
      $content = $nextContent
      tweakTimelineTabs($content)
    },
    onDisconnect() {
      refreshHomeTimeline = null
      $content = null
      cancelTabWait()
      $tabs?.removeEventListener('click', onTabClick, true)
      $tabs?.removeEventListener('keydown', onTabKeyDown, true)
      $tabs?.removeEventListener('pointerdown', onTabPointerDown, true)
      $tabs?.removeEventListener('mousedown', onTabPointerDown, true)
      removeTab()
      $tabs = null
      selectedHomeTab = ''
    },
  })

  function tweakTimelineTabs($content) {
    if (!enabled || currentPagePath != '/home' || getPageLocation().pathname != '/home') return
    let $header = $content.querySelector(':scope > header[data-page-header]')
    if ($waitingHeader && $waitingHeader != $header) cancelTabWait()
    if ($header && !$header.querySelector('[role="tablist"] [role="tab"][data-pinned-timeline="following"]')) {
      waitForFollowing($header, $content)
    } else if ($waitingHeader) cancelTabWait()
    let $nextTabs = $header?.querySelector('[role="tablist"]') || null
    if ($nextTabs != $tabs) {
      $tabs?.removeEventListener('click', onTabClick, true)
      $tabs?.removeEventListener('keydown', onTabKeyDown, true)
      $tabs?.removeEventListener('pointerdown', onTabPointerDown, true)
      $tabs?.removeEventListener('mousedown', onTabPointerDown, true)
      removeTab()
      $tabs = $nextTabs
      $tabs?.addEventListener('click', onTabClick, true)
      $tabs?.addEventListener('keydown', onTabKeyDown, true)
      $tabs?.addEventListener('pointerdown', onTabPointerDown, true)
      $tabs?.addEventListener('mousedown', onTabPointerDown, true)
    }
    if (!$tabs) return
    // Home content changes and the Following readiness wait drive tab setup
    restoreNativeSelection()
    let $selected = $tabs.querySelector('[role="tab"][aria-selected="true"]:not(#cpftSeparatedTweetsTab)')
    // Only For you and Following have native timeline identifiers
    let nextTab = $selected?.getAttribute('data-pinned-timeline') || ($selected ? 'pinned' : '')
    if (separatedTweetsTimelineSelected && selectedHomeTab == 'following' && nextTab && nextTab != 'following') {
      selectHomeTimeline(false)
      return
    }
    if (nextTab != selectedHomeTab) {
      if (nextTab == 'for-you' && selectedHomeTab) wasForYouTabSelected = true
      else if (nextTab && nextTab != 'for-you') wasForYouTabSelected = false
      selectedHomeTab = nextTab
      log('Home tab selected', {tab: selectedHomeTab || null})
    }
    if (selectedHomeTab == 'following') requestedFollowing = null

    let $following = /** @type {HTMLButtonElement} */ ($tabs.querySelector('[role="tab"][data-pinned-timeline="following"]'))
    if (hasSeparatedTweetsTimeline() && !settings.disableHomeTimeline && $following && !$newTab) {
      $newTab = document.createElement('button')
      $newTab.id = 'cpftSeparatedTweetsTab'
      $newTab.type = 'button'
      $newTab.className = $following.className
      $newTab.setAttribute('role', 'tab')
      let $label = document.createElement('span')
      $label.className = 'relative inline-flex h-5 items-center justify-center'
      $newTab.appendChild($label)
      $following.insertAdjacentElement('afterend', $newTab)
      log('Home tabs created', {title: getSeparatedTweetsTimelineTitle()})
    }
    if ($newTab) {
      $newTab.querySelector(':scope > span').textContent = getSeparatedTweetsTimelineTitle()
      $newTab.setAttribute('aria-selected', String(separatedTweetsTimelineSelected))
      $newTab.setAttribute('tabindex', separatedTweetsTimelineSelected ? '0' : '-1')
      $newTab.toggleAttribute('data-active', separatedTweetsTimelineSelected)
      $tabs.classList.toggle('cpft-separated-tweets-selected', separatedTweetsTimelineSelected)
      if (separatedTweetsTimelineSelected && $selected) {
        $nativeSelectedTab = $selected
        nativeTabIndex = $selected.getAttribute('tabindex')
        $selected.setAttribute('aria-selected', 'false')
        $selected.setAttribute('tabindex', '-1')
      }
    }
    if ($newTab) {
      indicator ||= observeHomeTimelineIndicator($tabs, () => separatedTweetsTimelineSelected
        ? $newTab
        : $tabs.querySelector('[role="tab"][data-active]:not(#cpftSeparatedTweetsTab)'))
      indicator?.update()
    }
    if (separatedTweetsTimelineSelected && selectedHomeTab != 'following') {
      clickFollowing($following)
    }
    else if (settings.defaultToFollowing && selectedHomeTab == 'for-you' && (!wasForYouTabSelected || settings.hideForYouTimeline)) {
      clickFollowing($following)
    }
  }
}
//#endregion

//#region Main
/** @param {string} url */
function patchReplySortUrl(url) {
  if (settings.sortReplies == 'relevant' || !url.includes('/TweetDetail?')) return url
  try {
    let request = new URL(url, location.origin)
    let variables = JSON.parse(request.searchParams.get('variables'))
    if (!variables || typeof variables.focalTweetId != 'string' ||
        userSortedReplies && variables.focalTweetId == replySortTweetId) return url
    let rankingMode = settings.sortReplies == 'liked' ? 'Likes' : 'Recency'
    if (variables.rankingMode == rankingMode) return url
    variables.rankingMode = rankingMode
    request.searchParams.set('variables', JSON.stringify(variables))
    log('sortReplies: forcing sort by', settings.sortReplies)
    return request.href
  } catch (error) {
    warn('sortReplies: error patching rankingMode', error)
    return url
  }
}

/**
 * @param {Response} response
 * @param {string} url
 * @param {HeadersInit} [requestHeaders]
 */
async function patchXwebResponse(response, url, requestHeaders) {
  if (!response.ok) return response
  let brand = settings.revertXBranding &&
    /^https:\/\/api\.x\.com\/graphql\/[^/?]+\/(?:HomeTimeline|HomeLatestTimelineQuery)(?:\?|$)/.test(url)
  let unblur = settings.unblurSensitiveContent &&
    /^https:\/\/api\.x\.com\/graphql\/[^/?]+\/[^/?]+(?:\?|$)/.test(url) &&
    /\bapplication\/json\b/i.test(response.headers.get('content-type') || '')
  if (!brand && !unblur) return response
  try {
    let language = (new Headers(requestHeaders).get('x-twitter-client-language') || lang || 'en').toLowerCase()
    if (language == 'en-ss' || language == 'en-xx') brand = false
    if (!brand && !unblur) return response

    let text = await response.clone().text()
    if (!enabled) return response

    unblur = unblur && settings.unblurSensitiveContent
    brand = brand && settings.revertXBranding
    if (!brand && !unblur) return response

    let changed = false
    // Unblur sensitive content
    let data = JSON.parse(text, (key, value) => {
      if (!unblur) return value
      // Show profiles flagged as sensitve
      if (value?.__typename == 'User' &&
          (value.profile_metadata?.profile_interstitial_type == 'sensitive_media' ||
           value.profile_metadata?.profile_interstitial_type == 'offensive_profile_content')) {
        value.profile_metadata.profile_interstitial_type = null
        changed = true
      }
      // Remove blur overlays
      if (value?.__typename == 'TweetWithVisibilityResults' &&
          value.media_visibility_results?.blurred_image_interstitial != null) {
        value.media_visibility_results.blurred_image_interstitial = null
        changed = true
      }
      // Show sensitive Tweets
      let tweet = value?.__typename == 'TweetWithVisibilityResults' ? value.tweet :
        value?.__typename == 'Tweet' ? value : null
      if (tweet?.legacy?.possibly_sensitive === true) {
        tweet.legacy.possibly_sensitive = false
        changed = true
      }
      if (Array.isArray(tweet?.media_entities2)) {
        for (let media of tweet.media_entities2) {
          if (media?.sensitive_media_warning != null) {
            media.sensitive_media_warning = null
            changed = true
          }
        }
      }
      return value
    })
    // Replace "Posted" with "Tweeted" in Home timeline
    if (brand) {
      let timeline = data?.data?.home_timeline || data?.data?.home
      let instructions = timeline?.home_timeline_urt?.instructions
      if (Array.isArray(instructions)) {
        for (let instruction of instructions) {
          if (instruction?.__typename != 'TimelineShowAlert' || instruction.alert_type != 'NewTweets') continue
          let tweeted = locales[language]?.TWEETED || locales.en.TWEETED
          if (typeof instruction.rich_text?.text != 'string' || !instruction.rich_text.text || instruction.rich_text.text == tweeted) continue
          instruction.rich_text.text = tweeted
          changed = true
        }
      }
    }
    if (!changed) return response

    let headers = new Headers(response.headers)
    headers.delete('content-length')
    headers.delete('content-encoding')
    let replacement = new Response(JSON.stringify(data), {status: response.status, statusText: response.statusText, headers})
    for (let key of ['url', 'redirected', 'type']) {
      Object.defineProperty(replacement, key, {value: response[key]})
    }
    return replacement
  } catch {
    return response
  }
}

function onDebugChanged() {
  configureCss()
  processCurrentPage()
  observeOverlays.refresh()
}

function onDisabled() {
  configureTitleSetter()
  configureVideoLooping()
  configureFastBlock()
  bypassMediaContextMenu()
  configureCleanTweetLinks()
  configureRedirects()
  observeTheme()
  separatedTweetsTimelineSelected = false
  restorePageTitle()
  observeFavicon()
  configureCss()
  configureBranding()
  configureBlueChecks()
  configureCustomCss()
  resetPage()
}

/** @param {Set<import("./types").UserSettingsKey>} changedSettings */
function onSettingsChanged(changedSettings = new Set()) {
  if (changedSettings.has('sortReplies')) {
    userSortedReplies = false
    requestedReplySort = ''
  }
  if (changedSettings.has('disableVideoLooping')) configureVideoLooping()
  if (changedSettings.has('hideNotifications')) configureTitleSetter()
  if (changedSettings.has('hideVerifiedTabs') || changedSettings.has('disableHomeTimeline') ||
      changedSettings.has('disabledHomeTimelineRedirect') || changedSettings.has('hideNotifications')) configureRedirects()
  if (changedSettings.has('fastBlock')) configureFastBlock()
  if (changedSettings.has('bypassMediaContextMenu')) bypassMediaContextMenu()
  if (changedSettings.has('cleanTweetLinks')) configureCleanTweetLinks()
  configureCss()
  configureCustomCss()
  if (changedSettings.has('darkModeTheme') || changedSettings.has('lightModeTheme') ||
      changedSettings.has('revertXBranding') || changedSettings.has('fontSize')) observeTheme()
  if (changedSettings.has('revertXBranding')) configureBranding()
  if (changedSettings.has('premiumBlueChecks')) configureBlueChecks()
  if (changedSettings.has('defaultToFollowing') && settings.defaultToFollowing) wasForYouTabSelected = false
  if (!hasSeparatedTweetsTimeline() || settings.disableHomeTimeline) separatedTweetsTimelineSelected = false
  onTitleChange(document.title, {force: true})
  if (changedSettings.has('revertXBranding') || changedSettings.has('hideNotifications')) observeFavicon()
  observeOverlays.refresh()
}

function main() {
  log('site version', 'xweb')
  storeConfigChanges({lastSiteVersion: 'xweb'})
  if (!enabled) return
  if (isXwebEntryPage()) {
    configureXwebEntryPage(main)
    return
  }
  lang = $html?.dataset?.appLanguage || $html?.lang || 'en'
  dir = $html?.dir || 'ltr'
  ltr = dir == 'ltr'
  resetPage()

  configureTitleSetter()
  configureVideoLooping()
  configureRedirects()
  configureFastBlock()
  bypassMediaContextMenu()
  configureCleanTweetLinks()

  // Sets mobile/desktop and generates feature CSS
  observeLayout()
  observeTheme()
  configureBranding()
  configureBlueChecks()
  // Custom CSS needs to follow feature CSS in the cascade
  configureCustomCss()
  observeFavicon()

  // Process the initial title before portals use the current page type
  observePageChanges()
  observeOverlays()

  document.querySelector('style#cpftLoading')?.remove()
}
//#endregion

return function init() {
  patchRequests({
    patchUrl(method, url) {
      if (method == 'GET') {
        url = patchReplySortUrl(url)
        if (settings.defaultFollowingToRecent && (settings.hideFollowingMenu || !userSortedFollowing)) url = patchFollowingUrl(url)
      }
      return url
    },
    shouldPatchBody(method, url) {
      return method == 'POST' && settings.defaultFollowingToRecent && (settings.hideFollowingMenu || !userSortedFollowing) && isFollowingTimelineRequest(url)
    },
    patchBody: patchFollowingBody,
    patchResponse: patchXwebResponse,
  })
  setupConfig({main, onSettingsChanged, onDisabled, onDebugChanged})
}

}()
//#endregion

//#region Main
// XXX Remove when xweb has fully rolled out
/** @param {() => void} onEntered */
function configureXwebEntryPage(onEntered) {
  let frame = null
  let button = null
  let opening = false
  let attempted = false
  let stopped = false
  let statusTimer = null
  let observer = new MutationObserver(schedule)
  function stop() {
    if (stopped) return
    stopped = true
    observer.disconnect()
    globalObservers.delete('xweb entry')
    window.removeEventListener('click', onClick, true)
    clearTimeout(statusTimer)
    if (frame != null) cancelAnimationFrame(frame)
    frame = null
    button?.remove()
  }
  function schedule() {
    if (frame == null) frame = requestAnimationFrame(update)
  }
  function update() {
    if (stopped) return
    frame = null
    if (!isXwebEntryPage()) {
      stop()
      onEntered()
      return
    }
    if (!document.body || !findRouter()) return
    if (button?.isConnected) return
    button = document.createElement('button')
    button.id = 'cpft-open-xweb-home'
    button.type = 'button'
    button.textContent = 'Open xweb Home'
    button.className = 'x-button bg-btn-primary text-inverted px-4 h-10 font-medium'
    button.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:2147483647;border-radius:9999px;cursor:pointer;box-shadow:0 2px 12px #0004'
    document.body.appendChild(button)
    if (!attempted) {
      attempted = true
      void openHome()
    }
  }
  /** @param {MouseEvent} event */
  function onClick(event) {
    if (!button || !event.composedPath().includes(button)) return
    event.preventDefault()
    event.stopImmediatePropagation()
    void openHome()
  }
  async function openHome() {
    if (opening || stopped) return
    opening = true
    button.disabled = true
    button.textContent = 'Opening xweb Home…'
    try {
      let router = findRouter()
      if (!router) throw new Error('X’s router is not ready')
      statusTimer = setTimeout(() => {
        if (isXwebEntryPage()) button.textContent = 'Still waiting for X’s Home route…'
      }, 8000)
      await router.navigate({to: '/home', replace: true})
      clearTimeout(statusTimer)
      if (isXwebEntryPage()) throw new Error('X stayed on the authorize page')
      update()
    } catch (error) {
      if (stopped) return
      clearTimeout(statusTimer)
      console.error('[cpft xweb entry]', error)
      opening = false
      button.disabled = false
      button.textContent = `Could not open Home: ${error.message}`
    }
  }
  window.addEventListener('click', onClick, true)
  observer.observe(document, {childList: true, subtree: true})
  globalObservers.set('xweb entry', {name: 'xweb entry', disconnect: stop})
  schedule()
}

function isXwebEntryPage() {
  return location.origin == 'https://x.com' &&
    /^\/i\/oauth2\/authorize\/?$/.test(location.pathname) && !location.search && !location.hash
}

function main() {
  // XXX Redirect /i/xweb to force xweb for rweb accounts
  if (location.origin == 'https://x.com' && /^\/i\/xweb\/?$/.test(location.pathname)) {
    location.replace('/i/oauth2/authorize')
    return
  }

  // Don't run on non-app URLs served from x.com
  if (location.pathname.startsWith('/account/access') ||
      location.pathname.startsWith('/i/oauth2/authorize') && !isXwebEntryPage() ||
      location.pathname.startsWith('/oauth/authorize') ||
      /^\/([^/]+\/)?(tos|privacy)(\/previous(\/version_\d+)?)?/.test(location.pathname)) {
    return
  }

  observeElement(document, (_, observer) => {
    let hasRwebEntry = false
    let hasXwebEntry = false
    for (let $script of document.querySelectorAll('script[src]')) {
      try {
        let url = new URL($script.getAttribute('src'), document.baseURI)
        if (url.hostname != 'abs.twimg.com') continue
        if (/^\/x-web\/x-web\/entry-client[^/]*\.js$/.test(url.pathname)) hasXwebEntry = true
        if (/^\/responsive-web\/client-web(?:-legacy)?\/main\.[^/]+\.js$/.test(url.pathname)) hasRwebEntry = true
      } catch { }
    }
    let init = hasXwebEntry ? xweb : hasRwebEntry && !isXwebEntryPage() ? rweb : null
    if (!init) return
    observer.disconnect()
    init()
  }, {
    leading: true,
    name: 'site version detection',
    observers: globalObservers,
  }, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src'],
  })
}

main()
//#endregion

}()
