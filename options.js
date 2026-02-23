import {DEFAULT_SETTINGS} from './settings.js'
import {get, set} from './storage.js'
import {isObject, validateSettingsJson} from './validation.js'

const $body = document.body
const isBrowserAction = $body.classList.contains('browserAction')

//#region Theme hooks
/** @type {'chrome' | 'edge' | 'firefox' | 'ios' | 'mac'} */
const browser = (() => {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.includes('firefox')) return 'firefox'
  else if (ua.includes('edg/')) return 'edge'
  else if (ua.includes('safari') && !ua.includes('chrome'))
    return ua.includes('iphone') || ua.includes('ipad') ? 'ios' : 'mac'
  return 'chrome'
})()
let theme = browser
$body.classList.add(`browser-${browser}`, theme)

if (theme == 'chrome' || theme == 'edge' || theme == 'firefox') {
  let $top = document.createElement('div')
  $top.className = 'stickySentinel top'
  let $bottom = document.createElement('div')
  $bottom.className = 'stickySentinel bottom'
  for (let $group of document.querySelectorAll('section.group.labelled')) {
    $group.prepend($top.cloneNode())
    let $options = $group.querySelector('.options')
    $options.insertBefore($bottom.cloneNode(), $options.lastElementChild)
  }
}
//#endregion

//#region Localisation
document.title = chrome.i18n.getMessage('extensionName')

