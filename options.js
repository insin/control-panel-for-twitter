import { getSchemaForVersion, isObject, validateSettings } from './ext-shared.js'
import { schemas } from './schemas.js'
import { DEFAULT_SETTINGS, get, set, setSettings } from './settings.js'

const $body = document.body
const isBrowserAction = $body.classList.contains('browserAction')

//#region Theme hooks
/** @type {'chrome' | 'edge' | 'firefox' | 'ios' | 'mac'} */
const browser = (() => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('firefox')) return 'firefox'
  else if (ua.includes('edg/')) return 'edge'
  else if (ua.includes('safari') && !ua.includes('chrome'))
    return ua.includes('iphone') || ua.includes('ipad') ? 'ios' : 'mac'
  return 'chrome'
})()
const theme = browser
$body.classList.add(`browser-${browser}`, theme)

if (theme == 'chrome' || theme == 'edge' || theme == 'firefox') {
  const $top = document.createElement('div')
  $top.className = 'stickySentinel top'
  const $bottom = document.createElement('div')
  $bottom.className = 'stickySentinel bottom'
  for (const $group of document.querySelectorAll('section.group.labelled')) {
    $group.prepend($top.cloneNode())
    const $options = $group.querySelector('.options')
    $options.insertBefore($bottom.cloneNode(), $options.lastElementChild)
  }
} else {
  document.querySelector('section.group.stickyHeadings')?.remove()
}
//#endregion

//#region Localisation
document.title = chrome.i18n.getMessage('extensionName')

for (const optionValue of [
  'badges',
  'comfortable',
  'compact',
  'default',
  'dim',
  'hide',
  'ignore',
  'lightsOut',
  'liked',
  'mostRecent',
  'popular',
  'recent',
  'relevant',
  'separate',
]) {
  const label = chrome.i18n.getMessage(`option_${optionValue}`)
  for (const $option of document.querySelectorAll(`option[value="${optionValue}"]`)) {
    $option.textContent = label
  }
}

for (const translationId of [
  'addAddMutedWordMenuItem_desktop',
  'addAddMutedWordMenuItem_mobile',
  'addFocusedTweetAccountLocation',
  'addUserHoverCardAccountLocation',
  'backupAndRestoreOptions',
  'bypassAgeVerification',
  'customCss',
  'customTheme',
  'darkModeTheme',
  'debug',
  'debugInfo',
  'debugLogGetElementStats',
  'debugLogTimelineStats',
  'defaultFollowingToRecent',
  'defaultToFollowing',
  'defaultToLatestSearch',
  'developerOptions',
  'disableHomeTimeline',
  'disableHomeTimelineInfo',
  'disableTweetTextFormatting',
  'disabledHomeTimelineRedirect',
  'disabledHomeTimelineRedirectOption_messages',
  'dontUseChirpFont',
  'dropdownMenuFontWeight',
  'enabled',
  'experimentsOptions',
  'export',
  'exportSettings',
  'fastBlock',
  'features',
  'followButtonStyle',
  'followButtonStyleOption_monochrome',
  'followButtonStyleOption_themed',
  'fullWidthContent',
  'fullWidthContentInfo',
  'fullWidthMedia',
  'hideAccountSwitcher',
  'hideAdsNav',
  'hideAllMetrics',
  'hideBookmarkButton',
  'hideBookmarkMetrics',
  'hideChatNav',
  'hideComposeTweet',
  'hideDiscoverSuggestions',
  'hideEditImage',
  'hideExploreNav',
  'hideExploreNavWithSidebar',
  'hideExplorePageContents',
  'hideFollowingMenu',
  'hideFollowingMetrics',
  'hideForYouTimeline',
  'hideGrok',
  'hideGrokTweets',
  'hideInlinePrompts',
  'hideJobs',
  'hideLikeMetrics',
  'hideListRetweets',
  'hideLiveBroadcastBar',
  'hideLiveBroadcasts',
  'hideMessagesBottomNavItem',
  'hideMessagesDrawer',
  'hideMetrics',
  'hideMoreSlideOutMenuItemsOptions_desktop',
  'hideMoreSlideOutMenuItemsOptions_mobile',
  'hideNotificationLikes',
  'hideNotificationRetweets',
  'hidePremiumReplies',
  'hidePremiumUpsells',
  'hideProfileHeaderMetrics',
  'hideProfileRetweets',
  'hideQuoteTweetMetrics',
  'hideReplyMetrics',
  'hideRetweetMetrics',
  'hideSeeNewTweets',
  'hideShareTweetButton',
  'hideSidebarContent',
  'hideSortRepliesMenu',
  'hideSpacesNav',
  'hideSubscriptions',
  'hideSuggestedContentSearch',
  'hideSuggestedContentTimeline',
  'hideSuggestedFollows',
  'hideTimelineTweetBox',
  'hideTodaysNews',
  'hideToggleNavigation',
  'hideUnavailableQuoteTweets',
  'hideUnusedUiItemsOptions',
  'hideVerifiedTabs',
  'hideViewActivityLinks',
  'hideViews',
  'hideWhatsHappening',
  'homeTimelineOptions',
  'import',
  'importSettings',
  'mutableQuoteTweets',
  'mutedWords',
  'mutedWordsInfo',
  'navBaseFontSize',
  'navDensity',
  'premiumBlueChecks',
  'premiumBlueChecksOption_replace',
  'preventNextVideoAutoplay',
  'preventNextVideoAutoplayInfo',
  'quoteTweets',
  'redirectChatNav',
  'redirectToTwitter',
  'reduceAlgorithmicContentOptions',
  'reduceEngagementOptions',
  'reducedInteractionMode',
  'reducedInteractionModeInfo',
  'restoreLinkHeadlines',
  'restoreOtherInteractionLinks',
  'restoreQuoteTweetsLink',
  'restoreTweetSource',
  'retweets',
  'revertXBranding',
  'settings',
  'showBookmarkButtonUnderFocusedTweets',
  'showPremiumReplyBusiness',
  'showPremiumReplyFollowedBy',
  'showPremiumReplyFollowersCountAmount',
  'showPremiumReplyFollowing',
  'showPremiumReplyGovernment',
  'showRelevantPeople',
  'sidebar',
  'sortReplies',
  'sortRepliesInfo',
  'stickyHeadings',
  'syncSettings',
  'tweakNewLayout',
  'tweakNewLayoutInfo',
  'tweakQuoteTweetsPage',
  'uiImprovementsOptions',
  'uiTweaksOptions',
  'unblurSensitiveContent',
  'uninvertFollowButtons',
  'xFixesOptions',
]) {
  const $el = document.getElementById(translationId)
  if ($el) {
    $el.textContent = chrome.i18n.getMessage(translationId)
  } else {
    console.warn('could not find element for translationId', translationId)
  }
}

