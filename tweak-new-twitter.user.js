// ==UserScript==
// @name        Tweak New Twitter
// @description Remove algorithmic content from Twitter, hide news & trends, control which shared tweets appear on your timeline, and improve the UI
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @version     37
// ==/UserScript==

const enableDebugLogging = false

const mobile = navigator.userAgent.includes('Android')
const desktop = !mobile

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
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  fastBlock: true,
  hideAnalyticsNav: true,
  hideBookmarksNav: true,
  hideListsNav: true,
  hideMomentsNav: true,
  hideMoreTweets: true,
  hideNewslettersNav: true,
  hideShareTweetButton: false,
  hideTopicsNav: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterAdsNav: true,
  hideUnavailableQuoteTweets: true,
  hideWhoToFollowEtc: true,
  likedTweets: 'hide',
  quoteTweets: 'ignore',
  repliedToTweets: 'hide',
  retweets: 'separate',
  suggestedTopicTweets: 'hide',
  tweakQuoteTweetsPage: true,
  // Experiments
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  hideMetrics: false,
  reducedInteractionMode: false,
  verifiedAccounts: 'ignore',
  // Desktop only
  hideAccountSwitcher: true,
  hideExploreNav: true,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  // Mobile only
  hideAppNags: true,
  hideExplorePageContents: true,
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
    HOME: 'الرئيسيّة',
    LATEST_TWEETS: 'أحدث التغريدات',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TWITTER: 'تويتر',
  },
  ar: {
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    HOME: 'الرئيسيّة',
    LATEST_TWEETS: 'أحدث التغريدات',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TWITTER: 'تويتر',
  },
  bg: {
    ADD_MUTED_WORD: 'Добавяне на заглушена дума',
    HOME: 'Начало',
    LATEST_TWEETS: 'Най-новите туитове',
    QUOTE_TWEET: 'Цитиране на туита',
    QUOTE_TWEETS: 'Туитове с цитат',
    RETWEETS: 'Ретуитове',
    SHARED_TWEETS: 'Споделени туитове',
  },
  bn: {
    ADD_MUTED_WORD: 'নীরব করা শব্দ যোগ করুন',
    HOME: 'হোম',
    LATEST_TWEETS: 'সাম্প্রতিক টুইটগুলি',
    QUOTE_TWEET: 'টুইট উদ্ধৃত করুন',
    QUOTE_TWEETS: 'টুইট উদ্ধৃতিগুলো',
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED_TWEETS: '',
    TWITTER: 'টুইটার',
  },
  ca: {
    ADD_MUTED_WORD: 'Afegeix una paraula silenciada',
    HOME: 'Inici',
    LATEST_TWEETS: 'Tuits més recents',
    QUOTE_TWEET: 'Cita el tuit',
    QUOTE_TWEETS: 'Tuits amb cita',
    RETWEETS: 'Retuits',
    SHARED_TWEETS: 'Tuits compartits',
  },
  cs: {
    ADD_MUTED_WORD: 'Přidat slovo na seznam skrytých slov',
    HOME: 'Hlavní stránka',
    LATEST_TWEETS: 'Nejnovější tweety',
    QUOTE_TWEET: 'Citovat Tweet',
    QUOTE_TWEETS: 'Tweety s citací',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Sdílené tweety',
  },
  da: {
    ADD_MUTED_WORD: 'Tilføj skjult ord',
    HOME: 'Forside',
    LATEST_TWEETS: 'Seneste Tweets',
    QUOTE_TWEET: 'Citér Tweet',
    QUOTE_TWEETS: 'Citat-Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Delte tweets',
  },
  de: {
    ADD_MUTED_WORD: 'Stummgeschaltetes Wort hinzufügen',
    HOME: 'Startseite',
    LATEST_TWEETS: 'Neueste Tweets',
    QUOTE_TWEET: 'Tweet zitieren',
    QUOTE_TWEETS: 'Zitierte Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Geteilte Tweets',
  },
  el: {
    ADD_MUTED_WORD: 'Προσθήκη λέξης σε σίγαση',
    HOME: 'Αρχική σελίδα',
    LATEST_TWEETS: 'Τα πιο πρόσφατα Tweet',
    QUOTE_TWEET: 'Παράθεση Tweet',
    QUOTE_TWEETS: 'Tweet με παράθεση',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
  },
  en: {
    ADD_MUTED_WORD: 'Add muted word',
    HOME: 'Home',
    LATEST_TWEETS: 'Latest Tweets',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
    TWITTER: 'Twitter',
  },
  es: {
    ADD_MUTED_WORD: 'Añadir palabra silenciada',
    HOME: 'Inicio',
    LATEST_TWEETS: 'Tweets más recientes',
    QUOTE_TWEET: 'Citar Tweet',
    QUOTE_TWEETS: 'Tweets citados',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Tweets compartidos',
  },
  eu: {
    ADD_MUTED_WORD: 'Gehitu isilarazitako hitza',
    HOME: 'Hasiera',
    LATEST_TWEETS: 'Azken txioak',
    QUOTE_TWEET: 'Txioa apaitu',
    QUOTE_TWEETS: 'Aipatu txioak',
    RETWEETS: 'Bertxioak',
    SHARED_TWEETS: 'Partekatutako',
  },
  fa: {
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    HOME: 'خانه',
    LATEST_TWEETS: 'جدیدترین توییت‌ها',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت',
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
    TWITTER: 'توییتر',
  },
  fi: {
    ADD_MUTED_WORD: 'Lisää hiljennetty sana',
    HOME: 'Etusivu',
    LATEST_TWEETS: 'Uusimmat twiitit',
    QUOTE_TWEET: 'Twiitin lainaus',
    QUOTE_TWEETS: 'Twiitin lainaukset',
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED_TWEETS: 'Jaetut twiitit',
  },
  fil: {
    ADD_MUTED_WORD: 'Idagdag ang naka-mute na salita',
    HOME: 'Home',
    LATEST_TWEETS: 'Mga Pinakabagong Tweet',
    QUOTE_TWEET: 'Quote na Tweet',
    QUOTE_TWEETS: 'Mga Quote na Tweet',
    RETWEETS: 'Mga Retweet',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
  },
  fr: {
    ADD_MUTED_WORD: 'Ajouter un mot masqué',
    HOME: 'Accueil',
    LATEST_TWEETS: 'Tout derniers Tweets',
    QUOTE_TWEET: 'Citer le Tweet',
    QUOTE_TWEETS: 'Tweets cités',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Tweets partagés',
  },
  ga: {
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    HOME: 'Baile',
    LATEST_TWEETS: 'Tweetanna is déanaí',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Luaigh Tvuíteanna',
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
  },
  gl: {
    ADD_MUTED_WORD: 'Engadir palabra silenciada',
    HOME: 'Inicio',
    LATEST_TWEETS: 'Últimos chíos',
    QUOTE_TWEET: 'Citar chío',
    QUOTE_TWEETS: 'Chíos citados',
    RETWEETS: 'Rechouchíos',
    SHARED_TWEETS: 'Chíos compartidos',
  },
  gu: {
    ADD_MUTED_WORD: 'જોડાણ અટકાવેલો શબ્દ ઉમેરો',
    HOME: 'હોમ',
    LATEST_TWEETS: 'તાજેતરની ટ્વીટ્સ',
    QUOTE_TWEET: 'અવતરણની સાથે ટ્વીટ કરો',
    QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ',
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
  },
  he: {
    ADD_MUTED_WORD: 'הוסף מילה מושתקת',
    HOME: 'דף הבית',
    LATEST_TWEETS: 'הציוצים האחרונים',
    QUOTE_TWEET: 'ציטוט ציוץ',
    QUOTE_TWEETS: 'ציוצי ציטוט',
    RETWEETS: 'ציוצים מחדש',
    SHARED_TWEETS: 'ציוצים משותפים',
    TWITTER: 'טוויטר',
  },
  hi: {
    ADD_MUTED_WORD: 'म्यूट किया गया शब्द जोड़ें',
    HOME: 'होम',
    LATEST_TWEETS: 'नवीनतम ट्वीट्स',
    QUOTE_TWEET: 'कोट ट्वीट',
    QUOTE_TWEETS: 'कोट ट्वीट्स',
    RETWEETS: 'रीट्वीट्स',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
  },
  hr: {
    ADD_MUTED_WORD: 'Dodaj onemogućenu riječ',
    HOME: 'Naslovnica',
    LATEST_TWEETS: 'Najnoviji tweetovi',
    QUOTE_TWEET: 'Citiraj Tweet',
    QUOTE_TWEETS: 'Citirani tweetovi',
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
  },
  hu: {
    ADD_MUTED_WORD: 'Elnémított szó hozzáadása',
    HOME: 'Kezdőlap',
    LATEST_TWEETS: 'A legfrissebb Tweetek',
    QUOTE_TWEET: 'Tweet idézése',
    QUOTE_TWEETS: 'Tweet-idézések',
    RETWEETS: 'Retweetek',
    SHARED_TWEETS: 'Megosztott tweetek',
  },
  id: {
    ADD_MUTED_WORD: 'Tambahkan kata kunci yang dibisukan',
    HOME: 'Beranda',
    LATEST_TWEETS: 'Tweet Terbaru',
    QUOTE_TWEET: 'Kutip Tweet',
    QUOTE_TWEETS: 'Kutip Tweet',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
  },
  it: {
    ADD_MUTED_WORD: 'Aggiungi parola o frase silenziata',
    HOME: 'Home',
    LATEST_TWEETS: 'Tweet più recenti',
    QUOTE_TWEET: 'Cita il Tweet',
    QUOTE_TWEETS: 'Tweet di citazione',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet condivisi',
  },
  ja: {
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    HOME: 'ホーム',
    LATEST_TWEETS: '最新ツイート',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
  },
  kn: {
    ADD_MUTED_WORD: 'ಸದ್ದಡಗಿಸಿದ ಪದವನ್ನು ಸೇರಿಸಿ',
    HOME: 'ಹೋಮ್',
    LATEST_TWEETS: 'ಇತ್ತೀಚಿನ ಟ್ವೀಟ್‌ಗಳು',
    QUOTE_TWEET: 'ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ',
    QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು',
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
  },
  ko: {
    ADD_MUTED_WORD: '뮤트할 단어 추가하기',
    HOME: '홈',
    LATEST_TWEETS: '최신 트윗',
    QUOTE_TWEET: '트윗 인용하기',
    QUOTE_TWEETS: '트윗 인용하기',
    RETWEETS: '리트윗',
    SHARED_TWEETS: '공유 트윗',
    TWITTER: '트위터',
  },
  mr: {
    ADD_MUTED_WORD: 'म्यूट केलेले शब्द सामील करा',
    HOME: 'होम',
    LATEST_TWEETS: 'अगदी अलीकडच्या ट्विट्स',
    QUOTE_TWEET: 'ट्विट वर भाष्य करा',
    QUOTE_TWEETS: 'भाष्य ट्विट्स',
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED_TWEETS: 'सामायिक ट्विट',
  },
  ms: {
    ADD_MUTED_WORD: 'Tambahkan perkataan yang disenyapkan',
    HOME: 'Laman Utama',
    LATEST_TWEETS: 'Tweet terkini',
    QUOTE_TWEET: 'Petik Tweet',
    QUOTE_TWEETS: 'Tweet Petikan',
    RETWEETS: 'Tweet semula',
    SHARED_TWEETS: 'Tweet Berkongsi',
  },
  nb: {
    ADD_MUTED_WORD: 'Skjul nytt ord',
    HOME: 'Hjem',
    LATEST_TWEETS: 'De nyeste tweetene',
    QUOTE_TWEET: 'Sitat-Tweet',
    QUOTE_TWEETS: 'Sitat-Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Delte tweets',
  },
  nl: {
    ADD_MUTED_WORD: 'Genegeerd woord toevoegen',
    HOME: 'Startpagina',
    LATEST_TWEETS: 'Nieuwste Tweets',
    QUOTE_TWEET: 'Citeer Tweet',
    QUOTE_TWEETS: 'Geciteerde Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Gedeelde Tweets',
  },
  pl: {
    ADD_MUTED_WORD: 'Dodaj wyciszone słowo',
    HOME: 'Główna',
    LATEST_TWEETS: 'Najnowsze Tweety',
    QUOTE_TWEET: 'Cytuj Tweeta',
    QUOTE_TWEETS: 'Cytatów z Tweeta',
    RETWEETS: 'Tweety podane dalej',
    SHARED_TWEETS: 'Udostępnione Tweety',
  },
  pt: {
    ADD_MUTED_WORD: 'Adicionar palavra silenciada',
    HOME: 'Página Inicial',
    LATEST_TWEETS: 'Tweets Mais Recentes',
    QUOTE_TWEET: 'Comentar o Tweet',
    QUOTE_TWEETS: 'Tweets com comentário',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Tweets Compartilhados',
  },
  ro: {
    ADD_MUTED_WORD: 'Adaugă cuvântul ignorat',
    HOME: 'Pagina principală',
    LATEST_TWEETS: 'Cele mai recente Tweeturi',
    QUOTE_TWEET: 'Tweet cu citat',
    QUOTE_TWEETS: 'Tweeturi cu citat',
    RETWEETS: 'Retweeturi',
    SHARED_TWEETS: 'Tweeturi partajate',
  },
  ru: {
    ADD_MUTED_WORD: 'Добавить игнорируемое слово',
    HOME: 'Главная',
    LATEST_TWEETS: 'Последние твиты',
    QUOTE_TWEET: 'Цитировать твит',
    QUOTE_TWEETS: 'Твиты с цитатами',
    RETWEETS: 'Ретвиты',
    SHARED_TWEETS: 'Общие твиты',
    TWITTER: 'Твиттер',
  },
  sk: {
    ADD_MUTED_WORD: 'Pridať stíšené slovo',
    HOME: 'Domov',
    LATEST_TWEETS: 'Najnovšie Tweety',
    QUOTE_TWEET: 'Tweet s citátom',
    QUOTE_TWEETS: 'Tweety s citátom',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Zdieľané Tweety',
  },
  sr: {
    ADD_MUTED_WORD: 'Додај игнорисану реч',
    HOME: 'Почетна',
    LATEST_TWEETS: 'Најновији твитови',
    QUOTE_TWEET: 'твит са цитатом',
    QUOTE_TWEETS: 'твит(ов)а са цитатом',
    RETWEETS: 'Ретвитови',
    SHARED_TWEETS: 'Дељени твитови',
    TWITTER: 'Твитер',
  },
  sv: {
    ADD_MUTED_WORD: 'Lägg till ignorerat ord',
    HOME: 'Hem',
    LATEST_TWEETS: 'Senaste tweetsen',
    QUOTE_TWEET: 'Citera Tweet',
    QUOTE_TWEETS: 'Citattweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Delade tweetsen',
  },
  ta: {
    ADD_MUTED_WORD: 'செயல்மறைத்த வார்த்தையைச் சேர்',
    HOME: 'முகப்பு',
    LATEST_TWEETS: 'சமீபத்திய கீச்சுகள்',
    QUOTE_TWEET: 'ட்விட்டை மேற்கோள் காட்டு',
    QUOTE_TWEETS: 'மேற்கோள் கீச்சுகள்',
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
  },
  th: {
    ADD_MUTED_WORD: 'เพิ่มคำที่ซ่อน',
    HOME: 'หน้าแรก',
    LATEST_TWEETS: 'ทวีตล่าสุด',
    QUOTE_TWEET: 'อ้างอิงทวีต',
    QUOTE_TWEETS: 'ทวีตและคำพูด',
    RETWEETS: 'รีทวีต',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    TWITTER: 'ทวิตเตอร์',
  },
  tr: {
    ADD_MUTED_WORD: 'Sessize alınacak kelime ekle',
    HOME: 'Anasayfa',
    LATEST_TWEETS: 'En Son Tweetler',
    QUOTE_TWEET: 'Alıntı Tweet',
    QUOTE_TWEETS: 'Alıntı Tweetler',
    RETWEETS: 'Retweetler',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
  },
  uk: {
    ADD_MUTED_WORD: 'Додати слово до списку ігнорування',
    HOME: 'Головна',
    LATEST_TWEETS: 'Найновіші твіти',
    QUOTE_TWEET: 'Цитувати твіт',
    QUOTE_TWEETS: 'Твіти з цитатою',
    RETWEETS: 'Ретвіти',
    SHARED_TWEETS: 'Спільні твіти',
    TWITTER: 'Твіттер',
  },
  ur: {
    ADD_MUTED_WORD: 'خاموش کردہ لفظ شامل کریں',
    HOME: 'سرورق',
    LATEST_TWEETS: 'جدید ترین ٹویٹ',
    QUOTE_TWEET: 'ٹویٹ اقتباس کریں',
    QUOTE_TWEETS: 'ٹویٹ کو نقل کرو',
    RETWEETS: 'ریٹویٹس',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
    TWITTER: 'ٹوئٹر',
  },
  vi: {
    ADD_MUTED_WORD: 'Thêm từ tắt tiếng',
    HOME: 'Trang chủ',
    LATEST_TWEETS: 'Tweet mới nhất',
    QUOTE_TWEET: 'Trích dẫn Tweet',
    QUOTE_TWEETS: 'Tweet trích dẫn',
    RETWEETS: 'Các Tweet lại',
    SHARED_TWEETS: 'Tweet được chia sẻ',
  },
  'zh-Hant': {
    ADD_MUTED_WORD: '加入靜音文字',
    HOME: '首頁',
    LATEST_TWEETS: '最新推文',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用的推文',
    RETWEETS: '轉推',
    SHARED_TWEETS: '分享的推文',
  },
  zh: {
    ADD_MUTED_WORD: '添加要隐藏的字词',
    HOME: '主页',
    LATEST_TWEETS: '最新推文',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用推文',
    RETWEETS: '转推',
    SHARED_TWEETS: '分享的推文',
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
  MESSAGES_DRAWER: 'div[data-testid="DMDrawer"]',
  NAV_HOME_LINK: 'a[data-testid="AppTabBar_Home_Link"]',
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV_DESKTOP: 'header nav',
  PRIMARY_NAV_MOBILE: '#layers nav',
  PROMOTED_TWEET_CONTAINER: '[data-testid="placementTracking"]',
  SIDEBAR: 'div[data-testid="sidebarColumn"]',
  SIDEBAR_WRAPPERS: 'div[data-testid="sidebarColumn"] > div > div > div > div > div',
  TIMELINE: 'div[data-testid="primaryColumn"] section > h1 + div[aria-label] > div',
  TIMELINE_HEADING: 'h2[role="heading"]',
  TWEET: 'div[data-testid="tweet"]',
  VERIFIED_TICK: 'svg path[d^="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47"]',
}

