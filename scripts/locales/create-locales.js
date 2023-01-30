const fs = require('fs')
const path = require('path')

const externalTranslations = {
  'ar-x-fm': {
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
  },
  ar: {
    RETWEETS: 'إعادات التغريد',
    SHARED_TWEETS: 'التغريدات المشتركة',
  },
  bg: {
    RETWEETS: 'Ретуитове',
    SHARED_TWEETS: 'Споделени туитове',
  },
  bn: {
    RETWEETS: 'পুনঃটুইটগুলো',
    SHARED_TWEETS: 'ভাগ করা টুইটগুলি',
  },
  ca: {
    RETWEETS: 'Retuits',
    SHARED_TWEETS: 'Tuits compartits',
  },
  cs: {
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Sdílené tweety',
  },
  da: {
    SHARED_TWEETS: 'Delte tweets',
  },
  de: {
    SHARED_TWEETS: 'Geteilte Tweets',
  },
  el: {
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Κοινόχρηστα Tweets',
  },
  en: {
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
  },
  es: {
    SHARED_TWEETS: 'Tweets compartidos',
  },
  eu: {
    RETWEETS: 'Bertxioak',
    SHARED_TWEETS: 'Partekatutako',
  },
  fa: {
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
  },
  fi: {
    RETWEETS: 'Uudelleentwiittaukset',
    SHARED_TWEETS: 'Jaetut twiitit',
  },
  fil: {
    RETWEETS: 'Mga Retweet',
    SHARED_TWEETS: 'Mga Ibinahaging Tweet',
  },
  fr: {
    SHARED_TWEETS: 'Tweets partagés',
  },
  ga: {
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
  },
  gl: {
    RETWEETS: 'Rechouchíos',
    SHARED_TWEETS: 'Chíos compartidos',
  },
  gu: {
    RETWEETS: 'પુનટ્વીટ્સ',
    SHARED_TWEETS: 'શેર કરેલી ટ્વીટ્સ',
  },
  he: {
    RETWEETS: 'ציוצים מחדש',
    SHARED_TWEETS: 'ציוצים משותפים',
  },
  hi: {
    RETWEETS: 'रीट्वीट्स',
    SHARED_TWEETS: 'साझा किए गए ट्वीट',
  },
  hr: {
    RETWEETS: 'Proslijeđeni tweetovi',
    SHARED_TWEETS: 'Dijeljeni tweetovi',
  },
  hu: {
    RETWEETS: 'Retweetek',
    SHARED_TWEETS: 'Megosztott tweetek',
  },
  id: {
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet yang Dibagikan',
  },
  it: {
    RETWEETS: 'Retweet',
    SHARED_TWEETS: 'Tweet condivisi',
  },
  ja: {
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
  },
  kn: {
    RETWEETS: 'ಮರುಟ್ವೀಟ್‌ಗಳು',
    SHARED_TWEETS: 'ಹಂಚಿದ ಟ್ವೀಟ್‌ಗಳು',
  },
  ko: {
    RETWEETS: '리트윗',
    SHARED_TWEETS: '공유 트윗',
  },
  mr: {
    RETWEETS: 'पुनर्ट्विट्स',
    SHARED_TWEETS: 'सामायिक ट्विट',
  },
  ms: {
    RETWEETS: 'Tweet semula',
    SHARED_TWEETS: 'Tweet Berkongsi',
  },
  nb: {
    SHARED_TWEETS: 'Delte tweets',
  },
  nl: {
    SHARED_TWEETS: 'Gedeelde Tweets',
  },
  pl: {
    RETWEETS: 'Tweety podane dalej',
    SHARED_TWEETS: 'Udostępnione Tweety',
  },
  pt: {
    SHARED_TWEETS: 'Tweets Compartilhados',
  },
  ro: {
    RETWEETS: 'Retweeturi',
    SHARED_TWEETS: 'Tweeturi partajate',
  },
  ru: {
    RETWEETS: 'Ретвиты',
    SHARED_TWEETS: 'Общие твиты',
  },
  sk: {
    RETWEETS: 'Retweety',
    SHARED_TWEETS: 'Zdieľané Tweety',
  },
  sr: {
    RETWEETS: 'Ретвитови',
    SHARED_TWEETS: 'Дељени твитови',
  },
  sv: {
    SHARED_TWEETS: 'Delade tweetsen',
  },
  ta: {
    RETWEETS: 'மறுகீச்சுகள்',
    SHARED_TWEETS: 'பகிரப்பட்ட ட்வீட்டுகள்',
  },
  th: {
    RETWEETS: 'รีทวีต',
    SHARED_TWEETS: 'ทวีตที่แชร์',
  },
  tr: {
    RETWEETS: 'Retweetler',
    SHARED_TWEETS: 'Paylaşılan Tweetler',
  },
  uk: {
    RETWEETS: 'Ретвіти',
    SHARED_TWEETS: 'Спільні твіти',
  },
  ur: {
    RETWEETS: 'ریٹویٹس',
    SHARED_TWEETS: 'مشترکہ ٹویٹس',
  },
  vi: {
    RETWEETS: 'Các Tweet lại',
    SHARED_TWEETS: 'Tweet được chia sẻ',
  },
  'zh-Hant': {
    RETWEETS: '轉推',
    SHARED_TWEETS: '分享的推文',
  },
  zh: {
    RETWEETS: '转推',
    SHARED_TWEETS: '分享的推文',
  },
}

// These codes are from Twitter's own locale files - we can use them to create
// locales with just the translations we need.
let template = {
  ADD_MUTED_WORD: 'd768049c',
  DISCOVER_MORE: 'd172116a',
  HOME: 'ha8209bc',
  MUTE_THIS_CONVERSATION: 'e2d6c17e',
  QUOTE_TWEET: 'c9d7235e',
  QUOTE_TWEETS: 'bd7c0390',
  TWITTER: 'd2fb334c',
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
  if (localeCode != 'en' && locale.TWITTER == 'Twitter') delete locale.TWITTER
  if (localeCode != 'en' && locale.DISCOVER_MORE == 'Discover more')
    delete locale.DISCOVER_MORE
  Object.assign(locale, externalTranslations[localeCode])
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync('locales.js', 'let locales = ' + JSON.stringify(locales, null, 2), {
  encoding: 'utf8',
})
