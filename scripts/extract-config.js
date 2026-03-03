const fs = require('fs')
const path = require('path')

const scriptFile = path.join(__dirname, '..', 'script.js')
const configFile = path.join(__dirname, '..', 'current.config.txt')
const mv2File = path.join(__dirname, '..', 'manifest.mv2.json')
const mv3File = path.join(__dirname, '..', 'manifest.mv3.json')

// Extract config from script.js
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

// Ensure fork version suffix on manifests
for (const [file, label] of [[mv2File, 'MV2'], [mv3File, 'MV3']]) {
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'))
  const ver = manifest.version

  if (!ver.endsWith('.1')) {
    manifest.version = ver + '.1'
    console.log(`${label}: ${ver} -> ${manifest.version}`)
  }

  if (label === 'MV3') {
    const base = manifest.version.replace(/\.1$/, '')
    manifest.version_name = base + '-fork'
  }

  fs.writeFileSync(file, JSON.stringify(manifest, null, 2) + '\n')
}
