void (async () => {
  const { EXTENSIONS_PRO_ID } = await import(chrome.runtime.getURL('extensions-pro-id.js'))
  const { SERVER_ORIGIN, SYNC_RESET_MESSAGE } = await import(chrome.runtime.getURL('settings.js'))

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
    }

    if (event.data?.type === 'EXT_TOKEN') {
      await chrome.storage.local.set({ token: event.data.token })
      chrome.runtime.sendMessage({ type: SYNC_RESET_MESSAGE }).catch(() => {})
      event.source.postMessage({ type: 'EXT_TOKEN_ACK' }, { targetOrigin: event.origin })
    }
  })
})()
