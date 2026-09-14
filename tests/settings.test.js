import { beforeEach, describe, expect, test, vi } from 'vitest'

import { SYNC_SCHEDULE_PUSH_MESSAGE, setSettings } from '../settings.js'
import { createChromeMock } from './helpers/chrome.js'

let browser

function loadStorage(storage = {}) {
  browser = createChromeMock({ storage })
  vi.stubGlobal('chrome', browser.chrome)
}

describe('setSettings', () => {
  beforeEach(() => loadStorage())

  test('updates local settings and adds changes to the pending patch', async () => {
    loadStorage({
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
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalledWith({
      type: SYNC_SCHEDULE_PUSH_MESSAGE,
    })
  })

  test('accumulates changes made before a push', async () => {
    loadStorage({ syncSettings: true, token: 'token' })

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
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalledTimes(2)
  })

  test('does not queue settings changed while sync is off', async () => {
    loadStorage({ syncSettings: false, token: 'token' })

    await setSettings({ hideAdsNav: false })
    browser.storage.syncSettings = true
    await setSettings({ hideViews: false })

    expect(browser.storage.settings).toEqual({
      hideAdsNav: false,
      hideViews: false,
    })
    expect(browser.storage.pendingSettingsPatch).toEqual({ hideViews: false })
    expect(browser.chrome.runtime.sendMessage).toHaveBeenCalledTimes(1)
  })

  test('does not queue settings before an account is linked', async () => {
    loadStorage({ settings: { hideAdsNav: true }, syncSettings: true })

    await setSettings({ hideAdsNav: false })

    expect(browser.storage.settings).toEqual({ hideAdsNav: false })
    expect(browser.storage.pendingSettingsPatch).toBeUndefined()
    expect(browser.chrome.runtime.sendMessage).not.toHaveBeenCalled()
  })
})
