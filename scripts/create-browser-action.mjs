// Creates browser_action.html, which is just options.html with styling to
// control the popup width appropriately for each browser.
import fs from 'node:fs'

const options = fs.readFileSync('./options.html', { encoding: 'utf8' })

fs.writeFileSync(
  './browser_action.html',
  options.replace('<body>', '<body class="browserAction">'),
  { encoding: 'utf8' },
)
