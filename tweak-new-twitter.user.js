// ==UserScript==
// @name        Tweak New Twitter
// @description Reduce algorithmic content on Twitter, hide trends, control which shared tweets appear on your timeline, and improve the UI
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @version     30
// ==/UserScript==

const enableDebugLogging = false

const mobile = navigator.userAgent.includes('Android')
const desktop = !mobile

const $html = document.querySelector('html')
const lang = $html.lang
const dir = $html.dir
const ltr = dir == 'ltr'

//#region Default config
/**
 * @type {import("./types").Config}
 */
const config = {
  // Shared
  addAddMutedWordMenuItem: true,
  alwaysUseLatestTweets: true,
  fastBlock: true,
  hideAnalyticsNav: true,
  hideBookmarksNav: true,
  hideListsNav: true,
  hideMomentsNav: true,
  hideMoreTweets: true,
  hideNewslettersNav: true,
  hideTopicsNav: true,
  hideTwitterAdsNav: true,
  hideWhoToFollowEtc: true,
  quoteTweets: 'ignore',
  retweets: 'separate',
  tweakQuoteTweetsPage: true,
  verifiedAccounts: 'ignore',
  // Desktop only
  hideAccountSwitcher: true,
  hideExploreNav: true,
  hideMessagesDrawer: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  // Mobile only
  hideAppNags: true,
  hideExplorePageContents: true,
  hideMessagesBottomNavItem: false,
}
//#endregion

//#region Locales
/**
 * @type {{[key: string]: import("./types").Locale}}
 */
const locales = {
  /*
  // The codes are the corresponding ones from the {languageCode}.{hash}.js files Twitter downloads
  // when you switch display language.
  template: {
    ADD_MUTED_WORD: 'd768049b', // Needed to add a new menu item for it
    HOME: 'ha8209bb',           // Home timeline title - used to detect which timeline we're on, needed to change <title>
    LATEST_TWEETS: 'd126cb7c',  // Latest Tweets timeline title - used to detect which timeline we're on, needed to change <title>
    QUOTE_TWEET: 'c9d7235d',    // Easy identifier for a visible quote tweet - potentially replaceable?
    QUOTE_TWEETS: 'bd7c039f',   // Separated tweets timeline title when config.quoteTweets = 'separate' on its own
    RETWEETS: 'd497b854',       // Separated tweets timeline title when config.retweets = 'separate' on its own
    SHARED_TWEETS: '',          // This is our own thing
  },
  */
  en: {
    ADD_MUTED_WORD: 'Add muted word',
    HOME: 'Home',
    LATEST_TWEETS: 'Latest Tweets',
    QUOTE_TWEET: 'Quote Tweet',
    QUOTE_TWEETS: 'Quote Tweets',
    RETWEETS: 'Retweets',
    SHARED_TWEETS: 'Shared Tweets',
    TITLE_SPLIT: ' / ',
    TWITTER: 'Twitter',
  },
  fa: {
    ADD_MUTED_WORD: 'افزودن واژه خموش‌سازی شده',
    HOME: 'خانه',
    LATEST_TWEETS: 'جدیدترین توییت‌ها',
    QUOTE_TWEET: 'نقل‌توییت',
    QUOTE_TWEETS: 'نقل‌توییت',
    RETWEETS: 'بازتوییت‌ها',
    SHARED_TWEETS: 'توییتهای مشترک',
    TITLE_SPLIT: ' \\ ',
    TWITTER: 'توییتر',
  },
  ga: {
    ADD_MUTED_WORD: 'Cuir focal balbhaithe leis',
    HOME: 'Baile',
    LATEST_TWEETS: 'Tweetanna is déanaí',
    QUOTE_TWEET: 'Cuir Ráiteas Leis',
    QUOTE_TWEETS: 'Luaigh Tvuíteanna',
    RETWEETS: 'Atweetanna',
    SHARED_TWEETS: 'Tweetanna Roinnte',
  },
  ja: {
    ADD_MUTED_WORD: 'ミュートするキーワードを追加',
    HOME: 'ホーム',
    LATEST_TWEETS: '最新ツイート',
    QUOTE_TWEET: '引用ツイート',
    QUOTE_TWEETS: '引用ツイート',
    RETWEETS: 'リツイート',
    SHARED_TWEETS: '共有ツイート',
  },
}

/**
 * @param {import("./types").LocaleKey} code
 * @returns {string}
 */
function getString(code) {
  return (locales[lang] || locales['en'])[code] || locales['en'][code];
}
//#endregion

//#region Config & variables
/** @enum {string} */
const PagePaths = {
  ADD_MUTED_WORD: '/settings/add_muted_keyword',
  BOOKMARKS: '/i/bookmarks',
  NOTIFICATION_TIMELINE: '/i/timeline',
  SEARCH: '/search',
}

/** @enum {string} */
const Selectors = {
  MESSAGES_DRAWER: 'div[data-testid="DMDrawer"]',
  NAV_HOME_LINK: 'a[data-testid="AppTabBar_Home_Link"]',
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV_DESKTOP: 'header nav',
  PRIMARY_NAV_MOBILE: '#layers nav',
  PROMOTED_TWEET: '[data-testid="placementTracking"]',
  SIDEBAR: 'div[data-testid="sidebarColumn"]',
  SIDEBAR_ONLY_SHOW_FIRST: 'div[data-testid="sidebarColumn"] > div > div > div > div > div > div:not(:first-of-type)',
  TIMELINE: 'div[data-testid="primaryColumn"] section > h1 + div[aria-label] > div',
  TIMELINE_HEADING: 'h2[role="heading"]',
  TWEET: 'div[data-testid="tweet"]',
  VERIFIED_TICK: `div[data-testid="tweet"] > div:nth-of-type(2) > div:first-child a svg`,
}

