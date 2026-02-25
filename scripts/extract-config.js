const fs = require('fs')
const path = require('path')

const scriptFile = path.join(__dirname, '..', 'script.js')
const configFile = path.join(__dirname, '..', 'current.config.txt')

const script = fs.readFileSync(scriptFile, 'utf8')
const match = script.match(/\/\/#region Default config[\s\S]*?const config = \{([\s\S]*?)\n\}/)
if (!match) {
  console.error('No config block found in script.js')
  process.exit(1)
}

const lines = match[1].trim().split('\n')
const config = {}
for (const line of lines) {
  const m = line.match(/^\s*(?:\/\/.*)?(\w+):\s*(.+?),?\s*$/)
  if (!m) continue
  const [, key, val] = m
  try {
    config[key] = JSON.parse(val.replace(/'/g, '"'))
  } catch {
    config[key] = val.replace(/^'|'$/g, '')
  }
}

fs.writeFileSync(configFile, JSON.stringify(config, null, 2) + '\n')
console.log(`Extracted ${Object.keys(config).length} keys to current.config.txt`)
