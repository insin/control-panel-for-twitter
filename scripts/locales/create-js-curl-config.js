const fs = require('fs')
const path = require('path')

let curlConfig = ''
for (let file of fs.readdirSync('./html')) {
  if (!file.endsWith('.html')) continue
  let localeCode = file.split('.')[0]
  let html = fs.readFileSync(path.join('html', file), {encoding: 'utf8'})
  let match = html.match(
    new RegExp(
      `https://abs\\.twimg\\.com/responsive-web/client-web/i18n/${localeCode}\\.(?:[a-z\\d]+)\\.js`
    )
  )

  if (!match) {
    console.log('could not find locale file URL', {file, localeCode})
    continue
  }

  curlConfig += `-o ${localeCode}.js\nurl="${match[0]}"\n`
}

fs.writeFileSync('./js/_files.txt', curlConfig)