for (const translationClass of [
  'hideBookmarksNav',
  'hideBusinessNav',
  'hideCommunitiesNav',
  'hideConnectNav',
  'hideCreatorStudioNav',
  'hideListsNav',
  'notifications',
  'saveAndApply',
]) {
  const translation = chrome.i18n.getMessage(translationClass)
  for (const $el of document.querySelectorAll(`.${translationClass}`)) {
    $el.textContent = translation
  }
}

for (const amount of [1_000, 10_000, 100_000, 1_000_000]) {
  document.querySelector(`option[value="${amount}"]`).textContent = formatFollowerCount(amount)
}

// Some browsers don't support doing certain things in the browser action popup
if (isBrowserAction) {
  if (browser == 'firefox') {
    document.getElementById('import').textContent = chrome.i18n.getMessage('openOptionsPage')
    document.getElementById('importMessages').textContent = chrome.i18n.getMessage(
      'optionsPageImportSettingsNote',
    )
  }
  if (browser == 'mac') {
    document.getElementById('export').textContent = chrome.i18n.getMessage('openOptionsPage')
    document.getElementById('exportMessages').textContent = chrome.i18n.getMessage(
      'optionsPageExportSettingsNote',
    )
  }
}

document.querySelector('#customThemeInfo').innerHTML = chrome.i18n.getMessage('customThemeInfo')
//#endregion

/**
 * Internal options which map directly to a form element.
 * @type {import('./types').StoredConfigKey[]}
 */
const INTERNAL_CONFIG_FORM_KEYS = [
  'debug',
  'debugLogGetElementStats',
  'debugLogTimelineStats',
  'enabled',
  'stickyHeadings',
  'syncSettings',
]
/** @type {Set<string>} */
const INTERNAL_CONFIG_FORM_KEYSET = new Set(INTERNAL_CONFIG_FORM_KEYS)

//#region Default config
/** @type {import("./types").StoredConfig} */
const defaultConfig = {
  collapsedGroups: [],
  debug: false,
  debugLogGetElementStats: false,
  debugLogTimelineStats: false,
  enabled: true,
  syncSettings: true,
  tab: 'features',
  stickyHeadings: true,
  // Default based on the platform if the main script hasn't run on Twitter yet
  version: /(Android|iP(ad|hone))/.test(navigator.userAgent) ? 'mobile' : 'desktop',
}
//#endregion

//#region Config & variables
/** @type {import("./types").StoredConfig} */
let config

/**
 * Checkbox group configuration for the version being used (mobile or desktop).
 * @type {Map<string, string[]>}
 */
let checkboxGroups

/** @type {IntersectionObserver} */
let stickyObserver

/** @type {number} */
let tabsHeight

