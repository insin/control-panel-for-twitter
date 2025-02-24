const fs = require('fs')
const path = require('path')

const {sortProperties} = require('../utils')

/** @type Record<string,Record<string, string>> */
const locales = JSON.parse(fs.readFileSync('./base-locales.json', 'utf-8'))

// These codes are from Twitter's locale files
let template = {
  ADD_MUTED_WORD: 'd768049c',
  GROK_ACTIONS: 'e3eceda6',
  HOME: 'ha8209bc',
  LIKES: 'd7b8ebaa',
  MUTE_THIS_CONVERSATION: 'e2d6c17e',
  POST_ALL: 'ge8e4a38',
  PROFILE_SUMMARY: 'fc7db594',
  QUOTE: 'bb5c5864',
  QUOTES: 'j45978a8',
  REPOST: 'g062295e',
  REPOSTS: 'ja42739e',
  SHOW: 'a0e81a2e',
  SHOW_MORE_REPLIES: 'c837fcaa',
  SORT_REPLIES_BY: 'ad6e11ac',
}

for (let file of fs.readdirSync('./js')) {
  if (!file.endsWith('.js')) continue
  let localeCode = file.split('.')[0]
  let locale = locales[localeCode]
  let src = fs.readFileSync(path.join('js', file), {encoding: 'utf8'})
  for (let [key, code] of Object.entries(template)) {
    let match = src.match(new RegExp(`"${code}","([^"]+)"`))
    if (!match) match = src.match(new RegExp(`"${code}",'([^']+)'`))
    if (match) {
      locale[key] = match[1]
    } else {
      console.log('no match', {file, key, code})
    }
  }
  locales[localeCode] = sortProperties(locale)
}

// Delete translations which duplicate English (the fallback locale)
for (let localeCode in locales) {
  if (localeCode == 'en') continue
  let locale = locales[localeCode]
  for (let translationKey in locale) {
    if (locale[translationKey] == locales['en'][translationKey]) {
      delete locale[translationKey]
    }
  }
}

fs.writeFileSync(
  'locales.js',
  `const locales = ${JSON.stringify(locales, null, 2)}`,
  'utf8'
)