for (let optionValue of [
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
  let label = chrome.i18n.getMessage(`option_${optionValue}`)
  for (let $option of document.querySelectorAll(`option[value="${optionValue}"]`)) {
    $option.textContent = label
  }
}

for (let translationId of [
  'addAddMutedWordMenuItem_desktop',
  'addAddMutedWordMenuItem_mobile',
  'addFocusedTweetAccountLocation',
  'addUserHoverCardAccountLocation',
  'backupAndRestoreOptions',
  'bypassAgeVerification',
  'customCss',
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
  'tweakNewLayout',
  'tweakNewLayoutInfo',
  'tweakQuoteTweetsPage',
  'uiImprovementsOptions',
  'uiTweaksOptions',
  'unblurSensitiveContent',
  'uninvertFollowButtons',
  'xFixesOptions',
]) {
  let $el = document.getElementById(translationId)
  if ($el) {
    $el.textContent = chrome.i18n.getMessage(translationId)
  } else {
    console.warn('could not find element for translationId', translationId)
  }
}

for (let translationClass of [
  'hideBookmarksNav',
  'hideBusinessNav',
  'hideCommunitiesNav',
  'hideConnectNav',
  'hideCreatorStudioNav',
  'hideListsNav',
  'notifications',
  'saveAndApply',
]) {
  let translation = chrome.i18n.getMessage(translationClass)
  for (let $el of document.querySelectorAll(`.${translationClass}`)) {
    $el.textContent = translation
  }
}

for (let amount of [1_000, 10_000, 100_000, 1_000_000]) {
  document.querySelector(`option[value="${amount}"]`).textContent = formatFollowerCount(amount)
}

if (browser == 'firefox' && isBrowserAction) {
  document.getElementById('import').textContent = chrome.i18n.getMessage('openOptionsPage')
  document.getElementById('importMessages').textContent = chrome.i18n.getMessage('optionsPageImportSettingsNote')
}
//#endregion

/**
 * Internal options which map directly to a form element.
 * @type {import('./types').StoredConfigKey[]}
 */
const INTERNAL_CONFIG_FORM_KEYS = ['debug', 'debugLogGetElementStats', 'debugLogTimelineStats', 'enabled']
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
  tab: 'features',
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
let $collapsibleLabels = document.querySelectorAll('section.labelled.collapsible > label[data-collapse-id]')
let $customCss = /** @type {HTMLTextAreaElement} */ (document.querySelector('textarea#customCss'))
let $exportSettingsButton = document.querySelector('button#export')
let $fileInput = /** @type {HTMLInputElement} */ (document.querySelector('input[type="file"]'))
let $form = document.querySelector('form')
let $hideQuotesFrom =  /** @type {HTMLDivElement} */ (document.querySelector('#hideQuotesFrom'))
let $hideQuotesFromCount = /** @type {HTMLElement} */ (document.querySelector('#hideQuotesFromCount'))
let $hideQuotesFromDetails = /** @type {HTMLDetailsElement} */ (document.querySelector('details#hideQuotesFromDetails'))
let $importMessages = /** @type {HTMLElement} */ (document.querySelector('#importMessages'))
let $importSettingsButton = document.querySelector('button#import')
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesCount = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesCount'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $optionsIcon = /** @type {HTMLImageElement} */ (document.querySelector('#optionsIcon'))
let $panels = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.panel'))
let $saveCustomCssButton = document.querySelector('button#saveCustomCss')
let $showPremiumReplyFollowersCount = /** @type {HTMLElement} */ (document.querySelector('#showPremiumReplyFollowersCount'))
let $stickySentinels = document.querySelectorAll('.stickySentinel')
let $tablist = /** @type {HTMLElement} */ (document.querySelector('.tabs'))
let $tabs = Array.from($tablist.querySelectorAll('button'))
//#endregion

//#region Utility functions
function autoResize($textarea) {
  if (!$textarea.offset == null) return
  $textarea.style.height = 'auto';
  $textarea.style.height = Math.ceil($textarea.scrollHeight + 2) + 'px';
}

function formatFollowerCount(num) {
  let numFormat = Intl.NumberFormat(undefined, {notation: 'compact', compactDisplay: num < 1_000_000 ? 'short' : 'long'})
  return numFormat.format(num)
}

/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {({[key: string]: any} | null)?} attributes
 * @param {...any} children
 * @returns {HTMLElement}
 */
 function h(tagName, attributes, ...children) {
  let $el = document.createElement(tagName)

  if (attributes) {
    for (let [prop, value] of Object.entries(attributes)) {
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
        for (let [name, styleValue] of Object.entries(value)) {
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

  for (let child of children.flat()) {
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
    })
  )
}
//#endregion

//#region Options page functions
/**
 * Update the options page to match the current config.
 */
function applyConfig() {
  $body.classList.toggle('mobile', config.version == 'mobile')
  $body.classList.toggle('desktop', config.version == 'desktop')
  checkboxGroups = new Map(Object.entries({
    hideAllMetrics: [
      'hideBookmarkMetrics',
      'hideFollowingMetrics',
      'hideLikeMetrics',
      'hideReplyMetrics',
      'hideRetweetMetrics',
      'hideQuoteTweetMetrics',
      'hideProfileHeaderMetrics',
    ]
  }))
  updateFormControls()
  updateCheckboxGroups()
  updateDisplay()
}

async function exportSettings() {
  let config = await get({settings: {}})
  let $a = document.createElement('a')
  let version = chrome.runtime.getManifest().version
  $a.download = `control-panel-for-twitter-v${version}-settings.json`
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify({settings: sortKeys(config.settings), version}, null, 2)
  ], {type: 'application/json'}))
  $a.click()
  URL.revokeObjectURL($a.href)
}

let clearImportMessagesTimeout = null

async function importSettings() {
  if (clearImportMessagesTimeout) {
    clearTimeout(clearImportMessagesTimeout)
    clearImportMessagesTimeout = null
  }
  let file = $fileInput.files[0]
  // Allow the same file to be re-selected if the user edits it
  $fileInput.files = null
  if (!file) {
    $importMessages.replaceChildren(
      h('span', {class: 'text-error'}, chrome.i18n.getMessage('noFileSelected'))
    )
    return
  }
  let json = await file.text()
  let {settings, messages} = validateSettingsJson(json)
  if (settings != null) {
    await set({settings})
  } else {
    $importMessages.style.color = 'var(--text-error)'
  }
  $importMessages.replaceChildren(
    h('span', {class: 'whitespace-pre-line'},
      h('span', {class: ['font-bold', settings != null ? 'text-success' : 'text-error']},
        chrome.i18n.getMessage(settings != null ? 'settingsImported' : 'settingsNotImported')
      ),
      messages.length > 0 && ['\n\n', h('span', {class: 'text-error'}, messages.join('\n\n'))]
    )
  )
  if (settings != null) {
    clearImportMessagesTimeout = setTimeout(() => $importMessages.replaceChildren(), 3000)
  }
}