/** @enum {string} */
const Svgs = {
  MUTE: `<g>
    <path d="M1.75 22.354c-.192 0-.384-.073-.53-.22-.293-.293-.293-.768 0-1.06L20.395 1.898c.293-.294.768-.294 1.06 0s.294.767 0 1.06L2.28 22.135c-.146.146-.338.22-.53.22zm1.716-5.577c-.134 0-.27-.036-.392-.11-.67-.413-1.07-1.13-1.07-1.917v-5.5c0-1.24 1.01-2.25 2.25-2.25H6.74l7.047-5.588c.225-.18.533-.215.792-.087.258.125.423.387.423.675v3.28c0 .415-.336.75-.75.75s-.75-.335-.75-.75V3.553L7.47 8.338c-.134.104-.298.162-.467.162h-2.75c-.413 0-.75.337-.75.75v5.5c0 .263.134.5.356.64.353.216.462.678.245 1.03-.14.23-.387.357-.64.357zm10.787 5.973c-.166 0-.33-.055-.466-.162l-4.795-3.803c-.325-.258-.38-.73-.122-1.054.258-.322.73-.38 1.054-.12l3.58 2.838v-7.013c0-.414.335-.75.75-.75s.75.336.75.75V22c0 .288-.166.55-.425.675-.104.05-.216.075-.327.075z"></path>
  </g>`
}

const MOBILE_LOGGED_OUT_URLS = ['/', '/login', '/i/flow/signup']
const PROFILE_TITLE_RE = /\(@[a-z\d_]{1,15}\)$/i
const TITLE_NOTIFICATION_RE = /^\(\d+\+?\) /
const URL_PHOTO_RE = /photo\/\d$/
const URL_TWEET_ID_RE = /\/status\/(\d+)$/
const ZWSP = '​'

/** Flag for a Block ${user} menu item having been seen in the last popup */
let blockMenuItemSeen = false

/** Notification count in the title (including trailing space), e.g. '(1) ' */
let currentNotificationCount = ''

/** Title of the current page, without the ' / Twitter' suffix */
let currentPage = ''

/** Current URL path */
let currentPath = ''

/** Flag for a Home / Latest Tweets link having been clicked */
let homeLinkClicked = false

/** The last OG page title we saw for the home timeline */
let lastHomeTimelineTitle = ''

/** The last page title we used for the home timeline when we need to cache it */
let lastHomeTitle = null

/**
 * MutationObservers active on the current page, or anything else we want to
 * clean up when the user moves off the current page.
 * @type {(MutationObserver|{disconnect(): void})[]}
 */
let pageObservers = []

// Config for the fake timeline used to display retweets/quote tweets separately
let separatedTweetsTimelineTitle = ''
let separatedTweetsTimelineName = ''

function configureSeparatedTweetsTimeline() {
  if (config.retweets == 'separate' && config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = separatedTweetsTimelineName = getString('SHARED_TWEETS')
  } else if (config.retweets == 'separate') {
    separatedTweetsTimelineTitle = separatedTweetsTimelineName = ZWSP + getString('RETWEETS')
  } else if (config.quoteTweets == 'separate') {
    separatedTweetsTimelineTitle = separatedTweetsTimelineName = ZWSP + getString('QUOTE_TWEETS')
  }
}

function isOnExplorePage() {
  return currentPath.startsWith('/explore')
}

function isOnHomeTimeline() {
  return currentPage == getString('LATEST_TWEETS') || currentPage == separatedTweetsTimelineTitle || currentPage == getString('HOME')
}

function isOnIndividualTweetPage() {
  return URL_TWEET_ID_RE.test(currentPath)
}

function isOnListsPage() {
  return currentPath.endsWith('/lists') || currentPath.startsWith('/i/lists')
}

function isOnNotificationsPage() {
  return currentPath.startsWith('/notifications')
}

function isOnProfilePage() {
  return PROFILE_TITLE_RE.test(currentPage)
}

function isOnQuoteTweetsPage() {
  return currentPath.endsWith('/retweets/with_comments')
}

function isOnTopicsPage() {
  return currentPath.endsWith('/topics')
}

function shouldShowFirstSidebarItem() {
  return (
    currentPath == PagePaths.BOOKMARKS ||
    currentPath == PagePaths.NOTIFICATION_TIMELINE ||
    currentPath == PagePaths.SEARCH ||
    isOnHomeTimeline() ||
    isOnIndividualTweetPage() ||
    isOnListsPage() ||
    isOnNotificationsPage() ||
    isOnQuoteTweetsPage() ||
    isOnTopicsPage()
  )
}

function shouldHideSidebar() {
  return isOnExplorePage()
}
//#endregion

//#region Utility functions
/**
 * @param {string} css
 * @return {HTMLStyleElement}
 */
function addStyle(css) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'tweak-new-twitter'
  $style.textContent = css
  document.head.appendChild($style)
  return $style
}

/**
 * @param {string} selector
 * @param {{
 *   name?: string
 *   stopIf?: () => boolean
 *   timeout?: number
 *   context?: Document | HTMLElement
 * }} [options]
 * @returns {Promise<HTMLElement | null>}
 */
