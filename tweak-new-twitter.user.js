// ==UserScript==
// @name        Tweak New Twitter
// @description Remove algorithmic content from Twitter, hide news & trends, control which shared tweets appear on your timeline, and improve the UI
// @icon        https://raw.githubusercontent.com/insin/tweak-new-twitter/master/icons/icon32.png
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @version     73
// ==/UserScript==

let debug = false

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
  hideBookmarksNav: true,
  hideCommunitiesNav: true,
  hideExplorePageContents: true,
  hideHelpCenterNav: true,
  hideKeyboardShortcutsNav: false,
  hideListsNav: true,
  hideMomentsNav: true,
  hideMonetizationNav: true,
  hideMoreTweets: true,
  hideNewslettersNav: true,
  hideShareTweetButton: false,
  hideTopicsNav: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterAdsNav: true,
  hideTwitterBlueNav: true,
  hideTwitterCircleNav: true,
  hideTwitterForProfessionalsNav: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedNotificationsTab: true,
  hideWhoToFollowEtc: true,
  likedTweets: 'ignore',
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
  fullWidthMedia: false,
  hideMetrics: false,
  hideFollowingMetrics: true,
  hideLikeMetrics: true,
  hideQuoteTweetMetrics: true,
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideTotalTweetsMetrics: true,
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
    HOME: 'الرئيسيّة',
    LATEST_TWEETS: 'أحدث التغريدات',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TIMELINE_OPTIONS: 'خيارات اليوميات',
    TWITTER: 'تويتر',
  },
  ar: {
    ADD_MUTED_WORD: 'اضافة كلمة مكتومة',
    HOME: 'الرئيسيّة',
    LATEST_TWEETS: 'أحدث التغريدات',
    MUTE_THIS_CONVERSATION: 'كتم هذه المحادثه',
    QUOTE_TWEET: 'اقتباس التغريدة',
    QUOTE_TWEETS: 'تغريدات اقتباس',
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TIMELINE_OPTIONS: 'خيارات اليوميات',
    TWITTER: 'تويتر',
  },
  bg: {
    ADD_MUTED_WORD: 'Добавяне на заглушена дума',
    HOME: 'Начало',
    LATEST_TWEETS: 'Най-новите туитове',
    MUTE_THIS_CONVERSATION: 'Заглушаване на разговора',
    QUOTE_TWEET: 'Цитиране на туита',
    QUOTE_TWEETS: 'Туитове с цитат',
    RETWEETS: 'Ретуитове',
    SHARED_TWEETS: 'Споделени туитове',
    TIMELINE_OPTIONS: 'Опции за хрониката',
  },
  bn: {
    ADD_MUTED_WORD: 'নীরব করা শব্দ যোগ করুন',
    HOME: 'হোম',
    LATEST_TWEETS: 'সাম্প্রতিক টুইটগুলি',
    MUTE_THIS_CONVERSATION: 'এই কথা-বার্তা নীরব করুন',
    QUOTE_TWEET: 'টুইট উদ্ধৃত করুন',
    QUOTE_TWEETS: 'টুইট উদ্ধৃতিগুলো',
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
    TIMELINE_OPTIONS: 'সময়রেখার বিকল্প',
    TWITTER: 'টুইটার',
  },
  ca: {
    ADD_MUTED_WORD: 'Afegeix una paraula silenciada',
    HOME: 'Inici',
    LATEST_TWEETS: 'Tuits més recents',
    MUTE_THIS_CONVERSATION: 'Silencia la conversa',
    QUOTE_TWEET: 'Cita el tuit',
    QUOTE_TWEETS: 'Tuits amb cita',
    RETWEETS: 'Retuits',
    SHARED_TWEETS: 'Tuits compartits',
    TIMELINE_OPTIONS: 'Opcions de la cronologia',
  },
  cs: {
    ADD_MUTED_WORD: 'Přidat slovo na seznam skrytých slov',
    HOME: 'Hlavní stránka',
    LATEST_TWEETS: 'Nejnovější tweety',
    MUTE_THIS_CONVERSATION: 'Skrýt tuto konverzaci',
    QUOTE_TWEET: 'Citovat Tweet',
    QUOTE_TWEETS: 'Tweety s citací',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Sdílené tweety',
    TIMELINE_OPTIONS: 'Možnosti časové osy',
  },
  da: {
    ADD_MUTED_WORD: 'Tilføj skjult ord',
    HOME: 'Forside',
    LATEST_TWEETS: 'Seneste Tweets',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtale',
    QUOTE_TWEET: 'Citér Tweet',
    QUOTE_TWEETS: 'Citat-Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Delte tweets',
    TIMELINE_OPTIONS: 'Tidslinjeindstillinger',
  },
  de: {
    ADD_MUTED_WORD: 'Stummgeschaltetes Wort hinzufügen',
    HOME: 'Startseite',
    LATEST_TWEETS: 'Neueste Tweets',
    MUTE_THIS_CONVERSATION: 'Diese Unterhaltung stummschalten',
    QUOTE_TWEET: 'Tweet zitieren',
    QUOTE_TWEETS: 'Zitierte Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Geteilte Tweets',
    TIMELINE_OPTIONS: 'Timeline-Optionen',
  },
  el: {
    ADD_MUTED_WORD: 'Προσθήκη λέξης σε σίγαση',
    HOME: 'Αρχική σελίδα',
    LATEST_TWEETS: 'Τα πιο πρόσφατα Tweet',
    MUTE_THIS_CONVERSATION: 'Σίγαση αυτής της συζήτησης',
    QUOTE_TWEET: 'Παράθεση Tweet',
    QUOTE_TWEETS: 'Tweet με παράθεση',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
    TIMELINE_OPTIONS: 'Επιλογές χρονολογίου',
  },
  en: {
    ADD_MUTED_WORD: 'Add muted word',
    HOME: 'Home',
    LATEST_TWEETS: 'Latest Tweets',
    MUTE_THIS_CONVERSATION: 'Mute this conversation',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
    TIMELINE_OPTIONS: 'Timeline options',
    TWITTER: 'Twitter',
  },
  es: {
    ADD_MUTED_WORD: 'Añadir palabra silenciada',
    HOME: 'Inicio',
    LATEST_TWEETS: 'Tweets más recientes',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversación',
    QUOTE_TWEET: 'Citar Tweet',
    QUOTE_TWEETS: 'Tweets citados',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Tweets compartidos',
    TIMELINE_OPTIONS: 'Opciones de cronología',
  },
  eu: {
    ADD_MUTED_WORD: 'Gehitu isilarazitako hitza',
    HOME: 'Hasiera',
    LATEST_TWEETS: 'Azken txioak',
    MUTE_THIS_CONVERSATION: 'Isilarazi elkarrizketa hau',
    QUOTE_TWEET: 'Txioa apaitu',
    QUOTE_TWEETS: 'Aipatu txioak',
    RETWEETS: 'Bertxioak',
    SHARED_TWEETS: 'Partekatutako',
  },
  fa: {
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    HOME: 'خانه',
    LATEST_TWEETS: 'جدیدترین توییت‌ها',
    MUTE_THIS_CONVERSATION: 'خموش‌سازی این گفتگو',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت',
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
    TIMELINE_OPTIONS: 'گزینه‌های خط زمان',
    TWITTER: 'توییتر',
  },
  fi: {
    ADD_MUTED_WORD: 'Lisää hiljennetty sana',
    HOME: 'Etusivu',
    LATEST_TWEETS: 'Uusimmat twiitit',
    MUTE_THIS_CONVERSATION: 'Hiljennä tämä keskustelu',
    QUOTE_TWEET: 'Twiitin lainaus',
    QUOTE_TWEETS: 'Twiitin lainaukset',
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED_TWEETS: 'Jaetut twiitit',
    TIMELINE_OPTIONS: 'Aikajanavalinnat',
  },
  fil: {
    ADD_MUTED_WORD: 'Idagdag ang naka-mute na salita',
    HOME: 'Home',
    LATEST_TWEETS: 'Mga Pinakabagong Tweet',
    MUTE_THIS_CONVERSATION: 'I-mute ang usapang ito',
    QUOTE_TWEET: 'Quote na Tweet',
    QUOTE_TWEETS: 'Mga Quote na Tweet',
    RETWEETS: 'Mga Retweet',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
    TIMELINE_OPTIONS: 'Mga opsyon sa timeline',
  },
  fr: {
    ADD_MUTED_WORD: 'Ajouter un mot masqué',
    HOME: 'Accueil',
    LATEST_TWEETS: 'Tout derniers Tweets',
    MUTE_THIS_CONVERSATION: 'Masquer cette conversation',
    QUOTE_TWEET: 'Citer le Tweet',
    QUOTE_TWEETS: 'Tweets cités',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Tweets partagés',
    TIMELINE_OPTIONS: 'Options du fil',
  },
  ga: {
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    HOME: 'Baile',
    LATEST_TWEETS: 'Tweetanna is déanaí',
    MUTE_THIS_CONVERSATION: 'Balbhaigh an comhrá seo',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Luaigh Tvuíteanna',
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
  },
  gl: {
    ADD_MUTED_WORD: 'Engadir palabra silenciada',
    HOME: 'Inicio',
    LATEST_TWEETS: 'Últimos chíos',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    QUOTE_TWEET: 'Citar chío',
    QUOTE_TWEETS: 'Chíos citados',
    RETWEETS: 'Rechouchíos',
    SHARED_TWEETS: 'Chíos compartidos',
  },
  gu: {
    ADD_MUTED_WORD: 'જોડાણ અટકાવેલો શબ્દ ઉમેરો',
    HOME: 'હોમ',
    LATEST_TWEETS: 'તાજેતરની ટ્વીટ્સ',
    MUTE_THIS_CONVERSATION: 'આ વાર્તાલાપનું જોડાણ અટકાવો',
    QUOTE_TWEET: 'અવતરણની સાથે ટ્વીટ કરો',
    QUOTE_TWEETS: 'અવતરણની સાથે ટ્વીટ્સ',
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
    TIMELINE_OPTIONS: 'સમય અવધિના વિકલ્પો',
  },
  he: {
    ADD_MUTED_WORD: 'הוסף מילה מושתקת',
    HOME: 'דף הבית',
    LATEST_TWEETS: 'הציוצים האחרונים',
    MUTE_THIS_CONVERSATION: 'להשתיק את השיחה הזאת',
    QUOTE_TWEET: 'ציטוט ציוץ',
    QUOTE_TWEETS: 'ציוצי ציטוט',
    RETWEETS: 'ציוצים מחדש',
    SHARED_TWEETS: 'ציוצים משותפים',
    TIMELINE_OPTIONS: 'אפשרויות ציר זמן',
    TWITTER: 'טוויטר',
  },
  hi: {
    ADD_MUTED_WORD: 'म्यूट किया गया शब्द जोड़ें',
    HOME: 'होम',
    LATEST_TWEETS: 'नवीनतम ट्वीट्स',
    MUTE_THIS_CONVERSATION: 'इस बातचीत को म्यूट करें',
    QUOTE_TWEET: 'कोट ट्वीट',
    QUOTE_TWEETS: 'कोट ट्वीट्स',
    RETWEETS: 'रीट्वीट्स',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
    TIMELINE_OPTIONS: 'टाइमलाइन विकल्प',
  },
  hr: {
    ADD_MUTED_WORD: 'Dodaj onemogućenu riječ',
    HOME: 'Naslovnica',
    LATEST_TWEETS: 'Najnoviji tweetovi',
    MUTE_THIS_CONVERSATION: 'Isključi zvuk ovog razgovora',
    QUOTE_TWEET: 'Citiraj Tweet',
    QUOTE_TWEETS: 'Citirani tweetovi',
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
    TIMELINE_OPTIONS: 'Mogućnosti vremenske crte',
  },
  hu: {
    ADD_MUTED_WORD: 'Elnémított szó hozzáadása',
    HOME: 'Kezdőlap',
    LATEST_TWEETS: 'A legfrissebb Tweetek',
    MUTE_THIS_CONVERSATION: 'Beszélgetés némítása',
    QUOTE_TWEET: 'Tweet idézése',
    QUOTE_TWEETS: 'Tweet-idézések',
    RETWEETS: 'Retweetek',
    SHARED_TWEETS: 'Megosztott tweetek',
    TIMELINE_OPTIONS: 'Idővonal beállításai',
  },
  id: {
    ADD_MUTED_WORD: 'Tambahkan kata kunci yang dibisukan',
    HOME: 'Beranda',
    LATEST_TWEETS: 'Tweet Terbaru',
    MUTE_THIS_CONVERSATION: 'Bisukan percakapan ini',
    QUOTE_TWEET: 'Kutip Tweet',
    QUOTE_TWEETS: 'Kutip Tweet',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
    TIMELINE_OPTIONS: 'Pilihan Timeline',
  },
  it: {
    ADD_MUTED_WORD: 'Aggiungi parola o frase silenziata',
    HOME: 'Home',
    LATEST_TWEETS: 'Tweet più recenti',
    MUTE_THIS_CONVERSATION: 'Silenzia questa conversazione',
    QUOTE_TWEET: 'Cita il Tweet',
    QUOTE_TWEETS: 'Tweet di citazione',
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet condivisi',
    TIMELINE_OPTIONS: 'Opzioni cronologia',
  },
  ja: {
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    HOME: 'ホーム',
    LATEST_TWEETS: '最新ツイート',
    MUTE_THIS_CONVERSATION: 'この会話をミュート',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
    TIMELINE_OPTIONS: 'タイムラインオプション',
  },
  kn: {
    ADD_MUTED_WORD: 'ಸದ್ದಡಗಿಸಿದ ಪದವನ್ನು ಸೇರಿಸಿ',
    HOME: 'ಹೋಮ್',
    LATEST_TWEETS: 'ಇತ್ತೀಚಿನ ಟ್ವೀಟ್‌ಗಳು',
    MUTE_THIS_CONVERSATION: 'ಈ ಸಂವಾದವನ್ನು ಸದ್ದಡಗಿಸಿ',
    QUOTE_TWEET: 'ಟ್ವೀಟ್ ಕೋಟ್ ಮಾಡಿ',
    QUOTE_TWEETS: 'ಕೋಟ್ ಟ್ವೀಟ್‌ಗಳು',
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
    TIMELINE_OPTIONS: 'ಟೈಮ್‌ಲೈನ್ ಆಯ್ಕೆಗಳು',
  },
  ko: {
    ADD_MUTED_WORD: '뮤트할 단어 추가하기',
    HOME: '홈',
    LATEST_TWEETS: '최신 트윗',
    MUTE_THIS_CONVERSATION: '이 대화 뮤트하기',
    QUOTE_TWEET: '트윗 인용하기',
    QUOTE_TWEETS: '트윗 인용하기',
    RETWEETS: '리트윗',
    SHARED_TWEETS: '공유 트윗',
    TIMELINE_OPTIONS: '타임라인 옵션',
    TWITTER: '트위터',
  },
  mr: {
    ADD_MUTED_WORD: 'म्यूट केलेले शब्द सामील करा',
    HOME: 'होम',
    LATEST_TWEETS: 'अगदी अलीकडच्या ट्विट्स',
    MUTE_THIS_CONVERSATION: 'ही चर्चा म्यूट करा',
    QUOTE_TWEET: 'ट्विट वर भाष्य करा',
    QUOTE_TWEETS: 'भाष्य ट्विट्स',
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED_TWEETS: 'सामायिक ट्विट',
    TIMELINE_OPTIONS: 'टाइमलाइनचे पर्याय',
  },
  ms: {
    ADD_MUTED_WORD: 'Tambahkan perkataan yang disenyapkan',
    HOME: 'Laman Utama',
    LATEST_TWEETS: 'Tweet terkini',
    MUTE_THIS_CONVERSATION: 'Senyapkan perbualan ini',
    QUOTE_TWEET: 'Petik Tweet',
    QUOTE_TWEETS: 'Tweet Petikan',
    RETWEETS: 'Tweet semula',
    SHARED_TWEETS: 'Tweet Berkongsi',
    TIMELINE_OPTIONS: 'Pilihan Garis Masa',
  },
  nb: {
    ADD_MUTED_WORD: 'Skjul nytt ord',
    HOME: 'Hjem',
    LATEST_TWEETS: 'De nyeste tweetene',
    MUTE_THIS_CONVERSATION: 'Skjul denne samtalen',
    QUOTE_TWEET: 'Sitat-Tweet',
    QUOTE_TWEETS: 'Sitat-Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Delte tweets',
    TIMELINE_OPTIONS: 'Alternativer for tidslinjen',
  },
  nl: {
    ADD_MUTED_WORD: 'Genegeerd woord toevoegen',
    HOME: 'Startpagina',
    LATEST_TWEETS: 'Nieuwste Tweets',
    MUTE_THIS_CONVERSATION: 'Dit gesprek negeren',
    QUOTE_TWEET: 'Citeer Tweet',
    QUOTE_TWEETS: 'Geciteerde Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Gedeelde Tweets',
    TIMELINE_OPTIONS: 'Tijdlijn-opties',
  },
  pl: {
    ADD_MUTED_WORD: 'Dodaj wyciszone słowo',
    HOME: 'Główna',
    LATEST_TWEETS: 'Najnowsze Tweety',
    MUTE_THIS_CONVERSATION: 'Wycisz tę rozmowę',
    QUOTE_TWEET: 'Cytuj Tweeta',
    QUOTE_TWEETS: 'Cytaty z Tweeta',
    RETWEETS: 'Tweety podane dalej',
    SHARED_TWEETS: 'Udostępnione Tweety',
    TIMELINE_OPTIONS: 'Opcje dotyczące osi czasu',
  },
  pt: {
    ADD_MUTED_WORD: 'Adicionar palavra silenciada',
    HOME: 'Página Inicial',
    LATEST_TWEETS: 'Tweets Mais Recentes',
    MUTE_THIS_CONVERSATION: 'Silenciar esta conversa',
    QUOTE_TWEET: 'Comentar o Tweet',
    QUOTE_TWEETS: 'Tweets com comentário',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Tweets Compartilhados',
    TIMELINE_OPTIONS: 'Opções de timeline',
  },
  ro: {
    ADD_MUTED_WORD: 'Adaugă cuvântul ignorat',
    HOME: 'Pagina principală',
    LATEST_TWEETS: 'Cele mai recente Tweeturi',
    MUTE_THIS_CONVERSATION: 'Ignoră această conversație',
    QUOTE_TWEET: 'Tweet cu citat',
    QUOTE_TWEETS: 'Tweeturi cu citat',
    RETWEETS: 'Retweeturi',
    SHARED_TWEETS: 'Tweeturi partajate',
    TIMELINE_OPTIONS: 'Opțiuni pentru cronologie',
  },
  ru: {
    ADD_MUTED_WORD: 'Добавить игнорируемое слово',
    HOME: 'Главная',
    LATEST_TWEETS: 'Последние твиты',
    MUTE_THIS_CONVERSATION: 'Игнорировать эту переписку',
    QUOTE_TWEET: 'Цитировать твит',
    QUOTE_TWEETS: 'Твиты с цитатами',
    RETWEETS: 'Ретвиты',
    SHARED_TWEETS: 'Общие твиты',
    TIMELINE_OPTIONS: 'Параметры ленты',
    TWITTER: 'Твиттер',
  },
  sk: {
    ADD_MUTED_WORD: 'Pridať stíšené slovo',
    HOME: 'Domov',
    LATEST_TWEETS: 'Najnovšie Tweety',
    MUTE_THIS_CONVERSATION: 'Stíšiť túto konverzáciu',
    QUOTE_TWEET: 'Tweet s citátom',
    QUOTE_TWEETS: 'Tweety s citátom',
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Zdieľané Tweety',
    TIMELINE_OPTIONS: 'Možnosti časovej osi',
  },
  sr: {
    ADD_MUTED_WORD: 'Додај игнорисану реч',
    HOME: 'Почетна',
    LATEST_TWEETS: 'Најновији твитови',
    MUTE_THIS_CONVERSATION: 'Игнориши овај разговор',
    QUOTE_TWEET: 'твит са цитатом',
    QUOTE_TWEETS: 'твит(ов)а са цитатом',
    RETWEETS: 'Ретвитови',
    SHARED_TWEETS: 'Дељени твитови',
    TIMELINE_OPTIONS: 'Опције временске траке',
    TWITTER: 'Твитер',
  },
  sv: {
    ADD_MUTED_WORD: 'Lägg till ignorerat ord',
    HOME: 'Hem',
    LATEST_TWEETS: 'Senaste tweetsen',
    MUTE_THIS_CONVERSATION: 'Ignorera den här konversationen',
    QUOTE_TWEET: 'Citera Tweet',
    QUOTE_TWEETS: 'Citattweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Delade tweetsen',
    TIMELINE_OPTIONS: 'Alternativ för tidslinjen',
  },
  ta: {
    ADD_MUTED_WORD: 'செயல்மறைத்த வார்த்தையைச் சேர்',
    HOME: 'முகப்பு',
    LATEST_TWEETS: 'சமீபத்திய கீச்சுகள்',
    MUTE_THIS_CONVERSATION: 'இந்த உரையாடலை செயல்மறை',
    QUOTE_TWEET: 'ட்விட்டை மேற்கோள் காட்டு',
    QUOTE_TWEETS: 'மேற்கோள் கீச்சுகள்',
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
    TIMELINE_OPTIONS: 'காலவரிசை விருப்பங்கள்',
  },
  th: {
    ADD_MUTED_WORD: 'เพิ่มคำที่ซ่อน',
    HOME: 'หน้าแรก',
    LATEST_TWEETS: 'ทวีตล่าสุด',
    MUTE_THIS_CONVERSATION: 'ซ่อนบทสนทนานี้',
    QUOTE_TWEET: 'อ้างอิงทวีต',
    QUOTE_TWEETS: 'ทวีตและคำพูด',
    RETWEETS: 'รีทวีต',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    TIMELINE_OPTIONS: 'ตัวเลือกลำดับเหตุการณ์',
    TWITTER: 'ทวิตเตอร์',
  },
  tr: {
    ADD_MUTED_WORD: 'Sessize alınacak kelime ekle',
    HOME: 'Anasayfa',
    LATEST_TWEETS: 'En Son Tweetler',
    MUTE_THIS_CONVERSATION: 'Bu sohbeti sessize al',
    QUOTE_TWEET: 'Alıntı Tweet',
    QUOTE_TWEETS: 'Alıntı Tweetler',
    RETWEETS: 'Retweetler',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
    TIMELINE_OPTIONS: 'Zaman akışı seçenekleri',
  },
  uk: {
    ADD_MUTED_WORD: 'Додати слово до списку ігнорування',
    HOME: 'Головна',
    LATEST_TWEETS: 'Найновіші твіти',
    MUTE_THIS_CONVERSATION: 'Ігнорувати цю розмову',
    QUOTE_TWEET: 'Цитувати твіт',
    QUOTE_TWEETS: 'Твіти з цитатою',
    RETWEETS: 'Ретвіти',
    SHARED_TWEETS: 'Спільні твіти',
    TIMELINE_OPTIONS: 'Параметри стрічки',
    TWITTER: 'Твіттер',
  },
  ur: {
    ADD_MUTED_WORD: 'خاموش کردہ لفظ شامل کریں',
    HOME: 'سرورق',
    LATEST_TWEETS: 'جدید ترین ٹویٹ',
    MUTE_THIS_CONVERSATION: 'اس گفتگو کو خاموش کریں',
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
    MUTE_THIS_CONVERSATION: 'Tắt tiếng cuộc trò chuyện này',
    QUOTE_TWEET: 'Trích dẫn Tweet',
    QUOTE_TWEETS: 'Tweet trích dẫn',
    RETWEETS: 'Các Tweet lại',
    SHARED_TWEETS: 'Tweet được chia sẻ',
    TIMELINE_OPTIONS: 'Các tùy chọn Dòng thời gian',
  },
  'zh-Hant': {
    ADD_MUTED_WORD: '加入靜音文字',
    HOME: '首頁',
    LATEST_TWEETS: '最新推文',
    MUTE_THIS_CONVERSATION: '將此對話靜音',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用的推文',
    RETWEETS: '轉推',
    SHARED_TWEETS: '分享的推文',
    TIMELINE_OPTIONS: '時間軸選項',
  },
  zh: {
    ADD_MUTED_WORD: '添加要隐藏的字词',
    HOME: '主页',
    LATEST_TWEETS: '最新推文',
    MUTE_THIS_CONVERSATION: '隐藏此对话',
    QUOTE_TWEET: '引用推文',
    QUOTE_TWEETS: '引用推文',
    RETWEETS: '转推',
    SHARED_TWEETS: '分享的推文',
    TIMELINE_OPTIONS: '时间线选项',
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
  VERIFIED_TICK: 'svg path[d^="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2."]',
}

