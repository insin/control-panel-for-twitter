const fs = require('fs')
const path = require('path')

const externalTranslations = {
  'ar-x-fm': {
    SHARED_TWEETS: 'التغريدات المشتركة',
  },
  ar: {
    SHARED_TWEETS: 'التغريدات المشتركة',
  },
  bg: {
    SHARED_TWEETS: 'Споделени туитове',
  },
  bn: {
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
  },
  ca: {
    SHARED_TWEETS: 'Tuits compartits',
  },
  cs: {
    SHARED_TWEETS: 'Sdílené tweety',
  },
  da: {
    SHARED_TWEETS: 'Delte tweets',
  },
  de: {
    SHARED_TWEETS: 'Geteilte Tweets',
  },
  el: {
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
  },
  en: {
    SHARED_TWEETS: 'Shared Tweets',
  },
  es: {
    SHARED_TWEETS: 'Tweets compartidos',
  },
  eu: {
    SHARED_TWEETS: 'Partekatutako',
  },
  fa: {
    SHARED_TWEETS: 'توییتهای مشترک',
  },
  fi: {
    SHARED_TWEETS: 'Jaetut twiitit',
  },
  fil: {
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
  },
  fr: {
    SHARED_TWEETS: 'Tweets partagés',
  },
  ga: {
    SHARED_TWEETS: 'Tweetanna Roinnte',
  },
  gl: {
    SHARED_TWEETS: 'Chíos compartidos',
  },
  gu: {
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
  },
  he: {
    SHARED_TWEETS: 'ציוצים משותפים',
  },
  hi: {
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
  },
  hr: {
    SHARED_TWEETS: 'Dijeljeni tweetovi',
  },
  hu: {
    SHARED_TWEETS: 'Megosztott tweetek',
  },
  id: {
    SHARED_TWEETS: 'Tweet yang Dibagikan',
  },
  it: {
    SHARED_TWEETS: 'Tweet condivisi',
  },
  ja: {
    SHARED_TWEETS: '共有ツイート',
  },
  kn: {
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
  },
  ko: {
    SHARED_TWEETS: '공유 트윗',
  },
  mr: {
    SHARED_TWEETS: 'सामायिक ट्विट',
  },
  ms: {
    SHARED_TWEETS: 'Tweet Berkongsi',
  },
  nb: {
    SHARED_TWEETS: 'Delte tweets',
  },
  nl: {
    SHARED_TWEETS: 'Gedeelde Tweets',
  },
  pl: {
    SHARED_TWEETS: 'Udostępnione Tweety',
  },
  pt: {
    SHARED_TWEETS: 'Tweets Compartilhados',
  },
  ro: {
    SHARED_TWEETS: 'Tweeturi partajate',
  },
  ru: {
    SHARED_TWEETS: 'Общие твиты',
  },
  sk: {
    SHARED_TWEETS: 'Zdieľané Tweety',
  },
  sr: {
    SHARED_TWEETS: 'Дељени твитови',
  },
  sv: {
    SHARED_TWEETS: 'Delade tweetsen',
  },
  ta: {
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
  },
  th: {
    SHARED_TWEETS: 'ทวีตที่แชร์',
  },
  tr: {
    SHARED_TWEETS: 'Paylaşılan Tweetler',
  },
  uk: {
    SHARED_TWEETS: 'Спільні твіти',
  },
  ur: {
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
  },
  vi: {
    SHARED_TWEETS: 'Tweet được chia sẻ',
  },
  'zh-Hant': {
    SHARED_TWEETS: '分享的推文',
  },
  zh: {
    SHARED_TWEETS: '分享的推文',
  },
}

// These codes are from Twitter's own locale files - we can use them to create
// locales with just the translations we need.
let template = {
  ADD_MUTED_WORD: 'd768049b',
  HOME: 'ha8209bb',
  LATEST_TWEETS: 'd126cb7c',
  MUTE_THIS_CONVERSATION: 'e2d6c17e',
  QUOTE_TWEET: 'c9d7235d',
  QUOTE_TWEETS: 'bd7c039f',
  RETWEETS: 'd497b854',
  TIMELINE_OPTIONS: 'gf85d8c5',
  TWITTER: 'd2fb334b',
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
    locale[key] = src.match(new RegExp(`"${code}","([^"]+)"`))[1]
  }
  let localeCode = file.split('.')[0]
  if (localeCode != 'en' && locale.TWITTER == 'Twitter') delete locale.TWITTER
  if (localeCode != 'en' && locale.TIMELINE_OPTIONS == 'Timeline options') delete locale.TIMELINE_OPTIONS
  Object.assign(locale, externalTranslations[localeCode])
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync('locales.js', JSON.stringify(locales, null, 2), {
  encoding: 'utf8',
})
