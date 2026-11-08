import { beforeEach, describe, expect, test, vi } from 'vitest'

import { isTargetExtensionMessage, setSettings } from '../settings.js'
import { createChromeMock } from './helpers/chrome.js'

let browser

async function loadStorage(storage = {}) {
  browser = createChromeMock({ storage })
  Object.assign(browser.chrome.runtime, { getManifest: () => ({ version: '5.0.0' }) })
  vi.stubGlobal('chrome', browser.chrome)
  vi.resetModules()
  const { initSettingsSync } = await import('../settings-background.js')
  initSettingsSync()
}

describe('setSettings', () => {
  beforeEach(() => loadStorage())

  test('updates local settings and adds changes to the pending patch', async () => {
    await loadStorage({
      pendingSettingsPatch: { hideViews: true },
      settings: { hideAdsNav: true },
      syncSettings: true,
      token: 'token',
    })

    await setSettings({ hideAdsNav: false, hideViews: false })

    expect(browser.storage.settings).toEqual({
      hideAdsNav: false,
      hideViews: false,
    })
    expect(browser.storage.pendingSettingsPatch).toEqual({
      hideAdsNav: false,
      hideViews: false,
    })
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalled()
  })

  test('accumulates changes made before a push', async () => {
    await loadStorage({ syncSettings: true, token: 'token' })

    await setSettings({ hideAdsNav: false })
    await setSettings({ hideViews: false })

    expect(browser.storage.settings).toEqual({
      hideAdsNav: false,
      hideViews: false,
    })
    expect(browser.storage.pendingSettingsPatch).toEqual({
      hideAdsNav: false,
      hideViews: false,
    })
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalled()
  })

  test('does not queue settings changed while sync is off', async () => {
    await loadStorage({ syncSettings: false, token: 'token' })

    await setSettings({ hideAdsNav: false })
    browser.storage.syncSettings = true
    await setSettings({ hideViews: false })

    expect(browser.storage.settings).toEqual({
      hideAdsNav: false,
      hideViews: false,
    })
    expect(browser.storage.pendingSettingsPatch).toEqual({ hideViews: false })
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalled()
  })

  test('does not queue settings before an account is linked', async () => {
    await loadStorage({ settings: { hideAdsNav: true }, syncSettings: true })

    await setSettings({ hideAdsNav: false })

    expect(browser.storage.settings).toEqual({ hideAdsNav: false })
    expect(browser.storage.pendingSettingsPatch).toBeUndefined()
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalled()
  })
})

describe('isTargetExtensionMessage', () => {
  test('requires both the selected runtime and extension id', () => {
    const message = {
      extensionId: 1,
      runtimeId: 'selected-runtime',
    }

    expect(isTargetExtensionMessage(message, 'selected-runtime', 1)).toBe(true)
    expect(isTargetExtensionMessage(message, 'other-runtime', 1)).toBe(false)
    expect(isTargetExtensionMessage(message, 'selected-runtime', 2)).toBe(false)
    expect(isTargetExtensionMessage(null, 'selected-runtime', 1)).toBe(false)
  })
})

describe('SERVER_ORIGIN', () => {
  test.each([
    {
      expected: 'https://pro.soitis.dev',
      manifest: { host_permissions: ['https://pro.soitis.dev/*'], manifest_version: 3 },
    },
    {
      expected: 'http://localhost:5173',
      manifest: {
        host_permissions: ['http://localhost/*', 'https://pro.soitis.dev/*'],
        manifest_version: 3,
      },
    },
    {
      expected: 'http://localhost:5173',
      manifest: {
        manifest_version: 2,
        permissions: ['http://localhost/*', 'https://pro.soitis.dev/*'],
      },
    },
  ])('uses $expected for the generated manifest', async ({ expected, manifest }) => {
    vi.resetModules()
    vi.stubGlobal('chrome', { runtime: { getManifest: () => manifest } })

    const { SERVER_ORIGIN } = await import('../settings.js')

    expect(SERVER_ORIGIN).toBe(expected)
  })
})
