const fs = require('fs')
const path = require('path')

// These codes are from Twitter's own locale files - we can use them to create
// locales with just the translations we need.
let template = {
  ADD_MUTED_WORD: 'd768049b',
  HOME: 'ha8209bb',
  LATEST_TWEETS: 'd126cb7c',
  QUOTE_TWEET: 'c9d7235d',
  QUOTE_TWEETS: 'bd7c039f',
  RETWEETS: 'd497b854',
  TWITTER: 'd2fb334b',
}

let locales = {}

for (let file of fs.readdirSync('./files')) {
  let locale = {}
  let src = fs.readFileSync(path.join('files', file), {encoding: 'utf8'})
  for (let [key, code] of Object.entries(template)) {
    locale[key] = src.match(new RegExp(`"${code}","([^"]+)"`))[1]
  }
  if (locale.TWITTER == 'Twitter') delete locale.TWITTER
  locale.SHARED_TWEETS = ''
  locales[file.split('.')[0]] = locale
}

fs.writeFileSync('locales.js', JSON.stringify(locales, null, 2), {encoding: 'utf8'})