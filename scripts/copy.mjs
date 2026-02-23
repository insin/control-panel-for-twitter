import { copy } from './lib.mjs'

const dryRun = process.argv.includes('--dry-run')
const local = process.argv.includes('--local')
const manifestVersion = Number(process.argv[2])

if (!manifestVersion || (manifestVersion != 2 && manifestVersion != 3)) {
  console.log(
    `
Usage:
  npm run copy (2|3)
`.trim(),
  )
  process.exit(1)
}

copy(manifestVersion, { dryRun, local })
