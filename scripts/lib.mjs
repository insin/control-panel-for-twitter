import fs from 'node:fs'

/**
 * @param {{dryRun?: boolean}} [options]
 */
export function clean(options = {}) {
  const { dryRun = false } = options
  const mvFileRegExp = /\.mv[23]\./

  for (const file of fs.readdirSync('.', { withFileTypes: true })) {
    if (file.isDirectory() || !mvFileRegExp.test(file.name)) continue

    const copiedFile = file.name.replace(mvFileRegExp, '.')
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
 * @param {{dryRun?: boolean, local?: boolean}} [options]
 */
export function copy(manifestVersion, options = {}) {
  const { dryRun = false, local = false } = options
  const mvFileRegExp = new RegExp(`\\.mv${manifestVersion}\\.`)

  for (const file of fs.readdirSync('.', { withFileTypes: true })) {
    if (file.isDirectory() || !mvFileRegExp.test(file.name)) continue

    const copyTo = file.name.replace(mvFileRegExp, '.')
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
