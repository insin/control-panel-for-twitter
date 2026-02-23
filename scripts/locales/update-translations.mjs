import fs from 'node:fs'
import path from 'node:path'

import { sortProperties } from '../lib.mjs'

const [translationKey, code, localesDir = 'js'] = process.argv.slice(2)
if (!translationKey || !code) {
  console.log(
    `
Copies a translation from Twitter's locale files to ../translations.json

Usage:
  node update-translations.mjs translationKey 123456
  node update-translations.mjs translationKey 123456 ./old
`.trim(),
  )
  process.exit(1)
}

const srcLocales = ['en', 'es', 'fr', 'it', 'ja', 'ko', 'zh']
// Maps from Twitter locale code to web extension locale code where they differ
const destLocales = { zh: 'zh_CN' }
const translations = JSON.parse(fs.readFileSync('../translations.json', 'utf-8'))
translations[translationKey] = {}

for (const srcLocale of srcLocales) {
  const srcPath = path.join(localesDir, `${srcLocale}.js`)
  const src = fs.readFileSync(srcPath, { encoding: 'utf8' })
  const match = src.match(new RegExp(`"${code}","([^"]+)"`))
  if (match) {
    const destLocale = destLocales[srcLocale] || srcLocale
    translations[translationKey][destLocale] = match[1]
  } else {
    console.log('no match', { srcPath, code })
  }
}

fs.writeFileSync(
  '../translations.json',
  JSON.stringify(sortProperties(translations), null, 2),
  'utf8',
)
