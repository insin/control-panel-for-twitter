// ==UserScript==
// @name        Control Panel for Twitter
// @description Gives you more control over Twitter and adds missing features and UI improvements
// @icon        https://raw.githubusercontent.com/insin/control-panel-for-twitter/master/icons/icon32.png
// @namespace   https://github.com/insin/control-panel-for-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @run-at      document-start
// @version     149
// ==/UserScript==
void function() {

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
  debug: false,
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  defaultToLatestSearch: false,
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  disableTweetTextFormatting: false,
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  hideAdsNav: true,
  hideBlueReplyFollowedBy: false,
  hideBlueReplyFollowing: false,
  hideBookmarkButton: false,
  hideBookmarkMetrics: true,
  hideBookmarksNav: false,
  hideCommunitiesNav: false,
  hideExplorePageContents: true,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideGrokNav: true,
  hideLikeMetrics: true,
  hideListsNav: false,
  hideMetrics: false,
  hideMonetizationNav: true,
  hideMoreTweets: true,
  hideProfileRetweets: false,
  hideQuoteTweetMetrics: true,
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideSeeNewTweets: false,
  hideShareTweetButton: false,
  hideSubscriptions: true,
  hideTimelineTweetBox: false,
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
  reducedInteractionMode: false,
  restoreLinkHeadlines: true,
  replaceLogo: true,
  restoreOtherInteractionLinks: false,
  restoreQuoteTweetsLink: true,
  retweets: 'separate',
  showBlueReplyFollowersCount: false,
  showBlueReplyVerifiedAccounts: false,
  tweakQuoteTweetsPage: true,
  twitterBlueChecks: 'replace',
  uninvertFollowButtons: true,
  // Experiments
  // none currently
  // Desktop only
  fullWidthContent: false,
  fullWidthMedia: true,
  hideAccountSwitcher: false,
  hideExploreNav: true,
  hideExploreNavWithSidebar: true,
  hideMessagesDrawer: true,
  hideProNav: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  navDensity: 'default',
  showRelevantPeople: false,
  // Mobile only
  hideMessagesBottomNavItem: false,
}
//#endregion

//#region Locales
/**
 * @type {Record<string, import("./types").Locale>}
 */
