// ==UserScript==
// @name        Control Panel for Twitter
// @description Gives you more control over Twitter and adds missing features and UI improvements
// @icon        https://raw.githubusercontent.com/insin/control-panel-for-twitter/master/icons/icon32.png
// @namespace   https://github.com/insin/control-panel-for-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @match       https://x.com/*
// @match       https://mobile.x.com/*
// @run-at      document-start
// @version     200
// ==/UserScript==
void function() {

// Patch XMLHttpRequest to modify requests
const XMLHttpRequest_open = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function(method, url) {
  if (config.sortReplies != 'relevant' && !userSortedReplies && url.includes('/TweetDetail?')) {
    let request = new URL(url)
    let params = new URLSearchParams(request.search)
    let variables = JSON.parse(decodeURIComponent(params.get('variables')))
    variables.rankingMode = {
      liked: 'Likes',
      recent: 'Recency',
    }[config.sortReplies]
    params.set('variables', JSON.stringify(variables))
    url = `${request.origin}${request.pathname}?${params.toString()}`
  }
  return XMLHttpRequest_open.apply(this, [method, url])
}

let debug = false

/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile
let isSafari = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)

/** @type {HTMLHtmlElement} */
let $html
/** @type {HTMLElement} */
let $body
/** @type {HTMLElement} */
let $reactRoot
/** @type {string} */
let lang
/** @type {string} */
let dir
/** @type {boolean} */
let ltr

//#region Default config
/**
 * @type {import("./types").Config}
 */
const config = {
  enabled: true,
  debug: false,
  debugLogTimelineStats: false,
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  bypassAgeVerification: true,
  defaultToLatestSearch: false,
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  disableTweetTextFormatting: false,
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  hideAdsNav: true,
  hideBookmarkButton: false,
  hideBookmarkMetrics: true,
  hideBookmarksNav: false,
  hideChatNav: false,
  hideCommunitiesNav: false,
  hideComposeTweet: false,
  hideExplorePageContents: true,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideGrokNav: true,
  hideGrokTweets: false,
  hideInlinePrompts: true,
  hideJobsNav: true,
  hideLikeMetrics: true,
  hideListsNav: false,
  hideMetrics: false,
  hideMonetizationNav: true,
  hideMoreTweets: true,
  hideNotificationLikes: false,
  hideNotifications: 'ignore',
  hideProfileRetweets: false,
  hideQuoteTweetMetrics: true,
  hideQuotesFrom: [],
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideSeeNewTweets: false,
  hideShareTweetButton: false,
  hideSubscriptions: true,
  hideTotalTweetsMetrics: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterBlueReplies: false,
  hideTwitterBlueUpsells: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedNotificationsTab: true,
  hideViews: true,
  hideWhoToFollowEtc: true,
  listRetweets: 'ignore',
  mutableQuoteTweets: true,
  mutedQuotes: [],
  quoteTweets: 'ignore',
  redirectToTwitter: false,
  reducedInteractionMode: false,
  replaceLogo: true,
  restoreLinkHeadlines: true,
  restoreOtherInteractionLinks: false,
  restoreQuoteTweetsLink: true,
  restoreTweetSource: true,
  retweets: 'separate',
  showBlueReplyFollowersCount: false,
  showBlueReplyFollowersCountAmount: '1000000',
  showBookmarkButtonUnderFocusedTweets: true,
  showPremiumReplyBusiness: true,
  showPremiumReplyFollowedBy: true,
  showPremiumReplyFollowing: true,
  showPremiumReplyGovernment: true,
  sortReplies: 'relevant',
  tweakNewLayout: false,
  tweakQuoteTweetsPage: true,
  twitterBlueChecks: 'replace',
  unblurSensitiveContent: false,
  uninvertFollowButtons: true,
  // Experiments
  customCss: '',
  // Desktop only
  fullWidthContent: false,
  fullWidthMedia: true,
  hideAccountSwitcher: false,
  hideExploreNav: true,
  hideExploreNavWithSidebar: true,
  hideLiveBroadcasts: false,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  hideSpacesNav: false,
  hideSuggestedFollows: false,
  hideTimelineTweetBox: false,
  hideToggleNavigation: false,
  hideWhatsHappening: false,
  navBaseFontSize: true,
  navDensity: 'default',
  showRelevantPeople: false,
  // Mobile only
  hideLiveBroadcastBar: false,
  hideMessagesBottomNavItem: false,
  preventNextVideoAutoplay: true,
}
//#endregion

//#region Locales
/**
 * @type {Record<string, import("./types").Locale>}
 */
