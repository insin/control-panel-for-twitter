import fs from 'node:fs'

if (process.argv.some((arg) => /^-h|--help$/.test(arg))) {
  console.log(
    `
Removes a key from  ../_locales/**/messages.json
`.trim(),
  )
  process.exit()
}

const messageKey = process.argv[2]

if (!messageKey) {
  console.log(
    `
Usage:
  node remove-locale-messages.mjs key
`.trim(),
  )
  process.exit(1)
}

const localeCodes = fs
  .readdirSync('../_locales/', { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

for (const localeCode of localeCodes) {
  const messagesFile = `../_locales/${localeCode}/messages.json`
  const json = JSON.parse(fs.readFileSync(messagesFile, 'utf8'))
  if (Object.hasOwn(json, messageKey)) {
    delete json[messageKey]
    fs.writeFileSync(messagesFile, JSON.stringify(json, null, 2) + '\n', 'utf8')
  } else {
    console.log(`${messageKey} not found in ${messagesFile}`)
  }
}