const locales = {
  'ar-x-fm': {
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    HOME: 'الرئيسيّة',
    LIKES: 'الإعجابات',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    POST_ALL: 'نشر الكل',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    REPOST: 'إعادة النشر',
    REPOSTS: 'المنشورات المُعاد نشرها',
    RETWEET: 'إعادة التغريد',
    RETWEETED_BY: 'مُعاد تغريدها بواسطة',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    SHOW: 'إظهار',
    SHOW_MORE_REPLIES: 'عرض المزيد من الردود',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWEET: 'غرّدي',
    TWEETS: 'التغريدات',
    TWEET_ALL: 'تغريد الكل',
    TWEET_INTERACTIONS: 'تفاعلات التغريدة',
    TWEET_YOUR_REPLY: 'التغريد بردك!',
    TWITTER: 'تويتر',
    UNDO_RETWEET: 'التراجع عن التغريدة',
  },
  ar: {
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    HOME: 'الرئيسيّة',
    LIKES: 'الإعجابات',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    POST_ALL: 'نشر الكل',
    QUOTE: 'اقتباس',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    REPOST: 'إعادة النشر',
    REPOSTS: 'المنشورات المُعاد نشرها',
    RETWEET: 'إعادة التغريد',
    RETWEETED_BY: 'مُعاد تغريدها بواسطة',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    SHOW: 'إظهار',
    SHOW_MORE_REPLIES: 'عرض المزيد من الردود',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWEET: 'تغريد',
    TWEETS: 'التغريدات',
    TWEET_ALL: 'تغريد الكل',
    TWEET_INTERACTIONS: 'تفاعلات التغريدة',
    TWEET_YOUR_REPLY: 'التغريد بردك!',
    UNDO_RETWEET: 'التراجع عن التغريدة',
  },
  bg: {
    ADD_MUTED_WORD: 'Добавяне на заглушена дума',
    HOME: 'Начало',
    LIKES: 'Харесвания',
    MUTE_THIS_CONVERSATION: 'Заглушаване на разговора',
    POST_ALL: 'Публикуване на всичко',
    QUOTE: 'Цитат',
    QUOTE_TWEET: 'Цитиране на туита',
    QUOTE_TWEETS: 'Туитове с цитат',
    REPOST: 'Препубликуване',
    REPOSTS: 'Препубликувания',
    RETWEET: 'Ретуитване',
    RETWEETED_BY: 'Ретуитнат от',
    RETWEETS: 'Ретуитове',
    SHARED_TWEETS: 'Споделени туитове',
    SHOW: 'Показване',
    SHOW_MORE_REPLIES: 'Показване на още отговори',
    TURN_OFF_RETWEETS: 'Изключване на ретуитовете',
    TURN_ON_RETWEETS: 'Включване на ретуитовете',
    TWEET: 'Туит',
    TWEETS: 'Туитове',
    TWEET_ALL: 'Туитване на всички',
    TWEET_INTERACTIONS: 'Интеракции с туит',
    TWEET_YOUR_REPLY: 'Отговори с туит!',
    UNDO_RETWEET: 'Отмяна на ретуитването',
  },
  bn: {
    ADD_MUTED_WORD: 'নীরব করা শব্দ যোগ করুন',
    HOME: 'হোম',
    LIKES: 'পছন্দ',
    MUTE_THIS_CONVERSATION: 'এই কথা-বার্তা নীরব করুন',
    POST_ALL: 'সবকটি পোস্ট করুন',
    QUOTE: 'উদ্ধৃতি',
    QUOTE_TWEET: 'টুইট উদ্ধৃত করুন',
    QUOTE_TWEETS: 'টুইট উদ্ধৃতিগুলো',
    REPOST: 'রিপোস্ট',
    REPOSTS: 'রিপোস্ট',
    RETWEET: 'পুনঃটুইট',
    RETWEETED_BY: 'পুনঃ টুইট করেছেন',
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
    SHOW: 'দেখান',
    SHOW_MORE_REPLIES: 'আরও উত্তর দেখান',
    TURN_OFF_RETWEETS: 'পুনঃ টুইটগুলি বন্ধ করুন',
    TURN_ON_RETWEETS: 'পুনঃ টুইটগুলি চালু করুন',
    TWEET: 'টুইট',
    TWEETS: 'টুইটগুলি',
    TWEET_ALL: 'সব টুইট করুন',
    TWEET_INTERACTIONS: 'টুইট ইন্টারেকশন',
    TWEET_YOUR_REPLY: 'আপনার উত্তর টুইট করুন!',
    TWITTER: 'টুইটার',
    UNDO_RETWEET: 'পুনঃ টুইট পুর্বাবস্থায় ফেরান',
  },
  ca: {
    ADD_MUTED_WORD: 'Afegeix una paraula silenciada',
    HOME: 'Inici',
    LIKES: 'Agradaments',
    MUTE_THIS_CONVERSATION: 'Silencia la conversa',
    POST_ALL: 'Publica-ho tot',
    QUOTE: 'Cita',
    QUOTE_TWEET: 'Cita el tuit',
    QUOTE_TWEETS: 'Tuits amb cita',
    REPOST: 'Republicació',
    REPOSTS: 'Republicacions',
    RETWEET: 'Retuit',
    RETWEETED_BY: 'Retuitat per',
    RETWEETS: 'Retuits',
    SHARED_TWEETS: 'Tuits compartits',
    SHOW: 'Mostra',
    SHOW_MORE_REPLIES: 'Mostra més respostes',
    TURN_OFF_RETWEETS: 'Desactiva els retuits',
    TURN_ON_RETWEETS: 'Activa els retuits',
    TWEET: 'Tuita',
    TWEETS: 'Tuits',
    TWEET_ALL: 'Tuita-ho tot',
    TWEET_INTERACTIONS: 'Interaccions amb tuits',
    TWEET_YOUR_REPLY: 'Tuita la teva resposta',
    UNDO_RETWEET: 'Desfés el retuit',
  },
  cs: {
    ADD_MUTED_WORD: 'Přidat slovo na seznam skrytých slov',
    HOME: 'Hlavní stránka',
    LIKES: 'Lajky',
    MUTE_THIS_CONVERSATION: 'Skrýt tuto konverzaci',
    POST_ALL: 'Postovat vše',
    QUOTE: 'Citace',
    QUOTE_TWEET: 'Citovat Tweet',
    QUOTE_TWEETS: 'Tweety s citací',
    REPOSTS: 'Reposty',
    RETWEET: 'Retweetnout',
    RETWEETED_BY: 'Retweetnuto uživateli',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Sdílené tweety',
    SHOW: 'Zobrazit',
    SHOW_MORE_REPLIES: 'Zobrazit další odpovědi',
    TURN_OFF_RETWEETS: 'Vypnout retweety',
    TURN_ON_RETWEETS: 'Zapnout retweety',
    TWEET: 'Tweetovat',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnout vše',
    TWEET_INTERACTIONS: 'Tweetovat interakce',
    TWEET_YOUR_REPLY: 'Tweetujte svou odpověď!',
    UNDO_RETWEET: 'Zrušit Retweet',
  },
  da: {
    ADD_MUTED_WORD: 'Tilføj skjult ord',
    HOME: 'Forside',
    LIKES: 'Likes',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtale',
    POST_ALL: 'Post alle',
    QUOTE: 'Citat',
    QUOTE_TWEET: 'Citér Tweet',
    QUOTE_TWEETS: 'Citat-Tweets',
    RETWEETED_BY: 'Retweetet af',
    SHARED_TWEETS: 'Delte tweets',
    SHOW: 'Vis',
    SHOW_MORE_REPLIES: 'Vis flere svar',
    TURN_OFF_RETWEETS: 'Slå Retweets fra',
    TURN_ON_RETWEETS: 'Slå Retweets til',
    TWEET_ALL: 'Tweet alt',
    TWEET_INTERACTIONS: 'Tweet-interaktioner',
    TWEET_YOUR_REPLY: 'Tweet dit svar!',
    UNDO_RETWEET: 'Fortryd Retweet',
  },
  de: {
    ADD_MUTED_WORD: 'Stummgeschaltetes Wort hinzufügen',
    HOME: 'Startseite',
    LIKES: 'Gefällt mir',
    MUTE_THIS_CONVERSATION: 'Diese Konversation stummschalten',
    POST_ALL: 'Alle posten',
    QUOTE: 'Zitat',
    QUOTE_TWEET: 'Tweet zitieren',
    QUOTE_TWEETS: 'Zitierte Tweets',
    REPOST: 'Reposten',
    RETWEET: 'Retweeten',
    RETWEETED_BY: 'Retweetet von',
    SHARED_TWEETS: 'Geteilte Tweets',
    SHOW: 'Anzeigen',
    SHOW_MORE_REPLIES: 'Mehr Antworten anzeigen',
    TURN_OFF_RETWEETS: 'Retweets ausschalten',
    TURN_ON_RETWEETS: 'Retweets einschalten',
    TWEET: 'Twittern',
    TWEET_ALL: 'Alle twittern',
    TWEET_INTERACTIONS: 'Tweet-Interaktionen',
    TWEET_YOUR_REPLY: 'Twittere deine Antwort!',
    UNDO_RETWEET: 'Retweet rückgängig machen',
  },
  el: {
    ADD_MUTED_WORD: 'Προσθήκη λέξης σε σίγαση',
    HOME: 'Αρχική σελίδα',
    LIKES: '"Μου αρέσει"',
    MUTE_THIS_CONVERSATION: 'Σίγαση αυτής της συζήτησης',
    POST_ALL: 'Δημοσίευση όλων',
    QUOTE: 'Παράθεση',
    QUOTE_TWEET: 'Παράθεση Tweet',
    QUOTE_TWEETS: 'Tweet με παράθεση',
    REPOST: 'Αναδημοσίευση',
    REPOSTS: 'Αναδημοσιεύσεις',
    RETWEETED_BY: 'Έγινε Retweet από',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
    SHOW: 'Εμφάνιση',
    SHOW_MORE_REPLIES: 'Εμφάνιση περισσότερων απαντήσεων',
    TURN_OFF_RETWEETS: 'Απενεργοποίηση των Retweet',
    TURN_ON_RETWEETS: 'Ενεργοποίηση των Retweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Δημοσίευση όλων ως Tweet',
    TWEET_INTERACTIONS: 'Αλληλεπιδράσεις με tweet',
    TWEET_YOUR_REPLY: 'Στείλτε την απάντησή σας!',
    UNDO_RETWEET: 'Αναίρεση Retweet',
  },
  en: {
    ADD_MUTED_WORD: 'Add muted word',
    HOME: 'Home',
    LIKES: 'Likes',
    MUTE_THIS_CONVERSATION: 'Mute this conversation',
    POST_ALL: 'Post all',
    QUOTE: 'Quote',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    REPOST: 'Repost',
    REPOSTS: 'Reposts',
    RETWEET: 'Retweet',
    RETWEETED_BY: 'Retweeted by',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
    SHOW: 'Show',
    SHOW_MORE_REPLIES: 'Show more replies',
    TURN_OFF_RETWEETS: 'Turn off Retweets',
    TURN_ON_RETWEETS: 'Turn on Retweets',
    TWEET: 'Tweet',
    TWEETS: 'Tweets',
    TWEET_ALL: 'Tweet all',
    TWEET_INTERACTIONS: 'Tweet interactions',
    TWEET_YOUR_REPLY: 'Tweet your reply!',
    TWITTER: 'Twitter',
    UNDO_RETWEET: 'Undo Retweet',
  },
  es: {
    ADD_MUTED_WORD: 'Añadir palabra silenciada',
    HOME: 'Inicio',
    LIKES: 'Me gusta',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversación',
    POST_ALL: 'Postear todo',
    QUOTE: 'Cita',
    QUOTE_TWEET: 'Citar Tweet',
    QUOTE_TWEETS: 'Tweets citados',
    REPOST: 'Repostear',
    RETWEET: 'Retwittear',
    RETWEETED_BY: 'Retwitteado por',
    SHARED_TWEETS: 'Tweets compartidos',
    SHOW: 'Mostrar',
    SHOW_MORE_REPLIES: 'Mostrar más respuestas',
    TURN_OFF_RETWEETS: 'Desactivar Retweets',
    TURN_ON_RETWEETS: 'Activar Retweets',
    TWEET: 'Twittear',
    TWEET_ALL: 'Twittear todo',
    TWEET_INTERACTIONS: 'Interacciones con Tweet',
    TWEET_YOUR_REPLY: '¡Twittea tu respuesta!',
    UNDO_RETWEET: 'Deshacer Retweet',
  },
  eu: {
    ADD_MUTED_WORD: 'Gehitu isilarazitako hitza',
    HOME: 'Hasiera',
    LIKES: 'Atsegiteak',
    MUTE_THIS_CONVERSATION: 'Isilarazi elkarrizketa hau',
    QUOTE: 'Aipamena',
    QUOTE_TWEET: 'Txioa apaitu',
    QUOTE_TWEETS: 'Aipatu txioak',
    RETWEET: 'Bertxiotu',
    RETWEETED_BY: 'Bertxiotua:',
    RETWEETS: 'Bertxioak',
    SHARED_TWEETS: 'Partekatutako',
    SHOW: 'Erakutsi',
    SHOW_MORE_REPLIES: 'Erakutsi erantzun gehiago',
    TURN_OFF_RETWEETS: 'Desaktibatu birtxioak',
    TURN_ON_RETWEETS: 'Aktibatu birtxioak',
    TWEET: 'Txio',
    TWEETS: 'Txioak',
    TWEET_ALL: 'Txiotu guztiak',
    TWEET_INTERACTIONS: 'Txio elkarrekintzak',
    UNDO_RETWEET: 'Desegin birtxiokatzea',
  },
  fa: {
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    HOME: 'خانه',
    LIKES: 'پسندها',
    MUTE_THIS_CONVERSATION: 'خموش‌سازی این گفتگو',
    POST_ALL: 'پست کردن همه',
    QUOTE: 'نقل‌قول',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت‌ها',
    REPOST: 'بازپست',
    REPOSTS: 'بازپست‌ها',
    RETWEET: 'بازتوییت',
    RETWEETED_BY: 'بازتوییت‌ شد توسط',
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
    SHOW: 'نمایش',
    SHOW_MORE_REPLIES: 'نمایش پاسخ‌های بیشتر',
    TURN_OFF_RETWEETS: 'غیرفعال‌سازی بازتوییت‌ها',
    TURN_ON_RETWEETS: 'فعال سازی بازتوییت‌ها',
    TWEET: 'توییت',
    TWEETS: 'توييت‌ها',
    TWEET_ALL: 'توییت به همه',
    TWEET_INTERACTIONS: 'تعاملات توییت',
    TWEET_YOUR_REPLY: 'پاسختان را توییت کنید!',
    TWITTER: 'توییتر',
    UNDO_RETWEET: 'لغو بازتوییت',
  },
  fi: {
    ADD_MUTED_WORD: 'Lisää hiljennetty sana',
    HOME: 'Etusivu',
    LIKES: 'Tykkäykset',
    MUTE_THIS_CONVERSATION: 'Hiljennä tämä keskustelu',
    POST_ALL: 'Julkaise kaikki',
    QUOTE: 'Lainaa',
    QUOTE_TWEET: 'Twiitin lainaus',
    QUOTE_TWEETS: 'Twiitin lainaukset',
    REPOST: 'Uudelleenjulkaise',
    REPOSTS: 'Uudelleenjulkaisut',
    RETWEET: 'Uudelleentwiittaa',
    RETWEETED_BY: 'Uudelleentwiitannut',
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED_TWEETS: 'Jaetut twiitit',
    SHOW: 'Näytä',
    SHOW_MORE_REPLIES: 'Näytä lisää vastauksia',
    TURN_OFF_RETWEETS: 'Poista uudelleentwiittaukset käytöstä',
    TURN_ON_RETWEETS: 'Ota uudelleentwiittaukset käyttöön',
    TWEET: 'Twiittaa',
    TWEETS: 'Twiitit',
    TWEET_ALL: 'Twiittaa kaikki',
    TWEET_INTERACTIONS: 'Twiitin vuorovaikutukset',
    TWEET_YOUR_REPLY: 'Twiittaa vastauksesi',
    UNDO_RETWEET: 'Kumoa uudelleentwiittaus',
  },
  fil: {
    ADD_MUTED_WORD: 'Idagdag ang naka-mute na salita',
    LIKES: 'Mga Gusto',
    MUTE_THIS_CONVERSATION: 'I-mute ang usapang ito',
    POST_ALL: 'I-post lahat',
    QUOTE_TWEET: 'Quote na Tweet',
    QUOTE_TWEETS: 'Mga Quote na Tweet',
    REPOST: 'I-repost',
    REPOSTS: '(na) Repost',
    RETWEET: 'I-retweet',
    RETWEETED_BY: 'Ni-retweet ni',
    RETWEETS: 'Mga Retweet',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
    SHOW: 'Ipakita',
    SHOW_MORE_REPLIES: 'Magpakita pa ng mga sagot',
    TURN_OFF_RETWEETS: 'I-off ang Retweets',
    TURN_ON_RETWEETS: 'I-on ang Retweets',
    TWEET: 'Mag-tweet',
    TWEETS: 'Mga Tweet',
    TWEET_ALL: 'I-tweet lahat',
    TWEET_INTERACTIONS: 'Interaksyon sa Tweet',
    TWEET_YOUR_REPLY: 'I-Tweet ang sagot mo!',
    UNDO_RETWEET: 'Huwag nang I-retweet',
  },
  fr: {
    ADD_MUTED_WORD: 'Ajouter un mot masqué',
    HOME: 'Accueil',
    LIKES: "J'aime",
    MUTE_THIS_CONVERSATION: 'Masquer cette conversation',
    POST_ALL: 'Tout poster',
    QUOTE: 'Citation',
    QUOTE_TWEET: 'Citer le Tweet',
    QUOTE_TWEETS: 'Tweets cités',
    RETWEET: 'Retweeter',
    RETWEETED_BY: 'Retweeté par',
    SHARED_TWEETS: 'Tweets partagés',
    SHOW: 'Afficher',
    SHOW_MORE_REPLIES: 'Voir plus de réponses',
    TURN_OFF_RETWEETS: 'Désactiver les Retweets',
    TURN_ON_RETWEETS: 'Activer les Retweets',
    TWEET: 'Tweeter',
    TWEET_ALL: 'Tout tweeter',
    TWEET_INTERACTIONS: 'Interactions avec Tweet',
    TWEET_YOUR_REPLY: 'Tweetez votre réponse!',
    UNDO_RETWEET: 'Annuler le Retweet',
  },
  ga: {
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    HOME: 'Baile',
    LIKES: 'Thaitin siad seo le',
    MUTE_THIS_CONVERSATION: 'Balbhaigh an comhrá seo',
    QUOTE: 'Sliocht',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Luaigh Tvuíteanna',
    RETWEET: 'Atweetáil',
    RETWEETED_BY: 'Atweetáilte ag',
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
    SHOW: 'Taispeáin',
    SHOW_MORE_REPLIES: 'Taispeáin tuilleadh freagraí',
    TURN_OFF_RETWEETS: 'Cas as Atweetanna',
    TURN_ON_RETWEETS: 'Cas Atweetanna air',
    TWEETS: 'Tweetanna',
    TWEET_ALL: 'Tweetáil gach rud',
    TWEET_INTERACTIONS: 'Idirghníomhaíochtaí le Tweet',
    UNDO_RETWEET: 'Cuir an Atweet ar ceal',
  },
  gl: {
    ADD_MUTED_WORD: 'Engadir palabra silenciada',
    HOME: 'Inicio',
    LIKES: 'Gústames',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    QUOTE: 'Cita',
    QUOTE_TWEET: 'Citar chío',
    QUOTE_TWEETS: 'Chíos citados',
    RETWEET: 'Rechouchiar',
    RETWEETED_BY: 'Rechouchiado por',
    RETWEETS: 'Rechouchíos',
    SHARED_TWEETS: 'Chíos compartidos',
    SHOW: 'Amosar',
    SHOW_MORE_REPLIES: 'Amosar máis respostas',
    TURN_OFF_RETWEETS: 'Desactivar os rechouchíos',
    TURN_ON_RETWEETS: 'Activar os rechouchíos',
    TWEET: 'Chío',
    TWEETS: 'Chíos',
    TWEET_ALL: 'Chiar todo',
    TWEET_INTERACTIONS: 'Interaccións chío',
    UNDO_RETWEET: 'Desfacer rechouchío',
  },
  gu: {
    ADD_MUTED_WORD: 'જોડાણ અટકાવેલો શબ્દ ઉમેરો',
    HOME: 'હોમ',
    LIKES: 'લાઈક્સ',
    MUTE_THIS_CONVERSATION: 'આ વાર્તાલાપનું જોડાણ અટકાવો',
    POST_ALL: 'બધા પોસ્ટ કરો',
    QUOTE: 'અવતરણ',
    QUOTE_TWEET: 'અવતરણની સાથે ટ્વીટ કરો',
    QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ',
    REPOST: 'રીપોસ્ટ કરો',
    REPOSTS: 'ફરીથી કરવામાં આવેલી પોસ્ટ',
    RETWEET: 'પુનટ્વીટ',
    RETWEETED_BY: 'આમની દ્વારા પુનટ્વીટ કરવામાં આવી',
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
    SHOW: 'બતાવો',
    SHOW_MORE_REPLIES: 'વધુ પ્રત્યુતરો દર્શાવો',
    TURN_OFF_RETWEETS: 'પુનટ્વીટ્સ બંધ કરો',
    TURN_ON_RETWEETS: 'પુનટ્વીટ્સ ચાલુ કરો',
    TWEET: 'ટ્વીટ',
    TWEETS: 'ટ્વીટ્સ',
    TWEET_ALL: 'બધાને ટ્વીટ કરો',
    TWEET_INTERACTIONS: 'ટ્વીટ ક્રિયાપ્રતિક્રિયાઓ',
    TWEET_YOUR_REPLY: 'તમારા પ્રત્યુત્તરને ટ્વીટ કરો!',
    UNDO_RETWEET: 'પુનટ્વીટને પૂર્વવત કરો',
  },
  he: {
    ADD_MUTED_WORD: 'הוסף מילה מושתקת',
    HOME: 'דף הבית',
    LIKES: 'הערות "אהבתי"',
    MUTE_THIS_CONVERSATION: 'להשתיק את השיחה הזאת',
    POST_ALL: 'פרסום הכל',
    QUOTE: 'ציטוט',
    QUOTE_TWEET: 'ציטוט ציוץ',
    QUOTE_TWEETS: 'ציוצי ציטוט',
    REPOST: 'לפרסם מחדש',
    REPOSTS: 'פרסומים מחדש',
    RETWEET: 'צייץ מחדש',
    RETWEETED_BY: 'צויץ מחדש על־ידי',
    RETWEETS: 'ציוצים מחדש',
    SHARED_TWEETS: 'ציוצים משותפים',
    SHOW: 'הצג',
    SHOW_MORE_REPLIES: 'הצג תשובות נוספות',
    TURN_OFF_RETWEETS: 'כבה ציוצים מחדש',
    TURN_ON_RETWEETS: 'הפעל ציוצים מחדש',
    TWEET: 'צייץ',
    TWEETS: 'ציוצים',
    TWEET_ALL: 'צייץ הכול',
    TWEET_INTERACTIONS: 'אינטראקציות צייץ',
    TWEET_YOUR_REPLY: 'צייץ את התשובה!',
    TWITTER: 'טוויטר',
    UNDO_RETWEET: 'ביטול ציוץ מחדש',
  },
  hi: {
    ADD_MUTED_WORD: 'म्यूट किया गया शब्द जोड़ें',
    HOME: 'होम',
    LIKES: 'पसंद',
    MUTE_THIS_CONVERSATION: 'इस बातचीत को म्यूट करें',
    POST_ALL: 'सभी पोस्ट करें',
    QUOTE: 'कोट',
    QUOTE_TWEET: 'ट्वीट क्वोट करें',
    QUOTE_TWEETS: 'कोट ट्वीट्स',
    REPOST: 'रीपोस्ट',
    REPOSTS: 'रीपोस्ट्स',
    RETWEET: 'रीट्वीट करें',
    RETWEETED_BY: 'इनके द्वारा रीट्वीट किया गया',
    RETWEETS: 'रीट्वीट्स',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
    SHOW: 'दिखाएं',
    SHOW_MORE_REPLIES: 'और अधिक जवाब दिखाएँ',
    TURN_OFF_RETWEETS: 'रीट्वीट बंद करें',
    TURN_ON_RETWEETS: 'रीट्वीट चालू करें',
    TWEET: 'ट्वीट करें',
    TWEETS: 'ट्वीट',
    TWEET_ALL: 'सभी ट्वीट करें',
    TWEET_INTERACTIONS: 'ट्वीट इंटरैक्शन',
    TWEET_YOUR_REPLY: 'अपना जवाब ट्वीट करें!',
    UNDO_RETWEET: 'रीट्वीट को पूर्ववत करें',
  },
  hr: {
    ADD_MUTED_WORD: 'Dodaj onemogućenu riječ',
    HOME: 'Naslovnica',
    LIKES: 'Oznake „sviđa mi se”',
    MUTE_THIS_CONVERSATION: 'Isključi zvuk ovog razgovora',
    POST_ALL: 'Objavi sve',
    QUOTE: 'Citat',
    QUOTE_TWEET: 'Citiraj Tweet',
    QUOTE_TWEETS: 'Citirani tweetovi',
    REPOST: 'Proslijedi objavu',
    REPOSTS: 'Proslijeđene objave',
    RETWEET: 'Proslijedi tweet',
    RETWEETED_BY: 'Korisnici koji su proslijedili Tweet',
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
    SHOW: 'Prikaži',
    SHOW_MORE_REPLIES: 'Prikaži još odgovora',
    TURN_OFF_RETWEETS: 'Isključi proslijeđene tweetove',
    TURN_ON_RETWEETS: 'Uključi proslijeđene tweetove',
    TWEETS: 'Tweetovi',
    TWEET_ALL: 'Tweetaj sve',
    TWEET_INTERACTIONS: 'Interakcije s Tweet',
    TWEET_YOUR_REPLY: 'Pošaljite Tweet s odgovorom!',
    UNDO_RETWEET: 'Poništi prosljeđivanje tweeta',
  },
  hu: {
    ADD_MUTED_WORD: 'Elnémított szó hozzáadása',
    HOME: 'Kezdőlap',
    LIKES: 'Kedvelések',
    MUTE_THIS_CONVERSATION: 'Beszélgetés némítása',
    POST_ALL: 'Az összes közzététele',
    QUOTE: 'Idézés',
    QUOTE_TWEET: 'Tweet idézése',
    QUOTE_TWEETS: 'Tweet-idézések',
    REPOST: 'Újraposztolás',
    REPOSTS: 'Újraposztolások',
    RETWEETED_BY: 'Retweetelte',
    RETWEETS: 'Retweetek',
    SHARED_TWEETS: 'Megosztott tweetek',
    SHOW: 'Megjelenítés',
    SHOW_MORE_REPLIES: 'Több válasz megjelenítése',
    TURN_OFF_RETWEETS: 'Retweetek kikapcsolása',
    TURN_ON_RETWEETS: 'Retweetek bekapcsolása',
    TWEET: 'Tweetelj',
    TWEETS: 'Tweetek',
    TWEET_ALL: 'Tweet küldése mindenkinek',
    TWEET_INTERACTIONS: 'Tweet interakciók',
    TWEET_YOUR_REPLY: 'Tweeteld válaszodat',
    UNDO_RETWEET: 'Retweet visszavonása',
  },
  id: {
    ADD_MUTED_WORD: 'Tambahkan kata kunci yang dibisukan',
    HOME: 'Beranda',
    LIKES: 'Suka',
    MUTE_THIS_CONVERSATION: 'Bisukan percakapan ini',
    POST_ALL: 'Posting semua',
    QUOTE: 'Kutipan',
    QUOTE_TWEET: 'Kutip Tweet',
    QUOTE_TWEETS: 'Tweet Kutipan',
    REPOST: 'Posting ulang',
    REPOSTS: 'Posting ulang',
    RETWEETED_BY: 'Di-retweet oleh',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
    SHOW: 'Tampilkan',
    SHOW_MORE_REPLIES: 'Tampilkan balasan lainnya',
    TURN_OFF_RETWEETS: 'Matikan Retweet',
    TURN_ON_RETWEETS: 'Nyalakan Retweet',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Tweet semua',
    TWEET_INTERACTIONS: 'Interaksi Tweet',
    TWEET_YOUR_REPLY: 'Tweet balasan Anda!',
    UNDO_RETWEET: 'Batalkan Retweet',
  },
  it: {
    ADD_MUTED_WORD: 'Aggiungi parola o frase silenziata',
    LIKES: 'Mi piace',
    MUTE_THIS_CONVERSATION: 'Silenzia questa conversazione',
    POST_ALL: 'Pubblica tutto',
    QUOTE: 'Citazione',
    QUOTE_TWEET: 'Cita Tweet',
    QUOTE_TWEETS: 'Tweet di citazione',
    REPOSTS: 'Repost',
    RETWEET: 'Ritwitta',
    RETWEETED_BY: 'Ritwittato da',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet condivisi',
    SHOW: 'Mostra',
    SHOW_MORE_REPLIES: 'Mostra altre risposte',
    TURN_OFF_RETWEETS: 'Disattiva Retweet',
    TURN_ON_RETWEETS: 'Attiva Retweet',
    TWEET: 'Twitta',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Twitta tutto',
    TWEET_INTERACTIONS: 'Interazioni con Tweet',
    TWEET_YOUR_REPLY: 'Twitta la tua risposta.',
    UNDO_RETWEET: 'Annulla Retweet',
  },
  ja: {
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    HOME: 'ホーム',
    LIKES: 'いいね',
    MUTE_THIS_CONVERSATION: 'この会話をミュート',
    POST_ALL: 'すべてポスト',
    QUOTE: '引用',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    REPOST: 'リポスト',
    REPOSTS: 'リポスト',
    RETWEET: 'リツイート',
    RETWEETED_BY: 'リツイートしたユーザー',
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
    SHOW: '表示',
    SHOW_MORE_REPLIES: '返信をさらに表示',
    TURN_OFF_RETWEETS: 'リツイートをオフにする',
    TURN_ON_RETWEETS: 'リツイートをオンにする',
    TWEET: 'ツイートする',
    TWEETS: 'ツイート',
    TWEET_ALL: 'すべてツイート',
    TWEET_INTERACTIONS: 'ツイートの相互作用',
    TWEET_YOUR_REPLY: '返信をツイートしましょう。',
    UNDO_RETWEET: 'リツイートを取り消す',
  },
  kn: {
    ADD_MUTED_WORD: 'ಸದ್ದಡಗಿಸಿದ ಪದವನ್ನು ಸೇರಿಸಿ',
    HOME: 'ಹೋಮ್',
    LIKES: 'ಇಷ್ಟಗಳು',
    MUTE_THIS_CONVERSATION: 'ಈ ಸಂವಾದವನ್ನು ಸದ್ದಡಗಿಸಿ',
    POST_ALL: 'ಎಲ್ಲವನ್ನೂ ಪೋಸ್ಟ್ ಮಾಡಿ',
    QUOTE: 'ಕೋಟ್‌',
    QUOTE_TWEET: 'ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ',
    QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು',
    REPOST: 'ಮರುಪೋಸ್ಟ್ ಮಾಡಿ',
    REPOSTS: 'ಮರುಪೋಸ್ಟ್‌ಗಳು',
    RETWEET: 'ಮರುಟ್ವೀಟಿಸಿ',
    RETWEETED_BY: 'ಮರುಟ್ವೀಟಿಸಿದವರು',
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
    SHOW: 'ತೋರಿಸಿ',
    SHOW_MORE_REPLIES: 'ಇನ್ನಷ್ಟು ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ತೋರಿಸಿ',
    TURN_OFF_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ',
    TURN_ON_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆನ್ ಮಾಡಿ',
    TWEET: 'ಟ್ವೀಟ್',
    TWEETS: 'ಟ್ವೀಟ್‌ಗಳು',
    TWEET_ALL: 'ಎಲ್ಲಾ ಟ್ವೀಟ್ ಮಾಡಿ',
    TWEET_INTERACTIONS: 'ಟ್ವೀಟ್ ಸಂವಾದಗಳು',
    TWEET_YOUR_REPLY: 'ನಿಮ್ಮ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಟ್ವೀಟ್ ಮಾಡಿ!',
    UNDO_RETWEET: 'ಮರುಟ್ವೀಟಿಸುವುದನ್ನು ರದ್ದುಮಾಡಿ',
  },
  ko: {
    ADD_MUTED_WORD: '뮤트할 단어 추가하기',
    HOME: '홈',
    LIKES: '마음에 들어요',
    MUTE_THIS_CONVERSATION: '이 대화 뮤트하기',
    POST_ALL: '모두 게시하기',
    QUOTE: '인용',
    QUOTE_TWEET: '트윗 인용하기',
    QUOTE_TWEETS: '트윗 인용하기',
    REPOST: '재게시',
    REPOSTS: '재게시',
    RETWEET: '리트윗',
    RETWEETED_BY: '리트윗함',
    RETWEETS: '리트윗',
    SHARED_TWEETS: '공유 트윗',
    SHOW: '표시',
    SHOW_MORE_REPLIES: '더 많은 답글 보기',
    TURN_OFF_RETWEETS: '리트윗 끄기',
    TURN_ON_RETWEETS: '리트윗 켜기',
    TWEET: '트윗',
    TWEETS: '트윗',
    TWEET_ALL: '모두 트윗하기',
    TWEET_INTERACTIONS: '트윗 상호작용',
    TWEET_YOUR_REPLY: '내 답글을 트윗하세요',
    TWITTER: '트위터',
    UNDO_RETWEET: '리트윗 취소',
  },
  mr: {
    ADD_MUTED_WORD: 'म्यूट केलेले शब्द सामील करा',
    HOME: 'होम',
    LIKES: 'पसंती',
    MUTE_THIS_CONVERSATION: 'ही चर्चा म्यूट करा',
    POST_ALL: 'सर्व पोस्ट करा',
    QUOTE: 'भाष्य',
    QUOTE_TWEET: 'ट्विट वर भाष्य करा',
    QUOTE_TWEETS: 'भाष्य ट्विट्स',
    REPOST: 'पुन्हा पोस्ट करा',
    REPOSTS: 'रिपोस्ट',
    RETWEET: 'पुन्हा ट्विट',
    RETWEETED_BY: 'यांनी पुन्हा ट्विट केले',
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED_TWEETS: 'सामायिक ट्विट',
    SHOW: 'दाखवा',
    SHOW_MORE_REPLIES: 'अधिक प्रत्युत्तरे दाखवा',
    TURN_OFF_RETWEETS: 'पुनर्ट्विट्स बंद करा',
    TURN_ON_RETWEETS: 'पुनर्ट्विट्स चालू करा',
    TWEET: 'ट्विट',
    TWEETS: 'ट्विट्स',
    TWEET_ALL: 'सर्व ट्विट करा',
    TWEET_INTERACTIONS: 'ट्वीट इंटरऍक्शन्स',
    TWEET_YOUR_REPLY: 'आपल्या प्रत्युत्तरावर ट्विट करा!',
    UNDO_RETWEET: 'पुनर्ट्विट पूर्ववत करा',
  },
  ms: {
    ADD_MUTED_WORD: 'Tambahkan perkataan yang disenyapkan',
    HOME: 'Laman Utama',
    LIKES: 'Suka',
    MUTE_THIS_CONVERSATION: 'Senyapkan perbualan ini',
    POST_ALL: 'Siarkan semua',
    QUOTE: 'Petikan',
    QUOTE_TWEET: 'Petik Tweet',
    QUOTE_TWEETS: 'Tweet Petikan',
    REPOST: 'Siaran semula',
    REPOSTS: 'Siaran semula',
    RETWEET: 'Tweet semula',
    RETWEETED_BY: 'Ditweet semula oleh',
    RETWEETS: 'Tweet semula',
    SHARED_TWEETS: 'Tweet Berkongsi',
    SHOW: 'Tunjukkan',
    SHOW_MORE_REPLIES: 'Tunjukkan lagi balasan',
    TURN_OFF_RETWEETS: 'Matikan Tweet semula',
    TURN_ON_RETWEETS: 'Hidupkan Tweet semula',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Tweet semua',
    TWEET_INTERACTIONS: 'Interaksi Tweet',
    TWEET_YOUR_REPLY: 'Tweet balasan anda!',
    UNDO_RETWEET: 'Buat asal Tweet semula',
  },
  nb: {
    ADD_MUTED_WORD: 'Skjul nytt ord',
    HOME: 'Hjem',
    LIKES: 'Liker',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtalen',
    POST_ALL: 'Publiser alle',
    QUOTE: 'Sitat',
    QUOTE_TWEET: 'Sitat-Tweet',
    QUOTE_TWEETS: 'Sitat-Tweets',
    REPOST: 'Republiser',
    REPOSTS: 'Republiseringer',
    RETWEETED_BY: 'Retweetet av',
    SHARED_TWEETS: 'Delte tweets',
    SHOW: 'Vis',
    SHOW_MORE_REPLIES: 'Vis flere svar',
    TURN_OFF_RETWEETS: 'Slå av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
    TWEET_ALL: 'Tweet alle',
    TWEET_INTERACTIONS: 'Tweet-interaksjoner',
    TWEET_YOUR_REPLY: 'Tweet svaret ditt!',
    UNDO_RETWEET: 'Angre Retweet',
  },
  nl: {
    ADD_MUTED_WORD: 'Genegeerd woord toevoegen',
    HOME: 'Startpagina',
    LIKES: 'Vind-ik-leuks',
    MUTE_THIS_CONVERSATION: 'Dit gesprek negeren',
    POST_ALL: 'Alles plaatsen',
    QUOTE: 'Geciteerd',
    QUOTE_TWEET: 'Citeer Tweet',
    QUOTE_TWEETS: 'Geciteerde Tweets',
    RETWEET: 'Retweeten',
    RETWEETED_BY: 'Geretweet door',
    SHARED_TWEETS: 'Gedeelde Tweets',
    SHOW: 'Weergeven',
    SHOW_MORE_REPLIES: 'Meer antwoorden tonen',
    TURN_OFF_RETWEETS: 'Retweets uitschakelen',
    TURN_ON_RETWEETS: 'Retweets inschakelen',
    TWEET: 'Tweeten',
    TWEET_ALL: 'Alles tweeten',
    TWEET_INTERACTIONS: 'Tweet-interacties',
    TWEET_YOUR_REPLY: 'Tweet je antwoord!',
    UNDO_RETWEET: 'Retweet ongedaan maken',
  },
  pl: {
    ADD_MUTED_WORD: 'Dodaj wyciszone słowo',
    HOME: 'Główna',
    LIKES: 'Polubienia',
    MUTE_THIS_CONVERSATION: 'Wycisz tę rozmowę',
    POST_ALL: 'Opublikuj wszystko',
    QUOTE: 'Cytuj',
    QUOTE_TWEET: 'Cytuj Tweeta',
    QUOTE_TWEETS: 'Cytaty z Tweeta',
    REPOST: 'Podaj dalej wpis',
    REPOSTS: 'Wpisy podane dalej',
    RETWEET: 'Podaj dalej',
    RETWEETED_BY: 'Podane dalej przez',
    RETWEETS: 'Tweety podane dalej',
    SHARED_TWEETS: 'Udostępnione Tweety',
    SHOW: 'Pokaż',
    SHOW_MORE_REPLIES: 'Pokaż więcej odpowiedzi',
    TURN_OFF_RETWEETS: 'Wyłącz Tweety podane dalej',
    TURN_ON_RETWEETS: 'Włącz Tweety podane dalej',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnij wszystko',
    TWEET_INTERACTIONS: 'Interakcje na Tweeta',
    TWEET_YOUR_REPLY: 'Wyślij Tweeta z odpowiedzią!',
    UNDO_RETWEET: 'Cofnij podanie dalej',
  },
  pt: {
    ADD_MUTED_WORD: 'Adicionar palavra silenciada',
    HOME: 'Página Inicial',
    LIKES: 'Curtidas',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    POST_ALL: 'Postar tudo',
    QUOTE: 'Comentar',
    QUOTE_TWEET: 'Comentar o Tweet',
    QUOTE_TWEETS: 'Tweets com comentário',
    REPOST: 'Repostar',
    RETWEET: 'Retweetar',
    RETWEETED_BY: 'Retweetado por',
    SHARED_TWEETS: 'Tweets Compartilhados',
    SHOW: 'Mostrar',
    SHOW_MORE_REPLIES: 'Mostrar mais respostas',
    TURN_OFF_RETWEETS: 'Desativar Retweets',
    TURN_ON_RETWEETS: 'Ativar Retweets',
    TWEET: 'Tweetar',
    TWEET_ALL: 'Tweetar tudo',
    TWEET_INTERACTIONS: 'Interações com Tweet',
    TWEET_YOUR_REPLY: 'Tweetar sua resposta!',
    UNDO_RETWEET: 'Desfazer Retweet',
  },
  ro: {
    ADD_MUTED_WORD: 'Adaugă cuvântul ignorat',
    HOME: 'Pagina principală',
    LIKES: 'Aprecieri',
    MUTE_THIS_CONVERSATION: 'Ignoră această conversație',
    POST_ALL: 'Postează tot',
    QUOTE: 'Citat',
    QUOTE_TWEET: 'Citează Tweetul',
    QUOTE_TWEETS: 'Tweeturi cu citat',
    REPOST: 'Repostează',
    REPOSTS: 'Repostări',
    RETWEET: 'Redistribuie',
    RETWEETED_BY: 'Redistribuit de către',
    RETWEETS: 'Retweeturi',
    SHARED_TWEETS: 'Tweeturi partajate',
    SHOW: 'Afișează',
    SHOW_MORE_REPLIES: 'Afișează mai multe răspunsuri',
    TURN_OFF_RETWEETS: 'Dezactivează Retweeturile',
    TURN_ON_RETWEETS: 'Activează Retweeturile',
    TWEETS: 'Tweeturi',
    TWEET_ALL: 'Dă Tweeturi cu tot',
    TWEET_INTERACTIONS: 'Interacțiuni cu Tweetul',
    TWEET_YOUR_REPLY: 'Dă Tweet cu răspunsul!',
    UNDO_RETWEET: 'Anulează Retweetul',
  },
  ru: {
    ADD_MUTED_WORD: 'Добавить игнорируемое слово',
    HOME: 'Главная',
    LIKES: 'Нравится',
    MUTE_THIS_CONVERSATION: 'Игнорировать эту переписку',
    POST_ALL: 'Опубликовать все',
    QUOTE: 'Цитата',
    QUOTE_TWEET: 'Цитировать',
    QUOTE_TWEETS: 'Твиты с цитатами',
    REPOST: 'Сделать репост',
    REPOSTS: 'Репосты',
    RETWEET: 'Ретвитнуть',
    RETWEETED_BY: 'Ретвитнул(а)',
    RETWEETS: 'Ретвиты',
    SHARED_TWEETS: 'Общие твиты',
    SHOW: 'Показать',
    SHOW_MORE_REPLIES: 'Показать еще ответы',
    TURN_OFF_RETWEETS: 'Отключить ретвиты',
    TURN_ON_RETWEETS: 'Включить ретвиты',
    TWEET: 'Твитнуть',
    TWEETS: 'Твиты',
    TWEET_ALL: 'Твитнуть все',
    TWEET_INTERACTIONS: 'Взаимодействие в Твитнуть',
    TWEET_YOUR_REPLY: 'Твитните свой ответ!',
    TWITTER: 'Твиттер',
    UNDO_RETWEET: 'Отменить ретвит',
  },
  sk: {
    ADD_MUTED_WORD: 'Pridať stíšené slovo',
    HOME: 'Domov',
    LIKES: 'Páči sa',
    MUTE_THIS_CONVERSATION: 'Stíšiť túto konverzáciu',
    POST_ALL: 'Uverejniť všetko',
    QUOTE: 'Citát',
    QUOTE_TWEET: 'Tweet s citátom',
    QUOTE_TWEETS: 'Tweety s citátom',
    REPOST: 'Opätovné uverejnenie',
    REPOSTS: 'Opätovné uverejnenia',
    RETWEET: 'Retweetnuť',
    RETWEETED_BY: 'Retweetnuté používateľom',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Zdieľané Tweety',
    SHOW: 'Zobraziť',
    SHOW_MORE_REPLIES: 'Zobraziť viac odpovedí',
    TURN_OFF_RETWEETS: 'Vypnúť retweety',
    TURN_ON_RETWEETS: 'Zapnúť retweety',
    TWEET: 'Tweetnuť',
    TWEETS: 'Tweety',
    TWEET_ALL: 'Tweetnuť všetko',
    TWEET_INTERACTIONS: 'Interakcie s Tweet',
    TWEET_YOUR_REPLY: 'Tweetnite odpoveď!',
    UNDO_RETWEET: 'Zrušiť retweet',
  },
  sr: {
    ADD_MUTED_WORD: 'Додај игнорисану реч',
    HOME: 'Почетна',
    LIKES: 'Свиђања',
    MUTE_THIS_CONVERSATION: 'Игнориши овај разговор',
    POST_ALL: 'Објави све',
    QUOTE: 'Цитат',
    QUOTE_TWEET: 'твит са цитатом',
    QUOTE_TWEETS: 'твит(ов)а са цитатом',
    REPOST: 'Поново објави',
    REPOSTS: 'Понвне објаве',
    RETWEET: 'Ретвитуј',
    RETWEETED_BY: 'Ретвитовано од стране',
    RETWEETS: 'Ретвитови',
    SHARED_TWEETS: 'Дељени твитови',
    SHOW: 'Прикажи',
    SHOW_MORE_REPLIES: 'Прикажи још одговора',
    TURN_OFF_RETWEETS: 'Искључи ретвитове',
    TURN_ON_RETWEETS: 'Укључи ретвитове',
    TWEET: 'Твитуј',
    TWEETS: 'Твитови',
    TWEET_ALL: 'Твитуј све',
    TWEET_INTERACTIONS: 'Интеракције са Твитуј',
    TWEET_YOUR_REPLY: 'Твитуј свој одговор!',
    TWITTER: 'Твитер',
    UNDO_RETWEET: 'Опозови ретвит',
  },
  sv: {
    ADD_MUTED_WORD: 'Lägg till ignorerat ord',
    HOME: 'Hem',
    LIKES: 'Gilla-markeringar',
    MUTE_THIS_CONVERSATION: 'Ignorera den här konversationen',
    POST_ALL: 'Lägg upp allt',
    QUOTE: 'Citat',
    QUOTE_TWEET: 'Citera Tweet',
    QUOTE_TWEETS: 'Citat-tweets',
    REPOST: 'Återpublicera',
    REPOSTS: 'Återpubliceringar',
    RETWEET: 'Retweeta',
    RETWEETED_BY: 'Retweetad av',
    SHARED_TWEETS: 'Delade tweetsen',
    SHOW: 'Visa',
    SHOW_MORE_REPLIES: 'Visa fler svar',
    TURN_OFF_RETWEETS: 'Stäng av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
    TWEET: 'Tweeta',
    TWEET_ALL: 'Tweeta allt',
    TWEET_INTERACTIONS: 'Interaktioner med Tweet',
    TWEET_YOUR_REPLY: 'Tweeta ditt svar!',
    UNDO_RETWEET: 'Ångra retweeten',
  },
  ta: {
    ADD_MUTED_WORD: 'செயல்மறைத்த வார்த்தையைச் சேர்',
    HOME: 'முகப்பு',
    LIKES: 'விருப்பங்கள்',
    MUTE_THIS_CONVERSATION: 'இந்த உரையாடலை செயல்மறை',
    POST_ALL: 'எல்லாம் இடுகையிடு',
    QUOTE: 'மேற்கோள்',
    QUOTE_TWEET: 'ட்விட்டை மேற்கோள் காட்டு',
    QUOTE_TWEETS: 'மேற்கோள் கீச்சுகள்',
    REPOST: 'மறுஇடுகை',
    REPOSTS: 'மறுஇடுகைகள்',
    RETWEET: 'மறுட்விட் செய்',
    RETWEETED_BY: 'இவரால் மறுட்விட் செய்யப்பட்டது',
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
    SHOW: 'காண்பி',
    SHOW_MORE_REPLIES: 'மேலும் பதில்களைக் காண்பி',
    TURN_OFF_RETWEETS: 'மறுகீச்சுகளை அணை',
    TURN_ON_RETWEETS: 'மறுகீச்சுகளை இயக்கு',
    TWEET: 'ட்விட் செய்',
    TWEETS: 'கீச்சுகள்',
    TWEET_ALL: 'அனைத்தையும் ட்விட் செய்',
    TWEET_INTERACTIONS: 'ட்விட் செய் ஊடாடல்களைக்',
    TWEET_YOUR_REPLY: 'உங்கள் பதிலை ட்விட் செய்யவும்!',
    UNDO_RETWEET: 'மறுகீச்சை செயல்தவிர்',
  },
  th: {
    ADD_MUTED_WORD: 'เพิ่มคำที่ซ่อน',
    HOME: 'หน้าแรก',
    LIKES: 'ความชอบ',
    MUTE_THIS_CONVERSATION: 'ซ่อนบทสนทนานี้',
    POST_ALL: 'โพสต์ทั้งหมด',
    QUOTE: 'การอ้างอิง',
    QUOTE_TWEET: 'อ้างอิงทวีต',
    QUOTE_TWEETS: 'ทวีตและคำพูด',
    REPOST: 'รีโพสต์',
    REPOSTS: 'รีโพสต์',
    RETWEET: 'รีทวีต',
    RETWEETED_BY: 'ถูกรีทวีตโดย',
    RETWEETS: 'รีทวีต',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    SHOW: 'แสดง',
    SHOW_MORE_REPLIES: 'แสดงการตอบกลับเพิ่มเติม',
    TURN_OFF_RETWEETS: 'ปิดรีทวีต',
    TURN_ON_RETWEETS: 'เปิดรีทวีต',
    TWEET: 'ทวีต',
    TWEETS: 'ทวีต',
    TWEET_ALL: 'ทวีตทั้งหมด',
    TWEET_INTERACTIONS: 'การโต้ตอบของทวีต',
    TWEET_YOUR_REPLY: 'ทวีตการตอบกลับของคุณ',
    TWITTER: 'ทวิตเตอร์',
    UNDO_RETWEET: 'ยกเลิกการรีทวีต',
  },
  tr: {
    ADD_MUTED_WORD: 'Sessize alınacak kelime ekle',
    HOME: 'Anasayfa',
    LIKES: 'Beğeni',
    MUTE_THIS_CONVERSATION: 'Bu sohbeti sessize al',
    POST_ALL: 'Tümünü gönder',
    QUOTE: 'Alıntı',
    QUOTE_TWEET: 'Tweeti Alıntıla',
    QUOTE_TWEETS: 'Alıntı Tweetler',
    REPOST: 'Yeniden gönder',
    REPOSTS: 'Yeniden gönderiler',
    RETWEETED_BY: 'Retweetleyen(ler):',
    RETWEETS: 'Retweetler',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
    SHOW: 'Göster',
    SHOW_MORE_REPLIES: 'Daha fazla yanıt göster',
    TURN_OFF_RETWEETS: 'Retweetleri kapat',
    TURN_ON_RETWEETS: 'Retweetleri aç',
    TWEET: 'Tweetle',
    TWEETS: 'Tweetler',
    TWEET_ALL: 'Hepsini Tweetle',
    TWEET_INTERACTIONS: 'Tweet etkileşimleri',
    TWEET_YOUR_REPLY: 'Yanıtını Tweetle.',
    UNDO_RETWEET: 'Retweeti Geri Al',
  },
  uk: {
    ADD_MUTED_WORD: 'Додати слово до списку ігнорування',
    HOME: 'Головна',
    LIKES: 'Вподобання',
    MUTE_THIS_CONVERSATION: 'Ігнорувати цю розмову',
    POST_ALL: 'Опублікувати все',
    QUOTE: 'Цитата',
    QUOTE_TWEET: 'Цитувати твіт',
    QUOTE_TWEETS: 'Цитовані твіти',
    REPOST: 'Зробити репост',
    REPOSTS: 'Репости',
    RETWEET: 'Ретвітнути',
    RETWEETED_BY: 'Ретвіти',
    RETWEETS: 'Ретвіти',
    SHARED_TWEETS: 'Спільні твіти',
    SHOW: 'Показати',
    SHOW_MORE_REPLIES: 'Показати більше відповідей',
    TURN_OFF_RETWEETS: 'Вимкнути ретвіти',
    TURN_ON_RETWEETS: 'Увімкнути ретвіти',
    TWEET: 'Твіт',
    TWEETS: 'Твіти',
    TWEET_ALL: 'Твітнути все',
    TWEET_INTERACTIONS: 'Взаємодія твітів',
    TWEET_YOUR_REPLY: 'Твітніть свою відповідь!',
    TWITTER: 'Твіттер',
    UNDO_RETWEET: 'Скасувати ретвіт',
  },
  ur: {
    ADD_MUTED_WORD: 'میوٹ شدہ لفظ شامل کریں',
    HOME: 'ہوم',
    LIKES: 'لائک',
    MUTE_THIS_CONVERSATION: 'اس گفتگو کو میوٹ کریں',
    QUOTE: 'نقل کریں',
    QUOTE_TWEET: 'ٹویٹ کا حوالہ دیں',
    QUOTE_TWEETS: 'ٹویٹ کو نقل کرو',
    RETWEET: 'ریٹویٹ',
    RETWEETED_BY: 'جنہوں نے ریٹویٹ کیا',
    RETWEETS: 'ریٹویٹس',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
    SHOW: 'دکھائیں',
    SHOW_MORE_REPLIES: 'مزید جوابات دکھائیں',
    TURN_OFF_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TURN_ON_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TWEET: 'ٹویٹ',
    TWEETS: 'ٹویٹس',
    TWEET_ALL: 'سب کو ٹویٹ کریں',
    TWEET_INTERACTIONS: 'ٹویٹ تعاملات',
    TWITTER: 'ٹوئٹر',
    UNDO_RETWEET: 'ری ٹویٹ کو کالعدم کریں',
  },
  vi: {
    ADD_MUTED_WORD: 'Thêm từ tắt tiếng',
    HOME: 'Trang chủ',
    LIKES: 'Lượt thích',
    MUTE_THIS_CONVERSATION: 'Tắt tiếng cuộc trò chuyện này',
    POST_ALL: 'Đăng tất cả',
    QUOTE: 'Trích dẫn',
    QUOTE_TWEET: 'Trích dẫn Tweet',
    QUOTE_TWEETS: 'Tweet trích dẫn',
    REPOST: 'Đăng lại',
    REPOSTS: 'Bài đăng lại',
    RETWEET: 'Tweet lại',
    RETWEETED_BY: 'Được Tweet lại bởi',
    RETWEETS: 'Các Tweet lại',
    SHARED_TWEETS: 'Tweet được chia sẻ',
    SHOW: 'Hiện',
    SHOW_MORE_REPLIES: 'Hiển thị thêm trả lời',
    TURN_OFF_RETWEETS: 'Tắt Tweet lại',
    TURN_ON_RETWEETS: 'Bật Tweet lại',
    TWEETS: 'Tweet',
    TWEET_ALL: 'Đăng Tweet tất cả',
    TWEET_INTERACTIONS: 'Tương tác Tweet',
    TWEET_YOUR_REPLY: 'Đăng Tweet câu trả lời của bạn!',
    UNDO_RETWEET: 'Hoàn tác Tweet lại',
  },
  'zh-Hant': {
    ADD_MUTED_WORD: '加入靜音文字',
    HOME: '首頁',
    LIKES: '喜歡的內容',
    MUTE_THIS_CONVERSATION: '將此對話靜音',
    POST_ALL: '全部發佈',
    QUOTE: '引用',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用的推文',
    REPOST: '轉發',
    REPOSTS: '轉發',
    RETWEET: '轉推',
    RETWEETED_BY: '已被轉推',
    RETWEETS: '轉推',
    SHARED_TWEETS: '分享的推文',
    SHOW: '顯示',
    SHOW_MORE_REPLIES: '顯示更多回覆',
    TURN_OFF_RETWEETS: '關閉轉推',
    TURN_ON_RETWEETS: '開啟轉推',
    TWEET: '推文',
    TWEETS: '推文',
    TWEET_ALL: '推全部內容',
    TWEET_INTERACTIONS: '推文互動',
    TWEET_YOUR_REPLY: '推你的回覆！',
    UNDO_RETWEET: '取消轉推',
  },
  zh: {
    ADD_MUTED_WORD: '添加要隐藏的字词',
    HOME: '主页',
    LIKES: '喜欢',
    MUTE_THIS_CONVERSATION: '隐藏此对话',
    POST_ALL: '全部发帖',
    QUOTE: '引用',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用推文',
    REPOST: '转帖',
    REPOSTS: '转帖',
    RETWEET: '转推',
    RETWEETED_BY: '转推者',
    RETWEETS: '转推',
    SHARED_TWEETS: '分享的推文',
    SHOW: '显示',
    SHOW_MORE_REPLIES: '显示更多回复',
    TURN_OFF_RETWEETS: '关闭转推',
    TURN_ON_RETWEETS: '开启转推',
    TWEET: '推文',
    TWEETS: '推文',
    TWEET_ALL: '全部发推',
    TWEET_INTERACTIONS: '推文互动',
    TWEET_YOUR_REPLY: '发布你的回复！',
    UNDO_RETWEET: '撤销转推',
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
  ADD_MUTED_WORD: '/settings/add_muted_keyword',
  BOOKMARKS: '/i/bookmarks',
  COMPOSE_MESSAGE: '/messages/compose',
  COMPOSE_TWEET: '/compose/tweet',
  CONNECT: '/i/connect',
  CUSTOMIZE_YOUR_VIEW: '/i/display',
  HOME: '/home',
  NOTIFICATION_TIMELINE: '/i/timeline',
  PROFILE_SETTINGS: '/settings/profile',
  SEARCH: '/search',
  TIMELINE_SETTINGS: '/home/pinned/edit',
}

/** @enum {string} */
const Selectors = {
  BLOCK_MENU_ITEM: '[data-testid="block"]',
  DESKTOP_TIMELINE_HEADER: 'div[data-testid="primaryColumn"] > div > div:first-of-type',
  DISPLAY_DONE_BUTTON_DESKTOP: '#layers div[role="button"]:not([aria-label])',
  DISPLAY_DONE_BUTTON_MOBILE: 'main div[role="button"]:not([aria-label])',
  MESSAGES_DRAWER: 'div[data-testid="DMDrawer"]',
  MODAL_TIMELINE: 'section > h1 + div[aria-label] > div',
  MOBILE_TIMELINE_HEADER: 'div[data-testid="TopNavBar"]',
  NAV_HOME_LINK: 'a[data-testid="AppTabBar_Home_Link"]',
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV_DESKTOP: 'header nav',
  PRIMARY_NAV_MOBILE: '#layers nav',
  PROMOTED_TWEET_CONTAINER: '[data-testid="placementTracking"]',
  SIDEBAR: 'div[data-testid="sidebarColumn"]',
  SIDEBAR_WRAPPERS: 'div[data-testid="sidebarColumn"] > div > div > div > div > div',
  TIMELINE: 'div[data-testid="primaryColumn"] section > h1 + div[aria-label] > div',
  TIMELINE_HEADING: 'h2[role="heading"]',
  TWEET: '[data-testid="tweet"]',
  VERIFIED_TICK: 'svg[data-testid="icon-verified"]',
  X_LOGO_PATH: 'svg path[d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"]',
}

/** @enum {string} */
const Svgs = {
  BLUE_LOGO_PATH: 'M16.5 3H2v18h15c3.038 0 5.5-2.46 5.5-5.5 0-1.4-.524-2.68-1.385-3.65-.08-.09-.089-.22-.023-.32.574-.87.908-1.91.908-3.03C22 5.46 19.538 3 16.5 3zm-.796 5.99c.457-.05.892-.17 1.296-.35-.302.45-.684.84-1.125 1.15.004.1.006.19.006.29 0 2.94-2.269 6.32-6.421 6.32-1.274 0-2.46-.37-3.459-1 .177.02.357.03.539.03 1.057 0 2.03-.35 2.803-.95-.988-.02-1.821-.66-2.109-1.54.138.03.28.04.425.04.206 0 .405-.03.595-.08-1.033-.2-1.811-1.1-1.811-2.18v-.03c.305.17.652.27 1.023.28-.606-.4-1.004-1.08-1.004-1.85 0-.4.111-.78.305-1.11 1.113 1.34 2.775 2.22 4.652 2.32-.038-.17-.058-.33-.058-.51 0-1.23 1.01-2.22 2.256-2.22.649 0 1.235.27 1.647.7.514-.1.997-.28 1.433-.54-.168.52-.526.96-.992 1.23z',
  MUTE: '<g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g>',
  RETWEET: '<g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>',
  RETWEETS_OFF: '<g><path d="M3.707 21.707l18-18-1.414-1.414-2.088 2.088C17.688 4.137 17.11 4 16.5 4H11v2h5.5c.028 0 .056 0 .084.002l-10.88 10.88c-.131-.266-.204-.565-.204-.882V7.551l2.068 1.93 1.365-1.462L4.5 3.882.068 8.019l1.365 1.462 2.068-1.93V16c0 .871.278 1.677.751 2.334l-1.959 1.959 1.414 1.414zM18.5 9h2v7.449l2.068-1.93 1.365 1.462-4.433 4.137-4.432-4.137 1.365-1.462 2.067 1.93V9zm-8.964 9l-2 2H13v-2H9.536z"></path></g>',
  TWITTER_HOME_ACTIVE_PATH: 'M12 1.696L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM12 16.5c-1.933 0-3.5-1.567-3.5-3.5s1.567-3.5 3.5-3.5 3.5 1.567 3.5 3.5-1.567 3.5-3.5 3.5z',
  TWITTER_HOME_INACTIVE_PATH: 'M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z',
  TWITTER_LOGO_PATH: 'M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z',
  X_HOME_ACTIVE_PATH: 'M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913H9.14c.51 0 .929-.41.929-.913v-7.075h3.909v7.075c0 .502.417.913.928.913h6.165c.511 0 .929-.41.929-.913V7.904c0-.301-.158-.584-.408-.758z',
  X_HOME_INACTIVE_PATH: 'M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0l-9.071 5.99c-.26.173-.409.456-.409.757v13.183c0 .502.418.913.929.913h6.638c.511 0 .929-.41.929-.913v-7.075h3.008v7.075c0 .502.418.913.929.913h6.639c.51 0 .928-.41.928-.913V7.904c0-.301-.158-.584-.408-.758zM20 20l-4.5.01.011-7.097c0-.502-.418-.913-.928-.913H9.44c-.511 0-.929.41-.929.913L8.5 20H4V8.773l8.011-5.342L20 8.764z',

}

/** @enum {string} */
const Images = {
  TWITTER_FAVICON: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAA0pJREFUWAntVk1oE1EQnnlJbFK3KUq9VJPYWgQVD/5QD0qpfweL1YJQoZAULBRPggp6kB78PQn14kHx0jRB0UO9REVFb1YqVBEsbZW2SbVS0B6apEnbbMbZ6qbZdTempqCHPAjvzcw3P5mdmfcAiquYgX+cAVwu/+5AdDMQnSPCHUhQA0hf+Rxy2OjicIvzm+qnKhito0qpb2wvJhWeJgCPP7oPELeHvdJ1VSGf3eOPnSWga0S0Qo9HxEkEusDBuNjbEca8G291nlBxmgDc/ukuIvAJxI6wr+yKCsq1ewLxQ2lZfpQLo8oQ4ZXdCkfnACrGWpyDCl+oQmVn5xuVPU102e2P3qoJkFOhzVb9S7KSnL5jJs/mI+As01PJFPSlZeFSZZoAGBRXBZyq9lk5NrC+e7pJ5en30c+JWk59pZ5vRDOuhAD381c/H/FKz1SMNgCE16rg505r5TT0uLqme93d0fbq+1SeLSeU83Ke0RHYFPGVPcjQfNDUwIa7M665+dQAEEjZoMwZMcEF9RxIDAgBQ2mCcqJ0Z0b+h4MNbZ4RnyOSDbNmE2iRk5jCNgIIckFoZAs4IgfLGrlKGjkzS16iwj6pV9I4mUvCPf73JVytH9nRJj24QHrqU8NCIWrMaGqAC+Ut/3ZzAS63cx4v2K/x/IvQBOCwWzu5KmJGwEJ5PIgeG9nQBDDcXPpFoDjJ7ThvBC6EZxXWkJG+JgAFwGM4KBAOcibeGCn8FQ/hyajXPmSk+1sACogn4hYk7OdiHDFSWipPkPWSmY6mCzIghEEuxJvcEYUvxIdhX2mvmSHDDPBF9AJRnDZTyp+P40671JYLbxiAohDxSTfQIg4oNxgPzCWPHaWQBViOf2jGqVwBaEaxGbAqOFMrp+SefC8eNhoFIY5lXzpmtnMGUB2IbU3JdIqVW9m5zcxINn/hAYKiIexdaTh4srHKORMAP0b28PNgJyGt5gvHzQVYx91QpVcwpRFl/p63HSR1DLbid1OcTpAJQOG7u+KH+aI5Qwj13IsamU5vkUSIc8uGLDa8OtoivV8U5HcydFLtT7hlSDVy2nfxI2Ibg9awuVU8IeJAOMF5m2B6jFs1tM5R9rS3GRP5uSuiihn4DzPwA7z7GDH+43gqAAAAAElFTkSuQmCC',
  TWITTER_PIP_FAVICON: 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAALASURBVHgB7VZNchJBFP5eM9FoRWV2WiZmbmBuIJ4g5ASBRWJlRXIC4ASQVUqxCo4QTwDegJzAiYlFXM1YZWmVQD9fQ6YyAwMMGBZW8i2G6e7He1+/3wHuOih4+fWieJhiKsirA0ZbE44fXZUaWDIGBH4/L+UUUB897DMfPf5ermKJUOaRIhTiDlNEBSwZlnkwY2vCuYOEWD/xMrCoKC41utISRlcc3Or2dfnqwHbDcj9X0fbztn9DAHxOoM0xrZILSIBXtR9F0VGKbJIhz7kVi3Lr770yAz4p2iYm188/awVi6lo4Ns4mETEDLz94uTHjIxDDRaWoohhOSjwi/9mKEFjtlKsayAuRM7M2HmFJwCRVIIqLSAAJjS822v0Vaip1E1oKC6XrXtrExjnxnJ6ldoVKFj0+ujywW3FKTTzJoibmAXP+Yt9uBEsrfLbWRelJzS/0B8z4WoKa6zW/1dd83Hlnn0Z0peAQkqNHvNPZi+qIELBWUNU97LLJ4hDESMZSlNmo+b5UTEvC85m0JCipTQREE+BhdzypIwSkLvyn4LKYrEzQkSZCloiyw+xJbnygfxX+VAJrPWnBoC9ixBXdDm4XflD7YajIinFq3L0E45J7fBa3HyEg7mhgeWjPJODu223J/iMsATzhcmp04+ueXTW1OsiD2zIuVfNNLockBAyIkdaaPxHGs3YR0JTQWnGbWkFCQZX5imwCmBoX++nGpONYD1zu2S0a9IN/g3jSNcNnqsy0ww2ZdPJzCKLXWAAy1N6ay2BRAgEcGZ+aqDnaoqdbjw6dhQgYwz1S2xKOQyQ0Phy7vDPr5iH5ITY+elmtpddLFyQzZBTP3xGl3FJ95NzQJ1hiAgMSw5jnJOZvMA/EMBNKSW89kUAAp+45+g+yojRjljL9NoP4GxdLYzk334vy3lYP0HBjhsw97vHf4C/b8RLHAOr+CQAAAABJRU5ErkJggg==',
}

const THEME_BLUE = 'rgb(29, 155, 240)'
const THEME_COLORS = new Set([
  THEME_BLUE,
  'rgb(255, 212, 0)',  // yellow
  'rgb(244, 33, 46)',  // pink
  'rgb(120, 86, 255)', // purple
  'rgb(255, 122, 0)',  // orange
  'rgb(0, 186, 124)',  // green
])
// <body> pseudo-selector for pages the full-width content feature works on
const FULL_WIDTH_BODY_PSEUDO = ':is(.Community, .List, .MainTimeline)'
// Matches any notification count at the start of the title
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
// The Communities nav item takes you to /yourusername/communities
const URL_COMMUNITIES_RE = /^\/[a-zA-Z\d_]{1,20}\/communities\/?$/
const URL_COMMUNITY_RE = /^\/i\/communities\/\d+(?:\/about)?\/?$/
const URL_COMMUNITY_MEMBERS_RE = /^\/i\/communities\/\d+\/(?:members|moderators)\/?$/
const URL_DISCOVER_COMMUNITIES_RE = /^\/i\/communities\/suggested\/?/
const URL_LIST_RE = /\/i\/lists\/\d+\/?$/
const URL_MEDIA_RE = /\/(?:photo|video)\/\d\/?$/
const URL_MEDIAVIEWER_RE = /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/mediaviewer$/i
// Matches URLs which show one of the tabs on a user profile page
const URL_PROFILE_RE = /^\/([a-zA-Z\d_]{1,20})(?:\/(affiliates|with_replies|superfollows|highlights|media|likes))?\/?$/
// Matches URLs which show a user's Followers you know / Followers / Following tab
const URL_PROFILE_FOLLOWS_RE = /^\/[a-zA-Z\d_]{1,20}\/(?:verified_followers|follow(?:ing|ers|ers_you_follow))\/?$/
const URL_TWEET_RE = /^\/([a-zA-Z\d_]{1,20})\/status\/(\d+)\/?$/
const URL_TWEET_ENGAGEMENT_RE = /^\/[a-zA-Z\d_]{1,20}\/status\/\d+\/(quotes|retweets|reposts|likes)\/?$/

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

/** Notification count in the title (including trailing space), e.g. `'(1) '`. */
let currentNotificationCount = ''

/** Title of the current page, without the `' / Twitter'` suffix. */
let currentPage = ''

/** Current `location.pathname`. */
let currentPath = ''

/**
 * CSS rule in the React Native stylesheet which defines the Chirp font-family
 * and fallbacks for the whole app.
 * @type {CSSStyleRule}
 */
let fontFamilyRule = null

/** @type {string} */
let fontSize = null

/** Set to `true` when a Home/Following heading or Home nav link is used. */
let homeNavigationIsBeingUsed = false

/** Set to `true` when the media modal is open on desktop. */
let isDesktopMediaModalOpen = false

/** Set to `true` when the compose tweet modal is open on desktop. */
let isDesktopComposeTweetModalOpen = false

/**
 * Cache for the last page title which was used for the main timeline.
 * @type {string}
 */
let lastMainTimelineTitle = null

/**
 * MutationObservers active on the current modal.
 * @type {import("./types").Disconnectable[]}
 */
let modalObservers = []

/**
 * `true` after the app has initialised.
 * @type {boolean}
 */
let observingPageChanges = false

/**
 * MutationObservers active on the current page, or anything else we want to
 * clean up when the user moves off the current page.
 * @type {import("./types").NamedMutationObserver[]}
 */
let pageObservers = []

/** `true` when a 'Pin to your profile' menu item was seen in the last popup. */
let pinMenuItemSeen = false

/** @type {number} */
let selectedHomeTabIndex = -1

/**
 * Title for the fake timeline used to separate out retweets and quote tweets.
 * @type {string}
 */
let separatedTweetsTimelineTitle = null

/**
 * The current "Color" setting, which can be changed in "Customize your view".
 * @type {string}
 */
let themeColor = localStorage.lastThemeColor

/**
 * Tab to switch to after navigating to the Tweet interactions page.
 * @type {string}
 */
let tweetInteractionsTab = null

/**
 * `true` when "For you" was the last tab selected on the main timeline.
 */
let wasForYouTabSelected = false

function isOnBookmarksPage() {
  return currentPath == PagePaths.BOOKMARKS
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

function isOnExplorePage() {
  return currentPath.startsWith('/explore')
}

function isOnFollowListPage() {
  return URL_PROFILE_FOLLOWS_RE.test(currentPath)
}

function isOnHomeTimeline() {
  return currentPage == getString('HOME')
}

function isOnIndividualTweetPage() {
  return URL_TWEET_RE.test(currentPath)
}

function isOnListPage() {
  return URL_LIST_RE.test(currentPath)
}

function isOnMainTimelinePage() {
  return currentPath == PagePaths.HOME || (
    currentPath == PagePaths.CUSTOMIZE_YOUR_VIEW &&
    isOnHomeTimeline() ||
    isOnSeparatedTweetsTimeline()
  )
}

function isOnMessagesPage() {
  return currentPath.startsWith('/messages')
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
  let match = currentPath.match(URL_TWEET_ENGAGEMENT_RE)
  return match?.[1] == 'quotes'
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
/**
 * @param {string} role
 * @return {HTMLStyleElement}
 */
function addStyle(role) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'control-panel-for-twitter'
  $style.dataset.role = role
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
  $svg.classList.add('tnt_blue_check')
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
  $svgPath.parentElement.classList.add('tnt_logo')
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
 * @return {string}
 */
function dedent(str) {
  str = str.replace(/^[ \t]*\r?\n/, '')
  let indent = /^[ \t]+/m.exec(str)
  if (indent) str = str.replace(new RegExp('^' + indent[0], 'gm'), '')
  return str.replace(/(\r?\n)[ \t]+$/, '$1')
}

/**
 * @param {string} name
 * @param {import("./types").Disconnectable[]} observers
 */
function disconnectObserver(name, observers) {
  for (let i = observers.length -1; i >= 0; i--) {
    let observer = observers[i]
    if ('name' in observer && observer.name == name) {
      observer.disconnect()
      observers.splice(i, 1)
      log(`disconnected ${name} ${observers === pageObservers ? 'page' : 'modal'} observer`)
    }
  }
}

function disconnectModalObserver(name) {
  disconnectObserver(name, modalObservers)
}

function disconnectAllModalObservers() {
  if (modalObservers.length > 0) {
    log(
      `disconnecting ${modalObservers.length} modal observer${s(modalObservers.length)}`,
      modalObservers.map(observer => observer['name'])
    )
    modalObservers.forEach(observer => observer.disconnect())
    modalObservers = []
  }
}

function disconnectPageObserver(name) {
  disconnectObserver(name, pageObservers)
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

function getStateEntities() {
  let reactRootContainer = ($reactRoot?.wrappedJSObject ? $reactRoot.wrappedJSObject : $reactRoot)?._reactRootContainer
  if (reactRootContainer) {
    let entities = reactRootContainer._internalRoot?.current?.memoizedState?.element?.props?.children?.props?.store?.getState()?.entities
    if (entities) {
      return entities
    } else {
      warn('state entities not found')
    }
  } else {
    warn('React root container not found')
  }
}

/**
 * Gets cached tweet info from React state.
 */
function getTweetInfo(id) {
  let tweetEntities = getStateEntities()?.tweets?.entities
  if (tweetEntities) {
    let tweetInfo = tweetEntities[id]
    if (!tweetInfo) {
      warn('tweet info not found')
    }
    return tweetInfo
  } else {
    warn('tweet entities not found')
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
 * @param {import("./types").Disconnectable[]} observers
 * @param {string} name
 */
function isObserving(observers, name) {
  return observers.some(observer => 'name' in observer && observer.name == name)
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

/**
 * @param {() => boolean} condition
 * @returns {() => boolean}
 */
 function not(condition) {
  return () => !condition()
}

/**
 * Convenience wrapper for the MutationObserver API - the callback is called
 * immediately to support using an observer and its options as a trigger for any
 * change, without looking at MutationRecords.
 * @param {Node} $element
 * @param {MutationCallback} callback
 * @param {string} name
 * @param {MutationObserverInit} options
 * @return {import("./types").NamedMutationObserver}
 */
function observeElement($element, callback, name, options = {childList: true}) {
  if (name) {
    if (options.childList && callback.length > 0) {
      log(`observing ${name}`, $element)
    } else {
      log (`observing ${name}`)
    }
  }

  let observer = new MutationObserver(callback)
  callback([], observer)
  observer.observe($element, options)
  observer['name'] = name
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
  window.postMessage({type: 'tntConfigChange', changes})
}
//#endregion

//#region Global observers
const checkReactNativeStylesheet = (() => {
  /** @type {number} */
  let startTime

  return function checkReactNativeStylesheet() {
    if (startTime == null) {
      startTime = Date.now()
    }

    let $style = /** @type {HTMLStyleElement} */ (document.querySelector('style#react-native-stylesheet'))
    if (!$style) {
      warn('React Native stylesheet not found')
      return
    }

    for (let rule of $style.sheet.cssRules) {
      if (!(rule instanceof CSSStyleRule)) continue

      if (fontFamilyRule == null &&
          rule.style.fontFamily &&
          rule.style.fontFamily.includes('TwitterChirp') && !rule.style.fontFamily.includes('TwitterChirpExtendedHeavy')) {
        fontFamilyRule = rule
        log('found Chirp fontFamily CSS rule in React Native stylesheet')
        configureFont()
      }

      if (themeColor == null &&
          rule.style.backgroundColor &&
          THEME_COLORS.has(rule.style.backgroundColor)) {
        themeColor = rule.style.backgroundColor
        localStorage.lastThemeColor = themeColor
        log(`found initial theme color in React Native stylesheet: ${themeColor}`)
        configureThemeCss()
      }
    }

    let elapsedTime = Date.now() - startTime
    if (fontFamilyRule == null || themeColor == null) {
      if (elapsedTime < 3000) {
        setTimeout(checkReactNativeStylesheet, 100)
      } else {
        warn(`stopped checking React Native stylesheet after ${elapsedTime}ms`)
      }
    } else {
      log(`finished checking React Native stylesheet in ${elapsedTime}ms`)
    }
  }
})()

/**
 * When the "Background" setting is changed in "Customize your view", <body>'s
 * backgroundColor is changed and the app is re-rendered, so we need to
 * re-process the current page.
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
  }, '<body> style attribute for background colour changes', {
    attributes: true,
    attributeFilter: ['style']
  })
}

/**
 * When the "Color" setting is changed in "Customize your view", the app
 * re-renders from a certain point, so we need to re-process the current page.
 */
async function observeColor() {
  let $colorRerenderBoundary = await getElement('#react-root > div > div')

  observeElement($colorRerenderBoundary, async () => {
    if (location.pathname != PagePaths.CUSTOMIZE_YOUR_VIEW) return

    let $doneButton = await getElement(desktop ? Selectors.DISPLAY_DONE_BUTTON_DESKTOP : Selectors.DISPLAY_DONE_BUTTON_MOBILE, {
      name: 'Done button',
      stopIf: not(() => location.pathname == PagePaths.CUSTOMIZE_YOUR_VIEW),
    })
    if (!$doneButton) return

    let color = getComputedStyle($doneButton).backgroundColor
    if (color == themeColor) return

    log('Color setting changed - re-processing current page')
    themeColor = color
    localStorage.lastThemeColor = color
    configureThemeCss()
    observePopups()
    observeSideNavTweetButton()
    processCurrentPage()
  }, 'Color change re-render boundary')
}

/**
 * When the "Font size" setting is changed in "Customize your view" on desktop,
 * `<html>`'s fontSize is changed and the app is re-rendered.
 */
const observeHtmlFontSize = (() => {
  /** @type {MutationObserver} */
  let fontSizeObserver

  return function observeHtmlFontSize() {
    if (fontSizeObserver) {
      fontSizeObserver.disconnect()
      fontSizeObserver = null
    }

    if (mobile) return

    let lastOverflow = ''

    fontSizeObserver = observeElement($html, () => {
      if (!$html.style.fontSize) return

      let hasFontSizeChanged = fontSize != null && $html.style.fontSize != fontSize

      if ($html.style.fontSize != fontSize) {
        fontSize = $html.style.fontSize
        log(`<html> fontSize has changed to ${fontSize}`)
        configureNavFontSizeCss()
      }

      // Ignore overflow changes, which happen when a dialog is shown or hidden
      let hasOverflowChanged = $html.style.overflow != lastOverflow
      lastOverflow = $html.style.overflow
      if (!hasFontSizeChanged && hasOverflowChanged) {
        log('ignoring <html> style overflow change')
        return
      }

      // When you switch between the smallest "Font size" options, <html>'s
      // style is updated but the font size is kept the same - re-process just
      // in case.
      if (hasFontSizeChanged ||
          location.pathname == PagePaths.CUSTOMIZE_YOUR_VIEW && fontSize == '14px') {
        log('<html> style attribute changed, re-processing current page')
        observePopups()
        observeSideNavTweetButton()
        processCurrentPage()
      }
    }, '<html> style attribute for font size changes', {
      attributes: true,
      attributeFilter: ['style']
    })
  }
})()

async function observeDesktopComposeTweetModal($popup) {
 let $modalDialog = await getElement('div[role="dialog"][aria-labelledby]', {
  context: $popup,
  stopIf: () => !isDesktopComposeTweetModalOpen
 })
 if (!$modalDialog) return

 /** @type {import("./types").Disconnectable} */
 let tweetButtonObserver

 function disconnectTweetButtonObserver() {
   if (tweetButtonObserver) {
     log('disconnecting tweet button dialog observer')
     tweetButtonObserver.disconnect()
     modalObservers.splice(modalObservers.indexOf(tweetButtonObserver), 1)
     tweetButtonObserver = null
   }
 }

 let waitingForTweetButton = false

 modalObservers.push(
  observeElement($modalDialog, async () => {
    if (waitingForTweetButton) return

    waitingForTweetButton = true
    let $tweetButtonText = await getElement('div[data-testid="tweetButton"] span > span', {
      context: $modalDialog,
      name: 'tweet button',
      timeout: 500,
    })
    waitingForTweetButton = false

    if (!$tweetButtonText) {
      disconnectTweetButtonObserver()
      return
    }

    setTweetButtonText($tweetButtonText)

    // The button will be moved around when multiple Tweets are being edited
    tweetButtonObserver = observeElement($modalDialog, (mutations) => {
      for (let mutation of mutations) {
        for (let $addedNode of mutation.addedNodes) {
          let $tweetButtonText = $addedNode.querySelector?.('div[data-testid="tweetButton"] span > span')
          if ($tweetButtonText) {
            setTweetButtonText($tweetButtonText)
          }
        }
      }
    }, 'tweet button dialog', {childList: true, subtree: true})
    modalObservers.push(tweetButtonObserver)
  }, 'compose tweet modal dialog')
 )
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
    disconnectModalObserver('modal timeline')
    modalObservers.push(
      observeElement($timeline, () => onIndividualTweetTimelineChange($timeline, {observers: modalObservers}), 'modal timeline')
    )

    // If other media in the modal is clicked, the timeline is replaced.
    disconnectModalObserver('modal timeline parent')
    modalObservers.push(
      observeElement($timeline.parentElement, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((/** @type {HTMLElement} */ $newTimeline) => {
            log('modal timeline replaced')
            disconnectModalObserver('modal timeline')
            modalObservers.push(
              observeElement($newTimeline, () => onIndividualTweetTimelineChange($newTimeline, {observers: modalObservers}), 'modal timeline')
            )
          })
        })
      }, 'modal timeline parent')
    )
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
      modalObservers.push(
        observeElement($timeline.parentElement, (mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((/** @type {HTMLElement} */ $timeline) => {
              disconnectModalObserver('modal timeline parent')
              if (Date.now() > startTime) {
                log(`modal timeline appeared after ${Date.now() - startTime}ms`, $timeline)
              }
              observeModalTimelineItems($timeline)
            })
          })
        }, 'modal timeline parent')
      )
    }
  }

  // The modal timeline can be expanded and collapsed
  let $expandedContainer = $initialTimeline.closest('[aria-expanded="true"]')
  modalObservers.push(
    observeElement($expandedContainer.parentElement, async (mutations) => {
      if (mutations.some(mutation => mutation.removedNodes.length > 0)) {
        log('modal timeline collapsed')
        disconnectModalObserver('modal timeline parent')
        disconnectModalObserver('modal timeline')
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
    }, 'collapsible modal timeline container')
  )

  observeModalTimeline($initialTimeline)
}

const observeFavicon = (() => {
  /** @type {HTMLElement} */
  let $shortcutIcon
  /** @type {MutationObserver} */
  let shortcutIconObserver

  async function observeFavicon() {
    if ($shortcutIcon == null) {
      $shortcutIcon = await getElement('link[rel="shortcut icon"]', {name: 'shortcut icon'})
    }

    if (!config.replaceLogo) {
      if (shortcutIconObserver != null) {
        shortcutIconObserver.disconnect()
        shortcutIconObserver = null
        if ($shortcutIcon.getAttribute('href').startsWith('data:')) {
          $shortcutIcon.setAttribute('href', `//abs.twimg.com/favicons/twitter${currentNotificationCount ? '-pip' : ''}.3.ico`)
        }
      }
      return
    }

    shortcutIconObserver = observeElement($shortcutIcon, () => {
      let href = $shortcutIcon.getAttribute('href')
      if (href.startsWith('data:')) return
      $shortcutIcon.setAttribute('href', href.includes('pip') ? Images.TWITTER_PIP_FAVICON : Images.TWITTER_FAVICON)
    }, 'shortcut icon href', {
      attributes: true,
      attributeFilter: ['href']
    })
  }

  observeFavicon.updatePip = function(showPip) {
    if (!$shortcutIcon) return
    let icon = showPip ? Images.TWITTER_PIP_FAVICON : Images.TWITTER_FAVICON
    if ($shortcutIcon.getAttribute('href') != icon) {
      $shortcutIcon.setAttribute('href', icon)
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
    if (popupObserver) {
      popupObserver.disconnect()
      popupObserver = null
    }

    let $layers = await getElement('#layers', {
      name: 'layers',
    })

    // There can be only one
    if (popupObserver) {
      popupObserver.disconnect()
    }

    popupObserver = observeElement($layers, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          let nestedObserver = onPopup($el)
          if (nestedObserver) {
            nestedObservers.set($el, nestedObserver)
          }
        })
        mutation.removedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          if (nestedObservers.has($el)) {
            nestedObservers.get($el).disconnect()
            nestedObservers.delete($el)
          }
        })
      })
    }, 'popup container')
  }
})()

