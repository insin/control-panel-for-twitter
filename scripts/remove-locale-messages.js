const fs = require('fs')

if (process.argv.some(arg => /^-h|--help$/.test(arg))) {
  console.log(`
Removes a key from  ../_locales/**/messages.json
`.trim()
  )
  process.exit()
}

let messageKey = process.argv[2]

if (!messageKey) {
  console.log(`
Usage:
  node remove-locale-messages.js key
`.trim())
  process.exit(1)
}

let localeCodes = fs
  .readdirSync('../_locales/', {withFileTypes: true})
  .filter(d => d.isDirectory())
  .map(d => d.name)

for (let localeCode of localeCodes) {
  let messagesFile = `../_locales/${localeCode}/messages.json`
  let json = JSON.parse(fs.readFileSync(messagesFile, 'utf8'))
  if (Object.hasOwn(json, messageKey)) {
    delete json[messageKey]
    fs.writeFileSync(messagesFile, JSON.stringify(json, null, 2), 'utf8')
  } else {
    console.log(`${messageKey} not found in ${messagesFile}`)
  }
}