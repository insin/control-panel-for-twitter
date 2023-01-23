# Tweak New Twitter

![](icons/icon128.png)

**Tweak New Twitter is a browser extension which removes algorithmic content from Twitter, hides news and trends, lets you control which shared tweets appear on your timeline, and adds other UI improvements**

## Install

* [Install Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/tweak-new-twitter/)
* [Install Chrome Extension](https://chrome.google.com/webstore/detail/tweak-new-twitter/kpmjjdhbcfebfjgdnpjagcndoelnidfj) – can also be installed in Edge, Opera, and Brave
* [Install Edge Add-on](https://microsoftedge.microsoft.com/addons/detail/tweak-new-twitter/foccddlibbeccjiobcnakipdpkjiijjp) - any recent changes to the extension usually take longer to appear in the Edge Add-ons store
* [Install as a user script](https://greasyfork.org/en/scripts/387773-tweak-new-twitter) (requires a [user script manager](https://greasyfork.org/en#home-step-1)) – compatible with the [Userscripts extension for Safari](https://apps.apple.com/us/app/userscripts/id1463298887)

### Install on Firefox Nightly for Android

As of v2.0, Tweak New Twitter supports the mobile version of Twitter and is tested on Firefox for Android, but Mozilla Add-ons currently only lets you install a [small, curated list of extensions on Android](https://addons.mozilla.org/en-US/android/).

For now, to use Tweak New Twitter on your Android device:

- Install [Firefox for Android Nightly](https://play.google.com/store/apps/details?id=org.mozilla.fenix)
- [Follow these instructions](https://blog.mozilla.org/addons/2020/09/29/expanded-extension-support-in-firefox-for-android-nightly/) to enable Custom Add-on collections:
  - TL;DR: Settings → About Firefox Nightly → Tap on the Firefox logo 5 times
- In the "Custom Add-on collection" setting which is now available, enter the following details and tap "OK":
  - 13844640
  - Android-Collection

![Screenshot of what the custom collection to intsall Tweak New Twitter on Firefox for Android Nightly should look like when correctly configured](screenshots/install_custom_collection.png)

<details>
  <summary>
  You'll now be able to install Tweak New Twitter via the Add-ons page.
  </summary>
  <img src="https://raw.githubusercontent.com/insin/tweak-new-twitter/master/screenshots/install_addons.png" alt="Screenshot of the Add-ons page in Firefox Nightly for Android setting up the Custom Add-on collection with the details above" style="max-width:100%;">
</details>

If you open [mobile.twitter.com](https://mobile.twitter.com) and use the "Install" option in Firefox Nightly's main menu, you'll have a configurable (via Firefox Nightly's Add-ons settings), user-respectful Twitter app on your phone.

## Features

### Remove algorithmic content

- Keeps you on the Following (chronological) timeline, automatically switching you back if Twitter tries to move you to the "For you" (algorithmic) timeline
- Hide the "For you" timeline tab
- Hide "Who to follow", "Follow some Topics" etc. in the timeline
- Hide "What's happening", "Topics to follow" etc. in the sidebar
- Hide "Discover more" algorithmic tweets when viewing an individual tweet
- Hide algorithmic tweets based on likes, replies, communities, and suggested topics in the "For you" timeline, if you use it
- Hide Explore page contents and use it only for searching

### Control which tweets shared by people you follow appear on your timeline

- Move Retweets to a separate tab (default setting), or hide them entirely
- Move Quote Tweets and replies to them to a separate tab, or hide them entirely (off by default)
- Hide tweets quoting accounts you've blocked or muted
- Mute quoting of specific tweets - adds a "Mute this conversation" menu item to Quote Tweets in the timeline

### UI improvements

- Hide view metrics/analytics links under tweets
- Disable use of the Chirp font if you don't like it
- Replace (default setting) or hide Twitter Blue user checkmarks so they're not as easily mistaken for verified accounts
- Hide the "Verified" tab on the Notifications page
- Uninvert the Follow and Following buttons to make them less jarring
  - Choice of monochrome or themed (classic) styling for uninverted buttons
- Use the site's normal text font style in the primary navigation menu on desktop to make it less distracting
- Use normal font weight in dropdown menus
- Fast blocking - skips the confirm dialog when you try to block an account
- Add a new item to the "More" menu (desktop) or slide-out menu (mobile) which takes you straight to the "Add muted word" page
- When viewing a tweet's Quote Tweets, hide the quoted tweet to make more room for quotes
- Hide "Open app", "Switch to the app" etc. nags on mobile

### Hide UI items you don't use

- Hide any metrics you don't want to see
- Hide navigation items you don't use on desktop, and other distracting screen elements such as the account switcher and Messages drawer
- Hide the bottom nav item for Messages on mobile if you don't use it
- Hide items you don't use in the "More" menu (desktop) or slide-out menu (mobile)

### Experiments

Optional features you can try, to see how they change how you perceive and use Twitter:

- Reduced interaction mode: hide the action bar under tweets – replies are now the only means of interacting
- Full-width timeline content: hide the sidebar and let timeline content go full-width
- Verified accounts: highlight tweets by – or interacting with – verified accounts, or hide them to simulate the aftermath of the [July 2020 Twitter hacks](https://en.wikipedia.org/wiki/2020_Twitter_account_hijacking)
- Disable the home timeline: find yourself [wasting too much time on Twitter](https://world.hey.com/brecht/free-range-tweet-farming-9399f6e5)? Try preventing use of the home timeline, going to Notifications or Messages by default instead

## Screenshots

### Home timeline with all tweaks enabled

| Desktop | Mobile |
| - | - |
| ![Screenshot of a desktop Twitter home timeline without Retweets, algorithmic timeline content, or sidebar content, with fewer navigation items and a less distracting navigation font style](screenshots/timeline.png) | ![Screenshot of a mobile Twitter home timeline without Retweets, algorithmic timeline content](screenshots/firefox_android_timeline.jpg) |

### Separate timeline for Retweets (default setting) and/or Quote Tweets

| Desktop | Mobile |
| - | - |
| ![Screenshot of the separate timeline Tweak New Twitter adds to desktop Twitter, configured to separate Retweets from the rest of the home timeline](screenshots/shared_tweets.png) | ![Screenshot of the separate timeline Tweak New Twitter adds to mobile Twitter, configured to separate Retweets from the rest of the home timeline](screenshots/firefox_android_shared_tweets.jpg) |

### Tidied-up menu, with instant access to "Add muted word"

| Desktop - "More" menu | Mobile - slide-out menu |
| - | - |
| ![Screenshot of the "More" menu on desktop Twitter, with most of the menu items removed and a new "Add muted word" menu item](screenshots/more_menu.png) | ![Screenshot of the slide-out menu on mobile Twitter, with most of the menu items removed and a new "Add muted word" menu item](screenshots/firefox_android_menu.jpg) |

### Hide metrics

| Desktop | Mobile |
| - | - |
| ![Scteenshot of a Twitter timeline with blank spaces where numbers for metrics should be](screenshots/hide_metrics.png) | ![Sceenshot of a mobile Twitter timeline with blank spaces where numbers for metrics should be](screenshots/firefox_android_hide_metrics.jpg) |

### Uninverted Follow buttons

| Followers page with uninverted buttons |
| - |
| ![A Twitter Followers page with white Follow buttons and black Following buttons](screenshots/uninverted_follow_buttons.png) |

| Monochrome | Themed |
| - | - |
| ![Uninverted Follow / Following buttons using the new monochrome Twitter style](screenshots/uninverted_follow_buttons_monochrome.png) | ![Uninverted Follow / Following buttons using the classic themed Twitter style](screenshots/uninverted_follow_buttons_themed.png) |

### Disable use of Chirp font

| Chirp on | Chirp off |
| - | - |
| ![A Twitter thread using the Chirp font](screenshots/chirp_on.png) | ![The same Twitter thread using the fallback system fonts](screenshots/chirp_off.png) |

### Improved Quote Tweets page

The quoted tweet is hidden, instead of being duplicated under every quote, leaving more room for quotes

| Desktop | Mobile |
| - | - |
| ![Screenshot of the improvements Tweak New Twitter makes to Quote Tweet pages on desktop, showing quote content only instead of repeating the quoted tweet in every tweet](screenshots/quote_tweets.png) | ![Screenshot of the improvements Tweak New Twitter makes to Quote Tweet pages on mobile, showing quote content only instead of repeating the quoted tweet in every tweet](screenshots/firefox_android_quote_tweets.jpg) |

### Experimental features

| Reduced interaction mode | Highlight (or hide) verified accounts | Disable the home timeline |
| - | - | - |
| ![Screenshot of a Twitter timeline with the action bar below each tweet completely missing](screenshots/reduced_interaction_mode.png) | ![Screenshot of a Twitter timeline with a tweet by a user with a verified badge highlighted](screenshots/highlight_verified_accounts.png) | ![Screenshot of Twitter without the Home navigation item](screenshots/disable_home_timeline.png) |

| Full-width timeline |
| - |
| ![Screenshot of a Twitter timeline which takes up all the available width in the layout](screenshots/full_width_timeline.png) |

### Configurable via options popup and the extension options page

| Desktop | Mobile |
| - | - |
| ![Screenshot of the options popup in Firefox on desktop](screenshots/firefox_options_popup.png) | ![Screenshot of the options popup in Firefox Nightly for Android on mobile](screenshots/firefox_android_options_popup.jpg) |

### Other mobile features

| No trends on Explore screen, just search | No "Open app" nag in tweet header |
| - | - |
| ![Screenshot of the Explore screen in mobile Twitter, with only the search part of the screen visible](screenshots/firefox_android_explore.jpg) | ![Screenshot an individual tweet in mobile Twitter, without the usual "Open app" buttoin in the header, and without the usual Messages navigation item in the bottom navigation bar](screenshots/firefox_android_tweet.jpg) |

### Language support

As of v2.2, all 48 of the display languages available on Twitter are supported, some examples:

| Gaeilge (Irish) | 日本語 (Japanese) | العربية (Arabic) |
| - | - | - |
| ![Screenshot of a desktop Twitter home timeline using Tweak New Twitter, as Gaeilge](screenshots/irish.png) | ![Screenshot of a desktop Twitter home timeline using Tweak New Twitter, in Japanese](screenshots/japanese.png) | ![Screenshot of a desktop Twitter home timeline using Tweak New Twitter, in Arabic](screenshots/arabic.png) |

Options are also available in the following languages:

- Japanese (translation by [@MitoKurato](https://github.com/MitoKurato))

### User script support

 [Tweak New Twitter is also available as a user script](https://greasyfork.org/en/scripts/387773-tweak-new-twitter) – to change the default options, you'll need to edit the `config` object at the top of the script.

| Tweak New Twitter on Safari using the [Userscripts extension](https://apps.apple.com/us/app/userscripts/id1463298887) |
| - |
| ![Screenshot of Tweak New Twitter running on the Userscripts extension for Safari](screenshots/safari.png) |

## Attribution

Icon adapted from "Twitter free icon" by [Icomoon](https://icomoon.io/) from [www.flaticon.com](https://www.flaticon.com/), [CC 3.0 BY](https://creativecommons.org/licenses/by/3.0/)