/** @enum {string} */
const Svgs = {
  BLUE_LOGO_PATH: 'M16.5 3H2v18h15c3.038 0 5.5-2.46 5.5-5.5 0-1.4-.524-2.68-1.385-3.65-.08-.09-.089-.22-.023-.32.574-.87.908-1.91.908-3.03C22 5.46 19.538 3 16.5 3zm-.796 5.99c.457-.05.892-.17 1.296-.35-.302.45-.684.84-1.125 1.15.004.1.006.19.006.29 0 2.94-2.269 6.32-6.421 6.32-1.274 0-2.46-.37-3.459-1 .177.02.357.03.539.03 1.057 0 2.03-.35 2.803-.95-.988-.02-1.821-.66-2.109-1.54.138.03.28.04.425.04.206 0 .405-.03.595-.08-1.033-.2-1.811-1.1-1.811-2.18v-.03c.305.17.652.27 1.023.28-.606-.4-1.004-1.08-1.004-1.85 0-.4.111-.78.305-1.11 1.113 1.34 2.775 2.22 4.652 2.32-.038-.17-.058-.33-.058-.51 0-1.23 1.01-2.22 2.256-2.22.649 0 1.235.27 1.647.7.514-.1.997-.28 1.433-.54-.168.52-.526.96-.992 1.23z',
  HOME: '<g><path d="M12 9c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 6c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-13.304L.622 8.807l1.06 1.696L3 9.679V19.5C3 20.881 4.119 22 5.5 22h13c1.381 0 2.5-1.119 2.5-2.5V9.679l1.318.824 1.06-1.696L12 1.696zM19 19.5c0 .276-.224.5-.5.5h-13c-.276 0-.5-.224-.5-.5V8.429l7-4.375 7 4.375V19.5z"></path></g>',
  MUTE: '<g><path d="M18 6.59V1.2L8.71 7H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h2.09l-2.3 2.29 1.42 1.42 15.5-15.5-1.42-1.42L18 6.59zm-8 8V8.55l6-3.75v3.79l-6 6zM5 9.5c0-.28.22-.5.5-.5H8v6H5.5c-.28 0-.5-.22-.5-.5v-5zm6.5 9.24l1.45-1.45L16 19.2V14l2 .02v8.78l-6.5-4.06z"></path></g>',
  RETWEET: '<g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g>',
}