const locales = {
  'ar-x-fm': {
    ADD_ANOTHER_TWEET: 'ضافة تغريدة أخرى',
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    GROK_ACTIONS: 'إجراءات Grok',
    HOME: 'الرئيسيّة',
    LIKES: 'الإعجابات',
    LIVE_ON_X: 'بث مباشر على X',
    MOST_RELEVANT: 'الأكثر ملائمة',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    POST_ALL: 'نشر الكل',
    POST_UNAVAILABLE: 'هذا المنشور غير متاح.',
    PROFILE_SUMMARY: 'ملخص الملف الشخصيّ',
    QUOTES: 'اقتباسات',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    REPOST: 'إعادة النشر',
    REPOSTS: 'المنشورات المُعاد نشرها',
    RETWEET: 'إعادة التغريد',
    RETWEETED_BY: 'مُعاد تغريدها بواسطة',
    RETWEETS: 'إعادات التغريد',
    SHARED: 'مشترك',
    SHARED_TWEETS: 'التغريدات المشتركة',
    SHOW: 'إظهار',
    SHOW_MORE_REPLIES: 'عرض المزيد من الردود',
    SORT_REPLIES_BY: 'فرز الردود حسب',
    TURN_OFF_QUOTE_TWEETS: 'تعطيل تغريدات اقتباس',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWEET: 'غرّدي',
    TWEETS: 'التغريدات',
    TWEET_ALL: 'تغريد الكل',
    TWEET_INTERACTIONS: 'تفاعلات التغريدة',
    TWEET_YOUR_REPLY: 'التغريد بردك',
    TWITTER: 'تويتر',
    UNDO_RETWEET: 'التراجع عن التغريدة',
    VIEW: 'عرض',
    WHATS_HAPPENING: 'ماذا يحدث؟',
  },
  ar: {
    ADD_ANOTHER_TWEET: 'ضافة تغريدة أخرى',
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    GROK_ACTIONS: 'إجراءات Grok',
    HOME: 'الرئيسيّة',
    LIKES: 'الإعجابات',
    LIVE_ON_X: 'بث مباشر على X',
    MOST_RELEVANT: 'الأكثر ملائمة',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    POST_ALL: 'نشر الكل',
    POST_UNAVAILABLE: 'هذا المنشور غير متاح.',
    PROFILE_SUMMARY: 'ملخص الملف الشخصيّ',
    QUOTE: 'اقتباس',
    QUOTES: 'اقتباسات',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    REPOST: 'إعادة النشر',
    REPOSTS: 'المنشورات المُعاد نشرها',
    RETWEET: 'إعادة التغريد',
    RETWEETED_BY: 'مُعاد تغريدها بواسطة',
    RETWEETS: 'إعادات التغريد',
    SHARED: 'مشترك',
    SHARED_TWEETS: 'التغريدات المشتركة',
    SHOW: 'إظهار',
    SHOW_MORE_REPLIES: 'عرض المزيد من الردود',
    SORT_REPLIES_BY: 'فرز الردود حسب',
    TURN_OFF_QUOTE_TWEETS: 'تعطيل تغريدات اقتباس',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWEET: 'تغريد',
    TWEETS: 'التغريدات',
    TWEET_ALL: 'تغريد الكل',
    TWEET_INTERACTIONS: 'تفاعلات التغريدة',
    TWEET_YOUR_REPLY: 'التغريد بردك',
    UNDO_RETWEET: 'التراجع عن التغريدة',
    VIEW: 'عرض',
    WHATS_HAPPENING: 'ماذا يحدث؟',
  },
  bg: {
    ADD_ANOTHER_TWEET: 'Добавяне на друг туит',
    ADD_MUTED_WORD: 'Добавяне на заглушена дума',
    GROK_ACTIONS: 'Действия, свързани с Grok',
    HOME: 'Начало',
    LIKES: 'Харесвания',
    LIVE_ON_X: 'На живо в X',
    MOST_RELEVANT: 'Най-подходящи',
    MUTE_THIS_CONVERSATION: 'Заглушаване на разговора',
    POST_ALL: 'Публикуване на всичко',
    POST_UNAVAILABLE: 'Тази публикация не е налична.',
    PROFILE_SUMMARY: 'Резюме на профила',
    QUOTE: 'Цитат',
    QUOTES: 'Цитати',
    QUOTE_TWEET: 'Цитиране на туита',
    QUOTE_TWEETS: 'Туитове с цитат',
    REPOST: 'Препубликуване',
    REPOSTS: 'Препубликувания',
    RETWEET: 'Ретуитване',
    RETWEETED_BY: 'Ретуитнат от',
    RETWEETS: 'Ретуитове',
    SHARED: 'Споделен',
    SHARED_TWEETS: 'Споделени туитове',
    SHOW: 'Показване',
    SHOW_MORE_REPLIES: 'Показване на още отговори',
    SORT_REPLIES_BY: 'Сортиране на отговорите',
    TURN_OFF_QUOTE_TWEETS: 'Изключване на туитове с цитат',
    TURN_OFF_RETWEETS: 'Изключване на ретуитовете',
    TURN_ON_RETWEETS: 'Включване на ретуитовете',
    TWEET: 'Туит',
    TWEETS: 'Туитове',
    TWEET_ALL: 'Туитване на всички',
    TWEET_INTERACTIONS: 'Интеракции с туит',
    TWEET_YOUR_REPLY: 'туит своя отговор',
    UNDO_RETWEET: 'Отмяна на ретуитването',
    VIEW: 'Преглед',
    WHATS_HAPPENING: 'Какво се случва?',
  },
  bn: {
    ADD_ANOTHER_TWEET: 'অন্য টুইট যোগ করুন',
    ADD_MUTED_WORD: 'নীরব করা শব্দ যোগ করুন',
    GROK_ACTIONS: 'Grok কার্যকলাপ',
    HOME: 'হোম',
    LIKES: 'পছন্দ',
    LIVE_ON_X: 'X-এ লাইভ',
    MOST_RELEVANT: 'সবচেয়ে প্রাসঙ্গিক',
    MUTE_THIS_CONVERSATION: 'এই কথা-বার্তা নীরব করুন',
    POST_ALL: 'সবকটি পোস্ট করুন',
    POST_UNAVAILABLE: 'এই পোস্টটি অনুপলভ্য।',
    PROFILE_SUMMARY: 'প্রোফাইল সারসংক্ষেপ',
    QUOTE: 'উদ্ধৃতি',
    QUOTES: 'উদ্ধৃতিগুলো',
    QUOTE_TWEET: 'টুইট উদ্ধৃত করুন',
    QUOTE_TWEETS: 'টুইট উদ্ধৃতিগুলো',
    REPOST: 'রিপোস্ট',
    REPOSTS: 'রিপোস্ট',
    RETWEET: 'পুনঃটুইট',
    RETWEETED_BY: 'পুনঃ টুইট করেছেন',
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED: 'ভাগ করা',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
    SHOW: 'দেখান',
    SHOW_MORE_REPLIES: 'আরও উত্তর দেখান',
    SORT_REPLIES_BY: 'উত্তরগুলো এই হিসাবে বাছুন',
    TURN_OFF_QUOTE_TWEETS: 'উদ্ধৃতি টুইটগুলি বন্ধ করুন',
    TURN_OFF_RETWEETS: 'পুনঃ টুইটগুলি বন্ধ করুন',
    TURN_ON_RETWEETS: 'পুনঃ টুইটগুলি চালু করুন',
    TWEET: 'টুইট',
    TWEETS: 'টুইটগুলি',
    TWEET_ALL: 'সব টুইট করুন',
    TWEET_INTERACTIONS: 'টুইট ইন্টারেকশন',
    TWEET_YOUR_REPLY: 'আপনার উত্তর টুইট করুন',
    TWITTER: 'টুইটার',
    UNDO_RETWEET: 'পুনঃ টুইট পুর্বাবস্থায় ফেরান',
    VIEW: 'দেখুন',
    WHATS_HAPPENING: 'কি খবর?',
  },
  ca: {
    ADD_ANOTHER_TWEET: 'Afegeix un altre tuit',
    ADD_MUTED_WORD: 'Afegeix una paraula silenciada',
    GROK_ACTIONS: 'Accions de Grok',
    HOME: 'Inici',
    LIKES: 'Agradaments',
    LIVE_ON_X: 'En directe a X',
    MOST_RELEVANT: 'El més rellevant',
    MUTE_THIS_CONVERSATION: 'Silencia la conversa',
    POST_ALL: 'Publica-ho tot',
    POST_UNAVAILABLE: 'Aquesta publicació no està disponible.',
    PROFILE_SUMMARY: 'Resum del perfil',
    QUOTE: 'Cita',
    QUOTES: 'Cites',
    QUOTE_TWEET: 'Cita el tuit',
    QUOTE_TWEETS: 'Tuits amb cita',
    REPOST: 'Republicació',
    REPOSTS: 'Republicacions',
    RETWEET: 'Retuit',
    RETWEETED_BY: 'Retuitat per',
    RETWEETS: 'Retuits',
    SHARED: 'Compartit',
    SHARED_TWEETS: 'Tuits compartits',
    SHOW: 'Mostra',
    SHOW_MORE_REPLIES: 'Mostra més respostes',
    SORT_REPLIES_BY: 'Ordena les respostes per',
    TURN_OFF_QUOTE_TWEETS: 'Desactiva els tuits amb cita',
    TURN_OFF_RETWEETS: 'Desactiva els retuits',
    TURN_ON_RETWEETS: 'Activa els retuits',
    TWEET: 'Tuita',
    TWEETS: 'Tuits',
    TWEET_ALL: 'Tuita-ho tot',
    TWEET_INTERACTIONS: 'Interaccions amb tuits',
    TWEET_YOUR_REPLY: 'Tuita la teva resposta',
    UNDO_RETWEET: 'Desfés el retuit',
    VIEW: 'Mostra',
    WHATS_HAPPENING: 'Què passa?',
  },
  cs: {
    ADD_ANOTHER_TWEET: 'Přidat další Tweet',
    ADD_MUTED_WORD: 'Přidat slovo na seznam skrytých slov',
    GROK_ACTIONS: 'Akce funkce Grok',
    HOME: 'Hlavní stránka',
    LIKES: 'Lajky',
    LIVE_ON_X: 'Živě na platformě X',
    MOST_RELEVANT: 'Nejvíce související',
    MUTE_THIS_CONVERSATION: 'Skrýt tuto konverzaci',
    POST_ALL: 'Postovat vše',
    POST_UNAVAILABLE: 'Tento post není dostupný.',
    PROFILE_SUMMARY: 'Souhrn profilu',
    QUOTE: 'Citace',
    QUOTES: 'Citace',
    QUOTE_TWEET: 'Citovat Tweet',
    QUOTE_TWEETS: 'Tweety s citací',
    REPOSTS: 'Reposty',
    RETWEET: 'Retweetnout',
    RETWEETED_BY: 'Retweetnuto uživateli',
    RETWEETS: 'Retweety',
    SHARED: 'Sdílený',
    SHARED_TWEETS: 'Sdílené tweety',
    SHOW: 'Zobrazit',
    SHOW_MORE_REPLIES: 'Zobrazit další odpovědi',
    SORT_REPLIES_BY: 'Odpovědi roztřiďte podle',
    TURN_OFF_QUOTE_TWEETS: 'Vypnout tweety s citací',
    TURN_OFF_RETWEETS: 'Vypnout retweety',
    TURN_ON_RETWEETS: 'Zapnout retweety',
    TWEET: 'Tweetovat',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnout vše',
    TWEET_INTERACTIONS: 'Tweetovat interakce',
    TWEET_YOUR_REPLY: 'Tweetujte svou odpověď',
    UNDO_RETWEET: 'Zrušit Retweet',
    VIEW: 'Zobrazit',
    WHATS_HAPPENING: 'Co se děje?',
  },
  da: {
    ADD_ANOTHER_TWEET: 'Tilføj endnu et Tweet',
    ADD_MUTED_WORD: 'Tilføj skjult ord',
    GROK_ACTIONS: 'Grok-handlinger',
    HOME: 'Forside',
    LIVE_ON_X: 'Direkte på X',
    MOST_RELEVANT: 'Mest relevante',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtale',
    POST_ALL: 'Post alle',
    POST_UNAVAILABLE: 'Denne post er ikke tilgængelig.',
    PROFILE_SUMMARY: 'Profilresumé',
    QUOTE: 'Citat',
    QUOTES: 'Citater',
    QUOTE_TWEET: 'Citér Tweet',
    QUOTE_TWEETS: 'Citat-Tweets',
    RETWEETED_BY: 'Retweetet af',
    SHARED: 'Delt',
    SHARED_TWEETS: 'Delte tweets',
    SHOW: 'Vis',
    SHOW_MORE_REPLIES: 'Vis flere svar',
    SORT_REPLIES_BY: 'Sortér svar efter',
    TURN_OFF_QUOTE_TWEETS: 'Slå Citat-Tweets fra',
    TURN_OFF_RETWEETS: 'Slå Retweets fra',
    TURN_ON_RETWEETS: 'Slå Retweets til',
    TWEET_ALL: 'Tweet alt',
    TWEET_INTERACTIONS: 'Tweet-interaktioner',
    TWEET_YOUR_REPLY: 'Tweet dit svar',
    UNDO_RETWEET: 'Fortryd Retweet',
    VIEW: 'Vis',
    WHATS_HAPPENING: 'Hvad sker der?',
  },
  de: {
    ADD_ANOTHER_TWEET: 'Weiteren Tweet hinzufügen',
    ADD_MUTED_WORD: 'Stummgeschaltetes Wort hinzufügen',
    GROK_ACTIONS: 'Grok-Aktionen',
    HOME: 'Startseite',
    LIKES: 'Gefällt mir',
    LIVE_ON_X: 'Live auf X',
    MOST_RELEVANT: 'Besonders relevant',
    MUTE_THIS_CONVERSATION: 'Diese Konversation stummschalten',
    POST_ALL: 'Alle posten',
    POST_UNAVAILABLE: 'Dieser Post ist nicht verfügbar.',
    PROFILE_SUMMARY: 'Kurzprofil',
    QUOTE: 'Zitat',
    QUOTES: 'Zitate',
    QUOTE_TWEET: 'Tweet zitieren',
    QUOTE_TWEETS: 'Zitierte Tweets',
    REPOST: 'Reposten',
    RETWEET: 'Retweeten',
    RETWEETED_BY: 'Retweetet von',
    SHARED: 'Geteilt',
    SHARED_TWEETS: 'Geteilte Tweets',
    SHOW: 'Anzeigen',
    SHOW_MORE_REPLIES: 'Mehr Antworten anzeigen',
    SORT_REPLIES_BY: 'Antworten sortieren nach',
    TURN_OFF_QUOTE_TWEETS: 'Zitierte Tweets ausschalten',
    TURN_OFF_RETWEETS: 'Retweets ausschalten',
    TURN_ON_RETWEETS: 'Retweets einschalten',
    TWEET: 'Twittern',
    TWEET_ALL: 'Alle twittern',
    TWEET_INTERACTIONS: 'Tweet-Interaktionen',
    TWEET_YOUR_REPLY: 'Twittere deine Antwort',
    UNDO_RETWEET: 'Retweet rückgängig machen',
    VIEW: 'Anzeigen',
    WHATS_HAPPENING: 'Was gibt’s Neues?',
  },
  el: {
    ADD_ANOTHER_TWEET: 'Προσθήκη άλλου Tweet',
    ADD_MUTED_WORD: 'Προσθήκη λέξης σε σίγαση',
    GROK_ACTIONS: 'Δράσεις Grok',
    HOME: 'Αρχική σελίδα',
    LIKES: '"Μου αρέσει"',
    LIVE_ON_X: 'Ζωντανά στο X',
    MOST_RELEVANT: 'Πιο σχετική',
    MUTE_THIS_CONVERSATION: 'Σίγαση αυτής της συζήτησης',
    POST_ALL: 'Δημοσίευση όλων',
    POST_UNAVAILABLE: 'Αυτή η ανάρτηση δεν είναι διαθέσιμη.',
    PROFILE_SUMMARY: ' Περίληψη προφίλ',
    QUOTE: 'Παράθεση',
    QUOTES: 'Παραθέσεις',
    QUOTE_TWEET: 'Παράθεση Tweet',
    QUOTE_TWEETS: 'Tweet με παράθεση',
    REPOST: 'Αναδημοσίευση',
    REPOSTS: 'Αναδημοσιεύσεις',
    RETWEETED_BY: 'Έγινε Retweet από',
    RETWEETS: 'Retweet',
    SHARED: 'Κοινόχρηστο',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
    SHOW: 'Εμφάνιση',
    SHOW_MORE_REPLIES: 'Εμφάνιση περισσότερων απαντήσεων',
    SORT_REPLIES_BY: 'Ταξινόμηση απαντήσεων κατά',
    TURN_OFF_QUOTE_TWEETS: 'Απενεργοποίηση των tweet με παράθεση',
    TURN_OFF_RETWEETS: 'Απενεργοποίηση των Retweet',
    TURN_ON_RETWEETS: 'Ενεργοποίηση των Retweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Δημοσίευση όλων ως Tweet',
    TWEET_INTERACTIONS: 'Αλληλεπιδράσεις με tweet',
    TWEET_YOUR_REPLY: 'Στείλτε την απάντησή σας',
    UNDO_RETWEET: 'Αναίρεση Retweet',
    VIEW: 'Προβολή',
    WHATS_HAPPENING: 'Τι συμβαίνει;',
  },
  en: {
    ADD_ANOTHER_TWEET: 'Add another Tweet',
    ADD_MUTED_WORD: 'Add muted word',
    GROK_ACTIONS: 'Grok actions',
    HOME: 'Home',
    LIKES: 'Likes',
    LIVE_ON_X: 'Live on X',
    MOST_RELEVANT: 'Most relevant',
    MUTE_THIS_CONVERSATION: 'Mute this conversation',
    POST_ALL: 'Post all',
    POST_UNAVAILABLE: 'This post is unavailable.',
    PROFILE_SUMMARY: 'Profile Summary',
    QUOTE: 'Quote',
    QUOTES: 'Quotes',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    REPOST: 'Repost',
    REPOSTS: 'Reposts',
    RETWEET: 'Retweet',
    RETWEETED_BY: 'Retweeted by',
    RETWEETS: 'Retweets',
    SHARED: 'Shared',
    SHARED_TWEETS: 'Shared Tweets',
    SHOW: 'Show',
    SHOW_MORE_REPLIES: 'Show more replies',
    SORT_REPLIES_BY: 'Sort replies by',
    TURN_OFF_QUOTE_TWEETS: 'Turn off Quote Tweets',
    TURN_OFF_RETWEETS: 'Turn off Retweets',
    TURN_ON_RETWEETS: 'Turn on Retweets',
    TWEET: 'Tweet',
    TWEETS: 'Tweets',
    TWEET_ALL: 'Tweet all',
    TWEET_INTERACTIONS: 'Tweet interactions',
    TWEET_YOUR_REPLY: 'Tweet your reply',
    TWITTER: 'Twitter',
    UNDO_RETWEET: 'Undo Retweet',
    VIEW: 'View',
    WHATS_HAPPENING: "What's happening?",
  },
  es: {
    ADD_ANOTHER_TWEET: 'Agregar otro Tweet',
    ADD_MUTED_WORD: 'Añadir palabra silenciada',
    GROK_ACTIONS: 'Acciones de Grok',
    HOME: 'Inicio',
    LIKES: 'Me gusta',
    LIVE_ON_X: 'En directo en X',
    MOST_RELEVANT: 'Más relevantes',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversación',
    POST_ALL: 'Postear todo',
    POST_UNAVAILABLE: 'Este post no está disponible.',
    PROFILE_SUMMARY: 'Resumen del perfil',
    QUOTE: 'Cita',
    QUOTES: 'Citas',
    QUOTE_TWEET: 'Citar Tweet',
    QUOTE_TWEETS: 'Tweets citados',
    REPOST: 'Repostear',
    RETWEET: 'Retwittear',
    RETWEETED_BY: 'Retwitteado por',
    SHARED: 'Compartido',
    SHARED_TWEETS: 'Tweets compartidos',
    SHOW: 'Mostrar',
    SHOW_MORE_REPLIES: 'Mostrar más respuestas',
    SORT_REPLIES_BY: 'Ordenar respuestas por',
    TURN_OFF_QUOTE_TWEETS: 'Desactivar tweets citados',
    TURN_OFF_RETWEETS: 'Desactivar Retweets',
    TURN_ON_RETWEETS: 'Activar Retweets',
    TWEET: 'Twittear',
    TWEET_ALL: 'Twittear todo',
    TWEET_INTERACTIONS: 'Interacciones con Tweet',
    TWEET_YOUR_REPLY: 'Twittea tu respuesta',
    UNDO_RETWEET: 'Deshacer Retweet',
    VIEW: 'Ver',
    WHATS_HAPPENING: '¿Qué está pasando?',
  },
  eu: {
    ADD_ANOTHER_TWEET: 'Gehitu beste txio bat',
    ADD_MUTED_WORD: 'Gehitu isilarazitako hitza',
    HOME: 'Hasiera',
    LIKES: 'Atsegiteak',
    MUTE_THIS_CONVERSATION: 'Isilarazi elkarrizketa hau',
    QUOTE: 'Aipamena',
    QUOTES: 'Aipamenak',
    QUOTE_TWEET: 'Txioa apaitu',
    QUOTE_TWEETS: 'Aipatu txioak',
    RETWEET: 'Bertxiotu',
    RETWEETED_BY: 'Bertxiotua:',
    RETWEETS: 'Bertxioak',
    SHARED: 'Partekatua',
    SHARED_TWEETS: 'Partekatutako',
    SHOW: 'Erakutsi',
    SHOW_MORE_REPLIES: 'Erakutsi erantzun gehiago',
    TURN_OFF_QUOTE_TWEETS: 'Desaktibatu aipatu txioak',
    TURN_OFF_RETWEETS: 'Desaktibatu birtxioak',
    TURN_ON_RETWEETS: 'Aktibatu birtxioak',
    TWEET: 'Txio',
    TWEETS: 'Txioak',
    TWEET_ALL: 'Txiotu guztiak',
    TWEET_INTERACTIONS: 'Txio elkarrekintzak',
    TWEET_YOUR_REPLY: 'Txiotu zure erantzuna',
    UNDO_RETWEET: 'Desegin birtxiokatzea',
    VIEW: 'Ikusi',
    WHATS_HAPPENING: 'Zer gertatzen ari da?',
  },
  fa: {
    ADD_ANOTHER_TWEET: 'افزودن توییت دیگر',
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    GROK_ACTIONS: 'کنش‌های Grok',
    HOME: 'خانه',
    LIKES: 'پسندها',
    LIVE_ON_X: 'زنده در X',
    MOST_RELEVANT: 'مرتبط‌ترین',
    MUTE_THIS_CONVERSATION: 'خموش‌سازی این گفتگو',
    POST_ALL: 'پست کردن همه',
    POST_UNAVAILABLE: 'این پست دردسترس نیست.',
    PROFILE_SUMMARY: 'خلاصه نمایه',
    QUOTE: 'نقل‌قول',
    QUOTES: 'نقل‌قول‌ها',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت‌ها',
    REPOST: 'بازپست',
    REPOSTS: 'بازپست',
    RETWEET: 'بازتوییت',
    RETWEETED_BY: 'بازتوییت‌ شد توسط',
    RETWEETS: 'بازتوییت‌ها',
    SHARED: 'مشترک',
    SHARED_TWEETS: 'توییتهای مشترک',
    SHOW: 'نمایش',
    SHOW_MORE_REPLIES: 'نمایش پاسخ‌های بیشتر',
    SORT_REPLIES_BY: 'مرتب‌سازی پاسخ‌ها براساس',
    TURN_OFF_QUOTE_TWEETS: 'غیرفعال‌سازی نقل‌توییت‌ها',
    TURN_OFF_RETWEETS: 'غیرفعال‌سازی بازتوییت‌ها',
    TURN_ON_RETWEETS: 'فعال سازی بازتوییت‌ها',
    TWEET: 'توییت',
    TWEETS: 'توييت‌ها',
    TWEET_ALL: 'توییت به همه',
    TWEET_INTERACTIONS: 'تعاملات توییت',
    TWEET_YOUR_REPLY: 'پاسختان را توییت کنید',
    TWITTER: 'توییتر',
    UNDO_RETWEET: 'لغو بازتوییت',
    VIEW: 'مشاهده',
    WHATS_HAPPENING: 'چه خبر؟',
  },
  fi: {
    ADD_ANOTHER_TWEET: 'Lisää vielä twiitti',
    ADD_MUTED_WORD: 'Lisää hiljennetty sana',
    GROK_ACTIONS: 'Grok-toiminnat',
    HOME: 'Etusivu',
    LIKES: 'Tykkäykset',
    LIVE_ON_X: 'Livenä X:ssä',
    MOST_RELEVANT: 'Relevanteimmat',
    MUTE_THIS_CONVERSATION: 'Hiljennä tämä keskustelu',
    POST_ALL: 'Julkaise kaikki',
    POST_UNAVAILABLE: 'Tämä julkaisu ei ole saatavilla.',
    PROFILE_SUMMARY: 'Profiilin yhteenveto',
    QUOTE: 'Lainaa',
    QUOTES: 'Lainaukset',
    QUOTE_TWEET: 'Twiitin lainaus',
    QUOTE_TWEETS: 'Twiitin lainaukset',
    REPOST: 'Uudelleenjulkaise',
    REPOSTS: 'Uudelleenjulkaisut',
    RETWEET: 'Uudelleentwiittaa',
    RETWEETED_BY: 'Uudelleentwiitannut',
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED: 'Jaettu',
    SHARED_TWEETS: 'Jaetut twiitit',
    SHOW: 'Näytä',
    SHOW_MORE_REPLIES: 'Näytä lisää vastauksia',
    SORT_REPLIES_BY: 'Vastausten lajittelutapa',
    TURN_OFF_QUOTE_TWEETS: 'Poista twiitin lainaukset käytöstä',
    TURN_OFF_RETWEETS: 'Poista uudelleentwiittaukset käytöstä',
    TURN_ON_RETWEETS: 'Ota uudelleentwiittaukset käyttöön',
    TWEET: 'Twiittaa',
    TWEETS: 'Twiitit',
    TWEET_ALL: 'Twiittaa kaikki',
    TWEET_INTERACTIONS: 'Twiitin vuorovaikutukset',
    TWEET_YOUR_REPLY: 'Twiittaa vastauksesi',
    UNDO_RETWEET: 'Kumoa uudelleentwiittaus',
    VIEW: 'Näytä',
    WHATS_HAPPENING: 'Missä mennään?',
  },
  fil: {
    ADD_ANOTHER_TWEET: 'Magdagdag ng isa pang Tweet',
    ADD_MUTED_WORD: 'Idagdag ang naka-mute na salita',
    GROK_ACTIONS: 'Mga aksyon ni Grok',
    LIKES: 'Mga Gusto',
    LIVE_ON_X: 'Live sa X',
    MOST_RELEVANT: 'Pinakanauugnay',
    MUTE_THIS_CONVERSATION: 'I-mute ang usapang ito',
    POST_ALL: 'I-post lahat',
    POST_UNAVAILABLE: 'Hindi available ang post na Ito.',
    PROFILE_SUMMARY: 'Buod ng Profile',
    QUOTES: 'Mga Quote',
    QUOTE_TWEET: 'Quote na Tweet',
    QUOTE_TWEETS: 'Mga Quote na Tweet',
    REPOST: 'I-repost',
    REPOSTS: '(na) Repost',
    RETWEET: 'I-retweet',
    RETWEETED_BY: 'Ni-retweet ni',
    RETWEETS: 'Mga Retweet',
    SHARED: 'Ibinahagi',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
    SHOW: 'Ipakita',
    SHOW_MORE_REPLIES: 'Magpakita pa ng mga sagot',
    SORT_REPLIES_BY: 'I-sort ang mga reply batay sa',
    TURN_OFF_QUOTE_TWEETS: 'I-off ang mga Quote na Tweet',
    TURN_OFF_RETWEETS: 'I-off ang Retweets',
    TURN_ON_RETWEETS: 'I-on ang Retweets',
    TWEET: 'Mag-tweet',
    TWEETS: 'Mga Tweet',
    TWEET_ALL: 'I-tweet lahat',
    TWEET_INTERACTIONS: 'Interaksyon sa Tweet',
    TWEET_YOUR_REPLY: 'I-Tweet ang reply mo',
    UNDO_RETWEET: 'Huwag nang I-retweet',
    VIEW: 'Tingnan',
    WHATS_HAPPENING: 'Ano ang nangyayari?',
  },
  fr: {
    ADD_ANOTHER_TWEET: 'Ajouter un autre Tweet',
    ADD_MUTED_WORD: 'Ajouter un mot masqué',
    GROK_ACTIONS: 'Actions Grok',
    HOME: 'Accueil',
    LIKES: "J'aime",
    LIVE_ON_X: 'En direct sur X',
    MOST_RELEVANT: 'Les plus pertinentes',
    MUTE_THIS_CONVERSATION: 'Masquer cette conversation',
    POST_ALL: 'Tout poster',
    POST_UNAVAILABLE: "Ce post n'est pas disponible.",
    PROFILE_SUMMARY: 'Résumé du profil',
    QUOTE: 'Citation',
    QUOTES: 'Citations',
    QUOTE_TWEET: 'Citer le Tweet',
    QUOTE_TWEETS: 'Tweets cités',
    RETWEET: 'Retweeter',
    RETWEETED_BY: 'Retweeté par',
    SHARED: 'Partagé',
    SHARED_TWEETS: 'Tweets partagés',
    SHOW: 'Afficher',
    SHOW_MORE_REPLIES: 'Voir plus de réponses',
    SORT_REPLIES_BY: 'Trier les réponses par',
    TURN_OFF_QUOTE_TWEETS: 'Désactiver les Tweets cités',
    TURN_OFF_RETWEETS: 'Désactiver les Retweets',
    TURN_ON_RETWEETS: 'Activer les Retweets',
    TWEET: 'Tweeter',
    TWEET_ALL: 'Tout tweeter',
    TWEET_INTERACTIONS: 'Interactions avec Tweet',
    TWEET_YOUR_REPLY: 'Tweetez votre réponse',
    UNDO_RETWEET: 'Annuler le Retweet',
    VIEW: 'Voir',
    WHATS_HAPPENING: 'Quoi de neuf !',
  },
  ga: {
    ADD_ANOTHER_TWEET: 'Cuir Tweet eile leis',
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    HOME: 'Baile',
    LIKES: 'Thaitin siad seo le',
    MUTE_THIS_CONVERSATION: 'Balbhaigh an comhrá seo',
    QUOTE: 'Sliocht',
    QUOTES: 'Sleachta',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Luaigh Tvuíteanna',
    RETWEET: 'Atweetáil',
    RETWEETED_BY: 'Atweetáilte ag',
    RETWEETS: 'Atweetanna',
    SHARED: 'Roinnte',
    SHARED_TWEETS: 'Tweetanna Roinnte',
    SHOW: 'Taispeáin',
    SHOW_MORE_REPLIES: 'Taispeáin tuilleadh freagraí',
    TURN_OFF_QUOTE_TWEETS: 'Cas as Luaigh Tvuíteanna',
    TURN_OFF_RETWEETS: 'Cas as Atweetanna',
    TURN_ON_RETWEETS: 'Cas Atweetanna air',
    TWEETS: 'Tweetanna',
    TWEET_ALL: 'Tweetáil gach rud',
    TWEET_INTERACTIONS: 'Idirghníomhaíochtaí le Tweet',
    TWEET_YOUR_REPLY: 'Tweetáil do fhreagra',
    UNDO_RETWEET: 'Cuir an Atweet ar ceal',
    VIEW: 'Breathnaigh',
    WHATS_HAPPENING: 'Cad atá ag tarlú?',
  },
  gl: {
    ADD_ANOTHER_TWEET: 'Engadir outro chío',
    ADD_MUTED_WORD: 'Engadir palabra silenciada',
    HOME: 'Inicio',
    LIKES: 'Gústames',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    QUOTE: 'Cita',
    QUOTES: 'Citas',
    QUOTE_TWEET: 'Citar chío',
    QUOTE_TWEETS: 'Chíos citados',
    RETWEET: 'Rechouchiar',
    RETWEETED_BY: 'Rechouchiado por',
    RETWEETS: 'Rechouchíos',
    SHARED: 'Compartido',
    SHARED_TWEETS: 'Chíos compartidos',
    SHOW: 'Amosar',
    SHOW_MORE_REPLIES: 'Amosar máis respostas',
    TURN_OFF_QUOTE_TWEETS: 'Desactivar os chíos citados',
    TURN_OFF_RETWEETS: 'Desactivar os rechouchíos',
    TURN_ON_RETWEETS: 'Activar os rechouchíos',
    TWEET: 'Chío',
    TWEETS: 'Chíos',
    TWEET_ALL: 'Chiar todo',
    TWEET_INTERACTIONS: 'Interaccións chío',
    TWEET_YOUR_REPLY: 'Chío a túa responder',
    UNDO_RETWEET: 'Desfacer rechouchío',
    VIEW: 'Ver',
    WHATS_HAPPENING: 'Que está pasando?',
  },
  gu: {
    ADD_ANOTHER_TWEET: 'અન્ય ટ્વીટ ઉમેરો',
    ADD_MUTED_WORD: 'જોડાણ અટકાવેલો શબ્દ ઉમેરો',
    GROK_ACTIONS: 'Grok પગલાં',
    HOME: 'હોમ',
    LIKES: 'લાઈક્સ',
    LIVE_ON_X: 'X પર લાઇવ',
    MOST_RELEVANT: 'સૌથી વધુ સુસંગત',
    MUTE_THIS_CONVERSATION: 'આ વાર્તાલાપનું જોડાણ અટકાવો',
    POST_ALL: 'બધા પોસ્ટ કરો',
    POST_UNAVAILABLE: 'આ પોસ્ટ અનુપલબ્ધ છે.',
    PROFILE_SUMMARY: 'પ્રોફાઇલ સારાંશ',
    QUOTE: 'અવતરણ',
    QUOTES: 'અવતરણો',
    QUOTE_TWEET: 'અવતરણની સાથે ટ્વીટ કરો',
    QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ',
    REPOST: 'રીપોસ્ટ કરો',
    REPOSTS: 'ફરીથી કરવામાં આવેલી પોસ્ટ',
    RETWEET: 'પુનટ્વીટ',
    RETWEETED_BY: 'આમની દ્વારા પુનટ્વીટ કરવામાં આવી',
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED: 'સાંજેડેલું',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
    SHOW: 'બતાવો',
    SHOW_MORE_REPLIES: 'વધુ પ્રત્યુતરો દર્શાવો',
    SORT_REPLIES_BY: 'દ્વારા પ્રત્યુત્તરોને સૉર્ટ કરો',
    TURN_OFF_QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ બંધ કરો',
    TURN_OFF_RETWEETS: 'પુનટ્વીટ્સ બંધ કરો',
    TURN_ON_RETWEETS: 'પુનટ્વીટ્સ ચાલુ કરો',
    TWEET: 'ટ્વીટ',
    TWEETS: 'ટ્વીટ્સ',
    TWEET_ALL: 'બધાને ટ્વીટ કરો',
    TWEET_INTERACTIONS: 'ટ્વીટ ક્રિયાપ્રતિક્રિયાઓ',
    TWEET_YOUR_REPLY: 'તમારા પ્રત્યુત્તરને ટ્વીટ કરો',
    UNDO_RETWEET: 'પુનટ્વીટને પૂર્વવત કરો',
    VIEW: 'જુઓ',
    WHATS_HAPPENING: 'શું થઈ રહ્યું છે?',
  },
  he: {
    ADD_ANOTHER_TWEET: 'הוסף ציוץ נוסף',
    ADD_MUTED_WORD: 'הוסף מילה מושתקת',
    GROK_ACTIONS: 'פעולות של Grok',
    HOME: 'דף הבית',
    LIKES: 'הערות "אהבתי"',
    LIVE_ON_X: 'שידור חי ב-X',
    MOST_RELEVANT: 'הכי רלוונטי',
    MUTE_THIS_CONVERSATION: 'להשתיק את השיחה הזאת',
    POST_ALL: 'פרסום הכל',
    POST_UNAVAILABLE: 'פוסט זה אינו זמין.',
    PROFILE_SUMMARY: 'סיכום הפרופיל',
    QUOTE: 'ציטוט',
    QUOTES: 'ציטוטים',
    QUOTE_TWEET: 'ציטוט ציוץ',
    QUOTE_TWEETS: 'ציוצי ציטוט',
    REPOST: 'לפרסם מחדש',
    REPOSTS: 'פרסומים מחדש',
    RETWEET: 'צייץ מחדש',
    RETWEETED_BY: 'צויץ מחדש על־ידי',
    RETWEETS: 'ציוצים מחדש',
    SHARED: 'משותף',
    SHARED_TWEETS: 'ציוצים משותפים',
    SHOW: 'הצג',
    SHOW_MORE_REPLIES: 'הצג תשובות נוספות',
    SORT_REPLIES_BY: 'מיון תשובות לפי',
    TURN_OFF_QUOTE_TWEETS: 'כבה ציוצי ציטוט',
    TURN_OFF_RETWEETS: 'כבה ציוצים מחדש',
    TURN_ON_RETWEETS: 'הפעל ציוצים מחדש',
    TWEET: 'צייץ',
    TWEETS: 'ציוצים',
    TWEET_ALL: 'צייץ הכול',
    TWEET_INTERACTIONS: 'אינטראקציות צייץ',
    TWEET_YOUR_REPLY: 'צייץ התשובה',
    TWITTER: 'טוויטר',
    UNDO_RETWEET: 'ביטול ציוץ מחדש',
    VIEW: 'הצג',
    WHATS_HAPPENING: 'מה קורה?',
  },
  hi: {
    ADD_ANOTHER_TWEET: 'एक और ट्वीट जोड़ें',
    ADD_MUTED_WORD: 'म्यूट किया गया शब्द जोड़ें',
    GROK_ACTIONS: 'Grok कार्रवाई',
    HOME: 'होम',
    LIKES: 'पसंद',
    LIVE_ON_X: 'X पर लाइव',
    MOST_RELEVANT: 'सर्वाधिक प्रासंगिक',
    MUTE_THIS_CONVERSATION: 'इस बातचीत को म्यूट करें',
    POST_ALL: 'सभी पोस्ट करें',
    POST_UNAVAILABLE: 'यह पोस्ट उपलब्ध नहीं है.',
    PROFILE_SUMMARY: 'प्रोफ़ाइल सारांश',
    QUOTE: 'कोट',
    QUOTES: 'कोट',
    QUOTE_TWEET: 'ट्वीट क्वोट करें',
    QUOTE_TWEETS: 'कोट ट्वीट्स',
    REPOST: 'रीपोस्ट',
    REPOSTS: 'रीपोस्ट्स',
    RETWEET: 'रीट्वीट करें',
    RETWEETED_BY: 'इनके द्वारा रीट्वीट किया गया',
    RETWEETS: 'रीट्वीट्स',
    SHARED: 'साझा किया हुआ',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
    SHOW: 'दिखाएं',
    SHOW_MORE_REPLIES: 'और अधिक जवाब दिखाएँ',
    SORT_REPLIES_BY: 'से जवाब सॉर्ट करें',
    TURN_OFF_QUOTE_TWEETS: 'कोट ट्वीट्स बंद करें',
    TURN_OFF_RETWEETS: 'रीट्वीट बंद करें',
    TURN_ON_RETWEETS: 'रीट्वीट चालू करें',
    TWEET: 'ट्वीट करें',
    TWEETS: 'ट्वीट',
    TWEET_ALL: 'सभी ट्वीट करें',
    TWEET_INTERACTIONS: 'ट्वीट इंटरैक्शन',
    TWEET_YOUR_REPLY: 'अपना जवाब ट्वीट करें',
    UNDO_RETWEET: 'रीट्वीट को पूर्ववत करें',
    VIEW: 'देखें',
    WHATS_HAPPENING: 'क्या हो रहा है?',
  },
  hr: {
    ADD_ANOTHER_TWEET: 'Dodaj drugi Tweet',
    ADD_MUTED_WORD: 'Dodaj onemogućenu riječ',
    GROK_ACTIONS: 'Grokove radnje',
    HOME: 'Naslovnica',
    LIKES: 'Oznake „sviđa mi se”',
    LIVE_ON_X: 'Uživo na platformi X',
    MOST_RELEVANT: 'Najrelevantnije',
    MUTE_THIS_CONVERSATION: 'Isključi zvuk ovog razgovora',
    POST_ALL: 'Objavi sve',
    POST_UNAVAILABLE: 'Ta objava nije dostupna.',
    PROFILE_SUMMARY: 'Sažetak profila',
    QUOTE: 'Citat',
    QUOTES: 'Citati',
    QUOTE_TWEET: 'Citiraj Tweet',
    QUOTE_TWEETS: 'Citirani tweetovi',
    REPOST: 'Proslijedi objavu',
    REPOSTS: 'Proslijeđene objave',
    RETWEET: 'Proslijedi tweet',
    RETWEETED_BY: 'Korisnici koji su proslijedili Tweet',
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED: 'Podijeljeno',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
    SHOW: 'Prikaži',
    SHOW_MORE_REPLIES: 'Prikaži još odgovora',
    SORT_REPLIES_BY: 'Sortiraj odgovore',
    TURN_OFF_QUOTE_TWEETS: 'Isključi citirane tweetove',
    TURN_OFF_RETWEETS: 'Isključi proslijeđene tweetove',
    TURN_ON_RETWEETS: 'Uključi proslijeđene tweetove',
    TWEETS: 'Tweetovi',
    TWEET_ALL: 'Tweetaj sve',
    TWEET_INTERACTIONS: 'Interakcije s Tweet',
    TWEET_YOUR_REPLY: 'Tweetajte odgovor',
    UNDO_RETWEET: 'Poništi prosljeđivanje tweeta',
    VIEW: 'Prikaz',
    WHATS_HAPPENING: 'Što se događa?',
  },
  hu: {
    ADD_ANOTHER_TWEET: 'Másik Tweet hozzáadása',
    ADD_MUTED_WORD: 'Elnémított szó hozzáadása',
    GROK_ACTIONS: 'Grok-műveletek',
    HOME: 'Kezdőlap',
    LIKES: 'Kedvelések',
    LIVE_ON_X: 'Élőben az X-en',
    MOST_RELEVANT: 'Legmegfelelőbb',
    MUTE_THIS_CONVERSATION: 'Beszélgetés némítása',
    POST_ALL: 'Az összes közzététele',
    POST_UNAVAILABLE: 'Ez a bejegyzés nem elérhető.',
    PROFILE_SUMMARY: 'Profil összegzése',
    QUOTE: 'Idézés',
    QUOTES: 'Idézések',
    QUOTE_TWEET: 'Tweet idézése',
    QUOTE_TWEETS: 'Tweet-idézések',
    REPOST: 'Újraposztolás',
    REPOSTS: 'Újraposztolások',
    RETWEETED_BY: 'Retweetelte',
    RETWEETS: 'Retweetek',
    SHARED: 'Megosztott',
    SHARED_TWEETS: 'Megosztott tweetek',
    SHOW: 'Megjelenítés',
    SHOW_MORE_REPLIES: 'Több válasz megjelenítése',
    SORT_REPLIES_BY: 'Válaszok rendezése a következő szerint',
    TURN_OFF_QUOTE_TWEETS: 'Tweet-idézések kikapcsolása',
    TURN_OFF_RETWEETS: 'Retweetek kikapcsolása',
    TURN_ON_RETWEETS: 'Retweetek bekapcsolása',
    TWEET: 'Tweetelj',
    TWEETS: 'Tweetek',
    TWEET_ALL: 'Tweet küldése mindenkinek',
    TWEET_INTERACTIONS: 'Tweet interakciók',
    TWEET_YOUR_REPLY: 'Tweeteld válaszodat',
    UNDO_RETWEET: 'Retweet visszavonása',
    VIEW: 'Megtekintés',
    WHATS_HAPPENING: 'Mi történik éppen most?',
  },
  id: {
    ADD_ANOTHER_TWEET: 'Tambahkan Tweet lain',
    ADD_MUTED_WORD: 'Tambahkan kata kunci yang dibisukan',
    GROK_ACTIONS: 'Tindakan Grok',
    HOME: 'Beranda',
    LIKES: 'Suka',
    LIVE_ON_X: 'Langsung di X',
    MOST_RELEVANT: 'Paling relevan',
    MUTE_THIS_CONVERSATION: 'Bisukan percakapan ini',
    POST_ALL: 'Posting semua',
    POST_UNAVAILABLE: 'Postingan ini tidak tersedia.',
    PROFILE_SUMMARY: 'Ringkasan Profil',
    QUOTE: 'Kutipan',
    QUOTES: 'Kutipan',
    QUOTE_TWEET: 'Kutip Tweet',
    QUOTE_TWEETS: 'Tweet Kutipan',
    REPOST: 'Posting ulang',
    REPOSTS: 'Posting ulang',
    RETWEETED_BY: 'Di-retweet oleh',
    RETWEETS: 'Retweet',
    SHARED: 'Dibagikan',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
    SHOW: 'Tampilkan',
    SHOW_MORE_REPLIES: 'Tampilkan balasan lainnya',
    SORT_REPLIES_BY: 'Urutkan balasan berdasarkan',
    TURN_OFF_QUOTE_TWEETS: 'Matikan Tweet Kutipan',
    TURN_OFF_RETWEETS: 'Matikan Retweet',
    TURN_ON_RETWEETS: 'Nyalakan Retweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Tweet semua',
    TWEET_INTERACTIONS: 'Interaksi Tweet',
    TWEET_YOUR_REPLY: 'Tweet balasan Anda',
    UNDO_RETWEET: 'Batalkan Retweet',
    VIEW: 'Lihat',
    WHATS_HAPPENING: 'Apa yang sedang hangat dibicarakan?',
  },
  it: {
    ADD_ANOTHER_TWEET: 'Aggiungi altro Tweet',
    ADD_MUTED_WORD: 'Aggiungi parola o frase silenziata',
    GROK_ACTIONS: 'Azioni di Grok',
    LIKES: 'Mi piace',
    LIVE_ON_X: 'In diretta su X',
    MOST_RELEVANT: 'Più pertinenti',
    MUTE_THIS_CONVERSATION: 'Silenzia questa conversazione',
    POST_ALL: 'Posta tutto',
    POST_UNAVAILABLE: 'Questo post non è disponibile.',
    PROFILE_SUMMARY: 'Riepilogo del profilo',
    QUOTE: 'Citazione',
    QUOTES: 'Citazioni',
    QUOTE_TWEET: 'Cita Tweet',
    QUOTE_TWEETS: 'Tweet di citazione',
    REPOSTS: 'Repost',
    RETWEET: 'Ritwitta',
    RETWEETED_BY: 'Ritwittato da',
    RETWEETS: 'Retweet',
    SHARED: 'Condiviso',
    SHARED_TWEETS: 'Tweet condivisi',
    SHOW: 'Mostra',
    SHOW_MORE_REPLIES: 'Mostra altre risposte',
    SORT_REPLIES_BY: 'Ordina risposte per',
    TURN_OFF_QUOTE_TWEETS: 'Disattiva i Tweet di citazione',
    TURN_OFF_RETWEETS: 'Disattiva Retweet',
    TURN_ON_RETWEETS: 'Attiva Retweet',
    TWEET: 'Twitta',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Twitta tutto',
    TWEET_INTERACTIONS: 'Interazioni con Tweet',
    TWEET_YOUR_REPLY: 'Twitta la tua risposta',
    UNDO_RETWEET: 'Annulla Retweet',
    VIEW: 'Visualizza',
    WHATS_HAPPENING: "Che c'è di nuovo?",
  },
  ja: {
    ADD_ANOTHER_TWEET: '別のツイートを追加する',
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    GROK_ACTIONS: 'Grokのアクション',
    HOME: 'ホーム',
    LIKES: 'いいね',
    LIVE_ON_X: 'Xでライブ放送する',
    MOST_RELEVANT: '関連性が高い',
    MUTE_THIS_CONVERSATION: 'この会話をミュート',
    POST_ALL: 'すべてポスト',
    POST_UNAVAILABLE: 'このポストは表示できません。',
    PROFILE_SUMMARY: 'プロフィールの要約',
    QUOTE: '引用',
    QUOTES: '引用',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    REPOST: 'リポスト',
    REPOSTS: 'リポスト',
    RETWEET: 'リツイート',
    RETWEETED_BY: 'リツイートしたユーザー',
    RETWEETS: 'リツイート',
    SHARED: '共有',
    SHARED_TWEETS: '共有ツイート',
    SHOW: '表示',
    SHOW_MORE_REPLIES: '返信をさらに表示',
    SORT_REPLIES_BY: '返信の並べ替え基準',
    TURN_OFF_QUOTE_TWEETS: '引用ツイートをオフにする',
    TURN_OFF_RETWEETS: 'リツイートをオフにする',
    TURN_ON_RETWEETS: 'リツイートをオンにする',
    TWEET: 'ツイートする',
    TWEETS: 'ツイート',
    TWEET_ALL: 'すべてツイート',
    TWEET_INTERACTIONS: 'ツイートの相互作用',
    TWEET_YOUR_REPLY: '返信をツイート',
    UNDO_RETWEET: 'リツイートを取り消す',
    VIEW: '表示する',
    WHATS_HAPPENING: 'いまどうしてる？',
  },
  kn: {
    ADD_ANOTHER_TWEET: 'ಮತ್ತೊಂದು ಟ್ವೀಟ್ ಸೇರಿಸಿ',
    ADD_MUTED_WORD: 'ಸದ್ದಡಗಿಸಿದ ಪದವನ್ನು ಸೇರಿಸಿ',
    GROK_ACTIONS: 'Grok ಕ್ರಮಗಳು',
    HOME: 'ಹೋಮ್',
    LIKES: 'ಇಷ್ಟಗಳು',
    LIVE_ON_X: 'X ನಲ್ಲಿ ಲೈವ್',
    MOST_RELEVANT: 'ಅತ್ಯಂತ ಸಂಬಂಧಿತ',
    MUTE_THIS_CONVERSATION: 'ಈ ಸಂವಾದವನ್ನು ಸದ್ದಡಗಿಸಿ',
    POST_ALL: 'ಎಲ್ಲವನ್ನೂ ಪೋಸ್ಟ್ ಮಾಡಿ',
    POST_UNAVAILABLE: 'ಈ ಪೋಸ್ಟ್ ಲಭ್ಯವಿಲ್ಲ.',
    PROFILE_SUMMARY: 'ಪ್ರೊಫೈಲ್ ಸಾರಾಂಶ',
    QUOTE: 'ಕೋಟ್‌',
    QUOTES: 'ಉಲ್ಲೇಖಗಳು',
    QUOTE_TWEET: 'ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ',
    QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು',
    REPOST: 'ಮರುಪೋಸ್ಟ್ ಮಾಡಿ',
    REPOSTS: 'ಮರುಪೋಸ್ಟ್‌ಗಳು',
    RETWEET: 'ಮರುಟ್ವೀಟಿಸಿ',
    RETWEETED_BY: 'ಮರುಟ್ವೀಟಿಸಿದವರು',
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED: 'ಹಂಚಲಾಗಿದೆ',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
    SHOW: 'ತೋರಿಸಿ',
    SHOW_MORE_REPLIES: 'ಇನ್ನಷ್ಟು ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ತೋರಿಸಿ',
    SORT_REPLIES_BY: 'ಇದರ ಮೂಲಕ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ಆಯೋಜಿಸಿ',
    TURN_OFF_QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ',
    TURN_OFF_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ',
    TURN_ON_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆನ್ ಮಾಡಿ',
    TWEET: 'ಟ್ವೀಟ್',
    TWEETS: 'ಟ್ವೀಟ್‌ಗಳು',
    TWEET_ALL: 'ಎಲ್ಲಾ ಟ್ವೀಟ್ ಮಾಡಿ',
    TWEET_INTERACTIONS: 'ಟ್ವೀಟ್ ಸಂವಾದಗಳು',
    TWEET_YOUR_REPLY: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಟ್ವೀಟ್ ಮಾಡಿ',
    UNDO_RETWEET: 'ಮರುಟ್ವೀಟಿಸುವುದನ್ನು ರದ್ದುಮಾಡಿ',
    VIEW: 'ವೀಕ್ಷಿಸಿ',
    WHATS_HAPPENING: 'ಏನು ನಡೆಯುತ್ತಿದೆ?',
  },
  ko: {
    ADD_ANOTHER_TWEET: '다른 트윗 추가하기',
    ADD_MUTED_WORD: '뮤트할 단어 추가하기',
    GROK_ACTIONS: 'Grok 작업',
    HOME: '홈',
    LIKES: '마음에 들어요',
    LIVE_ON_X: 'X 생방송',
    MOST_RELEVANT: '관련도 순서',
    MUTE_THIS_CONVERSATION: '이 대화 뮤트하기',
    POST_ALL: '모두 게시하기',
    POST_UNAVAILABLE: '이 게시물을 볼 수 없습니다.',
    PROFILE_SUMMARY: '프로필 요약',
    QUOTE: '인용',
    QUOTES: '인용',
    QUOTE_TWEET: '트윗 인용하기',
    QUOTE_TWEETS: '트윗 인용하기',
    REPOST: '재게시',
    REPOSTS: '재게시',
    RETWEET: '리트윗',
    RETWEETED_BY: '리트윗함',
    RETWEETS: '리트윗',
    SHARED: '공유된',
    SHARED_TWEETS: '공유 트윗',
    SHOW: '표시',
    SHOW_MORE_REPLIES: '더 많은 답글 보기',
    SORT_REPLIES_BY: '답글 정렬하기',
    TURN_OFF_QUOTE_TWEETS: '인용 트윗 끄기',
    TURN_OFF_RETWEETS: '리트윗 끄기',
    TURN_ON_RETWEETS: '리트윗 켜기',
    TWEET: '트윗',
    TWEETS: '트윗',
    TWEET_ALL: '모두 트윗하기',
    TWEET_INTERACTIONS: '트윗 상호작용',
    TWEET_YOUR_REPLY: '답글을 트윗하세요',
    TWITTER: '트위터',
    UNDO_RETWEET: '리트윗 취소',
    VIEW: '보기',
    WHATS_HAPPENING: '무슨 일이 일어나고 있나요?',
  },
  mr: {
    ADD_ANOTHER_TWEET: 'दुसरे ट्विट सामील करा',
    ADD_MUTED_WORD: 'म्यूट केलेले शब्द सामील करा',
    GROK_ACTIONS: 'Grok कृती',
    HOME: 'होम',
    LIKES: 'पसंती',
    LIVE_ON_X: 'X वर लाइव्ह',
    MOST_RELEVANT: 'सर्वात महत्वाचे',
    MUTE_THIS_CONVERSATION: 'ही चर्चा म्यूट करा',
    POST_ALL: 'सर्व पोस्ट करा',
    POST_UNAVAILABLE: 'हे पोस्ट अनुपलब्ध आहे.',
    PROFILE_SUMMARY: 'प्रोफाइल सारांश',
    QUOTE: 'भाष्य',
    QUOTES: 'भाष्य',
    QUOTE_TWEET: 'ट्विट वर भाष्य करा',
    QUOTE_TWEETS: 'भाष्य ट्विट्स',
    REPOST: 'पुन्हा पोस्ट करा',
    REPOSTS: 'रिपोस्ट',
    RETWEET: 'पुन्हा ट्विट',
    RETWEETED_BY: 'यांनी पुन्हा ट्विट केले',
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED: 'सामायिक',
    SHARED_TWEETS: 'सामायिक ट्विट',
    SHOW: 'दाखवा',
    SHOW_MORE_REPLIES: 'अधिक प्रत्युत्तरे दाखवा',
    SORT_REPLIES_BY: 'द्वारे प्रत्युत्तरांची क्रमवारी करा',
    TURN_OFF_QUOTE_TWEETS: 'भाष्य ट्विट्स बंद करा',
    TURN_OFF_RETWEETS: 'पुनर्ट्विट्स बंद करा',
    TURN_ON_RETWEETS: 'पुनर्ट्विट्स चालू करा',
    TWEET: 'ट्विट',
    TWEETS: 'ट्विट्स',
    TWEET_ALL: 'सर्व ट्विट करा',
    TWEET_INTERACTIONS: 'ट्वीट इंटरऍक्शन्स',
    TWEET_YOUR_REPLY: 'आपले प्रत्युत्तर ट्विट करा',
    UNDO_RETWEET: 'पुनर्ट्विट पूर्ववत करा',
    VIEW: 'पहा',
    WHATS_HAPPENING: 'ताज्या घडामोडी?',
  },
  ms: {
    ADD_ANOTHER_TWEET: 'Tambahkan Tweet lain',
    ADD_MUTED_WORD: 'Tambahkan perkataan yang disenyapkan',
    GROK_ACTIONS: 'Tindakan Grok',
    HOME: 'Laman Utama',
    LIKES: 'Suka',
    LIVE_ON_X: 'Secara Langsung di X',
    MOST_RELEVANT: 'Paling berkaitan',
    MUTE_THIS_CONVERSATION: 'Senyapkan perbualan ini',
    POST_ALL: 'Siarkan semua',
    POST_UNAVAILABLE: 'Siaran ini tidak tersedia.',
    PROFILE_SUMMARY: 'Ringkasan Profil',
    QUOTE: 'Petikan',
    QUOTES: 'Petikan',
    QUOTE_TWEET: 'Petik Tweet',
    QUOTE_TWEETS: 'Tweet Petikan',
    REPOST: 'Siaran semula',
    REPOSTS: 'Siaran semula',
    RETWEET: 'Tweet semula',
    RETWEETED_BY: 'Ditweet semula oleh',
    RETWEETS: 'Tweet semula',
    SHARED: 'Dikongsi',
    SHARED_TWEETS: 'Tweet Berkongsi',
    SHOW: 'Tunjukkan',
    SHOW_MORE_REPLIES: 'Tunjukkan lagi balasan',
    SORT_REPLIES_BY: 'Isih balasan mengikut',
    TURN_OFF_QUOTE_TWEETS: 'Matikan Tweet Petikan',
    TURN_OFF_RETWEETS: 'Matikan Tweet semula',
    TURN_ON_RETWEETS: 'Hidupkan Tweet semula',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Tweet semua',
    TWEET_INTERACTIONS: 'Interaksi Tweet',
    TWEET_YOUR_REPLY: 'Tweet balasan anda',
    UNDO_RETWEET: 'Buat asal Tweet semula',
    VIEW: 'Lihat',
    WHATS_HAPPENING: 'Apakah yang sedang berlaku?',
  },
  nb: {
    ADD_ANOTHER_TWEET: 'Legg til en annen Tweet',
    ADD_MUTED_WORD: 'Skjul nytt ord',
    GROK_ACTIONS: 'Grok-handlinger',
    HOME: 'Hjem',
    LIKES: 'Liker',
    LIVE_ON_X: 'Direkte på X',
    MOST_RELEVANT: 'Mest relevante',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtalen',
    POST_ALL: 'Publiser alle',
    POST_UNAVAILABLE: 'Dette innlegget er utilgjengelig.',
    PROFILE_SUMMARY: 'Profilsammendrag',
    QUOTE: 'Sitat',
    QUOTES: 'Sitater',
    QUOTE_TWEET: 'Sitat-Tweet',
    QUOTE_TWEETS: 'Sitat-Tweets',
    REPOST: 'Republiser',
    REPOSTS: 'Republiseringer',
    RETWEETED_BY: 'Retweetet av',
    SHARED: 'Delt',
    SHARED_TWEETS: 'Delte tweets',
    SHOW: 'Vis',
    SHOW_MORE_REPLIES: 'Vis flere svar',
    SORT_REPLIES_BY: 'Sorter svar etter',
    TURN_OFF_QUOTE_TWEETS: 'Slå av sitat-tweets',
    TURN_OFF_RETWEETS: 'Slå av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
    TWEET_ALL: 'Tweet alle',
    TWEET_INTERACTIONS: 'Tweet-interaksjoner',
    TWEET_YOUR_REPLY: 'Tweet svaret ditt',
    UNDO_RETWEET: 'Angre Retweet',
    VIEW: 'Vis',
    WHATS_HAPPENING: 'Hva skjer?',
  },
  nl: {
    ADD_ANOTHER_TWEET: 'Nog een Tweet toevoegen',
    ADD_MUTED_WORD: 'Genegeerd woord toevoegen',
    GROK_ACTIONS: 'Grok-acties',
    HOME: 'Startpagina',
    LIKES: 'Vind-ik-leuks',
    LIVE_ON_X: 'Live op X',
    MOST_RELEVANT: 'Meest relevant',
    MUTE_THIS_CONVERSATION: 'Dit gesprek negeren',
    POST_ALL: 'Alles plaatsen',
    POST_UNAVAILABLE: 'Deze post is niet beschikbaar.',
    PROFILE_SUMMARY: 'Profieloverzicht',
    QUOTE: 'Geciteerd',
    QUOTES: 'Geciteerd',
    QUOTE_TWEET: 'Citeer Tweet',
    QUOTE_TWEETS: 'Geciteerde Tweets',
    RETWEET: 'Retweeten',
    RETWEETED_BY: 'Geretweet door',
    SHARED: 'Gedeeld',
    SHARED_TWEETS: 'Gedeelde Tweets',
    SHOW: 'Weergeven',
    SHOW_MORE_REPLIES: 'Meer antwoorden tonen',
    SORT_REPLIES_BY: 'Antwoorden sorteren op',
    TURN_OFF_QUOTE_TWEETS: 'Geciteerde Tweets uitschakelen',
    TURN_OFF_RETWEETS: 'Retweets uitschakelen',
    TURN_ON_RETWEETS: 'Retweets inschakelen',
    TWEET: 'Tweeten',
    TWEET_ALL: 'Alles tweeten',
    TWEET_INTERACTIONS: 'Tweet-interacties',
    TWEET_YOUR_REPLY: 'Tweet je antwoord',
    UNDO_RETWEET: 'Retweet ongedaan maken',
    VIEW: 'Bekijken',
    WHATS_HAPPENING: 'Wat gebeurt er?',
  },
  pl: {
    ADD_ANOTHER_TWEET: 'Dodaj kolejnego Tweeta',
    ADD_MUTED_WORD: 'Dodaj wyciszone słowo',
    GROK_ACTIONS: 'Akcje Groka',
    HOME: 'Główna',
    LIKES: 'Polubienia',
    LIVE_ON_X: 'Na żywo w serwisie X',
    MOST_RELEVANT: 'Najtrafniejsze',
    MUTE_THIS_CONVERSATION: 'Wycisz tę rozmowę',
    POST_ALL: 'Opublikuj wszystko',
    POST_UNAVAILABLE: 'Ten wpis jest niedostępny.',
    PROFILE_SUMMARY: 'Podsumowanie profilu',
    QUOTE: 'Cytuj',
    QUOTES: 'Cytaty',
    QUOTE_TWEET: 'Cytuj Tweeta',
    QUOTE_TWEETS: 'Cytaty z Tweeta',
    REPOST: 'Podaj dalej wpis',
    REPOSTS: 'Wpisy podane dalej',
    RETWEET: 'Podaj dalej',
    RETWEETED_BY: 'Podane dalej przez',
    RETWEETS: 'Tweety podane dalej',
    SHARED: 'Udostępniony',
    SHARED_TWEETS: 'Udostępnione Tweety',
    SHOW: 'Pokaż',
    SHOW_MORE_REPLIES: 'Pokaż więcej odpowiedzi',
    SORT_REPLIES_BY: 'Sortuj odpowiedzi wg',
    TURN_OFF_QUOTE_TWEETS: 'Wyłącz tweety z cytatem',
    TURN_OFF_RETWEETS: 'Wyłącz Tweety podane dalej',
    TURN_ON_RETWEETS: 'Włącz Tweety podane dalej',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnij wszystko',
    TWEET_INTERACTIONS: 'Interakcje na Tweeta',
    TWEET_YOUR_REPLY: 'Tweeta swoją odpowiedź',
    UNDO_RETWEET: 'Cofnij podanie dalej',
    VIEW: 'Wyświetl',
    WHATS_HAPPENING: 'Co się dzieje?',
  },
  pt: {
    ADD_ANOTHER_TWEET: 'Adicionar outro Tweet',
    ADD_MUTED_WORD: 'Adicionar palavra silenciada',
    GROK_ACTIONS: 'Ações do Grok',
    HOME: 'Página Inicial',
    LIKES: 'Curtidas',
    LIVE_ON_X: 'Ao vivo no X',
    MOST_RELEVANT: 'Mais relevante',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    POST_ALL: 'Postar tudo',
    POST_UNAVAILABLE: 'Este post está indisponível.',
    PROFILE_SUMMARY: 'Resumo do perfil',
    QUOTE: 'Comentar',
    QUOTES: 'Comentários',
    QUOTE_TWEET: 'Comentar o Tweet',
    QUOTE_TWEETS: 'Tweets com comentário',
    REPOST: 'Repostar',
    RETWEET: 'Retweetar',
    RETWEETED_BY: 'Retweetado por',
    SHARED: 'Compartilhado',
    SHARED_TWEETS: 'Tweets Compartilhados',
    SHOW: 'Mostrar',
    SHOW_MORE_REPLIES: 'Mostrar mais respostas',
    SORT_REPLIES_BY: 'Ordenar respostas por',
    TURN_OFF_QUOTE_TWEETS: 'Desativar Tweets com comentário',
    TURN_OFF_RETWEETS: 'Desativar Retweets',
    TURN_ON_RETWEETS: 'Ativar Retweets',
    TWEET: 'Tweetar',
    TWEET_ALL: 'Tweetar tudo',
    TWEET_INTERACTIONS: 'Interações com Tweet',
    TWEET_YOUR_REPLY: 'Tweetar sua resposta',
    UNDO_RETWEET: 'Desfazer Retweet',
    VIEW: 'Ver',
    WHATS_HAPPENING: 'O que está acontecendo?',
  },
  ro: {
    ADD_ANOTHER_TWEET: 'Adaugă alt Tweet',
    ADD_MUTED_WORD: 'Adaugă cuvântul ignorat',
    GROK_ACTIONS: 'Acțiuni Grok',
    HOME: 'Pagina principală',
    LIKES: 'Aprecieri',
    LIVE_ON_X: 'În direct pe X',
    MOST_RELEVANT: 'Cele mai relevante',
    MUTE_THIS_CONVERSATION: 'Ignoră această conversație',
    POST_ALL: 'Postează tot',
    POST_UNAVAILABLE: 'Această postare este indisponibilă.',
    PROFILE_SUMMARY: 'Sumarul profilului',
    QUOTE: 'Citat',
    QUOTES: 'Citate',
    QUOTE_TWEET: 'Citează Tweetul',
    QUOTE_TWEETS: 'Tweeturi cu citat',
    REPOST: 'Repostează',
    REPOSTS: 'Repostări',
    RETWEET: 'Redistribuie',
    RETWEETED_BY: 'Redistribuit de către',
    RETWEETS: 'Retweeturi',
    SHARED: 'Partajat',
    SHARED_TWEETS: 'Tweeturi partajate',
    SHOW: 'Afișează',
    SHOW_MORE_REPLIES: 'Afișează mai multe răspunsuri',
    SORT_REPLIES_BY: 'Sortare răspunsuri după',
    TURN_OFF_QUOTE_TWEETS: 'Dezactivează tweeturile cu citat',
    TURN_OFF_RETWEETS: 'Dezactivează Retweeturile',
    TURN_ON_RETWEETS: 'Activează Retweeturile',
    TWEETS: 'Tweeturi',
    TWEET_ALL: 'Dă Tweeturi cu tot',
    TWEET_INTERACTIONS: 'Interacțiuni cu Tweetul',
    TWEET_YOUR_REPLY: 'Dă Tweet cu răspunsul',
    UNDO_RETWEET: 'Anulează Retweetul',
    VIEW: 'Vezi',
    WHATS_HAPPENING: 'Ce se întâmplă?',
  },
  ru: {
    ADD_ANOTHER_TWEET: 'Добавить еще один твит',
    ADD_MUTED_WORD: 'Добавить игнорируемое слово',
    GROK_ACTIONS: 'Действия Grok',
    HOME: 'Главная',
    LIKES: 'Нравится',
    LIVE_ON_X: 'Прямой эфир в X',
    MOST_RELEVANT: 'Наиболее актуальные',
    MUTE_THIS_CONVERSATION: 'Игнорировать эту переписку',
    POST_ALL: 'Опубликовать все',
    POST_UNAVAILABLE: 'Этот пост недоступен.',
    PROFILE_SUMMARY: 'Сводка профиля',
    QUOTE: 'Цитата',
    QUOTES: 'Цитаты',
    QUOTE_TWEET: 'Цитировать',
    QUOTE_TWEETS: 'Твиты с цитатами',
    REPOST: 'Сделать репост',
    REPOSTS: 'Репосты',
    RETWEET: 'Ретвитнуть',
    RETWEETED_BY: 'Ретвитнул(а)',
    RETWEETS: 'Ретвиты',
    SHARED: 'Общий',
    SHARED_TWEETS: 'Общие твиты',
    SHOW: 'Показать',
    SHOW_MORE_REPLIES: 'Показать ещё ответы',
    SORT_REPLIES_BY: 'Упорядочить ответы по',
    TURN_OFF_QUOTE_TWEETS: 'Отключить твиты с цитатами',
    TURN_OFF_RETWEETS: 'Отключить ретвиты',
    TURN_ON_RETWEETS: 'Включить ретвиты',
    TWEET: 'Твитнуть',
    TWEETS: 'Твиты',
    TWEET_ALL: 'Твитнуть все',
    TWEET_INTERACTIONS: 'Взаимодействие в Твитнуть',
    TWEET_YOUR_REPLY: 'Твитните свой ответ',
    TWITTER: 'Твиттер',
    UNDO_RETWEET: 'Отменить ретвит',
    VIEW: 'Посмотреть',
    WHATS_HAPPENING: 'Что происходит?',
  },
  sk: {
    ADD_ANOTHER_TWEET: 'Pridať ďalší Tweet',
    ADD_MUTED_WORD: 'Pridať stíšené slovo',
    GROK_ACTIONS: 'Akcie Groka',
    HOME: 'Domov',
    LIKES: 'Páči sa',
    LIVE_ON_X: 'Naživo na X',
    MOST_RELEVANT: 'Najrelevantnejšie',
    MUTE_THIS_CONVERSATION: 'Stíšiť túto konverzáciu',
    POST_ALL: 'Uverejniť všetko',
    POST_UNAVAILABLE: 'Tento príspevok je nedostupný.',
    PROFILE_SUMMARY: 'Súhrn profilu',
    QUOTE: 'Citát',
    QUOTES: 'Citáty',
    QUOTE_TWEET: 'Tweet s citátom',
    QUOTE_TWEETS: 'Tweety s citátom',
    REPOST: 'Opätovné uverejnenie',
    REPOSTS: 'Opätovné uverejnenia',
    RETWEET: 'Retweetnuť',
    RETWEETED_BY: 'Retweetnuté používateľom',
    RETWEETS: 'Retweety',
    SHARED: 'Zdieľaný',
    SHARED_TWEETS: 'Zdieľané Tweety',
    SHOW: 'Zobraziť',
    SHOW_MORE_REPLIES: 'Zobraziť viac odpovedí',
    SORT_REPLIES_BY: 'Zoradiť odpovede podľa',
    TURN_OFF_QUOTE_TWEETS: 'Vypnúť tweety s citátom',
    TURN_OFF_RETWEETS: 'Vypnúť retweety',
    TURN_ON_RETWEETS: 'Zapnúť retweety',
    TWEET: 'Tweetnuť',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnuť všetko',
    TWEET_INTERACTIONS: 'Interakcie s Tweet',
    TWEET_YOUR_REPLY: 'Tweetnite odpoveď',
    UNDO_RETWEET: 'Zrušiť retweet',
    VIEW: 'Zobraziť',
    WHATS_HAPPENING: 'Čo sa deje?',
  },
  sr: {
    ADD_ANOTHER_TWEET: 'Додај још један твит',
    ADD_MUTED_WORD: 'Додај игнорисану реч',
    GROK_ACTIONS: 'Grok радње',
    HOME: 'Почетна',
    LIKES: 'Свиђања',
    LIVE_ON_X: 'Уживо на мрежи X',
    MOST_RELEVANT: 'Најважније',
    MUTE_THIS_CONVERSATION: 'Игнориши овај разговор',
    POST_ALL: 'Објави све',
    POST_UNAVAILABLE: 'Ова објава није доступна.',
    PROFILE_SUMMARY: 'Резиме профила',
    QUOTE: 'Цитат',
    QUOTES: 'Цитати',
    QUOTE_TWEET: 'твит са цитатом',
    QUOTE_TWEETS: 'твит(ов)а са цитатом',
    REPOST: 'Поново објави',
    REPOSTS: 'Понвне објаве',
    RETWEET: 'Ретвитуј',
    RETWEETED_BY: 'Ретвитовано од стране',
    RETWEETS: 'Ретвитови',
    SHARED: 'Подељено',
    SHARED_TWEETS: 'Дељени твитови',
    SHOW: 'Прикажи',
    SHOW_MORE_REPLIES: 'Прикажи још одговора',
    SORT_REPLIES_BY: 'Сортирај одговоре по',
    TURN_OFF_QUOTE_TWEETS: 'Искључи твит(ов)е са цитатом',
    TURN_OFF_RETWEETS: 'Искључи ретвитове',
    TURN_ON_RETWEETS: 'Укључи ретвитове',
    TWEET: 'Твитуј',
    TWEETS: 'Твитови',
    TWEET_ALL: 'Твитуј све',
    TWEET_INTERACTIONS: 'Интеракције са Твитуј',
    TWEET_YOUR_REPLY: 'Твитуј свој одговор',
    TWITTER: 'Твитер',
    UNDO_RETWEET: 'Опозови ретвит',
    VIEW: 'Погледај',
    WHATS_HAPPENING: 'Шта се дешава?',
  },
  sv: {
    ADD_ANOTHER_TWEET: 'Lägg till en Tweet till',
    ADD_MUTED_WORD: 'Lägg till ignorerat ord',
    GROK_ACTIONS: 'Grok-åtgärder',
    HOME: 'Hem',
    LIKES: 'Gilla-markeringar',
    LIVE_ON_X: 'Live på X',
    MOST_RELEVANT: 'Mest relevant',
    MUTE_THIS_CONVERSATION: 'Ignorera den här konversationen',
    POST_ALL: 'Lägg upp allt',
    POST_UNAVAILABLE: 'Detta inlägg är inte tillgängligt.',
    PROFILE_SUMMARY: 'Profilöversikt',
    QUOTE: 'Citat',
    QUOTES: 'Citat',
    QUOTE_TWEET: 'Citera Tweet',
    QUOTE_TWEETS: 'Citat-tweets',
    REPOST: 'Återpublicera',
    REPOSTS: 'Återpubliceringar',
    RETWEET: 'Retweeta',
    RETWEETED_BY: 'Retweetad av',
    SHARED: 'Delad',
    SHARED_TWEETS: 'Delade tweetsen',
    SHOW: 'Visa',
    SHOW_MORE_REPLIES: 'Visa fler svar',
    SORT_REPLIES_BY: 'Sortera svar på',
    TURN_OFF_QUOTE_TWEETS: 'Stäng av citat-tweets',
    TURN_OFF_RETWEETS: 'Stäng av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
    TWEET: 'Tweeta',
    TWEET_ALL: 'Tweeta allt',
    TWEET_INTERACTIONS: 'Interaktioner med Tweet',
    TWEET_YOUR_REPLY: 'Tweeta ditt svar',
    UNDO_RETWEET: 'Ångra retweeten',
    VIEW: 'Visa',
    WHATS_HAPPENING: 'Vad är det som händer?',
  },
  ta: {
    ADD_ANOTHER_TWEET: 'வேறொரு கீச்சைச் சேர்',
    ADD_MUTED_WORD: 'செயல்மறைத்த வார்த்தையைச் சேர்',
    GROK_ACTIONS: 'Grok செயல்கள்',
    HOME: 'முகப்பு',
    LIKES: 'விருப்பங்கள்',
    LIVE_ON_X: 'X -இல் நேரலை',
    MOST_RELEVANT: 'மிகவும் தொடர்புடையவை',
    MUTE_THIS_CONVERSATION: 'இந்த உரையாடலை செயல்மறை',
    POST_ALL: 'எல்லாம் இடுகையிடு',
    POST_UNAVAILABLE: 'இந்த இடுகை கிடைக்கவில்லை.',
    PROFILE_SUMMARY: 'சுயவிவரச் சுருக்கம்',
    QUOTE: 'மேற்கோள்',
    QUOTES: 'மேற்கோள்கள்',
    QUOTE_TWEET: 'ட்விட்டை மேற்கோள் காட்டு',
    QUOTE_TWEETS: 'மேற்கோள் கீச்சுகள்',
    REPOST: 'மறுஇடுகை',
    REPOSTS: 'மறுஇடுகைகள்',
    RETWEET: 'மறுட்விட் செய்',
    RETWEETED_BY: 'இவரால் மறுட்விட் செய்யப்பட்டது',
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED: 'பகிரப்பட்டது',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
    SHOW: 'காண்பி',
    SHOW_MORE_REPLIES: 'மேலும் பதில்களைக் காண்பி',
    SORT_REPLIES_BY: 'இதன்படி பதில்களை வகைப்படுத்து',
    TURN_OFF_QUOTE_TWEETS: 'மேற்கோள் கீச்சுகளை அணை',
    TURN_OFF_RETWEETS: 'மறுகீச்சுகளை அணை',
    TURN_ON_RETWEETS: 'மறுகீச்சுகளை இயக்கு',
    TWEET: 'ட்விட் செய்',
    TWEETS: 'கீச்சுகள்',
    TWEET_ALL: 'அனைத்தையும் ட்விட் செய்',
    TWEET_INTERACTIONS: 'ட்விட் செய் ஊடாடல்களைக்',
    TWEET_YOUR_REPLY: 'உங்கள் பதிலை ட்விட் செய்யவும்',
    UNDO_RETWEET: 'மறுகீச்சை செயல்தவிர்',
    VIEW: 'காண்பி',
    WHATS_HAPPENING: 'என்ன நிகழ்கிறது?',
  },
  th: {
    ADD_ANOTHER_TWEET: 'เพิ่มอีกทวีต',
    ADD_MUTED_WORD: 'เพิ่มคำที่ซ่อน',
    GROK_ACTIONS: 'การดำเนินการของ Grok',
    HOME: 'หน้าแรก',
    LIKES: 'ความชอบ',
    LIVE_ON_X: 'ถ่ายทอดสดบน X',
    MOST_RELEVANT: 'เกี่ยวข้องที่สุด',
    MUTE_THIS_CONVERSATION: 'ซ่อนบทสนทนานี้',
    POST_ALL: 'โพสต์ทั้งหมด',
    POST_UNAVAILABLE: 'โพสต์นี้ไม่สามารถใช้งานได้',
    PROFILE_SUMMARY: 'ข้อมูลส่วนตัวโดยย่อ',
    QUOTE: 'การอ้างอิง',
    QUOTES: 'คำพูด',
    QUOTE_TWEET: 'อ้างอิงทวีต',
    QUOTE_TWEETS: 'ทวีตและคำพูด',
    REPOST: 'รีโพสต์',
    REPOSTS: 'รีโพสต์',
    RETWEET: 'รีทวีต',
    RETWEETED_BY: 'ถูกรีทวีตโดย',
    RETWEETS: 'รีทวีต',
    SHARED: 'แบ่งปัน',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    SHOW: 'แสดง',
    SHOW_MORE_REPLIES: 'แสดงการตอบกลับเพิ่มเติม',
    SORT_REPLIES_BY: 'จัดเรียงการตอบกลับโดย',
    TURN_OFF_QUOTE_TWEETS: 'ปิดทวีตและคำพูด',
    TURN_OFF_RETWEETS: 'ปิดรีทวีต',
    TURN_ON_RETWEETS: 'เปิดรีทวีต',
    TWEET: 'ทวีต',
    TWEETS: 'ทวีต',
    TWEET_ALL: 'ทวีตทั้งหมด',
    TWEET_INTERACTIONS: 'การโต้ตอบของทวีต',
    TWEET_YOUR_REPLY: 'ทวีตการตอบกลับของคุณ',
    TWITTER: 'ทวิตเตอร์',
    UNDO_RETWEET: 'ยกเลิกการรีทวีต',
    VIEW: 'ดู',
    WHATS_HAPPENING: 'มีอะไรเกิดขึ้นบ้าง',
  },
  tr: {
    ADD_ANOTHER_TWEET: 'Başka bir Tweet ekle',
    ADD_MUTED_WORD: 'Sessize alınacak kelime ekle',
    GROK_ACTIONS: 'Grok işlemleri',
    HOME: 'Anasayfa',
    LIKES: 'Beğeni',
    LIVE_ON_X: "X'te Canlı",
    MOST_RELEVANT: 'En alakalı',
    MUTE_THIS_CONVERSATION: 'Bu sohbeti sessize al',
    POST_ALL: 'Tümünü gönder',
    POST_UNAVAILABLE: 'Bu gönderi kullanılamıyor.',
    PROFILE_SUMMARY: 'Profil Özeti',
    QUOTE: 'Alıntı',
    QUOTES: 'Alıntılar',
    QUOTE_TWEET: 'Tweeti Alıntıla',
    QUOTE_TWEETS: 'Alıntı Tweetler',
    REPOST: 'Yeniden gönder',
    REPOSTS: 'Yeniden gönderiler',
    RETWEETED_BY: 'Retweetleyen(ler):',
    RETWEETS: 'Retweetler',
    SHARED: 'Paylaşılan',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
    SHOW: 'Göster',
    SHOW_MORE_REPLIES: 'Daha fazla yanıt göster',
    SORT_REPLIES_BY: 'Yanıtları sıralama ölçütü',
    TURN_OFF_QUOTE_TWEETS: 'Alıntı Tweetleri kapat',
    TURN_OFF_RETWEETS: 'Retweetleri kapat',
    TURN_ON_RETWEETS: 'Retweetleri aç',
    TWEET: 'Tweetle',
    TWEETS: 'Tweetler',
    TWEET_ALL: 'Hepsini Tweetle',
    TWEET_INTERACTIONS: 'Tweet etkileşimleri',
    TWEET_YOUR_REPLY: 'Yanıtını Tweetle',
    UNDO_RETWEET: 'Retweeti Geri Al',
    VIEW: 'Görüntüle',
    WHATS_HAPPENING: 'Neler oluyor?',
  },
  uk: {
    ADD_ANOTHER_TWEET: 'Додати ще один твіт',
    ADD_MUTED_WORD: 'Додати слово до списку ігнорування',
    GROK_ACTIONS: 'Дії Grok',
    HOME: 'Головна',
    LIKES: 'Вподобання',
    LIVE_ON_X: 'Прямий ефір в X',
    MOST_RELEVANT: 'Найактуальніші',
    MUTE_THIS_CONVERSATION: 'Ігнорувати цю розмову',
    POST_ALL: 'Опублікувати все',
    POST_UNAVAILABLE: 'Цей пост недоступний.',
    PROFILE_SUMMARY: 'Зведення профілю',
    QUOTE: 'Цитата',
    QUOTES: 'Цитати',
    QUOTE_TWEET: 'Цитувати твіт',
    QUOTE_TWEETS: 'Цитовані твіти',
    REPOST: 'Зробити репост',
    REPOSTS: 'Репости',
    RETWEET: 'Ретвітнути',
    RETWEETED_BY: 'Ретвіти',
    RETWEETS: 'Ретвіти',
    SHARED: 'Спільний',
    SHARED_TWEETS: 'Спільні твіти',
    SHOW: 'Показати',
    SHOW_MORE_REPLIES: 'Показати більше відповідей',
    SORT_REPLIES_BY: 'Сортувати відповіді за',
    TURN_OFF_QUOTE_TWEETS: 'Вимкнути цитовані твіти',
    TURN_OFF_RETWEETS: 'Вимкнути ретвіти',
    TURN_ON_RETWEETS: 'Увімкнути ретвіти',
    TWEET: 'Твіт',
    TWEETS: 'Твіти',
    TWEET_ALL: 'Твітнути все',
    TWEET_INTERACTIONS: 'Взаємодія твітів',
    TWEET_YOUR_REPLY: 'Твітніть відповідь',
    TWITTER: 'Твіттер',
    UNDO_RETWEET: 'Скасувати ретвіт',
    VIEW: 'Переглянути',
    WHATS_HAPPENING: 'Що відбувається?',
  },
  ur: {
    ADD_ANOTHER_TWEET: 'ایک اور ٹویٹ شامل کریں',
    ADD_MUTED_WORD: 'میوٹ شدہ لفظ شامل کریں',
    HOME: 'ہوم',
    LIKES: 'لائک',
    MUTE_THIS_CONVERSATION: 'اس گفتگو کو میوٹ کریں',
    QUOTE: 'نقل کریں',
    QUOTES: 'منقول',
    QUOTE_TWEET: 'ٹویٹ کا حوالہ دیں',
    QUOTE_TWEETS: 'ٹویٹ کو نقل کرو',
    RETWEET: 'ریٹویٹ',
    RETWEETED_BY: 'جنہوں نے ریٹویٹ کیا',
    RETWEETS: 'ریٹویٹس',
    SHARED: 'مشترکہ',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
    SHOW: 'دکھائیں',
    SHOW_MORE_REPLIES: 'مزید جوابات دکھائیں',
    TURN_OFF_QUOTE_TWEETS: 'ٹویٹ کو نقل کرنا بند کریں',
    TURN_OFF_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TURN_ON_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TWEET: 'ٹویٹ',
    TWEETS: 'ٹویٹس',
    TWEET_ALL: 'سب کو ٹویٹ کریں',
    TWEET_INTERACTIONS: 'ٹویٹ تعاملات',
    TWEET_YOUR_REPLY: 'اپنا جواب ٹویٹ کریں',
    TWITTER: 'ٹوئٹر',
    UNDO_RETWEET: 'ری ٹویٹ کو کالعدم کریں',
    VIEW: 'دیکھیں',
    WHATS_HAPPENING: 'کیا ہو رہا ہے؟',
  },
  vi: {
    ADD_ANOTHER_TWEET: 'Thêm Tweet khác',
    ADD_MUTED_WORD: 'Thêm từ tắt tiếng',
    GROK_ACTIONS: 'Hành động của Grok',
    HOME: 'Trang chủ',
    LIKES: 'Lượt thích',
    LIVE_ON_X: 'Trực tuyến trên X',
    MOST_RELEVANT: 'Liên quan nhất',
    MUTE_THIS_CONVERSATION: 'Tắt tiếng cuộc trò chuyện này',
    POST_ALL: 'Đăng tất cả',
    POST_UNAVAILABLE: 'Không có bài đăng này.',
    PROFILE_SUMMARY: 'Tóm tắt hồ sơ',
    QUOTE: 'Trích dẫn',
    QUOTES: 'Trích dẫn',
    QUOTE_TWEET: 'Trích dẫn Tweet',
    QUOTE_TWEETS: 'Tweet trích dẫn',
    REPOST: 'Đăng lại',
    REPOSTS: 'Bài đăng lại',
    RETWEET: 'Tweet lại',
    RETWEETED_BY: 'Được Tweet lại bởi',
    RETWEETS: 'Các Tweet lại',
    SHARED: 'Đã chia sẻ',
    SHARED_TWEETS: 'Tweet được chia sẻ',
    SHOW: 'Hiện',
    SHOW_MORE_REPLIES: 'Hiển thị thêm trả lời',
    SORT_REPLIES_BY: 'Sắp xếp câu trả lời theo',
    TURN_OFF_QUOTE_TWEETS: 'Tắt Tweet trích dẫn',
    TURN_OFF_RETWEETS: 'Tắt Tweet lại',
    TURN_ON_RETWEETS: 'Bật Tweet lại',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Đăng Tweet tất cả',
    TWEET_INTERACTIONS: 'Tương tác Tweet',
    TWEET_YOUR_REPLY: 'Đăng Tweet câu trả lời của bạn',
    UNDO_RETWEET: 'Hoàn tác Tweet lại',
    VIEW: 'Xem',
    WHATS_HAPPENING: 'Chuyện gì đang xảy ra?',
  },
  'zh-Hant': {
    ADD_ANOTHER_TWEET: '加入另一則推文',
    ADD_MUTED_WORD: '加入靜音文字',
    GROK_ACTIONS: 'Grok 動作',
    HOME: '首頁',
    LIKES: '喜歡的內容',
    LIVE_ON_X: 'X 上的直播',
    MOST_RELEVANT: '最相關',
    MUTE_THIS_CONVERSATION: '將此對話靜音',
    POST_ALL: '全部發佈',
    POST_UNAVAILABLE: '此貼文無法查看。',
    PROFILE_SUMMARY: '個人檔案摘要',
    QUOTE: '引用',
    QUOTES: '引用',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用的推文',
    REPOST: '轉發',
    REPOSTS: '轉發',
    RETWEET: '轉推',
    RETWEETED_BY: '已被轉推',
    RETWEETS: '轉推',
    SHARED: '共享',
    SHARED_TWEETS: '分享的推文',
    SHOW: '顯示',
    SHOW_MORE_REPLIES: '顯示更多回覆',
    SORT_REPLIES_BY: '回覆排序方式',
    TURN_OFF_QUOTE_TWEETS: '關閉引用的推文',
    TURN_OFF_RETWEETS: '關閉轉推',
    TURN_ON_RETWEETS: '開啟轉推',
    TWEET: '推文',
    TWEETS: '推文',
    TWEET_ALL: '推全部內容',
    TWEET_INTERACTIONS: '推文互動',
    TWEET_YOUR_REPLY: '推你的回覆',
    UNDO_RETWEET: '取消轉推',
    VIEW: '查看',
    WHATS_HAPPENING: '有什麼新鮮事？',
  },
  zh: {
    ADD_ANOTHER_TWEET: '添加另一条推文',
    ADD_MUTED_WORD: '添加要隐藏的字词',
    GROK_ACTIONS: 'Grok 操作',
    HOME: '主页',
    LIKES: '喜欢',
    LIVE_ON_X: 'X 上的直播',
    MOST_RELEVANT: '最相关',
    MUTE_THIS_CONVERSATION: '隐藏此对话',
    POST_ALL: '全部发帖',
    POST_UNAVAILABLE: '这个帖子不可用。',
    PROFILE_SUMMARY: '个人资料概要',
    QUOTE: '引用',
    QUOTES: '引用',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用推文',
    REPOST: '转帖',
    REPOSTS: '转帖',
    RETWEET: '转推',
    RETWEETED_BY: '转推者',
    RETWEETS: '转推',
    SHARED: '共享',
    SHARED_TWEETS: '分享的推文',
    SHOW: '显示',
    SHOW_MORE_REPLIES: '显示更多回复',
    SORT_REPLIES_BY: '回复排序依据',
    TURN_OFF_QUOTE_TWEETS: '关闭引用推文',
    TURN_OFF_RETWEETS: '关闭转推',
    TURN_ON_RETWEETS: '开启转推',
    TWEET: '推文',
    TWEETS: '推文',
    TWEET_ALL: '全部发推',
    TWEET_INTERACTIONS: '推文互动',
    TWEET_YOUR_REPLY: '发布你的回复',
    UNDO_RETWEET: '撤销转推',
    VIEW: '查看',
    WHATS_HAPPENING: '有什么新鲜事？',
  },
}