async function observeTitle() {
  let $title = await getElement('title', {name: '<title>'})
  observeElement($title, () => {
    let title = $title.textContent
    if (config.replaceLogo && (ltr ? /X$/ : /^(?:\(\d+\+?\) )?X/).test(title)) {
      let newTitle = title.replace(ltr ? /X$/ : 'X', getString('TWITTER'))
      document.title = newTitle
      // If Twitter is opened in the background, changing the title might not
      // re-fire the title MutationObserver, preventing the initial page from
      // being processed.
      if (!currentPage) {
        onTitleChange(newTitle)
      }
      return
    }
    if (observingPageChanges) {
      onTitleChange(title)
    }
  }, '<title>')
}
//#endregion

//#region Page observers
async function observeSidebar() {
  let $primaryColumn = await getElement(Selectors.PRIMARY_COLUMN, {
    name: 'primary column'
  })
  let $sidebarContainer = $primaryColumn.parentElement
  pageObservers.push(
    observeElement($sidebarContainer, () => {
      let $sidebar = $sidebarContainer.querySelector(Selectors.SIDEBAR)
      log(`sidebar ${$sidebar ? 'appeared' : 'disappeared'}`)
      $body.classList.toggle('Sidebar', Boolean($sidebar))
      if ($sidebar && config.twitterBlueChecks != 'ignore' && !isOnSearchPage() && !isOnExplorePage()) {
        observeSearchForm()
      }
    }, 'sidebar container')
  )
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
    }, 'sidenav tweet button')
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
  pageObservers.push(
    observeElement($results, () => {
      processBlueChecks($results)
    }, 'search results', {childList: true, subtree: true})
  )
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
    disconnectPageObserver('timeline')
    pageObservers.push(
      observeElement($timeline, () => onTimelineChange($timeline, page, options), 'timeline')
    )
    onTimelineAppeared?.()
    if (isTabbed) {
      // When a tab which has been viewed before is revisited, the timeline is
      // replaced.
      disconnectPageObserver('timeline parent')
      pageObservers.push(
        observeElement($timeline.parentElement, (mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((/** @type {HTMLElement} */ $newTimeline) => {
              disconnectPageObserver('timeline')
              log('tab changed')
              onTabChanged?.()
              pageObservers.push(
                observeElement($newTimeline, () => onTimelineChange($newTimeline, page, options), 'timeline')
              )
            })
          })
        }, 'timeline parent')
      )
    }
  }

  // If the inital timeline doesn't have a style attribute it's a placeholder
  if ($timeline.hasAttribute('style')) {
    observeTimelineItems($timeline)
  }
  else {
    log('waiting for timeline')
    let startTime = Date.now()
    pageObservers.push(
      observeElement($timeline.parentElement, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((/** @type {HTMLElement} */ $timeline) => {
            disconnectPageObserver('timeline parent')
            if (Date.now() > startTime) {
              log(`timeline appeared after ${Date.now() - startTime}ms`, $timeline)
            }
            observeTimelineItems($timeline)
          })
        })
      }, 'timeline parent')
    )
  }

  // On some tabbed timeline pages, the first time a new tab is navigated to,
  // the element containing the timeline is replaced with a loading spinner.
  if (isTabbed && tabbedTimelineContainerSelector) {
    let $tabbedTimelineContainer = document.querySelector(tabbedTimelineContainerSelector)
    if ($tabbedTimelineContainer) {
      let waitingForNewTimeline = false
      pageObservers.push(
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
        }, 'tabbed timeline container')
      )
    } else {
      warn('tabbed timeline container not found')
    }
  }
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
    pageObservers.push(
      observeElement($timeline, () => onIndividualTweetTimelineChange($timeline, {observers: pageObservers}), 'individual tweet timeline')
    )
  }

  // If the inital timeline doesn't have a style attribute it's a placeholder
  if ($timeline.hasAttribute('style')) {
    observeTimelineItems($timeline)
  }
  else {
    log('waiting for individual tweet timeline')
    let startTime = Date.now()
    pageObservers.push(
      observeElement($timeline.parentElement, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((/** @type {HTMLElement} */ $timeline) => {
            disconnectPageObserver('individual tweet timeline parent')
            if (Date.now() > startTime) {
              log(`individual tweet timeline appeared after ${Date.now() - startTime}ms`, $timeline)
            }
            observeTimelineItems($timeline)
          })
        })
      }, 'individual tweet timeline parent')
    )
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
  $addMutedWord.classList.add('tnt_menu_item')
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
 * Add a "Mute this conversation" menu item to a Quote Tweet's menu.
 * @param {HTMLElement} $blockMenuItem
 */
