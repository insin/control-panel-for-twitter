import {DEFAULT_SETTINGS} from './settings.js'
import {get, set} from './storage.js'
import {isObject, validateSettingsJson} from './validation.js'

const $body = document.body
const isBrowserAction = $body.classList.contains('browserAction')

/** @type {'chrome' | 'edge' | 'firefox' | 'ios' | 'mac'} */
const browser = (() => {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.includes('firefox')) return 'firefox'
  else if (ua.includes('edg/')) return 'edge'
  else if (ua.includes('safari') && !ua.includes('chrome'))
    return ua.includes('iphone') || ua.includes('ipad') ? 'ios' : 'mac'
  return 'chrome'
})()
// TODO Allow the user to configure this
let theme = browser
$body.classList.add(`browser-${browser}`, theme)

//#region Localisation
document.title = chrome.i18n.getMessage(`extensionName`)

for (let optionValue of [
  'badges',
  'comfortable',
  'compact',
  'default',
  'hide',
  'ignore',
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
  'addAddMutedWordMenuItemLabel_desktop',
  'addAddMutedWordMenuItemLabel_mobile',
  'addFocusedTweetAccountLocationLabel',
  'addUserHoverCardAccountLocationLabel',
  'bypassAgeVerificationLabel',
  'customCssLabel',
  'debugInfo',
  'debugLabel',
  'debugLogGetElementStatsLabel',
  'debugLogTimelineStatsLabel',
  'defaultToFollowingLabel',
  'defaultToLatestSearchLabel',
  'disableHomeTimelineInfo',
  'disableHomeTimelineLabel',
  'disableTweetTextFormattingLabel',
  'disabledHomeTimelineRedirectLabel',
  'disabledHomeTimelineRedirectOption_messages',
  'dontUseChirpFontLabel',
  'dropdownMenuFontWeightLabel',
  'enabled',
  'experimentsOptionsLabel',
  'export',
  'exportSettingsLabel',
  'fastBlockLabel',
  'featuresLabel',
  'followButtonStyleLabel',
  'followButtonStyleOption_monochrome',
  'followButtonStyleOption_themed',
  'fullWidthContentInfo',
  'fullWidthContentLabel',
  'fullWidthMediaLabel',
  'hideAccountSwitcherLabel',
  'hideAdsNavLabel',
  'hideAllMetricsLabel',
  'hideBookmarkButtonLabel',
  'hideBookmarkMetricsLabel',
  'hideChatNavLabel',
  'hideComposeTweetLabel',
  'hideDiscoverSuggestionsLabel',
  'hideEditImageLabel',
  'hideExploreNavLabel',
  'hideExploreNavWithSidebarLabel',
  'hideExplorePageContentsLabel',
  'hideFollowingMetricsLabel',
  'hideForYouTimelineLabel',
  'hideGrokLabel',
  'hideGrokTweetsLabel',
  'hideInlinePrompts',
  'hideJobsLabel',
  'hideLikeMetricsLabel',
  'hideLiveBroadcastBarLabel',
  'hideLiveBroadcastsLabel',
  'hideMessagesBottomNavItemLabel',
  'hideMessagesDrawerLabel',
  'hideMetricsLabel',
  'hideMoreSlideOutMenuItemsOptionsLabel_desktop',
  'hideMoreSlideOutMenuItemsOptionsLabel_mobile',
  'hideNotificationLikesLabel',
  'hideNotificationRetweetsLabel',
  'hidePremiumRepliesLabel',
  'hidePremiumUpsellsLabel',
  'hideProfileHeaderMetricsLabel',
  'hideProfileRetweetsLabel',
  'hideQuoteTweetMetricsLabel',
  'hideReplyMetricsLabel',
  'hideRetweetMetricsLabel',
  'hideSeeNewTweetsLabel',
  'hideShareTweetButtonLabel',
  'hideSidebarContentLabel',
  'hideSpacesNavLabel',
  'hideSubscriptionsLabel',
  'hideSuggestedFollowsLabel',
  'hideTimelineTweetBoxLabel',
  'hideTodaysNewsLabel',
  'hideToggleNavigationLabel',
  'hideTweetAnalyticsLinksLabel',
  'hideUnavailableQuoteTweetsLabel',
  'hideUnusedUiItemsOptionsLabel',
  'hideVerifiedTabsLabel',
  'hideViewActivityLinksLabel',
  'hideViewsLabel',
  'hideWhatsHappeningLabel',
  'hideWhoToFollowEtcLabel',
  'homeTimelineOptionsLabel',
  'import',
  'importSettingsLabel',
  'invalidJsonFile',
  'invalidSettings',
  'listRetweetsLabel',
  'mutableQuoteTweetsLabel',
  'navBaseFontSizeLabel',
  'navDensityLabel',
  'noSettingsObject',
  'premiumBlueChecksLabel',
  'premiumBlueChecksOption_replace',
  'preventNextVideoAutoplayInfo',
  'preventNextVideoAutoplayLabel',
  'quoteTweetsLabel',
  'redirectChatNavLabel',
  'redirectToTwitterLabel',
  'reduceAlgorithmicContentOptionsLabel',
  'reduceEngagementOptionsLabel',
  'reducedInteractionModeInfo',
  'reducedInteractionModeLabel',
  'restoreLinkHeadlinesLabel',
  'restoreOtherInteractionLinksLabel',
  'restoreQuoteTweetsLinkLabel',
  'restoreTweetSourceLabel',
  'retweetsLabel',
  'revertXBrandingLabel',
  'settingsImported',
  'settingsLabel',
  'settingsNotImported',
  'showBookmarkButtonUnderFocusedTweetsLabel',
  'showPremiumReplyBusinessLabel',
  'showPremiumReplyFollowedByLabel',
  'showPremiumReplyFollowersCountAmountLabel',
  'showPremiumReplyFollowingLabel',
  'showPremiumReplyGovernmentLabel',
  'showRelevantPeopleLabel',
  'sidebarLabel',
  'sortFollowingLabel',
  'sortRepliesLabel',
  'tweakNewLayoutInfo',
  'tweakNewLayoutLabel',
  'tweakQuoteTweetsPageLabel',
  'uiImprovementsOptionsLabel',
  'uiTweaksOptionsLabel',
  'unblurSensitiveContentLabel',
  'uninvertFollowButtonsLabel',
  'unknownSettings',
  'xFixesLabel',
]) {
  let $el = document.getElementById(translationId)
  if ($el) {
    $el.textContent = chrome.i18n.getMessage(translationId)
  } else {
    console.warn('could not find element for translationId', translationId)
  }
}