/**
 * @param {import("./types").LocaleKey} code
 * @returns {string}
 */
function getString(code) {
  return (locales[lang] || locales['en'])[code] || locales['en'][code];
}
//#endregion

//#region Constants
/** @enum {string} */
const PagePaths = {
  ACCESSIBILITY_SETTINGS: '/settings/accessibility',
  ADD_MUTED_WORD: '/settings/add_muted_keyword',
  BOOKMARKS: '/i/bookmarks',
  COMPOSE_TWEET: '/compose/post',
  CONNECT: '/i/connect',
  DISPLAY_SETTINGS: '/settings/display',
  HOME: '/home',
  NOTIFICATION_TIMELINE: '/i/timeline',
  PROFILE_SETTINGS: '/settings/profile',
  SEARCH: '/search',
  TIMELINE_SETTINGS: '/home/pinned/edit',
}

/** @enum {string} */
const ModalPaths = {
  COMPOSE_DRAFTS: '/compose/post/unsent/drafts',
  COMPOSE_MEDIA: '/compose/post/media',
  COMPOSE_MESSAGE: '/messages/compose',
  COMPOSE_SCHEDULE: '/compose/post/schedule',
  COMPOSE_TWEET: '/compose/post',
  GIF_SEARCH: '/i/foundmedia/search',
}

