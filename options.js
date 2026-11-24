import { createFeatureSearchController } from './shared/feature-search-controller.js'
import {
  get,
  OPEN_APP_MESSAGE,
  SYNC_SETTINGS_CHANGED_MESSAGE,
  sendMessage,
  set,
  setSettings,
} from './shared/settings.js'
import { isObject } from './shared/settings-schema.js'
import { createSettingsTransferController } from './shared/settings-transfer-controller.js'

import { DEFAULT_SETTINGS } from './default-settings.js'
import { settingsTransfer } from './schemas.js'

import './shared/options-components.js'

const $body = document.body
$body.classList.toggle('v5', Number(chrome.runtime.getManifest().version.split('.')[0]) >= 5)
document.getElementById('version').textContent = `v${chrome.runtime.getManifest().version}`
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
/** @type {typeof browser | 'legacy'} */
let theme = browser
$body.classList.add(`browser-${browser}`, theme)

function updateOptionsStyle() {
  const selected = config.optionsStyle
  const next = ['chrome', 'edge', 'firefox', 'ios', 'mac', 'legacy'].includes(selected)
    ? selected
    : browser
  if (next == theme) return
  $body.classList.remove(theme)
  theme = /** @type {typeof theme} */ (next)
  $body.classList.add(theme)
}
//#endregion

//#region Localisation
document.title = chrome.i18n.getMessage('extensionName')

//#region Ids
for (const translationId of [
  'advancedOptions',
  'appearanceOptions',
  'backupAndRestoreOptions',
  'customTheme',
  'developerOptions',
  'features',
  'featuresDisabledInfo',
  'hideNavigationItemsOptions',
  'homeTimelineOptions',
  'mediaOptions',
  'mutedWords',
  'mutedWordsInfo',
  'needMoreRoom',
  'openInTabLink',
  'otherPagesOptions',
  'reduceEngagementOptions',
  'settings',
  'sidebar',
  'timelineContentOptions',
  'tweetActionsOptions',
  'tweetPageOptions',
  'xFeaturesOptions',
]) {
  const $el = document.getElementById(translationId)
  if ($el) {
    $el.textContent = chrome.i18n.getMessage(translationId)
  } else {
    console.warn('could not find element for translationId', translationId)
  }
}
//#endregion

//#region Classes
for (const translationClass of ['saveAndApply']) {
  const translation = chrome.i18n.getMessage(translationClass)
  for (const $el of document.querySelectorAll(`.${translationClass}`)) {
    $el.textContent = translation
  }
}
//#endregion

//#region Option values
for (const amount of [1_000, 10_000, 100_000, 1_000_000]) {
  document.querySelector(`option[value="${amount}"]`).textContent = formatFollowerCount(amount)
}
//#endregion

document.querySelector('#customThemeInfo').innerHTML = chrome.i18n.getMessage('customThemeInfo')
for (const id of ['featureSearchToggle', 'featureSearchInput']) {
  document.getElementById(id).setAttribute('aria-label', chrome.i18n.getMessage('searchFeatures'))
}
document.getElementById('featureSearchToggle').title = chrome.i18n.getMessage('searchFeatures')
document
  .getElementById('enabledToggle')
  .setAttribute('aria-label', chrome.i18n.getMessage('extensionName'))
document
  .getElementById('featureSearchInput')
  .setAttribute('placeholder', chrome.i18n.getMessage('searchFeatures'))
document
  .getElementById('featureSearchClear')
  .setAttribute('aria-label', chrome.i18n.getMessage('clearFeatureSearch'))
document.getElementById('featureSearchEmpty').textContent =
  chrome.i18n.getMessage('noMatchingFeatures')
//#endregion

/**
 * Internal options which map directly to a form element.
 * @type {import('./types').StoredConfigKey[]}
 */
const INTERNAL_CONFIG_FORM_KEYS = [
  'debug',
  'debugLogGetElementStats',
  'debugLogTimelineStats',
  'optionsStyle',
  'syncSettings',
]
/** @type {Set<string>} */
const INTERNAL_CONFIG_FORM_KEYSET = new Set(INTERNAL_CONFIG_FORM_KEYS)

