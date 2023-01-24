//#region Translations
document.title = chrome.i18n.getMessage(`optionsPageTitle`)

for (let optionValue of ['ignore', 'hide', 'separate']) {
  let label = chrome.i18n.getMessage(`option_${optionValue}`)
  for (let $option of document.querySelectorAll(`option[value="${optionValue}"]`)) {
    $option.textContent = label
  }
}

for (let translationId of [
  'reduceAlgorithmicContentOptionsLabel',
  'alwaysUseLatestTweetsLabel',
  'hideForYouTimelineLabel',
  'hideSidebarContentLabel',
  'showRelevantPeopleLabel',
  'hideWhoToFollowEtcLabel',
  'hideExplorePageContentsLabel',
  'hideMoreTweetsLabel',
  'sharedTweetsOptionsLabel',
  'retweetsLabel',
  'quoteTweetsLabel',
  'hideUnavailableQuoteTweetsLabel',
  'mutableQuoteTweetsLabel',
  'mutableQuoteTweetsInfo',
  'algorithmicTweetsOptionsLabel',
  'algorithmicTweetsWarning',
  'communityTweetsLabel',
  'followeesFollowsLabel',
  'likedTweetsLabel',
  'repliedToTweetsLabel',
  'suggestedTopicTweetsLabel',
  'uiImprovementsOptionsLabel',
  'uninvertFollowButtonsLabel',
  'followButtonStyleLabel',
  'followButtonStyleOption_monochrome',
  'followButtonStyleOption_themed',
  'navBaseFontSizeLabel',
  'dropdownMenuFontWeightLabel',
  'fastBlockLabel',
  'addAddMutedWordMenuItemLabel_desktop',
  'addAddMutedWordMenuItemLabel_mobile',
  'hideVerifiedNotificationsTabLabel',
  'hideViewsLabel',
  'hideAppNagsLabel',
  'uiTweaksOptionsLabel',
  'dontUseChirpFontLabel',
  'twitterBlueChecksLabel',
  'twitterBlueChecksOption_replace',
  'tweakQuoteTweetsPageLabel',
  'hideMetricsLabel',
  'hideAllMetricsLabel',
  'hideReplyMetricsLabel',
  'hideRetweetMetricsLabel',
  'hideLikeMetricsLabel',
  'hideQuoteTweetMetricsLabel',
  'hideFollowingMetricsLabel',
  'hideTotalTweetsMetricsLabel',
  'hideUnusedUiItemsOptionsLabel',
  'hideAccountSwitcherLabel',
  'hideMessagesDrawerLabel',
  'hideExploreNavLabel',
  'hideCommunitiesNavLabel',
  'hideMessagesBottomNavItemLabel',
  'hideBookmarksNavLabel_desktop',
  'hideTwitterBlueNavLabel_desktop',
  'hideShareTweetButtonLabel',
  'hideTweetAnalyticsLinksLabel',
  'hideMoreSlideOutMenuItemsOptionsLabel_desktop',
  'hideMoreSlideOutMenuItemsOptionsLabel_mobile',
  'hideTwitterBlueNavLabel_mobile',
  'hideTopicsNavLabel',
  'hideBookmarksNavLabel_mobile',
  'hideListsNavLabel',
  'hideTwitterCircleNavLabel',
  'hideMomentsNavLabel',
  'hideNewslettersNavLabel',
  'hideAnalyticsNavLabel',
  'hideTwitterForProfessionalsNavLabel',
  'hideTwitterAdsNavLabel',
  'hideMonetizationNavLabel',
  'hideHelpCenterNavLabel',
  'hideKeyboardShortcutsNavLabel',
  'experimentsOptionsLabel',
  'reducedInteractionModeLabel',
  'reducedInteractionModeInfo',
  'fullWidthContentLabel',
  'fullWidthContentInfo',
  'fullWidthMediaLabel',
  'verifiedAccountsLabel',
  'verifiedAccountsOption_highlight',
  'verifiedAccountsInfo',
  'disableHomeTimelineLabel',
  'disableHomeTimelineInfo',
  'disabledHomeTimelineRedirectLabel',
  'disabledHomeTimelineRedirectOption_notifications',
  'disabledHomeTimelineRedirectOption_messages',
  'debugOptionsLabel',
  'debugLabel',
  'debugInfo',
  'exportConfigLabel',
]) {
  document.getElementById(translationId).textContent = chrome.i18n.getMessage(translationId)
}
//#endregion