/** @enum {string} */
const Selectors = {
  BLOCK_MENU_ITEM: '[data-testid="block"]',
  DESKTOP_TIMELINE_HEADER: 'div[data-testid="primaryColumn"] > div > div:first-of-type',
  DISPLAY_DONE_BUTTON_DESKTOP: '#layers button[role="button"]:not([aria-label])',
  DISPLAY_DONE_BUTTON_MOBILE: 'main button[role="button"]:not([aria-label])',
  MODAL_TIMELINE: 'section > h1 + div[aria-label] > div',
  MOBILE_TIMELINE_HEADER: 'div[data-testid="TopNavBar"]',
  MORE_DIALOG: 'div[aria-labelledby="modal-header"]',
  NAV_HOME_LINK: 'a[data-testid="AppTabBar_Home_Link"]',
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV_DESKTOP: 'header nav',
  PRIMARY_NAV_MOBILE: '#layers nav',
  PROMOTED_TWEET_CONTAINER: '[data-testid="placementTracking"]',
  SIDEBAR: 'div[data-testid="sidebarColumn"]',
  SIDEBAR_WRAPPERS: 'div[data-testid="sidebarColumn"] > div > div > div > div > div',
  SORT_REPLIES_PATH: 'svg path[d="M14 6V3h2v8h-2V8H3V6h11zm7 2h-3.5V6H21v2zM8 16v-3h2v8H8v-3H3v-2h5zm13 2h-9.5v-2H21v2z"]',
  TIMELINE: 'div[data-testid="primaryColumn"] section > h1 + div[aria-label] > div',
  TIMELINE_HEADING: 'h2[role="heading"]',
  TWEET: '[data-testid="tweet"]',
  VERIFIED_TICK: 'svg[data-testid="icon-verified"]',
  X_LOGO_PATH: 'svg path[d="M21.742 21.75l-7.563-11.179 7.056-8.321h-2.456l-5.691 6.714-4.54-6.714H2.359l7.29 10.776L2.25 21.75h2.456l6.035-7.118 4.818 7.118h6.191-.008zM7.739 3.818L18.81 20.182h-2.447L5.29 3.818h2.447z"]',
  X_DARUMA_LOGO_PATH: 'svg path[d="M18.436 1.92h3.403l-7.433 8.495 8.745 11.563h-6.849l-5.363-7.012-6.136 7.012H1.4l7.951-9.088L.96 1.92h7.02l4.848 6.41 5.608-6.41zm-1.194 18.021h1.886L6.958 3.851H4.933l12.308 16.09z"]',
}

/** @enum {string} */
const Svgs = {
  BLUE_LOGO_PATH: 'M16.5 3H2v18h15c3.038 0 5.5-2.46 5.5-5.5 0-1.4-.524-2.68-1.385-3.65-.08-.09-.089-.22-.023-.32.574-.87.908-1.91.908-3.03C22 5.46 19.538 3 16.5 3zm-.796 5.99c.457-.05.892-.17 1.296-.35-.302.45-.684.84-1.125 1.15.004.1.006.19.006.29 0 2.94-2.269 6.32-6.421 6.32-1.274 0-2.46-.37-3.459-1 .177.02.357.03.539.03 1.057 0 2.03-.35 2.803-.95-.988-.02-1.821-.66-2.109-1.54.138.03.28.04.425.04.206 0 .405-.03.595-.08-1.033-.2-1.811-1.1-1.811-2.18v-.03c.305.17.652.27 1.023.28-.606-.4-1.004-1.08-1.004-1.85 0-.4.111-.78.305-1.11 1.113 1.34 2.775 2.22 4.652 2.32-.038-.17-.058-.33-.058-.51 0-1.23 1.01-2.22 2.256-2.22.649 0 1.235.27 1.647.7.514-.1.997-.28 1.433-.54-.168.52-.526.96-.992 1.23z',
  MUTE: '<g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g>',
  PROMOTED_PATH: 'M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0 1.38 1.119 2.5 2.5 2.5h15c1.381 0 2.5-1.12 2.5-2.5v-13c0-1.38-1.119-2.5-2.5-2.5zm-3.502 12h-2v-3.59l-5.293 5.3-1.414-1.42L12.581 10H8.996V8h7v7z',
  RETWEET: '<g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>',
  RETWEETS_OFF: '<g><path d="M3.707 21.707l18-18-1.414-1.414-2.088 2.088C17.688 4.137 17.11 4 16.5 4H11v2h5.5c.028 0 .056 0 .084.002l-10.88 10.88c-.131-.266-.204-.565-.204-.882V7.551l2.068 1.93 1.365-1.462L4.5 3.882.068 8.019l1.365 1.462 2.068-1.93V16c0 .871.278 1.677.751 2.334l-1.959 1.959 1.414 1.414zM18.5 9h2v7.449l2.068-1.93 1.365 1.462-4.433 4.137-4.432-4.137 1.365-1.462 2.067 1.93V9zm-8.964 9l-2 2H13v-2H9.536z"></path></g>',
  TWITTER_FEATHER_PLUS_PATH: 'M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z',
  TWITTER_HOME_ACTIVE_PATH: 'M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z',
  TWITTER_HOME_INACTIVE_PATH: 'M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z',
  TWITTER_LOGO_PATH: 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z',
  X_HOME_ACTIVE_PATH: 'M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z',
  X_HOME_INACTIVE_PATH: 'M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z',
  PLUS_PATH: 'M11 11V4h2v7h7v2h-7v7h-2v-7H4v-2h7z',
}

/** @enum {string} */
const Images = {
  TWITTER_FAVICON: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA0pJREFUWAntVk1oE1EQnnlJbFK3KUq9VJPYWgQVD/5QD0qpfweL1YJQoZAULBRPggp6kB78PQn14kHx0jRB0UO9REVFb1YqVBEsbZW2SbVS0B6apEnbbMbZ6qbZdTempqCHPAjvzcw3P5mdmfcAiquYgX+cAVwu/+5AdDMQnSPCHUhQA0hf+Rxy2OjicIvzm+qnKhito0qpb2wvJhWeJgCPP7oPELeHvdJ1VSGf3eOPnSWga0S0Qo9HxEkEusDBuNjbEca8G291nlBxmgDc/ukuIvAJxI6wr+yKCsq1ewLxQ2lZfpQLo8oQ4ZXdCkfnACrGWpyDCl+oQmVn5xuVPU102e2P3qoJkFOhzVb9S7KSnL5jJs/mI+As01PJFPSlZeFSZZoAGBRXBZyq9lk5NrC+e7pJ5en30c+JWk59pZ5vRDOuhAD381c/H/FKz1SMNgCE16rg505r5TT0uLqme93d0fbq+1SeLSeU83Ke0RHYFPGVPcjQfNDUwIa7M665+dQAEEjZoMwZMcEF9RxIDAgBQ2mCcqJ0Z0b+h4MNbZ4RnyOSDbNmE2iRk5jCNgIIckFoZAs4IgfLGrlKGjkzS16iwj6pV9I4mUvCPf73JVytH9nRJj24QHrqU8NCIWrMaGqAC+Ut/3ZzAS63cx4v2K/x/IvQBOCwWzu5KmJGwEJ5PIgeG9nQBDDcXPpFoDjJ7ThvBC6EZxXWkJG+JgAFwGM4KBAOcibeGCn8FQ/hyajXPmSk+1sACogn4hYk7OdiHDFSWipPkPWSmY6mCzIghEEuxJvcEYUvxIdhX2mvmSHDDPBF9AJRnDZTyp+P40671JYLbxiAohDxSTfQIg4oNxgPzCWPHaWQBViOf2jGqVwBaEaxGbAqOFMrp+SefC8eNhoFIY5lXzpmtnMGUB2IbU3JdIqVW9m5zcxINn/hAYKiIexdaTh4srHKORMAP0b28PNgJyGt5gvHzQVYx91QpVcwpRFl/p63HSR1DLbid1OcTpAJQOG7u+KH+aI5Qwj13IsamU5vkUSIc8uGLDa8OtoivV8U5HcydFLtT7hlSDVy2nfxI2Ibg9awuVU8IeJAOMF5m2B6jFs1tM5R9rS3GRP5uSuiihn4DzPwA7z7GDH+43gqAAAAAElFTkSuQmCC',
  TWITTER_PIP_FAVICON: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALASURBVHgB7VZNchJBFP5eM9FoRWV2WiZmbmBuIJ4g5ASBRWJlRXIC4ASQVUqxCo4QTwDegJzAiYlFXM1YZWmVQD9fQ6YyAwMMGBZW8i2G6e7He1+/3wHuOih4+fWieJhiKsirA0ZbE44fXZUaWDIGBH4/L+UUUB897DMfPf5ermKJUOaRIhTiDlNEBSwZlnkwY2vCuYOEWD/xMrCoKC41utISRlcc3Or2dfnqwHbDcj9X0fbztn9DAHxOoM0xrZILSIBXtR9F0VGKbJIhz7kVi3Lr770yAz4p2iYm188/awVi6lo4Ns4mETEDLz94uTHjIxDDRaWoohhOSjwi/9mKEFjtlKsayAuRM7M2HmFJwCRVIIqLSAAJjS822v0Vaip1E1oKC6XrXtrExjnxnJ6ldoVKFj0+ujywW3FKTTzJoibmAXP+Yt9uBEsrfLbWRelJzS/0B8z4WoKa6zW/1dd83Hlnn0Z0peAQkqNHvNPZi+qIELBWUNU97LLJ4hDESMZSlNmo+b5UTEvC85m0JCipTQREE+BhdzypIwSkLvyn4LKYrEzQkSZCloiyw+xJbnygfxX+VAJrPWnBoC9ixBXdDm4XflD7YajIinFq3L0E45J7fBa3HyEg7mhgeWjPJODu223J/iMsATzhcmp04+ueXTW1OsiD2zIuVfNNLockBAyIkdaaPxHGs3YR0JTQWnGbWkFCQZX5imwCmBoX++nGpONYD1zu2S0a9IN/g3jSNcNnqsy0ww2ZdPJzCKLXWAAy1N6ay2BRAgEcGZ+aqDnaoqdbjw6dhQgYwz1S2xKOQyQ0Phy7vDPr5iH5ITY+elmtpddLFyQzZBTP3xGl3FJ95NzQJ1hiAgMSw5jnJOZvMA/EMBNKSW89kUAAp+45+g+yojRjljL9NoP4GxdLYzk334vy3lYP0HBjhsw97vHf4C/b8RLHAOr+CQAAAABJRU5ErkJggg==',
}

const THEME_BLUE = 'rgb(29, 155, 240)'
const THEME_COLORS = new Map([
  ['blue500', THEME_BLUE],
  ['yellow500', 'rgb(255, 212, 0)'],
  ['magenta500', 'rgb(249, 24, 128)'],
  ['purple500', 'rgb(120, 86, 255)'],
  ['orange500', 'rgb(255, 122, 0)'],
  ['green500', 'rgb(0, 186, 124)'],
])
const HIGH_CONTRAST_LIGHT = new Map([
  ['blue500', 'rgb(0, 56, 134)'],
  ['yellow500', 'rgb(111, 62, 0)'],
  ['magenta500', 'rgb(137, 10, 70)'],
  ['purple500', 'rgb(82, 52, 183)'],
  ['orange500', 'rgb(137, 43, 0)'],
  ['green500', 'rgb(0, 97, 61)'],
])
const HIGH_CONTRAST_DARK = new Map([
  ['blue500', 'rgb(107, 201, 251)'],
  ['yellow500', 'rgb(255, 235, 107)'],
  ['magenta500', 'rgb(251, 112, 176)'],
  ['purple500', 'rgb(172, 151, 255)'],
  ['orange500', 'rgb(255, 173, 97)'],
  ['green500', 'rgb(97, 214, 163)'],
])
const COMPOSE_TWEET_MODAL_PAGES = new Set([
  ModalPaths.COMPOSE_DRAFTS,
  ModalPaths.COMPOSE_MEDIA,
  ModalPaths.COMPOSE_SCHEDULE,
  ModalPaths.GIF_SEARCH,
])
// <body> pseudo-selector for pages the full-width content feature works on
const FULL_WIDTH_BODY_PSEUDO = ':is(.Community, .List, .HomeTimeline)'
// Matches any notification count at the start of the title
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
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

//#region Variables
/**
 * The quoted Tweet associated with a caret menu that's just been opened.
 * @type {import("./types").QuotedTweet}
 */
let quotedTweet = null

/** `true` when a 'Block @${user}' menu item was seen in the last popup. */
let blockMenuItemSeen = false

/** `true` if the user has used the "Sort replies by" menu */
let userSortedReplies = false

/** Notification count in the title (including trailing space), e.g. `'(1) '`. */
let currentNotificationCount = ''

/** The last notification count we hid from the title. */
let hiddenNotificationCount = ''

/** Title of the current page, without the `' / Twitter'` suffix. */
let currentPage = ''

/** Current `location.pathname`. */
let currentPath = ''

/**
 * React Native stylesheet rule for the blur filter for sensitive content.
 * @type {CSSStyleRule}
 */
let filterBlurRule = null

/**
 * React Native stylesheett rule for the Chirp font-family.
 * @type {CSSStyleRule}
 */
let fontFamilyRule = null

/** @type {string} */
let fontSize = null

/** @type {Map<string, import("./types").Disconnectable>} */
let globalObservers = new Map()

/** Set to `true` when a Home/Following heading or Home nav link is used. */
let homeNavigationIsBeingUsed = false

/** Set to `true` when the media modal is open on desktop. */
let isDesktopMediaModalOpen = false

/** Set to `true` when the compose tweet modal is open on desktop. */
let isDesktopComposeTweetModalOpen = false

/** @type {HTMLElement} */
let $desktopComposeTweetModalPopup = null

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

/**
 * MutationObservers active on the current modal.
 * @type {Map<string, import("./types").Disconnectable>}
 */
let modalObservers = new Map()

/**
 * `true` after the app has initialised.
 * @type {boolean}
 */
let observingPageChanges = false

/**
 * MutationObservers active on the current page, or anything else we want to
 * clean up when the user moves off the current page.
 * @type {Map<string, import("./types").Disconnectable>}
 */
let pageObservers = new Map()

/** @type {number} */
let selectedHomeTabIndex = -1

