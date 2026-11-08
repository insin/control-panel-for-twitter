/** @param {number} extensionsProId */
export async function startExtensionsProBridge(extensionsProId) {
  const {
    ACCOUNT_LINKED_MESSAGE,
    ACCOUNT_UNLINKED_MESSAGE,
    get,
    isTargetExtensionMessage,
    sendMessage,
    SERVER_ORIGIN,
  } = await import(chrome.runtime.getURL('settings.js'))

  async function announcePresence() {
    const { token } = await get('token')
    window.postMessage(
      {
        type: 'EXT_PRESENT',
        extensionsProId,
        linked: Boolean(token),
        runtimeId: chrome.runtime.id,
      },
      SERVER_ORIGIN,
    )
  }

  async function handleMessage(event) {
    if (event.origin !== SERVER_ORIGIN) return

    if (event.data?.type === 'EXT_PING') {
      await announcePresence()
      return
    }

    if (
      event.data?.type === 'EXT_LINK' &&
      isTargetExtensionMessage(event.data, chrome.runtime.id, extensionsProId)
    ) {
      const response = await sendMessage({
        type: ACCOUNT_LINKED_MESSAGE,
        email: event.data.email,
        token: event.data.token,
      })
      if (!response || response.error)
        throw new Error(response?.error || 'Account link was not acknowledged')
      window.postMessage(
        {
          type: 'EXT_LINK_ACK',
          extensionId: extensionsProId,
          runtimeId: chrome.runtime.id,
        },
        SERVER_ORIGIN,
      )
    }

    if (
      event.data?.type === 'EXT_UNLINK' &&
      isTargetExtensionMessage(event.data, chrome.runtime.id, extensionsProId)
    ) {
      const response = await sendMessage({ type: ACCOUNT_UNLINKED_MESSAGE })
      if (!response || response.error)
        throw new Error(response?.error || 'Account unlink was not acknowledged')
      window.postMessage(
        {
          type: 'EXT_UNLINK_ACK',
          extensionId: extensionsProId,
          runtimeId: chrome.runtime.id,
        },
        SERVER_ORIGIN,
      )
    }
  }

  window.addEventListener('message', (event) =>
    handleMessage(event).catch(() =>
      console.error('[extensions-pro-bridge] Message handling failed'),
    ),
  )

  await announcePresence()
}
