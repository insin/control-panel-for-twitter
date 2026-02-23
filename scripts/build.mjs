import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { clean, copy } from './lib.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getExtensionsProId() {
  const source = fs.readFileSync('extensions-pro-id.js', 'utf8')
  const match = source.match(/export const EXTENSIONS_PRO_ID = (\d+)/)
  if (!match) throw new Error('EXTENSIONS_PRO_ID not found in extensions-pro-id.js')
  return Number(match[1])
}

function copySettingsSchemas() {
  const extensionsProId = getExtensionsProId()
  const schemasDir = path.resolve(__dirname, '../../pro.soitis.dev/api/extension-settings-schemas')

  fs.mkdirSync(schemasDir, { recursive: true })
  fs.copyFileSync('ext-shared.js', path.join(schemasDir, 'ext-shared.js'))
  fs.copyFileSync('schemas.js', path.join(schemasDir, `${extensionsProId}.js`))
  console.log(`Copied settings schemas to: ${schemasDir}`)
}

/** @type {import('./types').ManifestVersion[]} */
let manifestVersions = [2, 3]
if (process.argv[2]) {
  const manifestVersion = Number(process.argv[2])
  if (manifestVersion == 2 || manifestVersion == 3) {
    manifestVersions = [manifestVersion]
  }
}

copySettingsSchemas()

for (const manifestVersion of manifestVersions) {
  console.log(`\nBuilding MV${manifestVersion} version`)
  const manifestFile = `manifest.mv${manifestVersion}.json`
  const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
  copy(manifestVersion)
  execSync('web-ext build', { stdio: 'inherit' })
  const renameTo = `./web-ext-artifacts/control_panel_for_twitter-${manifestData.version}.mv${manifestVersion}.zip`
  fs.renameSync(
    `./web-ext-artifacts/control_panel_for_twitter-${manifestData.version}.zip`,
    renameTo,
  )
  console.log('Moved to:', path.resolve(renameTo))
  clean()
}