/**
 * Title for the fake timeline used to separate out retweets and quote tweets.
 * @type {string}
 */
let separatedTweetsTimelineTitle = null

/**
 * The current "Color" setting.
 * @type {string}
 */
let themeColor = THEME_BLUE

/**
 * Tab to switch to after navigating to the Tweet interactions page.
 * @type {string}
 */
let tweetInteractionsTab = null

/**
 * `true` when "For you" was the last tab selected on the Home timeline.
 */
let wasForYouTabSelected = false

function isOnAccessibilitySettingsPage() {
  return currentPath == PagePaths.ACCESSIBILITY_SETTINGS
}

function isOnBookmarksPage() {
  return currentPath.startsWith(PagePaths.BOOKMARKS)
}

function isOnCommunitiesPage() {
  return URL_COMMUNITIES_RE.test(currentPath)
}

function isOnCommunityPage() {
  return URL_COMMUNITY_RE.test(currentPath)
}

function isOnCommunityMembersPage() {
  return URL_COMMUNITY_MEMBERS_RE.test(currentPath)
}

function isOnDiscoverCommunitiesPage() {
  return URL_DISCOVER_COMMUNITIES_RE.test(currentPath)
}

function isOnDisplaySettingsPage() {
  return currentPath == PagePaths.DISPLAY_SETTINGS
}

function isOnExplorePage() {
  return currentPath == '/explore' || currentPath.startsWith('/explore/')
}

function isOnFollowListPage() {
  return URL_PROFILE_FOLLOWS_RE.test(currentPath)
}

function isOnIndividualTweetPage() {
  return URL_TWEET_RE.test(currentPath)
}

function isOnListPage() {
  return URL_LIST_RE.test(currentPath)
}

function isOnListsPage() {
  return URL_LISTS_RE.test(currentPath)
}

function isOnHomeTimelinePage() {
  return currentPath == PagePaths.HOME
}

function isOnMessagesPage() {
  return currentPath.startsWith('/messages')
}

function isOnComposeTweetPage() {
  return currentPath.startsWith(PagePaths.COMPOSE_TWEET)
}

function isOnNotificationsPage() {
  return currentPath.startsWith('/notifications')
}

function isOnProfilePage() {
  let profilePathUsername = currentPath.match(URL_PROFILE_RE)?.[1]
  if (!profilePathUsername) return false
  // twitter.com/user and its sub-URLs put @user in the title
  return currentPage.toLowerCase().includes(`${ltr ? '@' : ''}${profilePathUsername.toLowerCase()}${!ltr ? '@' : ''}`)
}

function isOnQuoteTweetsPage() {
  return currentPath.match(URL_TWEET_INTERACTIONS_RE)?.[1] == 'quotes'
}

function isOnSearchPage() {
  return currentPath.startsWith('/search') || currentPath.startsWith('/hashtag/')
}

function isOnSeparatedTweetsTimeline() {
  return currentPage == separatedTweetsTimelineTitle
}

function isOnSettingsPage() {
  return currentPath.startsWith('/settings')
}

function shouldHideSidebar() {
  return isOnExplorePage() || isOnDiscoverCommunitiesPage()
}

function shouldShowSeparatedTweetsTab() {
  return config.retweets == 'separate' || config.quoteTweets == 'separate'
}
//#endregion

//#region Utility functions
function addStyle(css = '') {
  let $style = document.createElement('style')
  if (css) {
    $style.textContent = css
  }
  document.head.appendChild($style)
  return $style
}

/**
 * @param {Element} $svg
 */
function blueCheck($svg) {
  if (!$svg) {
    warn('blueCheck was given', $svg)
    return
  }
  $svg.classList.add('cpft_blue_check')
  // Safari doesn't support using `d: path(…)` to replace paths in an SVG, so
  // we have to manually patch the path in it.
  if (isSafari && config.twitterBlueChecks == 'replace') {
    $svg.firstElementChild.firstElementChild.setAttribute('d', Svgs.BLUE_LOGO_PATH)
  }
}

/**
 * @param {Element} $svgPath
 */
function twitterLogo($svgPath) {
  // Safari doesn't support using `d: path(…)` to replace paths in an SVG, so
  // we have to manually patch the path in it.
  $svgPath.setAttribute('d', Svgs.TWITTER_LOGO_PATH)
  $svgPath.classList.add('cpft_logo')
}

/**
 * @param {Element} $svgPath
 */
