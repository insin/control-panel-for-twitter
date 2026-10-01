import { beforeEach, describe, expect, test, vi } from 'vitest'

import { createChromeMock } from './helpers/chrome.js'

const ORIGIN = 'https://pro.soitis.dev'
const EXTENSION_ID = 42

async function loadBridge(storage = {}) {
  const browser = createChromeMock({ storage })
  const listeners = []
  const postMessage = vi.fn()
  vi.stubGlobal('chrome', {
    ...browser.chrome,
    runtime: {
      ...browser.chrome.runtime,
      id: 'test-extension',
      // settings.js derives SERVER_ORIGIN from the manifest's host permissions
      getManifest: () => ({ manifest_version: 3, host_permissions: [`${ORIGIN}/*`] }),
      getURL: (file) => new URL(`../${file}`, import.meta.url).href,
    },
  })
  vi.stubGlobal('window', {
    addEventListener: (_type, listener) => listeners.push(listener),
    postMessage,
  })
  const { startExtensionsProBridge } = await import('../extensions-pro-bridge.js')
  await startExtensionsProBridge(EXTENSION_ID)
  return {
    ...browser,
    postMessage,
    dispatch: (data, origin = ORIGIN) => listeners[0]({ data, origin }),
  }
}

describe('Extensions Pro bridge', () => {
  beforeEach(() => vi.resetModules())

  test('announces presence when started', async () => {
    const browser = await loadBridge()
    expect(browser.postMessage).toHaveBeenCalledWith(
      {
        type: 'EXT_PRESENT',
        extensionsProId: EXTENSION_ID,
        linked: false,
        runtimeId: 'test-extension',
      },
      ORIGIN,
    )
  })

  test('reports linked state when responding to a ping', async () => {
    const browser = await loadBridge({ token: 'test-token' })
    browser.postMessage.mockClear()
    await browser.dispatch({ type: 'EXT_PING' })
    expect(browser.postMessage).toHaveBeenCalledWith(
      {
        type: 'EXT_PRESENT',
        extensionsProId: EXTENSION_ID,
        linked: true,
        runtimeId: 'test-extension',
      },
      ORIGIN,
    )
  })

  test('links and unlinks before acknowledging the operation', async () => {
    const browser = await loadBridge()
    const target = { extensionId: EXTENSION_ID, runtimeId: 'test-extension' }
    await browser.dispatch({
      ...target,
      type: 'EXT_LINK',
      email: 'test@example.com',
      token: 'test-token',
    })
    expect(browser.storage.token).toBe('test-token')
    expect(browser.postMessage).toHaveBeenLastCalledWith(
      { ...target, type: 'EXT_LINK_ACK' },
      ORIGIN,
    )
    await browser.dispatch({ ...target, type: 'EXT_UNLINK' })
    expect(browser.storage.token).toBeUndefined()
    expect(browser.postMessage).toHaveBeenLastCalledWith(
      { ...target, type: 'EXT_UNLINK_ACK' },
      ORIGIN,
    )
  })

  test('ignores messages from other origins or targeting another extension', async () => {
    const browser = await loadBridge()
    browser.postMessage.mockClear()
    await browser.dispatch({ type: 'EXT_PING' }, 'https://other.example')
    await browser.dispatch({
      type: 'EXT_LINK',
      extensionId: EXTENSION_ID,
      runtimeId: 'other-extension',
      token: 'wrong',
    })
    await browser.dispatch({
      type: 'EXT_LINK',
      extensionId: EXTENSION_ID + 1,
      runtimeId: 'test-extension',
      token: 'wrong',
    })
    expect(browser.storage).toEqual({})
    expect(browser.postMessage).not.toHaveBeenCalled()
  })
})