// Page elements
const $collapsibleLabels = document.querySelectorAll(
  'section.labelled.collapsible > label[data-collapse-id]',
)
const $customCss = /** @type {HTMLTextAreaElement} */ (document.querySelector('textarea#customCss'))
const $customThemeInput = /** @type {HTMLInputElement} */ (
  document.querySelector('input[name="customTheme"]')
)
const $displaySettingsLink = /** @type {HTMLAnchorElement} */ (
  document.querySelector('#customThemeInfo a')
)
const $exportSettingsButton = document.querySelector('button#export')
const $fileInput = /** @type {HTMLInputElement} */ (document.querySelector('input[type="file"]'))
const $form = document.querySelector('form')
const $hideQuotesFrom = /** @type {HTMLDivElement} */ (document.querySelector('#hideQuotesFrom'))
const $hideQuotesFromCount = /** @type {HTMLElement} */ (
  document.querySelector('#hideQuotesFromCount')
)
const $hideQuotesFromDetails = /** @type {HTMLDetailsElement} */ (
  document.querySelector('details#hideQuotesFromDetails')
)
const $importMessages = /** @type {HTMLElement} */ (document.querySelector('#importMessages'))
const $importSettingsButton = document.querySelector('button#import')
const $mutedQuotes = /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
const $mutedQuotesCount = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesCount'))
const $mutedQuotesDetails = /** @type {HTMLDetailsElement} */ (
  document.querySelector('details#mutedQuotesDetails')
)
const $optionsIcon = /** @type {HTMLImageElement} */ (document.querySelector('#optionsIcon'))
const $mutedWords = /** @type {HTMLTextAreaElement} */ (
  document.querySelector('textarea#mutedWords')
)
const $mutedWordsError = document.querySelector('#mutedWordsError')
const $mutedWordsErrorLine = document.querySelector('#mutedWordsErrorLine')
const $mutedWordsErrorMessage = document.querySelector('#mutedWordsErrorMessage')
const $panels = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.panel'))
const $proButton = document.querySelector('button#proButton')
const $proStatusIcon = document.querySelector('#proStatusIcon')
const $proStatusText = document.querySelector('#proStatusText')
const $saveCustomCssButton = document.querySelector('button#saveCustomCss')
const $showPremiumReplyFollowersCount = /** @type {HTMLElement} */ (
  document.querySelector('#showPremiumReplyFollowersCount')
)
const $stickySentinels = document.querySelectorAll('.stickySentinel')
const $tablist = /** @type {HTMLElement} */ (document.querySelector('.tabs'))
const $tabs = Array.from($tablist.querySelectorAll('button'))
//#endregion

//#region Utility functions
const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i
const RGB_RE = /^rgb\(\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)\s*[, ]\s*(\d{1,3}%?)\s*\)$/i
const HSL_RE =
  /^hsl\(\s*([\d.]+)(deg|rad|grad|turn)?\s*[, ]\s*(\d{1,3})%\s*[, ]\s*(\d{1,3})%\s*\)$/i

function autoResize($textarea) {
  if (!$textarea.offsetParent) return
  if (!$textarea.hasAttribute('data-border-height')) {
    const { borderBottomWidth, borderTopWidth } = getComputedStyle($textarea)
    $textarea.setAttribute(
      'data-border-height',
      parseFloat(borderBottomWidth) + parseFloat(borderTopWidth),
    )
  }
  $textarea.style.height = 'auto'
  $textarea.style.height =
    Math.ceil($textarea.scrollHeight) +
    parseFloat($textarea.getAttribute('data-border-height')) +
    'px'
}

/**
 * @param {{r: number, g: number, b: number}} rgb
 */
function calculateLuminance(rgb) {
  if (!rgb) return 0
  // YIQ formula for perceived brightness
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
}

function debounce(func, delay = 400) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
    return () => clearTimeout(timeoutId)
  }
}

function formatFollowerCount(num) {
  const numFormat = Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: num < 1_000_000 ? 'short' : 'long',
  })
  return numFormat.format(num)
}

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {({[key: string]: any} | null)?} attributes
 * @param {...any} children
 * @returns {HTMLElement}
 */
function h(tagName, attributes, ...children) {
  const $el = document.createElement(tagName)

  if (attributes) {
    for (const [prop, value] of Object.entries(attributes)) {
      if (value == null) continue
      if (prop.startsWith('on') && typeof value == 'function') {
        $el.addEventListener(prop.slice(2).toLowerCase(), value)
        continue
      }
      if (prop == 'class') {
        $el.className = Array.isArray(value) ? value.join(' ') : value
        continue
      }
      if (prop == 'style') {
        if (!isObject(value)) continue
        for (const [name, styleValue] of Object.entries(value)) {
          if (styleValue == null) continue
          if (name.startsWith('--')) {
            $el.style.setProperty(name, String(styleValue))
          } else {
            $el.style[name] = styleValue
          }
        }
        continue
      }
      $el[prop] = value
    }
  }

  for (const child of children.flat()) {
    if (child == null || child === false) continue
    if (child instanceof Node) {
      $el.appendChild(child)
    } else {
      $el.insertAdjacentText('beforeend', String(child))
    }
  }

  return $el
}

function sortKeys(obj) {
  return Object.fromEntries(
    Object.entries(obj).sort(([a], [b]) => {
      if (a < b) return -1
      if (a > b) return 1
      return 0
    }),
  )
}

