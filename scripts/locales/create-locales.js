const fs = require('fs')
const path = require('path')

const externalTranslations = {
  'ar-x-fm': {
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TWEET: 'غرّدي',
    TWEET_ALL: 'تغريد الكل',
    TWITTER: 'تويتر',
  },
  ar: {
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
    TWEET: 'تغريد',
    TWEET_ALL: 'تغريد الكل',
  },
  bg: {
    RETWEETS: 'Ретуитове',
    SHARED_TWEETS: 'Споделени туитове',
    TWEET: 'تغريد',
    TWEET_ALL: 'تغريد الكل',
  },
  bn: {
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
    TWEET: 'টুইট',
    TWEET_ALL: 'সব টুইট করুন',
    TWITTER: 'টুইটার',
  },
  ca: {
    RETWEETS: 'Retuits',
    SHARED_TWEETS: 'Tuits compartits',
    TWEET: 'Tuita',
    TWEET_ALL: 'Tuita-ho tot',
  },
  cs: {
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Sdílené tweety',
    TWEET: 'Tweetovat',
    TWEET_ALL: 'Tweetnout vše',
  },
  da: {
    SHARED_TWEETS: 'Delte tweets',
    TWEET_ALL: 'Tweet alt',
  },
  de: {
    SHARED_TWEETS: 'Geteilte Tweets',
    TWEET: 'Twittern',
    TWEET_ALL: 'Alle twittern',
  },
  el: {
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
    TWEET_ALL: 'Δημοσίευση όλων ως Tweet',
  },
  en: {
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
    TWEET: 'Tweet',
    TWEET_ALL: 'Tweet all',
    TWITTER: 'Twitter',
  },
  es: {
    SHARED_TWEETS: 'Tweets compartidos',
    TWEET: 'Twittear',
    TWEET_ALL: 'Twittear todo',
  },
  eu: {
    RETWEETS: 'Bertxioak',
    SHARED_TWEETS: 'Partekatutako',
    TWEET: 'Txio',
    TWEET_ALL: 'Txiotu guztiak',
  },
  fa: {
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
    TWEET: 'توییت',
    TWEET_ALL: 'توییت به همه',
    TWITTER: 'توییتر',
  },
  fi: {
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED_TWEETS: 'Jaetut twiitit',
    TWEET: 'Twiittaa',
    TWEET_ALL: 'Twiittaa kaikki',
  },
  fil: {
    RETWEETS: 'Mga Retweet',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
    TWEET: 'Mag-tweet',
    TWEET_ALL: 'I-tweet lahat',
  },
  fr: {
    SHARED_TWEETS: 'Tweets partagés',
    TWEET: 'Tweeter',
    TWEET_ALL: 'Tout tweeter',
  },
  ga: {
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
    TWEET_ALL: 'Tweetáil gach rud',
  },
  gl: {
    RETWEETS: 'Rechouchíos',
    SHARED_TWEETS: 'Chíos compartidos',
    TWEET: 'Chío',
    TWEET_ALL: 'Chiar todo',
  },
  gu: {
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
    TWEET: 'ટ્વીટ',
    TWEET_ALL: 'બધાને ટ્વીટ કરો',
  },
  he: {
    RETWEETS: 'ציוצים מחדש',
    SHARED_TWEETS: 'ציוצים משותפים',
    TWEET: 'צייץ',
    TWEET_ALL: 'צייץ הכול',
    TWITTER: 'טוויטר',
  },
  hi: {
    RETWEETS: 'रीट्वीट्स',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
    TWEET: 'ट्वीट करें',
    TWEET_ALL: 'सभी ट्वीट करें',
  },
  hr: {
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
    TWEET_ALL: 'Tweetaj sve',
  },
  hu: {
    RETWEETS: 'Retweetek',
    SHARED_TWEETS: 'Megosztott tweetek',
    TWEET: 'Tweetelj',
    TWEET_ALL: 'Tweet küldése mindenkinek',
  },
  id: {
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
    TWEET_ALL: 'Tweet semua',
  },
  it: {
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet condivisi',
    TWEET: 'Twitta',
    TWEET_ALL: 'Twitta tutto',
  },
  ja: {
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
    TWEET: 'ツイートする',
    TWEET_ALL: 'すべてツイート',
  },
  kn: {
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
    TWEET: 'ಟ್ವೀಟ್',
    TWEET_ALL: 'ಎಲ್ಲಾ ಟ್ವೀಟ್ ಮಾಡಿ',
  },
  ko: {
    RETWEETS: '리트윗',
    SHARED_TWEETS: '공유 트윗',
    TWEET: '트윗',
    TWEET_ALL: '모두 트윗하기',
    TWITTER: '트위터',
  },
  mr: {
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED_TWEETS: 'सामायिक ट्विट',
    TWEET: 'ट्विट',
    TWEET_ALL: 'सर्व ट्विट करा',
  },
  ms: {
    RETWEETS: 'Tweet semula',
    SHARED_TWEETS: 'Tweet Berkongsi',
    TWEET_ALL: 'Tweet semua',
  },
  nb: {
    SHARED_TWEETS: 'Delte tweets',
    TWEET_ALL: 'Tweet alle',
  },
  nl: {
    SHARED_TWEETS: 'Gedeelde Tweets',
    TWEET: 'Tweeten',
    TWEET_ALL: 'Alles tweeten',
  },
  pl: {
    RETWEETS: 'Tweety podane dalej',
    SHARED_TWEETS: 'Udostępnione Tweety',
    TWEET_ALL: 'Tweetnij wszystko',
  },
  pt: {
    SHARED_TWEETS: 'Tweets Compartilhados',
    TWEET: 'Tweetar',
    TWEET_ALL: 'Tweetar tudo',
  },
  ro: {
    RETWEETS: 'Retweeturi',
    SHARED_TWEETS: 'Tweeturi partajate',
    TWEET_ALL: 'Dă Tweeturi cu tot',
  },
  ru: {
    RETWEETS: 'Ретвиты',
    SHARED_TWEETS: 'Общие твиты',
    TWEET: 'Твитнуть',
    TWEET_ALL: 'Твитнуть все',
    TWITTER: 'Твиттер',
  },
  sk: {
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Zdieľané Tweety',
    TWEET: 'Tweetnuť',
    TWEET_ALL: 'Tweetnuť všetko',
  },
  sr: {
    RETWEETS: 'Ретвитови',
    SHARED_TWEETS: 'Дељени твитови',
    TWEET: 'Твитуј',
    TWEET_ALL: 'Твитуј све',
    TWITTER: 'Твитер',
  },
  sv: {
    SHARED_TWEETS: 'Delade tweetsen',
    TWEET: 'Tweeta',
    TWEET_ALL: 'Tweeta allt',
  },
  ta: {
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
    TWEET: 'ட்விட் செய்',
    TWEET_ALL: 'அனைத்தையும் ட்விட் செய்',
  },
  th: {
    RETWEETS: 'รีทวีต',
    SHARED_TWEETS: 'ทวีตที่แชร์',
    TWEET: 'ทวีต',
    TWEET_ALL: 'ทวีตทั้งหมด',
    TWITTER: 'ทวิตเตอร์',
  },
  tr: {
    RETWEETS: 'Retweetler',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
    TWEET: 'Tweetle',
    TWEET_ALL: 'Hepsini Tweetle',
  },
  uk: {
    RETWEETS: 'Ретвіти',
    SHARED_TWEETS: 'Спільні твіти',
    TWEET: 'Твіт',
    TWEET_ALL: 'Твітнути все',
    TWITTER: 'Твіттер',
  },
  ur: {
    RETWEETS: 'ریٹویٹس',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
    TWEET: 'ٹویٹ',
    TWEET_ALL: 'سب کو ٹویٹ کریں',
    TWITTER: 'ٹوئٹر',
  },
  vi: {
    RETWEETS: 'Các Tweet lại',
    SHARED_TWEETS: 'Tweet được chia sẻ',
    TWEET_ALL: 'Đăng Tweet tất cả',
  },
  'zh-Hant': {
    RETWEETS: '轉推',
    SHARED_TWEETS: '分享的推文',
    TWEET: '推文',
    TWEET_ALL: '推全部內容',
  },
  zh: {
    RETWEETS: '转推',
    SHARED_TWEETS: '分享的推文',
    TWEET: '推文',
    TWEET_ALL: '全部发推',
  },
}