function getElement(selector, {
  name = null,
  stopIf = null,
  timeout = Infinity,
  context = document,
} = {}) {
  return new Promise((resolve) => {
    let startTime = Date.now()
    let rafId
    let timeoutId

    function stop($element, reason) {
      if ($element == null) {
        log(`stopped waiting for ${name || selector} after ${reason}`)
      }
      else if (Date.now() > startTime) {
        log(`${name || selector} appeared after ${Date.now() - startTime}ms`)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      resolve($element)
    }

    if (timeout !== Infinity) {
      timeoutId = setTimeout(stop, timeout, null, `${timeout}ms timeout`)
    }

    function queryElement() {
      let $element = context.querySelector(selector)
      if ($element) {
        stop($element)
      }
      else if (stopIf?.() === true) {
        stop(null, 'stopIf condition met')
      }
      else {
        rafId = requestAnimationFrame(queryElement)
      }
    }

    queryElement()
  })
}

function log(...args) {
  if (enableDebugLogging) {
    console.log(`🧨${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

/**
 * Convenience wrapper for the MutationObserver API.
 *
 * The callback is called immediately to support using an observer and its
 * options as a trigger for any change, without looking at MutationRecords.
 *
 * @param {Node} $element
 * @param {MutationCallback} callback
 * @param {MutationObserverInit} options
 */
function observeElement($element, callback, options = {childList: true}) {
  let observer = new MutationObserver(callback)
  callback([], observer)
  observer.observe($element, options)
  return observer
}

/**
 * @param {string} page
 * @returns {() => boolean}
 */
function pageIsNot(page) {
  return () => page != currentPage
}

/**
 * @param {() => boolean} condition
 * @returns {() => boolean}
 */
 function not(condition) {
  return () => !condition()
}

/**
 * @param {string} path
 * @returns {() => boolean}
 */
function pathIsNot(path) {
  return () => path != currentPath
}

/**
 * @param {number} n
 * @returns {string}
 */
function s(n) {
  return n == 1 ? '' : 's'
}
//#endregion

//#region Global observers
/**
 * When the "Background" setting is changed in "Customize your view", <body>'s
 * backgroundColor is changed and the app is re-rendered, so we need to
 * re-process the current page.
 */
function observeBackgroundColor() {
  let $body = document.body
  let lastBackgroundColor = null

  log('observing body style attribute for backgroundColor changes')
  observeElement($body, () => {
    let backgroundColor = $body.style.backgroundColor
    if (backgroundColor == lastBackgroundColor) return

    $body.classList.toggle('Default', backgroundColor == 'rgb(255, 255, 255)')
    $body.classList.toggle('Dim', backgroundColor == 'rgb(21, 32, 43)')
    $body.classList.toggle('LightsOut', backgroundColor == 'rgb(0, 0, 0)')

    if (lastBackgroundColor != null) {
      log('Background setting changed - re-processing current page')
      observePopups()
      processCurrentPage()
    }
    lastBackgroundColor = backgroundColor
  }, {
    attributes: true,
    attributeFilter: ['style']
  })
}

/**
 * When the "Color" setting is changed in "Customize your view", the app re-renders from a certain
 * point, so we need to re-process the current page.
 */
 async function observeColor() {
  let $primaryColorRerenderBoundary = await getElement('#react-root > div > div')
  let $style = addStyle('')
  let lastColor = null

  log('observing Color change re-renders')
  observeElement($primaryColorRerenderBoundary, async () => {
    let $tweetButton = await getElement('a[data-testid="SideNav_NewTweet_Button"]', {
      name: 'Tweet button'
    })
    let color = getComputedStyle($tweetButton).backgroundColor
    if (color == lastColor) return

    if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
      log(`setting active timeline heading color to ${color}`)
      $style.textContent = `
        body.Home main h2:not(#tnt_separated_tweets),
        body.LatestTweets main h2:not(#tnt_separated_tweets),
        body.SeparatedTweets #tnt_separated_tweets {
          color: ${color};
        }
      `
    }

    if (lastColor != null) {
      log('Color setting changed - re-processing current page')
      observePopups()
      processCurrentPage()
    }
    lastColor = color
  })

  return
}

/**
 * When the "Font size" setting is changed in "Customize your view", <html>'s
 * fontSize is changed, after which we need to update nav font size accordingly.
 */
function observeFontSize() {
  if (!(desktop && config.navBaseFontSize)) return

  let $style = addStyle('')
  let lastFontSize = ''

  log('observing html style attribute for fontSize changes')
  observeElement($html, () => {
    if ($html.style.fontSize != lastFontSize) {
      lastFontSize = $html.style.fontSize
      log(`setting nav font size to ${lastFontSize}`)
      $style.textContent = `
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir="auto"] span { font-size: ${lastFontSize}; font-weight: normal; }
        ${Selectors.PRIMARY_NAV_DESKTOP} div[dir="auto"] { margin-top: -4px; }
      `
    }
  }, {
    attributes: true,
    attributeFilter: ['style']
  })
}

let observePopups = (function() {
  /** @type {MutationObserver} */
  let popupObserver
  /** @type {WeakMap<HTMLElement, MutationObserver>} */
  let nestedObservers = new WeakMap()

  return async function observePopups() {
    if (popupObserver) {
      log('disconnecting previous popup observer')
      popupObserver.disconnect()
    }

    if (!(config.addAddMutedWordMenuItem || config.fastBlock)) return

    let $keyboardWrapper = await getElement('[data-at-shortcutkeys]', {
      name: 'keyboard wrapper',
    })
    log(`${popupObserver ? 're-' : ''}observing popups`)
    popupObserver = observeElement($keyboardWrapper.previousElementSibling, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          let observer = onPopup($el)
          if (observer) {
            nestedObservers.set($el, observer)
          }
        })
        mutation.removedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          if (nestedObservers.has($el)) {
            log('disconnecting nested popup observer')
            nestedObservers.get($el).disconnect()
            nestedObservers.delete($el)
          }
        })
      })
    })
  }
})()

async function observeTitle() {
  let $title = await getElement('title', {name: '<title>'})
  log('observing <title>')
  observeElement($title, () => onTitleChange($title.textContent))
}
//#endregion

//#region Page observers
async function observeTimeline(page) {
  let $timeline = await getElement(Selectors.TIMELINE, {
    name: 'timeline',
    stopIf: pageIsNot(page),
  })
  if ($timeline == null) {
    return
  }

  // The inital timeline element is a placeholder which doesn't have a style attribute
  if ($timeline.hasAttribute('style')) {
    log('observing timeline', {$timeline})
    pageObservers.push(
      observeElement($timeline, () => onTimelineChange($timeline, page))
    )
  }
  else {
    log('waiting for timeline')
    let startTime = Date.now()
    pageObservers.push(
      observeElement($timeline.parentNode, (mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach(($timeline) => {
            if (Date.now() > startTime) {
              log(`timeline appeared after ${Date.now() - startTime}ms`)
            }
            log('observing timeline', {$timeline})
            pageObservers.push(
              observeElement($timeline, () => onTimelineChange($timeline, page))
            )
          })
        })
      })
    )
  }
}
//#endregion

//#region Tweak functions
/**
 * Add an "Add muted word" menu item after "Settings and privacy" which takes
 * you straight to entering a new muted word (by clicking its way through all
 * the individual screens!)
 * @param {HTMLElement} $settingsLink
 */
 async function addAddMutedWordMenuItem($settingsLink) {
  log('adding "Add muted word" menu item')
  let $addMutedWord = /** @type {HTMLElement} */ ($settingsLink.parentElement.cloneNode(true))
  $addMutedWord.classList.add('tnt_menu_item')
  $addMutedWord.querySelector('a').href = PagePaths.ADD_MUTED_WORD
  $addMutedWord.querySelector('span').textContent = getString('ADD_MUTED_WORD')
  $addMutedWord.querySelector('svg').innerHTML = Svgs.MUTE
  $addMutedWord.addEventListener('click', (e) => {
    e.preventDefault()
    addMutedWord()
  })
  $settingsLink.parentElement.insertAdjacentElement('afterend', $addMutedWord)
}

async function addMutedWord() {
  for (let path of [
    '/settings',
    '/settings/privacy_and_safety',
    '/settings/mute_and_block',
    '/settings/muted_keywords',
    '/settings/add_muted_keyword',
  ]) {
    let $link = await getElement(`a[href="${path}"]`)
    if (!$link) return
    $link.click()
  }
  let $input = await getElement('input[name="keyword"]')
  setTimeout(() => $input.focus(), 100)
}

async function addSeparatedTweetsTimelineControl(page) {
  if (desktop) {
    let $timelineTitle = await getElement('main h2', {
      name: 'timeline title',
      stopIf: pageIsNot(page),
    })

    if ($timelineTitle == null) {
      return
    }

    if (document.querySelector('#tnt_separated_tweets') != null) {
      log('separated tweets timeline header already present')
      return
    }

    log('inserting separated tweets timeline header')

    let $retweets = /** @type {HTMLElement} */ ($timelineTitle.parentElement.cloneNode(true))
    $retweets.querySelector('h2').id = 'tnt_separated_tweets'
    $retweets.querySelector('span').textContent = separatedTweetsTimelineName
    // This script assumes navigation has occurred when the document title changes, so by changing
    // the title we effectively fake navigation to a non-existent page representing the sparated
    // tweets timeline.
    $retweets.addEventListener('click', () => {
      if (!document.title.startsWith(separatedTweetsTimelineTitle)) {
        setTitle(separatedTweetsTimelineTitle)
      }
      window.scrollTo({top: 0})
    })
    $timelineTitle.parentElement.parentElement.insertAdjacentElement('afterend', $retweets)
    // Go back to the main timeline when the Latest Tweets / Home heading is clicked
    $timelineTitle.parentElement.addEventListener('click', () => {
      if (!document.title.startsWith(lastHomeTimelineTitle)) {
        homeLinkClicked = true
        setTitle(lastHomeTimelineTitle)
      }
    })
    // Go back to the main timeline when the Home nav link is clicked
    document.querySelector(Selectors.NAV_HOME_LINK).addEventListener('click', () => {
      homeLinkClicked = true
      if (location.pathname == '/home' && !document.title.startsWith(lastHomeTimelineTitle)) {
        setTitle(lastHomeTimelineTitle)
      }
    })
  }

  if (mobile) {
    let $timelineTitle = await getElement('header h2', {
      name: 'timeline title',
      stopIf: pageIsNot(page),
    })

    if ($timelineTitle == null) {
      return
    }

    // We hide the existing timeline title via CSS when it's not wanted instead
    // of changing its text, as those changes persist when you view a tweet.
    $timelineTitle.classList.add('tnt_home_timeline_title')
    removeMobileHeaderElements()

    log('inserting separated tweets timeline switcher')

    let $toggle = document.createElement('div')
    $toggle.id = 'tnt_switch_timeline'
    let toggleColor = getComputedStyle(document.querySelector(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/explore"] svg`)).color
    $toggle.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" style="color: ${toggleColor}; width: 22px; vertical-align: text-bottom; position: relative; max-width: 100%; height: 22px; fill: currentcolor; display: inline-block;">
      <g>
        ${page == separatedTweetsTimelineTitle ? (
          '<path d="M22.46 7.57L12.357 2.115c-.223-.12-.49-.12-.713 0L1.543 7.57c-.364.197-.5.652-.303 1.017.135.25.394.393.66.393.12 0 .243-.03.356-.09l.815-.44L4.7 19.963c.214 1.215 1.308 2.062 2.658 2.062h9.282c1.352 0 2.445-.848 2.663-2.087l1.626-11.49.818.442c.364.193.82.06 1.017-.304.196-.363.06-.818-.304-1.016zm-4.638 12.133c-.107.606-.703.822-1.18.822H7.36c-.48 0-1.075-.216-1.178-.798L4.48 7.69 12 3.628l7.522 4.06-1.7 12.015z"></path><path d="M8.22 12.184c0 2.084 1.695 3.78 3.78 3.78s3.78-1.696 3.78-3.78-1.695-3.78-3.78-3.78-3.78 1.696-3.78 3.78zm6.06 0c0 1.258-1.022 2.28-2.28 2.28s-2.28-1.022-2.28-2.28 1.022-2.28 2.28-2.28 2.28 1.022 2.28 2.28z"></path>'
        ) : (
          '<path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>'
        )}
      </g>
    </svg>`
    $toggle.style.cursor = 'pointer'
    $toggle.title = `Switch to ${page == lastHomeTimelineTitle ? separatedTweetsTimelineTitle : lastHomeTimelineTitle}`
    $toggle.addEventListener('click', () => {
      let newTitle = page == separatedTweetsTimelineTitle ? lastHomeTimelineTitle : separatedTweetsTimelineTitle
      setTitle(newTitle)
      $toggle.title = `Switch to ${newTitle == lastHomeTimelineTitle ? separatedTweetsTimelineTitle : lastHomeTimelineTitle}`
      window.scrollTo({top: 0})
    })
    $timelineTitle.insertAdjacentElement('afterend', $toggle)
    if (page == separatedTweetsTimelineName) {
      let $sharedTweetsTitle = /** @type {HTMLElement} */ ($timelineTitle.cloneNode(true))
      $sharedTweetsTitle.querySelector('span').textContent = separatedTweetsTimelineName
      $sharedTweetsTitle.id = 'tnt_shared_tweets_timeline_title'
      $sharedTweetsTitle.classList.remove('tnt_home_timeline_title')
      $timelineTitle.insertAdjacentElement('afterend', $sharedTweetsTitle)
    }
    $timelineTitle.parentElement.classList.add('tnt_mobile_header')

    // Go back to the main timeline when the Home bottom nav item is clicked on
    // the shared tweets timeline.
    let $homeBottomNavItem = /** @type {HTMLElement} */ (document.querySelector(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/home"]`))
    if (!$homeBottomNavItem.dataset.tweakNewTwitterListener) {
      $homeBottomNavItem.addEventListener('click', () => {
        if (location.pathname == '/home' && currentPage == separatedTweetsTimelineTitle) {
          setTitle(lastHomeTimelineTitle)
        }
      })
      $homeBottomNavItem.dataset.tweakNewTwitterListener = 'true'
    }
  }
}

