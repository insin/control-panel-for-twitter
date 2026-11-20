import { readFile } from 'node:fs/promises'
import path from 'node:path'

import browserConfig from './web-ext-config.v5.js'

export default {
  // Reuse our whitelist while edition-specific build scripts are still present
  files: browserConfig.ignoreFiles
    .filter((file) => file.startsWith('!'))
    .map((file) => file.slice(1)),
  preview: {
    id: 'cpft-options-preview',
    parameters: {
      style: 'optionsStyle',
      site: 'lastSiteVersion',
      layout: 'lastLayout',
    },
    configure: async ({ root, params, manifest }) => {
      const edition = params.get('edition')
      if (edition && !['v4', 'v5'].includes(edition)) {
        throw Object.assign(new Error('edition must be v4 or v5'), { status: 400 })
      }
      if (edition) {
        const file = edition == 'v4' ? 'manifest.v4.mv3.json' : 'manifest.mv3.json'
        manifest = JSON.parse(await readFile(path.join(root, file), 'utf8'))
      }
      return {
        manifest,
        storageGroup: edition || (Number(manifest.version.split('.')[0]) >= 5 ? 'v5' : 'v4'),
        urlParams: edition ? { edition } : {},
      }
    },
  },
}