const MOBILE_LOGGED_OUT_URLS = ['/', '/i/flow/login', '/i/flow/signup']
const PROFILE_FOLLOWS_URL_RE = /\/[a-zA-Z\d_]{1,15}\/(following|followers|followers_you_follow)\/?$/
const PROFILE_TABS_URL_RE = /\/[a-zA-Z\d_]{1,15}\/(with_replies|media|likes)\/?$/
// https://twitter.com/${user}'s title ends with (@${user})
const PROFILE_TITLE_RE = /\(@[a-zA-Z\d_]{1,15}\)$/
const THEME_COLORS = new Set([
  'rgb(29, 155, 240)', // blue
  'rgb(255, 212, 0)', // yellow
  'rgb(244, 33, 46)',  // pink
  'rgb(120, 86, 255)', // purple
  'rgb(255, 122, 0)',  // orange
  'rgb(0, 186, 124)',  // green
])
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
const URL_PHOTO_RE = /photo\/\d$/
const URL_LIST_RE = /\/i\/lists\/\d+$/
const URL_TWEET_ID_RE = /\/status\/(\d+)$/

/**
 * The quoted Tweet associated with a caret menu that's just been opened.
 * @type {import("./types").QuotedTweet}
 */
let quotedTweet = null

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

/**
 * CSS rule in the React Native stylesheet which defines the Chirp font-family
 * and fallbacks for the whole app.
 * @type {CSSStyleRule}
 */