async function addMuteQuotesMenuItem($blockMenuItem) {
  log('adding "Mute this conversation" menu item')

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
  $muteQuotes.classList.add('tnt_menu_item')
  $muteQuotes.querySelector('span').textContent = getString('MUTE_THIS_CONVERSATION')
  $muteQuotes.addEventListener('click', (e) => {
    e.preventDefault()
    log('muting quotes of a tweet', quotedTweet)
    config.mutedQuotes = config.mutedQuotes.concat(quotedTweet)
    storeConfigChanges({mutedQuotes: config.mutedQuotes})
    processCurrentPage()
    // Dismiss the menu
    let $menuLayer = /** @type {HTMLElement} */ ($blockMenuItem.closest('[role="group"]')?.firstElementChild?.firstElementChild)
    if (!$menuLayer) {
      log('could not find menu layer to dismiss menu')
    }
    $menuLayer?.click()
  })

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
  $toggleRetweets.classList.add('tnt_menu_item')
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
 * Redirects away from the home timeline if we're on it and it's been disabled.
 * @returns {boolean} `true` if redirected as a result of this call
 */
function checkforDisabledHomeTimeline() {
  if (config.disableHomeTimeline && location.pathname == '/home') {
    log(`home timeline disabled, redirecting to /${config.disabledHomeTimelineRedirect}`)
    let primaryNavSelector = desktop ? Selectors.PRIMARY_NAV_DESKTOP : Selectors.PRIMARY_NAV_MOBILE
    ;/** @type {HTMLElement} */ (
      document.querySelector(`${primaryNavSelector} a[href="/${config.disabledHomeTimelineRedirect}"]`)
    ).click()
    return true
  }
}

//#region CSS
const configureCss = (() => {
  let $style

  return function configureCss() {
    if ($style == null) {
      $style = addStyle('features')
    }
    let cssRules = []
    let hideCssSelectors = []
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
      .tnt_menu_item:hover { background-color: var(--hover-bg-color) !important; }
    `)

    if (config.alwaysUseLatestTweets && config.hideForYouTimeline) {
      cssRules.push(`
        /* Prevent the For you tab container taking up space */
        body.TabbedTimeline ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:first-child {
          flex-grow: 0;
          flex-shrink: 1;
        }
        /* Hide the For you tab link */
        body.TabbedTimeline ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:first-child > a {
          display: none;
        }
      `)
      if (desktop) {
        // Don't accidentally hide the Media button in the Tweet box toolbar
        cssRules.push(`
          body.TabbedTimeline ${Selectors.PRIMARY_COLUMN} div[data-testid="toolBar"] nav div[role="tablist"] > div:first-child {
            flex-shrink: 0;
          }
        `)
      }
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
      hideCssSelectors.push(
        // Under timeline tweets
        // The Buffer extension adds a new button in position 2 - use their added class to avoid
        // hiding the wrong button.
        '[data-testid="tweet"][tabindex="0"] [role="group"]:not(.buffer-inserted) > div:nth-of-type(5)',
        '[data-testid="tweet"][tabindex="0"] [role="group"].buffer-inserted > div:nth-of-type(6)',
        // Under the focused tweet
        '[data-testid="tweet"][tabindex="-1"] [role="group"][id^="id__"]:not(.buffer-inserted) > div:nth-child(4)',
        '[data-testid="tweet"][tabindex="-1"] [role="group"][id^="id__"].buffer-inserted > div:nth-child(5)',
      )
    }
    if (config.hideBookmarksNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/bookmarks"]`)
    }
    if (config.hideCommunitiesNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/communities"]`)
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
        'body.Default [data-testid="tweet"] [data-testid="userFollowIndicator"][style*="color: rgb(141, 32, 144)"]',
        'body:is(.Dim, .LightsOut) [data-testid="tweet"] [data-testid="userFollowIndicator"][style*="color: rgb(223, 130, 224)"]',
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
        }
      `)
    }
    if (config.hideMetrics) {
      configureHideMetricsCss(cssRules, hideCssSelectors)
    }
    if (config.hideMonetizationNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/settings/monetization"]`)
    }
    if (config.hideAdsNav) {
      hideCssSelectors.push(`${menuRole} a[href*="ads.twitter.com"]`)
    }
    if (config.hideTweetAnalyticsLinks) {
      hideCssSelectors.push('a[data-testid="analyticsButton"]')
    }
    if (config.hideTwitterBlueUpsells) {
      hideCssSelectors.push(
        // Premium/Verified/Verified Orgs menu item
        `${menuRole} a:is([href$="/i/premium_sign_up"], [href$="/i/premium_tier_switch"], [href$="/i/verified-choose"], [href$="/i/verified-orgs-signup"])`,
        // "Highlight on your profile" on your tweets
        '[role="menuitem"][data-testid="highlightUpsell"]',
        // "Edit with Premium" on recent tweets
        '[role="menuitem"][data-testid="editWithTwitterBlue"]',
        // Premium item in Settings
        'body.Settings a[href="/i/premium_sign_up"]',
        // "Highlight your best content instead" on the pin modal
        '.PinModal [data-testid="sheetDialog"] > div > div:last-child > div > div > div:first-child',
        // Highlight button on the pin modal
        '.PinModal [data-testid="sheetDialog"] div[role="button"]:first-child:nth-last-child(3)',
      )
      // Allow Pin and Cancel buttons go to max-width on the pin modal
      cssRules.push(`
        .PinModal [data-testid="sheetDialog"] > div > div:last-child > div > div {
          width: 100%;
          margin-top: 0;
          padding-left: 32px;
          padding-right: 32px;
        }
      `)
      // Hide Subscribe prompts in the timeline
      cssRules.push(`
        @supports selector(:has(*)) {
          div[data-testid="inlinePrompt"]:has(a[href^="/i/premium"]) {
            display: none !important;
          }
        }
      `)
    }
    if (config.hideVerifiedNotificationsTab) {
      cssRules.push(`
        body.Notifications ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(2),
        body.ProfileFollows ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(1) {
          flex: 0;
        }
        body.Notifications ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(2) > a,
        body.ProfileFollows ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:nth-child(1) > a {
          display: none;
        }
      `)
    }
    if (config.hideViews) {
      hideCssSelectors.push(
        // "Views" under the focused tweet
        '[data-testid="tweet"][tabindex="-1"] div[dir] + div[aria-hidden="true"]:nth-child(2):nth-last-child(2)',
        '[data-testid="tweet"][tabindex="-1"] div[dir] + div[aria-hidden="true"]:nth-child(2):nth-last-child(2) + div[dir]:last-child'
      )
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
      hideCssSelectors.push(
        // Existing headline overlaid on the card
        '.tnt_overlay_headline',
        // From <domain> link after the card
        'div[data-testid="card.wrapper"] + a',
      )
    } else {
      hideCssSelectors.push('.tnt_link_headline')
    }
    if (config.restoreQuoteTweetsLink || config.restoreOtherInteractionLinks) {
      cssRules.push(`
        #tntInteractionLinks a {
          text-decoration: none;
          color: var(--color);
        }
        #tntInteractionLinks a:hover span:last-child {
          text-decoration: underline;
        }
        #tntQuoteTweetCount {
          margin-right: 2px;
          font-weight: 700;
          color: var(--color-emphasis);
        }
        /* Replaces the "View post engagements" link under your own tweets */
        a[data-testid="analyticsButton"] {
          display: none;
        }
      `)
    } else {
      hideCssSelectors.push('#tntInteractionLinks')
    }
    if (!config.restoreQuoteTweetsLink) {
      hideCssSelectors.push('#tntQuoteTweetsLink')
    }
    if (!config.restoreOtherInteractionLinks) {
      hideCssSelectors.push('#tntRetweetsLink', '#tntLikesLink')
    }
    if (config.tweakQuoteTweetsPage) {
      // Hide the quoted tweet, which is repeated in every quote tweet
      hideCssSelectors.push('body.QuoteTweets [data-testid="tweet"] [aria-labelledby] > div:last-child')
    }
    if (config.twitterBlueChecks == 'hide') {
      hideCssSelectors.push('.tnt_blue_check')
    }
    if (config.twitterBlueChecks == 'replace') {
      cssRules.push(`
        :is(${Selectors.VERIFIED_TICK}, svg[data-testid="verificationBadge"]).tnt_blue_check path {
          d: path("${Svgs.BLUE_LOGO_PATH}");
        }
      `)
    }

    if (shouldShowSeparatedTweetsTab()) {
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

        /* Tabbed timeline */
        body.Desktop #tnt_separated_tweets_tab:hover,
        body.Mobile:not(.SeparatedTweets) #tnt_separated_tweets_tab:hover,
        body.Mobile #tnt_separated_tweets_tab:active {
          background-color: var(--tab-hover);
        }
        body:not(.SeparatedTweets) #tnt_separated_tweets_tab > a > div > div,
        body.TabbedTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#tnt_separated_tweets_tab) > a > div > div {
          font-weight: normal !important;
          color: var(--color) !important;
        }
        body.SeparatedTweets #tnt_separated_tweets_tab > a > div > div {
          font-weight: bold;
          color: var(--color-emphasis); !important;
        }
        body:not(.SeparatedTweets) #tnt_separated_tweets_tab > a > div > div > div,
        body.TabbedTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#tnt_separated_tweets_tab) > a > div > div > div {
          height: 0 !important;
        }
        body.SeparatedTweets #tnt_separated_tweets_tab > a > div > div > div {
          height: 4px !important;
          min-width: 56px;
          width: 100%;
          position: absolute;
          bottom: 0;
          border-radius: 9999px;
        }
      `)
    }

    //#region Desktop-only
    if (desktop) {
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
        hideCssSelectors.push(`body.MainTimeline ${Selectors.PRIMARY_COLUMN} > div > div:first-child > div[style^="transform"]`)
      }
      if (config.hideTimelineTweetBox) {
        hideCssSelectors.push(`body.MainTimeline ${Selectors.PRIMARY_COLUMN} > div > div:nth-child(3)`)
      }
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/home"]`)
      }
      if (config.fullWidthContent) {
        cssRules.push(`
          /* Use full width when the sidebar is visible */
          body.Sidebar${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN},
          body.Sidebar${FULL_WIDTH_BODY_PSEUDO} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:last-child {
            max-width: 990px;
          }
          /* Make the "What's happening" input keep its original width */
          body.MainTimeline ${Selectors.PRIMARY_COLUMN} > div:first-child > div:nth-of-type(3) div[role="progressbar"] + div {
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
      if (config.hideGrokNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/i/grok"]`)
      }
      if (config.hideListsNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/lists"]`)
      }
      if (config.hideProNav) {
        hideCssSelectors.push(`${menuRole} a:is([href*="tweetdeck.twitter.com"], [href*="pro.twitter.com"])`)
      }
      if (config.hideTwitterBlueUpsells) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a:is([href$="/i/premium_sign_up"], [href$="/i/premium_tier_switch"], [href$="/i/verified-choose"], [href$="/i/verified-orgs-signup"])`)
      }
      if (config.hideSidebarContent) {
        // Only show the first sidebar item by default
        // Re-show subsequent non-algorithmic sections on specific pages
        cssRules.push(`
          ${Selectors.SIDEBAR_WRAPPERS} > div:not(:first-of-type) {
            display: none;
          }
          body.Search ${Selectors.SIDEBAR_WRAPPERS} > div:nth-of-type(2) {
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
      } else if (config.hideTwitterBlueUpsells) {
        // Hide "Subscribe to premium" individually
        hideCssSelectors.push(
          `body.MainTimeline ${Selectors.SIDEBAR_WRAPPERS} > div:nth-of-type(3)`
        )
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
        hideCssSelectors.push(`${bodySelector}${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`)
      }
      if (config.hideBookmarksNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/bookmarks"]`)
      }
      if (config.hideCommunitiesNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/communities"]`)
      }
      if (config.hideMessagesDrawer) {
        cssRules.push(`${Selectors.MESSAGES_DRAWER} { visibility: hidden; }`)
      }
      if (config.hideViews) {
        hideCssSelectors.push(
          // Under timeline tweets
          // The Buffer extension adds a new button in position 2 - use their added class to avoid
          // hiding the wrong button (#209)
          '[data-testid="tweet"][tabindex="0"] [role="group"]:not(.buffer-inserted) > div:nth-of-type(4)',
          '[data-testid="tweet"][tabindex="0"] [role="group"].buffer-inserted > div:nth-of-type(5)',
          // In media modal
          '[aria-modal="true"] > div > div:first-of-type [role="group"] > div:nth-child(4)',
        )
      }
      if (config.retweets != 'separate' && config.quoteTweets != 'separate') {
        hideCssSelectors.push('#tnt_separated_tweets_tab')
      }
    }
    //#endregion

    //#region Mobile only
    if (mobile) {
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`)
      }
      if (config.hideSeeNewTweets) {
        hideCssSelectors.push(`body.MainTimeline ${Selectors.MOBILE_TIMELINE_HEADER} ~ div[style^="transform"]:last-child`)
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
      if (config.hideListsNav) {
        hideCssSelectors.push(`${menuRole} a[href$="/lists"]`)
      }
      if (config.hideGrokNav) {
        hideCssSelectors.push(
          // Grok is currently in the bottom nav on mobile
          `${Selectors.PRIMARY_NAV_MOBILE} a[href="/i/grok"]`,
          // In case they ever move it to the slide-out menu
          `${menuRole} a[href$="/i/grok"]`,
        )
      }
      if (config.hideMessagesBottomNavItem) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/messages"]`)
      }
      if (config.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media modal
          `body.MobileMedia [role="group"] > div[style]:not(${TWITTER_MEDIA_ASSIST_BUTTON_SELECTOR})`,
        )
      }
      if (config.hideViews) {
        hideCssSelectors.push(
          // Under timeline tweets - views only display on mobile at larger widths on mobile
          // When only the Share button is also displayed - 4th of 5
          '[data-testid="tweet"][tabindex="0"] [role="group"]:not(.buffer-inserted) > div:nth-child(4):nth-last-child(2)',
          '[data-testid="tweet"][tabindex="0"] [role="group"].buffer-inserted > div:nth-child(5):nth-last-child(2)',
          // When the Bookmark and Share buttons are also displayed - 4th of 6
          '[data-testid="tweet"][tabindex="0"] [role="group"]:not(.buffer-inserted) > div:nth-child(4):nth-last-child(3)',
          '[data-testid="tweet"][tabindex="0"] [role="group"].buffer-inserted > div:nth-child(5):nth-last-child(3)',
          // In media modal
          'body.MobileMedia [role="group"] > div:nth-child(4)',
        )
      }
      //#endregion
    }

    if (hideCssSelectors.length > 0) {
      cssRules.push(`
        ${hideCssSelectors.join(',\n')} {
          display: none !important;
        }
      `)
    }

    $style.textContent = cssRules.map(dedent).join('\n')
  }
})()