/** @enum {string} */
const Svgs = {
  HOME: '<g><path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path><path d="M8.22 12.184c0 2.084 1.695 3.78 3.78 3.78s3.78-1.696 3.78-3.78-1.695-3.78-3.78-3.78-3.78 1.696-3.78 3.78zm6.06 0c0 1.258-1.022 2.28-2.28 2.28s-2.28-1.022-2.28-2.28 1.022-2.28 2.28-2.28 2.28 1.022 2.28 2.28z"></path></g>',
  MUTE: '<g><path d="M1.75 22.354c-.192 0-.384-.073-.53-.22-.293-.293-.293-.768 0-1.06L20.395 1.898c.293-.294.768-.294 1.06 0s.294.767 0 1.06L2.28 22.135c-.146.146-.338.22-.53.22zm1.716-5.577c-.134 0-.27-.036-.392-.11-.67-.413-1.07-1.13-1.07-1.917v-5.5c0-1.24 1.01-2.25 2.25-2.25H6.74l7.047-5.588c.225-.18.533-.215.792-.087.258.125.423.387.423.675v3.28c0 .415-.336.75-.75.75s-.75-.335-.75-.75V3.553L7.47 8.338c-.134.104-.298.162-.467.162h-2.75c-.413 0-.75.337-.75.75v5.5c0 .263.134.5.356.64.353.216.462.678.245 1.03-.14.23-.387.357-.64.357zm10.787 5.973c-.166 0-.33-.055-.466-.162l-4.795-3.803c-.325-.258-.38-.73-.122-1.054.258-.322.73-.38 1.054-.12l3.58 2.838v-7.013c0-.414.335-.75.75-.75s.75.336.75.75V22c0 .288-.166.55-.425.675-.104.05-.216.075-.327.075z"></path></g>',
  RETWEET: '<g><path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path></g>',
}

