// ==UserScript==
// @name        Tweak New Twitter
// @description Remove algorithmic content from Twitter, hide news & trends, control which shared tweets appear on your timeline, and improve the UI
// @icon        https://raw.githubusercontent.com/insin/tweak-new-twitter/master/icons/icon32.png
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @version     94
// ==/UserScript==
void function() {

let debug = false

/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile
let isSafari = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)

const $html = document.querySelector('html')
const $body = document.body
const lang = $html.lang
const dir = $html.dir
const ltr = dir == 'ltr'

//#region Default config
/**
 * @type {import("./types").Config}
 */
const config = {
  debug: false,
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  communityTweets: 'ignore',
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  followeesFollows: 'ignore',
  hideAnalyticsNav: true,
  hideBookmarksNav: false,
  hideCommunitiesNav: true,
  hideExplorePageContents: true,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideHelpCenterNav: true,
  hideKeyboardShortcutsNav: false,
  hideLikeMetrics: true,
  hideListsNav: false,
  hideMetrics: false,
  // hideMomentsNav: true,
  hideMonetizationNav: true,
  hideMoreTweets: true,
  // hideNewslettersNav: true,
  hideQuoteTweetMetrics: true,
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideShareTweetButton: false,
  hideTopicsNav: true,
  hideTotalTweetsMetrics: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterAdsNav: true,
  hideTwitterBlueNav: true,
  hideTwitterCircleNav: false,
  hideTwitterForProfessionalsNav: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedNotificationsTab: true,
  hideViews: true,
  hideWhoToFollowEtc: true,
  likedTweets: 'ignore',
  listRetweets: 'ignore',
  mutableQuoteTweets: true,
  mutedQuotes: [],
  quoteTweets: 'ignore',
  repliedToTweets: 'ignore',
  retweets: 'separate',
  suggestedTopicTweets: 'ignore',
  tweakQuoteTweetsPage: true,
  twitterBlueChecks: 'replace',
  uninvertFollowButtons: true,
  // Experiments
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  fullWidthContent: false,
  fullWidthMedia: true,
  reducedInteractionMode: false,
  verifiedAccounts: 'ignore',
  // Desktop only
  hideAccountSwitcher: true,
  hideExploreNav: true,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  showRelevantPeople: false,
  // Mobile only
  hideAppNags: true,
  hideMessagesBottomNavItem: false,
}
//#endregion

//#region Locales
/**
 * @type {{[key: string]: import("./types").Locale}}
 */
