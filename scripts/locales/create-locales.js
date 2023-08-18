const fs = require('fs')
const path = require('path')

const locales = JSON.parse(fs.readFileSync('./base-locales.json', 'utf-8'))

// These codes are from Twitter's locale files
let template = {
  ADD_MUTED_WORD: 'd768049c',
  HOME: 'ha8209bc',
  MUTE_THIS_CONVERSATION: 'e2d6c17e',
  POST_ALL: 'ge8e4a38',
  REPOST: 'g062295e',
  REPOSTS: 'ja42739e',
  SHOW: 'a0e81a2e',
  SHOW_MORE_REPLIES: 'c837fcaa',
}

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
  let localeCode = file.split('.')[0]
  let locale = locales[localeCode]
  let src = fs.readFileSync(path.join('js', file), {encoding: 'utf8'})
  for (let [key, code] of Object.entries(template)) {
    let match = src.match(new RegExp(`"${code}","([^"]+)"`))
    if (match) {
      locale[key] = match[1]
    } else {
      console.log('no match', {file, key, code})
    }
  }
  if (localeCode != 'en') {
    if (locale.REPOSTS == 'Reposts') delete locale.REPOSTS
  }
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync(
  'locales.js',
  `const locales = ${JSON.stringify(locales, null, 2)}`,
  'utf8'
)
