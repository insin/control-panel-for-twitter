import fs from 'node:fs'
import path from 'node:path'

import { sortProperties } from '../lib.mjs'

const locales = JSON.parse(fs.readFileSync('./base-locales.json', 'utf-8'))

const [key, code, localesDir = 'js'] = process.argv.slice(2)
if (!key || !code) {
  console.log(
    `
Copies a translation from Twitter's locale files to ./base-locales.json

Usage:
  node update-base-locales.mjs TWEET 123456
  node update-base-locales.mjs TWEET 123456 ./old
`.trim(),
  )
  process.exit(1)
}

for (const file of fs.readdirSync(localesDir)) {
  if (!file.endsWith('.js')) continue
  const localeCode = file.split('.')[0]
  const locale = locales[localeCode]
  const src = fs.readFileSync(path.join(localesDir, file), { encoding: 'utf8' })
  const match = src.match(new RegExp(`"${code}","([^"]+)"`))
  if (match) {
    locale[key] = match[1]
  } else {
    console.log('no match', { file, key, code })
  }
  locales[localeCode] = sortProperties(locale)
}

fs.writeFileSync('base-locales.json', JSON.stringify(locales, null, 2), 'utf8')