const locales = {
  'ar-x-fm': {
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    DISCOVER_MORE: 'اكتشاف المزيد',
    HOME: 'الرئيسيّة',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
    TWITTER: 'تويتر',
  },
  ar: {
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    DISCOVER_MORE: 'اكتشاف المزيد',
    HOME: 'الرئيسيّة',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TURN_OFF_RETWEETS: 'تعطيل إعادة التغريد',
    TURN_ON_RETWEETS: 'تفعيل إعادة التغريد',
  },
  bg: {
    ADD_MUTED_WORD: 'Добавяне на заглушена дума',
    DISCOVER_MORE: 'Откриване на още',
    HOME: 'Начало',
    MUTE_THIS_CONVERSATION: 'Заглушаване на разговора',
    QUOTE_TWEET: 'Цитиране на туита',
    QUOTE_TWEETS: 'Туитове с цитат',
    RETWEETS: 'Ретуитове',
    SHARED_TWEETS: 'Споделени туитове',
    TURN_OFF_RETWEETS: 'Изключване на ретуитовете',
    TURN_ON_RETWEETS: 'Включване на ретуитовете',
  },
  bn: {
    ADD_MUTED_WORD: 'নীরব করা শব্দ যোগ করুন',
    DISCOVER_MORE: 'আরও খুঁজুন',
    HOME: 'হোম',
    MUTE_THIS_CONVERSATION: 'এই কথা-বার্তা নীরব করুন',
    QUOTE_TWEET: 'টুইট উদ্ধৃত করুন',
    QUOTE_TWEETS: 'টুইট উদ্ধৃতিগুলো',
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
    TURN_OFF_RETWEETS: 'পুনঃ টুইটগুলি বন্ধ করুন',
    TURN_ON_RETWEETS: 'পুনঃ টুইটগুলি চালু করুন',
    TWITTER: 'টুইটার',
  },
  ca: {
    ADD_MUTED_WORD: 'Afegeix una paraula silenciada',
    DISCOVER_MORE: 'Descobreix-ne més',
    HOME: 'Inici',
    MUTE_THIS_CONVERSATION: 'Silencia la conversa',
    QUOTE_TWEET: 'Cita el tuit',
    QUOTE_TWEETS: 'Tuits amb cita',
    RETWEETS: 'Retuits',
    SHARED_TWEETS: 'Tuits compartits',
    TURN_OFF_RETWEETS: 'Desactiva els retuits',
    TURN_ON_RETWEETS: 'Activa els retuits',
  },
  cs: {
    ADD_MUTED_WORD: 'Přidat slovo na seznam skrytých slov',
    DISCOVER_MORE: 'Objevte víc',
    HOME: 'Hlavní stránka',
    MUTE_THIS_CONVERSATION: 'Skrýt tuto konverzaci',
    QUOTE_TWEET: 'Citovat Tweet',
    QUOTE_TWEETS: 'Tweety s citací',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Sdílené tweety',
    TURN_OFF_RETWEETS: 'Vypnout retweety',
    TURN_ON_RETWEETS: 'Zapnout retweety',
  },
  da: {
    ADD_MUTED_WORD: 'Tilføj skjult ord',
    DISCOVER_MORE: 'Opdag mere',
    HOME: 'Forside',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtale',
    QUOTE_TWEET: 'Citér Tweet',
    QUOTE_TWEETS: 'Citat-Tweets',
    SHARED_TWEETS: 'Delte tweets',
    TURN_OFF_RETWEETS: 'Slå Retweets fra',
    TURN_ON_RETWEETS: 'Slå Retweets til',
  },
  de: {
    ADD_MUTED_WORD: 'Stummgeschaltetes Wort hinzufügen',
    DISCOVER_MORE: 'Mehr entdecken',
    HOME: 'Startseite',
    MUTE_THIS_CONVERSATION: 'Diese Konversation stummschalten',
    QUOTE_TWEET: 'Tweet zitieren',
    QUOTE_TWEETS: 'Zitierte Tweets',
    SHARED_TWEETS: 'Geteilte Tweets',
    TURN_OFF_RETWEETS: 'Retweets ausschalten',
    TURN_ON_RETWEETS: 'Retweets einschalten',
  },
  el: {
    ADD_MUTED_WORD: 'Προσθήκη λέξης σε σίγαση',
    DISCOVER_MORE: 'Ανακαλύψτε περισσότερα',
    HOME: 'Αρχική σελίδα',
    MUTE_THIS_CONVERSATION: 'Σίγαση αυτής της συζήτησης',
    QUOTE_TWEET: 'Παράθεση Tweet',
    QUOTE_TWEETS: 'Tweet με παράθεση',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
    TURN_OFF_RETWEETS: 'Απενεργοποίηση των Retweet',
    TURN_ON_RETWEETS: 'Ενεργοποίηση των Retweet',
  },
  en: {
    ADD_MUTED_WORD: 'Add muted word',
    DISCOVER_MORE: 'Discover more',
    HOME: 'Home',
    MUTE_THIS_CONVERSATION: 'Mute this conversation',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
    TURN_OFF_RETWEETS: 'Turn off Retweets',
    TURN_ON_RETWEETS: 'Turn on Retweets',
    TWITTER: 'Twitter',
  },
  es: {
    ADD_MUTED_WORD: 'Añadir palabra silenciada',
    DISCOVER_MORE: 'Descubrir más',
    HOME: 'Inicio',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversación',
    QUOTE_TWEET: 'Citar Tweet',
    QUOTE_TWEETS: 'Tweets citados',
    SHARED_TWEETS: 'Tweets compartidos',
    TURN_OFF_RETWEETS: 'Desactivar Retweets',
    TURN_ON_RETWEETS: 'Activar Retweets',
  },
  eu: {
    ADD_MUTED_WORD: 'Gehitu isilarazitako hitza',
    HOME: 'Hasiera',
    MUTE_THIS_CONVERSATION: 'Isilarazi elkarrizketa hau',
    QUOTE_TWEET: 'Txioa apaitu',
    QUOTE_TWEETS: 'Aipatu txioak',
    RETWEETS: 'Bertxioak',
    SHARED_TWEETS: 'Partekatutako',
    TURN_OFF_RETWEETS: 'Desaktibatu birtxioak',
    TURN_ON_RETWEETS: 'Aktibatu birtxioak',
  },
  fa: {
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    DISCOVER_MORE: 'کاوش بیشتر',
    HOME: 'خانه',
    MUTE_THIS_CONVERSATION: 'خموش‌سازی این گفتگو',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت‌ها',
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
    TURN_OFF_RETWEETS: 'غیرفعال‌سازی بازتوییت‌ها',
    TURN_ON_RETWEETS: 'فعال سازی بازتوییت‌ها',
    TWITTER: 'توییتر',
  },
  fi: {
    ADD_MUTED_WORD: 'Lisää hiljennetty sana',
    DISCOVER_MORE: 'Löydä uutta',
    HOME: 'Etusivu',
    MUTE_THIS_CONVERSATION: 'Hiljennä tämä keskustelu',
    QUOTE_TWEET: 'Twiitin lainaus',
    QUOTE_TWEETS: 'Twiitin lainaukset',
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED_TWEETS: 'Jaetut twiitit',
    TURN_OFF_RETWEETS: 'Poista uudelleentwiittaukset käytöstä',
    TURN_ON_RETWEETS: 'Ota uudelleentwiittaukset käyttöön',
  },
  fil: {
    ADD_MUTED_WORD: 'Idagdag ang naka-mute na salita',
    DISCOVER_MORE: 'Tuklasin ang higit pa',
    HOME: 'Home',
    MUTE_THIS_CONVERSATION: 'I-mute ang usapang ito',
    QUOTE_TWEET: 'Quote na Tweet',
    QUOTE_TWEETS: 'Mga Quote na Tweet',
    RETWEETS: 'Mga Retweet',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
    TURN_OFF_RETWEETS: 'I-off ang Retweets',
    TURN_ON_RETWEETS: 'I-on ang Retweets',
  },
  fr: {
    ADD_MUTED_WORD: 'Ajouter un mot masqué',
    DISCOVER_MORE: 'Découvrez plus',
    HOME: 'Accueil',
    MUTE_THIS_CONVERSATION: 'Masquer cette conversation',
    QUOTE_TWEET: 'Citer le Tweet',
    QUOTE_TWEETS: 'Tweets cités',
    SHARED_TWEETS: 'Tweets partagés',
    TURN_OFF_RETWEETS: 'Désactiver les Retweets',
    TURN_ON_RETWEETS: 'Activer les Retweets',
  },
  ga: {
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    HOME: 'Baile',
    MUTE_THIS_CONVERSATION: 'Balbhaigh an comhrá seo',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Luaigh Tvuíteanna',
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
    TURN_OFF_RETWEETS: 'Cas as Atweetanna',
    TURN_ON_RETWEETS: 'Cas Atweetanna air',
  },
  gl: {
    ADD_MUTED_WORD: 'Engadir palabra silenciada',
    HOME: 'Inicio',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    QUOTE_TWEET: 'Citar chío',
    QUOTE_TWEETS: 'Chíos citados',
    RETWEETS: 'Rechouchíos',
    SHARED_TWEETS: 'Chíos compartidos',
    TURN_OFF_RETWEETS: 'Desactivar os rechouchíos',
    TURN_ON_RETWEETS: 'Activar os rechouchíos',
  },
  gu: {
    ADD_MUTED_WORD: 'જોડાણ અટકાવેલો શબ્દ ઉમેરો',
    DISCOVER_MORE: 'વધુ શોધો',
    HOME: 'હોમ',
    MUTE_THIS_CONVERSATION: 'આ વાર્તાલાપનું જોડાણ અટકાવો',
    QUOTE_TWEET: 'અવતરણની સાથે ટ્વીટ કરો',
    QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ',
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
    TURN_OFF_RETWEETS: 'પુનટ્વીટ્સ બંધ કરો',
    TURN_ON_RETWEETS: 'પુનટ્વીટ્સ ચાલુ કરો',
  },
  he: {
    ADD_MUTED_WORD: 'הוסף מילה מושתקת',
    DISCOVER_MORE: 'גלה עוד',
    HOME: 'דף הבית',
    MUTE_THIS_CONVERSATION: 'להשתיק את השיחה הזאת',
    QUOTE_TWEET: 'ציטוט ציוץ',
    QUOTE_TWEETS: 'ציוצי ציטוט',
    RETWEETS: 'ציוצים מחדש',
    SHARED_TWEETS: 'ציוצים משותפים',
    TURN_OFF_RETWEETS: 'כבה ציוצים מחדש',
    TURN_ON_RETWEETS: 'הפעל ציוצים מחדש',
    TWITTER: 'טוויטר',
  },
  hi: {
    ADD_MUTED_WORD: 'म्यूट किया गया शब्द जोड़ें',
    DISCOVER_MORE: 'और अधिक जानें',
    HOME: 'होम',
    MUTE_THIS_CONVERSATION: 'इस बातचीत को म्यूट करें',
    QUOTE_TWEET: 'ट्वीट क्वोट करें',
    QUOTE_TWEETS: 'कोट ट्वीट्स',
    RETWEETS: 'रीट्वीट्स',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
    TURN_OFF_RETWEETS: 'रीट्वीट बंद करें',
    TURN_ON_RETWEETS: 'रीट्वीट चालू करें',
  },
  hr: {
    ADD_MUTED_WORD: 'Dodaj onemogućenu riječ',
    DISCOVER_MORE: 'Otkrijte više',
    HOME: 'Naslovnica',
    MUTE_THIS_CONVERSATION: 'Isključi zvuk ovog razgovora',
    QUOTE_TWEET: 'Citiraj Tweet',
    QUOTE_TWEETS: 'Citirani tweetovi',
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
    TURN_OFF_RETWEETS: 'Isključi proslijeđene tweetove',
    TURN_ON_RETWEETS: 'Uključi proslijeđene tweetove',
  },
  hu: {
    ADD_MUTED_WORD: 'Elnémított szó hozzáadása',
    DISCOVER_MORE: 'Továbbiak felfedezése',
    HOME: 'Kezdőlap',
    MUTE_THIS_CONVERSATION: 'Beszélgetés némítása',
    QUOTE_TWEET: 'Tweet idézése',
    QUOTE_TWEETS: 'Tweet-idézések',
    RETWEETS: 'Retweetek',
    SHARED_TWEETS: 'Megosztott tweetek',
    TURN_OFF_RETWEETS: 'Retweetek kikapcsolása',
    TURN_ON_RETWEETS: 'Retweetek bekapcsolása',
  },
  id: {
    ADD_MUTED_WORD: 'Tambahkan kata kunci yang dibisukan',
    DISCOVER_MORE: 'Temukan lebih banyak',
    HOME: 'Beranda',
    MUTE_THIS_CONVERSATION: 'Bisukan percakapan ini',
    QUOTE_TWEET: 'Kutip Tweet',
    QUOTE_TWEETS: 'Tweet Kutipan',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
    TURN_OFF_RETWEETS: 'Matikan Retweet',
    TURN_ON_RETWEETS: 'Nyalakan Retweet',
  },
  it: {
    ADD_MUTED_WORD: 'Aggiungi parola o frase silenziata',
    DISCOVER_MORE: 'Continua con la scoperta',
    HOME: 'Home',
    MUTE_THIS_CONVERSATION: 'Silenzia questa conversazione',
    QUOTE_TWEET: 'Cita Tweet',
    QUOTE_TWEETS: 'Tweet di citazione',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet condivisi',
    TURN_OFF_RETWEETS: 'Disattiva Retweet',
    TURN_ON_RETWEETS: 'Attiva Retweet',
  },
  ja: {
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    DISCOVER_MORE: 'もっと見つける',
    HOME: 'ホーム',
    MUTE_THIS_CONVERSATION: 'この会話をミュート',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
    TURN_OFF_RETWEETS: 'リツイートをオフにする',
    TURN_ON_RETWEETS: 'リツイートをオンにする',
  },
  kn: {
    ADD_MUTED_WORD: 'ಸದ್ದಡಗಿಸಿದ ಪದವನ್ನು ಸೇರಿಸಿ',
    DISCOVER_MORE: 'ಇನ್ನಷ್ಟನ್ನು ಕಂಡುಕೊಳ್ಳಿ',
    HOME: 'ಹೋಮ್',
    MUTE_THIS_CONVERSATION: 'ಈ ಸಂವಾದವನ್ನು ಸದ್ದಡಗಿಸಿ',
    QUOTE_TWEET: 'ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ',
    QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು',
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
    TURN_OFF_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆಫ್ ಮಾಡಿ',
    TURN_ON_RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳನ್ನು ಆನ್ ಮಾಡಿ',
  },
  ko: {
    ADD_MUTED_WORD: '뮤트할 단어 추가하기',
    DISCOVER_MORE: '더 찾아보기',
    HOME: '홈',
    MUTE_THIS_CONVERSATION: '이 대화 뮤트하기',
    QUOTE_TWEET: '트윗 인용하기',
    QUOTE_TWEETS: '트윗 인용하기',
    RETWEETS: '리트윗',
    SHARED_TWEETS: '공유 트윗',
    TURN_OFF_RETWEETS: '리트윗 끄기',
    TURN_ON_RETWEETS: '리트윗 켜기',
    TWITTER: '트위터',
  },
  mr: {
    ADD_MUTED_WORD: 'म्यूट केलेले शब्द सामील करा',
    DISCOVER_MORE: 'अधिक प्रमाणामध्ये शोधा',
    HOME: 'होम',
    MUTE_THIS_CONVERSATION: 'ही चर्चा म्यूट करा',
    QUOTE_TWEET: 'ट्विट वर भाष्य करा',
    QUOTE_TWEETS: 'भाष्य ट्विट्स',
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED_TWEETS: 'सामायिक ट्विट',
    TURN_OFF_RETWEETS: 'पुनर्ट्विट्स बंद करा',
    TURN_ON_RETWEETS: 'पुनर्ट्विट्स चालू करा',
  },
  ms: {
    ADD_MUTED_WORD: 'Tambahkan perkataan yang disenyapkan',
    DISCOVER_MORE: 'Temui lagi',
    HOME: 'Laman Utama',
    MUTE_THIS_CONVERSATION: 'Senyapkan perbualan ini',
    QUOTE_TWEET: 'Petik Tweet',
    QUOTE_TWEETS: 'Tweet Petikan',
    RETWEETS: 'Tweet semula',
    SHARED_TWEETS: 'Tweet Berkongsi',
    TURN_OFF_RETWEETS: 'Matikan Tweet semula',
    TURN_ON_RETWEETS: 'Hidupkan Tweet semula',
  },
  nb: {
    ADD_MUTED_WORD: 'Skjul nytt ord',
    DISCOVER_MORE: 'Oppdag mer',
    HOME: 'Hjem',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtalen',
    QUOTE_TWEET: 'Sitat-Tweet',
    QUOTE_TWEETS: 'Sitat-Tweets',
    SHARED_TWEETS: 'Delte tweets',
    TURN_OFF_RETWEETS: 'Slå av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
  },
  nl: {
    ADD_MUTED_WORD: 'Genegeerd woord toevoegen',
    DISCOVER_MORE: 'Meer ontdekken',
    HOME: 'Startpagina',
    MUTE_THIS_CONVERSATION: 'Dit gesprek negeren',
    QUOTE_TWEET: 'Citeer Tweet',
    QUOTE_TWEETS: 'Geciteerde Tweets',
    SHARED_TWEETS: 'Gedeelde Tweets',
    TURN_OFF_RETWEETS: 'Retweets uitschakelen',
    TURN_ON_RETWEETS: 'Retweets inschakelen',
  },
  pl: {
    ADD_MUTED_WORD: 'Dodaj wyciszone słowo',
    DISCOVER_MORE: 'Odkryj więcej',
    HOME: 'Główna',
    MUTE_THIS_CONVERSATION: 'Wycisz tę rozmowę',
    QUOTE_TWEET: 'Cytuj Tweeta',
    QUOTE_TWEETS: 'Cytaty z Tweeta',
    RETWEETS: 'Tweety podane dalej',
    SHARED_TWEETS: 'Udostępnione Tweety',
    TURN_OFF_RETWEETS: 'Wyłącz Tweety podane dalej',
    TURN_ON_RETWEETS: 'Włącz Tweety podane dalej',
  },
  pt: {
    ADD_MUTED_WORD: 'Adicionar palavra silenciada',
    DISCOVER_MORE: 'Descubra mais',
    HOME: 'Página Inicial',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    QUOTE_TWEET: 'Comentar o Tweet',
    QUOTE_TWEETS: 'Tweets com comentário',
    SHARED_TWEETS: 'Tweets Compartilhados',
    TURN_OFF_RETWEETS: 'Desativar Retweets',
    TURN_ON_RETWEETS: 'Ativar Retweets',
  },
  ro: {
    ADD_MUTED_WORD: 'Adaugă cuvântul ignorat',
    DISCOVER_MORE: 'Descoperă mai mult',
    HOME: 'Pagina principală',
    MUTE_THIS_CONVERSATION: 'Ignoră această conversație',
    QUOTE_TWEET: 'Citează Tweetul',
    QUOTE_TWEETS: 'Tweeturi cu citat',
    RETWEETS: 'Retweeturi',
    SHARED_TWEETS: 'Tweeturi partajate',
    TURN_OFF_RETWEETS: 'Dezactivează Retweeturile',
    TURN_ON_RETWEETS: 'Activează Retweeturile',
  },
  ru: {
    ADD_MUTED_WORD: 'Добавить игнорируемое слово',
    DISCOVER_MORE: 'Узнать больше',
    HOME: 'Главная',
    MUTE_THIS_CONVERSATION: 'Игнорировать эту переписку',
    QUOTE_TWEET: 'Цитировать',
    QUOTE_TWEETS: 'Твиты с цитатами',
    RETWEETS: 'Ретвиты',
    SHARED_TWEETS: 'Общие твиты',
    TURN_OFF_RETWEETS: 'Отключить ретвиты',
    TURN_ON_RETWEETS: 'Включить ретвиты',
    TWITTER: 'Твиттер',
  },
  sk: {
    ADD_MUTED_WORD: 'Pridať stíšené slovo',
    DISCOVER_MORE: 'Objaviť viac',
    HOME: 'Domov',
    MUTE_THIS_CONVERSATION: 'Stíšiť túto konverzáciu',
    QUOTE_TWEET: 'Tweet s citátom',
    QUOTE_TWEETS: 'Tweety s citátom',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Zdieľané Tweety',
    TURN_OFF_RETWEETS: 'Vypnúť retweety',
    TURN_ON_RETWEETS: 'Zapnúť retweety',
  },
  sr: {
    ADD_MUTED_WORD: 'Додај игнорисану реч',
    DISCOVER_MORE: 'Откриј више',
    HOME: 'Почетна',
    MUTE_THIS_CONVERSATION: 'Игнориши овај разговор',
    QUOTE_TWEET: 'твит са цитатом',
    QUOTE_TWEETS: 'твит(ов)а са цитатом',
    RETWEETS: 'Ретвитови',
    SHARED_TWEETS: 'Дељени твитови',
    TURN_OFF_RETWEETS: 'Искључи ретвитове',
    TURN_ON_RETWEETS: 'Укључи ретвитове',
    TWITTER: 'Твитер',
  },
  sv: {
    ADD_MUTED_WORD: 'Lägg till ignorerat ord',
    DISCOVER_MORE: 'Upptäck mer',
    HOME: 'Hem',
    MUTE_THIS_CONVERSATION: 'Ignorera den här konversationen',
    QUOTE_TWEET: 'Citera Tweet',
    QUOTE_TWEETS: 'Citat-tweets',
    SHARED_TWEETS: 'Delade tweetsen',
    TURN_OFF_RETWEETS: 'Stäng av Retweets',
    TURN_ON_RETWEETS: 'Slå på Retweets',
  },
  ta: {
    ADD_MUTED_WORD: 'செயல்மறைத்த வார்த்தையைச் சேர்',
    DISCOVER_MORE: 'மேலும் கண்டறியவும்',
    HOME: 'முகப்பு',
    MUTE_THIS_CONVERSATION: 'இந்த உரையாடலை செயல்மறை',
    QUOTE_TWEET: 'ட்விட்டை மேற்கோள் காட்டு',
    QUOTE_TWEETS: 'மேற்கோள் கீச்சுகள்',
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
    TURN_OFF_RETWEETS: 'மறுகீச்சுகளை அணை',
    TURN_ON_RETWEETS: 'மறுகீச்சுகளை இயக்கு',
  },
  th: {
    ADD_MUTED_WORD: 'เพิ่มคำที่ซ่อน',
    DISCOVER_MORE: 'ค้นหาเพิ่มเติม',
    HOME: 'หน้าแรก',
    MUTE_THIS_CONVERSATION: 'ซ่อนบทสนทนานี้',
    QUOTE_TWEET: 'อ้างอิงทวีต',
    QUOTE_TWEETS: 'ทวีตและคำพูด',
    RETWEETS: 'รีทวีต',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    TURN_OFF_RETWEETS: 'ปิดรีทวีต',
    TURN_ON_RETWEETS: 'เปิดรีทวีต',
    TWITTER: 'ทวิตเตอร์',
  },
  tr: {
    ADD_MUTED_WORD: 'Sessize alınacak kelime ekle',
    DISCOVER_MORE: 'Daha fazlasını keşfet',
    HOME: 'Anasayfa',
    MUTE_THIS_CONVERSATION: 'Bu sohbeti sessize al',
    QUOTE_TWEET: 'Tweeti Alıntıla',
    QUOTE_TWEETS: 'Alıntı Tweetler',
    RETWEETS: 'Retweetler',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
    TURN_OFF_RETWEETS: 'Retweetleri kapat',
    TURN_ON_RETWEETS: 'Retweetleri aç',
  },
  uk: {
    ADD_MUTED_WORD: 'Додати слово до списку ігнорування',
    DISCOVER_MORE: 'Дізнавайтеся більше',
    HOME: 'Головна',
    MUTE_THIS_CONVERSATION: 'Ігнорувати цю розмову',
    QUOTE_TWEET: 'Цитувати твіт',
    QUOTE_TWEETS: 'Цитовані твіти',
    RETWEETS: 'Ретвіти',
    SHARED_TWEETS: 'Спільні твіти',
    TURN_OFF_RETWEETS: 'Вимкнути ретвіти',
    TURN_ON_RETWEETS: 'Увімкнути ретвіти',
    TWITTER: 'Твіттер',
  },
  ur: {
    ADD_MUTED_WORD: 'میوٹ شدہ لفظ شامل کریں',
    DISCOVER_MORE: 'مزید دریافت کریں',
    HOME: 'ہوم',
    MUTE_THIS_CONVERSATION: 'اس گفتگو کو میوٹ کریں',
    QUOTE_TWEET: 'ٹویٹ کا حوالہ دیں',
    QUOTE_TWEETS: 'ٹویٹ کو نقل کرو',
    RETWEETS: 'ریٹویٹس',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
    TURN_OFF_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TURN_ON_RETWEETS: 'ری ٹویٹس غیر فعال کریں',
    TWITTER: 'ٹوئٹر',
  },
  vi: {
    ADD_MUTED_WORD: 'Thêm từ tắt tiếng',
    DISCOVER_MORE: 'Khám phá thêm',
    HOME: 'Trang chủ',
    MUTE_THIS_CONVERSATION: 'Tắt tiếng cuộc trò chuyện này',
    QUOTE_TWEET: 'Trích dẫn Tweet',
    QUOTE_TWEETS: 'Tweet trích dẫn',
    RETWEETS: 'Các Tweet lại',
    SHARED_TWEETS: 'Tweet được chia sẻ',
    TURN_OFF_RETWEETS: 'Tắt Tweet lại',
    TURN_ON_RETWEETS: 'Bật Tweet lại',
  },
  'zh-Hant': {
    ADD_MUTED_WORD: '加入靜音文字',
    DISCOVER_MORE: '探索更多',
    HOME: '首頁',
    MUTE_THIS_CONVERSATION: '將此對話靜音',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用的推文',
    RETWEETS: '轉推',
    SHARED_TWEETS: '分享的推文',
    TURN_OFF_RETWEETS: '關閉轉推',
    TURN_ON_RETWEETS: '開啟轉推',
  },
  zh: {
    ADD_MUTED_WORD: '添加要隐藏的字词',
    DISCOVER_MORE: '发现更多',
    HOME: '主页',
    MUTE_THIS_CONVERSATION: '隐藏此对话',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用推文',
    RETWEETS: '转推',
    SHARED_TWEETS: '分享的推文',
    TURN_OFF_RETWEETS: '关闭转推',
    TURN_ON_RETWEETS: '开启转推',
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

//#region Config & variables
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
}

/** @enum {string} */
const Selectors = {
  BLOCK_MENU_ITEM: '[data-testid="block"]',
  DESKTOP_TIMELINE_HEADER: 'div[data-testid="primaryColumn"] > div > div:first-of-type',
  DISPLAY_DONE_BUTTON_DESKTOP: '#layers div[role="button"]:not([aria-label])',
  DISPLAY_DONE_BUTTON_MOBILE: 'main div[role="button"]:not([aria-label])',
  MESSAGES_DRAWER: 'div[data-testid="DMDrawer"]',
  MODAL_TIMELINE: '#layers section > h1 + div[aria-label] > div',
  MOBILE_TIMELINE_HEADER_OLD: 'header > div:nth-of-type(2) > div:first-of-type',
  MOBILE_TIMELINE_HEADER_NEW: 'div[data-testid="TopNavBar"]',
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
}

/** @enum {string} */
const Svgs = {
  BLUE_LOGO_PATH: 'M16.5 3H2v18h15c3.038 0 5.5-2.46 5.5-5.5 0-1.4-.524-2.68-1.385-3.65-.08-.09-.089-.22-.023-.32.574-.87.908-1.91.908-3.03C22 5.46 19.538 3 16.5 3zm-.796 5.99c.457-.05.892-.17 1.296-.35-.302.45-.684.84-1.125 1.15.004.1.006.19.006.29 0 2.94-2.269 6.32-6.421 6.32-1.274 0-2.46-.37-3.459-1 .177.02.357.03.539.03 1.057 0 2.03-.35 2.803-.95-.988-.02-1.821-.66-2.109-1.54.138.03.28.04.425.04.206 0 .405-.03.595-.08-1.033-.2-1.811-1.1-1.811-2.18v-.03c.305.17.652.27 1.023.28-.606-.4-1.004-1.08-1.004-1.85 0-.4.111-.78.305-1.11 1.113 1.34 2.775 2.22 4.652 2.32-.038-.17-.058-.33-.058-.51 0-1.23 1.01-2.22 2.256-2.22.649 0 1.235.27 1.647.7.514-.1.997-.28 1.433-.54-.168.52-.526.96-.992 1.23z',
  HOME: '<g><path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"></path></g>',
  MUTE: '<g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g>',
  RETWEET: '<g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>',
  RETWEETS_OFF: '<g><path d="M3.707 21.707l18-18-1.414-1.414-2.088 2.088C17.688 4.137 17.11 4 16.5 4H11v2h5.5c.028 0 .056 0 .084.002l-10.88 10.88c-.131-.266-.204-.565-.204-.882V7.551l2.068 1.93 1.365-1.462L4.5 3.882.068 8.019l1.365 1.462 2.068-1.93V16c0 .871.278 1.677.751 2.334l-1.959 1.959 1.414 1.414zM18.5 9h2v7.449l2.068-1.93 1.365 1.462-4.433 4.137-4.432-4.137 1.365-1.462 2.067 1.93V9zm-8.964 9l-2 2H13v-2H9.536z"></path></g>'
}

const THEME_COLORS = new Set([
  'rgb(29, 155, 240)', // blue
  'rgb(255, 212, 0)',  // yellow
  'rgb(244, 33, 46)',  // pink
  'rgb(120, 86, 255)', // purple
  'rgb(255, 122, 0)',  // orange
  'rgb(0, 186, 124)',  // green
])
// Matches any notification count at the start of the title
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
// twitter.com/user and its sub-URLs put @user in the title
const TITLE_PROFILE_USERNAME_RE_LTR = /@([a-zA-Z\d_]{1,20})/
const TITLE_PROFILE_USERNAME_RE_RTL = /([a-zA-Z\d_]{1,20})@/
// The initial URL when you open the Twitter Circle modal is i/circles
const URL_CIRCLE_RE = /^\/i\/circles(?:\/\d+\/members(?:\/suggested)?)?\/?$/
// The Communities nav item takes you to /yourusername/communities
const URL_COMMUNITIES_RE = /^\/[a-zA-Z\d_]{1,20}\/communities\/?$/
const URL_COMMUNITY_RE = /^\/i\/communities\/\d+(?:\/about)?\/?$/
const URL_COMMUNITY_MEMBERS_RE = /^\/i\/communities\/\d+\/(?:members|moderators)\/?$/
const URL_DISCOVER_COMMUNITIES_RE = /^\/i\/communities\/suggested\/?/
const URL_LIST_RE = /\/i\/lists\/\d+\/?$/
const URL_PHOTO_RE = /photo\/\d\/?$/
// Matches URLs which show one of the tabs on a user profile page
const URL_PROFILE_RE = /^\/([a-zA-Z\d_]{1,20})(?:\/(with_replies|media|likes)\/?|\/)?$/
// Matches URLs which show a user's Followers you know / Followers / Following tab
const URL_PROFILE_FOLLOWS_RE = /^\/[a-zA-Z\d_]{1,20}\/(follow(?:ing|ers|ers_you_follow))\/?$/
const URL_TWEET_ID_RE = /\/status\/(\d+)\/?$/

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

/** Set to `true` when the Twitter Circle modal is open. */
let isCircleModalOpen = false

/** Set to `true` when the media modal is open on desktop. */
let isDesktopMediaModalOpen = false

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
 * MutationObservers active on the current page, or anything else we want to
 * clean up when the user moves off the current page.
 * @type {import("./types").Disconnectable[]}
 */
let pageObservers = []

/**
 * Title for the fake timeline used to separate out retweets and quote tweets.
 * @type {string}
 */
let separatedTweetsTimelineTitle = null

/**
 * The current "Color" setting, which can be changed in "Customize your view".
 * @type {string}
 */
let themeColor = null

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
  return URL_TWEET_ID_RE.test(currentPath)
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

function isOnNotificationsPage() {
  return currentPath.startsWith('/notifications')
}

function isOnProfilePage() {
  let profilePathUsername = currentPath.match(URL_PROFILE_RE)?.[1]
  let titleUsername = currentPage.match(ltr ? TITLE_PROFILE_USERNAME_RE_LTR : TITLE_PROFILE_USERNAME_RE_RTL)?.[1]
  // @user in the title helps guard against false positives for twitter.com/user
  return titleUsername != null && profilePathUsername != null && titleUsername == profilePathUsername
}

function isOnQuoteTweetsPage() {
  return currentPath.endsWith('/retweets/with_comments')
}

function isOnSearchPage() {
  return currentPath.startsWith('/search') || currentPath.startsWith('/hashtag/')
}

function isOnSeparatedTweetsTimeline() {
  return currentPage == separatedTweetsTimelineTitle
}

function isOnTopicsPage() {
  return currentPath != '/topics' && Boolean(currentPath.match(/\/topics(\/|$)/))
}

function shouldHideSidebar() {
  return isOnExplorePage() || isOnDiscoverCommunitiesPage()
}
//#endregion

//#region Utility functions
/**
 * @param {string} role
 * @return {HTMLStyleElement}
 */
function addStyle(role) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'tweak-new-twitter'
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
  // Safari doesn't support using `d: path(...)` to replace paths in an SVG, so
  // we have to manually patch the path in it.
  if (isSafari) {
    $svg.firstElementChild.firstElementChild.setAttribute('d', Svgs.BLUE_LOGO_PATH)
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
 * @param {string?} type
 */
function disconnectObserver(name, observers, type = 'observer') {
  for (let i = observers.length -1; i >= 0; i--) {
    let observer = observers[i]
    if ('name' in observer && observer.name == name) {
      observer.disconnect()
      observers.splice(i, 1)
      log(`disconnected ${name} ${type}`)
    }
  }
}

function disconnectModalObserver(name) {
  disconnectObserver(name, modalObservers)
}

function disconnectPageObserver(name) {
  disconnectObserver(name, pageObservers, 'page observer')
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

function log(...args) {
  if (debug) {
    console.log(`🧨${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

function warn(...args) {
  if (debug) {
    console.log(`⚠${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

function error(...args) {
  console.log(`❌${currentPage ? `(${currentPage})` : ''}`, ...args)
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
function observeElement($element, callback, name = '', options = {childList: true}) {
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
  return () => page != currentPage
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

function storeConfigChanges(changes) {
  window.postMessage({type: 'tntConfigChange', changes})
}
//#endregion

//#region Global observers
const checkReactNativeStylesheet = (() => {
  let startTime = Date.now()

  return function checkReactNativeStylesheet() {
    let $style = /** @type {HTMLStyleElement} */ (document.querySelector('style#react-native-stylesheet'))
    if (!$style) {
      warn('React Native stylesheet not found')
      return
    }

    for (let rule of $style.sheet.cssRules) {
      if (!(rule instanceof CSSStyleRule)) continue

      if (fontFamilyRule == null &&
          rule.style.fontFamily &&
          rule.style.fontFamily.includes('TwitterChirp')) {
        fontFamilyRule = rule
        log('found Chirp fontFamily CSS rule in React Native stylesheet')
        configureFont()
      }

      if (themeColor == null &&
          rule.style.backgroundColor &&
          THEME_COLORS.has(rule.style.backgroundColor)) {
        themeColor = rule.style.backgroundColor
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
      processCurrentPage()
    }
    lastBackgroundColor = backgroundColor
  }, '<body> style attribute for background colour changes', {
    attributes: true,
    attributeFilter: ['style']
  })
}

/**
 * @param {Element} $tabContent
 * @param {import("./types").Disconnectable[]} observers
 * @param {(name: string) => void} disconnect
 */
function observeTwitterCircleTabContent($tabContent, observers, disconnect) {
  disconnect('circle tab content')
  // The Recommended tab replaces its initial user list with a typeahead
  // dropdown when you use the input, and reverts if you clear it.
  observers.push(observeElement($tabContent, () => {
    let $userList = /** @type {HTMLElement} */ ($tabContent.querySelector(':scope > div:last-child:not(:first-child), div[id^="typeaheadDropdown"]'))
    if ($userList) {
      disconnect('user list')
      observers.push(observeElement($userList, () => {
        processBlueChecks($userList)
      }, 'user list'))
    } else {
      warn('could not find circle user list')
    }
  }, 'circle tab content'))
}

async function observeCircleModal() {
  let $viewport = await getElement('div[data-viewportview="true"]', {
    name: 'circle modal viewport',
    stopIf: () => !isCircleModalOpen,
  })

  if ($viewport == null) return

  modalObservers.push(observeElement($viewport, (mutations) => {
    // Ignore loading indicators on initial load of each tab
    if (!mutations.length || mutations.some(mutation => mutation.addedNodes[0]?.querySelector('svg circle'))) {
      return
    }
    // The modal version doesn't have a separate container for tab content, it's
    // a sibling of the tabs.
    observeTwitterCircleTabContent($viewport.lastElementChild, modalObservers, disconnectModalObserver)
  }, 'circle modal viewport'))
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
    configureThemeCss()
    observePopups()
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
        processCurrentPage()
      }
    }, '<html> style attribute for font size changes', {
      attributes: true,
      attributeFilter: ['style']
    })
  }
})()

async function observeDesktopModalTimeline() {
  // Media modals remember if they were previously collapsed, so we could be
  // waiting for the initial timeline to be either rendered or expanded.
  let $initialTimeline = await getElement(Selectors.MODAL_TIMELINE, {
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
      observeElement($timeline, () => onTimelineChange($timeline, 'Desktop Media Modal', {hideHeadings: false}), 'modal timeline')
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
              observeElement($newTimeline, () => onTimelineChange($newTimeline, 'Desktop Media Modal', {hideHeadings: false}), 'modal timeline')
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
  observeElement($title, () => onTitleChange($title.textContent), '<title>')
}
//#endregion

//#region Page observers
/**
 * If a profile is blocked its media box won't appear, add a `Blocked` class to
 * `<body>` to hide sidebar content.
 * @param {string} currentPage
 */
async function observeProfileBlockedStatus(currentPage) {
  let $buttonContainer = await getElement(`[data-testid="userActions"] ~ [data-testid="placementTracking"], a[href="${PagePaths.PROFILE_SETTINGS}"]`, {
    name: 'Follow / Unblock button container or Edit profile button',
    stopIf: pageIsNot(currentPage),
  })
  if ($buttonContainer == null) return

  if ($buttonContainer.hasAttribute('href')) {
    log('on own profile page')
    $body.classList.remove('Blocked')
    return
  }

  pageObservers.push(
    observeElement($buttonContainer, () => {
      let isBlocked = (/** @type {HTMLElement} */ ($buttonContainer.querySelector('[role="button"]'))?.dataset.testid ?? '').endsWith('unblock')
      $body.classList.toggle('Blocked', isBlocked)
    }, 'Follow / Unblock button container')
  )
}

/**
 * If an account has never tweeted any media, add a `NoMedia` class to `<body>`
 * to hide the "You might like" section which will appear where the media box
 * would have been.
 * @param {string} currentPage
 */
async function observeProfileSidebar(currentPage) {
  let $sidebarContent = await getElement(Selectors.SIDEBAR_WRAPPERS, {
    name: 'profile sidebar content container',
    stopIf: pageIsNot(currentPage),
  })
  if ($sidebarContent == null) return

  let sidebarContentObserver = observeElement($sidebarContent, () => {
    $body.classList.toggle('NoMedia', $sidebarContent.childElementCount == 5)
  }, 'profile sidebar content container')
  pageObservers.push(sidebarContentObserver)

  // On initial appearance, the sidebar is injected with static HTML with
  // spinner placeholders, which gets replaced. When this happens we need to
  // observe the new content container instead.
  let $sidebarContentParent = $sidebarContent.parentElement
  pageObservers.push(
    observeElement($sidebarContentParent, (mutations) => {
      let sidebarContentReplaced = mutations.some(mutation => Array.from(mutation.removedNodes).includes($sidebarContent))
      if (sidebarContentReplaced) {
        log('profile sidebar content container replaced, observing new container')
        sidebarContentObserver.disconnect()
        pageObservers.splice(pageObservers.indexOf(sidebarContentObserver), 1)
        $sidebarContent = /** @type {HTMLElement} */ ($sidebarContentParent.firstElementChild)
        pageObservers.push(
          observeElement($sidebarContent, () => {
            $body.classList.toggle('NoMedia', $sidebarContent.childElementCount == 5)
          }, 'sidebar content container')
        )
      }
    }, 'sidebar content container parent')
  )
}

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
//#endregion

//#region Tweak functions
/**
 * Add an "Add muted word" menu item after "Settings and privacy" which takes
 * you straight to entering a new muted word (by clicking its way through all
 * the individual screens!).
 * @param {HTMLElement} $circleLink
 */
async function addAddMutedWordMenuItem($circleLink) {
  log('adding "Add muted word" menu item')

  // Wait for the dropdown to appear on desktop
  if (desktop) {
    $circleLink = await getElement('#layers div[data-testid="Dropdown"] a[href$="/i/circles"]', {
      name: 'rendered Twitter Circle menu item',
      timeout: 100,
    })
    if (!$circleLink) return
  }

  let $addMutedWord = /** @type {HTMLElement} */ ($circleLink.parentElement.cloneNode(true))
  $addMutedWord.classList.add('tnt_menu_item')
  $addMutedWord.querySelector('a').href = PagePaths.ADD_MUTED_WORD
  $addMutedWord.querySelector('span').textContent = getString('ADD_MUTED_WORD')
  $addMutedWord.querySelector('svg').innerHTML = Svgs.MUTE
  $addMutedWord.addEventListener('click', (e) => {
    e.preventDefault()
    addMutedWord()
  })
  $circleLink.parentElement.insertAdjacentElement('afterend', $addMutedWord)
}

function addCaretMenuListenerForQuoteTweet($tweet) {
  let $caret = /** @type {HTMLElement} */ ($tweet.querySelector('[data-testid="caret"]'))
  if ($caret && !$caret.dataset.tweakNewTwitterListener) {
    $caret.addEventListener('click', () => {
      quotedTweet = getQuotedTweetDetails($tweet)
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
  $toggleRetweets.querySelector(':scope > div:last-child > div:last-child')?.remove()
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

const configureCss = (() => {
  let $style = addStyle('features')

  return function configureCss() {
    let cssRules = []
    let hideCssSelectors = []
    let menuRole = `[role="${desktop ? 'menu' : 'dialog'}"]`

    // Hover colours for custom menu items
    cssRules.push(`
      body.Default .tnt_menu_item:hover { background-color: rgb(247, 249, 249) !important; }
      body.Dim .tnt_menu_item:hover { background-color: rgb(30, 39, 50) !important; }
      body.LightsOut .tnt_menu_item:hover { background-color: rgb(22, 24, 28) !important; }
    `)

    if (config.alwaysUseLatestTweets && config.hideForYouTimeline) {
      cssRules.push(`
        body.TabbedTimeline ${mobile ? Selectors.MOBILE_TIMELINE_HEADER_NEW : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:first-child {
          flex: 0;
        }
        body.TabbedTimeline ${mobile ? Selectors.MOBILE_TIMELINE_HEADER_NEW : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:first-child > a {
          display: none;
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
    if (config.hideAnalyticsNav) {
      hideCssSelectors.push(`${menuRole} a[href*="analytics.twitter.com"]`)
    }
    if (config.hideBookmarksNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/bookmarks"]`)
    }
    if (config.hideTwitterCircleNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/i/circles"]`)
    }
    if (config.hideShareTweetButton) {
      hideCssSelectors.push(
        // Under timeline tweets
        `[data-testid="tweet"][tabindex="0"] [role="group"] > div[style]`,
        // Under individual tweets
        '[data-testid="tweet"][tabindex="-1"] [role="group"] > div[style]',
      )
    }
    if (config.hideHelpCenterNav) {
      hideCssSelectors.push(`${menuRole} a[href*="support.twitter.com"]`)
    }
    if (config.hideListsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/lists"]`)
    }
    if (config.hideMetrics) {
      configureHideMetricsCss(cssRules, hideCssSelectors)
    }
    // if (config.hideMomentsNav) {
    //   hideCssSelectors.push(`${menuRole} a[href$="/moment_maker"]`)
    // }
    if (config.hideMonetizationNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/settings/monetization"]`)
    }
    // if (config.hideNewslettersNav) {
    //   hideCssSelectors.push(`${menuRole} a[href$="/newsletters"]`)
    // }
    if (config.hideTopicsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/topics"]`)
    }
    if (config.hideTweetAnalyticsLinks) {
      hideCssSelectors.push('[data-testid="analyticsButton"]')
    }
    if (config.hideTwitterAdsNav) {
      hideCssSelectors.push(`${menuRole} a[href*="ads.twitter.com"]`)
    }
    if (config.hideTwitterBlueNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/i/twitter_blue_sign_up"]`)
    }
    if (config.hideTwitterForProfessionalsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/convert_to_professional"]`)
    }
    if (config.hideVerifiedNotificationsTab) {
      hideCssSelectors.push('body.Notifications [data-testid="ScrollSnap-List"] > div:nth-child(2)')
    }
    if (config.hideViews) {
      hideCssSelectors.push(
        // "Views" under individual tweets
        '[data-testid="tweet"][tabindex="-1"] a[href*="/status/"] + span[aria-hidden]',
        '[data-testid="tweet"][tabindex="-1"] a[href*="/status/"] + span[aria-hidden] + span',
      )
    }
    if (config.hideWhoToFollowEtc) {
      hideCssSelectors.push(`body.Profile ${Selectors.PRIMARY_COLUMN} aside[role="complementary"]`)
    }
    if (config.reducedInteractionMode) {
      hideCssSelectors.push(
        '[data-testid="tweet"] [role="group"]',
        'body.Tweet a:is([href$="/retweets"], [href$="/likes"])',
        'body.Tweet [data-testid="tweet"] + div > div [role="group"]',
      )
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

    // Hide "Creator Studio" if all its contents are hidden
    // if (config.hideMomentsNav && config.hideNewslettersNav && config.hideAnalyticsNav) {
    if (config.hideAnalyticsNav) {
      hideCssSelectors.push(`${menuRole} div[role="button"][aria-expanded]:nth-of-type(1)`)
    }
    // Hide "Professional Tools" if all its contents are hidden
    if (config.hideTwitterForProfessionalsNav && config.hideTwitterAdsNav && config.hideMonetizationNav) {
      hideCssSelectors.push(`${menuRole} div[role="button"][aria-expanded]:nth-of-type(2)`)
    }

    if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
      cssRules.push(`
        body.Default {
          --active-tab-text: rgb(15, 20, 25);
          --inactive-tab-text: rgb(83, 100, 113);
          --tab-border: rgb(239, 243, 244);
          --tab-hover: rgba(15, 20, 25, 0.1);
        }
        body.Dim {
          --active-tab-text: rgb(247, 249, 249);
          --inactive-tab-text: rgb(139, 152, 165);
          --tab-border: rgb(56, 68, 77);
          --tab-hover: rgba(247, 249, 249, 0.1);
        }
        body.LightsOut {
          --active-tab-text: rgb(247, 249, 249);
          --inactive-tab-text: rgb(113, 118, 123);
          --tab-border: rgb(47, 51, 54);
          --tab-hover: rgba(231, 233, 234, 0.1);
        }

        /* Tabbed timeline */
        #tnt_separated_tweets_tab:hover {
          background-color: var(--tab-hover);
        }
        body:not(.SeparatedTweets) #tnt_separated_tweets_tab > a > div > div,
        body.TabbedTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER_NEW : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#tnt_separated_tweets_tab) > a > div > div {
          font-weight: normal !important;
          color: var(--inactive-tab-text) !important;
        }
        body.SeparatedTweets #tnt_separated_tweets_tab > a > div > div {
          font-weight: bold;
          color: var(--active-tab-text); !important;
        }
        body:not(.SeparatedTweets) #tnt_separated_tweets_tab > a > div > div > div,
        body.TabbedTimeline.SeparatedTweets ${mobile ? Selectors.MOBILE_TIMELINE_HEADER_NEW : Selectors.PRIMARY_COLUMN} nav div[role="tablist"] > div:not(#tnt_separated_tweets_tab) > a > div > div > div {
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

    if (desktop) {
      // Hide the "Home" heading on the tabbed timeline as it just takes up space
      hideCssSelectors.push(`body.TabbedTimeline ${Selectors.DESKTOP_TIMELINE_HEADER} > div:first-child > div:first-child`)
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/home"]`)
      }
      if (config.fullWidthContent) {
        // Pseudo-selector for pages full-width is enabled on
        let pageSelector = ':is(.Community, .List, .MainTimeline)'
        cssRules.push(`
          /* Use full width when the sidebar is visible */
          body.Sidebar${pageSelector} ${Selectors.PRIMARY_COLUMN},
          body.Sidebar${pageSelector} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:last-child {
            max-width: 990px;
          }
          /* Make the "What's happening" input keep its original width */
          body.MainTimeline ${Selectors.PRIMARY_COLUMN} > div:first-child > div:nth-of-type(3) div[role="progressbar"] + div {
            max-width: 598px;
          }
          /* Use full width when the sidebar is not visible */
          body:not(.Sidebar)${pageSelector} header[role="banner"] {
            flex-grow: 0;
          }
          body:not(.Sidebar)${pageSelector} main[role="main"] > div {
            width: 100%;
          }
          body:not(.Sidebar)${pageSelector} ${Selectors.PRIMARY_COLUMN} {
            max-width: unset;
            width: 100%;
          }
          body:not(.Sidebar)${pageSelector} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:first-child div,
          body:not(.Sidebar)${pageSelector} ${Selectors.PRIMARY_COLUMN} > div:first-child > div:last-child {
            max-width: unset;
          }
        `)
        if (!config.fullWidthMedia) {
          // Make media & cards keep their original width
          cssRules.push(`
            body${pageSelector} ${Selectors.PRIMARY_COLUMN} ${Selectors.TWEET} > div > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div:nth-of-type(2) > div[id][aria-labelledby]:not(:empty) {
              max-width: 504px;
            }
          `)
        }
        // Hide the sidebar when present
        hideCssSelectors.push(`body.Sidebar${pageSelector} ${Selectors.SIDEBAR}`)
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
      if (config.hideCommunitiesNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/communities"]`)
      }
      if (config.hideExplorePageContents) {
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.DESKTOP_TIMELINE_HEADER} nav`,
          // Content
          `body.Explore ${Selectors.TIMELINE}`,
        )
      }
      if (config.hideKeyboardShortcutsNav) {
        hideCssSelectors.push(`${menuRole} a[href$="/i/keyboard_shortcuts"]`)
      }
      if (config.hideTwitterBlueNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href$="/i/twitter_blue_sign_up"]`)
      }
      if (config.hideSidebarContent) {
        // Only show the first sidebar item by default
        // Re-show subsequent non-algorithmic sections on specific pages
        cssRules.push(`
          ${Selectors.SIDEBAR_WRAPPERS} > div:not(:first-of-type) {
            display: none;
          }
          body.Profile:not(.Blocked, .NoMedia) ${Selectors.SIDEBAR_WRAPPERS} > div:is(:nth-of-type(2), :nth-of-type(3)) {
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
      }
      if (config.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media modal
          `[aria-modal="true"] [role="group"] > div[style]:not([role])`,
        )
      }
      if (config.hideExploreNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`)
      }
      if (config.hideBookmarksNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/bookmarks"]`)
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
        )
      }
      if (config.retweets != 'separate' && config.quoteTweets != 'separate') {
        hideCssSelectors.push('#tnt_separated_tweets_tab')
      }
    }

    if (mobile) {
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`)
      }
      if (config.hideAppNags) {
        cssRules.push(`
          body.Tweet ${Selectors.MOBILE_TIMELINE_HEADER_OLD} div:nth-of-type(3) > div > [role="button"],
          body.Tweet ${Selectors.MOBILE_TIMELINE_HEADER_NEW} div:nth-of-type(3) > div > [role="button"] {
            visibility: hidden;
          }
        `)
      }
      if (config.hideExplorePageContents) {
        // Hide explore page contents so we don't get a brief flash of them
        // before automatically switching the page to search mode.
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.MOBILE_TIMELINE_HEADER_OLD} > div:nth-of-type(2)`,
          `body.Explore ${Selectors.MOBILE_TIMELINE_HEADER_NEW} > div > div:nth-of-type(2)`,
          // Content
          `body.Explore ${Selectors.TIMELINE}`,
        )
      }
      if (config.hideCommunitiesNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href$="/communities"]`)
      }
      if (config.hideMessagesBottomNavItem) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/messages"]`)
      }
      if (config.hideShareTweetButton) {
        hideCssSelectors.push(
          // In media modal
          `body.MobilePhoto [role="group"] > div[style]`,
        )
      }
      if (config.hideViews) {
        hideCssSelectors.push(
          // Under timeline tweets
          // Views only display on mobile at larger widths - only hide the 4th button if there are 5
          '[data-testid="tweet"][tabindex="0"] [role="group"]:not(.buffer-inserted) > div:nth-child(4):nth-last-child(2)',
          '[data-testid="tweet"][tabindex="0"] [role="group"].buffer-inserted > div:nth-child(4):nth-last-child(2)',
        )
      }
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
      ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/followers"]) > :first-child'
    )
    // Fix display of whitespace after hidden metrics
    cssRules.push(
      ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/followers"]) { white-space: pre-line; }'
    )
  }

  if (config.hideTotalTweetsMetrics) {
    // Tweet count under username header on profile pages
    hideCssSelectors.push(
      mobile ? `
        body.Profile header > div > div:first-of-type h2 + div[dir],
        body.Profile ${Selectors.MOBILE_TIMELINE_HEADER_NEW} > div > div:first-of-type h2 + div[dir]
      ` : `body.Profile ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 + div[dir]`
    )
  }

  let individualTweetMetricSelectors = [
    config.hideRetweetMetrics    && '[href$="/retweets"]',
    config.hideLikeMetrics       && '[href$="/likes"]',
    config.hideQuoteTweetMetrics && '[href$="/retweets/with_comments"]',
  ].filter(Boolean).join(', ')

  if (individualTweetMetricSelectors) {
    // Individual tweet metrics
    hideCssSelectors.push(
      `body.Tweet a:is(${individualTweetMetricSelectors}) > :first-child`,
      `[aria-modal="true"] [data-testid="tweet"] a:is(${individualTweetMetricSelectors}) > :first-child`
    )
    // Fix display of whitespace after hidden metrics
    cssRules.push(
      `body.Tweet a:is(${individualTweetMetricSelectors}), [aria-modal="true"] [data-testid="tweet"] a:is(${individualTweetMetricSelectors}) { white-space: pre-line; }`
    )
  }

  let timelineMetricSelectors = [
    config.hideReplyMetrics   && '[data-testid="reply"]',
    config.hideRetweetMetrics && '[data-testid$="retweet"]',
    config.hideLikeMetrics    && '[data-testid$="like"]',
  ].filter(Boolean).join(', ')

  if (timelineMetricSelectors) {
    cssRules.push(
      `[role="group"] div:is(${timelineMetricSelectors}) span { visibility: hidden; }`
    )
  }
}

const configureNavFontSizeCss = (() => {
  let $style = addStyle('nav-font-size')

  return function configureNavFontSizeCss() {
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
  let $style = addStyle('theme')

  return function configureThemeCss() {
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
    if (themeColor != null && (config.retweets == 'separate' || config.quoteTweets == 'separate')) {
      cssRules.push(`
        body.SeparatedTweets #tnt_separated_tweets_tab > a > div > div > div {
          background-color: ${themeColor} !important;
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
          body.Default [role="button"][data-testid$="-unfollow"]:not(:hover) > * {
            color: rgb(255, 255, 255) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-unfollow"]:not(:hover) {
            background-color: rgb(255, 255, 255) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-unfollow"]:not(:hover) > * {
            color: rgb(15, 20, 25) !important;
          }
          /* Follow button */
          body.Default [role="button"][data-testid$="-follow"] {
            border-color: rgb(207, 217, 222) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-follow"] {
            border-color: rgb(83, 100, 113) !important;
          }
          body.Default [role="button"][data-testid$="-follow"] > * {
            color: rgb(15, 20, 25) !important;
          }
          body:is(.Dim, .LightsOut) [role="button"][data-testid$="-follow"] > * {
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
          [role="button"][data-testid$="-unfollow"]:not(:hover) > * {
              color: rgb(255, 255, 255) !important;
          }
          /* Follow button */
          [role="button"][data-testid$="-follow"] {
            border-color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-follow"] > * {
            color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-follow"]:hover {
            background-color: ${themeColor} !important;
          }
          [role="button"][data-testid$="-follow"]:hover > * {
            color: rgb(255, 255, 255) !important;
          }
        `)
      }
    }

    $style.textContent = cssRules.map(dedent).join('\n')
  }
})()

/**
 * @param {HTMLElement} $tweet
 * @returns {import("./types").QuotedTweet}
 */
 function getQuotedTweetDetails($tweet) {
  let $quotedTweet = $tweet.querySelector('div[id^="id__"] > div[dir] > span').parentElement.nextElementSibling
  let $heading = $quotedTweet?.querySelector(':scope > div > div:first-child')
  let user = $heading?.querySelector('div:last-child > span')?.textContent
  let time = $heading?.querySelector('time')?.dateTime
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
 * @returns {import("./types").TimelineItemType}
 */
function getTweetType($tweet) {
  if ($tweet.closest(Selectors.PROMOTED_TWEET_CONTAINER)) {
    return 'PROMOTED_TWEET'
  }
  if ($tweet.querySelector('[data-testid="socialContext"]')) {
    // Only check social context icons on "For you", otherwise assume Retweet
    if ((!config.alwaysUseLatestTweets || !config.hideForYouTimeline) && wasForYouTabSelected) {
      let svgPath = $tweet.querySelector('svg path')?.getAttribute('d') ?? ''
      if (svgPath.startsWith('M7.471 21H.472l.029-1.027c.')) return 'COMMUNITY_TWEET'
      if (svgPath.startsWith('M17.863 13.44c1.477 1.58 2.')) return 'FOLLOWEES_FOLLOWS'
      if (svgPath.startsWith('M20.884 13.19c-1.351 2.48-4')) return 'LIKED'
      if (svgPath.startsWith('M1.751 10c0-4.42 3.584-8 8.')) return 'REPLIED'
      if (svgPath.startsWith('M12 1.75c-5.11 0-9.25 4.14-')) return 'SUGGESTED_TOPIC_TWEET'
      // This is the start of the SVG path for the Retweet icon
      if (!svgPath.startsWith('M4.75 3.79l4.603 4.3-1.706 1')) {
        warn('unhandled socialContext tweet type - falling back to RETWEET', $tweet)
      }
    }
    // Quoted tweets from accounts you blocked or muted are displayed as an
    // <article> with "This Tweet is unavailable."
    if ($tweet.querySelector('article')) {
      return 'UNAVAILABLE_RETWEET'
    }
    // Quoted tweets are preceded by visually-hidden "Quote Tweet" text
    if ($tweet.querySelector('div[id^="id__"] > div[dir] > span')?.textContent.includes(getString('QUOTE_TWEET'))) {
      return 'RETWEETED_QUOTE_TWEET'
    }
    return 'RETWEET'
  }
  // Quoted tweets are preceded by visually-hidden "Quote Tweet" text
  if ($tweet.querySelector('div[id^="id__"] > div[dir] > span')?.textContent.includes(getString('QUOTE_TWEET'))) {
    return 'QUOTE_TWEET'
  }
  // Quoted tweets from accounts you blocked or muted are displayed as an
  // <article> with "This Tweet is unavailable."
  if ($tweet.querySelector('article')) {
    return 'UNAVAILABLE_QUOTE_TWEET'
  }
  return 'TWEET'
}

// Add 1 every time this gets broken: 5
function getVerifiedProps($svg) {
  let propsGetter = (props) => props?.children?.props?.children?.[0]?.[0]?.props
  let $parent = $svg.parentElement
  // Verified badge button on the profile screen
  if (isOnProfilePage() && $parent.getAttribute('role') == 'button') {
    $parent = $parent.closest('span')
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
  else if (!('isVerified' in props)) {
    warn('isVerified not in React props for', $svg, {props})
  }
  return props
}

/**
 * @param {HTMLElement} $popup
 * @returns {{tookAction: boolean, onPopupClosed?: () => void}}
 */
function handlePopup($popup) {
  let result = {tookAction: false, onPopupClosed: null}

  if (desktop && !isDesktopMediaModalOpen && URL_PHOTO_RE.test(location.pathname) && currentPath != location.pathname) {
    log('media modal opened')
    isDesktopMediaModalOpen = true
    observeDesktopModalTimeline()
    return {
      tookAction: true,
      onPopupClosed() {
        log('media modal closed')
        isDesktopMediaModalOpen = false
        if (modalObservers.length > 0) {
          log(
            `disconnecting ${modalObservers.length} modal observer${s(modalObservers.length)}`,
            modalObservers.map(observer => observer['name'])
          )
          modalObservers.forEach(observer => observer.disconnect())
          modalObservers = []
        }
      }
    }
  }

  if (desktop && !isCircleModalOpen && URL_CIRCLE_RE.test(location.pathname) && currentPath != location.pathname) {
    log('circle modal opened')
    isCircleModalOpen = true
    observeCircleModal()
    return {
      tookAction: true,
      onPopupClosed() {
        log('circle modal closed')
        isCircleModalOpen = false
        if (modalObservers.length > 0) {
          log(
            `disconnecting ${modalObservers.length} modal observer${s(modalObservers.length)}`,
            modalObservers.map(observer => observer['name'])
          )
          modalObservers.forEach(observer => observer.disconnect())
          modalObservers = []
        }
      }
    }
  }

  if (isOnListPage()) {
    let $switchSvg = $popup.querySelector(`svg path[d^="M15.96 1.54L21.41 7l-5.45 5.46-1.42-1"]`)
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

  if (config.addAddMutedWordMenuItem) {
    let $circleLink = /** @type {HTMLElement} */ ($popup.querySelector('a[href$="/i/circles"]'))
    if ($circleLink) {
      addAddMutedWordMenuItem($circleLink)
      result.tookAction = true
    }
  }

  // User hovercard popup
  if (config.twitterBlueChecks != 'ignore') {
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
      if (!$verificationBadge) return
      let $headerBlueCheck = document.querySelector(`body.Profile ${Selectors.MOBILE_TIMELINE_HEADER_NEW} .tnt_blue_check`)
      if (!$headerBlueCheck) return
      blueCheck($verificationBadge)
      return
    }

    let $hoverCard = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="HoverCard"]'))
    if ($hoverCard) {
      getElement(':scope > div > div > svg[data-testid="verificationBadge"]', {
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

  return result
}

function isBlueVerified($svg) {
  let props = getVerifiedProps($svg)
  return Boolean(props && props.isBlueVerified && !props.isVerified)
}

/**
 * Checks if a tweet is preceded by an element creating a vertical reply line.
 * @param {HTMLElement} $tweet
 * @returns {boolean}
 */
function isReplyToPreviousTweet($tweet) {
  let $replyLine = $tweet.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild?.firstElementChild
  if ($replyLine) {
    return getComputedStyle($replyLine).width == '2px'
  }
}

/**
 * @returns {{disconnect()}}
 */
function onPopup($popup) {
  log('popup appeared', $popup)

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
  })

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
  let {classifyTweets = true, hideHeadings = true} = options

  let isOnMainTimeline = isOnMainTimelinePage()
  let isOnListTimeline = isOnListPage()

  if (config.twitterBlueChecks != 'ignore' && !isOnMainTimeline && !isOnListTimeline) {
    processBlueChecks($timeline)
  }

  if (!classifyTweets) return

  let itemTypes = {}
  let hiddenItemCount = 0
  let hiddenItemTypes = {}

  /** @type {HTMLElement} */
  let $previousItem = null
  /** @type {?import("./types").TimelineItemType} */
  let previousItemType = null
  /** @type {?boolean} */
  let hidPreviousItem = null
  let hideAllSubsequentItems = false

  for (let $item of $timeline.children) {
    /** @type {?import("./types").TimelineItemType} */
    let itemType = null
    /** @type {?boolean} */
    let hideItem = null
    /** @type {?boolean} */
    let highlightItem = null
    /** @type {?HTMLElement} */
    let $tweet = $item.querySelector(Selectors.TWEET)

    if (hideAllSubsequentItems) {
      hideItem = true
      itemType = previousItemType
    }
    else if ($tweet != null) {
      itemType = getTweetType($tweet)
      if (isOnMainTimeline || isOnListTimeline) {
        let isReply = isReplyToPreviousTweet($tweet)
        if (isReply && hidPreviousItem != null) {
          hideItem = hidPreviousItem
        } else {
          if (isOnMainTimeline) {
            hideItem = shouldHideMainTimelineItem(itemType, page)
          }
          else if (isOnListTimeline) {
            hideItem = shouldHideListTimelineItem(itemType)
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

        let checkType
        if (config.twitterBlueChecks != 'ignore' || config.verifiedAccounts != 'ignore') {
          for (let $svg of $tweet.querySelectorAll(Selectors.VERIFIED_TICK)) {
            let verifiedProps = getVerifiedProps($svg)
            if (!verifiedProps) continue

            let isUserCheck = $svg.closest('div[data-testid="User-Names"]')
            if (verifiedProps.isVerified) {
              if (isUserCheck) {
                checkType = 'VERIFIED'
              }
              if (hideItem !== true) {
                hideItem = config.verifiedAccounts == 'hide'
              }
              highlightItem = config.verifiedAccounts == 'highlight'
            }
            else if (verifiedProps.isBlueVerified) {
              if (isUserCheck) {
                checkType = 'BLUE'
              }
              blueCheck($svg)
            }
          }
        }

        if (debug) {
          $item.firstElementChild.dataset.itemType = `${itemType}${isReply ? ' / REPLY' : ''}${checkType ? ` / ${checkType}` : ''}`
        }
      }
    }
    else if (!isOnMainTimeline && !isOnListTimeline) {
      if ($item.querySelector(':scope > div > div > div > article')) {
        itemType = 'UNAVAILABLE'
      }
    }

    if (!isOnMainTimeline && !isOnListTimeline) {
      if (itemType != null) {
        hideItem = shouldHideOtherTimelineItem(itemType)
        if (debug) {
          $item.firstElementChild.dataset.itemType = itemType
        }
      }
    }

    if (itemType == null) {
      if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        // "Discover more" heading and subsequent algorithmic tweets
        if (isOnIndividualTweetPage()) {
          if ($item.querySelector('[dir]')?.innerText == getString('DISCOVER_MORE')) {
            itemType = 'DISCOVER_MORE_HEADING'
            hideItem = config.hideMoreTweets
            hideAllSubsequentItems = config.hideMoreTweets
          }
        }
        // "Who to follow", "Follow some Topics" etc. headings
        else if (hideHeadings) {
          hideItem = config.hideWhoToFollowEtc
        }
        if (debug) {
          $item.firstElementChild.dataset.itemType = itemType
        }
      }
    }

    itemTypes[itemType] ||= 0
    itemTypes[itemType]++

    if (itemType == null) {
      // Assume a non-identified item following an identified item is related.
      // "Who to follow" users and "Follow some Topics" topics appear in
      // subsequent items, as do "Show this thread" and "Show more" links.
      if (previousItemType != null) {
        hideItem = hidPreviousItem
        itemType = previousItemType
      }
    }

    if (hideItem != null) {
      if (hideItem) {
        hiddenItemCount++
        hiddenItemTypes[itemType] ||= 0
        hiddenItemTypes[itemType]++
      }
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.display != (hideItem ? 'none' : '')) {
        /** @type {HTMLElement} */ ($item.firstElementChild).style.display = hideItem ? 'none' : ''
        // Log these out as they can't be reliably triggered for testing
        if (hideItem && itemType == 'HEADING' || previousItemType == 'HEADING') {
          log(`hid a ${previousItemType == 'HEADING' ? 'post-' : ''}heading item`, $item)
        }
      }
    }

    if (highlightItem != null) {
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.backgroundColor != (highlightItem ? 'rgba(29, 161, 242, 0.25)' : '')) {
        /** @type {HTMLElement} */ ($item.firstElementChild).style.backgroundColor = highlightItem ? 'rgba(29, 161, 242, 0.25)' : ''
      }
    }

    $previousItem = $item
    hidPreviousItem = hideItem
    // If we hid a heading, keep hiding everything after it until we hit a tweet
    if (!(previousItemType == 'HEADING' && itemType == null)) {
      previousItemType = itemType
    }
  }

  log(`processed ${$timeline.children.length} timeline item${s($timeline.children.length)} in ${Date.now() - startTime}ms`, itemTypes, `hid ${hiddenItemCount}`, hiddenItemTypes)
}

function onTitleChange(title) {
  log('title changed', {title: title.split(ltr ? ' / ' : ' \\ ')[ltr ? 0 : 1], path: location.pathname})

  if (checkforDisabledHomeTimeline()) return

  // Ignore leading notification counts in titles, e.g. '(1) Following'
  let notificationCount = ''
  if (TITLE_NOTIFICATION_RE.test(title)) {
    notificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
    title = title.replace(TITLE_NOTIFICATION_RE, '')
  }

  let homeNavigationWasUsed = homeNavigationIsBeingUsed
  homeNavigationIsBeingUsed = false

  if (title == getString('TWITTER')) {
    // Mobile uses "Twitter" when viewing a photo - we need to let these process
    // so the next page will be re-processed when the photo is closed.
    if (mobile && URL_PHOTO_RE.test(location.pathname)) {
      log('viewing a photo on mobile')
		}
    // Ignore Flash of Uninitialised Title when navigating to a page for the
    // first time.
    else {
      log('ignoring Flash of Uninitialised Title')
      return
    }
  }

  let newPage = title.split(ltr ? ' / ' : ' \\ ')[ltr ? 0 : 1]

  // Only allow the same page to re-process after a title change on desktop if
  // the "Customize your view" dialog is currently open.
  if (newPage == currentPage && !(desktop && location.pathname == PagePaths.CUSTOMIZE_YOUR_VIEW)) {
    log('ignoring duplicate title change')
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
        // …the user viewed a photo.
        URL_PHOTO_RE.test(location.pathname) ||
        // …the user stopped viewing a photo.
        URL_PHOTO_RE.test(currentPath) ||
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
  if (!isOnProfilePage()) {
    $body.classList.remove('Blocked', 'NoMedia')
  }
  $body.classList.toggle('QuoteTweets', isOnQuoteTweetsPage())
  $body.classList.toggle('Tweet', isOnIndividualTweetPage())
  $body.classList.toggle('Search', isOnSearchPage())
  $body.classList.toggle('MobilePhoto', mobile && URL_PHOTO_RE.test(location.pathname))
  $body.classList.remove('TabbedTimeline')
  $body.classList.remove('SeparatedTweets')

  if (desktop) {
    if (config.twitterBlueChecks != 'ignore' || config.fullWidthContent && (isOnMainTimelinePage() || isOnListPage())) {
      observeSidebar()
    } else {
      $body.classList.remove('Sidebar')
    }
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
  else if (isOnQuoteTweetsPage()) {
    tweakQuoteTweetsPage()
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

  if (mobile && URL_CIRCLE_RE.test(currentPath)) {
    tweakMobileTwitterCirclePage()
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
 * @param {import("./types").AlgorithmicTweetsConfig} config
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideAlgorithmicTweet(config, page) {
  switch (config) {
    case 'hide': return true
    case 'ignore': return page == separatedTweetsTimelineTitle
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
    case 'COMMUNITY_TWEET':
      return shouldHideAlgorithmicTweet(config.communityTweets, page)
    case 'FOLLOWEES_FOLLOWS':
      return shouldHideAlgorithmicTweet(config.followeesFollows, page)
    case 'LIKED':
      return shouldHideAlgorithmicTweet(config.likedTweets, page)
    case 'QUOTE_TWEET':
      return shouldHideSharedTweet(config.quoteTweets, page)
    case 'REPLIED':
      return shouldHideAlgorithmicTweet(config.repliedToTweets, page)
    case 'RETWEET':
      return shouldHideSharedTweet(config.retweets, page)
    case 'RETWEETED_QUOTE_TWEET':
      return shouldHideSharedTweet(config.retweets, page) || shouldHideSharedTweet(config.quoteTweets, page)
    case 'SUGGESTED_TOPIC_TWEET':
      return shouldHideAlgorithmicTweet(config.suggestedTopicTweets, page)
    case 'TWEET':
      return page == separatedTweetsTimelineTitle
    case 'UNAVAILABLE_QUOTE_TWEET':
      return config.hideUnavailableQuoteTweets || shouldHideSharedTweet(config.quoteTweets, page)
    case 'UNAVAILABLE_RETWEET':
      return config.hideUnavailableQuoteTweets || shouldHideSharedTweet(config.retweets, page)
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
    case 'COMMUNITY_TWEET':
    case 'FOLLOWEES_FOLLOWS':
    case 'LIKED':
    case 'QUOTE_TWEET':
    case 'REPLIED':
    case 'RETWEET':
    case 'RETWEETED_QUOTE_TWEET':
    case 'SUGGESTED_TOPIC_TWEET':
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
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
    })
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

function tweakFollowListPage() {
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
    })
  }
}

function tweakIndividualTweetPage() {
  observeTimeline(currentPage, {
    hideHeadings: false,
  })
}

function tweakListPage() {
  observeTimeline(currentPage, {
    hideHeadings: false,
  })
}

function tweakMainTimelinePage() {
  let $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER_NEW : Selectors.PRIMARY_COLUMN} nav`)

  // "Which version of the main timeline are we on?" hooks for styling
  $body.classList.toggle('TabbedTimeline', $timelineTabs != null)
  $body.classList.toggle('SeparatedTweets', isOnSeparatedTweetsTimeline())

  if ($timelineTabs != null) {
    log('on tabbed timeline')
    tweakTimelineTabs($timelineTabs)

    // If there are pinned lists, the timeline tabs <nav> will be replaced when they load
    pageObservers.push(
      observeElement($timelineTabs.parentElement, (mutations) => {
        let timelineTabsReplaced = mutations.some(mutation => Array.from(mutation.removedNodes).includes($timelineTabs))
        if (timelineTabsReplaced) {
          log('timeline tabs replaced')
          $timelineTabs = document.querySelector(`${mobile ? Selectors.MOBILE_TIMELINE_HEADER_NEW : Selectors.PRIMARY_COLUMN} nav`)
          tweakTimelineTabs($timelineTabs)
        }
      }, 'timeline tabs nav container')
    )

    observeTimeline(currentPage, {
      isTabbed: true,
      onTabChanged: () => {
        wasForYouTabSelected = Boolean($timelineTabs.querySelector('div[role="tablist"] > div:first-child > a[aria-selected="true"]'))
      },
      tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child > div',
    })
  } else {
    warn('could not find timeline tabs')
  }
}

async function tweakMobileTwitterCirclePage() {
  let $tabContentContainer = await getElement('main > div > div > div:last-child:not(:first-child)', {
    name: 'circle page tab content container',
    stopIf: pageIsNot(currentPage),
  })

  if ($tabContentContainer == null) return

  pageObservers.push(observeElement($tabContentContainer, (mutations) => {
    // Ignore loading indicators on initial load of each tab
    if (!mutations.length || mutations.some(mutation => mutation.addedNodes[0]?.querySelector('svg circle'))) {
      return
    }
    observeTwitterCircleTabContent($tabContentContainer.firstElementChild, pageObservers, disconnectPageObserver)
  }, 'circle page tab content container'))
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

  if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
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

      // This script assumes navigation has occurred when the document title
      // changes, so by changing the title we fake navigation to a non-existent
      // page representing the separated tweets timeline.
      $newTab.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (!document.title.startsWith(separatedTweetsTimelineTitle)) {
          setTitle(separatedTweetsTimelineTitle)
        }
        window.scrollTo({top: 0})
        if (mobile) {
          e.target.blur()
        }
      })
      $followingTabLink.parentElement.insertAdjacentElement('afterend', $newTab)

      // Return to the main timeline view when any other tab is clicked
      $followingTabLink.parentElement.parentElement.addEventListener('click', () => {
        if (!document.title.startsWith(getString('HOME'))) {
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
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
      isTabbed: true,
      tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
    })
  }
}

function tweakProfilePage() {
  if (config.twitterBlueChecks != 'ignore') {
    if (mobile) {
      processBlueChecks(document.querySelector(Selectors.MOBILE_TIMELINE_HEADER_NEW))
    }
    processBlueChecks(document.querySelector(Selectors.PRIMARY_COLUMN))
  }
  observeTimeline(currentPage)
  if (desktop && config.hideSidebarContent) {
    observeProfileBlockedStatus(currentPage)
    observeProfileSidebar(currentPage)
  }
}

function tweakQuoteTweetsPage() {
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage)
  }
}

function tweakSearchPage() {
  observeTimeline(currentPage, {
    hideHeadings: false,
    isTabbed: true,
    tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child > div',
  })
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

  let $appWrapper = await getElement('#layers + div', {name: 'app wrapper'})
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
      observeHtmlFontSize()
      observePopups()

      // Start watching for page changes
      observeTitle()
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
  observePopups()

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