// These codes are from Twitter's own locale files - we can use them to create
// locales with just the translations we need.
let template = {
  ADD_MUTED_WORD: 'd768049c',
  HOME: 'ha8209bc',
  MUTE_THIS_CONVERSATION: 'e2d6c17e',
  QUOTE_TWEET: 'c9d7235e',
  QUOTE_TWEETS: 'bd7c0390',
  SHOW: 'a0e81a2e',
  SHOW_MORE_REPLIES: 'c837fcaa',
  TURN_OFF_RETWEETS: 'b62e432e',
  TURN_ON_RETWEETS: 'b2e20eac',
}

let locales = {}

function sortProperties(locale) {
  let entries = Object.entries(locale)
  entries.sort(([a], [b]) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
  return Object.fromEntries(entries)
}

for (let file of fs.readdirSync('./js')) {
  if (!file.endsWith('.js')) continue
  let locale = {}
  let src = fs.readFileSync(path.join('js', file), {encoding: 'utf8'})
  for (let [key, code] of Object.entries(template)) {
    let match = src.match(new RegExp(`"${code}","([^"]+)"`))
    if (match) {
      locale[key] = match[1]
    } else {
      console.log('no match', {file, key, code})
    }
  }
  let localeCode = file.split('.')[0]
  Object.assign(locale, externalTranslations[localeCode])
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync('locales.js', 'const locales = ' + JSON.stringify(locales, null, 2), {
  encoding: 'utf8',
})
