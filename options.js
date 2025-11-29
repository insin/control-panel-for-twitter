import {defaultSettings} from './settings.js'
import {get, set} from './storage.js'

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
  'bypassAgeVerificationLabel',
  'customCssLabel',
  'debugInfo',
  'debugLabel',
  'debugLogTimelineStatsLabel',
  'defaultToFollowingLabel',
  'defaultToLatestSearchLabel',
  'developerLabel',
  'disableHomeTimelineInfo',
  'disableHomeTimelineLabel',
  'disableTweetTextFormattingLabel',
  'disabledHomeTimelineRedirectLabel',
  'disabledHomeTimelineRedirectOption_messages',
  'dontUseChirpFontLabel',
  'dropdownMenuFontWeightLabel',
  'enabled',
  'experimentsOptionsLabel',
  'exportConfigLabel',
  'fastBlockLabel',
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
  'hideMonetizationNavLabel',
  'hideMoreSlideOutMenuItemsOptionsLabel_desktop',
  'hideMoreSlideOutMenuItemsOptionsLabel_mobile',
  'hideNotificationLikesLabel',
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
  'hideToggleNavigationLabel',
  'hideTweetAnalyticsLinksLabel',
  'hideUnavailableQuoteTweetsLabel',
  'hideUnusedUiItemsOptionsLabel',
  'hideVerifiedTabsLabel',
  'hideViewsLabel',
  'hideWhatsHappeningLabel',
  'hideWhoToFollowEtcLabel',
  'homeTimelineOptionsLabel',
  'listRetweetsLabel',
  'mutableQuoteTweetsLabel',
  'navBaseFontSizeLabel',
  'navDensityLabel',
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
  'showBookmarkButtonUnderFocusedTweetsLabel',
  'showPremiumReplyBusinessLabel',
  'showPremiumReplyFollowedByLabel',
  'showPremiumReplyFollowersCountAmountLabel',
  'showPremiumReplyFollowingLabel',
  'showPremiumReplyGovernmentLabel',
  'showRelevantPeopleLabel',
  'sidebarLabel',
  'sortRepliesLabel',
  'tweakNewLayoutInfo',
  'tweakNewLayoutLabel',
  'tweakQuoteTweetsPageLabel',
  'uiImprovementsOptionsLabel',
  'uiTweaksOptionsLabel',
  'unblurSensitiveContentLabel',
  'uninvertFollowButtonsLabel',
  'xFixesLabel',
]) {
  document.getElementById(translationId).textContent = chrome.i18n.getMessage(translationId)
}

for (let translationClass of [
  'hideBookmarksNavLabel',
  'hideCommunitiesNavLabel',
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
//#endregion

/**
 * Internal options which map directly to a form element.
 * @type {import('./types').StoredConfigKey[]}
 */
const INTERNAL_CONFIG_FORM_KEYS = ['enabled', 'debug', 'debugLogTimelineStats']
/** @type {Set<string>} */
const INTERNAL_CONFIG_FORM_KEYSET = new Set(INTERNAL_CONFIG_FORM_KEYS)

/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile

const $body = document.body

let isSafari = navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)
let isIos = isSafari && /iP(ad|hone)/.test(navigator.userAgent)
if (isSafari) {
  $body.classList.add('safari', isIos ? 'iOS' : 'macOS')
} else {
  $body.classList.toggle('edge', navigator.userAgent.includes('Edg/'))
}

//#region Default config
/** @type {import("./types").StoredConfig} */
const defaultConfig = {
  collapsedOptions: ['experiments'],
  debug: false,
  debugLogTimelineStats: false,
  enabled: true,
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
let $exportConfig = document.querySelector('#export-config')
let $form = document.querySelector('form')
let $hideQuotesFrom =  /** @type {HTMLDivElement} */ (document.querySelector('#hideQuotesFrom'))
let $hideQuotesFromDetails = /** @type {HTMLDetailsElement} */ (document.querySelector('details#hideQuotesFromDetails'))
let $hideQuotesFromLabel = /** @type {HTMLElement} */ (document.querySelector('#hideQuotesFromLabel'))
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))
let $saveCustomCssButton = document.querySelector('button#saveCustomCss')
let $showPremiumReplyFollowersCountLabel = /** @type {HTMLElement} */ (document.querySelector('#showPremiumReplyFollowersCountLabel'))
//#endregion

