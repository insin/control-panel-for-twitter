import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
  ACCOUNT_REFRESH_ALARM,
  initSettingsSync,
  PULL_ALARM,
  PUSH_ALARM,
  startSync,
} from '../settings-background.js'
import { ACCOUNT_LINKED_MESSAGE, setSettings, SYNC_SETTINGS_CHANGED_MESSAGE } from '../settings.js'
import { createChromeMock } from './helpers/chrome.js'
import { jsonResponse } from './helpers/http.js'

const API_BASE = 'https://example.test'

let browser
let fetchMock

async function loadSync(initial = {}) {
  browser = createChromeMock(initial)
  fetchMock = vi.fn()
  vi.stubGlobal('chrome', browser.chrome)
  vi.stubGlobal('fetch', fetchMock)

  initSettingsSync({
    accountRefreshIntervalMinutes: 60,
    apiBase: API_BASE,
    pullIntervalMinutes: 10,
    pushDebounceSeconds: 30,
  })
}

describe('settings sync lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-09-13T00:00:00Z'))
  })

  test('linking seeds an empty server from existing settings', async () => {
    await loadSync({
      storage: {
        settings: { hideAdsNav: false },
        syncSettings: true,
        token: 'token',
      },
    })
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({ hasSettings: false, lastModified: null, subscription: { active: true } }),
      )
      .mockResolvedValueOnce(jsonResponse({ lastModified: 100 }))

    await browser.sendMessage({ type: ACCOUNT_LINKED_MESSAGE })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[1][0]).toBe(`${API_BASE}/api/extension/settings`)
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      settings: { hideAdsNav: false },
    })
    expect(browser.storage.settingsSyncPhase).toBe('ready')
    expect(browser.storage.subscription).toEqual({ active: true })
    expect(browser.alarms.get(PULL_ALARM)).toMatchObject({ periodInMinutes: 10 })
  })

  test('re-enabling sync uses defaults when the server is empty', async () => {
    await loadSync({
      storage: {
        settings: { hideAdsNav: false },
        syncSettings: true,
        token: 'token',
      },
    })
    fetchMock.mockResolvedValueOnce(
      jsonResponse({ hasSettings: false, lastModified: null, subscription: { active: true } }),
    )

    await browser.sendMessage({ type: SYNC_SETTINGS_CHANGED_MESSAGE, enabled: true })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(browser.storage.settings).toEqual({})
    expect(browser.storage.settingsSyncPhase).toBe('ready')
  })

  test('an unfinished reconciliation retries on startup', async () => {
    await loadSync({
      alarms: {
        [PULL_ALARM]: { name: PULL_ALARM, periodInMinutes: 10 },
      },
      storage: {
        settings: { hideAdsNav: false },
        settingsSyncPhase: 'replace-from-server',
        subscription: { active: true },
        syncSettings: true,
        token: 'token',
      },
    })
    fetchMock.mockRejectedValueOnce(new Error('offline'))

    await startSync()

    expect(browser.storage.settingsSyncPhase).toBe('replace-from-server')
    expect(browser.storage.syncError).toBe('network')

    fetchMock.mockResolvedValueOnce(
      jsonResponse({
        hasSettings: true,
        lastModified: 200,
        settings: { hideAdsNav: true },
        subscription: { active: true },
      }),
    )
    await startSync()

    expect(browser.storage.settings).toEqual({ hideAdsNav: true })
    expect(browser.storage.settingsSyncPhase).toBe('ready')
    expect(browser.storage.syncError).toBeUndefined()
  })

  test('pushing after a pull includes settings changed while the pull was in flight', async () => {
    await loadSync({
      storage: {
        settings: { hideAdsNav: true },
        subscription: { active: true },
        syncSettings: true,
        token: 'token',
      },
    })
    const pull = Promise.withResolvers()
    fetchMock
      .mockReturnValueOnce(pull.promise)
      .mockResolvedValueOnce(jsonResponse({ lastModified: 300 }))

    const syncing = startSync()
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    await setSettings({ hideAdsNav: false })
    pull.resolve(
      jsonResponse({
        hasSettings: true,
        lastModified: 200,
        settings: { hideAdsNav: true },
        subscription: { active: true },
      }),
    )
    await syncing

    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({
      settings: { hideAdsNav: false },
    })
    expect(browser.storage.settings).toEqual({ hideAdsNav: false })
    expect(browser.storage.pendingSettingsPatch).toBeUndefined()
  })

  test('a setting changed during a push remains pending for the next push', async () => {
    await loadSync({
      storage: {
        pendingSettingsPatch: { hideAdsNav: false },
        settings: { hideAdsNav: false },
        subscription: { active: true },
        syncSettings: true,
        token: 'token',
      },
    })
    const push = Promise.withResolvers()
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse({
          hasSettings: true,
          lastModified: 200,
          settings: { hideAdsNav: true },
          subscription: { active: true },
        }),
      )
      .mockReturnValueOnce(push.promise)

    const syncing = startSync()
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    await setSettings({ hideAdsNav: true })
    push.resolve(jsonResponse({ lastModified: 300 }))
    await syncing

    expect(browser.storage.pendingSettingsPatch).toEqual({ hideAdsNav: true })
    expect(browser.alarms.get(PUSH_ALARM)).toMatchObject({
      when: Date.now() + 30_000,
    })

    fetchMock.mockResolvedValueOnce(jsonResponse({ lastModified: 400 }))
    await browser.fireAlarm(PUSH_ALARM)
    await vi.waitFor(() => expect(browser.storage.pendingSettingsPatch).toBeUndefined())

    expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({
      settings: { hideAdsNav: true },
    })
  })

  test('disabling sync keeps local settings and starts account refreshes', async () => {
    await loadSync({
      alarms: {
        [PULL_ALARM]: { name: PULL_ALARM, periodInMinutes: 10 },
        [PUSH_ALARM]: { name: PUSH_ALARM, when: 100 },
      },
      storage: {
        pendingSettingsPatch: { hideAdsNav: false },
        settings: { hideAdsNav: false },
        subscription: { active: true },
        syncSettings: false,
        token: 'token',
      },
    })

    await startSync()

    expect(browser.storage.settings).toEqual({ hideAdsNav: false })
    expect(browser.storage.pendingSettingsPatch).toBeUndefined()
    expect(browser.alarms.has(PULL_ALARM)).toBe(false)
    expect(browser.alarms.has(PUSH_ALARM)).toBe(false)
    expect(browser.alarms.get(ACCOUNT_REFRESH_ALARM)).toMatchObject({ periodInMinutes: 60 })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
