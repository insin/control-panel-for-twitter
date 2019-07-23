// ==UserScript==
// @name        Tweak New Twitter
// @description Hide retweets, and other UI tweaks for New Twitter
// @namespace   https://github.com/insin/tweak-new-twitter/
// @match       https://twitter.com/*
// @version     1
// ==/UserScript==

const HOME = 'Home'
const LATEST_TWEETS = 'Latest Tweets'

let config = {}

let currentPage = 'Initialising'

/** MutationObservers active on the current page */
let pageObservers = []

function log(message) {
  if (config.enableDebugLogging) {
    console.log(`[${currentPage}] ${message}`)
  }
}

function s(n) {
  return n == 1 ? '' : 's'
}

let $style = document.createElement('style')
$style.dataset.insertedBy = 'tweak-new-twitter'
$style.innerText = `
/* Trends */
div[data-testid="sidebarColumn"] section ,
/* Who to follow */
div[data-testid="sidebarColumn"] aside,
/* Footery stuff in the side bar because infinite scroll */
div[data-testid="sidebarColumn"] nav {
  display: none !important;
}`
document.head.appendChild($style)

function observeTitle() {
  let $title = document.querySelector('title')

  if ($title == null) {
    log('waiting for title')
    return setTimeout(observeTitle, 1000 / 60 * 3)
  }

  function processPage(title) {
    // Ignore Flash of Uninitialised Title
    if (title == 'Twitter') {
      return
    }

    // Assumption: all non-FOUT page title changes are navigation

    if (pageObservers.length > 0) {
      log(`disconnecting ${pageObservers.length} page observer${s(pageObservers.length)}`)
      pageObservers.forEach(observer => observer.disconnect())
      pageObservers = []
    }

    currentPage = title.split(' / ')[0]

    log('navigation occurred')

    if (currentPage == HOME || currentPage == LATEST_TWEETS) {
      if (!config.showRetweets) {
        observeTimeline(currentPage)
      }
    }
    if (!config.showSidebarContent) {
       hideSidebarContents(currentPage)
    }
  }

  // Watch for page navigation
  processPage($title.textContent)
  log('observing <title>')
  new MutationObserver((mutations) => {
    processPage($title.textContent)
  }).observe($title, {
    characterData: true,
    childList: true,
  })
}

function observeTimeline(page) {
  var $timeline = document.querySelector('div[aria-label^="Timeline"]')
  var $firstTweet = document.querySelector('div[data-testid="tweet"]')

  if ($timeline == null ||
      $timeline.firstElementChild == null ||
      $timeline.firstElementChild.firstElementChild == null ||
      $firstTweet == null) {
    if (currentPage != page) {
      return log('stopped waiting for ${page} timeline')
    }
    return setTimeout(observeTimeline, 1000 / 60 * 5, page)
  }

  function processTweets() {
    let tweets = document.querySelectorAll('div[data-testid="tweet"]')
    log(`processing ${tweets.length} tweet${s(tweets.length)}`)
    for (let $tweet of tweets) {
      let isRetweet = $tweet.previousElementSibling &&
                      $tweet.previousElementSibling.textContent.includes('Retweeted')
      if (isRetweet) {
        $tweet.parentNode.parentNode.parentNode.style.display = 'none';
      }
    }
  }

  // Watch for new tweets being rendered
  log('observing timeline')
  processTweets()
  let $tweetContainer = $timeline.firstElementChild.firstElementChild
  let observer = new MutationObserver(processTweets)
  observer.observe($tweetContainer, {
    childList: true
  })
  pageObservers.push(observer)
}

// TODO Wait for responsive breakpoint first if necessary
function hideSidebarContents(page, attempts = 1) {
  let $trending = document.querySelector('div[data-testid="sidebarColumn"] section')
  if ($trending) {
    $trending.parentNode.parentNode.parentNode.style.display = 'none'
  }
  let $whoToFollow = document.querySelector('div[data-testid="sidebarColumn"] aside')
  if ($whoToFollow) {
     $whoToFollow.parentNode.parentNode.style.display = 'none'
  }

  if ($trending == null || $whoToFollow == null) {
    if (currentPage != page) {
      return log(`stopped waiting for ${page} sidebar`)
    }
    if (attempts == 10) {
      return log(`stopped waiting for sidebar content to hide after ${attempts} attempts`)
    }
    return setTimeout(hideSidebarContents, 333, page, attempts + 1)
  }

  log('hid all sidebar content')
}

chrome.storage.local.get((storedConfig) => {
  config = storedConfig
  if (config.showRetweets && config.showSidebarContent) {
    return log('nothing to do!')
  }
  observeTitle()
})
