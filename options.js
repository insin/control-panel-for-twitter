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
  hidePromotedTweets: false,
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
let $exportConfig = document.querySelector('#export-config')
let $form = document.querySelector('form')
let $mutedQuotes =  /** @type {HTMLDivElement} */ (document.querySelector('#mutedQuotes'))
let $mutedQuotesDetails =  /** @type {HTMLDetailsElement} */ (document.querySelector('details#mutedQuotesDetails'))
let $mutedQuotesLabel = /** @type {HTMLElement} */ (document.querySelector('#mutedQuotesLabel'))
//#endregion

//#region Utility functions
function exportConfig() {
  let $a = document.createElement('a')
  $a.download = 'tweak-new-twitter-v2.22.1.config.txt'
  $a.href = URL.createObjectURL(new Blob([
    JSON.stringify(optionsConfig, null, 2)
  ], {type: 'text/plain'}))
  $a.click()
  URL.revokeObjectURL($a.href)
}

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

/**
 * @param {number} n
 * @returns {string}
 */
function s(n) {
  return n == 1 ? '' : 's'
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
      'hidePromotedTweets',
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
          value: 'Unmute',
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
          $debugCountdown.textContent = ` (Debug options: ${debugCountdown} more click${s(debugCountdown)} to enable)`
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