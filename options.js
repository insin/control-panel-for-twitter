document.title = chrome.i18n.getMessage(`extensionName`)

for (let optionValue of ['ignore', 'hide', 'separate']) {
  let label = chrome.i18n.getMessage(`option_${optionValue}`)
  for (let $option of document.querySelectorAll(`option[value="${optionValue}"]`)) {
    $option.textContent = label
  }
}

for (let translationId of [
  'homeTimelineOptionsLabel',
  'reduceEngagementOptionsLabel',
  'reduceAlgorithmicContentOptionsLabel',
  'alwaysUseLatestTweetsLabel',
  'hideForYouTimelineLabel',
  'hideSidebarContentLabel',
  'showRelevantPeopleLabel',
  'hideHomeHeadingLabel',
  'hideWhoToFollowEtcLabel',
  'hideExplorePageContentsLabel',
  'hideMoreTweetsLabel',
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
  'defaultToLatestSearchLabel',
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
  // 'hideMomentsNavLabel',
  // 'hideNewslettersNavLabel',
  'hideAnalyticsNavLabel',
  'hideTwitterForProfessionalsNavLabel',
  'hideTwitterAdsNavLabel',
  'hideMonetizationNavLabel',
  'hideHelpCenterNavLabel',
  'hideKeyboardShortcutsNavLabel',
  'experimentsOptionsLabel',
  'reducedInteractionModeLabel',
  'reducedInteractionModeInfo',
  // 'replaceDogeLogo',
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

/** @type {boolean} */
let desktop
/** @type {boolean} */
let mobile

const $body = document.body

if (navigator.userAgent.includes('Safari/') && !/Chrom(e|ium)\//.test(navigator.userAgent)) {
  $body.classList.add('safari', /iP(ad|hone)/.test(navigator.userAgent) ? 'iOS' : 'macOS')
} else {
  $body.classList.toggle('edge', navigator.userAgent.includes('Edg/'))
}

//#region Default config
/** @type {import("./types").Config} */
const defaultConfig = {
  debug: false,
  // Default based on the platform if the main script hasn't run on Twitter yet
  version: /(Android|iP(ad|hone))/.test(navigator.userAgent) ? 'mobile' : 'desktop',
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  defaultToLatestSearch: false,
  disableHomeTimeline: false,
  disabledHomeTimelineRedirect: 'notifications',
  dontUseChirpFont: false,
  dropdownMenuFontWeight: true,
  fastBlock: true,
  followButtonStyle: 'monochrome',
  hideAnalyticsNav: true,
  hideBookmarksNav: false,
  hideCommunitiesNav: true,
  hideExplorePageContents: true,
  hideFollowingMetrics: true,
  hideForYouTimeline: true,
  hideHelpCenterNav: true,
  hideHomeHeading: true,
  hideKeyboardShortcutsNav: false,
  hideLikeMetrics: true,
  hideListsNav: false,
  hideMetrics: false,
  // hideMomentsNav: true,
  hideMonetizationNav: true,
  hideMoreTweets: true,
  // hideNewslettersNav: true,
  hideQuoteTweetMetrics: true,
  hideReplyMetrics: true,
  hideRetweetMetrics: true,
  hideShareTweetButton: false,
  hideTopicsNav: true,
  hideTotalTweetsMetrics: true,
  hideTweetAnalyticsLinks: false,
  hideTwitterAdsNav: true,
  hideTwitterBlueNav: true,
  hideTwitterCircleNav: false,
  hideTwitterForProfessionalsNav: true,
  hideUnavailableQuoteTweets: true,
  hideVerifiedNotificationsTab: true,
  hideViews: true,
  hideWhoToFollowEtc: true,
  listRetweets: 'ignore',
  mutableQuoteTweets: true,
  mutedQuotes: [],
  quoteTweets: 'ignore',
  reducedInteractionMode: false,
  retweets: 'separate',
  tweakQuoteTweetsPage: true,
  twitterBlueChecks: 'replace',
  uninvertFollowButtons: true,
  replaceDogeLogo: true,
  // Experiments
  communityTweets: 'ignore',
  followeesFollows: 'ignore',
  likedTweets: 'ignore',
  repliedToTweets: 'ignore',
  suggestedTopicTweets: 'ignore',
  verifiedAccounts: 'ignore',
  // Desktop only
  fullWidthContent: false,
  fullWidthMedia: true,
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
let $exportConfig = document.querySelector('#export-config')
let $form = document.querySelector('form')
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))
//#endregion

//#region Utility functions
function exportConfig() {
  let $a = document.createElement('a')
  $a.download = 'control-panel-for-twitter-v3.3.2.config.txt'
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify(optionsConfig, null, 2)
  ], {type: 'text/plain'}))
  $a.click()
  URL.revokeObjectURL($a.href)
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
  mobile = optionsConfig.version == 'mobile'
  desktop = !mobile
  $body.classList.toggle('mobile', mobile)
  $body.classList.toggle('desktop', desktop)
  checkboxGroups = new Map(Object.entries({
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
      // 'hideMomentsNav',
      'hideMonetizationNav',
      // 'hideNewslettersNav',
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
  $body.classList.toggle('algorithmic', !optionsConfig.alwaysUseLatestTweets || !optionsConfig.hideForYouTimeline)
  $body.classList.toggle('chronological', optionsConfig.alwaysUseLatestTweets)
  $body.classList.toggle('disabledHomeTimeline', optionsConfig.disableHomeTimeline)
  $body.classList.toggle('fullWidthContent', optionsConfig.fullWidthContent)
  $body.classList.toggle('hidingMetrics', optionsConfig.hideMetrics)
  $body.classList.toggle('hidingSidebarContent', optionsConfig.hideSidebarContent)
  $body.classList.toggle('mutedQuotes', shouldDisplayMutedQuotes())
  $body.classList.toggle('uninvertedFollowButtons', optionsConfig.uninvertFollowButtons)
  $body.classList.toggle('replaceDogeLogo', optionsConfig.replaceDogeLogo)
  updateMutedQuotesDisplay()
}

function updateMutedQuotesDisplay() {
  if (!shouldDisplayMutedQuotes()) return

  $mutedQuotesLabel.textContent = chrome.i18n.getMessage('mutedTweetsLabel', String(optionsConfig.mutedQuotes.length))

  if (!$mutedQuotesDetails.open) return

  while ($mutedQuotes.hasChildNodes()) $mutedQuotes.firstChild.remove()

  optionsConfig.mutedQuotes.forEach(({user, time, text}, index) => {
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
              optionsConfig.mutedQuotes = optionsConfig.mutedQuotes.filter((_, i) => i != index)
              chrome.storage.local.set({mutedQuotes: optionsConfig.mutedQuotes})
              updateDisplay()
            },
          }, chrome.i18n.getMessage('unmuteButtonText'))
        )
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
      (!optionsConfig.alwaysUseLatestTweets || !optionsConfig.hideForYouTimeline) && (
        optionsConfig.communityTweets != 'ignore' ||
        optionsConfig.followeesFollows != 'ignore' ||
        optionsConfig.likedTweets != 'ignore' ||
        optionsConfig.repliedToTweets != 'ignore' ||
        optionsConfig.suggestedTopicTweets != 'ignore'
      ) ||
      optionsConfig.verifiedAccounts != 'ignore'
    )
    $exportConfig.addEventListener('click', exportConfig)
    $form.addEventListener('change', onFormChanged)
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