for (let translationClass of [
  'hideBookmarksNavLabel',
  'hideBusinessNavLabel',
  'hideCommunitiesNavLabel',
  'hideConnectNavLabel',
  'hideCreatorStudioNavLabel',
  'hideListsNavLabel',
  'notificationsLabel',
  'saveAndApplyButton',
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
  document.getElementById('import').textContent = chrome.i18n.getMessage('openOptionsPageLabel')
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
/**
 * @type {import("./types").StoredConfig}
 */
let config

/**
 * Checkbox group configuration for the version being used (mobile or desktop).
 * @type {Map<string, string[]>}
 */
let checkboxGroups

// Page elements
let $collapsibleLabels = document.querySelectorAll('section.labelled.collapsible > label[data-collapse-id]')
let $exportSettingsButton = document.querySelector('button#export')
let $form = document.querySelector('form')
let $fileInput = /** @type {HTMLInputElement} */ (document.querySelector('input[type="file"]'))
let $hideQuotesFrom =  /** @type {HTMLDivElement} */ (document.querySelector('#hideQuotesFrom'))
let $hideQuotesFromDetails = /** @type {HTMLDetailsElement} */ (document.querySelector('details#hideQuotesFromDetails'))
let $hideQuotesFromLabel = /** @type {HTMLElement} */ (document.querySelector('#hideQuotesFromLabel'))
let $importSettingsButton = document.querySelector('button#import')
let $importMessages = /** @type {HTMLElement} */ (document.querySelector('#importMessages'))
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))
let $panels = /** @type {NodeListOf<HTMLElement>} */ (document.querySelectorAll('.panel'))
let $saveCustomCssButton = document.querySelector('button#saveCustomCss')
let $showPremiumReplyFollowersCountLabel = /** @type {HTMLElement} */ (document.querySelector('#showPremiumReplyFollowersCountLabel'))
let $tablist = /** @type {HTMLElement} */ (document.querySelector('.tabs'))
let $tabs = Array.from($tablist.querySelectorAll('button'))
//#endregion

//#region Utility functions
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
    $importMessages.style.color = 'var(--text-color-error)'
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
  $body.classList.toggle('chronological', config.settings.defaultToFollowing)
  $body.classList.toggle('debugging', config.debug)
  $body.classList.toggle('disabled', !config.enabled)
  $body.classList.toggle('disabledHomeTimeline', config.settings.disableHomeTimeline)
  $body.classList.toggle('fullWidthContent', config.settings.fullWidthContent)
  $body.classList.toggle('hidingBookmarkButton', config.settings.hideBookmarkButton)
  $body.classList.toggle('hidingExploreNav', config.settings.hideExploreNav)
  $body.classList.toggle('hidingMetrics', config.settings.hideMetrics)
  $body.classList.toggle('hidingNotifications', config.settings.hideNotifications == 'hide')
  $body.classList.toggle('hidingQuotesFrom', shouldDisplayHideQuotesFrom())
  $body.classList.toggle('hidingSuggestedFollows', config.settings.hideSidebarContent || config.settings.hideSuggestedFollows)
  $body.classList.toggle('hidingPremiumReplies', config.settings.hidePremiumReplies)
  $body.classList.toggle('mutingQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle('showingBlueReplyFollowersCount', config.settings.showPremiumReplyFollowersCount)
  $body.classList.toggle('showingSidebarContent', !config.settings.hideSidebarContent)
  $body.classList.toggle('tweakingNewLayout', config.settings.tweakNewLayout)
  $body.classList.toggle('uninvertedFollowButtons', config.settings.uninvertFollowButtons)
  $showPremiumReplyFollowersCountLabel.textContent = chrome.i18n.getMessage(
    'showPremiumReplyFollowersCountLabel',
    formatFollowerCount(Number(config.settings.showPremiumReplyFollowersCountAmount))
  )
  updateCollapsedOptionGroupsDisplay()
  updateHideQuotesFromDisplay()
  updateMutedQuotesDisplay()
  updateTabsDisplay()
}

function updateHideQuotesFromDisplay() {
  if (!shouldDisplayHideQuotesFrom()) return

  $hideQuotesFromLabel.textContent =
    chrome.i18n.getMessage('hideQuotesFromLabel', String(config.settings.hideQuotesFrom.length))

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

  $mutedQuotesLabel.textContent = chrome.i18n.getMessage('mutedTweetsLabel', String(config.settings.mutedQuotes.length))

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
    $panel.style.display= config.tab == $panel.getAttribute('data-tab') ? 'block' : 'none'
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

  chrome.storage.onChanged.addListener(onStorageChanged)

  applyConfig()
}

main()

// Open a port for the background page to detect when the options page is closed
chrome.runtime.connect({name: 'options'})
//#endregion