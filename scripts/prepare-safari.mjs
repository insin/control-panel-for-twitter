import { getEdition } from './lib.mjs'
import { prepareSafari } from './safari.mjs'

prepareSafari({ edition: getEdition(), local: process.argv.includes('--local') })
