// ==UserScript==
// @name        Tweak New Twitter
// @description Reduce "engagement" and tone down some of New Twitter's UI
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @version     9
// ==/UserScript==

//#region Config & variables
/**
 * Default config enables all features.
 *
 * You'll need to edit the config object manually for now if you're using this
 * as a user script.
 */
let config = {
  alwaysUseLatestTweets: true,
  hideBookmarksNav: true,
  hideExploreNav: true,
  hideListsNav: true,
  hideSidebarContent: true,
  navBaseFontSize: true,
  /** @type {'separate'|'hide'|'ignore'} */
  retweets: 'separate',
}

config.enableDebugLogging = false

const HOME = 'Home'
const LATEST_TWEETS = 'Latest Tweets'
const MESSAGES = 'Messages'
const RETWEETS = 'Retweets'

let Selectors = {
  PRIMARY_COLUMN: 'div[data-testid="primaryColumn"]',
  PRIMARY_NAV: 'nav[aria-label="Primary"]',
  SIDEBAR_COLUMN: 'div[data-testid="sidebarColumn"]',
  TWEET: 'div[data-testid="tweet"]',
}

Object.assign(Selectors, {
  SIDEBAR_FOOTER: `${Selectors.SIDEBAR_COLUMN} nav`,
  SIDEBAR_PEOPLE: `${Selectors.SIDEBAR_COLUMN} aside`,
  SIDEBAR_TRENDS: `${Selectors.SIDEBAR_COLUMN} section`,
  TIMELINE: `${Selectors.PRIMARY_COLUMN} section > h1 + div[aria-label] > div > div`,
})

/** Title of the current page, without the ' / Twitter' suffix */
let currentPage = ''

/** MutationObservers active on the current page */
let pageObservers = []
//#endregion

//#region Utility functions
function addStyle(css) {
  let $style = document.createElement('style')
  $style.dataset.insertedBy = 'tweak-new-twitter'
  $style.textContent = css
  document.head.appendChild($style)
  return $style
}

/**
 * @returns {Promise<HTMLElement>}
 */
