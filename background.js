const isSafari = location.protocol.startsWith('safari-web-extension:')

const enabledIcons = {
  16: 'icons/icon16.png',
  32: 'icons/icon32.png',
  48: 'icons/icon48.png',
  64: 'icons/icon64.png',
  96: 'icons/icon96.png',
  128: 'icons/icon128.png',
}

const disabledIcons = {
  16: 'icons/icon16-disabled.png',
  32: 'icons/icon32-disabled.png',
  48: 'icons/icon48-disabled.png',
  64: 'icons/icon64-disabled.png',
  96: 'icons/icon96-disabled.png',
  128: 'icons/icon128-disabled.png',
}

function updateToolbarIcon(enabled) {
  let title = chrome.i18n.getMessage(enabled ? 'extensionName' : 'extensionNameDisabled')
  if (chrome.runtime.getManifest().manifest_version == 3) {
    chrome.action.setTitle({ title })
    if (!isSafari) {
      chrome.action.setIcon({ path: enabled ? enabledIcons : disabledIcons })
    } else {
      chrome.action.setBadgeText({ text: enabled ? '' : '⏻' })
    }
  } else {
    chrome.browserAction.setTitle({ title })
    chrome.browserAction.setIcon({ path: enabled ? enabledIcons : disabledIcons })
  }
}

// Update browser action icon to reflect enabled state
chrome.storage.local.get({ enabled: true }, ({ enabled }) => {
  updateToolbarIcon(enabled)
})

chrome.storage.local.onChanged.addListener((changes) => {
  if (changes.enabled) {
    updateToolbarIcon(changes.enabled.newValue)
  }
})

// Listen for download requests from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'DOWNLOAD_MEDIA') {
    handleDownloadMedia(message, sendResponse)
    return true // async response
  }
})

function handleDownloadMedia(message, sendResponse) {
  let { url, filename, subfolder } = message
  if (typeof url !== 'string' || !url.startsWith('https://')) {
    sendResponse({ success: false, error: 'Invalid media URL' })
    return
  }

  try {
    let parsed = new URL(url)
    let host = parsed.hostname.toLowerCase()
    if (!host.endsWith('.twimg.com') && !host.endsWith('.twitter.com') && !host.endsWith('.x.com')) {
      sendResponse({ success: false, error: 'Unauthorized download host: ' + host })
      return
    }
  } catch (e) {
    sendResponse({ success: false, error: 'Invalid URL structure' })
    return
  }

  let safeFilename = sanitizeFilename(filename)
  let safeSubfolder = sanitizeSubfolder(subfolder)
  let fullPath = safeSubfolder ? `${safeSubfolder}/${safeFilename}` : safeFilename

  chrome.downloads.download({
    url,
    filename: fullPath,
    conflictAction: 'uniquify',
  }, (downloadId) => {
    if (chrome.runtime.lastError) {
      console.error('Download failed:', chrome.runtime.lastError.message)
      sendResponse({ success: false, error: chrome.runtime.lastError.message })
    } else {
      sendResponse({ success: true, downloadId })
    }
  })
}

function sanitizeSubfolder(subfolder) {
  if (typeof subfolder !== 'string' || !subfolder.trim()) {
    return ''
  }

  let rawSegments = subfolder.split(/[/\\]+/)
  let cleanSegments = []

  for (let seg of rawSegments) {
    let clean = seg
      .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\s+/g, ' ')
      .trim()

    clean = clean.replace(/^[\s.]+|[\s.]+$/g, '').trim()

    if (!clean || clean === '.' || clean === '..') {
      continue
    }

    cleanSegments.push(clean)
  }

  return cleanSegments.join('/')
}

function sanitizeFilename(filename) {
  if (typeof filename !== 'string' || !filename.trim()) {
    return `twitter_media_${Date.now()}`
  }
  return filename
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '')
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/\s+/g, ' ')
    .replace(/_+/g, '_')
    .replace(/^[\s._]+|[\s._]+$/g, '')
    .trim() || `twitter_media_${Date.now()}`
}