/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile

const $body = document.body

$body.classList.toggle('edge', navigator.userAgent.includes('Edg/'))

//#region Default config
/** @type {import("./types").Config} */
const defaultConfig = {
  debug: false,
  // Default based on the platform if Tweak New Twitter hasn't run on Twitter yet
  version: /(Android|iPhone|iPad)/.test(navigator.userAgent) ? 'mobile' : 'desktop',
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  communityTweets: 'ignore',
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  followeesFollows: 'ignore',
  hideAnalyticsNav: true,
  hideBookmarksNav: true,
  hideCommunitiesNav: true,
  hideExplorePageContents: true,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideHelpCenterNav: true,
  hideKeyboardShortcutsNav: false,
  hideLikeMetrics: true,
  hideListsNav: true,
  hideMetrics: false,
  hideMomentsNav: true,
  hideMonetizationNav: true,
  hideMoreTweets: true,
  hideNewslettersNav: true,
  hideQuoteTweetMetrics: true,
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideShareTweetButton: false,
  hideTopicsNav: true,
  hideTotalTweetsMetrics: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterAdsNav: true,
  hideTwitterBlueNav: true,
  hideTwitterCircleNav: true,
  hideTwitterForProfessionalsNav: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedNotificationsTab: true,
  hideViews: true,
  hideWhoToFollowEtc: true,
  likedTweets: 'ignore',
  mutableQuoteTweets: true,
  mutedQuotes: [],
  quoteTweets: 'ignore',
  repliedToTweets: 'ignore',
  retweets: 'separate',
  suggestedTopicTweets: 'ignore',
  tweakQuoteTweetsPage: true,
  twitterBlueChecks: 'replace',
  uninvertFollowButtons: true,
  // Experiments
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  fullWidthContent: false,
  fullWidthMedia: false,
  reducedInteractionMode: false,
  verifiedAccounts: 'ignore',
  // Desktop only
  hideAccountSwitcher: true,
  hideExploreNav: true,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  showRelevantPeople: false,
  // Mobile only
  hideAppNags: true,
  hideMessagesBottomNavItem: false,
}
//#endregion

//#region Config & variables
/**
 * Complete configuration for the options page.
 * @type {import("./types").Config}
 */
let optionsConfig

/**
 * Checkbox group configuration for the version being used (mobile or desktop).
 * @type {Map<string, string[]>}
 */
let checkboxGroups

// Page elements
let $experiments = /** @type {HTMLDetailsElement} */ (document.querySelector('details#experiments'))
let $exportConfig = document.querySelector('#exportConfig')
let $form = document.querySelector('form')
let $importConfig = /** @type {HTMLInputElement} */ (document.querySelector('#importConfig'))
let $importMessages = /** @type {HTMLElement} */ (document.querySelector('#importMessages'))
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))
//#endregion

//#region Utility functions
/**
 * @param {keyof HTMLElementTagNameMap} tagName
 * @param {{[key: string]: any}} [attributes]
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

//#region Config validation for import
function isBoolean(value) {
  return typeof value == 'boolean'
}

/**
 * @param {string[]} allowedValues
 */
function isOneOf(allowedValues) {
  return function(value) {
    return typeof value == 'string' && allowedValues.includes(value)
  }
}

function validateObject(obj, validators) {
  let unexpectedProps = []
  let invalidProps = []
  for (let [prop, value] of Object.values(obj)) {
    if (!validators.hasOwnProperty(prop)) {
      unexpectedProps.push(prop)
    }
    else if (!validators[prop](value)) {
      invalidProps.push(prop)
    }
  }
  if (unexpectedProps.length > 0 || invalidProps.length > 0) {
    return {
      valid: false,
      messages: [
        unexpectedProps.length > 0 && 'Unexpected properties: ' + unexpectedProps.join(', '),
        invalidProps.length > 0 && 'Invalid properties: ' + invalidProps.join(', '),
      ].filter(Boolean)
    }
  }
  return {valid: true}
}

const isAlgorithmicTweetConfig = isOneOf(['hide', 'ignore'])
const isSharedTweetConfig = isOneOf(['separate', 'hide', 'ignore'])

/**
 * @type {{[key: string]: (value: any) => boolean}}
 */