function configureFont() {
  if (!fontFamilyRule) {
    warn('no fontFamilyRule found for configureFont to use')
    return
  }

  if (config.dontUseChirpFont) {
    if (fontFamilyRule.style.fontFamily.includes('TwitterChirp')) {
      fontFamilyRule.style.fontFamily = fontFamilyRule.style.fontFamily.replace(/"?TwitterChirp"?, ?/, '')
      log('disabled Chirp font')
    }
  } else if (!fontFamilyRule.style.fontFamily.includes('TwitterChirp')) {
    fontFamilyRule.style.fontFamily = `"TwitterChirp", ${fontFamilyRule.style.fontFamily}`
    log(`enabled Chirp font`)
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
    // Tweet count under username header on profile pages
    hideCssSelectors.push(`
      body.Profile ${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 + div[dir]
    `)
  }

  let timelineMetricSelectors = [
    config.hideReplyMetrics   && '[data-testid="reply"]',
    config.hideRetweetMetrics && '[data-testid$="retweet"]',
    config.hideLikeMetrics    && '[data-testid$="like"]',
    config.hideBookmarkMetrics && '[data-testid$="bookmark"]',
  ].filter(Boolean).join(', ')

  if (timelineMetricSelectors) {
    cssRules.push(
      `[role="group"] div:is(${timelineMetricSelectors}) span { visibility: hidden; }`
    )
  }

  if (config.hideQuoteTweetMetrics) {
    hideCssSelectors.push('#tntQuoteTweetCount')
  }
}