let fontFamilyRule = null

/** @type {string} */
let fontSize = null

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
 * @type {(import("./types").NamedMutationObserver|{disconnect(): void})[]}
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

function isOnListPage() {
  return URL_LIST_RE.test(currentPath)
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

function isOnSearchPage() {
  return currentPath.startsWith('/search') || currentPath.startsWith('/hashtag/')
}

function isOnSeparatedTweetsTimeline() {
  return currentPage == separatedTweetsTimelineTitle
}

function isOnTabbedTimeline() {
  if (!isOnMainTimelinePage()) {
    return false
  }
  let $header = document.querySelector(desktop ? Selectors.DESKTOP_TIMELINE_HEADER : Selectors.MOBILE_TIMELINE_HEADER_OLD)
  return $header?.childElementCount == (desktop ? 3 : 2)
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
 * @param {string} name
 */
function disconnectPageObserver(name) {
  for (let i = pageObservers.length -1; i >= 0; i--) {
    let pageObserver = pageObservers[i]
    if ('name' in pageObserver && pageObserver.name == name) {
      pageObserver.disconnect()
      pageObservers.splice(i, 1)
      log(`disconnected ${name} page observer`)
    }
  }
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
 * @param {Partial<import("./types").Config>} configChanges
 */
 function onSettingsChanged(configChanges) {
  if ('debug' in configChanges) {
    log('disabling debug mode')
    debug = configChanges.debug
    log('enabled debug mode')
    configureThemeCss()
    return
  }
  Object.assign(config, configChanges)
  configChanged(configChanges)
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
  }, '<body> style attribute for backgroundColor', {
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
    configureThemeCss()
    observePopups()
    processCurrentPage()
  }, 'Color change re-render boundary')
}

/**
 * When the "Font size" setting is changed in "Customize your view", `<html>`'s
 * fontSize is changed and the app is re-rendered.
 */
function observeHtmlFontSize() {
  if (mobile) return

  let lastOverflow = ''

  observeElement($html, () => {
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
  }, '<html> style attribute for fontSize', {
    attributes: true,
    attributeFilter: ['style']
  })
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

    if (!(config.addAddMutedWordMenuItem ||
          config.fastBlock ||
          config.mutableQuoteTweets ||
          config.twitterBlueChecks != 'ignore')) return

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
  observingTitle = true
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
      tagTwitterBlueCheckmarks($results)
    }, 'search results', {childList: true, subtree: true})
  )
}