const MOBILE_LOGGED_OUT_URLS = ['/', '/login', '/i/flow/signup']
const PROFILE_FOLLOWS_URL_RE = /\/[a-zA-Z\d_]{1,15}\/(following|followers|followers_you_follow)\/?$/
const PROFILE_TABS_URL_RE = /\/[a-zA-Z\d_]{1,15}\/(with_replies|media|likes)\/?$/
// https://twitter.com/${user}'s title ends with (@${user})
const PROFILE_TITLE_RE = /\(@[a-zA-Z\d_]{1,15}\)$/
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
const URL_PHOTO_RE = /photo\/\d$/
const URL_TWEET_ID_RE = /\/status\/(\d+)$/

/** `true` when a 'Block @${user}' menu item was seen in the last popup. */
let blockMenuItemSeen = false

/** `'Home'` or `'Latest Tweets'` page title. */
let currentMainTimelineType = ''

/** Notification count in the title (including trailing space), e.g. `'(1) '`. */
let currentNotificationCount = ''

/** Title of the current page, without the `' / Twitter'` suffix. */
let currentPage = ''

/** Current `location.pathname`. */
let currentPath = ''

/** Set to `true` when a Home/Latest Tweets heading or Home nav link is used. */
let homeNavigationIsBeingUsed = false