function addStaticCss() {
  var cssRules = []
  var hideCssSelectors = []

  if (config.hideAnalyticsNav) {
    hideCssSelectors.push('div[role="dialog"] a[href*="analytics.twitter.com"]')
  }
  if (config.hideBookmarksNav) {
    hideCssSelectors.push('div[role="dialog"] a[href$="/bookmarks"]')
  }
  if (config.hideListsNav) {
    hideCssSelectors.push('div[role="dialog"] a[href$="/lists"]')
  }
  if (config.hideMomentsNav) {
    hideCssSelectors.push('div[role="dialog"] a[href$="/moment_maker"]')
  }
  if (config.hideNewslettersNav) {
    hideCssSelectors.push('div[role="dialog"] a[href$="/newsletters"]')
  }
  if (config.hideTopicsNav) {
    hideCssSelectors.push('div[role="dialog"] a[href$="/topics"]')
  }
  if (config.hideTwitterAdsNav) {
    hideCssSelectors.push('div[role="dialog"] a[href*="ads.twitter.com"]')
  }
  if (config.tweakQuoteTweetsPage) {
    // Hide the quoted tweet, which is repeated in every quote tweet
    hideCssSelectors.push('body.QuoteTweets [data-testid="tweet"] [aria-labelledby] > div:last-child')
  }

  if (desktop) {
    if (config.addAddMutedWordMenuItem) {
      // Hover colors for custom menu items
      cssRules.push(`
        body.Default .tnt_menu_item a:hover { background-color: rgb(247, 249, 249); }
        body.Dim .tnt_menu_item a:hover { background-color: rgb(25, 39, 52); }
        body.LightsOut .tnt_menu_item a:hover { background-color: rgb(21, 24, 28); }
      `)
    }
    if (config.hideSidebarContent) {
      hideCssSelectors.push(
        `body.ShowFirstSidebarItem ${Selectors.SIDEBAR_ONLY_SHOW_FIRST}`,
        `body.HideSidebar ${Selectors.SIDEBAR}`,
        `body.Profile ${Selectors.SIDEBAR} > div > div > div > div > div > div:not(:nth-of-type(1), :nth-of-type(2), :nth-of-type(3))`,
      )
    }
    if (config.hideExploreNav) {
      hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/explore"]`)
    }
    if (config.hideBookmarksNav) {
      hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href="/i/bookmarks"]`)
    }
    if (config.hideListsNav) {
      hideCssSelectors.push(`${Selectors.PRIMARY_NAV_DESKTOP} a[href*="/lists"]`)
    }
    if (config.hideAccountSwitcher) {
      cssRules.push(`
        header[role="banner"] > div > div > div > div:last-child {
          flex-shrink: 1 !important;
          align-items: flex-end !important;
        }
      `)
      hideCssSelectors.push(
        '[data-testid="SideNav_AccountSwitcher_Button"] > div:first-child:not(:only-child)',
        '[data-testid="SideNav_AccountSwitcher_Button"] > div:first-child + div',
      )
    }
    if (config.hideMessagesDrawer) {
      hideCssSelectors.push(Selectors.MESSAGES_DRAWER)
    }
  }

  if (mobile) {
    if (config.hideExplorePageContents) {
      // Hide explore page contents so we don't get a brief flash of them
      hideCssSelectors.push(
        'body.Explore header nav',
        'body.Explore main',
      )
    }
    if (config.hideAppNags) {
      hideCssSelectors.push('.TwitterIsBetterOnTheAppNeverButton #layers > div')
    }
    if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
      // Use CSS to only tweak layout of mobile header elements on pages where
      // it's needed, as changes made directly to them can persist across pages.
      cssRules.push(`
        body.Home .tnt_mobile_header,
        body.LatestTweets .tnt_mobile_header,
        body.SeparatedTweets .tnt_mobile_header {
           flex-direction: row;
           align-items: center;
           justify-content: space-between;
        }
      `)
      hideCssSelectors.push('body.SeparatedTweets .tnt_home_timeline_title')
    }
    if (config.hideMessagesBottomNavItem) {
      hideCssSelectors.push(`${Selectors.PRIMARY_NAV_MOBILE} a[href="/messages"]`)
    }
    if (config.hideAnalyticsNav && config.hideTwitterAdsNav) {
      // XXX Quick but brittle way to hide the divider above these items
      hideCssSelectors.push('div[role="dialog"] div:nth-of-type(8)[role="separator"]')
    }
  }

  if (hideCssSelectors.length > 0) {
    cssRules.push(`${hideCssSelectors.join(', ')} { display: none !important; }`)
  }
  if (cssRules.length > 0) {
    addStyle(cssRules.join('\n'))
  }
}

/**
 * Attempts to determine the type of a timeline Tweet given the element with data-testid="tweet" on
 * it, falling back to TWEET if it doesn't appear to be one of the particular types we care about.
 * @param {HTMLElement} $tweet
 * @returns {import("./types").TimelineItemType}
 */
function getTweetType($tweet) {
  if ($tweet.closest(Selectors.PROMOTED_TWEET)) {
    return 'PROMOTED_TWEET'
  }
  if ($tweet.previousElementSibling?.querySelector('[data-testid="socialContext"]')) {
    return 'RETWEET'
  }
  if ($tweet.querySelector('div[id^="id__"] > div[dir="auto"] > span')?.textContent.includes(getString('QUOTE_TWEET')) ||
      // QTs of accounts you blocked are displayed as a nested <article> with "This Tweet is unavailable."
      $tweet.querySelector('article')) {
    return 'QUOTE_TWEET'
  }
  return 'TWEET'
}

/**
 * @param {HTMLElement} $popup
 * @returns {boolean} false if there was nothing actionable in the popup
 */
 function handlePopup($popup) {
  if (config.fastBlock) {
    if (blockMenuItemSeen && $popup.querySelector('[data-testid="confirmationSheetConfirm"]')) {
      log('fast blocking')
      ;/** @type {HTMLElement} */ ($popup.querySelector('[data-testid="confirmationSheetConfirm"]')).click()
      return true
    }
    else if ($popup.querySelector('[data-testid="block"]')) {
      log('preparing for fast blocking')
      blockMenuItemSeen = true
      // Create a nested observer for mobile, as it reuses the existing popup element
      return !mobile
    } else {
      blockMenuItemSeen = false
    }
  }

  if (config.addAddMutedWordMenuItem) {
    let $settingsLink = /** @type {HTMLElement} */ ($popup.querySelector('a[href="/settings"]'))
    if ($settingsLink) {
      addAddMutedWordMenuItem($settingsLink)
      return true
    }
  }

  return false
}

/**
 * Automatically click a tweet to get rid of the "More Tweets" section.
 */
 async function hideMoreTweetsSection(path) {
  let id = URL_TWEET_ID_RE.exec(path)[1]
  let $link = await getElement(`a[href$="/status/${id}"]`, {
    name: 'tweet',
    stopIf: pathIsNot(path),
  })
  if ($link != null) {
    log('clicking "Show this thread" link')
    $link.click()
  }
}

/**
 * @param {string} page
 */
async function hideOpenAppButton(page) {
  let $button = await getElement('header div:nth-of-type(3) > [role="button"]', {
    stopIf: pageIsNot(page),
    // The header doesn't re-render if you move to another tweet
    timeout: 2000,
  })
  if ($button) {
    log('hiding "Open app" button')
    // Hide the button directly rather than its parent, as the parent is reused
    // for other things - e.g. the sparkles button on the home timeline
    $button.style.visibility = 'hidden'
  }
}

/**
 * Checks if a tweet is preceded by an element creating a vertical reply line.
 * @param {HTMLElement} $tweet
 * @returns {boolean}
 */
function isReplyToPreviousTweet($tweet) {
  let $replyLine = $tweet.previousElementSibling?.firstElementChild?.firstElementChild?.firstElementChild
  if ($replyLine) {
    return getComputedStyle($replyLine).width == '2px'
  }
}

/**
 * @returns {MutationObserver | undefined}
 */
function onPopup($popup) {
  log('popup appeared', $popup)

  if (handlePopup($popup)) return

  log('observing nested popups')
  return observeElement($popup, (mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((/** @type {HTMLElement} */ $nestedPopup) => {
        log('nested popup appeared', $nestedPopup)
        handlePopup($nestedPopup)
      })
    })
  })
}

function onTimelineChange($timeline, page) {
  log(`processing ${$timeline.children.length} timeline item${s($timeline.children.length)}`)
  /** @type {HTMLElement} */
  let $previousItem = null
  /** @type {?import("./types").TimelineItemType} */
  let previousItemType = null
  /** @type {?boolean} */
  let hidPreviousItem = null
  for (let $item of $timeline.children) {
    /** @type {?import("./types").TimelineItemType} */
    let itemType = null
    /** @type {?boolean} */
    let hideItem = null
    /** @type {?HTMLElement} */
    let $tweet = $item.querySelector(Selectors.TWEET)

    if ($tweet != null) {
      itemType = getTweetType($tweet)
      if (page == getString('LATEST_TWEETS') || page == separatedTweetsTimelineTitle || page == getString('HOME')) {
        if (isReplyToPreviousTweet($tweet) && hidPreviousItem != null) {
          hideItem = hidPreviousItem
          itemType = previousItemType
        } else {
          hideItem = shouldHideTimelineItem(itemType, page)
        }
      }
    }

    if (itemType == null && config.hideWhoToFollowEtc) {
      // "Who to follow", "Follow some Topics" etc. headings
      if ($item.querySelector(Selectors.TIMELINE_HEADING)) {
        itemType = 'HEADING'
        hideItem = true
        // Also hide the divider above the heading
        if ($previousItem?.innerText == '' && $previousItem.firstElementChild) {
          /** @type {HTMLElement} */ ($previousItem.firstElementChild).style.display = 'none'
        }
      }
    }

    if (itemType == null) {
      // Assume a non-identified item following an identified item is related to it
      // "Who to follow" users and "Follow some Topics" topics appear in subsequent items
      // "Show this thread" and "Show more" links appear in subsequent items
      if (previousItemType != null) {
        hideItem = hidPreviousItem
        itemType = previousItemType
      }
      // The first item in the timeline is sometimes an empty placeholder <div>
      else if ($item !== $timeline.firstElementChild && hideItem == null) {
        // We're probably also missing some spacer / divider nodes
        log('unhandled timeline item', $item)
      }
    }

    if (hideItem !== true &&
        config.verifiedAccounts === 'hide' &&
        $item.querySelector(Selectors.VERIFIED_TICK)) {
      hideItem = true
    }

    if (hideItem != null) {
      if (/** @type {HTMLElement} */ ($item.firstElementChild).style.display !== (hideItem ? 'none' : '')) {
        /** @type {HTMLElement} */ ($item.firstElementChild).style.display = hideItem ? 'none' : ''
        // Log these out as they can't be reliably triggered for testing
        if (itemType == 'HEADING' || previousItemType == 'HEADING') {
          log(`hid a ${previousItemType == 'HEADING' ? 'post-' : ''}heading item`, $item)
        }
      }
    }

    if (hideItem !== true &&
        config.verifiedAccounts === 'highlight' &&
        $item.querySelector(Selectors.VERIFIED_TICK) &&
        $item.style.backgroundColor !== 'rgba(29, 161, 242, 0.25)') {
      $item.style.backgroundColor = 'rgba(29, 161, 242, 0.25)'
    }

    $previousItem = $item
    hidPreviousItem = hideItem
    // If we hid a heading, keep hiding everything after it until we hit a tweet
    if (!(previousItemType == 'HEADING' && itemType == null)) {
      previousItemType = itemType
    }
  }
}

function onTitleChange(title) {
  log('title changed', {title: title.split(getString('TITLE_SPLIT'))[ltr ? 0 : 1], path: location.pathname})

  // Ignore any leading notification counts in titles, e.g. '(1) Latest Tweets / Twitter'
  let notificationCount = ''
  if (TITLE_NOTIFICATION_RE.test(title)) {
    notificationCount = TITLE_NOTIFICATION_RE.exec(title)[0]
    title = title.replace(TITLE_NOTIFICATION_RE, '')
  }

  let homeLinkWasClicked = homeLinkClicked
  homeLinkClicked = false

  if (title == getString('TWITTER')) {
    // Mobile uses "Twitter" when viewing a photo - we need to let these process
    // so the next page will be re-processed when the photo is closed.
    if (mobile && URL_PHOTO_RE.test(location.pathname)) {
      log('viewing a photo on mobile')
      if (isOnHomeTimeline()) {
        log('caching home timeline title')
        lastHomeTitle = currentPage
      }
		}
    // Ignore Flash of Uninitialised Title when navigating to a page for the
    // first time.
    else {
      log('ignoring Flash of Uninitialised Title')
      return
    }
  }

  let newPage = title.split(getString('TITLE_SPLIT'))[ltr ? 0 : 1]

  // Only allow the same page to re-process after a title change on desktop if
  // the "Customize your view" dialog is currently open.
  if (newPage == currentPage && !(desktop && location.pathname == '/i/display')) {
    log('ignoring duplicate title change')
    currentNotificationCount = notificationCount
    return
  }

  // Restore the cached home timeline title when returning from viewing media
  // on mobile.
  if (mobile &&
      URL_PHOTO_RE.test(currentPath) &&
      location.pathname == '/home' &&
      lastHomeTitle != null) {
    log('restoring last home title')
    newPage = lastHomeTitle
    lastHomeTitle = null
  }

  // Stay on the separated tweets timeline on desktop when…
  if (desktop && currentPage == separatedTweetsTimelineTitle &&
      // …the title has changed back to the main timeline…
      (newPage == getString('LATEST_TWEETS') || newPage == getString('HOME')) &&
      // …the Home nav or Latest Tweets / Home header _wasn't_ clicked and…
      !homeLinkWasClicked &&
      (
        // …the user viewed a photo.
        URL_PHOTO_RE.test(location.pathname) ||
        // …the user stopped viewing a photo.
        URL_PHOTO_RE.test(currentPath) ||
        // …the user opened or used the "Customize your view" dialog.
        location.pathname == '/i/display' ||
        // …the user closed the "Customize your view" dialog.
        currentPath == '/i/display' ||
        // …the user opened the "Send via Direct Message" dialog.
        location.pathname == '/messages/compose' ||
        // …the user closed the "Send via Direct Message" dialog.
        currentPath == '/messages/compose' ||
        // …the user opened the compose Tweet dialog.
        location.pathname == '/compose/tweet' ||
        // …the user closed the compose Tweet dialog.
        currentPath == '/compose/tweet' ||
        // …the notification count in the title changed.
        notificationCount != currentNotificationCount
      )) {
    log('ignoring title change on separated tweets timeline')
    currentNotificationCount = notificationCount
    currentPath = location.pathname
    setTitle(separatedTweetsTimelineTitle)
    return
  }

  // Assumption: all non-FOUT, non-duplicate title changes are navigation, which
  // need the page to be re-processed.

  currentPage = newPage
  currentNotificationCount = notificationCount
  currentPath = location.pathname

  if (currentPage == getString('LATEST_TWEETS') || currentPage == getString('HOME')) {
    lastHomeTimelineTitle = currentPage
  }

  log('processing new page')

  processCurrentPage()
}

function processCurrentPage() {
  if (pageObservers.length > 0) {
    log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
    pageObservers.forEach(observer => observer.disconnect())
    pageObservers = []
  }

  if (mobile && config.hideAppNags) {
    document.body.classList.toggle('TwitterIsBetterOnTheAppNeverButton', MOBILE_LOGGED_OUT_URLS.includes(currentPath))
  }

  if (config.alwaysUseLatestTweets && currentPage == getString('HOME')) {
    switchToLatestTweets(currentPage)
    return
  }

  let shouldObserveTimeline = isOnProfilePage() && (
    config.verifiedAccounts != 'ignore' || config.hideWhoToFollowEtc
  )

  // Hooks for styling
  document.body.classList.toggle('Explore', isOnExplorePage())
  document.body.classList.toggle('HideSidebar', shouldHideSidebar())
  document.body.classList.toggle('Profile', isOnProfilePage())
  document.body.classList.toggle('QuoteTweets', isOnQuoteTweetsPage())
  document.body.classList.toggle('ShowFirstSidebarItem', shouldShowFirstSidebarItem())

  // "Which version of the home timeline are we on?" hooks for styling
  document.body.classList.toggle('Home', currentPage == getString('HOME'))
  document.body.classList.toggle('LatestTweets', currentPage == getString('LATEST_TWEETS'))
  document.body.classList.toggle('SeparatedTweets', currentPage == separatedTweetsTimelineTitle)

  if (isOnHomeTimeline()) {
    if (config.retweets == 'separate' || config.quoteTweets == 'separate') {
      addSeparatedTweetsTimelineControl(currentPage)
    }

    shouldObserveTimeline = (
      config.retweets != 'ignore' || config.quoteTweets != 'ignore' || config.verifiedAccounts != 'ignore' || config.hideWhoToFollowEtc
    )
  } else if (mobile) {
    removeMobileHeaderElements()
  }

  if (shouldObserveTimeline) {
    observeTimeline(currentPage)
  }

  if (isOnIndividualTweetPage()) {
    tweakIndividualTweetPage()
  }

  if (config.tweakQuoteTweetsPage && isOnQuoteTweetsPage()) {
    tweakQuoteTweetsPage()
  }

  if (mobile && config.hideExplorePageContents && isOnExplorePage()) {
    tweakExplorePage(currentPage)
  }
}

/**
 * The mobile version of Twitter reuses heading elements between screens, so we
 * always remove any elements which could be there from the previous page
 * and re-add them later when needed.
 */
function removeMobileHeaderElements() {
  document.querySelector('#tnt_shared_tweets_timeline_title')?.remove()
  document.querySelector('#tnt_switch_timeline')?.remove()
}

/**
 * Sets the page name in <title>, retaining any current notification count.
 * @param {string} page
 */
function setTitle(page) {
  document.title = ltr ? (
    `${currentNotificationCount}${page}${getString('TITLE_SPLIT')}${getString('TWITTER')}`
  ) : (
    `${currentNotificationCount}${getString('TWITTER')}${getString('TITLE_SPLIT')}${page}`
  )
}

/**
 * @param {import("./types").SharedTweetsConfig} config
 * @param {string} page
 * @returns {boolean}
 */
 function shouldHideSharedTweet(config, page) {
  switch (config) {
    case 'hide': return true
    case 'ignore': return page == separatedTweetsTimelineTitle
    case 'separate': return page != separatedTweetsTimelineTitle
  }
}

/**
 * @param {import("./types").TimelineItemType} type
 * @param {string} page
 * @returns {boolean}
 */
function shouldHideTimelineItem(type, page) {
  switch (type) {
    case 'RETWEET': return shouldHideSharedTweet(config.retweets, page)
    case 'QUOTE_TWEET': return shouldHideSharedTweet(config.quoteTweets, page)
    case 'TWEET': return page == separatedTweetsTimelineTitle
    default: return true
  }
}

async function switchToLatestTweets(page) {
  log('switching to Latest Tweets timeline')

  let $switchButton = await getElement(`${Selectors.PRIMARY_COLUMN} [role="button"]`, {
    name: 'sparkle button',
    stopIf: pageIsNot(page),
  })
  if ($switchButton == null) return

  log('clicking sparkle button')
  $switchButton.click()

  let $seeLatestTweetsInstead = await getElement('div[role="menu"] div[role="menuitem"]', {
    name: '"See latest Tweets instead" menu item',
    stopIf: pageIsNot(page),
  })
  if ($seeLatestTweetsInstead == null) return

  log('clicking "See latest Tweets" instead menu item')
  $seeLatestTweetsInstead.click()
}

async function tweakExplorePage(page) {
  let $searchInput = await getElement('input[data-testid="SearchBox_Search_Input"]', {
    name: 'search input',
    stopIf: pageIsNot(page),
  })
  if (!$searchInput) return

  log('focusing search input')
  $searchInput.focus()

  let $backButton = await getElement('[role="button"]:not([data-testid="DashButton_ProfileIcon_Link"])', {
    context: $searchInput.closest('header'),
    name: 'back button',
    stopIf: pageIsNot(page),
  })
  if (!$backButton) return

  // The back button appears after the search input is focused. When you tap it
  // or go back manually, it's replaced with the slide-out menu button and the
  // Explore page contents are shown - we want to skip that.
  pageObservers.push(
    observeElement($backButton.parentElement, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((/** @type {HTMLElement} */ $el) => {
          if ($el.querySelector('[data-testid="DashButton_ProfileIcon_Link"]')) {
            log('slide-out menu button appeared, going back to skip Explore page')
            history.go(-2)
          }
        })
      })
    })
  )
}

async function tweakIndividualTweetPage() {
  if (mobile && config.hideAppNags) {
    hideOpenAppButton(currentPage)
  }

  if (config.hideMoreTweets) {
    let searchParams = new URLSearchParams(location.search)
    if (searchParams.has('ref_src') || searchParams.has('s')) {
      hideMoreTweetsSection(currentPath)
    }
  }
}

async function tweakQuoteTweetsPage() {
  if (desktop) {
    // Show the quoted tweet once in the pinned header instead
    let [$heading, $quotedTweet] = await Promise.all([
      getElement(`${Selectors.PRIMARY_COLUMN} ${Selectors.TIMELINE_HEADING}`, {
        name: 'Quote Tweets heading',
        stopIf: not(isOnQuoteTweetsPage)
      }),
      getElement('[data-testid="tweet"] [aria-labelledby] > div:last-child', {
        name: 'first quoted tweet',
        stopIf: not(isOnQuoteTweetsPage)
      })
    ])

    if ($heading != null && $quotedTweet != null) {
      log('displaying quoted tweet in the Quote Tweets header')
      do {
        $heading = $heading.parentElement
      } while (!$heading.nextElementSibling)

      let $clone = /** @type {HTMLElement} */ ($quotedTweet.cloneNode(true))
      $clone.style.margin = '0 16px 9px 16px'
      $heading.insertAdjacentElement('afterend', $clone)
    }
  }
}
//#endregion

//#region Main
function main() {
  log({lang, platform: mobile ? 'mobile' : 'desktop', config})
  configureSeparatedTweetsTimeline()
  addStaticCss()
  observeFontSize()
  observeBackgroundColor()
  observeColor()
  observePopups()
  observeTitle()
}

if (typeof chrome != 'undefined' && typeof chrome.storage != 'undefined') {
  chrome.storage.local.get((storedConfig) => {
    Object.assign(config, storedConfig)
    main()
  })
}
else {
  main()
}
//#endregion
