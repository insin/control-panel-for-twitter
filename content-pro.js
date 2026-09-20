void (async () => {
  const { EXTENSIONS_PRO_ID } = await import(chrome.runtime.getURL('extensions-pro-id.js'))
  const {
    ACCOUNT_LINKED_MESSAGE,
    ACCOUNT_UNLINKED_MESSAGE,
    isTargetExtensionMessage,
    SERVER_ORIGIN,
  } = await import(chrome.runtime.getURL('settings.js'))

  window.addEventListener('message', async (event) => {
    if (event.origin !== SERVER_ORIGIN) return

    if (event.data?.type === 'EXT_PING') {
      const { token } = await chrome.storage.local.get('token')
      event.source.postMessage(
        {
          type: 'EXT_PRESENT',
          extensionsProId: EXTENSIONS_PRO_ID,
          linked: Boolean(token),
          runtimeId: chrome.runtime.id,
        },
        { targetOrigin: event.origin },
      )
      return
    }

    if (
      event.data?.type === 'EXT_LINK' &&
      isTargetExtensionMessage(event.data, chrome.runtime.id, EXTENSIONS_PRO_ID)
    ) {
      await chrome.storage.local.set({ accountEmail: event.data.email, token: event.data.token })
      await chrome.runtime.sendMessage({ type: ACCOUNT_LINKED_MESSAGE }).catch(() => {})
      event.source.postMessage(
        {
          type: 'EXT_LINK_ACK',
          extensionId: EXTENSIONS_PRO_ID,
          runtimeId: chrome.runtime.id,
        },
        { targetOrigin: event.origin },
      )
    }

    if (
      event.data?.type === 'EXT_UNLINK' &&
      isTargetExtensionMessage(event.data, chrome.runtime.id, EXTENSIONS_PRO_ID)
    ) {
      await chrome.storage.local.remove(['accountEmail', 'token', 'subscription'])
      await chrome.runtime.sendMessage({ type: ACCOUNT_UNLINKED_MESSAGE }).catch(() => {})
      event.source.postMessage(
        {
          type: 'EXT_UNLINK_ACK',
          extensionId: EXTENSIONS_PRO_ID,
          runtimeId: chrome.runtime.id,
        },
        { targetOrigin: event.origin },
      )
    }
  })
})()