/**
 * @param {number} h
 * @param {number} s
 * @param {number} l
 */
function hslToRgb(h, s, l) {
  s /= 100
  l /= 100
  const k = (n) => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  }
}

/**
 * @param {string} color
 */
function isValidCustomTheme(color) {
  // Allow it to be cleared
  if (!color) return true

  if (HEX_RE.test(color)) {
    return true
  }

  const rgbMatch = color.match(RGB_RE)
  if (rgbMatch) {
    for (let i = 1; i <= 3; i++) {
      const value = rgbMatch[i]
      if (value.endsWith('%')) {
        const percentage = parseFloat(value)
        if (Number.isNaN(percentage) || percentage > 100) return false
      } else if (Number(value) > 255) {
        return false
      }
    }
    return true
  }

  const hslMatch = color.match(HSL_RE)
  if (hslMatch) {
    const hue = parseFloat(hslMatch[1])
    if (Number.isNaN(hue)) return false
    const saturation = Number(hslMatch[3])
    const lightness = Number(hslMatch[4])
    if (saturation > 100 || lightness > 100) {
      return false
    }
    return true
  }

  return false
}

/**
 * @param {string} hueStr
 * @param {string} unit
 */
function normalizeHue(hueStr, unit) {
  let hue = parseFloat(hueStr)
  unit = unit ? unit.toLowerCase() : 'deg'
  if (unit == 'rad') {
    hue = hue * (180 / Math.PI)
  } else if (unit == 'grad') {
    hue = (hue / 400) * 360
  } else if (unit == 'turn') {
    hue = hue * 360
  }
  return ((hue % 360) + 360) % 360
}

/**
 * @param {string} color
 * @returns {{r: number, g: number, b: number} | null}
 */
function parseColorToRgb(color) {
  if (HEX_RE.test(color)) {
    const hex = color.slice(1)
    let r, g, b
    if (hex.length === 3) {
      r = parseInt(hex[0].repeat(2), 16)
      g = parseInt(hex[1].repeat(2), 16)
      b = parseInt(hex[2].repeat(2), 16)
    } else {
      r = parseInt(hex.substring(0, 2), 16)
      g = parseInt(hex.substring(2, 4), 16)
      b = parseInt(hex.substring(4, 6), 16)
    }
    return { r, g, b }
  }

  const rgbMatch = color.match(RGB_RE)
  if (rgbMatch) {
    return {
      r: parseRgbComponentValue(rgbMatch[1]),
      g: parseRgbComponentValue(rgbMatch[2]),
      b: parseRgbComponentValue(rgbMatch[3]),
    }
  }

  const hslMatch = color.match(HSL_RE)
  if (hslMatch) {
    const h = normalizeHue(hslMatch[1], hslMatch[2])
    const s = parseFloat(hslMatch[3])
    const l = parseFloat(hslMatch[4])
    return hslToRgb(h, s, l)
  }

  return null
}

function parseRgbComponentValue(value) {
  if (value.endsWith('%')) {
    return (parseFloat(value) / 100) * 255
  }
  return Number(value)
}

function validateMuteRegExps(terms) {
  const lines = terms.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].trim().match(/^\/(.*)\/$/)
    if (!match) continue
    try {
      new RegExp(match[1])
    } catch (e) {
      return {
        line: i + 1,
        message: e.message,
      }
    }
  }
  return null
}
//#endregion

//#region Options page functions
/**
 * Update the options page to match the current config.
 */
function applyConfig() {
  $body.classList.toggle('mobile', config.version == 'mobile')
  $body.classList.toggle('desktop', config.version == 'desktop')
  checkboxGroups = new Map(
    Object.entries({
      hideAllMetrics: [
        'hideBookmarkMetrics',
        'hideFollowingMetrics',
        'hideLikeMetrics',
        'hideReplyMetrics',
        'hideRetweetMetrics',
        'hideQuoteTweetMetrics',
        'hideProfileHeaderMetrics',
      ],
    }),
  )
  updateFormControls()
  updateCheckboxGroups()
  updateDisplay()
}

async function exportSettings() {
  const version = chrome.runtime.getManifest().version
  const json = JSON.stringify({ settings: sortKeys(config.settings), version }, null, 2)
  const filename = `control-panel-for-twitter-v${version}-settings.json`
  const blob = new Blob([json], { type: 'application/json' })
  if (browser == 'ios') {
    const file = new File([blob], filename, { type: 'application/json' })
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: filename,
      })
    } else {
      window.open(`data:application/json;charset=utf-8,${encodeURIComponent(json)}`)
    }
    return
  }
  const url = URL.createObjectURL(blob)
  const $a = document.createElement('a')
  $a.download = filename
  $a.href = url
  $a.click()
  requestIdleCallback(() => URL.revokeObjectURL(url))
}

let clearImportMessagesTimeout = null

