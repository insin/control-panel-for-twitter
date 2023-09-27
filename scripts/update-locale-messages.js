const fs = require('fs')

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

function sortProperties(locale) {
  let entries = Object.entries(locale)
  entries.sort(([a], [b]) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
  return Object.fromEntries(entries)
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
    messagesJson[messageProp] = {...messagesJson[messageProp], message}
  }
}

for (let [localeCode, messagesJson] of localeMessagesJson.entries()) {
  fs.writeFileSync(
    `../_locales/${localeCode}/messages.json`,
    JSON.stringify(sortProperties(messagesJson), null, 2),
    'utf8'
  )
}