const configureNavFontSizeCss = (() => {
  let $style

  return function configureNavFontSizeCss() {
    if ($style == null) {
      $style = addStyle('nav-font-size')
    }
    let cssRules = []

    if (fontSize != null && config.navBaseFontSize) {
      cssRules.push(`
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir] span { font-size: ${fontSize}; font-weight: normal; }
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir] { margin-top: -4px; }
      `)
    }

    $style.textContent = cssRules.map(dedent).join('\n')
  }
})()
//#endregion

/**
 * Configures – or re-configures – the separated tweets timeline title.
 *
 * If we're currently on the separated tweets timeline and…
 * - …its title has changed, the page title will be changed to "navigate" to it.
 * - …the separated tweets timeline is no longer needed, we'll change the page
 *   title to "navigate" back to the main timeline.
 *
 * @returns {boolean} `true` if "navigation" was triggered by this call
 */
function configureSeparatedTweetsTimelineTitle() {
  let wasOnSeparatedTweetsTimeline = isOnSeparatedTweetsTimeline()
  let previousTitle = separatedTweetsTimelineTitle

  if (config.retweets == 'separate' && config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = getString('SHARED_TWEETS')
  } else if (config.retweets == 'separate') {
    separatedTweetsTimelineTitle = getString('RETWEETS')
  } else if (config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = getString('QUOTE_TWEETS')
  } else {
    separatedTweetsTimelineTitle = null
  }

  let titleChanged = previousTitle != separatedTweetsTimelineTitle
  if (wasOnSeparatedTweetsTimeline) {
    if (separatedTweetsTimelineTitle == null) {
      log('moving from separated tweets timeline to main timeline after config change')
      setTitle(getString('HOME'))
      return true
    }
    if (titleChanged) {
      log('applying new separated tweets timeline title after config change')
      setTitle(separatedTweetsTimelineTitle)
      return true
    }
  } else {
    if (titleChanged && previousTitle != null && lastMainTimelineTitle == previousTitle) {
      log('updating lastMainTimelineTitle with new separated tweets timeline title')
      lastMainTimelineTitle = separatedTweetsTimelineTitle
    }
  }
}

