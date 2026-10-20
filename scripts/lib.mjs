import fs from 'node:fs'
import { parseArgs } from 'node:util'

export function createBrowserAction() {
  const options = fs.readFileSync('./options.html', 'utf8')
  fs.writeFileSync(
    './browser_action.html',
    options.replace('<body>', '<body class="browserAction">'),
  )
}

export function getEdition() {
  const { values } = parseArgs({
    options: { edition: { type: 'string', default: 'v4' } },
    allowPositionals: true,
    strict: false,
  })
  const edition = values.edition
  if (edition != 'v4' && edition != 'v5') throw new Error(`Unknown edition: ${edition}`)
  return edition
}

/**
 * @param {{dryRun?: boolean}} [options]
 */
export function clean(options = {}) {
  const { dryRun = false } = options
  const mvFileRegExp = /\.mv[23]\./

  for (const file of fs.readdirSync('.', { withFileTypes: true })) {
    if (file.isDirectory() || !/\.(?:mv[23]|v[45])\./.test(file.name)) continue

    const copiedFile = file.name.replace(mvFileRegExp, '.').replace(/\.v[45]\./, '.')
    if (fs.existsSync(copiedFile)) {
      if (!dryRun) {
        fs.rmSync(copiedFile)
      }
      console.log(`deleted ${copiedFile}`)
    }
  }
}

/**
 * @param {import('./types').ManifestVersion} manifestVersion
 * @param {{dryRun?: boolean, local?: boolean, edition?: 'v4' | 'v5'}} [options]
 */
export function copy(manifestVersion, options = {}) {
  const { dryRun = false, local = false, edition = 'v4' } = options
  if (local && edition != 'v5') throw new Error('--local requires --edition=v5')
  const mvFileRegExp = new RegExp(`\\.mv${manifestVersion}\\.`)
  const manifestFile = `manifest${edition == 'v4' ? '.v4' : ''}.mv${manifestVersion}.json`

  for (const file of fs.readdirSync('.', { withFileTypes: true })) {
    if (file.isDirectory()) continue
    if (/\.mv[23]\./.test(file.name) && !mvFileRegExp.test(file.name)) continue
    if (!mvFileRegExp.test(file.name) && !file.name.includes(`.${edition}.`)) continue

    if (/\.v[45]\./.test(file.name) && !file.name.includes(`.${edition}.`)) continue
    const copyTo = file.name.replace(mvFileRegExp, '.').replace(/\.v[45]\./, '.')
    if (copyTo == 'manifest.json' && file.name != manifestFile) continue
    if (!dryRun) {
      if (local && copyTo == 'manifest.json') {
        const manifest = fs
          .readFileSync(file.name, 'utf8')
          .replaceAll('"https://pro.soitis.dev/*"', '"http://localhost/*", $&')
        fs.writeFileSync(copyTo, manifest, 'utf8')
      } else {
        fs.copyFileSync(file.name, copyTo)
      }
    }
    console.log(`copied ${file.name} → ${copyTo}`)
  }
}

/**
 * @param {Record<string, any>} obj
 */
export function sortProperties(obj) {
  const entries = Object.entries(obj)
  entries.sort(([a], [b]) => {
    if (a < b) return -1
    if (a > b) return 1
    return 0
  })
  return Object.fromEntries(entries)
}