/**
 * @param {string} page
 * @param {import("./types").TimelineOptions} [options]
 */
async function observeTimeline(page, options = {}) {
  let {isTabbed = false, tabbedTimelineContainerSelector = null} = options

  let $timeline = await getElement(Selectors.TIMELINE, {
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
    if (isTabbed) {
      // When a tab which has been viewed before is revisited, the timeline is
      // replaced.
      disconnectPageObserver('timeline parent')
      pageObservers.push(
        observeElement($timeline.parentElement, (mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((/** @type {HTMLElement} */ $newTimeline) => {
              log('timeline replaced')
              disconnectPageObserver('timeline')
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

  if (isTabbed) {
    let $tabbedTimelineContainer = document.querySelector(tabbedTimelineContainerSelector)
    if ($tabbedTimelineContainer) {
      let waitingForNewTimeline = false
      // The first time a new tab is navigated to, the section containing the
      // timeline is replaced with a loading spinner.
      pageObservers.push(
        observeElement($tabbedTimelineContainer, async (mutations) => {
          // This is going to fire twice on a new tab, as the spinner is added
          // then replaced with the new timeline section.
          if (!mutations.some(mutation => mutation.addedNodes.length > 0) || waitingForNewTimeline) return

          waitingForNewTimeline = true
          let $newTimeline = await getElement(Selectors.TIMELINE, {
            name: 'new timeline',
            stopIf: pageIsNot(page),
          })
          waitingForNewTimeline = false
          if (!$newTimeline) return

          observeTimelineItems($newTimeline)
        }, 'tabbed timeline container')
      )
    }
    else {
      console.log('tabbed timeline container not found')
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
    let $menuLayer = /** @type {HTMLElement} */ ($blockMenuItem.closest('[role="group"]')?.firstElementChild)
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
 * @param {string} page
 */
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
    $timelineTitle.parentElement.parentElement.appendChild($newHeading)
    $timelineTitle.parentElement.parentElement.classList.add('tnt_tabs')

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
    let $toggle = document.createElement('div')
    $toggle.id = 'tnt_switch_timeline'
    let toggleColor = getComputedStyle(document.querySelector(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"] svg`)).color
    $toggle.innerHTML = `<span><svg viewBox="0 0 24 24" aria-hidden="true" style="color: ${toggleColor}; width: 22px; vertical-align: text-bottom; position: relative; max-width: 100%; height: 22px; fill: currentcolor; display: inline-block;">
      ${page == separatedTweetsTimelineTitle ? Svgs.HOME : Svgs.RETWEET}
    </svg></span>`
    let $span = /** @type {HTMLSpanElement} */ ($toggle.firstElementChild)
    $span.title = `Switch to ${page == currentMainTimelineType ? separatedTweetsTimelineTitle : currentMainTimelineType}`
    $span.addEventListener('click', () => {
      let newTitle = page == separatedTweetsTimelineTitle ? currentMainTimelineType : separatedTweetsTimelineTitle
      setTitle(newTitle)
      $span.title = `Switch to ${newTitle == currentMainTimelineType ? separatedTweetsTimelineTitle : currentMainTimelineType}`
      window.scrollTo({top: 0})
    })

    let $timelineTitle = document.querySelector(`
      ${Selectors.MOBILE_TIMELINE_HEADER_OLD} h2,
      ${Selectors.MOBILE_TIMELINE_HEADER_NEW} h2
    `)

    // Only the non-tabbed timeline has a heading in the header
    if ($timelineTitle != null) {
      // We hide the existing timeline title via CSS when it's not wanted instead
      // of changing its text, as those changes persist when you view a tweet.
      $timelineTitle.classList.add('tnt_home_timeline_title')
      removeMobileTimelineHeaderElements()

      log('inserting separated tweets timeline switcher in timeline title')
      $timelineTitle.insertAdjacentElement('afterend', $toggle)

      if (page == separatedTweetsTimelineTitle) {
        let $sharedTweetsTitle = /** @type {HTMLElement} */ ($timelineTitle.cloneNode(true))
        $sharedTweetsTitle.querySelector('span').textContent = separatedTweetsTimelineTitle
        $sharedTweetsTitle.id = 'tnt_shared_tweets_timeline_title'
        $sharedTweetsTitle.classList.remove('tnt_home_timeline_title')
        $timelineTitle.insertAdjacentElement('afterend', $sharedTweetsTitle)
      }
      $timelineTitle.parentElement.classList.add('tnt_mobile_header')
    }
    else {
      let $headerContent = document.querySelector(`${Selectors.MOBILE_TIMELINE_HEADER_OLD} > div > div > div > div > div`)
      if ($headerContent != null) {
        if (config.alwaysUseLatestTweets) {
          // This element reserves space for the timeline tabs - resize it for
          // the header's contents, as the tabs are going to be hidden.
          let $headerSizer = /** @type {HTMLDivElement} */ (document.querySelector(`${Selectors.MOBILE_TIMELINE_HEADER_OLD} > div`))
          if ($headerSizer) {
            $headerSizer.style.height = getComputedStyle($headerContent).height
          }
        }

        removeMobileTimelineHeaderElements()

        log('inserting separated tweets timeline switcher in header')
        $headerContent.appendChild($toggle)
      }
      else {
        warn('could not find header content element')
      }
    }

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

const configureCss = (() => {
  let $style = addStyle('features')

  return function configureCss() {
    let cssRules = []
    let hideCssSelectors = []
    let menuRole = `[role="${desktop ? 'menu' : 'dialog'}"]`

    if (config.alwaysUseLatestTweets) {
      // Hide the sparkle when automatically staying on Latest Tweets
      hideCssSelectors.push(mobile
        ? [`body.MainTimeline ${Selectors.MOBILE_TIMELINE_HEADER_OLD} > div > div > div > div > div > div:nth-of-type(3)`,
           `body.MainTimeline ${Selectors.MOBILE_TIMELINE_HEADER_NEW} > div > div:first-of-type > div > div > div > div > div:nth-of-type(3)`,
          ].join(', ')
        : [`body.MainTimeline ${Selectors.DESKTOP_TIMELINE_HEADER} > div > div:only-child > div:only-child > div:only-child > div:only-child > div:last-of-type:not(:only-child)`,
           `body.MainTimeline ${Selectors.DESKTOP_TIMELINE_HEADER} > div > div:only-child > div:only-child > div:only-child > div:only-child > div:only-child > div:last-of-type:not(:only-child)`,
          ].join(', ')
      )
      // Hide timeline tabs
      hideCssSelectors.push(mobile
        ? `body.TimelineTabs ${Selectors.MOBILE_TIMELINE_HEADER_OLD} > div:nth-of-type(2)`
        : `body.TimelineTabs ${Selectors.DESKTOP_TIMELINE_HEADER} > div:nth-of-type(2):not(:last-child)`
      )
    }
    if (config.dropdownMenuFontWeight) {
      cssRules.push(`
        [data-testid="Dropdown"] [role="menuitem"] [dir="auto"] {
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
        // Under timeline-style tweets
        '[data-testid="tweet"] [role="group"] > div:nth-of-type(4)',
        // Under individual tweets
        'body.Tweet [data-testid="tweet"] + div > div > [role="group"] > div:nth-of-type(4)',
        // In media modal
        '[aria-modal="true"] [role="group"] > div:nth-of-type(4)',
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
    if (config.hideMomentsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/moment_maker"]`)
    }
    if (config.hideMonetizationNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/settings/monetization"]`)
    }
    if (config.hideNewslettersNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/newsletters"]`)
    }
    if (config.hideTopicsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/topics"]`)
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
      hideCssSelectors.push(`${menuRole} a[href*="ads.twitter.com"]`)
    }
    if (config.hideTwitterBlueNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/twitter_blue_sign_up"]`)
    }
    if (config.hideTwitterForProfessionalsNav) {
      hideCssSelectors.push(`${menuRole} a[href$="/convert_to_professional"]`)
    }
    if (config.hideVerifiedNotificationsTab) {
      hideCssSelectors.push('body.Notifications [data-testid="ScrollSnap-List"] > div:nth-child(2)')
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
      cssRules.push(`.tnt_blue_check path { d: path("${Svgs.BLUE_LOGO_PATH}"); }`)
    }

    // Hide "Creator Studio" if all its contents are hidden
    if (config.hideMomentsNav && config.hideNewslettersNav && config.hideAnalyticsNav) {
      hideCssSelectors.push(`${menuRole} div[role="button"][aria-expanded]:nth-of-type(1)`)
    }
    // Hide "Professional Tools" if all its contents are hidden
    if (config.hideTwitterForProfessionalsNav && config.hideTwitterAdsNav && config.hideMonetizationNav) {
      hideCssSelectors.push(`${menuRole} div[role="button"][aria-expanded]:nth-of-type(2)`)
    }

    if (desktop) {
      if (config.disableHomeTimeline) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/home"]`)
      }
      if (config.fullWidthContent) {
        // Pseudo-selector for pages full-width is enabled on
        let pageSelector = ':is(.List, .MainTimeline)'
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
      if (config.addAddMutedWordMenuItem || config.mutableQuoteTweets) {
        // Hover colors for custom menu items
        cssRules.push(`
          body.Default .tnt_menu_item:hover a { background-color: rgb(247, 249, 249) !important; }
          body.Dim .tnt_menu_item:hover a { background-color: rgb(30, 39, 50) !important; }
          body.LightsOut .tnt_menu_item:hover a { background-color: rgb(22, 24, 28) !important; }
        `)
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
      if (config.hideExploreNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`)
      }
      if (config.hideBookmarksNav) {
        hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/bookmarks"]`)
      }
      if (config.hideMessagesDrawer) {
        cssRules.push(`${Selectors.MESSAGES_DRAWER} { visibility: hidden; }`)
      }
      if (config.retweets != 'separate' && config.quoteTweets != 'separate') {
        hideCssSelectors.push('#tnt_separated_tweets')
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
          .tnt_tabs {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid var(--tab-border);
            margin-left: -16px;
            margin-right: -16px;
          }
          .tnt_tabs > div {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            transition-property: background-color;
            transition-duration: 0.2s;
          }
          .tnt_tabs > div:hover {
            background-color: var(--tab-hover);
          }
          .tnt_tabs > div > h2 {
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            line-height: 20px;
            font-weight: normal;
            color: var(--inactive-tab-text);
          }
          body.Home main h2:not(#tnt_separated_tweets),
          body.LatestTweets main h2:not(#tnt_separated_tweets),
          body.SeparatedTweets #tnt_separated_tweets {
            font-weight: bold;
            color: var(--active-tab-text); !important;
          }
          .tnt_tabs > div > h2::after {
            content: "";
            position: absolute;
            bottom: 0;
            height: 0;
            width: 100%;
            min-width: 56px;
          }
          body.Home .tnt_tabs > div > h2:not(#tnt_separated_tweets)::after,
          body.LatestTweets .tnt_tabs > div > h2:not(#tnt_separated_tweets)::after,
          body.SeparatedTweets .tnt_tabs > div > #tnt_separated_tweets::after {
            height: 4px;
          }
        `)
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
        hideCssSelectors.push('.HideAppNags #layers > div')
      }
      if (config.hideExplorePageContents) {
        // Hide explore page contents so we don't get a brief flash of them
        // before automatically switching the page to search mode.
        hideCssSelectors.push(
          // Tabs
          `body.Explore ${Selectors.MOBILE_TIMELINE_HEADER_OLD} > div:nth-of-type(2)`,
          `body.Explore ${Selectors.MOBILE_TIMELINE_HEADER_NEW} > div:nth-of-type(2)`,
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
        cssRules.push(`
          #tnt_switch_timeline span {
            cursor: pointer;
          }
          body.TimelineTabs #tnt_switch_timeline {
            align-items: end;
            align-self: stretch;
            display: flex;
            flex-basis: 50%;
            flex-direction: column;
            justify-content: center;
          }
        `)
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
        body.Profile header > div > div:first-of-type h2 + div[dir="auto"],
        body.Profile ${Selectors.MOBILE_TIMELINE_HEADER_NEW} > div > div:first-of-type h2 + div[dir="auto"]
      ` : `body.Profile ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 + div[dir="auto"]`
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
    config.hideReplyMetrics   && ':nth-of-type(1)',
    config.hideRetweetMetrics && ':nth-of-type(2)',
    config.hideLikeMetrics    && ':nth-of-type(3)',
  ].filter(Boolean).join(', ')

  if (timelineMetricSelectors) {
    cssRules.push(
      // Metrics under timeline-style tweets
      `[data-testid="tweet"] [role="group"] > div:is(${timelineMetricSelectors}) div > span { visibility: hidden; }`,
      // Metrics in media modal
      `[aria-modal="true"] [role="group"] > div:is(${timelineMetricSelectors}) [data-testid="app-text-transition-container"] { visibility: hidden; }`,
    )
  }
}

const configureNavFontSizeCss = (() => {
  let $style = addStyle('nav-font-size')

  return function configureNavFontSizeCss() {
    let cssRules = []

    if (fontSize != null && config.navBaseFontSize) {
      cssRules.push(`
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir="auto"] span { font-size: ${fontSize}; font-weight: normal; }
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir="auto"] { margin-top: -4px; }
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

const configureThemeCss = (() => {
  let $style = addStyle('theme')

  return function configureThemeCss() {
    let cssRules = []

    if (debug) {
      cssRules.push(`
        [data-item-type]::after {
          position: absolute;
          top: 0;
          right: 50px;
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

    if (themeColor != null && desktop && (config.retweets == 'separate' || config.quoteTweets == 'separate')) {
      cssRules.push(`
        .tnt_tabs > div > h2::after {
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
  let $quotedTweet = $tweet.querySelector('div[id^="id__"] > div[dir="auto"] > span').parentElement.nextElementSibling
  let $heading = $quotedTweet?.querySelector(':scope > div > div:first-child')
  let user = $heading?.querySelector('div:last-child > span')?.textContent
  let time = $heading?.querySelector('time')?.dateTime
  let text = $heading?.nextElementSibling?.querySelector('[lang]')?.textContent
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
    if (!config.alwaysUseLatestTweets && currentMainTimelineType == getString('HOME')) {
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
    if ($tweet.querySelector('div[id^="id__"] > div[dir="auto"] > span')?.textContent.includes(getString('QUOTE_TWEET'))) {
      return 'RETWEETED_QUOTE_TWEET'
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

// Add 1 every time this gets broken: 3
function getVerifiedProps($svg) {
  let childIndex = 0
  let $parent = $svg.parentElement
  // Verified badge button on the profile screen
  if ($parent.getAttribute('role') == 'button') {
    $parent = $parent.closest('span')
  }
  // Link variant in "user followed/liked/retweeted" notifications
  else if ($parent.getAttribute('role') == 'link') {
    childIndex = 1
  }
  if ($parent.wrappedJSObject) {
    $parent = $parent.wrappedJSObject
  }
  let reactPropsKey = Object.keys($parent).find(key => key.startsWith('__reactProps$'))
  let props = $parent[reactPropsKey]?.children?.props?.children?.[0]?.[childIndex]?.props
  if (!props) {
    warn('verified props not found for', $svg, {reactPropsKey})
  }
  return props
}

/**
 * @param {HTMLElement} $popup
 * @returns {{tookAction: boolean, onPopupClosed?: () => void}}
 */
function handlePopup($popup) {
  let result = {tookAction: false, onPopupClosed: null}

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

  if (config.twitterBlueChecks != 'ignore') {
    let $hoverCard = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="HoverCard"]'))
    if ($hoverCard) {
      result.tookAction = true
      getElement('div[data-testid^="UserAvatar-Container"]', {
        context: $hoverCard,
        name: 'user hovercard contents',
        timeout: 250,
      }).then(($contents) => {
        if ($contents) tagTwitterBlueCheckmarks($popup)
      })
    }
  }

  if (config.twitterBlueChecks == 'replace' && isOnProfilePage()) {
    let $hoverCard = /** @type {HTMLElement} */ ($popup.querySelector('[data-testid="HoverCard"]'))
    if ($hoverCard) {
      getElement(':scope > div > div > svg:first-child path[d^="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2."]', {
        context: $hoverCard,
        name: 'verified account hovercard svg path',
        timeout: 250,
      }).then(($hoverCardSvgPath) => {
        if (!$hoverCardSvgPath) return

        let $headerSvgPath = document.querySelector(mobile ? `
          body.Profile header ${Selectors.VERIFIED_TICK},
          body.Profile ${Selectors.MOBILE_TIMELINE_HEADER_NEW} ${Selectors.VERIFIED_TICK}
        ` : `body.Profile ${Selectors.PRIMARY_COLUMN} > div > div:first-of-type h2 ${Selectors.VERIFIED_TICK}`)
        if (!$headerSvgPath) return

        if (isBlueVerified($headerSvgPath.closest('svg'))) {
          // Wait for the hovercard to render its contents
          let popupRenderObserver = observeElement($popup, (mutations) => {
            if (!mutations.length) return
            $popup.querySelector('svg').classList.add('tnt_blue_check')
            popupRenderObserver.disconnect()
          }, 'verified popup render', {childList: true, subtree: true})
        }
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
 * @param {import("./types").TimelineOptions} [options]
 */
function onTimelineChange($timeline, page, options = {}) {
  let startTime = Date.now()
  let {classifyTweets = true, hideHeadings = true} = options

  if (config.twitterBlueChecks != 'ignore' && !isOnMainTimelinePage()) {
    tagTwitterBlueCheckmarks($timeline)
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
        let isReply = isReplyToPreviousTweet($tweet)
        if (isReply && hidPreviousItem != null) {
          hideItem = hidPreviousItem
        } else {
          hideItem = shouldHideMainTimelineItem(itemType, page)
        }

        if (!hideItem && (itemType == 'QUOTE_TWEET' || itemType == 'RETWEETED_QUOTE_TWEET') && config.mutableQuoteTweets) {
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
          for (let $svgPath of $tweet.querySelectorAll(Selectors.VERIFIED_TICK)) {
            let verifiedProps = getVerifiedProps($svgPath.closest('svg'))
            if (!verifiedProps) continue

            let isUserCheck = $svgPath.closest('div[data-testid="User-Names"]')
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
              $svgPath.closest('div').classList.add('tnt_blue_check')
            }
          }
        }

        if (debug) {
          $item.firstElementChild.dataset.itemType = `${itemType}${isReply ? ' / REPLY' : ''}${checkType ? ` / ${checkType}` : ''}`
        }
      }
    }
    else if (!isOnMainTimelinePage()) {
      if ($item.querySelector(':scope > div > div > div > article')) {
        itemType = 'UNAVAILABLE'
      }
    }

    if (!isOnMainTimelinePage()) {
      if (itemType != null) {
        hideItem = shouldHideOtherTimelineItem(itemType)
        if (debug) {
          $item.firstElementChild.dataset.itemType = `${itemType}`
        }
      }
    }

    if (itemType == null && config.hideWhoToFollowEtc) {
      // "Who to follow", "Follow some Topics" etc. headings
      if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        if (hideHeadings) {
          hideItem = true
          // Also hide the divider above the heading
          if ($previousItem?.innerText == '' && $previousItem.firstElementChild) {
            /** @type {HTMLElement} */ ($previousItem.firstElementChild).style.display = 'none'
          }
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
      // The first item in the timeline is sometimes an empty placeholder <div>
      else if ($item !== $timeline.firstElementChild && hideItem == null) {
        // We're probably also missing some spacer / divider nodes
        warn('unhandled timeline item', $item)
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
    log(
      `disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`,
      pageObservers.map(observer => observer['name'])
    )
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

  // "Which version of the main timeline are we on?" hooks for styling
  $body.classList.toggle('Home', isOnHomeTimeline())
  $body.classList.toggle('LatestTweets', isOnLatestTweetsTimeline())
  $body.classList.toggle('SeparatedTweets', isOnSeparatedTweetsTimeline())
  $body.classList.toggle('TimelineTabs', isOnTabbedTimeline())

  if (desktop) {
    if (config.twitterBlueChecks != 'ignore' || config.fullWidthContent && (isOnMainTimelinePage() || isOnListPage())) {
      observeSidebar()
    } else {
      $body.classList.remove('Sidebar')
    }

    if (config.twitterBlueChecks != 'ignore' && (isOnSearchPage() || isOnExplorePage())) {
      observeSearchForm()
    }
  }

  if (isOnMainTimelinePage()) {
    if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
      addSeparatedTweetsTimelineControl(currentPage)
    }
    else {
      removeMobileTimelineHeaderElements()
    }
    observeTimeline(currentPage)
  }
  else {
    removeMobileTimelineHeaderElements()
  }

  if (isOnProfilePage()) {
    tweakProfilePage()
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
  else if (isOnExplorePage()) {
    tweakExplorePage()
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

async function switchToLatestTweets(page) {
  log('switching to Latest Tweets timeline')

  let sparkleSelector = mobile ? `
    ${Selectors.MOBILE_TIMELINE_HEADER_OLD} div:nth-of-type(3) [role="button"],
    ${Selectors.MOBILE_TIMELINE_HEADER_NEW} div:nth-of-type(3) [role="button"]
  ` : `${Selectors.PRIMARY_COLUMN} [role="button"]`
  let $sparkleButton = await getElement(sparkleSelector, {
    name: 'sparkle button',
    stopIf: pageIsNot(page),
  })
  if ($sparkleButton == null) return

  if ($sparkleButton.getAttribute('aria-label') == getString('TIMELINE_OPTIONS')) {
    log('tabbed timeline is being used')

    let $timelineHeader = document.querySelector(desktop ? Selectors.DESKTOP_TIMELINE_HEADER : Selectors.MOBILE_TIMELINE_HEADER_OLD)
    if ($timelineHeader == null) {
      warn('could not find timeline header')
      return
    }

    if ($timelineHeader.childElementCount != (desktop ? 3 : 2)) {
      log('timeline tabs not showing - clicking sparkle button')
      $sparkleButton.click()

      let $pinYourLatestTimeline = await getElement('div[role="menu"] div[role="menuitem"]', {
        name: '"Pin your Latest timeline" menu item',
        stopIf: pageIsNot(page),
      })
      if ($pinYourLatestTimeline == null) return

      log('clicking "Pin your Latest timeline" menu item')
      $pinYourLatestTimeline.click()
    }

    let $latestTweetsTab = /** @type {HTMLElement} */ ($timelineHeader.querySelector('[data-testid="ScrollSnap-List"] [role="presentation"]:nth-child(2) a'))
    if ($latestTweetsTab == null) {
      warn('could not find "Latest Tweets" tab')
      return
    }

    log('clicking "Latest Tweets" tab')
    $latestTweetsTab.click()
  }
  else {
    log('non-tabbed timeline is being used')
    log('clicking sparkle button')
    $sparkleButton.click()

    let $seeLatestTweetsInstead = await getElement('div[role="menu"] div[role="menuitem"]', {
      name: '"See latest Tweets instead" menu item',
      stopIf: pageIsNot(page),
    })
    if ($seeLatestTweetsInstead == null) return

    log('clicking "See latest Tweets" instead menu item')
    $seeLatestTweetsInstead.click()
  }
}

/**
 * Add a tnt_blue_check class to any Twitter Blue checkmarks inside an element.
 * Since hiding is an option, this needs to be added to an appropriate parent
 * element.
 * @param {HTMLElement} $el
 */
function tagTwitterBlueCheckmarks($el) {
  for (let $svgPath of $el.querySelectorAll(Selectors.VERIFIED_TICK)) {
    if (isBlueVerified($svgPath.closest('svg'))) {
      $svgPath.closest(':is(div, span):not([role="button"]').classList.add('tnt_blue_check')
    }
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

/**
 * Re-navigates to a tweet to get rid of the "More Tweets" section.
 */
function tweakIndividualTweetPage() {
  if (config.hideMoreTweets && location.search) {
    log('re-navigating to get rid of More Tweets')
    location.replace(location.origin + location.pathname)
    return
  }
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage)
  }
}

function tweakNotificationsPage() {
  if (config.twitterBlueChecks != 'ignore') {
    observeTimeline(currentPage, {
      classifyTweets: false,
      hideHeadings: false,
      isTabbed: true,
      tabbedTimelineContainerSelector: 'div[data-testid="primaryColumn"] > div > div:last-child',
    })
  }
}

function tweakProfilePage() {
  if (config.twitterBlueChecks != 'ignore') {
    tagTwitterBlueCheckmarks(document.querySelector(Selectors.PRIMARY_COLUMN))
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
function main() {
  let $settings = /** @type {HTMLScriptElement} */ (document.querySelector('script#tnt_settings'))
  if ($settings) {
    try {
      Object.assign(config, JSON.parse($settings.innerText))
    } catch(e) {
      warn('error getting initial settings', e)
    }

    let settingsObserver = new MutationObserver(() => {
      try {
        onSettingsChanged(JSON.parse($settings.innerText))
      } catch(e) {
        warn('error changing settings', e)
      }
    })
    settingsObserver.observe($settings, {childList: true})
  }

  if (config.debug) {
    debug = true
  }

  log({config, lang, platform: mobile ? 'mobile' : 'desktop'})

  configureSeparatedTweetsTimelineTitle()
  configureCss()
  checkReactNativeStylesheet()
  observeHtmlFontSize()
  observeBodyBackgroundColor()
  observeColor()
  observePopups()

  observeTitle()
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
