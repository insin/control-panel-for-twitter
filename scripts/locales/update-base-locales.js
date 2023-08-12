const fs = require('fs')
const path = require('path')

const locales = JSON.parse(fs.readFileSync('./base-locales.json', 'utf-8'))

const [key, code, localesDir = 'js'] = process.argv.slice(2)
if (!key || !code) {
  console.log(`
Usage:
  node update-base-locales.js TWEET 123456
  node update-base-locales.js TWEET 123456 ./old
`.trim())
  process.exit(1)
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

for (let file of fs.readdirSync(localesDir)) {
  if (!file.endsWith('.js')) continue
  let localeCode = file.split('.')[0]
  let locale = locales[localeCode]
  let src = fs.readFileSync(path.join(localesDir, file), {encoding: 'utf8'})
  let match = src.match(new RegExp(`"${code}","([^"]+)"`))
  if (match) {
    locale[key] = match[1]
  } else {
    console.log('no match', {file, key, code})
  }
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync('base-locales.json', JSON.stringify(locales, null, 2), 'utf8')