const configureThemeCss = (() => {
  let $style

  return function configureThemeCss() {
    if ($style == null) {
      $style = addStyle('theme')
    }
    let cssRules = []

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
        body.SeparatedTweets #tnt_separated_tweets_tab > a > div > div > div {
          background-color: ${themeColor} !important;
        }
      `)
    }

    if (config.replaceLogo) {
      cssRules.push(`
        ${Selectors.X_LOGO_PATH} {
          fill: ${THEME_BLUE};
          d: path("${Svgs.TWITTER_LOGO_PATH}");
        }
        .tnt_logo {
          fill: ${THEME_BLUE};
        }
        svg path[d="${Svgs.X_HOME_ACTIVE_PATH}"] {
          d: path("${Svgs.TWITTER_HOME_ACTIVE_PATH}");
        }
        svg path[d="${Svgs.X_HOME_INACTIVE_PATH}"] {
          d: path("${Svgs.TWITTER_HOME_INACTIVE_PATH}");
        }
      `)
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
            background-color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-unfollow"]:not(:hover) > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
          /* Follow button */
          [role="button"][data-testid$="-follow"] {
            border-color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-follow"] > :is(div, span) {
            color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-follow"]:hover {
            background-color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-follow"]:hover > :is(div, span) {
            color: rgb(255, 255, 255) !important;
          }
        `)
      }
      if (mobile) {
        cssRules.push(`
          body.MediaViewer [role="button"][data-testid$="follow"]:not(:hover) {
            border: revert !important;
            background-color: transparent !important;
          }
          body.MediaViewer [role="button"][data-testid$="follow"]:not(:hover) > div {
            color: ${themeColor} !important;
          }
        `)
      }
    }

    $style.textContent = cssRules.map(dedent).join('\n')
  }
})()