function homeIcon($svgPath) {
  // Safari doesn't support using `d: path(…)` to replace paths in an SVG, so
  // we have to manually patch the path in it.
  let replacementPath = {
    [Svgs.X_HOME_ACTIVE_PATH]: Svgs.TWITTER_HOME_ACTIVE_PATH,
    [Svgs.X_HOME_INACTIVE_PATH]: Svgs.TWITTER_HOME_INACTIVE_PATH,
  }[$svgPath.getAttribute('d')]
  if (replacementPath) {
    $svgPath.setAttribute('d', replacementPath)
  }
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

/**
 * @param {string} selector
 * @param {{
 *   name?: string
 *   stopIf?: () => boolean
 *   timeout?: number
 *   context?: Document | HTMLElement
 * }?} options
 * @returns {Promise<HTMLElement | null>}
 */
function getElement(selector, {
  name = null,
  stopIf = null,
  timeout = Infinity,
  context = document,
} = {}) {
  return new Promise((resolve) => {
    let startTime = Date.now()
    let rafId
    let timeoutId

    function stop($element, reason) {
      if ($element == null) {
        warn(`stopped waiting for ${name || selector} after ${reason}`)
      }
      else if (Date.now() > startTime) {
        log(`${name || selector} appeared after ${Date.now() - startTime}ms`)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      resolve($element)
    }

    if (timeout !== Infinity) {
      timeoutId = setTimeout(stop, timeout, null, `${timeout}ms timeout`)
    }

    function queryElement() {
      let $element = context.querySelector(selector)
      if ($element) {
        stop($element)
      }
      else if (stopIf?.() === true) {
        stop(null, 'stopIf condition met')
      }
      else {
        rafId = requestAnimationFrame(queryElement)
      }
    }

    queryElement()
  })
}

function getTopLevelProps() {
  let wrapped = $reactRoot.firstElementChild['wrappedJSObject'] || $reactRoot.firstElementChild
  let reactPropsKey = Object.keys(wrapped).find(key => key.startsWith('__reactProps'))
  if (reactPropsKey) {
    return wrapped[reactPropsKey].children?.props?.children?.props
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

function hasNewLayout() {
  return getState()?.featureSwitch?.user?.config?.rweb_sourcemap_migration?.value
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

function getUserScreenName() {
  let state = getState()
  return state?.entities?.users?.entities?.[state?.session?.user_id]?.screen_name
}

function getThemeColorFromState() {
  let localState = getState().settings?.local
  let color = localState?.themeColor
  let highContrast = localState?.highContrastEnabled
  $body.classList.toggle('HighContrast', highContrast)
  if (color) {
    if (THEME_COLORS.has(color)) {
      let colors = THEME_COLORS
      if (highContrast) colors = getColorScheme() == 'Default' ? HIGH_CONTRAST_LIGHT : HIGH_CONTRAST_DARK
      return colors.get(color)
    }
    warn(color, 'not found in THEME_COLORS')
  } else {
    warn('could not get settings.local.themeColor from React state')
  }
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

/**
 * @param {*} value
 * @returns {value is string}
 */
function isString(value) {
  return Object.getPrototypeOf(value) === String.prototype
}

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

let logObserverDisconnects = true

/**
 * Convenience wrapper for the MutationObserver API:
 * - Observers have associated names
 * - Optional leading call for callback
 * - Observers are stored in a scope map
 * - Observers already in the given scope will be disconnected
 * - MutationObserver options default to `{childList: true}`
 * @param {Node} $target
 * @param {MutationCallback} callback
 * @param {string | {
 *   leading?: boolean
 *   logElement?: boolean
 *   name: string
 *   observers: Map<string, import("./types").Disconnectable>
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

  let {leading, logElement, name, observers} = nameOrOptions

  let observer = Object.assign(new MutationObserver(callback), {name})
  let disconnect = observer.disconnect.bind(observer)
  let disconnected = false
  observer.disconnect = () => {
    if (disconnected) return
    disconnected = true
    disconnect()
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
  return () => path != currentPath
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
function s(n) {
  return n == 1 ? '' : 's'
}

/**
 * @param {Element} $tweetButtonText
 */
function setTweetButtonText($tweetButtonText) {
  let currentText = $tweetButtonText.textContent
  if (currentText == getString('TWEET') || currentText == getString('TWEET_ALL')) return
  $tweetButtonText.textContent = currentText == getString('POST_ALL') ? getString('TWEET_ALL') : getString('TWEET')
}

function storeConfigChanges(changes) {
  window.postMessage({type: 'cpftConfigChange', changes})
}
//#endregion

//#region Global observers
/**
 * When the "Background" setting is changed, <body>'s backgroundColor is changed
 * and the app is re-rendered, so we need to re-process the current page.
 */
function observeBodyBackgroundColor() {
  let lastBackgroundColor = null

  observeElement($body, () => {
    let backgroundColor = $body.style.backgroundColor
    if (backgroundColor == lastBackgroundColor) return

    $body.classList.toggle('Default', backgroundColor == 'rgb(255, 255, 255)')
    $body.classList.toggle('Dim', backgroundColor == 'rgb(21, 32, 43)')
    $body.classList.toggle('LightsOut', backgroundColor == 'rgb(0, 0, 0)')

    if (lastBackgroundColor != null) {
      log('Background setting changed - re-processing current page')
      observePopups()
      observeSideNavTweetButton()
      processCurrentPage()
    }
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

/**
 * @param {HTMLElement} $popup
 */
async function observeDesktopComposeTweetModal($popup) {
  $popup.classList.add('ComposeTweetModal')
  if (!config.replaceLogo) return

  let $mask = await getElement('[data-testid="twc-cc-mask"]', {
    context: $popup,
    name: 'Compose Tweet modal mask',
    stopIf: () => !isDesktopComposeTweetModalOpen
  })
  if (!$mask) return

  let $tweetButtonText = $popup.querySelector('button[data-testid="tweetButton"] span > span')
  if ($tweetButtonText) {
    setTweetButtonText($tweetButtonText)
  }

  observeElement($mask.nextElementSibling, () => {
    let $editorRoots = $popup.querySelectorAll('.DraftEditor-root')
    $editorRoots.forEach((/** @type {HTMLElement} */ $editorRoot, index) => {
      $editorRoot.setAttribute('data-placeholder', getString(index == 0 ? 'WHATS_HAPPENING' : 'ADD_ANOTHER_TWEET'))
      observeDesktopTweetEditorPlaceholder($editorRoot, {
        name: 'Modal Tweet editor root (for placeholder)',
        observers: modalObservers,
      })
    })
  }, {
    name: 'Compose Tweet modal Tweets container (for Tweets being added or removed)',
    observers: modalObservers,
  })

  // The Tweet button gets moved around when Tweets are added or removed
  observeElement($mask.nextElementSibling, (mutations) => {
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
  let $container = await getElement('div[data-testid="primaryColumn"] > div', {
    name: 'Home timeline Tweet box container',
    stopIf: pageIsNot(currentPage),
  })
  if (!$container) return

  /**
   * @param {HTMLElement} $tweetBox
   */
  async function observeTweetBox($tweetBox) {
    $tweetBox.classList.add('TweetBox')

    if (config.replaceLogo) {
      // Restore "What's happening?" placeholder
      let $editorRoot = await getElement('.DraftEditor-root', {
        context: $tweetBox,
        name: 'Tweet box editor root',
        stopIf: pageIsNot(currentPage),
      })
      if (!$editorRoot) return
      observeDesktopTweetEditorPlaceholder($editorRoot, {
        name: 'Tweet editor root (for placeholder)',
        observers: pageObservers,
        placeholder: getString('WHATS_HAPPENING'),
      })
      tweakTweetButton()
    }
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
          pageObservers.get('Tweet box editor root')?.disconnect()
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
  // Media modals remember if they were previously collapsed, so we could be
  // waiting for the initial timeline to be either rendered or expanded.
  let $initialTimeline = await getElement(Selectors.MODAL_TIMELINE, {
    context: $popup,
    name: 'initial modal timeline',
    stopIf: () => !isDesktopMediaModalOpen,
  })

  if ($initialTimeline == null) return

  /**
   * @param {HTMLElement} $timeline
   */
  function observeModalTimelineItems($timeline) {
    let seen = new Map()
    observeElement($timeline, () => {
      onIndividualTweetTimelineChange($timeline, {observers: modalObservers, seen})
    }, {
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
            onIndividualTweetTimelineChange($newTimeline, {observers: modalObservers, seen})
          }, {
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
        stopIf: () => !isDesktopMediaModalOpen,
      })
      if ($timeline == null) return
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
      name: 'shortcut icon'
    }))

    observeElement($shortcutIcon, () => {
      let href = $shortcutIcon.href
      if (config.replaceLogo) {
        // Once we replace the favicon, Twitter stops updating it when
        // notification status changes, so this only handles initial switchover
        // to the Twitter version of the icon.
        if (href.startsWith('data:')) return
        let icon = config.hideNotifications != 'ignore' && href.includes('-pip') ? (
          Images.TWITTER_PIP_FAVICON
        ) : (
          // Make ths initial icon URL different so forceUpdate() replaces it
          Images.TWITTER_FAVICON + '?init'
        )
        $shortcutIcon.href = icon
      } else {
        // If we're hiding notifications, detect when Twitter tries to use the
        // pip version and switch back.
        if (config.hideNotifications != 'ignore' && href.includes('-pip')) {
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
    if (config.replaceLogo) {
      href = config.hideNotifications == 'ignore' && showPip ? (
        Images.TWITTER_PIP_FAVICON
      ) : (
        Images.TWITTER_FAVICON
      )
    } else {
      href = `//abs.twimg.com/favicons/twitter${
        config.hideNotifications == 'ignore' && showPip ? '-pip' : ''
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
const observePopups = (() => {
  /** @type {MutationObserver} */
  let popupObserver
  /** @type {WeakMap<HTMLElement, {disconnect()}>} */
  let nestedObservers = new WeakMap()

  return async function observePopups() {
    let $layers = await getElement('#layers', {
      name: 'layers',
    })

    observeElement($layers, (mutations) => {
      for (let mutation of mutations) {
        for (let $addedNode of mutation.addedNodes) {
          if (!($addedNode instanceof HTMLElement)) continue
          let nestedObserver = onPopup($addedNode)
          if (nestedObserver) {
            nestedObservers.set($addedNode, nestedObserver)
          }
        }
        for (let $removedNode of mutation.removedNodes) {
          if (!($removedNode instanceof HTMLElement)) continue
          if (nestedObservers.has($removedNode)) {
            nestedObservers.get($removedNode).disconnect()
            nestedObservers.delete($removedNode)
          }
        }
      }
    }, {
      name: 'popup container',
      observers: globalObservers,
    })
  }
})()

async function observeTitle() {
  let $title = await getElement('title', {name: '<title>'})
  observeElement($title, () => {
    let title = $title.textContent
    if (title.match(/^Intervention for (X|Twitter)$/)) {
      log('Ignoring one sec extension title')
      return
    }
    if (config.replaceLogo && (ltr ? /X$/ : /^(?:\(\d+\+?\) )?X/).test(title)) {
      title = title.replace(ltr ? /X$/ : 'X', getString('TWITTER'))
    }
    if (config.hideNotifications != 'ignore' && TITLE_NOTIFICATION_RE.test(title)) {
      hiddenNotificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
      title = title.replace(TITLE_NOTIFICATION_RE, '')
    }
    if (title != $title.textContent) {
      document.title = title
      // If Twitter is opened in the background, changing the title might not
      // re-fire the title MutationObserver, preventing the initial page from
      // being processed.
      if (!currentPage) {
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
//#endregion

//#region Page observers
async function observeSidebar() {
  let $primaryColumn = await getElement(Selectors.PRIMARY_COLUMN, {name: 'primary column'})
  let $sidebarContainer = $primaryColumn.parentElement
  observeElement($sidebarContainer, () => {
    let $sidebar = /** @type {HTMLElement} */ ($sidebarContainer.querySelector(Selectors.SIDEBAR))
    log(`sidebar ${$sidebar ? 'appeared' : 'disappeared'}`)
    $body.classList.toggle('Sidebar', Boolean($sidebar))
    if (!$sidebar) {
      if (!config.hideSidebarContent) {
        pageObservers.get('sidebar contents (for Live on X loading)')?.disconnect()
        pageObservers.get("sidebar What's happening timeline")?.disconnect()
      }
      return
    }
    // Process blue checks in the sidebar search dropdown
    if (config.twitterBlueChecks != 'ignore' && !isOnSearchPage() && !isOnExplorePage()) {
      observeSearchForm()
    }
    // Process blue checks in the sidebar user box
    if (!config.hideSidebarContent || config.showRelevantPeople && isOnIndividualTweetPage()) {
      void async function() {
        // Avoid false positive from Premium upsells in the sidebar
        let $aside = await getElement('aside[role="complementary"]:not(:has(a[href^="/i/premium"]))', {
          name: 'sidebar aside box',
          context: $sidebar,
          stopIf: pageIsNot(currentPage),
          timeout: 2000,
        })
        if (!$aside) return
        if (config.twitterBlueChecks != 'ignore') processBlueChecks($aside)
        let $container = $aside.parentElement
        while (!$container.nextElementSibling) $container = $container.parentElement
        $container.classList.toggle(
          'SuggestedFollows',
          config.hideSuggestedFollows && !(config.showRelevantPeople && isOnIndividualTweetPage())
        )
      }()
    }
    if (!config.hideSidebarContent && !isOnExplorePage()) {
      // Hide the ad in sidebar What's happening
      void async function() {
        // What's happening has a unique DOM structure we can look for
        let $whatsHappeningTimeline = await getElement('section > div[aria-label] > div', {
          name: "sidebar What's happening timeline",
          context: $sidebar,
          stopIf: pageIsNot(currentPage),
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
        if (config.hideWhatsHappening) $whatsHappeningTimeline.closest('section').parentElement.classList.add('WhatsHappening')
      }()
    }
    if (!config.hideSidebarContent) {
      // Observe the Live on X section
      void async function() {
        /**
         * @param {HTMLElement} $liveOnX
         * @param {HTMLElement} $heading
         */
        function handleLiveOnX($liveOnX, $heading) {
          $liveOnX.classList.add('LiveBroadcasts')
          if (config.twitterBlueChecks != 'ignore') {
            // XXX This is sometimes too early, observe changes for them appearing?
            processBlueChecks($liveOnX)
          }
          let branding = $heading.getAttribute('data-branding') || 'x'
          if (config.replaceLogo ? branding == 'x' : branding == 'twitter') {
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
        let $sidebarContents = await getElement(`div[aria-label] > div${isOnHomeTimelinePage() ? ' > div' : ''}`, {
          context: $sidebar,
          name: 'sidebar contents',
        })
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

const observeSideNavTweetButton = (() => {
  /** @type {MutationObserver} */
  let observer

  return async function observeSideNavTweetButton() {
    if (observer) {
      observer.disconnect()
      observer = null
    }

    if (!desktop || !config.replaceLogo) return

    // This element is updated when text is added or removed on resize
    let $buttonTextContainer = await getElement('a[data-testid="SideNav_NewTweet_Button"] > div > span', {
      name: 'sidenav tweet button text container',
    })
    observer = observeElement($buttonTextContainer, () => {
      if ($buttonTextContainer.childElementCount > 0) {
        let $buttonText = /** @type {HTMLElement} */ ($buttonTextContainer.querySelector('span > span'))
        if ($buttonText) {
          setTweetButtonText($buttonText)
        } else {
          warn('could not find tweet button text')
        }
      }
    }, {
      leading: true,
      name: 'sidenav tweet button',
      observers: globalObservers,
    })
  }
})()

async function observeSearchForm() {
  let $searchForm = await getElement('form[role="search"]', {
    name: 'search form',
    stopIf: pageIsNot(currentPage),
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
    stopIf: pageIsNot(page),
  })

  if ($timeline == null) return

  /**
   * @param {HTMLElement} $timeline
   */
  function observeTimelineItems($timeline) {
    observeElement($timeline, () => {
      onTimelineChange($timeline, page, options)
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
            observeElement($newTimeline, () => {
              onTimelineChange($newTimeline, page, options)
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
          stopIf: pageIsNot(page),
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
    stopIf: pageIsNot(page),
  })

  if ($timeline == null) return

  /**
   * @param {HTMLElement} $timeline
   */
  function observeTimelineItems($timeline) {
    let seen = new WeakMap()
    observeElement($timeline, () => {
      onIndividualTweetTimelineChange($timeline, {observers: pageObservers, seen})
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
//#endregion

//#region Tweak functions
/**
 * Add an "Add muted word" menu item after the given link which takes you
 * straight to entering a new muted word (by clicking its way through all the
 * individual screens!).
 * @param {HTMLElement} $link
 * @param {string} linkSelector
 */
async function addAddMutedWordMenuItem($link, linkSelector) {
  log('adding "Add muted word" menu item')

  // Wait for the dropdown to appear on desktop
  if (desktop) {
    $link = await getElement(`#layers div[data-testid="Dropdown"] ${linkSelector}`, {
      name: 'rendered menu item',
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
    addMutedWord()
  })
  $link.parentElement.insertAdjacentElement('beforebegin', $addMutedWord)
}

function addCaretMenuListenerForQuoteTweet($tweet) {
  let $caret = /** @type {HTMLElement} */ ($tweet.querySelector('[data-testid="caret"]'))
  if ($caret && !$caret.dataset.tweakNewTwitterListener) {
    $caret.addEventListener('click', () => {
      quotedTweet = getQuotedTweetDetails($tweet, {getText: true})
    })
    $caret.dataset.tweakNewTwitterListener = 'true'
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
      timeout: 100,
    })
    if (!$blockMenuItem) return
  }

  let $muteQuotes = /** @type {HTMLElement} */ ($blockMenuItem.previousElementSibling.cloneNode(true))
  $muteQuotes.classList.add('cpft_menu_item')
  $muteQuotes.querySelector('span').textContent = getString('MUTE_THIS_CONVERSATION')
  $muteQuotes.addEventListener('click', (e) => {
    e.preventDefault()
    log('mutableQuoteTweets: muting quotes of a tweet', quotedTweet)
    config.mutedQuotes = config.mutedQuotes.concat(quotedTweet)
    storeConfigChanges({mutedQuotes: config.mutedQuotes})
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
      if (config.hideQuotesFrom.includes(quotedTweet.quotedBy)) {
        config.hideQuotesFrom = config.hideQuotesFrom.filter(user => user != quotedTweet.quotedBy)
      } else {
        config.hideQuotesFrom = config.hideQuotesFrom.concat(quotedTweet.quotedBy)
      }
      storeConfigChanges({hideQuotesFrom: config.hideQuotesFrom})
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

async function addMutedWord() {
  if (!document.querySelector('a[href="/settings')) {
    let $settingsAndSupport = /** @type {HTMLElement} */ (document.querySelector('[data-testid="settingsAndSupport"]'))
    $settingsAndSupport?.click()
  }

  for (let path of [
    '/settings',
    '/settings/privacy_and_safety',
    '/settings/mute_and_block',
    '/settings/muted_keywords',
    '/settings/add_muted_keyword',
  ]) {
    let $link = await getElement(`a[href="${path}"]`, {timeout: 500})
    if (!$link) return
    $link.click()
  }
  let $input = await getElement('input[name="keyword"]')
  setTimeout(() => $input.focus(), 100)
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
  $toggleRetweets.querySelector('span').textContent = getString(`TURN_${config.listRetweets == 'ignore' ? 'OFF' : 'ON'}_RETWEETS`)
  $toggleRetweets.querySelector('svg').innerHTML = config.listRetweets == 'ignore' ? Svgs.RETWEETS_OFF : Svgs.RETWEET
  // Remove subtitle if the cloned menu item has one
  $toggleRetweets.querySelector('div[dir] + div[dir]')?.remove()
  $toggleRetweets.addEventListener('click', (e) => {
    e.preventDefault()
    log('toggling list retweets')
    config.listRetweets = config.listRetweets == 'ignore' ? 'hide' : 'ignore'
    storeConfigChanges({listRetweets: config.listRetweets})
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
function checkforDisabledHomeTimeline() {
  if (config.disableHomeTimeline && location.pathname == PagePaths.HOME) {
    log(`Home timeline disabled, redirecting to /${config.disabledHomeTimelineRedirect}`)
    let primaryNavSelector = desktop ? Selectors.PRIMARY_NAV_DESKTOP : Selectors.PRIMARY_NAV_MOBILE
    void (async () => {
      let $navLink = await getElement(`${primaryNavSelector} a[href="/${config.disabledHomeTimelineRedirect}"]`, {
        name: `${config.disabledHomeTimelineRedirect} nav link`,
        stopIf: () => location.pathname != PagePaths.HOME,
      })
      if (!$navLink) return
      $navLink.click()
    })()
    return true
  }
}

function checkReactNativeStylesheet() {
  let $style = /** @type {HTMLStyleElement} */ (document.querySelector('style#react-native-stylesheet'))
  if (!$style) {
    warn('React Native stylesheet not found')
    return
  }

  let lastRulesCount = null
  let startTime = Date.now()

  function findRules() {
    for (let rule of $style.sheet.cssRules) {
      if (!(rule instanceof CSSStyleRule)) continue

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
    }

    let elapsedTime = new Intl.NumberFormat(undefined).format(Date.now() - startTime)
    if (fontFamilyRule == null || filterBlurRule == null) {
      // Stop checking when there are no new rules since the last check
      if (lastRulesCount != $style.sheet.cssRules.length) {
        lastRulesCount = $style.sheet.cssRules.length
        log(`waiting for more React Native stylesheet rules (${lastRulesCount})`)
        setTimeout(findRules, 100)
      } else {
        warn(`stopped waiting for new React Native stylesheet rules after ${elapsedTime}ms (${lastRulesCount} rules)`)
      }
    } else {
      log(`finished checking React Native stylesheet in ${elapsedTime}ms (${lastRulesCount} rules)`)
    }
  }

  findRules()
}

//#region CSS
const configureCss = (() => {
  let $style

  return function configureCss() {
    if (!config.enabled) {
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
        color: var(--color);
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
        --border-color: rgb(239, 243, 244);
        --color: rgb(83, 100, 113);
        --color-emphasis: rgb(15, 20, 25);
        --hover-bg-color: rgb(247, 249, 249);
      }
      body.Dim {
        --border-color: rgb(56, 68, 77);
        --color: rgb(139, 152, 165);
        --color-emphasis: rgb(247, 249, 249);
        --hover-bg-color: rgb(30, 39, 50);
      }
      body.LightsOut {
        --border-color: rgb(47, 51, 54);
        --color: rgb(113, 118, 123);
        --color-emphasis: rgb(247, 249, 249);
        --hover-bg-color: rgb(22, 24, 28);
      }
      .cpft_menu_item:hover { background-color: var(--hover-bg-color) !important; }
    `)

    if (config.alwaysUseLatestTweets && config.hideForYouTimeline) {
      cssRules.push(`
        /* Prevent the For you tab container taking up space */
        body.HomeTimeline nav.TimelineTabs div[role="tablist"] > div:first-child {
          flex-grow: 0;
          flex-shrink: 1;
          /* New layout has margin-right on tabs */
          margin-right: 0;
        }
        /* Hide the For you tab link */
        body.HomeTimeline nav.TimelineTabs div[role="tablist"] > div:first-child > a {
          display: none;
        }
      `)
    }
    if (config.disableTweetTextFormatting) {
      cssRules.push(`
        div[data-testid="tweetText"] span {
          font-style: normal;
          font-weight: normal;
        }
      `)
    }
    if (config.dropdownMenuFontWeight) {
      cssRules.push(`
        [data-testid="${desktop ? 'Dropdown' : 'sheetDialog'}"] [role="menuitem"] [dir] {
          font-weight: normal;
        }
      `)
    }
    if (config.hideBookmarkButton) {
      // Under timeline tweets
      hideCssSelectors.push(
        'body:not(.Bookmarks) [data-testid="tweet"][tabindex="0"] [role="group"] > div:has(> button[data-testid$="ookmark"])',
      )
      if (!config.showBookmarkButtonUnderFocusedTweets) {
        // Under the focused tweet
        hideCssSelectors.push(
          '[data-testid="tweet"][tabindex="-1"] [role="group"][id^="id__"] > div:has(> button[data-testid$="ookmark"])',
        )
      }
    }
    if (!config.hideExplorePageContents) {
      hideCssSelectors.push(
        // Hide the ad at the top of Explore…
        'body.Explore [data-testid="eventHero"]',
        // …and its floating button
        'body.Explore [data-testid="eventHero"] + div',
      )
    }
    if (config.hideListsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/lists"]`)
    }
    if (config.hideBookmarksNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/bookmarks"]`)
    }
    if (config.hideCommunitiesNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/communities"]`)
    }
    if (config.hideChatNav) {
      hideCssSelectors.push(
        // Nav item
        `${menuRole} a[href$="/i/chat"]`,
        // Link in Messages
        'a[href$="/i/chat"][data-testid="pivot"]',
      )
    }
    if (config.hideShareTweetButton) {
      hideCssSelectors.push(
        // Under timeline tweets
        `[data-testid="tweet"][tabindex="0"] [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        // Under the focused tweet
        `[data-testid="tweet"][tabindex="-1"] [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
      )
    }
    if (config.hideSubscriptions) {
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
        // Monetization and Subscriptions items in Settings
        'body.Settings a[href="/settings/monetization"]',
        'body.Settings a[href="/settings/manage_subscriptions"]',
        // Subscriptions tab link in Following/Follows
        `body.ProfileFollows.Subscriptions ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:last-child > a`,
      )
      // Subscriptions tab in Following/Follows
      cssRules.push(`
        body.ProfileFollows.Subscriptions ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:last-child {
          flex: 0;
          /* New layout has margin-right on tabs */
          margin-right: 0;
        }
      `)
    }
    if (config.hideMetrics) {
      configureHideMetricsCss(cssRules, hideCssSelectors)
    }
    if (config.hideMoreTweets) {
      hideCssSelectors.push('.SuggestedContent')
    }
    if (config.hideCommunitiesNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/communities"]`)
    }
    if (config.hideGrokNav) {
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
    if (config.hideMonetizationNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/i/monetization"]`)
    }
    if (config.hideAdsNav) {
      hideCssSelectors.push(`${menuRole} a:is([href*="ads.twitter.com"], [href*="ads.x.com"])`)
    }
    if (config.hideJobsNav) {
      hideCssSelectors.push(
        // Jobs navigation item
        `${menuRole} a[href="/jobs"]`,
        // Jobs section in profiles
        '.Profile [data-testid="jobs"]',
      )
    }
    if (config.hideTweetAnalyticsLinks) {
      hideCssSelectors.push('.AnalyticsButton')
    }
    if (config.hideTwitterBlueUpsells) {
      hideCssSelectors.push(
        // Manually-tagged upsells
        '.PremiumUpsell',
        // Premium/Verified menu items
        `${menuRole} a:is([href^="/i/premium"], [href^="/i/verified"])`,
        // In new More dialog
        `${Selectors.MORE_DIALOG} a:is([href^="/i/premium"], [href^="/i/verified"])`,
        // Analytics menu item
        `${menuRole} a[href="/i/account_analytics"]`,
        // "Highlight on your profile" on your tweets
        '[role="menuitem"][data-testid="highlightUpsell"]',
        // "Edit" upsell on recent tweets
        '[role="menuitem"][data-testid="editWithPremium"]',
        // Premium item in Settings
        'body.Settings a[href^="/i/premium"]',
        // Misc upsells in your own profile
        `.OwnProfile ${Selectors.PRIMARY_COLUMN} a[href^="/i/premium"]`,
        // Unlock Analytics button in your own profile
        '.OwnProfile [data-testid="analytics-preview"]',
        // Button in Communities header
        `body.Communities ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} a:is([href^="/i/premium"], [href^="/i/verified"])`,
        // "This profile is verified" upsell
        '[data-testid="verified_profile_upsell"]',
        // Get Premium Analytics upsell
        '[data-testid="profileAnalyticsUpsell"]',
        // Upsell in Lists sidebar
        '[data-testid="super-upsell-UpsellCardRenderProperties"]',
        // "you aren't verified yet" in Premium user profile
        '[data-testid="verified_profile_visitor_upsell"]',
        // "Upgrade to Premium+ to write longer posts" in Tweet composer
        `${mobile ? 'body.ComposeTweetPage' : ':is(.ComposeTweetModal, .TweetBox)'} [aria-live="polite"][role="status"]:has(a[href="/i/premium_sign_up?referring_page=post-composer"])`,
      )
      // Hide Highlights and Articles tabs in your own profile if you don't have Premium
      let profileTabsList = `body.OwnProfile:not(.PremiumProfile) ${Selectors.PRIMARY_COLUMN} nav div[role="tablist"]`
      let upsellTabLinks = 'a:is([href$="/highlights"], [href$="/articles"], [href$="/highlights?mx=1"], [href$="/articles?mx=1"])'
      cssRules.push(`
        ${profileTabsList} > div:has(> ${upsellTabLinks}) {
          flex: 0;
          /* New layout has margin-right on tabs */
          margin-right: 0;
        }
        ${profileTabsList} > div > ${upsellTabLinks} {
          display: none;
        }
      `)
      // Hide upsell on the Likes tab in your own profile
      cssRules.push(`
        body.OwnProfile ${Selectors.PRIMARY_COLUMN} nav + div:has(a[href^="/i/premium"]) {
          display: none;
        }
      `)
    }
    if (config.hideVerifiedNotificationsTab) {
      cssRules.push(`
        body.Notifications ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(2),
        body.ProfileFollows ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(1) {
          flex: 0;
          /* New layout has margin-right on tabs */
          margin-right: 0;
        }
        body.Notifications ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(2) > a,
        body.ProfileFollows ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(1) > a {
          display: none;
        }
      `)
    }
    if (config.hideViews) {
      // "Views" under the focused tweet
      hideCssSelectors.push('.Views')
    }
    if (config.hideWhoToFollowEtc) {
      hideCssSelectors.push(`body.Profile ${Selectors.PRIMARY_COLUMN} aside[role="complementary"]`)
    }
    if (config.reducedInteractionMode) {
      hideCssSelectors.push(
        '[data-testid="tweet"] [role="group"]',
        'body.Tweet [data-testid="tweet"] + div > div [role="group"]',
      )
    }
    if (config.restoreLinkHeadlines) {
      cssRules.push(`
        .cpft_link_headline[hidden] {
          display: block;
          border-top: 1px solid var(--border-color);
          padding: 14px;
        }
      `)
      hideCssSelectors.push(
        // Existing headline overlaid on the card
        '.cpft_overlay_headline',
        // From <domain> link after the card
        'div[data-testid="card.wrapper"] + a',
      )
    }
    if (config.restoreQuoteTweetsLink || config.restoreOtherInteractionLinks) {
      cssRules.push(`
        #cpftInteractionLinks[hidden] {
          display: block;
        }
        #cpftInteractionLinks a {
          text-decoration: none;
          color: var(--color);
        }
        #cpftInteractionLinks a:hover span:last-child {
          text-decoration: underline;
        }
        #cpftQuoteTweetCount, #cpftRetweetCount, #cpftLikeCount {
          margin-right: 2px;
          font-weight: 700;
          color: var(--color-emphasis);
        }
        /* Replaces the "View post engagements" link under your own tweets */
        .AnalyticsButton {
          display: none;
        }
      `)
    }
    if (!config.restoreQuoteTweetsLink) {
      hideCssSelectors.push('#cpftQuoteTweetsLink')
    }
    if (!config.restoreOtherInteractionLinks) {
      hideCssSelectors.push('#cpftRetweetsLink', '#cpftLikesLink')
    }
    if (config.restoreTweetSource) {
      cssRules.push('.TweetSource[hidden] { display: inline; }')
    }
    if (config.tweakQuoteTweetsPage) {
      // Hide the quoted tweet, which is repeated in every quote tweet
      hideCssSelectors.push('body.QuoteTweets [data-testid="tweet"] [aria-labelledby] > div:last-child')
    }
    if (config.twitterBlueChecks == 'hide') {
      hideCssSelectors.push('.cpft_blue_check')
    }
    if (config.twitterBlueChecks == 'replace') {
      cssRules.push(`
        :is(${Selectors.VERIFIED_TICK}, svg[data-testid="verificationBadge"]).cpft_blue_check path {
          d: path("${Svgs.BLUE_LOGO_PATH}");
        }
      `)
    }

    if (shouldShowSeparatedTweetsTab()) {
      if (hasNewLayout()) {
        // The new layout only has colour to distinguish the active tab
        cssRules.push(`
          body:not(.SeparatedTweets) #cpftSeparatedTweetsTab > a > div > div,
          body.HomeTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#cpftSeparatedTweetsTab) > a > div > div {
            color: var(--color) !important;
          }
          body.SeparatedTweets #cpftSeparatedTweetsTab > a > div > div {
            color: var(--color-emphasis) !important;
          }
          body.Desktop #cpftSeparatedTweetsTab:hover > a > div > div {
            color: var(--color-emphasis) !important;
          }
        `)
      } else {
        cssRules.push(`
          body.Default {
            --tab-hover: rgba(15, 20, 25, 0.1);
          }
          body.Dim {
            --tab-hover: rgba(247, 249, 249, 0.1);
          }
          body.LightsOut {
            --tab-hover: rgba(231, 233, 234, 0.1);
          }
          body.Desktop #cpftSeparatedTweetsTab:hover,
          body.Mobile:not(.SeparatedTweets) #cpftSeparatedTweetsTab:hover,
          body.Mobile #cpftSeparatedTweetsTab:active {
            background-color: var(--tab-hover);
          }
          body:not(.SeparatedTweets) #cpftSeparatedTweetsTab > a > div > div,
          body.HomeTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#cpftSeparatedTweetsTab) > a > div > div {
            font-weight: normal !important;
            color: var(--color) !important;
          }
          body.SeparatedTweets #cpftSeparatedTweetsTab > a > div > div {
            font-weight: bold;
            color: var(--color-emphasis); !important;
          }
          body:not(.SeparatedTweets) #cpftSeparatedTweetsTab > a > div > div > div,
          body.HomeTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#cpftSeparatedTweetsTab) > a > div > div > div {
            height: 0 !important;
          }
          body.SeparatedTweets #cpftSeparatedTweetsTab > a > div > div > div {
            height: 4px !important;
            min-width: 56px;
            width: 100%;
            position: absolute;
            bottom: 0;
            border-radius: 9999px;
          }
        `)
      }
    }

    if (hasNewLayout() && config.tweakNewLayout) {
      cssRules.push(`
        /* Make the image button first in the Tweet editor toolbar again */
        [data-testid="toolBar"] [role="tablist"] > [role="presentation"] {
          order: 1;
        }
        [data-testid="toolBar"] [role="tablist"] > [role="presentation"]:has(input[data-testid="fileInput"]) {
          order: 0;
        }
      `)
      if (config.replaceLogo) {
        cssRules.push(`
          /* Add theme colour back to Tweet editor toolbar buttons */
          [data-testid="toolBar"] [role="tablist"] > [role="presentation"] svg {
            fill: var(--theme-color);
          }
        `)
      }
    }

    //#region Desktop-only
    if (desktop) {
      if (hasNewLayout() && config.tweakNewLayout) {
        cssRules.push(`
          /* Realign nav items to the top */
          header[role="banner"] > div > div > div {
            justify-content: flex-start;
          }
          /* Restore size and constrast of main nav icons and More button */
          ${Selectors.PRIMARY_NAV_DESKTOP} > :is(a, button) svg {
            width: 1.75rem !important;
            height: 1.75rem !important;
            fill: var(--color-emphasis) !important;
          }
          /* Restore contrast of main nav text when expanded */
          ${Selectors.PRIMARY_NAV_DESKTOP} > :is(a, button) div[dir]:not([aria-live]) {
            color: var(--color-emphasis) !important;
          }
          /* Give other nav button icons more contrast too */
          header[role="banner"] button svg {
            fill: var(--color-emphasis) !important;
          }
          /* Make the Tweet button larger */
          [data-testid="SideNav_NewTweet_Button"] {
            min-width: 49px;
            min-height: 49px;
          }
          /* Move the account switcher back to the bottom */
          header[role="banner"] > div > div > div > div:last-child {
            flex: 1;
            justify-content: space-between;
          }
          /* Restore primary column borders */
          header[role="banner"] > div > div > div  {
            border-right: 1px solid var(--border-color);
          }
          ${Selectors.PRIMARY_COLUMN} {
            border-right: 1px solid var(--border-color);
          }
          /* Left-align main contents and stop it taking up all available space */
          main {
            align-items: flex-start !important;
            flex-grow: 0 !important;
          }
          /* Remove the gap between main contents and sidebar */
          main > div > div > div {
            justify-content: normal !important;
          }
          /* Restore the sidebar to its old width */
          ${Selectors.SIDEBAR},
          ${Selectors.SIDEBAR} > div > div,
          body.HomeTimeline ${Selectors.SIDEBAR_WRAPPERS} > div > div:first-child,
          ${Selectors.SIDEBAR_WRAPPERS} > div:first-child {
            width: 350px !important;
          }
          /* Center content */
          div[data-at-shortcutkeys] {
            justify-content: center;
          }
        `)
        if (config.replaceLogo) {
          // TODO Manually patch Tweet button SVG in Safari
          cssRules.push(`
            /* Restore theme colour in nav item pips */
            ${Selectors.PRIMARY_NAV_DESKTOP} > :is(a[href^="/notifications"], a[href="/messages"]) div[aria-live],
            ${Selectors.MORE_DIALOG} :is(a[href^="/notifications"], a[href="/messages"]) div[aria-live],
            /* Restore theme colour in profile switcher other accounts have notifications pip */
            button[data-testid="SideNav_AccountSwitcher_Button"] > div > div[aria-label],
            /* Restore theme colour in account switcher notifications pips */
            [data-testid="HoverCard"] button[data-testid="UserCell"] div[aria-live] {
              background-color: var(--theme-color);
            }
            /* Replace the plus icon in the Tweet button with the feather */
            [data-testid="SideNav_NewTweet_Button"] path[d="${Svgs.PLUS_PATH}"] {
              d: path("${Svgs.TWITTER_FEATHER_PLUS_PATH}");
            }
          `)
        }
      }
      if (hasNewLayout() && config.hideToggleNavigation) {
        hideCssSelectors.push('header[role="banner"] > div > div > div > div:first-child > button')
      }
      if (config.navDensity == 'comfortable' || config.navDensity == 'compact') {
        cssRules.push(`
          header nav > a,
          header nav > div[data-testid="AppTabBar_More_Menu"] {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
        `)
      }
      if (config.navDensity == 'compact') {
        cssRules.push(`
          header nav > a > div,
          header nav > div[data-testid="AppTabBar_More_Menu"] > div {
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        `)
      }
      if (config.hideSeeNewTweets) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.PRIMARY_COLUMN} > div > div:first-child > div[style^="transform"]`)
      }
      if (config.hideTimelineTweetBox) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.PRIMARY_COLUMN} .TweetBox`)
      }
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/home"]`)
      }
      if (config.hideNotifications != 'ignore') {
        // Hide notification badges and indicators
        hideCssSelectors.push(
          // Notifications & Messages in primary nav
          `${Selectors.PRIMARY_NAV_DESKTOP} > :is(a[href^="/notifications"], a[href="/messages"]) div[aria-live]`,
          // Notifications & Messages in the More dialog in the new layout
          `${Selectors.MORE_DIALOG} :is(a[href^="/notifications"], a[href="/messages"]) div[aria-live]`,
          // Account switcher
          'button[data-testid="SideNav_AccountSwitcher_Button"] > div > div[aria-label]',
          // Account switcher accounts
          '[data-testid="HoverCard"] button[data-testid="UserCell"] div[aria-live]',
          // Messages drawer title
          '[data-testid="DMDrawerHeader"] h2 svg[role="img"]'
        )
        if (config.hideNotifications == 'hide') {
          hideCssSelectors.push(
            // Nav item
            `${Selectors.PRIMARY_NAV_DESKTOP} a[href^="/notifications"]`,
            // More dialog item
            `${Selectors.MORE_DIALOG} a[href^="/notifications"]`,
          )
        }
      }
      if (config.fullWidthContent) {
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
        if (!config.fullWidthMedia) {
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
      if (config.hideAccountSwitcher) {
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
      if (config.hideExplorePageContents) {
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.DESKTOP_TIMELINE_HEADER} nav`,
          // Content
          `body.Explore ${Selectors.TIMELINE}`,
        )
      }
      if (config.hideAdsNav) {
        // In new More dialog
        hideCssSelectors.push(`${Selectors.MORE_DIALOG} a:is([href*="ads.twitter.com"], [href*="ads.x.com"])`)
      }
      if (config.hideComposeTweet) {
        hideCssSelectors.push('[data-testid="SideNav_NewTweet_Button"]')
      }
      if (config.hideGrokNav) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/i/grok"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href$="/i/grok"]`,
          // Grok drawer
          'div[data-testid="GrokDrawer"]',
        )
      }
      if (config.hideJobsNav) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_DESKTOP} a[href="/jobs"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href="/jobs"]`,
        )
      }
      if (config.hideListsNav) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/lists"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href$="/lists"]`,
        )
      }
      if (config.hideMonetizationNav) {
        // In new More dialog
        hideCssSelectors.push(`${Selectors.MORE_DIALOG} a[href$="/i/monetization"]`)
      }
      if (config.hideSpacesNav) {
        hideCssSelectors.push(
          `${menuRole} a[href="/i/spaces/start"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href="/i/spaces/start"]`,
        )
      }
      if (config.hideTwitterBlueUpsells) {
        hideCssSelectors.push(
          // Nav items
          `${Selectors.PRIMARY_NAV_DESKTOP} a:is([href^="/i/premium"], [href^="/i/verified"])`,
          // Search sidebar Radar upsell
          `body.Search ${Selectors.SIDEBAR_WRAPPERS} > div:first-child:has(a[href="/i/radar"])`,
          `body.Search ${Selectors.SIDEBAR_WRAPPERS} > div:first-child:has(a[href="/i/radar"]) + div:empty`,
          // Premium link in hovercard
          '[data-testid="HoverCard"] a[href^="/i/premium"]',
        )
      }
      if (config.hideSidebarContent) {
        // Only show the first sidebar item by default
        // Re-show subsequent non-algorithmic sections on specific pages
        cssRules.push(`
          body.HomeTimeline ${Selectors.SIDEBAR_WRAPPERS} > div > div:not(:first-of-type) {
            display: none;
          }
          ${Selectors.SIDEBAR_WRAPPERS} > div:not(:first-of-type) {
            display: none;
          }
          body.Search ${Selectors.SIDEBAR_WRAPPERS} > div:nth-of-type(2) {
            display: block;
          }
          /* Radar upsell in Search uses the first item and adds a second one for spacing */
          body.Search ${Selectors.SIDEBAR_WRAPPERS}:has(a[href="/i/radar"]) > div:first-of-type,
          body.Search ${Selectors.SIDEBAR_WRAPPERS}:has(a[href="/i/radar"]) > div:nth-of-type(2):empty {
            display: none;
          }
          body.Search ${Selectors.SIDEBAR_WRAPPERS}:has(a[href="/i/radar"]) > div:nth-of-type(3),
          body.Search ${Selectors.SIDEBAR_WRAPPERS}:has(a[href="/i/radar"]) > div:nth-of-type(4) {
            display: block;
          }
        `)
        if (config.showRelevantPeople) {
          cssRules.push(`
            body.Tweet ${Selectors.SIDEBAR_WRAPPERS} > div:is(:nth-of-type(2), :nth-of-type(3)) {
              display: block;
            }
          `)
        }
        hideCssSelectors.push(`body.HideSidebar ${Selectors.SIDEBAR}`)
      } else {
        if (config.hideLiveBroadcasts) {
          hideCssSelectors.push('.LiveBroadcasts')
        }
        if (config.hideWhatsHappening) {
          hideCssSelectors.push('.WhatsHappening')
        }
        if (config.hideSuggestedFollows) {
          hideCssSelectors.push('.SuggestedFollows')
        }
        if (config.hideTwitterBlueUpsells) {
          // Hide "Subscribe to premium" individually
          hideCssSelectors.push(
            `body.HomeTimeline ${Selectors.SIDEBAR_WRAPPERS} > div > div:nth-of-type(3)`
          )
        }
      }
      if (config.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media modal
          `[aria-modal="true"] div > div:first-of-type [role="group"] > div[style]:not([role]):not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        )
      }
      if (config.hideExploreNav) {
        // When configured, hide Explore only when the sidebar is showing, or
        // when on a page full-width content is enabled on.
        let bodySelector = `${config.hideExploreNavWithSidebar ? `body.Sidebar${config.fullWidthContent ? `:not(${FULL_WIDTH_BODY_PSEUDO})` : ''} ` : ''}`
        hideCssSelectors.push(
          `${bodySelector}${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href="/explore"]`,
        )
      }
      if (config.hideBookmarksNav) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/bookmarks"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href="/i/bookmarks"]`,
        )
      }
      if (config.hideCommunitiesNav) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/communities"]`,
          // In new More dialog
          `${Selectors.MORE_DIALOG} a[href$="/communities"]`,
        )
      }
      if (config.hideMessagesDrawer) {
        cssRules.push(`div[data-testid="DMDrawer"] { visibility: hidden; }`)
      }
      if (config.hideViews) {
        hideCssSelectors.push(
          // Under timeline tweets
          '[data-testid="tweet"][tabindex="0"] [role="group"] > div:has(> a[href$="/analytics"])',
          // In media modal
          '[aria-modal="true"] > div > div:first-of-type [role="group"] > div:has(> a[href$="/analytics"])',
        )
      }
      if (config.retweets != 'separate' && config.quoteTweets != 'separate') {
        hideCssSelectors.push('#cpftSeparatedTweetsTab')
      }
    }
    //#endregion

    //#region Mobile only
    if (mobile) {
      if (hasNewLayout() && config.tweakNewLayout) {
        cssRules.push(`
          /* Remove new padding from profile details and the tab bar (this has to be accidental) */
          body.Profile ${Selectors.PRIMARY_COLUMN} > div > div > div > div > div > div > div > div {
            padding-left: 0;
            padding-right: 0;
          }
        `)
        if (config.replaceLogo) {
          cssRules.push(`
            /* Restore theme colour in nav item pips */
            ${Selectors.PRIMARY_NAV_MOBILE} > :is(a[href^="/notifications"], a[href="/messages"]) div[aria-label],
            /* Restore theme colour in profile button other accounts have notifications pip */
            button[data-testid="DashButton_ProfileIcon_Link"] div[aria-label],
            /* Restore theme colour in account switcher notifications pips */
            [role="dialog"] [data-testid^="UserAvatar-Container"] div[dir] {
              background-color: var(--theme-color);
            }
          `)
        }
      }
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`)
      }
      if (config.hideComposeTweet) {
        hideCssSelectors.push('[data-testid="FloatingActionButtons_Tweet_Button"]')
      }
      if (config.hideNotifications != 'ignore') {
        // Hide notification badges and indicators
        hideCssSelectors.push(
          // Notifications & Messages in primary nav
          `${Selectors.PRIMARY_NAV_MOBILE} > :is(a[href^="/notifications"], a[href="/messages"]) div[aria-label]`,
          // Account switcher
          `button[data-testid="DashButton_ProfileIcon_Link"] div[aria-label]`,
          // Account switcher accounts
          '[role="dialog"] [data-testid^="UserAvatar-Container"] div[dir]',
        )
        if (config.hideNotifications == 'hide') {
          hideCssSelectors.push(
            // Nav item
            `${Selectors.PRIMARY_NAV_MOBILE} a[href^="/notifications"]`
          )
        }
      }
      if (config.hideLiveBroadcastBar) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.MOBILE_TIMELINE_HEADER} + div[style^="transform"]`)
        // Reclaim the height reserved for the bar
        cssRules.push(`
          body.HomeTimeline header[role="banner"] > div[style="height: 162px;"] {
            height: 102px !important;
          }
        `)
      }
      if (config.hideSeeNewTweets) {
        hideCssSelectors.push(`body.HomeTimeline ${Selectors.MOBILE_TIMELINE_HEADER} ~ div[style^="transform"]:last-child`)
      }
      if (config.hideExplorePageContents) {
        // Hide explore page contents so we don't get a brief flash of them
        // before automatically switching the page to search mode.
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.MOBILE_TIMELINE_HEADER} > div > div:nth-of-type(2)`,
          // Content
          `body.Explore ${Selectors.TIMELINE}`,
        )
      }
      if (config.hideGrokNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/i/grok"]`)
      }
      if (config.hideCommunitiesNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href$="/communities"]`)
      }
      if (config.hideMessagesBottomNavItem) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/messages"]`)
      }
      if (config.hideJobsNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/jobs"]`)
      }
      if (config.hideTwitterBlueUpsells) {
        hideCssSelectors.push(
          `${Selectors.PRIMARY_NAV_MOBILE} a[href^="/i/premium"]`,
          `${Selectors.MOBILE_TIMELINE_HEADER} a[href^="/i/premium"]`,
        )
      }
      if (config.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media viewer and media modal
          `body:is(.MediaViewer, .MobileMedia) [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        )
      }
      if (config.hideViews) {
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

    if (!config.enabled) {
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
      if (config.bypassAgeVerification && flag == 'rweb_age_assurance_flow_enabled') return false
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
  if (config.enabled) {
    if (config.dontUseChirpFont) {
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
  if (config.hideFollowingMetrics) {
    // User profile hover card and page metrics
    hideCssSelectors.push(
      ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/verified_followers"]) > span:first-child'
    )
    // Fix display of whitespace after hidden metrics
    cssRules.push(
      ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/verified_followers"]) { white-space: pre-line; }'
    )
  }

  if (config.hideTotalTweetsMetrics) {
    // Metrics under username header on profile pages
    hideCssSelectors.push(`
      body.Profile ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 + div[dir]
    `)
  }

  let timelineMetricSelectors = [
    config.hideReplyMetrics   && '[data-testid="reply"]',
    config.hideRetweetMetrics && '[data-testid$="retweet"]',
    config.hideLikeMetrics    && '[data-testid$="like"]',
    config.hideBookmarkMetrics && '[data-testid$="bookmark"], [data-testid$="removeBookmark"]',
  ].filter(Boolean).join(', ')

  if (timelineMetricSelectors) {
    cssRules.push(
      `[role="group"] button:is(${timelineMetricSelectors}) span { visibility: hidden; }`
    )
  }

  if (config.hideQuoteTweetMetrics) {
    hideCssSelectors.push('#cpftQuoteTweetCount')
  }
  if (config.hideRetweetMetrics) {
    hideCssSelectors.push('#cpftRetweetCount')
  }
  if (config.hideLikeMetrics) {
    hideCssSelectors.push('#cpftLikeCount')
  }
}

const configureCustomCss = (() => {
  let $style

  return function configureCustomCss() {
    if (config.customCss) {
      $style ??= addStyle('custom')
      $style.textContent = config.customCss
    } else {
      $style?.remove()
    }
  }
})()

/**
 * CSS which depends on anything we need to get from the page.
 */
const configureDynamicCss = (() => {
  let $style

  return function configureDynamicCss() {
    if (!config.enabled) {
      log('removing nav font size stylesheet')
      $style?.remove()
      $style = null
      return
    }

    let cssRules = []

    if (fontSize != null && config.navBaseFontSize) {
      cssRules.push(`
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir]:not([aria-live]) span { font-size: ${fontSize}; font-weight: normal; }
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir]:not([aria-live]) { margin-top: -4px; }
      `)
    }

    if (filterBlurRule != null && config.unblurSensitiveContent) {
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
//#endregion

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

  if (config.retweets == 'separate' && config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = getString(config.replaceLogo ? 'SHARED_TWEETS' : 'SHARED')
  } else if (config.retweets == 'separate') {
    separatedTweetsTimelineTitle = getString(config.replaceLogo ? 'RETWEETS' : 'REPOSTS')
  } else if (config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = getString(config.replaceLogo ? 'QUOTE_TWEETS' : 'QUOTES')
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

const configureThemeCss = (() => {
  let $style

  return function configureThemeCss() {
    if (!config.enabled) {
      log('removing theme stylesheet')
      $style?.remove()
      $style = null
      return
    }

    let cssRules = []

    if (themeColor != null) {
      cssRules.push(`
        body {
          --theme-color: ${themeColor};
        }
      `)
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
    if (themeColor != null && shouldShowSeparatedTweetsTab()) {
      cssRules.push(`
        body.SeparatedTweets #cpftSeparatedTweetsTab > a > div > div > div {
          background-color: ${themeColor} !important;
        }
      `)
    }

    if (config.replaceLogo) {
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
      `)
      if (desktop) {
        // Revert the Tweet buttons being made monochrome
        cssRules.push(`
          [data-testid="SideNav_NewTweet_Button"],
          [data-testid="tweetButtonInline"],
          [data-testid="tweetButton"] {
            background-color: ${themeColor} !important;
          }
          [data-testid="SideNav_NewTweet_Button"]:hover,
          [data-testid="tweetButtonInline"]:hover:not(:disabled),
          [data-testid="tweetButton"]:hover:not(:disabled) {
            background-color: ${themeColor.replace(')', ', 80%)')} !important;
          }
          body:is(.Dim, .LightsOut):not(.HighContrast) [data-testid="SideNav_NewTweet_Button"] > div,
          body:is(.Dim, .LightsOut):not(.HighContrast) [data-testid="tweetButtonInline"] > div,
          body:is(.Dim, .LightsOut):not(.HighContrast) [data-testid="tweetButton"] > div,
          body:is(.Dim, .LightsOut):not(.HighContrast) [data-testid="SideNav_NewTweet_Button"] > div > svg {
            color: rgb(255, 255, 255) !important;
          }
        `)
      }
    }

    if (config.uninvertFollowButtons) {
      // Shared styles for Following and Follow buttons
      cssRules.push(`
        [role="button"][data-testid$="-unfollow"]:not(:hover) {
          border-color: rgba(0, 0, 0, 0) !important;
        }
        [role="button"][data-testid$="-follow"] {
          background-color: rgba(0, 0, 0, 0) !important;
        }
      `)
      if (config.followButtonStyle == 'monochrome' || themeColor == null) {
        cssRules.push(`
          /* Following button */
          body.Default [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: rgb(15, 20, 25) !important;
          }
          body.Default [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: rgb(255, 255, 255) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(15, 20, 25) !important;
          }
          /* Follow button */
          body.Default [role="button"][data-testid$="-follow"] {
            border-color: rgb(207, 217, 222) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-follow"] {
            border-color: rgb(83, 100, 113) !important;
          }
          body.Default [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: rgb(15, 20, 25) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          body.Default [role="button"][data-testid$="-follow"]:hover {
            background-color: rgba(15, 20, 25, 0.1) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-follow"]:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        `)
      }
      if (config.followButtonStyle == 'themed' && themeColor != null) {
        cssRules.push(`
          /* Following button */
          [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: var(--theme-color) !important;
          }
          [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          /* Follow button */
          [role="button"][data-testid$="-follow"] {
            border-color: var(--theme-color) !important;
          }
          [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: var(--theme-color) !important;
          }
          [role="button"][data-testid$="-follow"]:hover {
            background-color: var(--theme-color) !important;
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
            color: var(--theme-color) !important;
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
  }
})()

function getColorScheme() {
  return {
    'rgb(255, 255, 255)': 'Default',
    'rgb(21, 32, 43)': 'Dim',
    'rgb(0, 0, 0)': 'LightsOut',
  }[$body.style.backgroundColor]
}

/**
 * @param {HTMLElement} $tweet
 * @param {?{getText?: boolean}} options
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
 * @param {?boolean} checkSocialContext
 * @returns {import("./types").TweetType}
 */
function getTweetType($tweet, checkSocialContext = false) {
  if ($tweet.closest(Selectors.PROMOTED_TWEET_CONTAINER)) {
    return 'PROMOTED_TWEET'
  }
  // Assume social context tweets are Retweets
  if ($tweet.querySelector('[data-testid="socialContext"]')) {
    if (checkSocialContext) {
      let svgPath = $tweet.querySelector('svg path')?.getAttribute('d') ?? ''
      if (svgPath.startsWith('M7 4.5C7 3.12 8.12 2 9.5 2h5C1')) return 'PINNED_TWEET'
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
 * @param {HTMLElement} $popup
 * @returns {{tookAction: boolean, onPopupClosed?: () => void}}
 */
function handlePopup($popup) {
  let result = {tookAction: false, onPopupClosed: null}

  // Automatically close any sheet dialog which contains a Premium link
  if (desktop && config.hideTwitterBlueUpsells &&
      $popup.querySelector('[data-testid="mask"]') &&
      $popup.querySelector('[data-testid="sheetDialog"]') &&
      $popup.querySelector('a[href^="/i/premium"]')) {
    log('hidePremiumUpsells: automatically closing Premium upsell dialog')
    let mask = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="mask"]'))
    mask.click()
    result.tookAction = true
    return result
  }

  // The Sort replies by menu is hydrated asynchronously
  if (isOnIndividualTweetPage() &&
      config.sortReplies != 'relevant' &&
      !userSortedReplies &&
      $popup.innerHTML.includes(`>${getString('SORT_REPLIES_BY')}<`)) {
    log('sortReplies: Sort replies by menu opened')
    void (async () => {
      let $dropdown = await getElement('[role="menu"] [data-testid="Dropdown"]', {
        name: 'Rendered Sort replies by dropdown'
      })
      let $menuItems =  /** @type {NodeListOf<HTMLElement>} */ ($dropdown.querySelectorAll('div[role="menuitem"]'))
      let $selectedSvg = $popup.querySelector('div[role="menuitem"] svg')
      for (let [index, $menuItem] of $menuItems.entries()) {
        let shouldBeSelected = index == {recent: 1, liked: 2}[config.sortReplies]
        log({index, $menuItem, shouldBeSelected})
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
      location.pathname.startsWith(ModalPaths.COMPOSE_TWEET)) {
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
        if (config.replaceLogo && isOnHomeTimelinePage()) {
          tweakTweetButton()
        }
      }
    }
  }

  if (desktop && !isDesktopMediaModalOpen &&
      URL_MEDIA_RE.test(location.pathname) &&
      currentPath != location.pathname) {
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

  if (config.replaceLogo) {
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

  if (config.mutableQuoteTweets) {
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

  if (config.fastBlock) {
    if (blockMenuItemSeen && $popup.querySelector('[data-testid="confirmationSheetConfirm"]')) {
      log('fast blocking')
      ;/** @type {HTMLElement} */ ($popup.querySelector('[data-testid="confirmationSheetConfirm"]')).click()
      result.tookAction = true
    }
    else if ($popup.querySelector(Selectors.BLOCK_MENU_ITEM)) {
      log('preparing for fast blocking')
      blockMenuItemSeen = true
      // Create a nested observer for mobile, as it reuses the popup element
      result.tookAction = !mobile
    } else {
      blockMenuItemSeen = false
    }
  }

  if (config.addAddMutedWordMenuItem) {
    let linkSelector = 'a[href$="/settings"]'
    let $link = /** @type {HTMLElement} */ ($popup.querySelector(linkSelector))
    if ($link) {
      addAddMutedWordMenuItem($link, linkSelector)
      result.tookAction = true
    }
  }

  if (config.twitterBlueChecks != 'ignore') {
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

  if (config.hideGrokNav || config.twitterBlueChecks != 'ignore') {
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
        if (config.hideGrokNav) {
          // Tag Grok "Profile Summary" button
          let $grokButton = $popup.querySelector('[data-testid="HoverCard"] > div > div > div:last-child:has(> button)')
          if ($grokButton) {
            $grokButton.classList.add('GrokButton')
          }
        }
        if (config.twitterBlueChecks != 'ignore') {
          processBlueChecks($popup)
        }
      })
    }
  }

  // Verified account popup when you press the check button on a profile page
  if (config.twitterBlueChecks == 'replace' && isOnProfilePage()) {
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
        if (!($removedNode instanceof HTMLElement)) continue
        if ($removedNode !== $nestedPopup) return
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
 * @param {import("./types").TimelineOptions?} options
 */
function onTimelineChange($timeline, page, options = {}) {
  let startTime = Date.now()
  let {classifyTweets = true, hideHeadings = true, isUserTimeline = false} = options

  let isOnHomeTimeline = isOnHomeTimelinePage()
  let isOnListTimeline = isOnListPage()
  let isOnProfileTimeline = isOnProfilePage()
  let isOnNotificationsTimeline = isOnNotificationsPage()
  let timelineHasSpecificTweetHandling = isOnHomeTimeline || isOnListTimeline || isOnProfileTimeline

  if (config.twitterBlueChecks != 'ignore' && (isUserTimeline || !timelineHasSpecificTweetHandling)) {
    processBlueChecks($timeline)
  }

  if (isSafari && config.replaceLogo && isOnNotificationsTimeline) {
    processTwitterLogos($timeline)
  }

  if (isUserTimeline || !classifyTweets) return

  let itemTypes = {}
  let hiddenItemCount = 0
  let hiddenItemTypes = {}

  /** @type {?boolean} */
  let hidPreviousItem = null
  /** @type {{$item: Element, hideItem?: boolean}[]} */
  let changes = []

  for (let $item of $timeline.children) {
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
      itemType = getTweetType($tweet, isOnProfileTimeline)
      if (timelineHasSpecificTweetHandling) {
        isReply = isReplyToPreviousTweet($tweet)
        if (isReply && hidPreviousItem != null) {
          hideItem = hidPreviousItem
        } else {
          if (isOnHomeTimeline) {
            hideItem = shouldHideHomeTimelineItem(itemType, page)
            if (config.mutableQuoteTweets && !hideItem && itemType == 'QUOTE_TWEET' && config.hideQuotesFrom.length > 0) {
              let $quotedByLink = /** @type {HTMLAnchorElement} */ ($tweet.querySelector('[data-testid="User-Name"] a'))
              let quotedBy = $quotedByLink?.pathname.substring(1)
              if (quotedBy) {
                hideItem = config.hideQuotesFrom.includes(quotedBy)
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

        if (!hideItem && config.hideGrokTweets && $tweet.querySelector('a[href^="/i/grok/share/"]')) {
          hideItem = true
        }

        if (!hideItem && config.mutableQuoteTweets && (itemType == 'QUOTE_TWEET' || itemType == 'RETWEETED_QUOTE_TWEET')) {
          if (config.mutedQuotes.length > 0) {
            let quotedTweet = getQuotedTweetDetails($tweet)
            hideItem = config.mutedQuotes.some(muted => muted.user == quotedTweet.user && muted.time == quotedTweet.time)
          }
          if (!hideItem) {
            addCaretMenuListenerForQuoteTweet($tweet)
          }
        }

        if (config.twitterBlueChecks != 'ignore') {
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

      if (!hideItem && config.restoreLinkHeadlines) {
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
          hideItem = config.hideNotificationLikes
        }
        else if ($iconPath.startsWith('M17.863 13.44c1.477 1.58 2.366')) {
          notificationType = 'FOLLOW'
        }
        else if ($iconPath.startsWith('M4.75 3.79l4.603 4.3-1.706 1.8')) {
          notificationType = 'RETWEET'
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
      if (itemType != null) {
        hideItem = shouldHideOtherTimelineItem(itemType)
      }
    }

    // Special handling for non-Tweet timeline items
    if (itemType == null) {
      if ($item.querySelector('[data-testid="inlinePrompt"]')) {
        itemType = 'INLINE_PROMPT'
        hideItem = config.hideInlinePrompts || (
          config.hideTwitterBlueUpsells && Boolean($item.querySelector('a[href^="/i/premium"]')) ||
          config.hideMonetizationNav && Boolean($item.querySelector('a[href="/settings/monetization"]'))
        )
      } else if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        hideItem = hideHeadings && config.hideWhoToFollowEtc
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
  }

  for (let change of changes) {
    change.$item.firstElementChild.classList.toggle('HiddenTweet', change.hideItem)
  }

  if (debug && config.debugLogTimelineStats) {
    log(
      `processed ${$timeline.children.length} timeline item${s($timeline.children.length)} in ${Date.now() - startTime}ms`,
      itemTypes, `hid ${hiddenItemCount}`, hiddenItemTypes
    )
  }
}

/**
 * @param {HTMLElement} $timeline
 * @param {import("./types").IndividualTweetTimelineOptions} options
 */
function onIndividualTweetTimelineChange($timeline, options) {
  let startTime = Date.now()

  let {seen} = options
  let itemTypes = {}
  let hiddenItemCount = 0
  let hiddenItemTypes = {}
  let processedCount = 0

  /** @type {?boolean} */
  let hidPreviousItem
  /** @type {boolean} */
  let hideAllSubsequentItems = false
  /** @type {string} */
  let opScreenName = /^\/([a-zA-Z\d_]{1,20})\//.exec(location.pathname)[1].toLowerCase()
  /** @type {string} */
  let userScreenName = getUserScreenName()
  /** @type {{$item: Element, hideItem?: boolean}[]} */
  let changes = []
  /** @type {import("./types").UserInfoObject} */
  let userInfo = getUserInfo()
  /** @type {?HTMLElement} */
  let $focusedTweet

  for (let $item of $timeline.children) {
    if (seen.has($item) &&
        // Reprocess Discover More Tweets if they were processed before the Discover More heading
        !(hideAllSubsequentItems && seen.get($item).hidden != config.hideMoreTweets)) {
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
        hideAllSubsequentItems = config.hideMoreTweets
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

      if (!hideItem && config.hideGrokTweets && $tweet.querySelector('a[href^="/i/grok/share/"]')) {
        hideItem = true
      }

      if (!hideItem && (config.twitterBlueChecks != 'ignore' || config.hideTwitterBlueReplies)) {
        for (let $svg of $tweet.querySelectorAll(Selectors.VERIFIED_TICK)) {
          let verifiedType = getVerifiedType($svg)
          if (!verifiedType) continue

          if (config.twitterBlueChecks != 'ignore' && verifiedType == 'BLUE') {
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
          if (config.hideTwitterBlueReplies) {
            let user = userInfo[screenName]
            if (!user && config.debugLogTimelineStats) {
              log('hideTwitterBlueReplies: user info not found for', screenName)
            }
            hideItem = !(
              config.showPremiumReplyBusiness && tweetVerifiedType == 'BUSINESS' ||
              config.showPremiumReplyGovernment && tweetVerifiedType == 'GOVERNMENT' ||
              (user != null && (
                config.showPremiumReplyFollowing && user.following ||
                config.showPremiumReplyFollowedBy && user.followedBy ||
                config.showBlueReplyFollowersCount && user.followersCount >= Number(config.showBlueReplyFollowersCountAmount)
              ))
            )
          }
        }
      }

      if (!hideItem && config.restoreLinkHeadlines) {
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
            hideItem = config.hideUnavailableQuoteTweets
          }
        }
        else if ($article.textContent == getString('POST_UNAVAILABLE')) {
          // Likely blocked or muted
          hideItem = config.hideUnavailableQuoteTweets
        }
      } else {
        // We need to identify "Show more replies" so it doesn't get hidden if the
        // item immediately before it was hidden.
        let $button = $item.querySelector('button[role="button"]')
        if ($button) {
          if ($button?.textContent == getString('SHOW_MORE_REPLIES')) {
            itemType = 'SHOW_MORE'
          }
        } else {
          let $heading = $item.querySelector(Selectors.TIMELINE_HEADING)
          if ($heading) {
            // Discover More headings have a description next to them
            if ($heading.nextElementSibling &&
                $heading.nextElementSibling.tagName == 'DIV' &&
                $heading.nextElementSibling.getAttribute('dir') != null) {
              itemType = 'DISCOVER_MORE_HEADING'
              hideItem = config.hideMoreTweets
              hideAllSubsequentItems = config.hideMoreTweets
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

    if (debug && config.debugLogTimelineStats && (itemType == null || hideItem == null)) {
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

  if (debug && config.debugLogTimelineStats) {
    log(
      `processed ${processedCount} new thread item${s(processedCount)} in ${Date.now() - startTime}ms`,
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

  if (checkforDisabledHomeTimeline()) return

  // Ignore leading notification counts in titles
  let notificationCount = ''
  if (TITLE_NOTIFICATION_RE.test(title)) {
    notificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
    title = title.replace(TITLE_NOTIFICATION_RE, '')
  }

  // After we replace the shortcut icon, Twitter stops updating it to add/remove
  // the notifications pip, so we need to manage the pip ourselves.
  if (config.replaceLogo) {
    observeFavicon.forceUpdate(Boolean(notificationCount))
  }

  let homeNavigationWasUsed = homeNavigationIsBeingUsed
  homeNavigationIsBeingUsed = false

  // Ignore Flash of Uninitialised Title when navigating to a page for the first
  // time, except in scenarios where we know an empty title is being set.
  if (title == 'X' || title == getString('TWITTER')) {
    // On mobile, the media viewer sets an empty title
    if (mobile && (URL_MEDIA_RE.test(location.pathname) || URL_MEDIAVIEWER_RE.test(location.pathname))) {
      log('viewing media on mobile')
    }
    // On desktop, the root Settings page sets an empty title when the sidebar
    // is hidden.
    else if (desktop && location.pathname == '/settings' && currentPath != '/settings') {
      log('viewing root Settings page')
    }
    // On desktop, the root Messages page sometimes sets an empty title
    else if (desktop && location.pathname == '/messages' && currentPath != '/messages') {
      log('viewing root Messages page')
    }
    // The Bookmarks page sets an empty title
    else if (location.pathname.startsWith(PagePaths.BOOKMARKS) && !currentPath.startsWith(PagePaths.BOOKMARKS)) {
      log('viewing Bookmarks page')
    }
    else {
      log('ignoring Flash of Uninitialised Title')
      return
    }
  }

  // Remove " / Twitter" or "Twitter \ " from the title
  let newPage = title
  if (newPage != 'X' && newPage != getString('TWITTER')) {
    newPage = title.slice(...ltr ? [0, title.lastIndexOf('/') - 1] : [title.indexOf('\\') + 2])
  }

  let hasDesktopModalBeenOpenedOrClosed = desktop && (
    // Timeline settings dialog opened
    location.pathname == PagePaths.TIMELINE_SETTINGS ||
    // Timeline settings dialog closed
    currentPath == PagePaths.TIMELINE_SETTINGS ||
    // Media modal opened
    URL_MEDIA_RE.test(location.pathname) ||
    // Media modal closed
    URL_MEDIA_RE.test(currentPath) ||
    // "Send via Direct Message" dialog opened
    location.pathname == ModalPaths.COMPOSE_MESSAGE ||
    // "Send via Direct Message" dialog closed
    currentPath == ModalPaths.COMPOSE_MESSAGE ||
    // Compose Tweet dialog opened
    location.pathname == ModalPaths.COMPOSE_TWEET ||
    // Compose Tweet dialog closed
    currentPath == ModalPaths.COMPOSE_TWEET
  )

  if (newPage == currentPage) {
    log(`ignoring duplicate title change`)
    // Navigation within the Compose Tweet modal triggers duplcate title changes
    if (isDesktopComposeTweetModalOpen) {
      if (currentPath == ModalPaths.COMPOSE_TWEET && COMPOSE_TWEET_MODAL_PAGES.has(location.pathname)) {
        log('navigated away from Compose Tweet editor')
        disconnectObservers(modalObservers, 'modal')
      }
      else if (COMPOSE_TWEET_MODAL_PAGES.has(currentPath) && location.pathname == ModalPaths.COMPOSE_TWEET) {
        log('navigated back to Compose Tweet editor')
        observeDesktopComposeTweetModal($desktopComposeTweetModalPopup)
      }
    }
    currentNotificationCount = notificationCount
    currentPath = location.pathname
    return
  }

  // Search terms are shown in the title
  if (currentPath == PagePaths.SEARCH && location.pathname == PagePaths.SEARCH) {
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
        // …a modal which changes the pathname has been opened or closed.
        hasDesktopModalBeenOpenedOrClosed ||
        // …the notification count in the title changed.
        notificationCount != currentNotificationCount
      )) {
    log('ignoring title change on separated tweets timeline')
    currentNotificationCount = notificationCount
    currentPath = location.pathname
    setTitle(separatedTweetsTimelineTitle)
    return
  }

  // Restore display of the separated tweets timelne if it's the last one we
  // saw, and the user navigated back home without using the Home navigation
  // item.
  if (location.pathname == PagePaths.HOME &&
      currentPath != PagePaths.HOME &&
      !homeNavigationWasUsed &&
      lastHomeTimelineTitle != null &&
      separatedTweetsTimelineTitle != null &&
      lastHomeTimelineTitle == separatedTweetsTimelineTitle) {
    log('restoring display of the separated tweets timeline')
    currentNotificationCount = notificationCount
    currentPath = location.pathname
    setTitle(separatedTweetsTimelineTitle)
    return
  }

  // Assumption: all non-FOUT, non-duplicate title changes are navigation, which
  // need the page to be re-processed.

  currentPage = newPage
  currentNotificationCount = notificationCount
  currentPath = location.pathname

  if (isOnHomeTimelinePage()) {
    lastHomeTimelineTitle = currentPage
  }

  log('processing new page')

  processCurrentPage()
}

/**
 * Processes all Twitter Blue checks inside an element.
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

function processCurrentPage() {
  disconnectObservers(pageObservers, 'page')

  // Hooks for styling pages
  if (!$body) $body = document.body
  $body.classList.toggle('Bookmarks', isOnBookmarksPage())
  $body.classList.toggle('Community', isOnCommunityPage())
  $body.classList.toggle('Communities', isOnCommunitiesPage())
  $body.classList.toggle('Explore', isOnExplorePage())
  $body.classList.toggle('HideSidebar', shouldHideSidebar())
  $body.classList.toggle('List', isOnListPage())
  $body.classList.toggle('HomeTimeline', isOnHomeTimelinePage())
  $body.classList.toggle('Notifications', isOnNotificationsPage())
  $body.classList.toggle('Profile', isOnProfilePage())
  if (!isOnProfilePage()) {
    $body.classList.remove('OwnProfile', 'PremiumProfile')
  }
  $body.classList.toggle('ProfileFollows', isOnFollowListPage())
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
    if (!isOnMessagesPage() && !isOnSettingsPage()) {
      observeSidebar()
    } else {
      $body.classList.remove('Sidebar')
    }
    if (isSafari && config.replaceLogo) {
      tweakDesktopLogo()
    }
  }

  if (isSafari && config.replaceLogo) {
    tweakHomeIcon()
  }

  if (config.twitterBlueChecks != 'ignore' && (isOnSearchPage() || isOnExplorePage())) {
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
  else if (URL_TWEET_INTERACTIONS_RE.test(currentPath)) {
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
  else if (isOnBookmarksPage()) {
    tweakBookmarksPage()
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
  else if (isOnDisplaySettingsPage() || isOnAccessibilitySettingsPage()) {
    tweakDisplaySettingsPage()
  }

  // On mobile, these are pages instead of modals
  if (mobile) {
    if (isOnComposeTweetPage()) {
      tweakMobileComposeTweetPage()
    }
    else if (URL_MEDIAVIEWER_RE.test(currentPath)) {
      tweakMobileMediaViewerPage()
    }
  }
}

/**
 * @returns {boolean} `true` if this call replaces the current location
 */
function redirectToTwitter() {
  if (config.redirectToTwitter &&
      location.hostname.endsWith('x.com') &&
      // Don't redirect the path used by the OldTweetDeck extension
      location.pathname != '/i/tweetdeck') {
    // If we got a logout redirect from twitter.com, redirect back to the login page
    let pathname = location.search.includes('logout=') ? '/i/flow/login' : location.pathname || '/home'
    let redirectUrl = `https://twitter.com${pathname}?mx=1`
    log('redirectToTwitter: redirecting from', location.href, 'to', redirectUrl)
    location.replace(redirectUrl)
    return true
  }
  return false
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
      <div style="color: var(--color); margin-bottom: 2px;">${site}</div>
      <div style="color: var(--color-emphasis)">${headline}</div>
    </div>`)
    $link.dataset.headlineRestored = 'true'
  }
}

/**
 * @param {HTMLElement} $focusedTweet
 */
function restoreTweetInteractionsLinks($focusedTweet, tweetInfo) {
  if (!config.restoreQuoteTweetsLink && !config.restoreOtherInteractionLinks) return

  if (!tweetInfo) {
    warn('restoreTweetInteractionsLinks: focused tweet info not available')
    return
  }

  let isOwnTweet = Boolean($focusedTweet.querySelector('a[data-testid="analyticsButton"]'))
  let shouldDisplayLinks = (
    (config.restoreQuoteTweetsLink && tweetInfo.quote_count > 0) ||
    (config.restoreOtherInteractionLinks && (tweetInfo.retweet_count > 0 || isOwnTweet && tweetInfo.favorite_count > 0))
  )
  let $existingLinks = $focusedTweet.querySelector('#cpftInteractionLinks')
  if (!shouldDisplayLinks || $existingLinks) {
    if (!shouldDisplayLinks) $existingLinks?.remove()
    return
  }

  let $group = $focusedTweet.querySelector('[role="group"][id^="id__"]')
  if (!$group) return warn('focused tweet action bar not found')

  let tweetLink = location.pathname.match(URL_TWEET_BASE_RE)?.[0]
  $group.parentElement.insertAdjacentHTML('beforebegin', `
    <div id="cpftInteractionLinks" hidden>
      <div class="${fontFamilyRule?.selectorText?.replace('.', '') || 'cpft_font_family'}" style="padding: 16px 4px; border-top: 1px solid var(--border-color); display: flex; gap: 20px;">
        ${tweetInfo.quote_count > 0 ? `<a id="cpftQuoteTweetsLink" class="quoteTweets" href="${tweetLink}/quotes" dir="auto" role="link">
          <span id="cpftQuoteTweetCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.quote_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.quote_count)}
          </span>
          <span>${getString(tweetInfo.quote_count == 1 ? (config.replaceLogo ? 'QUOTE_TWEET' : 'QUOTE') : (config.replaceLogo ? 'QUOTE_TWEETS' : 'QUOTES'))}</span>
        </a>` : ''}
        ${tweetInfo.retweet_count > 0 ? `<a id="cpftRetweetsLink" data-tab="2" href="${tweetLink}/retweets" dir="auto" role="link">
          <span id="cpftRetweetCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.retweet_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.retweet_count)}
          </span>
          <span>${getString(config.replaceLogo ? 'RETWEETS' : 'REPOSTS')}</span>
        </a>` : ''}
        ${isOwnTweet && tweetInfo.favorite_count > 0 ? `<a id="cpftLikesLink" data-tab="3" href="${tweetLink}/likes" dir="auto" role="link">
          <span id="cpftLikeCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.favorite_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.favorite_count)}
          </span>
          <span>${getString('LIKES')}</span>
        </a>` : ''}
      </div>
    </div>
  `)

  let links = /** @type {NodeListOf<HTMLAnchorElement>} */ ($focusedTweet.querySelectorAll('#cpftInteractionLinks a'))
  links.forEach(($link) => {
    $link.addEventListener('click', async (e) => {
      let $caret = /** @type {HTMLElement} */ ($focusedTweet.querySelector('[data-testid="caret"]'))
      if (!$caret) return warn('focused tweet menu caret not found')

      log('clicking "View post engagements" menu item')
      e.preventDefault()
      $caret.click()
      let $tweetEngagements = await getElement('#layers a[data-testid="tweetEngagements"]', {
        name: 'View post engagements menu item',
        stopIf: pageIsNot(currentPage),
        timeout: 500,
      })
      if ($tweetEngagements) {
        tweetInteractionsTab = $link.dataset.tab || null
        $tweetEngagements.click()
      } else {
        warn('falling back to full page refresh')
        location.href = $link.href
      }
    })
  })
}

/**
 * Sets the page name in <title>, retaining any current notification count.
 * @param {string} page
 */
function setTitle(page) {
  let name = config.replaceLogo ? getString('TWITTER') : 'X'
  let notificationCount = config.hideNotifications != 'ignore' ? (
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
      return config.hideUnavailableQuoteTweets
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
      return config.listRetweets == 'hide'
    case 'UNAVAILABLE_QUOTE_TWEET':
      return config.hideUnavailableQuoteTweets
    case 'UNAVAILABLE_RETWEET':
      return config.hideUnavailableQuoteTweets || config.listRetweets == 'hide'
    default:
      return false
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
      return shouldHideSharedTweet(config.quoteTweets, page)
    case 'RETWEET':
      return selectedHomeTabIndex >= 2 ? config.listRetweets == 'hide' : shouldHideSharedTweet(config.retweets, page)
    case 'RETWEETED_QUOTE_TWEET':
      return selectedHomeTabIndex >= 2 ? (
          config.listRetweets == 'hide'
        ) : (
          shouldHideSharedTweet(config.retweets, page) || shouldHideSharedTweet(config.quoteTweets, page)
        )
    case 'TWEET':
      return page == separatedTweetsTimelineTitle
    case 'UNAVAILABLE_QUOTE_TWEET':
      return config.hideUnavailableQuoteTweets || shouldHideSharedTweet(config.quoteTweets, page)
    case 'UNAVAILABLE_RETWEET':
      return config.hideUnavailableQuoteTweets || selectedHomeTabIndex >= 2 ? config.listRetweets == 'hide' : shouldHideSharedTweet(config.retweets, page)
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
    case 'PINNED_TWEET':
    case 'QUOTE_TWEET':
    case 'TWEET':
      return false
    case 'RETWEET':
    case 'RETWEETED_QUOTE_TWEET':
      return config.hideProfileRetweets
    case 'UNAVAILABLE_QUOTE_TWEET':
      return config.hideUnavailableQuoteTweets
    default:
      return true
  }
}

/**
 * @param {import("./types").TimelineItemType} type
 * @returns {boolean}
 */
 function shouldHideOtherTimelineItem(type) {
  switch (type) {
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

async function tweakBookmarksPage() {
  if (config.twitterBlueChecks != 'ignore' || config.restoreLinkHeadlines) {
    observeTimeline(currentPage)
  }
}

async function tweakExplorePage() {
  if (!config.hideExplorePageContents) {
    if (config.twitterBlueChecks != 'ignore') {
      observeTimeline(currentPage, {
        classifyTweets: false,
        isTabbed: true,
        tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child > div',
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

function tweakCommunitiesPage() {
  observeTimeline(currentPage)
}

function tweakCommunityPage() {
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
      isTabbed: true,
      tabbedTimelineContainerSelector: `${Selectors.PRIMARY_COLUMN} > div > div:last-child`,
      onTimelineAppeared() {
        // The About tab has static content at the top which can include a check
        if (/\/about\/?$/.test(location.pathname)) {
          processBlueChecks(document.querySelector(Selectors.PRIMARY_COLUMN))
        }
      }
    })
  }
}

function tweakCommunityMembersPage() {
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
      isTabbed: true,
      timelineSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
    })
  }
}

function tweakDisplaySettingsPage() {
  (async () => {
    let $colorRerenderBoundary = await getElement('#react-root > div > div')

    observeElement($colorRerenderBoundary, () => {
      let newThemeColor = getThemeColorFromState()
      if (newThemeColor == themeColor) return

      log('Color setting changed')
      themeColor = newThemeColor
      configureThemeCss()
      observePopups()
      observeSideNavTweetButton()
    }, {
      name: 'Color change re-render boundary',
      observers: pageObservers,
    })
  })()

  if (desktop) {
    observeElement($html, () => {
      if (!$html.style.fontSize) return

      if ($html.style.fontSize != fontSize) {
        fontSize = $html.style.fontSize
        log(`<html> fontSize has changed to ${fontSize}`)
        configureDynamicCss()
        observePopups()
        observeSideNavTweetButton()
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

function restoreTweetSource($permalinkBar, tweetInfo) {
  if (!config.restoreTweetSource) return
  if ($permalinkBar.hasAttribute('cpft-tweet-source-restored')) return
  if (!tweetInfo?.source_name) {
    warn('source_name not available in focused tweet info', tweetInfo)
    return
  }
  let $separator = document.createElement('span')
  $separator.className = 'TweetSource cpft_separator cpft_text'
  $separator.setAttribute('aria-hidden', 'true')
  $separator.setAttribute('hidden', '')
  $separator.textContent = '·'
  let $sourceLabel = document.createElement('span')
  $sourceLabel.className = 'TweetSource cpft_text'
  $sourceLabel.setAttribute('hidden', '')
  $sourceLabel.textContent = tweetInfo.source_name
  $permalinkBar.append($separator, $sourceLabel)
  $permalinkBar.setAttribute('cpft-tweet-source-restored', '')
}

/**
 * @param {HTMLElement} $focusedTweet
 * @param {import("./types").IndividualTweetTimelineOptions} options
 */
async function tweakFocusedTweet($focusedTweet, options) {
  log('tweaking focused tweet')
  let {observers} = options
  let tweetId = location.pathname.match(URL_TWEET_BASE_RE)?.[2]
  let tweetInfo = getTweetInfo(tweetId)

  // Tag View elements and restore Tweet source
  let $permalinkBar = $focusedTweet.querySelector('div:has(> div > a > time)')
  if ($permalinkBar) {
    $permalinkBar.children[1]?.classList.toggle('Views', config.hideViews)
    $permalinkBar.children[2]?.classList.toggle('Views', config.hideViews)
    restoreTweetSource($permalinkBar, tweetInfo)
  } else {
    warn('focused tweet permalink bar not found')
  }

  tweakOwnFocusedTweet($focusedTweet)
  restoreTweetInteractionsLinks($focusedTweet, tweetInfo)

  if (desktop && config.replaceLogo) {
    void async function() {
      let $editorRoot = await getElement('.DraftEditor-root', {
        context: $focusedTweet.parentElement,
        name: 'tweet editor in focused tweet',
        timeout: 1000,
        stopIf: pageIsNot(currentPage)
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
  // These tabs are dynamic as "Followers you know" only appears when applicable
  let $tabs = await getElement(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`, {
    name: 'Following tabs',
    stopIf: pageIsNot(currentPage),
  })
  if (!$tabs) return

  let $subscriptionsTabLink = $tabs.querySelector('div[role="tablist"] a[href$="/subscriptions"]')
  if ($subscriptionsTabLink) {
    $body.classList.add('Subscriptions')
  }

  if (config.hideVerifiedNotificationsTab) {
    let isVerifiedTabSelected = Boolean($tabs.querySelector('div[role="tablist"] > div:nth-child(1) > a[aria-selected="true"]'))
    if (isVerifiedTabSelected) {
      log('switching to Following tab')
      let $followingTab = /** @type {HTMLAnchorElement} */ (
        $tabs.querySelector(`div[role="tablist"] > div:nth-last-child(${$subscriptionsTabLink ? 3 : 2}) > a`)
      )
      $followingTab?.click()
    }
  }

  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
    })
  }
}