async function importSettings() {
  if (clearImportMessagesTimeout) {
    clearTimeout(clearImportMessagesTimeout)
    clearImportMessagesTimeout = null
  }
  const file = $fileInput.files[0]
  // Allow the same file to be re-selected if the user edits it
  $fileInput.files = null
  if (!file) {
    $importMessages.replaceChildren(
      h('span', { class: 'text-error' }, chrome.i18n.getMessage('noFileSelected')),
    )
    return
  }
  const json = await file.text()
  const { settings, messages } = validateSettingsJson(json)
  if (settings != null) {
    await setSettings(settings)
  } else {
    $importMessages.style.color = 'var(--text-error)'
  }
  $importMessages.replaceChildren(
    h(
      'span',
      { class: 'whitespace-pre-line' },
      h(
        'span',
        { class: ['font-bold', settings != null ? 'text-success' : 'text-error'] },
        chrome.i18n.getMessage(settings != null ? 'settingsImported' : 'settingsNotImported'),
      ),
      messages.length > 0 && ['\n\n', h('span', { class: 'text-error' }, messages.join('\n\n'))],
    ),
  )
  if (settings != null) {
    clearImportMessagesTimeout = setTimeout(() => $importMessages.replaceChildren(), 3000)
  }
}

/**
 * Only allow valid CSS colors.
 */
function onCustomThemeInput(e) {
  const customTheme = e.target.value.trim()
  if (isValidCustomTheme(customTheme) && customTheme != config.settings.customTheme) {
    config.settings.customTheme = customTheme
    storeConfigChanges({ settings: { customTheme } })
    updateDisplay()
  }
}

function onFormChanged(/** @type {Event} */ e) {
  if (
    e.target instanceof HTMLTextAreaElement ||
    (e.target instanceof HTMLInputElement && (e.target.type == 'file' || e.target.type == 'text'))
  )
    return

  /** @type {import("./types").StoredConfig} */
  const changedConfig = Object.create(null)
  /** @type {Partial<import("./types").UserSettings>} */
  const changedSettings = Object.create(null)

  // Handle input
  const $el = /** @type {HTMLInputElement} */ (e.target)
  if ($el.type == 'checkbox') {
    // All internal config is currently checkbox toggles
    if (INTERNAL_CONFIG_FORM_KEYSET.has($el.name)) {
      config[$el.name] = changedConfig[$el.name] = $el.checked
    }
    // Checkbox group toggle
    else if (checkboxGroups.has($el.name)) {
      checkboxGroups.get($el.name).forEach((checkboxName) => {
        config.settings[checkboxName] = changedSettings[checkboxName] = $el.checked
        updateFormControl($form.elements[checkboxName], $el.checked)
      })
      $el.indeterminate = false
    }
    // Individual checkbox toggle
    else {
      config.settings[$el.name] = changedSettings[$el.name] = $el.checked
      updateCheckboxGroups()
    }
  } else {
    config.settings[$el.name] = changedSettings[$el.name] = $el.value
  }

  // Apply other settings changes based on input
  // Don't try to redirect the Home timeline to Notifications if both are disabled
  if (
    changedSettings.hideNotifications &&
    config.settings.disabledHomeTimelineRedirect == 'notifications'
  ) {
    const key = 'disabledHomeTimelineRedirect'
    $form.elements[key].value = config.settings[key] = changedSettings[key] = 'messages'
  }

  updateDisplay()
  if (Object.keys(changedSettings).length > 0) {
    changedConfig.settings = changedSettings
  }
  storeConfigChanges(changedConfig)
}

function onMutedWordsInput() {
  autoResize($mutedWords)
  const mutedWords = $mutedWords.value
  const isEmpty = /^\s*$/.test(mutedWords)
  if (isEmpty) {
    if (config.settings.mutedWords) {
      storeConfigChangesDebounced({ settings: { mutedWords: '', mutedWordsError: false } })
      clearMutedWordsError()
    }
    return
  }

  const error = validateMuteRegExps(mutedWords)
  if (error) {
    cancelPendingMutedWordsError = showMutedWordsErrorDebounced(error)
    storeConfigChangesDebounced({ settings: { mutedWords, mutedWordsError: true } })
    return
  } else {
    // Immediately hide any error when invalid input becomes valid
    clearMutedWordsError()
  }

  storeConfigChangesDebounced({ settings: { mutedWords, mutedWordsError: false } })
}

function showMutedWordsError({ line, message }) {
  $mutedWords.classList.add('invalid')
  $mutedWordsError.removeAttribute('hidden')
  $mutedWordsErrorMessage.textContent = message
  $mutedWordsErrorLine.textContent = `:${line}`
}

const showMutedWordsErrorDebounced = debounce(showMutedWordsError)

function clearMutedWordsError() {
  $mutedWords.classList.remove('invalid')
  $mutedWordsError.setAttribute('hidden', '')
  $mutedWordsErrorMessage.textContent = ''
  $mutedWordsErrorLine.textContent = ''
  cancelPendingMutedWordsError?.()
}