//#region Utility functions
function exportConfig() {
  let $a = document.createElement('a')
  $a.download = 'control-panel-for-twitter-v4.12.1.config.txt'
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify(config, null, 2)
  ], {type: 'text/plain'}))
  $a.click()
  URL.revokeObjectURL($a.href)
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
      if (prop.startsWith('on') && typeof value == 'function') {
        $el.addEventListener(prop.slice(2).toLowerCase(), value)
      } else {
        $el[prop] = value
      }
    }
  }

  for (let child of children) {
    if (child == null || child === false) continue
    if (child instanceof Node) {
      $el.appendChild(child)
    } else {
      $el.insertAdjacentText('beforeend', String(child))
    }
  }

  return $el
}
//#endregion

//#region Options page functions
/**
 * Update the options page to match the current config.
 */
function applyConfig() {
  mobile = config.version == 'mobile'
  desktop = !mobile
  $body.classList.toggle('mobile', mobile)
  $body.classList.toggle('desktop', desktop)
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

function onFormChanged(/** @type {Event} */ e) {
  if (e.target instanceof HTMLTextAreaElement) return

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

function onToggleCollapse(e) {
  let collapsedOptions = config.collapsedOptions.slice()
  let collapseId = e.currentTarget.getAttribute('data-collapse-id')
  let index = collapsedOptions.indexOf(collapseId)
  if (index == -1) {
    collapsedOptions.push(collapseId)
  } else {
    collapsedOptions.splice(index, 1)
  }
  config.collapsedOptions = collapsedOptions
  storeConfigChanges({collapsedOptions})
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

function updateCollapsedOptionsDisplay() {
  for (let $label of $collapsibleLabels) {
    $label.parentElement.classList.toggle('collapsed', config.collapsedOptions.includes($label.getAttribute('data-collapse-id')))
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
  updateCollapsedOptionsDisplay()
  updateHideQuotesFromDisplay()
  updateMutedQuotesDisplay()
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
        h('label', {className: 'button'},
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
        h('label', {className: 'button mutedQuote'},
          h('div', null,
            user,
            ' – ',
            new Intl.DateTimeFormat([], {dateStyle: 'medium'}).format(new Date(time)),
            text && h('p', {className: 'mb-0'}, text),
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
//#endregion

//#region Main
async function main() {
  /** @type {Partial<import("./types").StoredConfig>} */
  let {settings: storedSettings = {}, ...storedConfig} = await get()
  config = {
    ...defaultConfig,
    ...storedConfig,
    settings: {...defaultSettings, ...storedSettings}
  }

  $body.classList.toggle('debug', config.debug === true)
  // TODO Add iOS section groups in the Preact + htm rewrite instead
  if (!isIos) {
    for (let $label of $collapsibleLabels) {
      $label.addEventListener('click', onToggleCollapse)
    }
  }
  $exportConfig.addEventListener('click', exportConfig)
  $form.addEventListener('change', onFormChanged)
  $hideQuotesFromDetails.addEventListener('toggle', updateHideQuotesFromDisplay)
  $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
  $saveCustomCssButton.addEventListener('click', saveCustomCss)
  chrome.storage.onChanged.addListener(onStorageChanged)

  if (!config.debug) {
    let $version = document.querySelector('#version')
    let $debugCountdown = document.querySelector('#debugCountdown')
    let debugCountdown = 5

    function onClick(e) {
      if (e.target === $version || $version.contains(/** @type {Node} */ (e.target))) {
        debugCountdown--
      } else {
        debugCountdown = 5
      }

      if (debugCountdown == 0) {
        $body.classList.add('debug')
        $debugCountdown.textContent = ''
        $form.removeEventListener('click', onClick)
      }
      else if (debugCountdown <= 3) {
        $debugCountdown.textContent = ` (${debugCountdown})`
      }
    }

    $form.addEventListener('click', onClick)
  }

  applyConfig()
}

main()

// Open a port for the background page to detect when the options page is closed
chrome.runtime.connect({name: 'options'})
//#endregion