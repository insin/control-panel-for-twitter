import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { clean, copy, getEdition } from './lib.mjs'

const edition = getEdition()
const preview = process.argv.includes('--preview')
if (preview && edition != 'v4') throw new Error('--preview requires --edition=v4')

/** @type {import('./types').ManifestVersion[]} */
let manifestVersions = [2, 3]
if (process.argv[2]) {
  const manifestVersion = Number(process.argv[2])
  if (manifestVersion == 2 || manifestVersion == 3) {
    manifestVersions = [manifestVersion]
  }
}

for (const manifestVersion of manifestVersions) {
  console.log(`\nBuilding MV${manifestVersion} version`)
  const manifestFile = `manifest${edition == 'v4' ? '.v4' : ''}.mv${manifestVersion}.json`
  const manifestData = JSON.parse(fs.readFileSync(manifestFile, 'utf8'))
  copy(manifestVersion, { edition })
  if (preview) {
    const manifest = JSON.parse(fs.readFileSync('./manifest.json', 'utf8'))
    manifest.name += ' (Preview)'
    if (manifestVersion == 2) {
      manifest.browser_specific_settings.gecko.id = 'control-panel-for-twitter-preview@soitis.dev'
    }
    fs.writeFileSync('./manifest.json', JSON.stringify(manifest, null, 2) + '\n')
  }
  const suffix = preview
    ? `preview-${manifestVersion == 2 ? 'firefox' : 'chromium'}.mv${manifestVersion}`
    : `mv${manifestVersion}`
  const filename = `control_panel_for_twitter-${manifestData.version}.${suffix}.zip`
  execFileSync('web-ext', ['build', '--filename', filename], { stdio: 'inherit' })
  console.log('Built:', path.resolve('./web-ext-artifacts', filename))
  clean()
}