let configValidators = {
  debug: isBoolean,
  version: isOneOf(['desktop', 'mobile']),
  addAddMutedWordMenuItem: isBoolean,
  alwaysUseLatestTweets: isBoolean,
  communityTweets: isAlgorithmicTweetConfig,
  dontUseChirpFont: isBoolean,
  dropdownMenuFontWeight: isBoolean,
  fastBlock: isBoolean,
  followButtonStyle: isOneOf(['monochrome', 'themed']),
  followeesFollows: isAlgorithmicTweetConfig,
  hideAnalyticsNav: isBoolean,
  hideBookmarksNav: isBoolean,
  hideCommunitiesNav: isBoolean,
  hideFollowingMetrics: isBoolean,
  hideForYouTimeline: isBoolean,
  hideHelpCenterNav: isBoolean,
  hideKeyboardShortcutsNav: isBoolean,
  hideLikeMetrics: isBoolean,
  hideListsNav: isBoolean,
  hideMetrics: isBoolean,
  hideMomentsNav: isBoolean,
  hideMonetizationNav: isBoolean,
  hideMoreTweets: isBoolean,
  hideNewslettersNav: isBoolean,
  hideQuoteTweetMetrics: isBoolean,
  hideReplyMetrics: isBoolean,
  hideRetweetMetrics: isBoolean,
  hideShareTweetButton: isBoolean,
  hideTopicsNav: isBoolean,
  hideTotalTweetsMetrics: isBoolean,
  hideTweetAnalyticsLinks: isBoolean,
  hideTwitterAdsNav: isBoolean,
  hideTwitterBlueNav: isBoolean,
  hideTwitterCircleNav: isBoolean,
  hideTwitterForProfessionalsNav: isBoolean,
  hideUnavailableQuoteTweets: isBoolean,
  hideVerifiedNotificationsTab: isBoolean,
  hideViews: isBoolean,
  hideWhoToFollowEtc: isBoolean,
  likedTweets: isAlgorithmicTweetConfig,
  mutableQuoteTweets: isBoolean,
  mutedQuotes: function(value) {
    return (
      Array.isArray(value) &&
      value.every(qt => (
        typeof qt.user == 'string' &&
        typeof qt.name == 'string' &&
        (qt.text == null || typeof qt.text == 'string')
      ))
    )
  },
  quoteTweets: isSharedTweetConfig,
  repliedToTweets: isAlgorithmicTweetConfig,
  retweets: isSharedTweetConfig,
  suggestedTopicTweets: isAlgorithmicTweetConfig,
  tweakQuoteTweetsPage: isBoolean,
  twitterBlueChecks: isOneOf(['ignore', 'replace', 'hide']),
  uninvertFollowButtons: isBoolean,
  disableHomeTimeline: isBoolean,
  disabledHomeTimelineRedirect: isOneOf(['notifications', 'messages']),
  fullWidthContent: isBoolean,
  fullWidthMedia: isBoolean,
  reducedInteractionMode: isBoolean,
  verifiedAccounts: isOneOf(['highlight', 'hide', 'ignore']),
  hideAccountSwitcher: isBoolean,
  hideExploreNav: isBoolean,
  hideMessagesDrawer: isBoolean,
  hideSidebarContent: isBoolean,
  navBaseFontSize: isBoolean,
  showRelevantPeople: isBoolean,
  hideAppNags: isBoolean,
  hideExplorePageContents: isBoolean,
  hideMessagesBottomNavItem: isBoolean,
}
//#endregion

//#region Options page functions
/**
 * Update the options page to match the current config.
 */