/**
 * Cache for the last page title which was used for the main timeline.
 * @type {string}
 */
let lastMainTimelineTitle = null

/** `true` when `<title>` has appeared and we're observing it for changes. */
let observingTitle = false

/**
 * MutationObservers active on the current page, or anything else we want to
 * clean up when the user moves off the current page.
 * @type {(MutationObserver|{disconnect(): void})[]}
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

function isOnExplorePage() {
  return currentPath.startsWith('/explore')
}

function isOnHomeTimeline() {
  return currentPage == getString('HOME')
}

function isOnIndividualTweetPage() {
  return URL_TWEET_ID_RE.test(currentPath)
}

function isOnLatestTweetsTimeline() {
  return currentPage == getString('LATEST_TWEETS')
}

function isOnListsPage() {
  return currentPath.endsWith('/lists') || currentPath.startsWith('/i/lists')
}

function isOnMainTimelinePage() {
  return currentPath == PagePaths.HOME || (
    currentPath == PagePaths.CUSTOMIZE_YOUR_VIEW &&
    isOnHomeTimeline() ||
    isOnLatestTweetsTimeline() ||
    isOnSeparatedTweetsTimeline()
  )
}

function isOnNotificationsPage() {
  return currentPath.startsWith('/notifications')
}

function isOnProfilePage() {
  return PROFILE_TITLE_RE.test(currentPage) && !PROFILE_FOLLOWS_URL_RE.test(currentPath)
}

function isOnQuoteTweetsPage() {
  return currentPath.endsWith('/retweets/with_comments')
}

function isOnSeparatedTweetsTimeline() {
  return currentPage == separatedTweetsTimelineTitle
}

function isOnTopicsPage() {
  return currentPath != '/topics' && Boolean(currentPath.match(/\/topics(\/|$)/))
}

function shouldHideSidebar() {
  return isOnExplorePage()
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
 * @param {string} selector
 * @param {{
 *   name?: string
 *   stopIf?: () => boolean
 *   timeout?: number
 *   context?: Document | HTMLElement
 * }} [options]
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
        log(`stopped waiting for ${name || selector} after ${reason}`)
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
  if (enableDebugLogging) {
    console.log(`🧨${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
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
 * @param {MutationObserverInit} options
 */
function observeElement($element, callback, options = {childList: true}) {
  let observer = new MutationObserver(callback)
  callback([], observer)
  observer.observe($element, options)
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
//#endregion

//#region Global observers
/**
 * When the "Background" setting is changed in "Customize your view", <body>'s
 * backgroundColor is changed and the app is re-rendered, so we need to
 * re-process the current page.
 */
function observeBackgroundColor() {
  let lastBackgroundColor = null

  log('observing body style attribute for backgroundColor changes')
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
  }, {
    attributes: true,
    attributeFilter: ['style']
  })
}

/**
 * When the "Color" setting is changed in "Customize your view", the app
 * re-renders from a certain point, so we need to re-process the current page.
 */
async function observeColor() {
  let $primaryColorRerenderBoundary = await getElement('#react-root > div > div')

  log('observing Color change re-renders')
  observeElement($primaryColorRerenderBoundary, async () => {
    let $tweetButton = await getElement('a[data-testid="SideNav_NewTweet_Button"]', {
      name: 'Tweet button'
    })
    let color = getComputedStyle($tweetButton).backgroundColor
    if (color == themeColor) return

    let themeColorChanged = themeColor != null

    themeColor = color
    configureThemeCss()

    if (themeColorChanged) {
      log('Color setting changed - re-processing current page')
      observePopups()
      processCurrentPage()
    }
  })
}

/**
 * When the "Font size" setting is changed in "Customize your view", `<html>`'s
 * fontSize is changed, after which we need to update nav font size accordingly.
 */
const observeFontSize = (function() {
  if (mobile) return () => {}

  /** @type {MutationObserver} */
  let fontSizeObserver
  let $style = addStyle('nav-font-size')

  return function observeFontSize() {
    if (fontSizeObserver) {
      log('disconnecting previous font size observer')
      fontSizeObserver.disconnect()
      fontSizeObserver = null
    }

    if (!config.navBaseFontSize) {
      $style.textContent = ''
      return
    }

    let lastFontSize = ''

    log('observing html style attribute for fontSize changes')
    fontSizeObserver = observeElement($html, () => {
      if ($html.style.fontSize) {
        if ($html.style.fontSize!= lastFontSize) {
          lastFontSize = $html.style.fontSize
          log(`setting nav font size to ${lastFontSize}`)
          $style.textContent = dedent(`
            ${Selectors.PRIMARY_NAV_DESKTOP} div[dir="auto"] span { font-size: ${lastFontSize}; font-weight: normal; }
            ${Selectors.PRIMARY_NAV_DESKTOP} div[dir="auto"] { margin-top: -4px; }
          `)
        }

        // Try to avoid excessive reprocessing on init
        if (observingTitle) {
          log('html style attribute changed, re-processing current page')
          observePopups()
          processCurrentPage()
        }
      }
    }, {
      attributes: true,
      attributeFilter: ['style']
    })
  }
})()

const observePopups = (function() {
  /** @type {MutationObserver} */
  let popupObserver
  /** @type {WeakMap<HTMLElement, MutationObserver>} */
  let nestedObservers = new WeakMap()

  return async function observePopups() {
    if (popupObserver) {
      popupObserver.disconnect()
      popupObserver = null
    }

    if (!(config.addAddMutedWordMenuItem || config.fastBlock)) return

    let $keyboardWrapper = await getElement('[data-at-shortcutkeys]', {
      name: 'keyboard wrapper',
    })

    // There can be only one
    if (popupObserver) {
      popupObserver.disconnect()
    }

    log(`${popupObserver ? 're-' : ''}observing popups`)
    popupObserver = observeElement($keyboardWrapper.previousElementSibling, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          let observer = onPopup($el)
          if (observer) {
            nestedObservers.set($el, observer)
          }
        })
        mutation.removedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          if (nestedObservers.has($el)) {
            nestedObservers.get($el).disconnect()
            nestedObservers.delete($el)
          }
        })
      })
    })
  }
})()

async function observeTitle() {
  let $title = await getElement('title', {name: '<title>'})
  observingTitle = true
  log('observing <title>')
  observeElement($title, () => onTitleChange($title.textContent))
}
//#endregion

//#region Page observers
async function observeTimeline(page) {
  let $timeline = await getElement(Selectors.TIMELINE, {
    name: 'timeline',
    stopIf: pageIsNot(page),
  })

  if ($timeline == null) return

  // The inital timeline element is a placeholder without a style attribute
  if ($timeline.hasAttribute('style')) {
    log('observing timeline', {$timeline})
    pageObservers.push(
      observeElement($timeline, () => onTimelineChange($timeline, page))
    )
  }
  else {
    log('waiting for timeline')
    let startTime = Date.now()
    pageObservers.push(
      observeElement($timeline.parentNode, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(($timeline) => {
            if (Date.now() > startTime) {
              log(`timeline appeared after ${Date.now() - startTime}ms`)
            }
            log('observing timeline', {$timeline})
            pageObservers.push(
              observeElement($timeline, () => onTimelineChange($timeline, page))
            )
          })
        })
      })
    )
  }
}
//#endregion

