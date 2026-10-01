async function main() {
  const { startExtensionsProBridge } = await import(
    chrome.runtime.getURL('extensions-pro-bridge.js')
  )
  await startExtensionsProBridge(1)
}

main().catch(() => console.error('[content-pro] Startup failed'))