function applyConfig() {
  mobile = optionsConfig.version == 'mobile'
  desktop = !mobile
  $body.classList.toggle('mobile', mobile)
  $body.classList.toggle('desktop', desktop)
  checkboxGroups = new Map(Object.entries({
    reduceAlgorithmicContent: [
      'alwaysUseLatestTweets',
      'hideExplorePageContents',
      'hideMoreTweets',
      'hideWhoToFollowEtc',
      desktop && 'hideSidebarContent',
    ].filter(Boolean),
    uiImprovements: [
      'addAddMutedWordMenuItem',
      'dropdownMenuFontWeight',
      'fastBlock',
      'hideVerifiedNotificationsTab',
      'hideViews',
      'uninvertFollowButtons',
      desktop && 'navBaseFontSize',
      mobile && 'hideAppNags',
    ].filter(Boolean),
    hideUnusedUiItems: [
      'hideCommunitiesNav',
      'hideShareTweetButton',
      'hideTweetAnalyticsLinks',
      desktop && 'hideAccountSwitcher',
      desktop && 'hideBookmarksNav',
      desktop && 'hideExploreNav',
      desktop && 'hideMessagesDrawer',
      desktop && 'hideTwitterBlueNav',
      mobile && 'hideMessagesBottomNavItem',
    ].filter(Boolean),
    hideMoreSlideOutMenuItems: [
      'hideAnalyticsNav',
      'hideHelpCenterNav',
      'hideListsNav',
      'hideMomentsNav',
      'hideMonetizationNav',
      'hideNewslettersNav',
      'hideTopicsNav',
      'hideTwitterAdsNav',
      'hideTwitterCircleNav',
      'hideTwitterForProfessionalsNav',
      desktop && 'hideKeyboardShortcutsNav',
      mobile && 'hideBookmarksNav',
      mobile && 'hideTwitterBlueNav',
    ].filter(Boolean),
    hideAllMetrics: [
      'hideFollowingMetrics',
      'hideLikeMetrics',
      'hideReplyMetrics',
      'hideRetweetMetrics',
      'hideQuoteTweetMetrics',
      'hideTotalTweetsMetrics',
    ]
  }))
  updateFormControls()
  updateCheckboxGroups()
  updateDisplay()
}

function exportConfig() {
  let $a = document.createElement('a')
  $a.download = 'tweak-new-twitter-v2.23.2.config.txt'
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify(optionsConfig, null, 2)
  ], {type: 'text/plain'}))
  $a.click()
  URL.revokeObjectURL($a.href)
}

function importConfig() {
  let file = $importConfig.files?.[0]
  if (!file) {
    $importMessages.textContent = 'No file selected'
    return
  }
  let reader = new FileReader()
  reader.addEventListener('load', () => {
    let importedConfig
    try {
      importedConfig = JSON.parse(reader.result)
    }
    catch (e) {
      $importMessages.textContent = 'Unable to parse config file'
      return
    }

    let validationResult = validateObject(importedConfig, configValidators)
    if (!validationResult.valid) {
      $importMessages.textContent = validationResult.messages.join('\n\n')
      return
    }

    delete importedConfig.debug
    delete importedConfig.version
    Object.assign(optionsConfig, importedConfig)
    applyConfig()
    storeConfigChanges(importedConfig)
    $importMessages.textContent = 'Import succeeded'
  })
  reader.readAsText(file)
}

/**
 * @param {Event} e
 */
function onFormChanged(e) {
  /** @type {Partial<import("./types").Config>} */
  let changedConfig = {}

  let $el = /** @type {HTMLInputElement} */ (e.target)
  if ($el.type == 'checkbox') {
    if (checkboxGroups.has($el.name)) {
      checkboxGroups.get($el.name).forEach(checkboxName => {
        optionsConfig[checkboxName] = changedConfig[checkboxName] = $el.checked
        updateFormControl($form.elements[checkboxName], $el.checked)
      })
      $el.indeterminate = false
    } else {
      optionsConfig[$el.name] = changedConfig[$el.name] = $el.checked
      updateCheckboxGroups()
    }
  } else {
    optionsConfig[$el.name] = changedConfig[$el.name] = $el.value
  }

  updateDisplay()

  storeConfigChanges(changedConfig)
}

/**
 * @param {{[key: string]: chrome.storage.StorageChange}} changes
 */
function onStorageChanged(changes) {
  let configChanges = Object.fromEntries(
    Object.entries(changes).map(([key, {newValue}]) => [key, newValue])
  )
  Object.assign(optionsConfig, configChanges)
  applyConfig()
}

function shouldDisplayMutedQuotes() {
  return optionsConfig.mutableQuoteTweets && optionsConfig.mutedQuotes.length > 0
}

/**
 * @param {Partial<import("./types").Config>} changes
 */
function storeConfigChanges(changes) {
  chrome.storage.onChanged.removeListener(onStorageChanged)
  chrome.storage.local.set(changes, () => {
    chrome.storage.onChanged.addListener(onStorageChanged)
  })
}

function updateCheckboxGroups() {
  for (let [group, checkboxNames] of checkboxGroups.entries()) {
    let checkedCount = checkboxNames.filter(name => optionsConfig[name]).length
    $form.elements[group].checked = checkedCount == checkboxNames.length
    $form.elements[group].indeterminate = checkedCount > 0 && checkedCount < checkboxNames.length;
  }
}