/** @type {() => void} */
let cancelPendingMutedWordsError

/**
 * Listen for storage changes while the options page is open and update its
 * controls to reflect them. We only store settings the user has interacted
 * with.
 * @param {{[key: string]: chrome.storage.StorageChange}} storageChanges
 */
function onStorageChanged(storageChanges) {
  const changes = Object.fromEntries(
    Object.entries(storageChanges).map(([key, { newValue }]) => [key, newValue]),
  )
  const { settings: settingsChanges, ...configChanges } = changes
  Object.assign(config, configChanges)
  Object.assign(config.settings, settingsChanges)
  applyConfig()
}

function onTabClick(e) {
  // Only start animating on interaction, to avoid initial flash of animation
  $tablist.classList.add('animate')
  const tab = e.currentTarget.getAttribute('data-tab')
  config.tab = tab
  storeConfigChanges({ tab })
  window.scrollTo({ top: 0 })
  updateDisplay()
}

function onToggleCollapse(e) {
  if (theme == 'ios') return
  const collapsedGroups = config.collapsedGroups.slice()
  const collapseId = e.currentTarget.getAttribute('data-collapse-id')
  const index = collapsedGroups.indexOf(collapseId)
  if (index == -1) {
    collapsedGroups.push(collapseId)
  } else {
    collapsedGroups.splice(index, 1)
  }
  config.collapsedGroups = collapsedGroups
  storeConfigChanges({ collapsedGroups })
  updateDisplay()
}

function saveCustomCss() {
  const customCss = /** @type {HTMLTextAreaElement} */ ($form.elements.namedItem('customCss')).value
  if (config.settings.customCss == customCss) return
  config.settings.customCss = customCss
  storeConfigChanges({ settings: { customCss } })
}

function shouldDisplayHideQuotesFrom() {
  return config.settings.mutableQuoteTweets && config.settings.hideQuotesFrom.length > 0
}

function shouldDisplayMutedQuotes() {
  return config.settings.mutableQuoteTweets && config.settings.mutedQuotes.length > 0
}

/**
 * @param {Partial<import("./types").StoredConfig>} changes
 */
async function storeConfigChanges(changes) {
  /** @type {Partial<import("./types").StoredConfig>} */
  const internalConfig = Object.create(null)
  for (const key of Object.keys(defaultConfig)) {
    if (Object.hasOwn(changes, key)) {
      internalConfig[key] = changes[key]
    }
  }

  chrome.storage.onChanged.removeListener(onStorageChanged)
  try {
    if (changes.settings && Object.keys(changes.settings).length > 0) {
      await setSettings(changes.settings)
    }
    if (Object.keys(internalConfig).length > 0) {
      await set(internalConfig)
    }
  } catch (e) {
    console.error('[options] error storing config change', e)
  } finally {
    chrome.storage.onChanged.addListener(onStorageChanged)
  }
}

const storeConfigChangesDebounced = debounce(storeConfigChanges)

function updateCheckboxGroups() {
  for (const [group, checkboxNames] of checkboxGroups.entries()) {
    const checkedCount = checkboxNames.filter((name) => config.settings[name]).length
    $form.elements[group].checked = checkedCount == checkboxNames.length
    $form.elements[group].indeterminate = checkedCount > 0 && checkedCount < checkboxNames.length
  }
}

function updateCollapsedOptionGroupsDisplay() {
  for (const $label of $collapsibleLabels) {
    $label.parentElement.classList.toggle(
      'collapsed',
      config.collapsedGroups.includes($label.getAttribute('data-collapse-id')),
    )
  }
}

