import { beforeEach, describe, expect, test, vi } from 'vitest'

import {
  ACCOUNT_LINKED_MESSAGE,
  ACCOUNT_UNLINKED_MESSAGE,
  SYNC_SETTINGS_CHANGED_MESSAGE,
  setSettings,
} from '../settings.js'
import { ACCOUNT_REFRESH_ALARM, PULL_ALARM, PUSH_ALARM } from '../settings-background.js'
import { createChromeMock } from './helpers/chrome.js'
import { jsonResponse } from './helpers/http.js'

const API_BASE = 'https://example.test'

let browser
let fetchMock
/** @type {typeof import('../settings-background.js').startSync} */
let startSync

async function loadSync(initial = {}) {
  browser = createChromeMock(initial)
  Object.assign(browser.chrome.runtime, { getManifest: () => ({ version: '5.0.0' }) })
  fetchMock = vi.fn()
  vi.stubGlobal('chrome', browser.chrome)
  vi.stubGlobal('fetch', fetchMock)
  vi.resetModules()
  const sync = await import('../settings-background.js')
  startSync = sync.startSync

  sync.initSettingsSync({
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

  test('startup without a token is idle', async () => {
    await loadSync()

    await startSync()

    expect(browser.storage).toEqual({})
    expect(browser.alarms.size).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
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

    await browser.sendMessage({
      type: ACCOUNT_LINKED_MESSAGE,
      email: 'test@example.com',
      token: 'token',
    })

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

describe('one-shot synced imports', () => {
  beforeEach(() => vi.useFakeTimers())

  async function linked() {
    await loadSync({
      storage: {
        settings: { hideViews: false, hideGrok: false },
        subscription: { active: true },
        syncSettings: true,
        token: 'token',
        pendingSettingsPatch: { hideGrok: false },
      },
    })
  }

  function serverSettings() {
    return jsonResponse({
      hasSettings: true,
      settings: { hideGrok: true },
      lastModified: 200,
      subscription: { active: true },
    })
  }

  test.each([{}, { hideViews: true }])(
    'PUT succeeds before %j replaces local settings',
    async (settings) => {
      await linked()
      const before = structuredClone(browser.storage)
      const push = Promise.withResolvers()
      fetchMock.mockReturnValueOnce(push.promise)
      const importing = setSettings(settings, { replace: true })
      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
      expect(browser.storage).toEqual(before)
      expect(fetchMock.mock.calls[0][1].method).toBe('PUT')
      expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ settings })
      push.resolve(jsonResponse({ lastModified: 300 }))
      await importing
      expect(browser.storage.settings).toEqual(settings)
      expect(browser.storage.pendingSettingsPatch).toEqual({})
      expect(browser.storage.serverLastModified).toBe(300)
      expect(browser.storage.settingsSyncPhase).toBe('ready')
      expect(browser.alarms.has(PUSH_ALARM)).toBe(false)
    },
  )

  test.each([401, 402, 429, 500, 'offline'])(
    'failed import (%s) leaves settings and pending edits unchanged',
    async (status) => {
      await linked()
      const before = structuredClone(browser.storage)
      if (typeof status == 'number') fetchMock.mockResolvedValueOnce(jsonResponse({}, status))
      else fetchMock.mockRejectedValueOnce(new Error('offline'))
      await expect(setSettings({}, { replace: true })).rejects.toThrow()
      expect(browser.storage).toEqual(before)
      expect(browser.alarms.has(PUSH_ALARM)).toBe(false)
    },
  )

  test('failed imports are not retried on startup; ordinary pending edits still sync', async () => {
    await linked()
    fetchMock.mockRejectedValueOnce(new Error('offline'))
    await expect(setSettings({}, { replace: true })).rejects.toThrow()
    await loadSync({ storage: structuredClone(browser.storage) })
    fetchMock
      .mockResolvedValueOnce(serverSettings())
      .mockResolvedValueOnce(jsonResponse({ lastModified: 300 }))
    await startSync()
    expect(fetchMock.mock.calls.map(([, options]) => options.method || 'GET')).toEqual([
      'GET',
      'PATCH',
    ])
    expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ settings: { hideGrok: false } })
    fetchMock.mockResolvedValueOnce(jsonResponse({ lastModified: 400 }))
    await setSettings({}, { replace: true })
    expect(fetchMock.mock.calls[2][1].method).toBe('PUT')
    expect(browser.storage.settings).toEqual({})
  })

  test('an older PATCH finishes before an import PUT starts', async () => {
    await linked()
    const patch = Promise.withResolvers()
    fetchMock.mockResolvedValueOnce(serverSettings()).mockReturnValueOnce(patch.promise)
    const syncing = startSync()
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2))
    const importing = setSettings({}, { replace: true })
    fetchMock.mockResolvedValueOnce(jsonResponse({ lastModified: 400 }))
    patch.resolve(jsonResponse({ lastModified: 300 }))
    await syncing
    await importing
    expect(fetchMock.mock.calls.map(([, options]) => options.method || 'GET')).toEqual([
      'GET',
      'PATCH',
      'PUT',
    ])
    expect(browser.storage.settings).toEqual({})
    expect(browser.storage.pendingSettingsPatch).toEqual({})
  })

  test('edits made during PUT apply afterwards and sync as ordinary patches', async () => {
    await linked()
    const push = Promise.withResolvers()
    fetchMock.mockReturnValueOnce(push.promise)
    const importing = setSettings({}, { replace: true })
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const editing = setSettings({ hideViews: false })
    push.resolve(jsonResponse({ lastModified: 300 }))
    await importing
    await editing
    expect(browser.storage.settings).toEqual({ hideViews: false })
    expect(browser.storage.pendingSettingsPatch).toEqual({ hideViews: false })
    fetchMock.mockResolvedValueOnce(jsonResponse({ lastModified: 400 }))
    await browser.fireAlarm(PUSH_ALARM)
    await vi.waitFor(() => expect(browser.storage.pendingSettingsPatch).toBeUndefined())
    expect(fetchMock.mock.calls[1][1].method).toBe('PATCH')
  })

  test('two imports are attempted in order without persistent replacement state', async () => {
    await linked()
    const first = Promise.withResolvers()
    fetchMock
      .mockReturnValueOnce(first.promise)
      .mockResolvedValueOnce(jsonResponse({ lastModified: 400 }))
    const importing = setSettings({}, { replace: true })
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
    const next = setSettings({ hideViews: true }, { replace: true })
    first.resolve(jsonResponse({ lastModified: 300 }))
    await importing
    await next
    expect(fetchMock.mock.calls.map(([, options]) => JSON.parse(options.body).settings)).toEqual([
      {},
      { hideViews: true },
    ])
    expect(browser.storage.settings).toEqual({ hideViews: true })
    expect(Object.keys(browser.storage).filter((key) => key.startsWith('pending'))).toEqual([
      'pendingSettingsPatch',
    ])
  })

  test.each(['disable', 'unlink'])(
    '%s during PUT prevents the local import from committing',
    async (action) => {
      await linked()
      const before = structuredClone(browser.storage.settings)
      const push = Promise.withResolvers()
      fetchMock.mockReturnValueOnce(push.promise)
      const importing = setSettings({}, { replace: true })
      const failed = expect(importing).rejects.toThrow('Sync state changed')
      await vi.waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1))
      if (action == 'disable') browser.storage.syncSettings = false
      const changing = browser.sendMessage({
        type: action == 'disable' ? SYNC_SETTINGS_CHANGED_MESSAGE : ACCOUNT_UNLINKED_MESSAGE,
        enabled: false,
      })
      await vi.waitFor(() => expect(browser.chrome.alarms.clear).toHaveBeenCalled())
      push.resolve(jsonResponse({ lastModified: 300 }))
      await failed
      await changing
      expect(browser.storage.settings).toEqual(before)
    },
  )

  test('an import with sync disabled is local-only', async () => {
    await linked()
    browser.storage.syncSettings = false
    await browser.sendMessage({ type: SYNC_SETTINGS_CHANGED_MESSAGE, enabled: false })
    await setSettings({}, { replace: true })
    expect(browser.storage.settings).toEqual({})
    expect(fetchMock).not.toHaveBeenCalled()
    browser.storage.syncSettings = true
    fetchMock.mockResolvedValueOnce(serverSettings())
    await browser.sendMessage({ type: SYNC_SETTINGS_CHANGED_MESSAGE, enabled: true })
    expect(browser.storage.settings).toEqual({ hideGrok: true })
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