//#region Default config
/** @type {import("./types").StoredConfig} */
const defaultConfig = {
  collapsedGroups: ['advanced', 'developer'],
  debug: false,
  debugLogGetElementStats: false,
  debugLogTimelineStats: false,
  enabled: true,
  optionsStyle: 'automatic',
  syncSettings: true,
  tab: 'features',
  // Default based on the platform if the oage script hasn't run yet
  lastLayout: /(Android|iP(ad|hone))/.test(navigator.userAgent) ? 'mobile' : 'desktop',
  lastSiteVersion: 'rweb',
}
//#endregion

//#region Config & variables
/** @type {import("./types").StoredConfig} */
let config

/**
 * Checkbox group configuration for the layout being used (mobile or desktop).
 * @type {Map<string, string[]>}
 */
let checkboxGroups

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
const $enabledLabel = document.querySelector('#enabled')
const $enabledToggle = document.getElementById('enabledToggle')
const $exportSettingsButton = document.querySelector('button#exportSettings')
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
const $importSettingsButton = /** @type {HTMLButtonElement} */ (
  document.querySelector('button#importSettings')
)
const $mutedQuotes = /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
const $mutedQuotesCount = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesCount'))
const $mutedQuotesDetails = /** @type {HTMLDetailsElement} */ (
  document.querySelector('details#mutedQuotesDetails')
)
const $mutedWords = /** @type {HTMLTextAreaElement} */ (
  document.querySelector('textarea#mutedWords')
)
const $mutedWordsError = document.querySelector('#mutedWordsError')
const $mutedWordsErrorLine = document.querySelector('#mutedWordsErrorLine')
const $mutedWordsErrorMessage = document.querySelector('#mutedWordsErrorMessage')
const $panels = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.panel'))
const $manageProAccount = /** @type {HTMLAnchorElement} */ (
  document.querySelector('#manageProAccount')
)
const $proAccountInfo = /** @type {HTMLDListElement} */ (document.querySelector('#proAccountInfo'))
const $proAccountSection = /** @type {HTMLElement} */ (document.querySelector('#proAccountSection'))
const $proSignInInfo = /** @type {HTMLElement} */ (document.querySelector('#proSignInInfo'))
const $proSignInLink = /** @type {HTMLAnchorElement} */ (document.querySelector('#proSignInLink'))
const $proSignInSection = /** @type {HTMLElement} */ (document.querySelector('#proSignInSection'))
const $openDebugTraceButton = document.querySelector('button#openDebugTrace')
const $saveCustomCssButton = document.querySelector('button#saveCustomCss')
const $showPremiumReplyFollowersCount = /** @type {HTMLElement} */ (
  document.querySelector('#showPremiumReplyFollowersCount')
)
const $featurePanel = document.querySelector('.panel[data-tab="features"]')
const $featureSearchToggle = document.getElementById('featureSearchToggle')
const $featureSearchRow = document.getElementById('featureSearchRow')
const $featureSearchInput = /** @type {HTMLInputElement} */ (
  document.getElementById('featureSearchInput')
)
const $featureSearchClear = document.getElementById('featureSearchClear')
const $featureSearchEmpty = document.getElementById('featureSearchEmpty')
const $syncLastSynced = /** @type {HTMLElement} */ (document.querySelector('#syncLastSynced'))
const $tablist = /** @type {HTMLElement} */ (document.querySelector('.tabs'))
const $tabs = Array.from($tablist.querySelectorAll('button'))
//#endregion

//#region Feature search
const featureSearchController = createFeatureSearchController({
  panel: $featurePanel,
  input: $featureSearchInput,
  row: $featureSearchRow,
  toggle: $featureSearchToggle,
  clear: $featureSearchClear,
  empty: $featureSearchEmpty,
  normalizeTerms: (text) =>
    text
      .replace(/\b(?:reposts?|retweets?)\b/g, 'retweet')
      .replace(/\b(?:posts?|tweets?)\b/g, 'tweet'),
  onOpen: () => {
    if (config.tab != 'features') selectOptionsTab('features')
  },
  onFilteringChange: updateCollapsedOptionGroupsDisplay,
})
//#endregion

