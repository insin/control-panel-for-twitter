import fs from 'node:fs'

import { sortProperties } from './lib.mjs'

if (process.argv.some((arg) => /^-h|--help$/.test(arg))) {
  console.log(
    `
Updates ../_locales/**/messages.json with translations from ./scripts/translations.json

Where translations.json is in the format:

  {
    "exampleMessage": {
      "en": "English version",
      "es": "Versión en español"
    }
  }
`.trim(),
  )
  process.exit()
}

const translationsJson = JSON.parse(fs.readFileSync('./translations.json', 'utf-8'))
const localeMessagesJson = new Map()

for (const [messageProp, translations] of Object.entries(translationsJson)) {
  for (const [localeCode, message] of Object.entries(translations)) {
    if (!localeMessagesJson.has(localeCode)) {
      localeMessagesJson.set(
        localeCode,
        JSON.parse(fs.readFileSync(`../_locales/${localeCode}/messages.json`, 'utf-8')),
      )
    }
    const messagesJson = localeMessagesJson.get(localeCode)
    const update = typeof message == 'string' ? { message } : message
    messagesJson[messageProp] = { ...messagesJson[messageProp], ...update }
  }
}

for (const [localeCode, messagesJson] of localeMessagesJson.entries()) {
  fs.writeFileSync(
    `../_locales/${localeCode}/messages.json`,
    JSON.stringify(sortProperties(messagesJson), null, 2) + '\n',
    'utf8',
  )
}
