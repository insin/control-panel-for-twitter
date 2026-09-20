import { afterEach, vi } from 'vitest'

vi.stubGlobal('chrome', {
  runtime: {
    getManifest: () => ({ host_permissions: ['https://pro.soitis.dev/*'] }),
  },
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