function updateDisplay() {
  $body.classList.toggle('debugging', config.debug)
  $body.classList.toggle('defaultingFollowingToRecent', config.settings.defaultFollowingToRecent)
  $body.classList.toggle('defaultingToFollowing', config.settings.defaultToFollowing)
  $body.classList.toggle('disabled', !config.enabled)
  $body.classList.toggle('disabledHomeTimeline', config.settings.disableHomeTimeline)
  $body.classList.toggle('fullWidthContent', config.settings.fullWidthContent)
  $body.classList.toggle('hidingBookmarkButton', config.settings.hideBookmarkButton)
  $body.classList.toggle('hidingExploreNav', config.settings.hideExploreNav)
  $body.classList.toggle('hidingMetrics', config.settings.hideMetrics)
  $body.classList.toggle('hidingNotifications', config.settings.hideNotifications == 'hide')
  $body.classList.toggle('hidingPremiumReplies', config.settings.hidePremiumReplies)
  $body.classList.toggle('hidingQuotesFrom', shouldDisplayHideQuotesFrom())
  $body.classList.toggle(
    'hidingSuggestedFollows',
    config.settings.hideSidebarContent || config.settings.hideSuggestedFollows,
  )
  $body.classList.toggle('mutingQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle(
    'showingBlueReplyFollowersCount',
    config.settings.showPremiumReplyFollowersCount,
  )
  $body.classList.toggle('showingSidebarContent', !config.settings.hideSidebarContent)
  $body.classList.toggle('sortingRepliesByLikes', config.settings.sortReplies == 'liked')
  $body.classList.toggle('stickyHeadings', config.stickyHeadings)
  $body.classList.toggle('tweakingNewLayout', config.settings.tweakNewLayout)
  $body.classList.toggle('uninvertedFollowButtons', config.settings.uninvertFollowButtons)
  const icon = `options-icon${!config.enabled ? '-disabled' : ''}.png`
  if ($optionsIcon.src != icon) {
    $optionsIcon.src = icon
  }
  $displaySettingsLink.href = config.settings.redirectToTwitter
    ? 'https://twitter.com/settings/display?mx=1'
    : 'https://x.com/settings/display'
  if (!config.token) {
    $proStatusIcon.textContent = '🟢'
    $proStatusText.textContent = 'Active'
  } else {
    $proStatusIcon.textContent = '⚫️'
    $proStatusText.textContent = 'Get Pro'
  }
  $showPremiumReplyFollowersCount.textContent = chrome.i18n.getMessage(
    'showPremiumReplyFollowersCount',
    formatFollowerCount(Number(config.settings.showPremiumReplyFollowersCountAmount)),
  )
  updateCollapsedOptionGroupsDisplay()
  updateHideQuotesFromDisplay()
  updateMutedQuotesDisplay()
  updateTabsDisplay()
  if (config.settings.customTheme) {
    const rgb = parseColorToRgb(config.settings.customTheme)
    const luminance = calculateLuminance(rgb)
    $customThemeInput.style.backgroundColor = config.settings.customTheme
    $customThemeInput.style.color = luminance > 128 ? 'black' : 'white'
  } else {
    $customThemeInput.style.backgroundColor = ''
    $customThemeInput.style.color = ''
  }
}

function updateHideQuotesFromDisplay() {
  if (!shouldDisplayHideQuotesFrom()) return

  $hideQuotesFromCount.textContent = chrome.i18n.getMessage(
    'hideQuotesFromCount',
    String(config.settings.hideQuotesFrom.length),
  )

  if (!$hideQuotesFromDetails.open) return

  while ($hideQuotesFrom.hasChildNodes()) $hideQuotesFrom.firstChild.remove()
  for (const user of config.settings.hideQuotesFrom) {
    $hideQuotesFrom.appendChild(
      h(
        'section',
        null,
        h(
          'label',
          { class: 'button' },
          h('span', null, `@${user}`),
          h(
            'button',
            {
              type: 'button',
              onclick() {
                config.settings.hideQuotesFrom = config.settings.hideQuotesFrom.filter(
                  (u) => u != user,
                )
                updateDisplay()
                storeConfigChanges({ settings: { hideQuotesFrom: config.settings.hideQuotesFrom } })
              },
            },
            chrome.i18n.getMessage('unmuteButtonText'),
          ),
        ),
      ),
    )
  }
}

function updateMutedQuotesDisplay() {
  if (!shouldDisplayMutedQuotes()) return

  $mutedQuotesCount.textContent = chrome.i18n.getMessage(
    'mutedTweetsCount',
    String(config.settings.mutedQuotes.length),
  )

  if (!$mutedQuotesDetails.open) return

  while ($mutedQuotes.hasChildNodes()) $mutedQuotes.firstChild.remove()

  config.settings.mutedQuotes.forEach(({ user, time, text }, index) => {
    $mutedQuotes.appendChild(
      h(
        'section',
        null,
        h(
          'label',
          { class: 'button mutedQuote' },
          h(
            'div',
            null,
            user,
            ' – ',
            new Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(time)),
            text && h('p', { class: 'mb-0 whitespace-pre-line' }, text),
          ),
          h(
            'button',
            {
              type: 'button',
              onclick: () => {
                config.settings.mutedQuotes = config.settings.mutedQuotes.filter(
                  (_, i) => i != index,
                )
                set({ mutedQuotes: config.settings.mutedQuotes })
                updateDisplay()
              },
            },
            chrome.i18n.getMessage('unmuteButtonText'),
          ),
        ),
      ),
    )
  })
}

function updateFormControls() {
  for (const key of INTERNAL_CONFIG_FORM_KEYSET) {
    if (key in $form.elements) {
      updateFormControl($form.elements[key], config[key])
    }
  }
  for (const key of Object.keys(config.settings)) {
    if (key in $form.elements) {
      updateFormControl($form.elements[key], config.settings[key])
    }
  }
}

function updateFormControl($control, value) {
  if ($control instanceof RadioNodeList) {
    // If a checkbox displays in multiple sections, update them all
    $control.forEach((input) => {
      /** @type {HTMLInputElement} */
      input.checked = value
    })
  } else if ($control.type == 'checkbox') {
    $control.checked = value
  } else {
    $control.value = value
  }
}