async function tweakIndividualTweetPage() {
  userSortedReplies = false
  observeIndividualTweetTimeline(currentPage)

  if (config.replaceLogo) {
    (async () => {
      let $headingText = await getElement(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} h2 span`, {
        name: 'tweet thread heading',
        stopIf: pageIsNot(currentPage)
      })
      if ($headingText && $headingText.textContent != getString('TWEET')) {
        $headingText.textContent = getString('TWEET')
      }
    })()
  }
}

function tweakListPage() {
  observeTimeline(currentPage, {
    hideHeadings: false,
  })
}

async function tweakListsPage() {
  if (config.hideMoreTweets) {
    // Hide Discover new Lists
    let $showMoreLink = await getElement('a[href="/i/lists/suggested"]', {
      name: 'Show more link',
      stopIf: pageIsNot(currentPage),
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

async function tweakDesktopLogo() {
  let $logoPath = await getElement(`h1 ${Selectors.X_LOGO_PATH}, h1 ${Selectors.X_DARUMA_LOGO_PATH}`, {
    name: 'desktop nav logo',
    timeout: 5000,
  })
  if ($logoPath) {
    twitterLogo($logoPath)
  }
}

async function tweakHomeIcon() {
  let $homeIconPath = await getElement(`${Selectors.NAV_HOME_LINK} svg path`, {name: 'Home icon', stopIf: pageIsNot(currentPage)})
  if ($homeIconPath) {
    homeIcon($homeIconPath)
  }
}

async function tweakOwnFocusedTweet($focusedTweet) {
  if (!config.hideTwitterBlueUpsells || $focusedTweet.hasAttribute('cpft-premium-upsells-tagged')) return

  // Only your own focused Tweets have an analytics button
  let $analyticsButton = $focusedTweet.querySelector('a[data-testid="analyticsButton"]')
  if (!$analyticsButton) return

  $analyticsButton.parentElement.classList.add('AnalyticsButton')
  run(async () => {
    let $premiumUpsell = await getElement('.AnalyticsButton + div:has(a:is([href="/i/account_analytics"], [href^="/i/premium"]))', {
      context: $analyticsButton.parentElement.parentElement,
      name: 'own focused Tweet premium upsell',
      timeout: 2000,
      stopIf: pageIsNot(currentPage)
    })
    if (!$premiumUpsell) return
    $premiumUpsell.classList.add('PremiumUpsell')
  })
  $focusedTweet.setAttribute('cpft-premium-upsells-tagged', 'true')
}

/**
 * Restores "Tweet" button text.
 */
async function tweakTweetButton() {
  let $tweetButton = await getElement(`${desktop ? 'div[data-testid="primaryColumn"]': 'main'} button[data-testid^="tweetButton"]`, {
    name: 'tweet button',
    stopIf: pageIsNot(currentPage),
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

function tweakHomeTimelinePage() {
  let $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)

  // Hook for styling when on the separated tweets tab
  $body.classList.toggle('SeparatedTweets', isOnSeparatedTweetsTimeline())

  if ($timelineTabs == null) {
    warn('could not find Home timeline tabs')
    return
  }

  tweakTimelineTabs($timelineTabs)
  if (mobile && isSafari && config.replaceLogo) {
    processTwitterLogos(document.querySelector(Selectors.MOBILE_TIMELINE_HEADER))
  }

  function updateSelectedHomeTabIndex() {
    let $selectedHomeTabLink = $timelineTabs.querySelector('div[role="tablist"] a[aria-selected="true"]')
    if ($selectedHomeTabLink) {
      selectedHomeTabIndex = Array.from($selectedHomeTabLink.parentElement.parentElement.children).indexOf($selectedHomeTabLink.parentElement)
      log({selectedHomeTabIndex})
    } else {
      warn('could not find selected Home tab link')
      selectedHomeTabIndex = -1
    }
  }

  updateSelectedHomeTabIndex()

  // If there are pinned lists, the timeline tabs <nav> will be replaced when they load
  observeElement($timelineTabs.parentElement, (mutations) => {
    let timelineTabsReplaced = mutations.some(mutation => Array.from(mutation.removedNodes).includes($timelineTabs))
    if (timelineTabsReplaced) {
      log('Home timeline tabs replaced')
      $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)
      tweakTimelineTabs($timelineTabs)
    }
  }, {
    name: 'timeline tabs nav container',
    observers: pageObservers,
  })

  observeTimeline(currentPage, {
    isTabbed: true,
    onTabChanged: () => {
      updateSelectedHomeTabIndex()
      wasForYouTabSelected = selectedHomeTabIndex == 0
    },
    tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
  })

  if (desktop) {
    observeDesktopHomeTimelineTweetBox()
  }
}

async function tweakMobileComposeTweetPage() {
  if (!config.replaceLogo && config.twitterBlueChecks == 'ignore') return

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
    if (config.replaceLogo) {
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
    if (config.twitterBlueChecks != 'ignore') {
      observeUserTypeaheadDropdown(document.querySelector('main div[data-testid^="tweetTextarea"]'))
    }
  } else {
    let $mask = document.querySelector('[data-testid="twc-cc-mask"]')
    let $tweetButtonText = document.querySelector('main button[data-testid^="tweetButton"] span > span')
    if ($mask && $tweetButtonText) {
      // We need to re-apply tweaks every time the child list changes. When
      // you use the username typeahead dropdown in any Tweet box, the list
      // re-renders so it's the only Tweet while the dropdown is open.
      observeElement($mask.nextElementSibling, () => {
        let $containers = document.querySelectorAll('main div[data-testid^="tweetTextarea"]')
        $containers.forEach(($container, index) => {
          if (config.replaceLogo) {
            let $textarea = $container.querySelector('textarea')
            $textarea.placeholder = getString(index == 0 ? 'WHATS_HAPPENING' : 'ADD_ANOTHER_TWEET')
          }
          if (index == 0 && config.twitterBlueChecks) {
            observeUserTypeaheadDropdown($container)
          }
        })
        // Don't update the Tweet button if the list was re-rendered to display
        // a user dropdown, in which case it will already be in the DOM.
        if (config.replaceLogo && !document.querySelector('main [id^="typeaheadDropdown"]')) {
          $tweetButtonText.textContent = getString($containers.length == 1 ? 'TWEET' : 'TWEET_ALL')
        }
      }, {
        name: 'Tweets container',
        observers: pageObservers,
      })
    } else {
      warn('could not find all elements needed to tweak the Compose Tweet page', {$mask, $tweetButtonText})
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
    if ($video.loop != config.preventNextVideoAutoplay) {
      $video.loop = config.preventNextVideoAutoplay
    }
  }

  // Process initial contents
  let $videos = $timeline.querySelectorAll('video')
  log($videos.length, `initial video${s($videos.length)}`)
  $videos.forEach(processVideo)
  if (config.twitterBlueChecks != 'ignore') {
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
        if (config.twitterBlueChecks != 'ignore') {
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

async function tweakTimelineTabs($timelineTabs) {
  $timelineTabs.classList.add('TimelineTabs')
  let $followingTabLink = /** @type {HTMLElement} */ ($timelineTabs.querySelector('div[role="tablist"] > div:nth-child(2) > a'))

  if (config.alwaysUseLatestTweets && !document.title.startsWith(separatedTweetsTimelineTitle)) {
    let isForYouTabSelected = Boolean($timelineTabs.querySelector('div[role="tablist"] > div:first-child > a[aria-selected="true"]'))
    if (isForYouTabSelected && (!wasForYouTabSelected || config.hideForYouTimeline)) {
      log('switching to Following timeline')
      $followingTabLink.click()
      wasForYouTabSelected = false
    } else {
      wasForYouTabSelected = isForYouTabSelected
    }
  }

  if (shouldShowSeparatedTweetsTab()) {
    let $newTab = /** @type {HTMLElement} */ ($timelineTabs.querySelector('#cpftSeparatedTweetsTab'))
    if ($newTab) {
      log('separated tweets timeline tab already present')
      $newTab.querySelector('span').textContent = separatedTweetsTimelineTitle
    }
    else {
      log('inserting separated tweets tab')
      $newTab = /** @type {HTMLElement} */ ($followingTabLink.parentElement.cloneNode(true))
      $newTab.id = 'cpftSeparatedTweetsTab'
      $newTab.querySelector('span').textContent = separatedTweetsTimelineTitle
      let $link = $newTab.querySelector('a')
      $link.removeAttribute('aria-selected')

      // This script assumes navigation has occurred when the document title
      // changes, so by changing the title we fake navigation to a non-existent
      // page representing the separated tweets timeline.
      $link.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!document.title.startsWith(separatedTweetsTimelineTitle)) {
          // The separated tweets tab belongs to the Following tab
          let isFollowingTabSelected = Boolean($timelineTabs.querySelector('div[role="tablist"] > div:nth-child(2) > a[aria-selected="true"]'))
          if (!isFollowingTabSelected) {
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
        if (location.pathname == '/home' && !document.title.startsWith(getString('HOME'))) {
          log('setting title to Home')
          homeNavigationIsBeingUsed = true
          setTitle(getString('HOME'))
        }
      })

      // Return to the Home timeline when the Home nav link is clicked
      let $homeNavLink = await getElement(Selectors.NAV_HOME_LINK, {
        name: 'home nav link',
        stopIf: pathIsNot(currentPath),
      })
      if ($homeNavLink && !$homeNavLink.dataset.tweakNewTwitterListener) {
        $homeNavLink.addEventListener('click', () => {
          homeNavigationIsBeingUsed = true
          if (location.pathname == '/home' && !document.title.startsWith(getString('HOME'))) {
            setTitle(getString('HOME'))
          }
        })
        $homeNavLink.dataset.tweakNewTwitterListener = 'true'
      }
    }
  } else {
    removeMobileTimelineHeaderElements()
  }
}

function tweakNotificationsPage() {
  let $navigationTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)
  if ($navigationTabs != null) {
    if (config.hideVerifiedNotificationsTab) {
      let isVerifiedTabSelected = Boolean($navigationTabs.querySelector('div[role="tablist"] > div:nth-child(2) > a[aria-selected="true"]'))
      if (isVerifiedTabSelected) {
        log('switching to All tab')
        let $allTab = /** @type {HTMLAnchorElement} */ (
          $navigationTabs.querySelector('div[role="tablist"] > div:nth-child(1) > a')
        )
        $allTab?.click()
      }
    }
  } else {
    warn('could not find Notifications tabs')
  }

  observeTimeline(currentPage, {
    isTabbed: true,
    tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
  })
}

async function tweakProfilePage() {
  let $initialContent = await getElement(desktop ? Selectors.PRIMARY_COLUMN : Selectors.MOBILE_TIMELINE_HEADER, {
    name: 'initial profile content',
    stopIf: pageIsNot(currentPage),
  })
  if (!$initialContent) return

  if (config.twitterBlueChecks != 'ignore') {
    processBlueChecks($initialContent)
  }

  let tab = currentPath.match(URL_PROFILE_RE)?.[2] || 'tweets'
  log(`on ${tab} tab`)
  observeTimeline(currentPage, {
    isUserTimeline: tab == 'affiliates'
  })

  getElement('a[href="/settings/profile"]', {
    name: 'edit profile button',
    stopIf: pageIsNot(currentPage),
    timeout: 500,
  }).then($editProfileButton => {
    $body.classList.toggle('OwnProfile', Boolean($editProfileButton))
    if (config.hideTwitterBlueUpsells) {
      // This selector is _extremely_ specific to try to avoid false positives
      getElement(mobile ? (
        '[data-testid="primaryColumn"] > div > div > div > div > div > div > div > div > div:has(> div > div > div > a[href^="/i/premium"])'
      ) : (
        '[data-testid="primaryColumn"] > div > div > div > div > div > div:has(> div > div > div > a[href^="/i/premium"])'
      ), {
        name: "you aren't verified yet premium upsell",
        stopIf: pageIsNot(currentPage),
        timeout: 1000,
      }).then($upsell => {
        if ($upsell) {
          $upsell.classList.add('PremiumUpsell')
        }
      })
    }
  })
  let $headerVerifiedIcon = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.TIMELINE_HEADING} [data-testid="icon-verified"]`)
  $body.classList.toggle('PremiumProfile', Boolean($headerVerifiedIcon))

  if (config.replaceLogo || config.hideSubscriptions) {
    let $profileTabs = await getElement(`${Selectors.PRIMARY_COLUMN} nav`, {
      name: 'profile tabs',
      stopIf: pageIsNot(currentPage),
    })
    if (!$profileTabs) return
    // The Profile tabs <nav> can be replaced
    observeElement($profileTabs.parentElement, async (mutations) => {
      if (mutations.length > 0) {
        let $newProfileTabs = findAddedNode(mutations, ($el) => $el instanceof HTMLElement && $el.tagName == 'NAV')
        if ($newProfileTabs == null) return
        $profileTabs = /** @type {HTMLElement} */ ($newProfileTabs)
      }
      if (config.replaceLogo) {
        let $tweetsTabText = await getElement('[data-testid="ScrollSnap-List"] > [role="presentation"]:first-child div[dir] > span:first-child', {
          context: $profileTabs,
          name: 'Tweets tab text',
          stopIf: pageIsNot(currentPage),
        })
        if ($tweetsTabText && $tweetsTabText.textContent != getString('TWEETS')) {
          $tweetsTabText.textContent = getString('TWEETS')
        }
      }
      if (config.hideSubscriptions) {
        let $subscriptionsTabLink = await getElement('a[href$="/superfollows"]', {
          context: $profileTabs,
          name: 'Subscriptions tab link',
          stopIf: pageIsNot(currentPage),
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
    if (config.defaultToLatestSearch) {
      let isTopTabSelected = Boolean($searchTabs.querySelector('div[role="tablist"] > div:nth-child(1) > a[aria-selected="true"]'))
      if (isTopTabSelected) {
        log('switching to Latest tab')
        let $latestTab = /** @type {HTMLAnchorElement} */ (
          $searchTabs.querySelector('div[role="tablist"] > div:nth-child(2) > a')
        )
        $latestTab?.click()
      }
    }
  } else {
    warn('could not find Search tabs')
  }

  observeTimeline(currentPage, {
    hideHeadings: false,
    isTabbed: true,
    tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
  })

  if (desktop) {
    let $emptyFirstSidebarItem = document.querySelector(`${Selectors.SIDEBAR_WRAPPERS} > div:first-child:empty`)
    if ($emptyFirstSidebarItem) {
      log('removing empty first sidebar item from Search sidebar')
      $emptyFirstSidebarItem.remove()
    }
  }
}

function tweakTweetEngagementPage() {
  if (config.replaceLogo) {
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

  if (tweetInteractionsTab) {
    log('switching to tab', tweetInteractionsTab)
    let $tab = /** @type {HTMLAnchorElement} */ (
      $tabs.querySelector(`div[role="tablist"] > div:nth-child(${tweetInteractionsTab}) > a`)
    )
    $tab?.click()
    tweetInteractionsTab = null
  }

  if (config.replaceLogo) {
    let $quoteTweetsTabText = $tabs.querySelector('div[role="tablist"] > div:nth-child(1) div[dir] > span')
    if ($quoteTweetsTabText) $quoteTweetsTabText.textContent = getString('QUOTE_TWEETS')
    let $retweetsTabText = $tabs.querySelector('div[role="tablist"] > div:nth-child(2) div[dir] > span')
    if ($retweetsTabText) $retweetsTabText.textContent = getString('RETWEETS')
  }

  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {classifyTweets: false})
  }
}
//#endregion

//#region Main
async function main() {
  // Don't run on URLs used for OAuth
  if (location.pathname.startsWith('/i/oauth2/authorize') ||
      location.pathname.startsWith('/oauth/authorize')) {
    log('Not running on OAuth URL')
    return
  }

  if (!config.enabled) return

  // Reset state so initial setup runs again when re-enabled
  currentPage = ''
  currentPath = ''
  filterBlurRule = null
  fontFamilyRule = null
  fontSize = null
  lastFlexDirection = null

  // Don't run if we're redirecting to twitter.com
  if (redirectToTwitter()) {
    return
  }

  observeFavicon()
  observeTitle()

  let $appWrapper = await getElement('#layers + div', {name: 'app wrapper'})

  $html = document.querySelector('html')
  $body = document.body
  $reactRoot = document.querySelector('#react-root')
  lang = $html.lang
  dir = $html.dir
  ltr = dir == 'ltr'

  observeElement($appWrapper, () => {
    let flexDirection = getComputedStyle($appWrapper).flexDirection

    mobile = flexDirection == 'column'
    desktop = !mobile

    /** @type {'mobile' | 'desktop'} */
    let version = mobile ? 'mobile' : 'desktop'

    if (version != config.version) {
      log('setting version to', version)
      config.version = version
      // Let the options page know which version is being used
      storeConfigChanges({version})
    }

    if (lastFlexDirection == null) {
      log('initial config', {config, lang, version})

      // One-time setup
      checkReactNativeStylesheet()
      observeBodyBackgroundColor()
      let initialThemeColor = getThemeColorFromState()
      if (initialThemeColor) {
        themeColor = initialThemeColor
      }
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
      observePopups()
      observeSideNavTweetButton()

      // Start taking action on page changes
      observingPageChanges = true

      // Remove the loading stylesheet if the content script added one
      let $loadingStylesheet = document.querySelector('style#cpftLoading')
      if ($loadingStylesheet) {
        requestAnimationFrame(() => $loadingStylesheet.remove())
      }
    }
    else if (flexDirection != lastFlexDirection) {
      configChanged({version})
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

/**
 * @param {Partial<import("./types").Config>} changes
 */
function configChanged(changes) {
  log('config changed', changes)

  if ('enabled' in changes) {
    log(`${changes.enabled ? 'en' : 'dis'}abling extension functionality`)
    if (changes.enabled) {
      // Process the current page if we've just been enabled on it
      observingPageChanges = true
      main()
    } else {
      // These functions have teardowns when disabled
      configureCss()
      configureFeatureFlags()
      configureFont()
      configureDynamicCss()
      configureThemeCss()
      // Manually remove custom UI elements which clone existing elements, as
      // adding a hidden attribute won't hide them by default.
      document.querySelector('#cpftSeparatedTweetsTab')?.remove()
      document.querySelectorAll('.cpft_menu_item').forEach(el => el.remove())
      disconnectObservers(modalObservers, 'modal')
      disconnectObservers(pageObservers, 'page')
      disconnectObservers(globalObservers, 'global')
    }
    return
  }

  if ('redirectToTwitter' in changes && redirectToTwitter()) {
    return
  }

  if ('version' in changes) {
    fontSize = desktop ? $html.style.fontSize : null
  }

  // Apply configuration changes
  configureCss()
  configureFont()
  configureDynamicCss()
  configureThemeCss()
  configureCustomCss()
  observePopups()
  observeSideNavTweetButton()

  if ('replaceLogo' in changes || 'hideNotifications' in changes) {
    observeFavicon.forceUpdate(getNotificationCount() > 0)
  }
  // Store the current notification count if hiding notifications was enabled
  if ('hideNotifications' in changes && config.hideNotifications != 'ignore') {
    hiddenNotificationCount = currentNotificationCount
  }

  let navigationTriggered = (
    configureSeparatedTweetsTimelineTitle() ||
    checkforDisabledHomeTimeline()
  )

  if ('hideNotifications' in changes) {
    // Hide or show the notification count in the title. The title will already
    // have been updated if other navigation was triggered.
    if (!navigationTriggered) {
      setTitle(currentPage)
      navigationTriggered = true
    }
    // Clear the stored notification count if hiding notifications was disabled
    if (config.hideNotifications == 'ignore') {
      hiddenNotificationCount = ''
    }
  }

  // Only re-process the current page if navigation wasn't already triggered
  // while applying config changes.
  if (!navigationTriggered) {
    processCurrentPage()
  }
}

// Initial config and config changes are injected into a <script> element
let $settings = /** @type {HTMLScriptElement} */ (document.querySelector('script#cpftSettings'))
if ($settings) {
  try {
    Object.assign(config, JSON.parse($settings.innerText))
  } catch(e) {
    error('error parsing initial settings', e)
  }

  let settingsChangeObserver = new MutationObserver(() => {
    /** @type {Partial<import("./types").Config>} */
    let configChanges
    try {
      configChanges = JSON.parse($settings.innerText)
    } catch(e) {
      error('error parsing incoming settings change', e)
      return
    }

    if ('debug' in configChanges) {
      log('disabling debug mode')
      debug = configChanges.debug
      log('enabled debug mode')
      configureThemeCss()
      return
    }

    Object.assign(config, configChanges)
    configChanged(configChanges)
  })
  settingsChangeObserver.observe($settings, {childList: true})
}

debug = config.debug

main()
//#endregion

}()