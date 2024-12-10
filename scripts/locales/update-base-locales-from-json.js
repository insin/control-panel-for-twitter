const fs = require('fs')
const path = require('path')

const {sortProperties} = require('../utils')

const baseLocales = JSON.parse(fs.readFileSync('./base-locales.json', 'utf-8'))

const [translationsFile] = process.argv.slice(2)
if (!translationsFile) {
  console.log(
    `
Copies translations from a translations JSON file to base-locales.json

Where the translations JSON file is in the format:

  {
    "NEW_TRANSLATION_KEY": {
      "en": "English version",
      "es": "Versión en español"
    }
  }

Usage:
  node update-base-locales-from-json.js base-translations.json
`.trim()
  )
  process.exit(1)
}

if (!fs.existsSync(translationsFile)) {
  console.error(`${translationsFile} does not exist`)
  process.exit(1)
}

let translationsJson
try {
  translationsJson = JSON.parse(fs.readFileSync(translationsFile, 'utf-8'))
} catch (err) {
  console.error(`error parsing ${translationsFile}: ${err}`)
  process.exit(1)
}

for (let [translationKey, translations] of Object.entries(translationsJson)) {
  for (let [localeCode, message] of Object.entries(translations)) {
    baseLocales[localeCode][translationKey] = message
    baseLocales[localeCode] = sortProperties(baseLocales[localeCode])
  }
}

fs.writeFileSync(
  'base-locales.json',
  JSON.stringify(baseLocales, null, 2),
  'utf8'
)