//#region Tweak functions
/**
 * Add an "Add muted word" menu item after "Settings and privacy" which takes
 * you straight to entering a new muted word (by clicking its way through all
 * the individual screens!).
 * @param {HTMLElement} $settingsLink
 */
async function addAddMutedWordMenuItem($settingsLink) {
  log('adding "Add muted word" menu item')
  let $addMutedWord = /** @type {HTMLElement} */ ($settingsLink.parentElement.cloneNode(true))
  $addMutedWord.classList.add('tnt_menu_item')
  $addMutedWord.querySelector('a').href = PagePaths.ADD_MUTED_WORD
  $addMutedWord.querySelector('span').textContent = getString('ADD_MUTED_WORD')
  $addMutedWord.querySelector('svg').innerHTML = Svgs.MUTE
  $addMutedWord.addEventListener('click', (e) => {
    e.preventDefault()
    addMutedWord()
  })
  $settingsLink.parentElement.insertAdjacentElement('afterend', $addMutedWord)
}

async function addMutedWord() {
  for (let path of [
    '/settings',
    '/settings/privacy_and_safety',
    '/settings/mute_and_block',
    '/settings/muted_keywords',
    '/settings/add_muted_keyword',
  ]) {
    let $link = await getElement(`a[href="${path}"]`)
    if (!$link) return
    $link.click()
  }
  let $input = await getElement('input[name="keyword"]')
  setTimeout(() => $input.focus(), 100)
}

