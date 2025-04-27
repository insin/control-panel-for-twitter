const fs = require('fs')

const {sortProperties} = require('./lib')

if (process.argv.some(arg => /^-h|--help$/.test(arg))) {
  console.log(`
Updates ../_locales/**/messages.json with translations from ./scripts/translations.json

Where translations.json is in the format:

  {
    "exampleMessageLabel": {
      "en": "English version",
      "es": "Versión en español"
    }
  }
`.trim()
  )
  process.exit()
}

let translationsJson = JSON.parse(fs.readFileSync('./translations.json', 'utf-8'))
let localeMessagesJson = new Map()

for (let [messageProp, translations] of Object.entries(translationsJson)) {
  for (let [localeCode, message] of Object.entries(translations)) {
    if (!localeMessagesJson.has(localeCode)) {
      localeMessagesJson.set(
        localeCode,
        JSON.parse(
          fs.readFileSync(`../_locales/${localeCode}/messages.json`, 'utf-8')
        )
      )
    }
    let messagesJson = localeMessagesJson.get(localeCode)
    let update = typeof message == 'string' ? {message} : message
    messagesJson[messageProp] = {...messagesJson[messageProp], ...update}
  }
}

for (let [localeCode, messagesJson] of localeMessagesJson.entries()) {
  fs.writeFileSync(
    `../_locales/${localeCode}/messages.json`,
    JSON.stringify(sortProperties(messagesJson), null, 2),
    'utf8'
  )
}
