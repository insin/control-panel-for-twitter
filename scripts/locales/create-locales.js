const fs = require('fs')
const path = require('path')

const {sortProperties} = require('../utils')

/** @type Record<string,Record<string, string>> */
const locales = JSON.parse(fs.readFileSync('./base-locales.json', 'utf-8'))

// These codes are from Twitter's locale files
let template = {
  ACCOUNT_BASED_IN_FN: 'a570931f',
  ADD_MUTED_WORD: 'd768049c',
  GROK_ACTIONS: 'e3eceda6',
  HOME: 'ha8209bc',
  LIKES: 'd7b8ebaa',
  LIVE_ON_X: 'd961a4a0',
  MUTE_THIS_CONVERSATION: 'e2d6c17e',
  POST_ALL: 'ge8e4a38',
  PROFILE_SUMMARY: 'fc7db594',
  QUOTE: 'bb5c5864',
  QUOTES: 'j45978a8',
  RECENT: 'a8d68f62',
  RELEVANT: 'h67428e2',
  REPOST: 'g062295e',
  REPOSTS: 'ja42739e',
  SHOW: 'a0e81a2e',
  SHOW_MORE_REPLIES: 'c837fcaa',
  SORT_BY: 'e2a098dc',
  SORT_REPLIES: 'j9a4bb28',
}

for (let file of fs.readdirSync('./js')) {
  if (!file.endsWith('.js')) continue
  let localeCode = file.split('.')[0]
  let locale = locales[localeCode]
  let src = fs.readFileSync(path.join('js', file), {encoding: 'utf8'})
  for (let [key, code] of Object.entries(template)) {
    if (key.endsWith('_FN')) {
      let match = src.match(
        new RegExp(`"${code}",\\((function\\([a-z]\\)[^)]+)\\)`),
      )
      if (match) {
        locale[key] = match[1]
      } else {
        console.log('no function match', {file, key, code})
      }
    } else {
      let match = src.match(new RegExp(`"${code}","([^"]+)"`))
      if (!match) match = src.match(new RegExp(`"${code}",'([^']+)'`))
      if (match) {
        locale[key] = match[1]
      } else {
        console.log('no string match', {file, key, code})
      }
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
  // prettier-ignore
  `const locales = {
${Object.entries(locales).map(
  ([lang, locale]) => `  "${lang}": {\n${Object.entries(locale).map(
    ([k, v]) => `    ${k}: ${k.endsWith('_FN') ? v : JSON.stringify(v)}`
  ).join(',\n')}\n  }`
).join(',\n')}
}`,
  'utf8',
)
