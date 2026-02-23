import fs from 'node:fs'
import path from 'node:path'

let curlConfig = ''
for (const file of fs.readdirSync('./html')) {
  if (!file.endsWith('.html')) continue
  const localeCode = file.split('.')[0]
  const html = fs.readFileSync(path.join('html', file), { encoding: 'utf8' })
  const match = html.match(
    new RegExp(
      `https://abs\\.twimg\\.com/responsive-web/client-web/i18n/${localeCode}\\.(?:[a-z\\d]+)\\.js`,
    ),
  )

  if (!match) {
    console.log('could not find locale file URL', { file, localeCode })
    continue
  }

  curlConfig += `-o ${localeCode}.js\nurl="${match[0]}"\n`
}

fs.writeFileSync('./js/_files.txt', curlConfig)