async function addSeparatedTweetsTimelineControl(page) {
  if (desktop) {
    let $timelineTitle = await getElement('main h2', {
      name: 'timeline title',
      stopIf: pageIsNot(page),
    })

    if ($timelineTitle == null) return

    let $newHeading = document.querySelector('#tnt_separated_tweets')
    if ($newHeading) {
      log('separated tweets timeline heading already present')
      $newHeading.querySelector('span').textContent = separatedTweetsTimelineTitle
      return
    }

    log('inserting separated tweets timeline heading')
    $newHeading = /** @type {HTMLElement} */ ($timelineTitle.parentElement.cloneNode(true))
    $newHeading.querySelector('h2').id = 'tnt_separated_tweets'
    $newHeading.querySelector('span').textContent = separatedTweetsTimelineTitle

    // This script assumes navigation has occurred when the document title
    // changes, so by changing the title we fake navigation to a non-existent
    // page representing the separated tweets timeline.
    $newHeading.addEventListener('click', () => {
      if (!document.title.startsWith(separatedTweetsTimelineTitle)) {
        setTitle(separatedTweetsTimelineTitle)
      }
      window.scrollTo({top: 0})
    })
    $timelineTitle.parentElement.parentElement.insertAdjacentElement('afterend', $newHeading)

    // Return to the main timeline when Latest Tweets / Home heading is clicked
    $timelineTitle.parentElement.addEventListener('click', () => {
      if (!document.title.startsWith(currentMainTimelineType)) {
        homeNavigationIsBeingUsed = true
        setTitle(currentMainTimelineType)
      }
    })

    // Return to the main timeline when the Home nav link is clicked
    let $homeNavLink = /** @type {HTMLElement} */ (document.querySelector(Selectors.NAV_HOME_LINK))
    if (!$homeNavLink.dataset.tweakNewTwitterListener) {
      $homeNavLink.addEventListener('click', () => {
        homeNavigationIsBeingUsed = true
        if (location.pathname == '/home' && !document.title.startsWith(currentMainTimelineType)) {
          setTitle(currentMainTimelineType)
        }
      })
      $homeNavLink.dataset.tweakNewTwitterListener = 'true'
    }
  }

  if (mobile) {
    let $timelineTitle = await getElement('header h2', {
      name: 'timeline title',
      stopIf: pageIsNot(page),
    })

    if ($timelineTitle == null) return

    // We hide the existing timeline title via CSS when it's not wanted instead
    // of changing its text, as those changes persist when you view a tweet.
    $timelineTitle.classList.add('tnt_home_timeline_title')
    removeMobileTimelineHeaderElements()

    log('inserting separated tweets timeline switcher')

    let $toggle = document.createElement('div')
    $toggle.id = 'tnt_switch_timeline'
    let toggleColor = getComputedStyle(document.querySelector(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"] svg`)).color
    $toggle.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" style="color: ${toggleColor}; width: 22px; vertical-align: text-bottom; position: relative; max-width: 100%; height: 22px; fill: currentcolor; display: inline-block;">
      ${page == separatedTweetsTimelineTitle ? Svgs.HOME : Svgs.RETWEET}
    </svg>`
    $toggle.style.cursor = 'pointer'
    $toggle.title = `Switch to ${page == currentMainTimelineType ? separatedTweetsTimelineTitle : currentMainTimelineType}`
    $toggle.addEventListener('click', () => {
      let newTitle = page == separatedTweetsTimelineTitle ? currentMainTimelineType : separatedTweetsTimelineTitle
      setTitle(newTitle)
      $toggle.title = `Switch to ${newTitle == currentMainTimelineType ? separatedTweetsTimelineTitle : currentMainTimelineType}`
      window.scrollTo({top: 0})
    })
    $timelineTitle.insertAdjacentElement('afterend', $toggle)
    if (page == separatedTweetsTimelineTitle) {
      let $sharedTweetsTitle = /** @type {HTMLElement} */ ($timelineTitle.cloneNode(true))
      $sharedTweetsTitle.querySelector('span').textContent = separatedTweetsTimelineTitle
      $sharedTweetsTitle.id = 'tnt_shared_tweets_timeline_title'
      $sharedTweetsTitle.classList.remove('tnt_home_timeline_title')
      $timelineTitle.insertAdjacentElement('afterend', $sharedTweetsTitle)
    }
    $timelineTitle.parentElement.classList.add('tnt_mobile_header')

    // Go back to the main timeline when the Home bottom nav link is clicked on
    // the shared tweets timeline.
    let $homeBottomNavItem = /** @type {HTMLElement} */ (document.querySelector(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`))
    if (!$homeBottomNavItem.dataset.tweakNewTwitterListener) {
      $homeBottomNavItem.addEventListener('click', () => {
        if (location.pathname == '/home' && currentPage == separatedTweetsTimelineTitle) {
          setTitle(currentMainTimelineType)
        }
      })
      $homeBottomNavItem.dataset.tweakNewTwitterListener = 'true'
    }
  }
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

const configureCss = (function() {
  let $style = addStyle('features')

  return function configureCss() {
    let cssRules = []
    let hideCssSelectors = []

    if (config.alwaysUseLatestTweets) {
      hideCssSelectors.push(mobile
        ? 'body.MainTimeline header div:nth-of-type(3)'
        : `body.MainTimeline ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type > div > div > div > div > div > div:last-of-type`
      )
    }
    if (config.hideAnalyticsNav) {
      hideCssSelectors.push('div[role="dialog"] a[href*="analytics.twitter.com"]')
    }
    if (config.hideBookmarksNav) {
      hideCssSelectors.push('div[role="dialog"] a[href$="/bookmarks"]')
    }
    if (config.hideShareTweetButton) {
      hideCssSelectors.push(
        // Under timeline-style tweets
        '[data-testid="tweet"] [role="group"] > div:nth-of-type(4)',
        // Under individual tweets
        'body.Tweet [data-testid="tweet"] + div > div > [role="group"] > div:nth-of-type(4)',
      )
    }
    if (config.hideListsNav) {
      hideCssSelectors.push('div[role="dialog"] a[href$="/lists"]')
    }
    if (config.hideMetrics) {
      hideCssSelectors.push(
        // User profile hover card and page metrics
        ':is(#layers, body.Profile) a:is([href$="/following"], [href$="/followers"]) > :first-child',
        // Individual tweet metrics
        'body.Tweet a:is([href$="/retweets"], [href$="/retweets/with_comments"], [href$="/likes"]) > :first-child',
      )
      cssRules.push(
        // Metrics under timeline-style tweets
        '[data-testid="tweet"] [role="group"] span:only-child { visibility: hidden; }',
        // Fix display of whitespace after hidden metrics
        `
          body.Tweet a:is([href$="/retweets"], [href$="/retweets/with_comments"], [href$="/likes"]),
          :is(#layers, body.Profile) a:is([href$="/following"], [href$="/followers"]) {
            white-space: pre-line;
          }
        `,
      )
    }
    if (config.hideMomentsNav) {
      hideCssSelectors.push('div[role="dialog"] a[href$="/moment_maker"]')
    }
    if (config.hideNewslettersNav) {
      hideCssSelectors.push('div[role="dialog"] a[href$="/newsletters"]')
    }
    if (config.hideTopicsNav) {
      hideCssSelectors.push('div[role="dialog"] a[href$="/topics"]')
    }
    if (config.hideTweetAnalyticsLinks) {
      hideCssSelectors.push(
        // Under timeline-style tweets
        '[data-testid="tweet"] [role="group"] > div:nth-of-type(5)',
        // Under individual tweets
        '[data-testid="analyticsButton"]',
      )
    }
    if (config.hideTwitterAdsNav) {
      hideCssSelectors.push('div[role="dialog"] a[href*="ads.twitter.com"]')
    }
    if (config.hideWhoToFollowEtc) {
      hideCssSelectors.push(`body.Profile ${Selectors.PRIMARY_COLUMN} aside[role="complementary"]`)
    }
    if (config.reducedInteractionMode) {
      hideCssSelectors.push(
        '[data-testid="tweet"] [role="group"]',
        'body.Tweet a:is([href$="/retweets"], [href$="/likes"])',
        'body.Tweet [data-testid="tweet"] + div > [role="group"]',
      )
    }
    if (config.tweakQuoteTweetsPage) {
      // Hide the quoted tweet, which is repeated in every quote tweet
      hideCssSelectors.push('body.QuoteTweets [data-testid="tweet"] [aria-labelledby] > div:last-child')
    }

    if (desktop) {
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/home"]`)
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
      if (config.addAddMutedWordMenuItem) {
        // Hover colors for custom menu items
        cssRules.push(`
          body.Default .tnt_menu_item a:hover { background-color: rgb(247, 249, 249); }
          body.Dim .tnt_menu_item a:hover { background-color: rgb(25, 39, 52); }
          body.LightsOut .tnt_menu_item a:hover { background-color: rgb(21, 24, 28); }
        `)
      }
      if (config.hideSidebarContent) {
        // Only show the first sidebar item by default
        // Re-show subsesquent non-algorithmic sections on specific pages
        cssRules.push(`
          ${Selectors.SIDEBAR_WRAPPERS} > div:not(:first-of-type) {
            display: none;
          }
          body.Profile:not(.Blocked) ${Selectors.SIDEBAR_WRAPPERS} > div:is(:nth-of-type(2), :nth-of-type(3)) {
            display: block;
          }
        `)
        hideCssSelectors.push(`body.HideSidebar ${Selectors.SIDEBAR}`)
      }
      if (config.hideExploreNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`)
      }
      if (config.hideBookmarksNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/bookmarks"]`)
      }
      if (config.hideListsNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href*="/lists"]`)
      }
      if (config.hideMessagesDrawer) {
        hideCssSelectors.push(Selectors.MESSAGES_DRAWER)
      }
      if (config.hideMetrics) {
        hideCssSelectors.push(
          // Tweet count under username header on profile pages
          `body.Profile ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 + div[dir="auto"]`,
        )
      }
      if (config.retweets != 'separate' && config.quoteTweets != 'separate') {
        hideCssSelectors.push('#tnt_separated_tweets')
      }
      if (!config.tweakQuoteTweetsPage) {
        hideCssSelectors.push('#tnt_pinned_quoted_tweet')
      }
    }

    if (mobile) {
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`)
      }
      if (config.hideAnalyticsNav && config.hideTwitterAdsNav) {
        // XXX Quick but brittle way to hide the divider above these items
        hideCssSelectors.push('div[role="dialog"] div:nth-of-type(8)[role="separator"]')
      }
      if (config.hideAppNags) {
        cssRules.push(`
          body.Tweet header div:nth-of-type(3) > [role="button"] {
            visibility: hidden;
          }
        `)
        hideCssSelectors.push('.HideAppNags #layers > div')
      }
      if (config.hideExplorePageContents) {
        // Hide explore page contents so we don't get a brief flash of them
        // before automatically switching the page to search mode.
        hideCssSelectors.push(
          'body.Explore header nav',
          'body.Explore main',
        )
      }
      if (config.hideMessagesBottomNavItem) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/messages"]`)
      }
      if (config.hideMetrics) {
        hideCssSelectors.push(
          // Tweet count under username header on profile pages
          `body.Profile header > div > div:first-of-type h2 + div[dir="auto"]`,
        )
      }
      if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
        // Use CSS to tweak layout of mobile header elements on pages where it's
        // needed, as changes made directly to them can persist across pages.
        cssRules.push(`
          body.Home .tnt_mobile_header,
          body.LatestTweets .tnt_mobile_header,
          body.SeparatedTweets .tnt_mobile_header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        `)
        hideCssSelectors.push('body.SeparatedTweets .tnt_home_timeline_title')
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
      setTitle(currentMainTimelineType)
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

const configureThemeCss = (function() {
  if (mobile) return () => {}

  let $style = addStyle('theme')

  return function configureThemeCss() {
    let cssRules = []

    if (themeColor != null && (config.retweets == 'separate' || config.quoteTweets == 'separate')) {
      cssRules.push(`
        body.Home main h2:not(#tnt_separated_tweets),
        body.LatestTweets main h2:not(#tnt_separated_tweets),
        body.SeparatedTweets #tnt_separated_tweets {
          color: ${themeColor};
        }
      `)
    }

    $style.textContent = cssRules.map(dedent).join('\n')
  }
})()

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
  if ($tweet.previousElementSibling?.querySelector('[data-testid="socialContext"]')) {
    if (!config.alwaysUseLatestTweets && currentMainTimelineType == getString('HOME')) {
      let svgPath = $tweet.previousElementSibling.querySelector('svg path')?.getAttribute('d') ?? ''
      if (svgPath.startsWith('M12 21.638h-.014C9.403 21.5')) return 'LIKED'
      if (svgPath.startsWith('M14.046 2.242l-4.148-.01h-.')) return 'REPLIED'
      if (svgPath.startsWith('M18.265 3.314c-3.45-3.45-9.')) return 'SUGGESTED_TOPIC_TWEET'
      // This is the start of the SVG path for the Retweet icon
      if (!svgPath.startsWith('M23.615 15.477c-.47-.47-1.23')) {
        log('unhandled socialContext tweet type - falling back to RETWEET', $tweet)
      }
    }
    // Quoted tweets from accounts you blocked or muted are displayed as an
    // <article> with "This Tweet is unavailable."
    if ($tweet.querySelector('article')) {
      return 'UNAVAILABLE_RETWEET'
    }
    return 'RETWEET'
  }
  // Quoted tweets are preceded by visually-hidden "Quote Tweet" text
  if ($tweet.querySelector('div[id^="id__"] > div[dir="auto"] > span')?.textContent.includes(getString('QUOTE_TWEET'))) {
    return 'QUOTE_TWEET'
  }
  // Quoted tweets from accounts you blocked or muted are displayed as an
  // <article> with "This Tweet is unavailable."
  if ($tweet.querySelector('article')) {
    return 'UNAVAILABLE_QUOTE_TWEET'
  }
  return 'TWEET'
}