function updateDisplay() {
  $body.classList.toggle('algorithmic', !optionsConfig.hideForYouTimeline)
  $body.classList.toggle('chronological', optionsConfig.alwaysUseLatestTweets)
  $body.classList.toggle('disabledHomeTimeline', optionsConfig.disableHomeTimeline)
  $body.classList.toggle('fullWidthContent', optionsConfig.fullWidthContent)
  $body.classList.toggle('hidingMetrics', optionsConfig.hideMetrics)
  $body.classList.toggle('hidingSidebarContent', optionsConfig.hideSidebarContent)
  $body.classList.toggle('mutedQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle('uninvertedFollowButtons', optionsConfig.uninvertFollowButtons)
  updateMutedQuotesDisplay()
}

function updateMutedQuotesDisplay() {
  if (!shouldDisplayMutedQuotes()) return

  $mutedQuotesLabel.textContent = `Muted tweets (${optionsConfig.mutedQuotes.length})`

  if (!$mutedQuotesDetails.open) return

  while ($mutedQuotes.hasChildNodes()) $mutedQuotes.firstChild.remove()

  optionsConfig.mutedQuotes.forEach(({user, time, text}, index) => {
    $mutedQuotes.appendChild(
      h('section', {className: 'button'},
        h('span', null,
          user,
          ' – ',
          new Intl.DateTimeFormat([], {dateStyle: 'medium'}).format(new Date(time)),
          h('br'),
          text,
        ),
        h('input', {
          type: 'button',
          value: chrome.i18n.getMessage('unmuteButtonText'),
          onclick: () => {
            optionsConfig.mutedQuotes = optionsConfig.mutedQuotes.filter((_, i) => i != index)
            chrome.storage.local.set({mutedQuotes: optionsConfig.mutedQuotes})
            updateDisplay()
          },
        })
      )
    )
  })
}

function updateFormControls() {
  Object.keys(optionsConfig)
        .filter(prop => prop in $form.elements)
        .forEach(prop => updateFormControl($form.elements[prop], optionsConfig[prop]))
}

function updateFormControl($control, value) {
  if ($control instanceof RadioNodeList) {
    // If a checkbox displays in multiple sections, update them all
    $control.forEach(input => input.checked = value)
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
function main() {
  chrome.storage.local.get((/** @type {Partial<import("./types").Config>} */ storedConfig) => {
    // Update deprecated config values
    // @ts-ignore
    if (storedConfig.twitterBlueChecks == 'dim') {
      storedConfig.twitterBlueChecks = 'replace'
    }
    optionsConfig = {...defaultConfig, ...storedConfig}

    $body.classList.toggle('debug', optionsConfig.debug === true)
    $experiments.open = (
      optionsConfig.disableHomeTimeline ||
      optionsConfig.fullWidthContent ||
      optionsConfig.reducedInteractionMode ||
      optionsConfig.verifiedAccounts != 'ignore'
    )
    $exportConfig.addEventListener('click', exportConfig)
    $form.addEventListener('change', onFormChanged)
    $importConfig.addEventListener('change', importConfig)
    $mutedQuotesDetails.addEventListener('toggle', updateMutedQuotesDisplay)
    chrome.storage.onChanged.addListener(onStorageChanged)

    if (!optionsConfig.debug) {
      let $showDebugOptions = document.querySelector('#showDebugOptions')
      let $debugCountdown = document.querySelector('#debugCountdown')
      let debugCountdown = 5

      function onClick(e) {
        if (e.target === $showDebugOptions || $showDebugOptions.contains(/** @type {Node} */ (e.target))) {
          debugCountdown--
        } else {
          debugCountdown = 5
        }

        if (debugCountdown == 0) {
          $body.classList.add('debug')
          $debugCountdown.textContent = ''
          $form.removeEventListener('click', onClick)
          $showDebugOptions.classList.remove('clickable')
        }
        else if (debugCountdown <= 3) {
          $debugCountdown.textContent = chrome.i18n.getMessage('debugCountdownLabel', String(debugCountdown))
        }
      }

      $form.addEventListener('click', onClick)
      $showDebugOptions.classList.add('clickable')
    }

    applyConfig()
  })
}

main()
//#endregion