/**
 * @param {HTMLElement} $tweet
 * @param {?{getText?: boolean}} options
 * @returns {import("./types").QuotedTweet}
 */
 function getQuotedTweetDetails($tweet, options = {}) {
  let {getText = false} = options
  let $quotedTweet = $tweet.querySelector('div[id^="id__"] > div[dir] > span').parentElement.nextElementSibling
  let $userName = $quotedTweet?.querySelector('[data-testid="User-Name"]')
  let user = $userName?.querySelector('[tabindex="-1"]')?.textContent
  let time = $userName?.querySelector('time')?.dateTime
  if (!getText) return {user, time}

  let $heading = $quotedTweet?.querySelector(':scope > div > div:first-child')
  let $qtText = $heading?.nextElementSibling?.querySelector('[lang]')
  let text = $qtText && Array.from($qtText.childNodes, node => {
    if (node.nodeType == 1) {
      if (node.nodeName == 'IMG') return node.alt
      return node.textContent
    }
    return node.nodeValue
  }).join('')
  return {user, time, text}
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

  if (desktop && !isDesktopComposeTweetModalOpen && location.pathname.startsWith(PagePaths.COMPOSE_TWEET)) {
    log('compose tweet modal opened')
    isDesktopComposeTweetModalOpen = true
    observeDesktopComposeTweetModal($popup)
    return {
      tookAction: true,
      onPopupClosed() {
        log('compose tweet modal closed')
        isDesktopComposeTweetModalOpen = false
        // The Tweet button will re-render if the modal was opened to edit
        // multiple Tweets on the home timeline.
        if (config.replaceLogo && isOnHomeTimeline()) {
          tweakTweetButton()
        }
      }
    }
  }

  if (desktop && !isDesktopMediaModalOpen && URL_MEDIA_RE.test(location.pathname) && currentPath != location.pathname) {
    log('media modal opened')
    isDesktopMediaModalOpen = true
    observeDesktopModalTimeline($popup)
    return {
      tookAction: true,
      onPopupClosed() {
        log('media modal closed')
        isDesktopMediaModalOpen = false
        disconnectAllModalObservers()
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
    let $switchSvg = $popup.querySelector(`svg path[d^="M12 3.75c-4.56 0-8.25 3.69-8.25 8.25s"]`)
    if ($switchSvg) {
      addToggleListRetweetsMenuItem($popup.querySelector(`[role="menuitem"]`))
      return {tookAction: true}
    }
  }

  if (config.mutableQuoteTweets) {
    if (quotedTweet) {
      let $blockMenuItem = /** @type {HTMLElement} */ ($popup.querySelector(Selectors.BLOCK_MENU_ITEM))
      if ($blockMenuItem) {
        addMuteQuotesMenuItem($blockMenuItem)
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

  if (config.hideTwitterBlueUpsells) {
    // The "Pin to your profile" menu item is currently the only one which opens
    // a sheet dialog.
    if (pinMenuItemSeen && $popup.querySelector('[data-testid="sheetDialog"]')) {
      log('pin to your profile modal opened')
      $popup.classList.add('PinModal')
      result.tookAction = true
    }
    else if ($popup.querySelector('[data-testid="highlighOnPin"]')) {
      log('preparing to hide Twitter Blue upsell when pinning a tweet')
      pinMenuItemSeen = true
      // Create a nested observer for mobile, as it reuses the popup element
      result.tookAction = !mobile
    } else {
      pinMenuItemSeen = false
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

    // User hovercard popup
    let $hoverCard = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="HoverCard"]'))
    if ($hoverCard) {
      result.tookAction = true
      getElement('div[data-testid^="UserAvatar-Container"]', {
        context: $hoverCard,
        name: 'user hovercard contents',
        timeout: 500,
      }).then(($contents) => {
        if ($contents) processBlueChecks($popup)
      })
    }
  }

  // Verified account popup when you press the check button on a profile page
  if (config.twitterBlueChecks == 'replace' && isOnProfilePage()) {
    if (mobile) {
      let $verificationBadge = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="sheetDialog"] [data-testid="verificationBadge"]'))
      if ($verificationBadge) {
        result.tookAction = true
        let $headerBlueCheck = document.querySelector(`body.Profile ${Selectors.MOBILE_TIMELINE_HEADER} .tnt_blue_check`)
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

          let $headerBlueCheck = document.querySelector(`body.Profile ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 .tnt_blue_check`)
          if (!$headerBlueCheck) return

          // Wait for the hovercard to render its contents
          let popupRenderObserver = observeElement($popup, (mutations) => {
            if (!mutations.length) return
            blueCheck($popup.querySelector('svg[data-testid="verificationBadge"]'))
            popupRenderObserver.disconnect()
          }, 'verified popup render', {childList: true, subtree: true})
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
      return 'VERIFIED_ORG'
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
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((/** @type {HTMLElement} */ $el) => {
        log('nested popup appeared', $el)
        $nestedPopup = $el
        ;({onPopupClosed} = handlePopup($el))
      })
      mutation.removedNodes.forEach((/** @type {HTMLElement} */ $el) => {
        if ($el !== $nestedPopup) return
        if (onPopupClosed) {
          log('cleaning up after nested popup removed')
          onPopupClosed()
        }
      })
    })
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

  let isOnMainTimeline = isOnMainTimelinePage()
  let isOnListTimeline = isOnListPage()
  let isOnProfileTimeline = isOnProfilePage()
  let timelineHasSpecificHandling = isOnMainTimeline || isOnListTimeline || isOnProfileTimeline

  if (config.twitterBlueChecks != 'ignore' && (isUserTimeline || !timelineHasSpecificHandling)) {
    processBlueChecks($timeline)
  }

  if (isSafari && config.replaceLogo && isOnNotificationsPage()) {
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
      if (timelineHasSpecificHandling) {
        isReply = isReplyToPreviousTweet($tweet)
        if (isReply && hidPreviousItem != null) {
          hideItem = hidPreviousItem
        } else {
          if (isOnMainTimeline) {
            hideItem = shouldHideMainTimelineItem(itemType, page)
          }
          else if (isOnListTimeline) {
            hideItem = shouldHideListTimelineItem(itemType)
          }
          else if (isOnProfileTimeline) {
            hideItem = shouldHideProfileTimelineItem(itemType)
          }
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
    else if (!timelineHasSpecificHandling) {
      if ($item.querySelector(':scope > div > div > div > article')) {
        itemType = 'UNAVAILABLE'
      }
    }

    if (!timelineHasSpecificHandling) {
      if (itemType != null) {
        hideItem = shouldHideOtherTimelineItem(itemType)
      }
    }

    if (itemType == null) {
      if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        hideItem = hideHeadings && config.hideWhoToFollowEtc
      }
    }

    if (debug && itemType != null) {
      $item.firstElementChild.dataset.itemType = `${itemType}${isReply ? ' / REPLY' : ''}${isBlueTweet ? ' / BLUE' : ''}`
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

    if (hideItem != null && $item.firstElementChild) {
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.display != (hideItem ? 'none' : '')) {
        changes.push({$item, hideItem})
      }
    }

    hidPreviousItem = hideItem
  }

  for (let change of changes) {
    /** @type {HTMLElement} */ (change.$item.firstElementChild).style.display = change.hideItem ? 'none' : ''
  }

  log(
    `processed ${$timeline.children.length} timeline item${s($timeline.children.length)} in ${Date.now() - startTime}ms`,
    itemTypes, `hid ${hiddenItemCount}`, hiddenItemTypes
  )
}

/**
 * @param {HTMLElement} $timeline
 * @param {import("./types").IndividualTweetTimelineOptions} options
 */
function onIndividualTweetTimelineChange($timeline, options) {
  let startTime = Date.now()

  let itemTypes = {}
  let hiddenItemCount = 0
  let hiddenItemTypes = {}

  /** @type {?boolean} */
  let hidPreviousItem = null
  /** @type {boolean} */
  let hideAllSubsequentItems = false
  /** @type {string} */
  let opScreenName = /^\/([a-zA-Z\d_]{1,20})\//.exec(location.pathname)[1].toLowerCase()
  /** @type {{$item: Element, hideItem?: boolean}[]} */
  let changes = []
  /** @type {import("./types").UserInfoObject} */
  let userInfo = getUserInfo()
  /** @type {?HTMLElement} */
  let $focusedTweet

  for (let $item of $timeline.children) {
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

      if (!hideItem && config.restoreLinkHeadlines) {
        restoreLinkHeadline($tweet)
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
        }

        // Replies to the focused tweet don't have the reply indicator
        if (tweetVerifiedType && !isFocusedTweet && !isReply && screenName.toLowerCase() != opScreenName) {
          itemType = `${tweetVerifiedType}_REPLY`
          if (!hideItem) {
            let user = userInfo[screenName]
            let shouldHideBasedOnVerifiedType = config.hideTwitterBlueReplies && (
              tweetVerifiedType == 'BLUE' ||
              tweetVerifiedType == 'VERIFIED_ORG' && !config.showBlueReplyVerifiedAccounts
            )
            hideItem = shouldHideBasedOnVerifiedType && (user == null || !(
              user.following && !config.hideBlueReplyFollowing ||
              user.followedBy && !config.hideBlueReplyFollowedBy ||
              user.followersCount >= 1000000 && config.showBlueReplyFollowersCount
            ))
          }
        }
      }
    }
    else if ($item.querySelector('article')) {
      if ($item.querySelector('[role="button"]')?.textContent == getString('SHOW')) {
        itemType = 'SHOW_MORE'
      } else {
        itemType = 'UNAVAILABLE'
        hideItem = config.hideUnavailableQuoteTweets
      }
    } else {
      // We need to identify "Show more replies" so it doesn't get hidden if the
      // item immediately before it was hidden.
      let $button = $item.querySelector('div[role="button"]')
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

    if (debug && itemType != null) {
      $item.firstElementChild.dataset.itemType = `${itemType}${isReply ? ' / REPLY' : ''}`
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
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.display != (hideItem ? 'none' : '')) {
        changes.push({$item, hideItem})
      }
    }

    hidPreviousItem = hideItem
  }

  for (let change of changes) {
    /** @type {HTMLElement} */ (change.$item.firstElementChild).style.display = change.hideItem ? 'none' : ''
  }

  tweakFocusedTweet($focusedTweet, options)

  log(
    `processed ${$timeline.children.length} thread item${s($timeline.children.length)} in ${Date.now() - startTime}ms`,
    itemTypes, `hid ${hiddenItemCount}`, hiddenItemTypes
  )
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

  if (config.replaceLogo && Boolean(notificationCount) != Boolean(currentNotificationCount)) {
    observeFavicon.updatePip(Boolean(notificationCount))
  }

  let homeNavigationWasUsed = homeNavigationIsBeingUsed
  homeNavigationIsBeingUsed = false

  if (title == 'X' || title == getString('TWITTER')) {
    // Mobile uses "Twitter" when viewing media - we need to let these process
    // so the next page will be re-processed when the media is closed.
    if (mobile && (URL_MEDIA_RE.test(location.pathname) || URL_MEDIAVIEWER_RE.test(location.pathname))) {
      log('viewing media on mobile')
    }
    // Going to the root Settings page on desktop when the sidebar is hidden
    // sets an empty title.
    else if (desktop && location.pathname == '/settings' && currentPath != '/settings') {
      log('viewing root Settings page')
    }
    // Ignore Flash of Uninitialised Title when navigating to a page for the
    // first time.
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

  // Only allow the same page to re-process after a title change on desktop if
  // the "Customize your view" dialog is currently open.
  if (newPage == currentPage && !(desktop && location.pathname == PagePaths.CUSTOMIZE_YOUR_VIEW)) {
    log('ignoring duplicate title change')
    currentNotificationCount = notificationCount
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
      // …the title has changed back to the main timeline…
      (newPage == getString('HOME')) &&
      // …the Home nav link or Following / Home header _wasn't_ clicked and…
      !homeNavigationWasUsed &&
      (
        // …the user opened Timeline settings dialog.
        location.pathname == PagePaths.TIMELINE_SETTINGS ||
        // …the user closed the Timeline settings dialog.
        currentPath == PagePaths.TIMELINE_SETTINGS ||
        // …the user viewed media.
        URL_MEDIA_RE.test(location.pathname) ||
        // …the user stopped viewing media.
        URL_MEDIA_RE.test(currentPath) ||
        // …the user opened or used the "Customize your view" dialog.
        location.pathname == PagePaths.CUSTOMIZE_YOUR_VIEW ||
        // …the user closed the "Customize your view" dialog.
        currentPath == PagePaths.CUSTOMIZE_YOUR_VIEW ||
        // …the user opened the "Send via Direct Message" dialog.
        location.pathname == PagePaths.COMPOSE_MESSAGE ||
        // …the user closed the "Send via Direct Message" dialog.
        currentPath == PagePaths.COMPOSE_MESSAGE ||
        // …the user opened the compose Tweet dialog.
        location.pathname == PagePaths.COMPOSE_TWEET ||
        // …the user closed the compose Tweet dialog.
        currentPath == PagePaths.COMPOSE_TWEET ||
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
      lastMainTimelineTitle != null &&
      separatedTweetsTimelineTitle != null &&
      lastMainTimelineTitle == separatedTweetsTimelineTitle) {
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

  if (isOnMainTimelinePage()) {
    lastMainTimelineTitle = currentPage
  }

  log('processing new page')

  processCurrentPage()
}

/**
 * Processes all Twitter Blue checks inside an element.
 * @param {HTMLElement} $el
 */
function processBlueChecks($el) {
  for (let $svg of $el.querySelectorAll(`${Selectors.VERIFIED_TICK}:not(.tnt_blue_check)`)) {
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
  if (pageObservers.length > 0) {
    log(
      `disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`,
      pageObservers.map(observer => observer['name'])
    )
    pageObservers.forEach(observer => observer.disconnect())
    pageObservers = []
  }

  // Hooks for styling pages
  $body.classList.toggle('Community', isOnCommunityPage())
  $body.classList.toggle('Explore', isOnExplorePage())
  $body.classList.toggle('HideSidebar', shouldHideSidebar())
  $body.classList.toggle('List', isOnListPage())
  $body.classList.toggle('MainTimeline', isOnMainTimelinePage())
  $body.classList.toggle('Notifications', isOnNotificationsPage())
  $body.classList.toggle('Profile', isOnProfilePage())
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
  $body.classList.remove('TabbedTimeline')
  $body.classList.remove('SeparatedTweets')

  if (desktop) {
    let shouldObserveSidebarForConfig = (
      config.twitterBlueChecks != 'ignore' ||
      config.fullWidthContent ||
      config.hideExploreNav && config.hideExploreNavWithSidebar
    )
    if (shouldObserveSidebarForConfig && !isOnMessagesPage() && !isOnSettingsPage()) {
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

  if (isOnMainTimelinePage()) {
    tweakMainTimelinePage()
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
  else if (URL_TWEET_ENGAGEMENT_RE.test(currentPath)) {
    tweakTweetEngagementPage()
  }
  else if (isOnListPage()) {
    tweakListPage()
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

  // On mobile, these are pages instead of modals
  if (mobile) {
    if (currentPath == PagePaths.COMPOSE_TWEET) {
      tweakMobileComposeTweetPage()
    }
    else if (URL_MEDIAVIEWER_RE.test(currentPath)) {
      tweakMobileMediaViewerPage()
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
    document.querySelector('#tnt_separated_tweets_tab')?.remove()
  }
}

/**
 * @param {HTMLElement} $tweet
 */
function restoreLinkHeadline($tweet) {
  let $link = /** @type {HTMLElement} */ ($tweet.querySelector('div[data-testid="card.layoutLarge.media"] > a[rel][aria-label]'))
  if ($link && !$link.dataset.headlineRestored) {
    let [site, ...rest] = $link.getAttribute('aria-label').split(' ')
    let headline = rest.join(' ')
    $link.lastElementChild?.classList.add('tnt_overlay_headline')
    $link.insertAdjacentHTML('beforeend', `<div class="tnt_link_headline ${fontFamilyRule?.selectorText?.replace('.', '')}" style="border-top: 1px solid var(--border-color); padding: 14px;">
      <div style="color: var(--color); margin-bottom: 2px;">${site}</div>
      <div style="color: var(--color-emphasis)">${headline}</div>
    </div>`)
    $link.dataset.headlineRestored = 'true'
  }
}

/**
 * @param {HTMLElement} $focusedTweet
 */
function restoreTweetInteractionsLinks($focusedTweet) {
  if (!config.restoreQuoteTweetsLink && !config.restoreOtherInteractionLinks) return

  let [tweetLink, tweetId] = location.pathname.match(/^\/[a-zA-Z\d_]{1,20}\/status\/(\d+)/) ?? []
  let tweetInfo = getTweetInfo(tweetId)
  log('focused tweet', {tweetLink, tweetId, tweetInfo})
  if (!tweetInfo) return

  let shouldDisplayLinks = (
    (config.restoreQuoteTweetsLink && tweetInfo.quote_count > 0) ||
    (config.restoreOtherInteractionLinks && (tweetInfo.retweet_count > 0 || tweetInfo.favorite_count > 0))
  )
  let $existingLinks = $focusedTweet.querySelector('#tntInteractionLinks')
  if (!shouldDisplayLinks || $existingLinks) {
    if (!shouldDisplayLinks) $existingLinks?.remove()
    return
  }

  let $group = $focusedTweet.querySelector('[role="group"][id^="id__"]')
  if (!$group) return warn('focused tweet action bar not found')

  $group.parentElement.insertAdjacentHTML('beforebegin', `
    <div id="tntInteractionLinks">
      <div class="${fontFamilyRule?.selectorText?.replace('.', '')}" style="padding: 16px 4px; border-top: 1px solid var(--border-color); display: flex; gap: 20px;">
        ${tweetInfo.quote_count > 0 ? `<a id="tntQuoteTweetsLink" class="quoteTweets" href="${tweetLink}/quotes" dir="auto" role="link">
          <span id="tntQuoteTweetCount">
            ${Intl.NumberFormat(lang, {notation: tweetInfo.quote_count < 10000 ? 'standard' : 'compact', compactDisplay: 'short'}).format(tweetInfo.quote_count)}
          </span>
          <span>${getString(tweetInfo.quote_count == 1 ? 'QUOTE_TWEET' :'QUOTE_TWEETS')}</span>
        </a>` : ''}
        ${tweetInfo.retweet_count > 0 ? `<a id="tntRetweetsLink" data-tab="2" href="${tweetLink}/retweets" dir="auto" role="link">
          <span>${getString('RETWEETS')}</span>
        </a>` : ''}
        ${tweetInfo.favorite_count > 0 ? `<a id="tntLikesLink" data-tab="3" href="${tweetLink}/likes" dir="auto" role="link">
          <span>${getString('LIKES')}</span>
        </a>` : ''}
      </div>
    </div>
  `)

  let links = /** @type {NodeListOf<HTMLAnchorElement>} */ ($focusedTweet.querySelectorAll('#tntInteractionLinks a'))
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
  document.title = ltr ? (
    `${currentNotificationCount}${page} / ${getString('TWITTER')}`
  ) : (
    `${currentNotificationCount}${getString('TWITTER')} \\ ${page}`
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
function shouldHideMainTimelineItem(type, page) {
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
  if (!config.hideExplorePageContents) return

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

    pageObservers.push(
      observeElement($backButton.parentElement, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((/** @type {HTMLElement} */ $el) => {
            if ($el.querySelector('[data-testid="DashButton_ProfileIcon_Link"]')) {
              log('slide-out menu button appeared, going back to skip Explore page')
              history.go(-2)
            }
          })
        })
      }, 'back button parent')
    )
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

/**
 * @param {HTMLElement} $focusedTweet
 * @param {import("./types").IndividualTweetTimelineOptions} options
 */
async function tweakFocusedTweet($focusedTweet, options) {
  let {observers} = options
  if ($focusedTweet) {
    restoreTweetInteractionsLinks($focusedTweet)

    if (desktop && config.replaceLogo && !isObserving(observers, 'tweet editor')) {
      let $editorRoot = await getElement('.DraftEditor-root', {
        context: $focusedTweet.parentElement,
        name: 'tweet editor in focused tweet',
        timeout: 500,
      })
      if ($editorRoot && !isObserving(observers, 'tweet editor')) {
        observers.unshift(
          observeElement($editorRoot, () => {
            if ($editorRoot.firstElementChild.classList.contains('public-DraftEditorPlaceholder-root')) {
              let $placeholder = $editorRoot.querySelector('.public-DraftEditorPlaceholder-inner')
              if ($placeholder) {
                $placeholder.textContent = getString('TWEET_YOUR_REPLY')
              }
            }
          }, 'tweet editor')
        )
      }
    }
  }
  else {
    disconnectObserver('tweet editor', observers)
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
      $tabs.querySelector(`div[role="tablist"] > div:nth-last-child(${$subscriptionsTabLink ? 3 : 2}) > a`)?.click()
    }
  }

  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
    })
  }
}

async function tweakIndividualTweetPage() {
  observeIndividualTweetTimeline(currentPage)

  if (config.replaceLogo) {
    let $headingText = await getElement(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} h2 span`, {
      name: 'tweet thread heading',
      stopIf: pageIsNot(currentPage)
    })
    if ($headingText && $headingText.textContent != getString('TWEET')) {
      $headingText.textContent = getString('TWEET')
    }
  }
}

function tweakListPage() {
  observeTimeline(currentPage, {
    hideHeadings: false,
  })
}

async function tweakDesktopLogo() {
  let $logoPath = await getElement(`h1 ${Selectors.X_LOGO_PATH}`, {name: 'desktop nav logo', timeout: 5000})
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

async function tweakTweetBox() {
  // Observe username typeahead dropdowns to replace Blue checks
  if (config.twitterBlueChecks != 'ignore') {
    let $tweetTextarea = await getElement(`${desktop ? 'div[data-testid="primaryColumn"]': 'main'} label[data-testid^="tweetTextarea"]`, {
      name: 'tweet textarea',
      stopIf: pageIsNot(currentPage),
    })
    if (!$tweetTextarea) return

    /** @type {HTMLElement} */
    let $typeaheadDropdown

    pageObservers.push(
      observeElement($tweetTextarea.parentElement.parentElement.parentElement.parentElement, (mutations) => {
        for (let mutation of mutations) {
          if ($typeaheadDropdown && mutations.some(mutation => Array.from(mutation.removedNodes).includes($typeaheadDropdown))) {
            disconnectPageObserver('tweet textarea typeahead dropdown')
            $typeaheadDropdown = null
          }
          for (let $addedNode of mutation.addedNodes) {
            if ($addedNode instanceof HTMLElement && $addedNode.getAttribute('id')?.startsWith('typeaheadDropdown')) {
              $typeaheadDropdown = $addedNode
              pageObservers.push(
                observeElement($typeaheadDropdown, () => {
                  processBlueChecks($typeaheadDropdown)
                }, 'tweet textarea typeahead dropdown')
              )
            }
          }
        }
      }, 'tweet textarea typeahead dropdown container')
    )
  }

  if (config.replaceLogo) {
    tweakTweetButton()
  }
}

async function tweakTweetButton() {
  let $tweetButton = await getElement(`${desktop ? 'div[data-testid="primaryColumn"]': 'main'} div[data-testid^="tweetButton"]`, {
    name: 'tweet button',
    stopIf: pageIsNot(currentPage),
  })
  if ($tweetButton) {
    let $text = $tweetButton.querySelector('span > span')
    if ($text) {
      setTweetButtonText($text)
    } else {
      warn('could not find tweet button text')
    }
  }
}

function tweakMainTimelinePage() {
  if (desktop) {
    tweakTweetBox()
  }

  let $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)

  // "Which version of the main timeline are we on?" hooks for styling
  $body.classList.toggle('TabbedTimeline', $timelineTabs != null)
  $body.classList.toggle('SeparatedTweets', isOnSeparatedTweetsTimeline())

  if ($timelineTabs == null) {
    warn('could not find timeline tabs')
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
  pageObservers.push(
    observeElement($timelineTabs.parentElement, (mutations) => {
      let timelineTabsReplaced = mutations.some(mutation => Array.from(mutation.removedNodes).includes($timelineTabs))
      if (timelineTabsReplaced) {
        log('timeline tabs replaced')
        $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER : Selectors.PRIMARY_COLUMN} nav`)
        tweakTimelineTabs($timelineTabs)
      }
    }, 'timeline tabs nav container')
  )

  observeTimeline(currentPage, {
    isTabbed: true,
    onTabChanged: () => {
      updateSelectedHomeTabIndex()
      wasForYouTabSelected = selectedHomeTabIndex == 0
    },
    tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child > div',
  })
}

function tweakMobileComposeTweetPage() {
  tweakTweetBox()
}

function tweakMobileMediaViewerPage() {
  if (config.twitterBlueChecks == 'ignore') return

  let $timeline = /** @type {HTMLElement} */ (document.querySelector('[data-testid="vss-scroll-view"] > div'))
  if (!$timeline) {
    warn('media viewer timeline not found')
    return
  }

  observeElement($timeline, (mutations) => {
    for (let mutation of mutations) {
      if (!mutation.addedNodes) continue
      for (let $addedNode of mutation.addedNodes) {
        if ($addedNode.querySelector?.('div[data-testid^="immersive-tweet-ui-content-container"]')) {
          processBlueChecks($addedNode)
        }
      }
    }
  }, 'media viewer timeline', {childList: true, subtree: true})
}

async function tweakTimelineTabs($timelineTabs) {
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
    let $newTab = /** @type {HTMLElement} */ ($timelineTabs.querySelector('#tnt_separated_tweets_tab'))
    if ($newTab) {
      log('separated tweets timeline tab already present')
      $newTab.querySelector('span').textContent = separatedTweetsTimelineTitle
    }
    else {
      log('inserting separated tweets tab')
      $newTab = /** @type {HTMLElement} */ ($followingTabLink.parentElement.cloneNode(true))
      $newTab.id = 'tnt_separated_tweets_tab'
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

      // Return to the main timeline view when any other tab is clicked
      $followingTabLink.parentElement.parentElement.addEventListener('click', () => {
        if (location.pathname == '/home' && !document.title.startsWith(getString('HOME'))) {
          log('setting title to Home')
          homeNavigationIsBeingUsed = true
          setTitle(getString('HOME'))
        }
      })

      // Return to the main timeline when the Home nav link is clicked
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
  if ($navigationTabs == null) {
    warn('could not find Notifications tabs')
    return
  }

  if (config.hideVerifiedNotificationsTab) {
    let isVerifiedTabSelected = Boolean($navigationTabs.querySelector('div[role="tablist"] > div:nth-child(2) > a[aria-selected="true"]'))
    if (isVerifiedTabSelected) {
      log('switching to All tab')
      $navigationTabs.querySelector('div[role="tablist"] > div:nth-child(1) > a')?.click()
    }
  }

  if (config.twitterBlueChecks != 'ignore' || config.restoreLinkHeadlines) {
    observeTimeline(currentPage, {
      isTabbed: true,
      tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
    })
  }
}

async function tweakProfilePage() {
  if (config.twitterBlueChecks != 'ignore') {
    if (mobile) {
      processBlueChecks(document.querySelector(Selectors.MOBILE_TIMELINE_HEADER))
    }
    processBlueChecks(document.querySelector(Selectors.PRIMARY_COLUMN))
  }

  let tab = currentPath.match(URL_PROFILE_RE)?.[2] || 'tweets'
  log(`on ${tab} tab`)
  observeTimeline(currentPage, {
    isUserTimeline: tab == 'affiliates'
  })

  if (config.replaceLogo || config.hideSubscriptions) {
    let $profileTabs = await getElement(`${Selectors.PRIMARY_COLUMN} nav`, {
      name: 'profile tabs',
      stopIf: pageIsNot(currentPage),
    })
    if (!$profileTabs) return
    // The Profile tabs <nav> can be replaced
    pageObservers.push(
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
          })
          if ($subscriptionsTabLink) {
            $subscriptionsTabLink.parentElement.classList.add('SubsTab')
          }
        }
      }, 'profile tabs', {childList: true})
    )
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
        $searchTabs.querySelector('div[role="tablist"] > div:nth-child(2) > a')?.click()
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
    $tabs.querySelector(`div[role="tablist"] > div:nth-child(${tweetInteractionsTab}) > a`)?.click()
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
  let $settings = /** @type {HTMLScriptElement} */ (document.querySelector('script#tnt_settings'))
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

  if (config.debug) {
    debug = true
  }

  observeTitle()

  let $loadingStyle
  if (config.replaceLogo) {
    getElement('html', {name: 'html element'}).then(($html) => {
      $loadingStyle = document.createElement('style')
      $loadingStyle.dataset.insertedBy = 'control-panel-for-twitter'
      $loadingStyle.dataset.role = 'loading-logo'
      $loadingStyle.textContent = dedent(`
        ${Selectors.X_LOGO_PATH} {
          fill: ${isSafari ? 'transparent' : THEME_BLUE};
          d: path("${Svgs.TWITTER_LOGO_PATH}");
        }
        .tnt_logo {
          fill: ${THEME_BLUE};
        }
      `)
      $html.appendChild($loadingStyle)
    })

    if (isSafari) {
      getElement(Selectors.X_LOGO_PATH, {name: 'pre-loading indicator logo', timeout: 1000}).then(($logoPath) => {
        if ($logoPath) {
          twitterLogo($logoPath)
        }
      })
    }

    observeFavicon()
  }

  let $appWrapper = await getElement('#layers + div', {name: 'app wrapper'})

  $html = document.querySelector('html')
  $body = document.body
  $reactRoot = document.querySelector('#react-root')
  lang = $html.lang
  dir = $html.dir
  ltr = dir == 'ltr'
  let lastFlexDirection

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
      observeColor()

      // Repeatable configuration setup
      configureSeparatedTweetsTimelineTitle()
      configureCss()
      configureThemeCss()
      observeHtmlFontSize()
      observePopups()
      observeSideNavTweetButton()

      // Start taking action on page changes
      observingPageChanges = true

      // Delay removing loading icon styles to avoid Flash of X
      if ($loadingStyle) {
        setTimeout(() => $loadingStyle.remove(), 1000)
      }
    }
    else if (flexDirection != lastFlexDirection) {
      observeHtmlFontSize()
      configChanged({version})
    }

    $body.classList.toggle('Mobile', mobile)
    $body.classList.toggle('Desktop', desktop)

    lastFlexDirection = flexDirection
  }, 'app wrapper class attribute for version changes (mobile ↔ desktop)', {
    attributes: true,
    attributeFilter: ['class']
  })
}

/**
 * @param {Partial<import("./types").Config>} changes
 */
function configChanged(changes) {
  log('config changed', changes)

  configureCss()
  configureFont()
  configureNavFontSizeCss()
  configureThemeCss()
  observeFavicon()
  observePopups()
  observeSideNavTweetButton()

  // Only re-process the current page if navigation wasn't already triggered
  // while applying the following config changes (if there were any).
  let navigationTriggered = (
    configureSeparatedTweetsTimelineTitle() ||
    checkforDisabledHomeTimeline()
  )
  if (!navigationTriggered) {
    processCurrentPage()
  }
}

main()
//#endregion

}()