function onFormChanged(/** @type {Event} */ e) {
  if (
    e.target instanceof HTMLTextAreaElement ||
    e.target instanceof HTMLInputElement && e.target.type == 'file'
  ) return

  /** @type {import("./types").StoredConfig} */
  let changedConfig = Object.create(null)
  /** @type {Partial<import("./types").UserSettings>} */
  let changedSettings = Object.create(null)

  // Handle input
  let $el = /** @type {HTMLInputElement} */ (e.target)
  if ($el.type == 'checkbox') {
    // All internal config is currently checkbox toggles
    if (INTERNAL_CONFIG_FORM_KEYSET.has($el.name)) {
      config[$el.name] = changedConfig[$el.name] = $el.checked
    }
    // Checkbox group toggle
    else if (checkboxGroups.has($el.name)) {
      checkboxGroups.get($el.name).forEach(checkboxName => {
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
  if (changedSettings.hideNotifications &&
      config.settings.disabledHomeTimelineRedirect == 'notifications') {
    let key = 'disabledHomeTimelineRedirect'
    $form.elements[key].value = config.settings[key] = changedSettings[key] = 'messages'
  }

  updateDisplay()
  if (Object.keys(changedSettings).length > 0) {
    changedConfig.settings = changedSettings
  }
  storeConfigChanges(changedConfig)
}

/**
 * Listen for storage changes while the options page is open and update its
 * controls to reflect them. We only store settings the user has interacted
 * with.
 * @param {{[key: string]: chrome.storage.StorageChange}} storageChanges
 */
function onStorageChanged(storageChanges) {
  let changes = Object.fromEntries(
    Object.entries(storageChanges).map(([key, {newValue}]) => [key, newValue])
  )
  let {settings: settingsChanges, ...configChanges} = changes
  Object.assign(config, configChanges)
  Object.assign(config.settings, settingsChanges)
  applyConfig()
}

function onTabClick(e) {
  // Only start animating on interaction, to avoid initial flash of animation
  $tablist.classList.add('animate')
  let tab = e.currentTarget.getAttribute('data-tab')
  config.tab = tab
  storeConfigChanges({tab})
  window.scrollTo({top: 0})
  updateDisplay()
}

function onToggleCollapse(e) {
  if (theme == 'ios') return
  let collapsedGroups = config.collapsedGroups.slice()
  let collapseId = e.currentTarget.getAttribute('data-collapse-id')
  let index = collapsedGroups.indexOf(collapseId)
  if (index == -1) {
    collapsedGroups.push(collapseId)
  } else {
    collapsedGroups.splice(index, 1)
  }
  config.collapsedGroups = collapsedGroups
  storeConfigChanges({collapsedGroups})
  updateDisplay()
}

function saveCustomCss() {
  let customCss = $form.elements['customCss'].value
  if (config.settings.customCss == customCss) return
  config.settings.customCss = customCss
  storeConfigChanges({settings: {customCss}})
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
  let changesToStore = {}
  for (let key of Object.keys(defaultConfig)) {
    if (Object.hasOwn(changes, key)) {
      changesToStore[key] = changes[key]
    }
  }
  try {
    if (changes.settings) {
      let {settings: storedSettings} = await get({settings: {}})
      changesToStore.settings = {...storedSettings, ...changes.settings}
    }
  } catch(e) {
    console.error('[options] error merging settings change', e)
  }
  try {
    await set(changesToStore)
  } catch(e) {
    console.error('[options] error storing config change', e)
  }
}

function updateCheckboxGroups() {
  for (let [group, checkboxNames] of checkboxGroups.entries()) {
    let checkedCount = checkboxNames.filter(name => config.settings[name]).length
    $form.elements[group].checked = checkedCount == checkboxNames.length
    $form.elements[group].indeterminate = checkedCount > 0 && checkedCount < checkboxNames.length;
  }
}

function updateCollapsedOptionGroupsDisplay() {
  for (let $label of $collapsibleLabels) {
    $label.parentElement.classList.toggle('collapsed', config.collapsedGroups.includes($label.getAttribute('data-collapse-id')))
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
  $body.classList.toggle('hidingSuggestedFollows', config.settings.hideSidebarContent || config.settings.hideSuggestedFollows)
  $body.classList.toggle('mutingQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle('showingBlueReplyFollowersCount', config.settings.showPremiumReplyFollowersCount)
  $body.classList.toggle('showingSidebarContent', !config.settings.hideSidebarContent)
  $body.classList.toggle('sortingRepliesByLikes', config.settings.sortReplies == 'liked')
  $body.classList.toggle('tweakingNewLayout', config.settings.tweakNewLayout)
  $body.classList.toggle('uninvertedFollowButtons', config.settings.uninvertFollowButtons)
  let icon = `options-icon${!config.enabled ? '-disabled' : ''}.png`
  if ($optionsIcon.src != icon) {
    $optionsIcon.src = icon
  }
  $showPremiumReplyFollowersCount.textContent = chrome.i18n.getMessage(
    'showPremiumReplyFollowersCount',
    formatFollowerCount(Number(config.settings.showPremiumReplyFollowersCountAmount))
  )
  updateCollapsedOptionGroupsDisplay()
  updateHideQuotesFromDisplay()
  updateMutedQuotesDisplay()
  updateTabsDisplay()
}

function updateHideQuotesFromDisplay() {
  if (!shouldDisplayHideQuotesFrom()) return

  $hideQuotesFromCount.textContent =
    chrome.i18n.getMessage('hideQuotesFromCount', String(config.settings.hideQuotesFrom.length))

  if (!$hideQuotesFromDetails.open) return

  while ($hideQuotesFrom.hasChildNodes()) $hideQuotesFrom.firstChild.remove()
  for (let user of config.settings.hideQuotesFrom) {
    $hideQuotesFrom.appendChild(
      h('section', null,
        h('label', {class: 'button'},
          h('span', null, `@${user}`),
          h('button', {
            type: 'button',
            onclick() {
              config.settings.hideQuotesFrom = config.settings.hideQuotesFrom.filter(u => u != user)
              updateDisplay()
              storeConfigChanges({settings: {hideQuotesFrom: config.settings.hideQuotesFrom}})
            }
          }, chrome.i18n.getMessage('unmuteButtonText'))
        )
      )
    )
  }
}

function updateMutedQuotesDisplay() {
  if (!shouldDisplayMutedQuotes()) return

  $mutedQuotesCount.textContent = chrome.i18n.getMessage('mutedTweetsCount', String(config.settings.mutedQuotes.length))

  if (!$mutedQuotesDetails.open) return

  while ($mutedQuotes.hasChildNodes()) $mutedQuotes.firstChild.remove()

  config.settings.mutedQuotes.forEach(({user, time, text}, index) => {
    $mutedQuotes.appendChild(
      h('section', null,
        h('label', {class: 'button mutedQuote'},
          h('div', null,
            user,
            ' – ',
            new Intl.DateTimeFormat([], {dateStyle: 'medium'}).format(new Date(time)),
            text && h('p', {class: 'mb-0'}, text),
          ),
          h('button', {
            type: 'button',
            onclick: () => {
              config.settings.mutedQuotes = config.settings.mutedQuotes.filter((_, i) => i != index)
              set({mutedQuotes: config.settings.mutedQuotes})
              updateDisplay()
            },
          }, chrome.i18n.getMessage('unmuteButtonText'))
        )
      )
    )
  })
}

function updateFormControls() {
  for (let key of INTERNAL_CONFIG_FORM_KEYSET) {
    updateFormControl($form.elements[key], config[key])
  }
  for (let key of Object.keys(config.settings)) {
    if (key in $form.elements) {
      updateFormControl($form.elements[key], config.settings[key])
    }
  }
}

function updateFormControl($control, value) {
  if ($control instanceof RadioNodeList) {
    // If a checkbox displays in multiple sections, update them all
    $control.forEach(input => /** @type {HTMLInputElement} */ (input).checked = value)
  }
  else if ($control.type == 'checkbox') {
    $control.checked = value
  }
  else {
    $control.value = value
  }
}

function updateTabsDisplay() {
  let selectedTabIndex = $tabs.findIndex($tab => $tab.getAttribute('data-tab') == config.tab)
  $tablist.style.setProperty('--selected-tab-index', String(selectedTabIndex))
  for (let $tab of $tabs) {
    $tab.setAttribute('aria-selected', String($tab.getAttribute('data-tab') == config.tab))
  }
  for (let $panel of $panels) {
    $panel.style.display = config.tab == $panel.getAttribute('data-tab') ? 'block' : 'none'
  }
  if (config.tab == 'features') {
    autoResize($customCss)
  }
}
//#endregion

//#region Main
async function main() {
  /** @type {Partial<import("./types").StoredConfig>} */
  let {settings: storedSettings = {}, ...storedConfig} = await get()
  config = {
    ...defaultConfig,
    ...storedConfig,
    settings: {...DEFAULT_SETTINGS, ...storedSettings}
  }

  $body.classList.toggle('debug', config.debug === true)
  for (let $label of $collapsibleLabels) {
    $label.addEventListener('click', onToggleCollapse)
  }
  $customCss.addEventListener('input', () => autoResize($customCss))
  $exportSettingsButton.addEventListener('click', exportSettings)
  $fileInput.addEventListener('change', importSettings)
  $form.addEventListener('change', onFormChanged)
  $importSettingsButton.addEventListener('click', () => {
    $importMessages.replaceChildren()
    if (browser == 'firefox' && isBrowserAction) {
      chrome.runtime.openOptionsPage()
      window.close()
    } else {
      $fileInput.click()
    }
  })
  $hideQuotesFromDetails.addEventListener('toggle', updateHideQuotesFromDisplay)
  $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
  $saveCustomCssButton.addEventListener('click', saveCustomCss)
  for (let $tab of $tabs) {
    $tab.addEventListener('click', onTabClick)
  }

  let tabsResizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      tabsHeight = entry.contentRect.height
      $body.style.setProperty('--tabs-height', `${tabsHeight}px`);
      stickyObserver?.disconnect()
      stickyObserver = new IntersectionObserver((entries) => {
        for (let entry of entries) {
          let $sentinel =/** @type {HTMLElement} */ (entry.target)
          // Ignore hidden sentinels
          if ($sentinel.offsetParent == null) continue
          let $label = $sentinel.closest('section.labelled').querySelector('label')
          if ($sentinel.classList.contains('top')) {
            $label.classList.toggle('stuck', !entry.isIntersecting && entry.boundingClientRect.top < tabsHeight)
          }
          if ($sentinel.classList.contains('bottom')) {
            $label.classList.toggle('unstick', !entry.isIntersecting && entry.boundingClientRect.top < tabsHeight)
          }
        }
      }, {
        rootMargin: `-${tabsHeight}px 0px 0px 0px`,
      })
      for (let $sentinel of $stickySentinels) {
        stickyObserver.observe($sentinel)
      }
    }
  })
  tabsResizeObserver.observe($tablist)

  chrome.storage.onChanged.addListener(onStorageChanged)

  applyConfig()
}

main()

// Open a port for the background page to detect when the options page is closed
chrome.runtime.connect({name: 'options'})
//#endregion