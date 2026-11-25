import { initBackground } from './shared/background.js'

import { SETTINGS_MIGRATIONS } from './migrations.js'

initBackground({
  productPath: 'control-panel-for-twitter',
  significantVersions: ['5'],
  migrations: SETTINGS_MIGRATIONS,
  proEnabled: Number(chrome.runtime.getManifest().version.split('.')[0]) >= 5,
})
