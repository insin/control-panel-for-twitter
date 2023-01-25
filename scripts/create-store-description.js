// Usage: npm run create-store-description -- ja
const fs = require('fs')

let localeCode = process.argv[2]
let locale = JSON.parse(fs.readFileSync(`./_locales/${localeCode}/messages.json`, {encoding: 'utf8'}))
let messages = Object.fromEntries(Object.entries(locale).map(([prop, value]) => ([prop, value.message])))

with (messages) {
  console.log(`
${reduceAlgorithmicContentOptionsLabel}

– ${alwaysUseLatestTweetsLabel}
– ${hideForYouTimelineLabel}
– ${hideWhoToFollowEtcLabel}
– ${hideSidebarContentLabel}
– ${hideMoreTweetsLabel}
– ${hideExplorePageContentsLabel}

${sharedTweetsOptionsLabel}

– ${retweetsLabel}
  – ${option_separate}
– ${hideUnavailableQuoteTweetsLabel}
– ${mutableQuoteTweetsLabel}
  – ${mutableQuoteTweetsInfo}

${uiTweaksOptionsLabel}

– ${hideViewsLabel}
– ${dontUseChirpFontLabel}
– ${twitterBlueChecksLabel}
  – ${twitterBlueChecksOption_replace}
– ${hideVerifiedNotificationsTabLabel}
– ${uninvertFollowButtonsLabel}
  – ${followButtonStyleOption_monochrome}
  – ${followButtonStyleOption_themed}
– ${navBaseFontSizeLabel}
– ${dropdownMenuFontWeightLabel}
– ${fastBlockLabel}
– ${addAddMutedWordMenuItemLabel_desktop}
– ${tweakQuoteTweetsPageLabel}

${hideUnusedUiItemsOptionsLabel}

– ${hideMetricsLabel}
– ${hideShareTweetButtonLabel}
– ${hideAccountSwitcherLabel}
– ${hideMessagesDrawerLabel}
– ${hideMoreSlideOutMenuItemsOptionsLabel_desktop}

${experimentsOptionsLabel}

– ${reducedInteractionModeLabel}
  – ${reducedInteractionModeInfo}
– ${fullWidthContentLabel}
  – ${fullWidthContentInfo}
– ${verifiedAccountsLabel}
  – ${verifiedAccountsInfo}
– ${disableHomeTimelineLabel}
  – ${disableHomeTimelineInfo}
  `)
}