/**
 * @param {HTMLElement} $popup
 * @returns {boolean} false if there was nothing actionable in the popup
 */
function handlePopup($popup) {
  if (config.fastBlock) {
    if (blockMenuItemSeen && $popup.querySelector('[data-testid="confirmationSheetConfirm"]')) {
      log('fast blocking')
      ;/** @type {HTMLElement} */ ($popup.querySelector('[data-testid="confirmationSheetConfirm"]')).click()
      return true
    }
    else if ($popup.querySelector('[data-testid="block"]')) {
      log('preparing for fast blocking')
      blockMenuItemSeen = true
      // Create a nested observer for mobile, as it reuses the popup element
      return !mobile
    } else {
      blockMenuItemSeen = false
    }
  }

  if (config.addAddMutedWordMenuItem) {
    let $settingsLink = /** @type {HTMLElement} */ ($popup.querySelector('a[href="/settings"]'))
    if ($settingsLink) {
      addAddMutedWordMenuItem($settingsLink)
      return true
    }
  }

  return false
}

/**
 * Automatically click a tweet to get rid of the "More Tweets" section.
 */
async function hideMoreTweetsSection(path) {
  let id = URL_TWEET_ID_RE.exec(path)[1]
  let $link = await getElement(`a[href$="/status/${id}"]`, {
    name: 'tweet',
    stopIf: pathIsNot(path),
  })
  if ($link) {
    log('clicking "Show this thread" link')
    $link.click()
  }
}

/**
 * Checks if a tweet is preceded by an element creating a vertical reply line.
 * @param {HTMLElement} $tweet
 * @returns {boolean}
 */
function isReplyToPreviousTweet($tweet) {
  let $replyLine = $tweet.previousElementSibling?.firstElementChild?.firstElementChild?.firstElementChild
  if ($replyLine) {
    return getComputedStyle($replyLine).width == '2px'
  }
}

/**
 * @returns {MutationObserver | undefined}
 */
function onPopup($popup) {
  log('popup appeared', $popup)

  if (handlePopup($popup)) return

  log('observing nested popups')
  return observeElement($popup, (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((/** @type {HTMLElement} */ $nestedPopup) => {
        log('nested popup appeared', $nestedPopup)
        handlePopup($nestedPopup)
      })
    })
  })
}

