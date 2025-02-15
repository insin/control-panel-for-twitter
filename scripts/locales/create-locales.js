const fs = require('fs')
const path = require('path')

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
    if (!match) match = src.match(new RegExp(`"${code}",'([^']+)'`))
    if (match) {
      locale[key] = match[1]
    } else {
      console.log('no match', {file, key, code})
    }
  }
  if (localeCode != 'en') {
    if (locale.ADD_MUTED_WORD == 'Add muted word') delete locale.ADD_MUTED_WORD
    if (locale.HOME == 'Home') delete locale.HOME
    if (locale.MUTE_THIS_CONVERSATION == 'Mute this conversation')
      delete locale.MUTE_THIS_CONVERSATION
    if (locale.POST_ALL == 'Post all') delete locale.POST_ALL
    if (locale.PROFILE_SUMMARY == 'Profile Summary')
      delete locale.PROFILE_SUMMARY
    if (locale.QUOTE == 'Quote') delete locale.QUOTE
    if (locale.QUOTES == 'Quotes') delete locale.QUOTES
    if (locale.REPOST == 'Repost') delete locale.REPOST
    if (locale.REPOSTS == 'Reposts') delete locale.REPOSTS
    if (locale.SHOW == 'Show') delete locale.SHOW
    if (locale.SHOW_MORE_REPLIES == 'Show more replies')
      delete locale.SHOW_MORE_REPLIES
  }
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync(
  'locales.js',
  `const locales = ${JSON.stringify(locales, null, 2)}`,
  'utf8'
)