function updateTabsDisplay() {
  const selectedTabIndex = $tabs.findIndex(($tab) => $tab.getAttribute('data-tab') == config.tab)
  $tablist.style.setProperty('--selected-tab-index', String(selectedTabIndex))
  for (const $tab of $tabs) {
    $tab.setAttribute('aria-selected', String($tab.getAttribute('data-tab') == config.tab))
  }
  for (const $panel of $panels) {
    $panel.style.display = config.tab == $panel.getAttribute('data-tab') ? 'block' : 'none'
  }
  if (config.tab == 'features') {
    autoResize($customCss)
  } else if (config.tab == 'pro') {
    autoResize($mutedWords)
  }
}

/**
 * @param {string} json
 * @returns {{ messages: string[], settings: Record<string, unknown> | null }}
 */
export function validateSettingsJson(json) {
  let input
  try {
    input = JSON.parse(json)
  } catch (error) {
    return { messages: [chrome.i18n.getMessage('invalidJsonFile', error.message)], settings: null }
  }

  if (!isObject(input) || !isObject(input.settings)) {
    return { messages: [chrome.i18n.getMessage('noSettingsObject')], settings: null }
  }

  const version =
    typeof input.version == 'string' ? input.version : chrome.runtime.getManifest().version
  const schema = getSchemaForVersion(schemas, version) || schemas.at(-1)[1]
  const { settings, invalid, unknown } = validateSettings(input.settings, schema)

  return {
    messages: [
      invalid.length > 0 && chrome.i18n.getMessage('invalidSettings', invalid.join(', ')),
      unknown.length > 0 && chrome.i18n.getMessage('unknownSettings', unknown.join(', ')),
    ].filter(Boolean),
    settings: Object.keys(settings).length > 0 ? settings : null,
  }
}
//#endregion

//#region Main
async function main() {
  /** @type {Partial<import("./types").StoredConfig>} */
  const { settings: storedSettings = {}, ...storedConfig } = await get()
  config = {
    ...defaultConfig,
    ...storedConfig,
    settings: { ...DEFAULT_SETTINGS, ...storedSettings },
  }

  for (const $label of $collapsibleLabels) {
    $label.addEventListener('click', onToggleCollapse)
  }
  $customCss.addEventListener('input', () => autoResize($customCss))
  $exportSettingsButton.addEventListener('click', () => {
    // macOS Safari can't export from the browser action, WebKitBlobResource error 1
    // We can't use navigator.share() instead as it doesn't have a save option
    if (isBrowserAction && browser == 'mac') {
      chrome.runtime.openOptionsPage()
      window.close()
      return
    }
    exportSettings()
  })
  $customThemeInput.addEventListener('input', onCustomThemeInput)
  $displaySettingsLink.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: $displaySettingsLink.href })
    })
  })
  $fileInput.addEventListener('change', importSettings)
  $form.addEventListener('change', onFormChanged)
  $importSettingsButton.addEventListener('click', () => {
    $importMessages.replaceChildren()
    // Firefox can't import from the browser action, file input closes the popup
    if (isBrowserAction && browser == 'firefox') {
      chrome.runtime.openOptionsPage()
      window.close()
      return
    }
    $fileInput.click()
  })
  $hideQuotesFromDetails.addEventListener('toggle', updateHideQuotesFromDisplay)
  $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
  $mutedWords.addEventListener('input', onMutedWordsInput)
  $proButton.addEventListener('click', (e) => {
    e.preventDefault()
    chrome.runtime.sendMessage({ type: 'open_pro_window' })
  })
  $saveCustomCssButton.addEventListener('click', saveCustomCss)
  for (const $tab of $tabs) {
    $tab.addEventListener('click', onTabClick)
  }
  if (config.settings.mutedWordsError) {
    showMutedWordsError(validateMuteRegExps(config.settings.mutedWords))
  }

  const tabsResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      tabsHeight = entry.contentRect.height
      $body.style.setProperty('--tabs-height', `${tabsHeight}px`)
      stickyObserver?.disconnect()
      stickyObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const $sentinel = /** @type {HTMLElement} */ (entry.target)
            // Ignore hidden sentinels
            if ($sentinel.offsetParent == null) continue
            const $label = $sentinel.closest('section.labelled').querySelector('label')
            if ($sentinel.classList.contains('top')) {
              $label.classList.toggle(
                'stuck',
                !entry.isIntersecting && entry.boundingClientRect.top < tabsHeight,
              )
            }
            if ($sentinel.classList.contains('bottom')) {
              $label.classList.toggle(
                'unstick',
                !entry.isIntersecting && entry.boundingClientRect.top < tabsHeight,
              )
            }
          }
        },
        {
          rootMargin: `-${tabsHeight}px 0px 0px 0px`,
        },
      )
      for (const $sentinel of $stickySentinels) {
        stickyObserver.observe($sentinel)
      }
    }
  })
  tabsResizeObserver.observe($tablist)

  chrome.storage.onChanged.addListener(onStorageChanged)

  applyConfig()
}

main()

//#endregion