function onTimelineChange($timeline, page) {
  log(`processing ${$timeline.children.length} timeline item${s($timeline.children.length)}`)

  /** @type {HTMLElement} */
  let $previousItem = null
  /** @type {?import("./types").TimelineItemType} */
  let previousItemType = null
  /** @type {?boolean} */
  let hidPreviousItem = null

  for (let $item of $timeline.children) {
    /** @type {?import("./types").TimelineItemType} */
    let itemType = null
    /** @type {?boolean} */
    let hideItem = null
    /** @type {?boolean} */
    let highlightItem = null
    /** @type {?HTMLElement} */
    let $tweet = $item.querySelector(Selectors.TWEET)

    if ($tweet != null) {
      itemType = getTweetType($tweet)
      // Only deal with retweets, quote tweets and algorithmic tweets on the
      // main timeline.
      if (isOnMainTimelinePage()) {
        if (isReplyToPreviousTweet($tweet) && hidPreviousItem != null) {
          hideItem = hidPreviousItem
          itemType = previousItemType
        } else {
          hideItem = shouldHideMainTimelineItem(itemType, page)
        }
      }
    }

    if (itemType == null && config.hideWhoToFollowEtc) {
      // "Who to follow", "Follow some Topics" etc. headings
      if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        hideItem = true
        // Also hide the divider above the heading
        if ($previousItem?.innerText == '' && $previousItem.firstElementChild) {
          /** @type {HTMLElement} */ ($previousItem.firstElementChild).style.display = 'none'
        }
      }
    }

    if (itemType == null) {
      // Assume a non-identified item following an identified item is related.
      // "Who to follow" users and "Follow some Topics" topics appear in
      // subsequent items, as do "Show this thread" and "Show more" links.
      if (previousItemType != null) {
        hideItem = hidPreviousItem
        itemType = previousItemType
      }
      // The first item in the timeline is sometimes an empty placeholder <div>
      else if ($item !== $timeline.firstElementChild && hideItem == null) {
        // We're probably also missing some spacer / divider nodes
        log('unhandled timeline item', $item)
      }
    }

    if ($tweet?.querySelector(Selectors.VERIFIED_TICK)) {
      if (hideItem !== true) {
        hideItem = config.verifiedAccounts == 'hide'
      }
      highlightItem = config.verifiedAccounts == 'highlight'
    }

    if (hideItem != null) {
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.display != (hideItem ? 'none' : '')) {
        /** @type {HTMLElement} */ ($item.firstElementChild).style.display = hideItem ? 'none' : ''
        // Log these out as they can't be reliably triggered for testing
        if (itemType == 'HEADING' || previousItemType == 'HEADING') {
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
}

function onTitleChange(title) {
  log('title changed', {title: title.split(ltr ? ' / ' : ' \\ ')[ltr ? 0 : 1], path: location.pathname})

  if (checkforDisabledHomeTimeline()) return

  // Ignore leading notification counts in titles, e.g. '(1) Latest Tweets'
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
      (newPage == getString('LATEST_TWEETS') || newPage == getString('HOME')) &&
      // …the Home nav link or Latest Tweets / Home header _wasn't_ clicked and…
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

  if (isOnLatestTweetsTimeline() || isOnHomeTimeline()) {
    currentMainTimelineType = currentPage
  }
  if (isOnMainTimelinePage()) {
    lastMainTimelineTitle = currentPage
  }

  log('processing new page')

  processCurrentPage()
}

function processCurrentPage() {
  if (pageObservers.length > 0) {
    log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
    pageObservers.forEach(observer => observer.disconnect())
    pageObservers = []
  }

  if (config.alwaysUseLatestTweets && currentPage == getString('HOME')) {
    switchToLatestTweets(currentPage)
    return
  }

  // Hooks for styling pages
  $body.classList.toggle('Explore', isOnExplorePage())
  $body.classList.toggle('HideAppNags', (
    mobile && config.hideAppNags && MOBILE_LOGGED_OUT_URLS.includes(currentPath))
  )
  $body.classList.toggle('HideSidebar', shouldHideSidebar())
  $body.classList.toggle('MainTimeline', isOnMainTimelinePage())
  $body.classList.toggle('Profile', isOnProfilePage())
  if (!isOnProfilePage()) {
    $body.classList.remove('Blocked')
  }
  $body.classList.toggle('QuoteTweets', isOnQuoteTweetsPage())
  $body.classList.toggle('Tweet', isOnIndividualTweetPage())

  // "Which version of the main timeline are we on?" hooks for styling
  $body.classList.toggle('Home', isOnHomeTimeline())
  $body.classList.toggle('LatestTweets', isOnLatestTweetsTimeline())
  $body.classList.toggle('SeparatedTweets', isOnSeparatedTweetsTimeline())

  if (isOnMainTimelinePage()) {
    if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
      addSeparatedTweetsTimelineControl(currentPage)
    } else if (mobile) {
      removeMobileTimelineHeaderElements()
    }
    observeTimeline(currentPage)
  } else if (mobile) {
    removeMobileTimelineHeaderElements()
  }

  if (isOnProfilePage()) {
    observeTimeline(currentPage)
    if (config.hideSidebarContent) {
      tweakProfilePage(currentPage)
    }
  }

  if (isOnIndividualTweetPage()) {
    tweakIndividualTweetPage()
  }

  if (config.tweakQuoteTweetsPage && isOnQuoteTweetsPage()) {
    tweakQuoteTweetsPage()
  }

  if (mobile && config.hideExplorePageContents && isOnExplorePage()) {
    tweakExplorePage(currentPage)
  }
}

/**
 * The mobile version of Twitter reuses heading elements between screens, so we
 * always remove any elements which could be there from the previous page and
 * re-add them later when needed.
 */
function removeMobileTimelineHeaderElements() {
  if (mobile) {
    document.querySelector('#tnt_shared_tweets_timeline_title')?.remove()
    document.querySelector('#tnt_switch_timeline')?.remove()
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
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideMainTimelineItem(type, page) {
  switch (type) {
    case 'LIKED':
      return shouldHideAlgorithmicTweet(config.likedTweets, page)
    case 'QUOTE_TWEET':
      return shouldHideSharedTweet(config.quoteTweets, page)
    case 'REPLIED':
      return shouldHideAlgorithmicTweet(config.repliedToTweets, page)
    case 'RETWEET':
      return shouldHideSharedTweet(config.retweets, page)
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

async function switchToLatestTweets(page) {
  log('switching to Latest Tweets timeline')

  let contextSelector = mobile ? 'header div:nth-of-type(3)' : Selectors.PRIMARY_COLUMN
  let $switchButton = await getElement(`${contextSelector} [role="button"]`, {
    name: 'sparkle button',
    stopIf: pageIsNot(page),
  })
  if ($switchButton == null) return

  log('clicking sparkle button')
  $switchButton.click()

  let $seeLatestTweetsInstead = await getElement('div[role="menu"] div[role="menuitem"]', {
    name: '"See latest Tweets instead" menu item',
    stopIf: pageIsNot(page),
  })
  if ($seeLatestTweetsInstead == null) return

  log('clicking "See latest Tweets" instead menu item')
  $seeLatestTweetsInstead.click()
}

async function tweakExplorePage(page) {
  let $searchInput = await getElement('input[data-testid="SearchBox_Search_Input"]', {
    name: 'search input',
    stopIf: pageIsNot(page),
  })
  if (!$searchInput) return

  log('focusing search input')
  $searchInput.focus()

  let $backButton = await getElement('[role="button"]:not([data-testid="DashButton_ProfileIcon_Link"])', {
    context: $searchInput.closest('header'),
    name: 'back button',
    stopIf: pageIsNot(page),
  })
  if (!$backButton) return

  // The back button appears after the search input is focused. When you tap it
  // or go back manually, it's replaced with the slide-out menu button and the
  // Explore page contents are shown - we want to skip that.
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
    })
  )
}

async function tweakIndividualTweetPage() {
  if (config.hideMoreTweets) {
    let searchParams = new URLSearchParams(location.search)
    if (searchParams.has('ref_src') || searchParams.has('s')) {
      hideMoreTweetsSection(currentPath)
    }
  }
}

async function tweakProfilePage(currentPage) {
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

  log('observing Follow / Unblock button container for blocked status changes')
  pageObservers.push(
    observeElement($buttonContainer, () => {
      let isBlocked = (/** @type {HTMLElement} */ ($buttonContainer.querySelector('[role="button"]'))?.dataset.testid ?? '').endsWith('unblock')
      $body.classList.toggle('Blocked', isBlocked)
    })
  )
}

async function tweakQuoteTweetsPage() {
  if (desktop) {
    // Show the quoted tweet once in the pinned header instead
    let [$heading, $quotedTweet] = await Promise.all([
      getElement(`${Selectors.PRIMARY_COLUMN} ${Selectors.TIMELINE_HEADING}`, {
        name: 'Quote Tweets heading',
        stopIf: not(isOnQuoteTweetsPage)
      }),
      getElement('[data-testid="tweet"] [aria-labelledby] > div:last-child', {
        name: 'first quoted tweet',
        stopIf: not(isOnQuoteTweetsPage)
      })
    ])

    if ($heading != null && $quotedTweet != null) {
      if (document.querySelector('#tnt_pinned_quoted_tweet')) {
        log('pinned quoted tweet already present')
        return
      }

      log('pinning quoted tweet in the Quote Tweets header')
      do {
        $heading = $heading.parentElement
      } while (!$heading.nextElementSibling)

      let $clone = /** @type {HTMLElement} */ ($quotedTweet.cloneNode(true))
      $clone.id = 'tnt_pinned_quoted_tweet'
      $clone.style.margin = '0 16px 9px 16px'
      $heading.insertAdjacentElement('afterend', $clone)
    }
  }
}
//#endregion

//#region Main
function main() {
  log({config, lang, platform: mobile ? 'mobile' : 'desktop'})

  configureSeparatedTweetsTimelineTitle()
  configureCss()
  observeFontSize()
  observeBackgroundColor()
  observeColor()
  observePopups()

  observeTitle()
}

function configChanged(changes) {
  log('config changed', changes)

  configureCss()
  configureThemeCss()
  observeFontSize()
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

if (typeof GM == 'undefined' &&
    typeof chrome != 'undefined' &&
    typeof chrome.storage != 'undefined') {
  chrome.storage.local.get((storedConfig) => {
    Object.assign(config, storedConfig)
    main()
  })

  chrome.storage.onChanged.addListener((changes) => {
    let configChanges = Object.fromEntries(
      Object.entries(changes).map(([key, {newValue}]) => [key, newValue])
    )
    Object.assign(config, configChanges)
    configChanged(configChanges)
  })
}
else {
  main()
}
//#endregion
