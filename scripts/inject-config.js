const fs = require('fs')
const path = require('path')

const configFile = path.join(__dirname, '..', 'current.config.txt')
const scriptFile = path.join(__dirname, '..', 'script.js')
const manifestFile = path.join(__dirname, '..', 'manifest.mv3.json')

// Check if current.config.txt exists
if (!fs.existsSync(configFile)) {
  console.log('⚠️  current.config.txt not found, skipping config injection')
  process.exit(0)
}

console.log('📝 Injecting config from current.config.txt...')

// Read the config file
let config
try {
  const configData = fs.readFileSync(configFile, 'utf8')
  config = JSON.parse(configData)
} catch (error) {
  console.error('❌ Error reading/parsing current.config.txt:', error.message)
  process.exit(1)
}

// Read manifest to get version
let appVersion = '4.15.2' // fallback
try {
  const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
  appVersion = manifestData.version
} catch (error) {
  console.warn('⚠️  Could not read version from manifest, using fallback:', appVersion)
}

// Add metadata
const buildDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
config._appVersion = appVersion
config._buildDate = buildDate

console.log(`   App Version: ${appVersion}`)
console.log(`   Build Date: ${buildDate}`)

// Read script.js
let scriptContent = fs.readFileSync(scriptFile, 'utf8')

// Find and replace the default config
// Match from "const config = {" to the closing "}"
// The config block is between lines ~45-150, ending with the last config property before comments
const configRegex = /(\/\/#region Default config[\s\S]*?const config = \{)([\s\S]*?)(\n\})/

const match = scriptContent.match(configRegex)
if (!match) {
  console.error('❌ Could not find config block in script.js')
  process.exit(1)
}

// Generate new config string with proper indentation
const configEntries = Object.entries(config).map(([key, value]) => {
  let valueStr
  if (typeof value === 'string') {
    valueStr = `'${value.replace(/'/g, "\\'")}'`
  } else if (Array.isArray(value)) {
    valueStr = JSON.stringify(value)
  } else {
    valueStr = JSON.stringify(value)
  }
  return `  ${key}: ${valueStr},`
}).join('\n')

const newConfigBlock = `${match[1]}\n${configEntries}\n${match[3]}`

// Replace in script content
scriptContent = scriptContent.replace(configRegex, newConfigBlock)

// Write back to script.js
fs.writeFileSync(scriptFile, scriptContent, 'utf8')

console.log('✅ Config injected successfully')
console.log(`   ${Object.keys(config).length} config keys injected`)
