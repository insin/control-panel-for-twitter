import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

import { clean, copy, getEdition } from './lib.mjs'

const edition = getEdition()

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
  execSync('web-ext build', { stdio: 'inherit' })
  const renameTo = `./web-ext-artifacts/control_panel_for_twitter-${manifestData.version}.mv${manifestVersion}.zip`
  fs.renameSync(
    `./web-ext-artifacts/control_panel_for_twitter-${manifestData.version}.zip`,
    renameTo,
  )
  console.log('Moved to:', path.resolve(renameTo))
  clean()
}