//#region Settings transfer
const settingsTransferController = createSettingsTransferController({
  transfer: settingsTransfer,
  filenamePrefix: 'control-panel-for-twitter',
  browser,
  isBrowserAction,
  importButton: $importSettingsButton,
  exportButton: $exportSettingsButton,
  fileInput: $fileInput,
  onImportResult: renderSettingsImportResult,
  onExportError: () => {
    const message = document.getElementById('exportMessages')
    message.textContent = chrome.i18n.getMessage('settingsExportFailed')
    message.classList.add('text-error')
  },
})
if (settingsTransferController.importRequiresTab) {
  $importSettingsButton.textContent = chrome.i18n.getMessage('openOptionsPage')
  $importMessages.textContent = chrome.i18n.getMessage('optionsPageImportSettingsNote')
}
if (settingsTransferController.exportRequiresTab) {
  $exportSettingsButton.textContent = chrome.i18n.getMessage('openOptionsPage')
  document.getElementById('exportMessages').textContent = chrome.i18n.getMessage(
    'optionsPageExportSettingsNote',
  )
}
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

function formatDate(timestamp) {
  if (!timestamp) return null
  return new Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(timestamp))
}

function formatDateTime(timestamp) {
  if (!timestamp) return null
  return new Intl.DateTimeFormat([], { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(timestamp),
  )
}

function formatSubscriptionStatus(status) {
  return status
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function formatSubscriptionType(type) {
  return `${type[0].toUpperCase()}${type.slice(1)}`
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
  $body.classList.toggle('mobile', config.lastLayout == 'mobile')
  $body.classList.toggle('desktop', config.lastLayout == 'desktop')
  const siteVersion = config.lastSiteVersion || 'rweb'
  $body.classList.toggle('rweb', siteVersion == 'rweb')
  $body.classList.toggle('xweb', siteVersion == 'xweb')
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

/** @param {import('./shared/types').SettingsImportResult | null} result */
function renderSettingsImportResult(result) {
  if (!result) {
    $importMessages.replaceChildren()
    return
  }
  const messages = result.issues.map(({ code, detail }) => chrome.i18n.getMessage(code, detail))
  $importMessages.replaceChildren(
    h(
      'span',
      { class: 'whitespace-pre-line' },
      h(
        'span',
        { class: ['font-bold', result.success ? 'text-success' : 'text-error'] },
        chrome.i18n.getMessage(result.success ? 'settingsImported' : 'settingsNotImported'),
      ),
      messages.length > 0 && [
        '\n\n',
        h(
          'span',
          { class: result.success ? 'text-secondary' : 'text-error' },
          messages.join('\n\n'),
        ),
      ],
    ),
  )
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
    (e.target instanceof HTMLInputElement && ['file', 'text', 'search'].includes(e.target.type))
  )
    return

  /** @type {Partial<import("./types").StoredConfig>} */
  const changedConfig = {}
  /** @type {Partial<import("./types").UserSettings>} */
  const changedSettings = {}

  // Handle input
  const $el = /** @type {HTMLInputElement} */ (e.target)
  if (INTERNAL_CONFIG_FORM_KEYSET.has($el.name)) {
    config[$el.name] = changedConfig[$el.name] = $el.type == 'checkbox' ? $el.checked : $el.value
  } else if ($el.type == 'checkbox') {
    // Checkbox group toggle
    if (checkboxGroups.has($el.name)) {
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
  // Pick Chat when Notifications is fully hidden
  if (
    changedSettings.hideNotifications == 'hide' &&
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
  if (Object.hasOwn(storageChanges, 'settings')) {
    config.settings = {
      ...DEFAULT_SETTINGS,
      .../** @type {Partial<import('./types').UserSettings>} */ (settingsChanges),
    }
  }
  applyConfig()
}

function onToggleEnabled() {
  config.enabled = !config.enabled
  storeConfigChanges({ enabled: config.enabled })
  updateDisplay()
}

/** @param {import('./types').StoredConfig['tab']} tab */
function selectOptionsTab(tab) {
  config.tab = tab
  storeConfigChanges({ tab })
  window.scrollTo({ top: 0 })
  updateDisplay()
}

function onTabClick(e) {
  // Start the segmented indicator animation only after interaction
  $tablist.classList.add('animate')
  selectOptionsTab(e.currentTarget.getAttribute('data-tab'))
}

function onTabKeyDown(e) {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
  const tabs = $tabs.filter(($tab) => getComputedStyle($tab).display != 'none')
  const current = tabs.indexOf(e.currentTarget)
  const direction = getComputedStyle($tablist).direction == 'rtl' ? -1 : 1
  let next = current + (e.key == 'ArrowRight' ? direction : -direction)
  if (e.key == 'Home') next = 0
  else if (e.key == 'End') next = tabs.length - 1
  const $next = tabs[(next + tabs.length) % tabs.length]
  e.preventDefault()
  $next.click()
  $next.focus()
}

function onToggleCollapse(e) {
  if (theme == 'ios' || featureSearchController.isFiltering) return
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

function openProApp(path = '/') {
  sendMessage({ type: OPEN_APP_MESSAGE, path }).catch(() => {})
}

function saveCustomCss() {
  const customCss = /** @type {HTMLTextAreaElement} */ ($form.elements.namedItem('customCss')).value
  if (config.settings.customCss == customCss) return
  config.settings.customCss = customCss
  storeConfigChanges({ settings: { customCss } })
}

function openCustomCssInTab(e) {
  e.preventDefault()
  chrome.tabs.create(
    { url: chrome.runtime.getURL('options.html#customCssSection'), active: true },
    () => window.close(),
  )
}

function focusCustomCss() {
  config.tab = 'features'
  config.collapsedGroups = config.collapsedGroups.filter((id) => id != 'advanced')
  updateDisplay()
  autoResize($customCss)
  $customCss.scrollIntoView({ block: 'center' })
  $customCss.focus({ preventScroll: true })
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
  const internalConfig = {}
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
    if (Object.hasOwn(internalConfig, 'syncSettings')) {
      sendMessage({
        type: SYNC_SETTINGS_CHANGED_MESSAGE,
        enabled: internalConfig.syncSettings,
      }).catch(() => {})
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
      !(featureSearchController.isFiltering && $featurePanel.contains($label)) &&
        config.collapsedGroups.includes($label.getAttribute('data-collapse-id')),
    )
  }
}

function updateDisplay() {
  updateOptionsStyle()
  $body.classList.toggle('debugging', config.debug)
  $body.classList.toggle('defaultingFollowingToRecent', config.settings.defaultFollowingToRecent)
  $body.classList.toggle('defaultingToFollowing', config.settings.defaultToFollowing)
  $body.classList.toggle('disabled', !config.enabled)
  $enabledLabel.textContent = chrome.i18n.getMessage(config.enabled ? 'enabled' : 'disabled')
  $enabledToggle.setAttribute('aria-pressed', String(config.enabled))
  $enabledToggle.title = `${chrome.i18n.getMessage('extensionName')}: ${$enabledLabel.textContent}`
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
  $body.classList.toggle('restoringTwitterBranding', config.settings.revertXBranding)
  $body.classList.toggle('uninvertedFollowButtons', config.settings.uninvertFollowButtons)
  $displaySettingsLink.href = 'https://x.com/settings/display'
  const $sensitiveContentInfo = document.getElementById('unblurSensitiveContentInfo')
  $sensitiveContentInfo.classList.add('xweb')
  $sensitiveContentInfo.textContent = chrome.i18n.getMessage('refreshRequired')
  updateProDisplay()
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
  featureSearchController.update()
}

function updateProDisplay() {
  const { subscription } = config
  const hasSubscription = subscription != null
  $proAccountSection.hidden = !hasSubscription
  $proSignInSection.hidden = hasSubscription
  document.getElementById('importSettingsInfo').textContent = chrome.i18n.getMessage(
    $body.classList.contains('v5') && config.token && config.syncSettings
      ? 'importSettingsSyncedInfo'
      : 'importSettingsInfo',
  )
  $syncLastSynced.textContent = !config.syncSettings
    ? chrome.i18n.getMessage('syncSettingsDisabledInfo')
    : config.lastSyncTime
      ? `Last synced: ${formatDateTime(config.lastSyncTime)}`
      : 'Last synced: Never'

  if (!subscription) {
    $proSignInInfo.textContent = config.token
      ? 'Loading account details…'
      : 'An Extensions Pro subscription enables Pro options.'
    $proSignInLink.textContent = config.token ? 'Open Extensions Pro' : 'Sign in to Extensions Pro'
    return
  }

  const accountInfo = []
  if (config.accountEmail) {
    accountInfo.push(['Email', config.accountEmail])
  }
  accountInfo.push(['Plan', formatSubscriptionType(subscription.type)])
  accountInfo.push(['Status', formatSubscriptionStatus(subscription.status)])

  if (subscription.type == 'lifetime') {
    accountInfo.push(['Active since', formatDateTime(subscription.createdAt)])
  } else if (subscription.currentPeriodEnd) {
    accountInfo.push([
      subscription.cancelAtPeriodEnd || !subscription.active ? 'Ends' : 'Renews',
      formatDate(subscription.currentPeriodEnd),
    ])
  }

  $proAccountInfo.replaceChildren(
    ...accountInfo.flatMap(([label, value]) => [h('dt', null, label), h('dd', null, value)]),
  )
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
          'div',
          { class: 'option-row button muted-entry' },
          h('span', { class: 'muted-entry-content' }, `@${user}`),
          h(
            'button',
            {
              type: 'button',
              class: 'unmute-button',
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
          'div',
          { class: 'option-row button muted-entry mutedQuote' },
          h(
            'div',
            { class: 'muted-entry-content' },
            user,
            ' – ',
            new Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(time)),
            text && h('p', { class: 'mb-0 whitespace-pre-line muted-entry-description' }, text),
          ),
          h(
            'button',
            {
              type: 'button',
              class: 'unmute-button',
              onclick: () => {
                config.settings.mutedQuotes = config.settings.mutedQuotes.filter(
                  (_, i) => i != index,
                )
                storeConfigChanges({ settings: { mutedQuotes: config.settings.mutedQuotes } })
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
      updateFormControl($form.elements[key], config[key] ?? defaultConfig[key])
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
  const visibleTabs = $tabs.filter(($tab) => getComputedStyle($tab).display != 'none')
  if (
    !visibleTabs.some(($tab) => $tab.getAttribute('data-tab') == config.tab) &&
    visibleTabs.length
  ) {
    config.tab = /** @type {import('./types').StoredConfig['tab']} */ (
      visibleTabs[0].getAttribute('data-tab')
    )
  }
  $tablist.style.setProperty('--tab-count', String(visibleTabs.length || 1))
  $tablist.style.setProperty(
    '--selected-tab-index',
    String(visibleTabs.findIndex(($tab) => $tab.getAttribute('data-tab') == config.tab)),
  )
  for (const $tab of $tabs) {
    const selected = $tab.getAttribute('data-tab') == config.tab
    $tab.setAttribute('aria-selected', String(selected))
    $tab.tabIndex = selected ? 0 : -1
  }
  featureSearchController.updateDisplay(config.tab == 'features')
  for (const $panel of $panels) {
    $panel.style.display = config.tab == $panel.getAttribute('data-tab') ? 'block' : 'none'
  }
  if (config.tab == 'features') {
    autoResize($customCss)
  } else if (config.tab == 'pro') {
    autoResize($mutedWords)
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
  $enabledToggle.addEventListener('click', onToggleEnabled)
  featureSearchController.connect()
  $customCss.addEventListener('input', () => autoResize($customCss))
  $customCss.addEventListener('keydown', (e) => {
    if (!e.isComposing && e.key == 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      saveCustomCss()
    }
  })
  document.getElementById('openInTabLink').addEventListener('click', openCustomCssInTab)
  settingsTransferController.connect()
  $customThemeInput.addEventListener('input', onCustomThemeInput)
  $displaySettingsLink.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: $displaySettingsLink.href })
    })
  })
  $form.addEventListener('change', onFormChanged)
  $hideQuotesFromDetails.addEventListener('toggle', updateHideQuotesFromDisplay)
  $manageProAccount.addEventListener('click', (e) => {
    e.preventDefault()
    openProApp('/account')
  })
  $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
  $mutedWords.addEventListener('input', onMutedWordsInput)
  $openDebugTraceButton.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('shared/trace.html') })
  })
  $proSignInLink.addEventListener('click', (e) => {
    e.preventDefault()
    openProApp()
  })
  $saveCustomCssButton.addEventListener('click', saveCustomCss)
  for (const $tab of $tabs) {
    $tab.addEventListener('click', onTabClick)
    $tab.addEventListener('keydown', onTabKeyDown)
  }
  if (config.settings.mutedWordsError) {
    showMutedWordsError(validateMuteRegExps(config.settings.mutedWords))
  }

  chrome.storage.onChanged.addListener(onStorageChanged)

  applyConfig()
  if (location.hash == '#customCssSection') focusCustomCss()
}

main()

//#endregion