function getElement(selector, {
  name = null,
  stopIf = null,
  target = document,
  timeout = Infinity,
} = {}) {
  return new Promise((resolve) => {
    let rafId
    let timeoutId

    function stop($element, reason) {
      if ($element == null) {
        log(`stopped waiting for ${name || selector} after ${reason}`)
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
      let $element = target.querySelector(selector)
      if ($element) {
        stop($element)
      }
      else if (stopIf != null && stopIf() === true) {
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
  if (config.enableDebugLogging) {
    console.log(`TWT${currentPage ? `(${currentPage})` : ''}`, ...args)
  }
}

function observeElement($element, listener, options = {childList: true}) {
  listener([])
  let observer = new MutationObserver(listener)
  observer.observe($element, options)
  return observer
}

function pageIsNot(page) {
  return () => page != currentPage
}

function s(n) {
  return n == 1 ? '' : 's'
}

//#endregion

//#region Global observers

function observeHtmlFontSize() {
  let $html = document.querySelector('html')
  let $style = addStyle('')
  let lastFontSize = ''

  log('observing html style attribute for font-size changes')
  let observer = observeElement($html, () => {
    if ($html.style.fontSize != lastFontSize) {
      lastFontSize = $html.style.fontSize
      log(`setting nav font size to ${lastFontSize}`)
      $style.textContent = [
        `${Selectors.PRIMARY_NAV} div[dir="auto"] span { font-size: ${lastFontSize}; font-weight: normal; }`,
        `${Selectors.PRIMARY_NAV} div[dir="auto"] { margin-top: -4px; }`
      ].join('\n')
    }
  }, {
    attributes: true,
    attributeFilter: ['style']
  })

  return {
    disconnect() {
      $style.remove()
      observer.disconnect()
    }
  }
}

let updateThemeColor = (function() {
  let $style = addStyle('')
  let lastThemeColor = null

  return async function updateThemeColor() {
    // Only try to update if the "Customize your view" dialog os open or we
    // haven't set an inital color yet.
    if (location.pathname !== '/i/display' && lastThemeColor != null) {
      return
    }

    let $tweetButton = await getElement('a[data-testid="SideNav_NewTweet_Button"]', {
      name: 'Tweet button'
    })

    let themeColor = getComputedStyle($tweetButton).backgroundColor
    if (themeColor === lastThemeColor) {
      return
    }
    log(`setting theme color to ${themeColor}`)
    lastThemeColor = themeColor
    $style.textContent = [
                           'body.Home main h2:not(#twt_retweets)',
                           'body.LatestTweets main h2:not(#twt_retweets)',
                           'body.Retweets #twt_retweets',
                         ].join(', ') + ` { color: ${lastThemeColor}; }`
  }
})()

async function observeTitle() {
  let $title = await getElement('title', {name: '<title>'})
  log('observing <title>')
  return observeElement($title, () => onTitleChange($title.textContent), {
    childList: true,
  })
}
//#endregion

//#region Page observers
async function observeSidebarAppearance(page) {
  let $primaryColumn = await getElement(Selectors.PRIMARY_COLUMN, {
    name: 'primary column',
    stopIf: pageIsNot(page),
  })
  log('observing responsive sidebar')
  pageObservers.push(
    observeElement($primaryColumn.parentNode, (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((el) => {
          if (el.dataset.testid == 'sidebarColumn') {
            log('sidebar appeared')
            hideSidebarContents(page)
          }
        })
      })
    })
  )
}

async function observeTimeline(page) {
  let $timeline = await getElement(Selectors.TIMELINE, {
    name: 'timeline',
    stopIf: pageIsNot(page),
  })
  if ($timeline == null) {
    return
  }
  log('observing timeline')
  pageObservers.push(
    observeElement($timeline, () => onTimelineChange($timeline, page))
  )
}
//#endregion

//#region Tweak functions
async function addRetweetsHeader(page) {
  let $timelineTitle = await getElement('main h2', {
    name: 'timeline title',
    stopIf: pageIsNot(page),
  })
  if ($timelineTitle != null &&
      document.querySelector('#twt_retweets') == null) {
    log('inserting Retweets header')
    let div = document.createElement('div')
    div.innerHTML = $timelineTitle.parentElement.outerHTML
    let $retweets = div.firstElementChild
    $retweets.querySelector('h2').id = 'twt_retweets'
    $retweets.querySelector('span').textContent = RETWEETS
    // This script assumes navigation has occurred when the document title changes,
    // so by changing the title to "Retweets" we effectively fakenavigation to a
    // non-existent Retweets page.
    $retweets.addEventListener('click', () => {
      if (!document.title.startsWith(RETWEETS)) {
        document.title = `${RETWEETS} / Twitter`
      }
      window.scrollTo({top: 0})
    })
    $timelineTitle.parentElement.parentElement.insertAdjacentElement('afterend', $retweets)
    $timelineTitle.parentElement.addEventListener('click', () => {
      if (!document.title.startsWith(page)) {
        document.title = `${page} / Twitter`
      }
    })
  }
}

function addStaticCss() {
  var cssRules = []
  var hideCssSelectors = []
  if (config.hideSidebarContent) {
    hideCssSelectors.push(
      Selectors.SIDEBAR_TRENDS,
      Selectors.SIDEBAR_PEOPLE,
      Selectors.SIDEBAR_FOOTER
    )
  }
  if (config.hideExploreNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href="/explore"]`)
  }
  if (config.hideBookmarksNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href="/i/bookmarks"]`)
  }
  if (config.hideListsNav) {
    hideCssSelectors.push(`${Selectors.PRIMARY_NAV} a[href*="/lists"]`)
  }
  if (hideCssSelectors.length > 0) {
    cssRules.push(`${hideCssSelectors.join(', ')} { display: none !important; }`)
  }
  if (cssRules.length > 0) {
    addStyle(cssRules.join('\n'))
  }
}

async function hideSidebarContents(page) {
  let trends = getElement(Selectors.SIDEBAR_TRENDS, {
    name: 'sidebar trends',
    stopIf: pageIsNot(page),
    timeout: 4000,
  }).then(($trends) => {
    if ($trends == null) {
      return false
    }
    let $trendsModule = $trends.parentElement.parentElement.parentElement
    $trendsModule.style.display = 'none'
    // Hide surrounding elements which draw separators between modules
    if ($trendsModule.previousElementSibling &&
        $trendsModule.previousElementSibling.childElementCount == 0) {
      (/** @type {HTMLElement} */ $trendsModule.previousElementSibling).style.display = 'none'
    }
    if ($trendsModule.nextElementSibling &&
        $trendsModule.nextElementSibling.childElementCount == 0) {
      (/** @type {HTMLElement} */ $trendsModule.nextElementSibling).style.display = 'none'
    }
    return true
  })

  let people = getElement(Selectors.SIDEBAR_PEOPLE, {
    name: 'sidebar people',
    stopIf: pageIsNot(page),
    timeout: 4000,
  }).then(($people) => {
    if ($people == null) {
      return false
    }
    let $peopleModule
    if ($people.getAttribute('aria-label') == 'Relevant people') {
      // "Relevant people" section when viewing a Tweet/thread
      $peopleModule = $people.parentElement
    }
    else {
      // "Who to follow" section
      $peopleModule = $people.parentElement
    }
    $peopleModule.style.display = 'none'
    return true
  })

  let [hidTrends, hidPeople] = await Promise.all([trends, people])
  log(hidTrends == true && hidPeople == true
    ? 'hid all sidebar content'
    : 'stopped waiting for sidebar content')
}

function onTitleChange(title) {
  // Ignore Flash of Uninitialised Title when navigating to a screen for the
  // first time.
  if (title == 'Twitter') {
    log('ignoring Flash of Uninitialised Title')
    return
  }

  // Only allow the same page to re-process if the "Customize your view" dialog
  // is currently open.
  let newPage = title.split(' / ')[0]
  if (newPage == currentPage && location.pathname != '/i/display') {
    log('ignoring duplicate title change')
    return
  }

  // Assumption: all non-FOUT, non-duplicate title changes are navigation, which
  // needs the screen to be re-processed.

  if (pageObservers.length > 0) {
    log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
    pageObservers.forEach(observer => observer.disconnect())
    pageObservers = []
  }

  currentPage = newPage

  log('processing new page')

  if (config.alwaysUseLatestTweets && currentPage == HOME) {
    return switchToLatestTweets(currentPage)
  }

  if (config.retweets == 'separate') {
    document.body.classList.toggle(HOME, currentPage == HOME)
    document.body.classList.toggle('LatestTweets', currentPage == LATEST_TWEETS)
    document.body.classList.toggle(RETWEETS, currentPage == RETWEETS)
    updateThemeColor()
  }

  if (config.retweets == 'separate' && (currentPage == LATEST_TWEETS || currentPage == HOME)) {
    addRetweetsHeader(currentPage)
  }

  if (config.retweets != 'ignore' && (currentPage == LATEST_TWEETS || currentPage == RETWEETS || currentPage == HOME)) {
    observeTimeline(currentPage)
  }

  if (config.hideSidebarContent && currentPage != MESSAGES) {
    hideSidebarContents(currentPage)
    observeSidebarAppearance(currentPage)
  }
}

function getTweetType($tweet) {
  if ($tweet.lastElementChild.children.length > 2 &&
      $tweet.lastElementChild.children[2].textContent.includes('Promoted')) {
    return 'PROMOTED'
  }
  if ($tweet.previousElementSibling != null &&
      $tweet.previousElementSibling.textContent.includes('Retweeted')) {
    return 'RETWEET'
  }
  return 'TWEET'
}

function shouldHideTimelineItem(itemType, page) {
  return itemType == 'PROMOTED' || page == RETWEETS ? itemType != 'RETWEET' : itemType != 'TWEET'
}

function onTimelineChange($timeline, page) {
  log(`processing ${$timeline.children.length} timeline item${s($timeline.children.length)}`)
  let previousItemType = null
  for (let $item of $timeline.children) {
    let hideItem = null
    let $tweet = $item.querySelector(Selectors.TWEET)
    if ($tweet != null) {
      previousItemType = getTweetType($tweet)
      hideItem = shouldHideTimelineItem(previousItemType, page)
    }
    else {
      // Assume a non-tweet node following a tweet node is related to the previous tweet
      // "Show this thread" links sometimes appear in the subsequent timeline node as an <a>
      if (previousItemType != null) {
        hideItem = shouldHideTimelineItem(previousItemType, page)
      }
      // The first item in the timeline is sometimes an empty placeholder <div>
      else if ($item !== $timeline.firstElementChild) {
        log('unhandled timeline item', $item)
      }
      previousItemType = null
    }

    if (hideItem != null) {
      (/** @type {HTMLElement} */ $item.firstElementChild).style.display = hideItem ? 'none' : ''
    }
  }
}

async function switchToLatestTweets(page) {
  let $switchButton = await getElement('div[aria-label="Top Tweets on"]', {
    name: 'timeline switch button',
    stopIf: pageIsNot(page),
  })

  if ($switchButton == null) {
    return false
  }

  $switchButton.click()

  let $seeLatestTweetsInstead = await getElement('div[role="menu"] div[role="button"]', {
    name: '"See latest Tweets instead" menu item',
    stopIf: pageIsNot(page),
  })

  if ($seeLatestTweetsInstead == null) {
    return false
  }

  $seeLatestTweetsInstead.closest('div[tabindex="0"]').click()
  return true
}

//#region Main
async function main() {
  log('config', config)

  let htmlFontSizeObserver
  let titleObserver

  addStaticCss()

  if (config.navBaseFontSize) {
    htmlFontSizeObserver = observeHtmlFontSize()
  }

  if (config.retweets != 'ignore' || config.hideSidebarContent) {
    titleObserver = await observeTitle()
  }
}

chrome.storage.local.get((storedConfig) => {
  Object.assign(config, storedConfig)
  main()
})
//#endregion