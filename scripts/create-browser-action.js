// Creates browser_action.html, which is just options.html with styling to
// control the popup width appropriately for each browser.
const fs = require('fs')

let options = fs.readFileSync('./options.html', {encoding: 'utf8'})

// Generate build datetime
const buildDate = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'

// Add browserAction class and inject build datetime
let modifiedOptions = options
  .replace('<body>', '<body class="browserAction">')
  .replace('<form>', `<form>\n    <div class="buildDate">Built: ${buildDate}</div>`)

fs.writeFileSync(
  './browser_action.html',
  modifiedOptions,
  {encoding: 'utf8'}
)