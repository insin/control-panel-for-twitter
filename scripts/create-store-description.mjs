import fs from 'node:fs'

import clipboard from 'clipboardy'

let extraTranslations = {
  "desktopVersion": {
    "en": " (desktop version)",
    "es": " (versión de escritorio)",
    "fr": " (version de bureau)",
    "it": " (versione desktop)",
    "ja": "（デスクトップ版）",
    "ko": " (데스크톱 버전)",
    "zh_CN": "（桌面版）"
  },
  "mobileVersion": {
    "en": " (mobile version)",
    "es": " (versión móvil)",
    "fr": " (version mobile)",
    "it": " (versione mobile)",
    "ja": "（モバイル版）",
    "ko": " (모바일 버전)",
    "zh_CN": "（手机版）"
  }
}

let localeCode = process.argv[2]

if (!localeCode) {
  console.log(`
Usage:
  npm run create-store-description ja
  npm run create-store-description ja html
`.trim())
  process.exit(1)
}

let locale = JSON.parse(fs.readFileSync(`./_locales/${localeCode}/messages.json`, {encoding: 'utf8'}))
let messages = Object.fromEntries(Object.entries(locale).map(([prop, value]) => ([prop, value.message])))
// Add extra translations
Object.assign(messages, Object.fromEntries(Object.entries(extraTranslations).map(([prop, value]) => [prop, value[localeCode]])))

let storeDescription = `
${messages.features}

${messages.homeTimelineOptionsLabel}:

• ${messages.alwaysUseLatestTweetsLabel}
• ${messages.hideForYouTimelineLabel}
• ${messages.sortFollowingLabel} (${messages.option_recent} / ${messages.option_popular})
• ${messages.retweetsLabel} (${messages.option_separate} / ${messages.option_hide})
• ${messages.quoteTweetsLabel} (${messages.option_separate} / ${messages.option_hide})
• ${messages.mutableQuoteTweetsLabel}
• ${messages.hideSeeNewTweetsLabel}
• ${messages.hideWhoToFollowEtcLabel}
• ${messages.hideInlinePrompts}
• ${messages.fullWidthContentLabel}${messages.desktopVersion} - ${messages.fullWidthContentInfo}

${messages.uiImprovementsOptionsLabel}:

• ${messages.preventNextVideoAutoplayLabel}${messages.mobileVersion}
• ${messages.addAddMutedWordMenuItemLabel_desktop}
• ${messages.fastBlockLabel}
• ${messages.hideUnavailableQuoteTweetsLabel}
• ${messages.hideProfileRetweetsLabel}
• ${messages.hideNotificationLikesLabel}
• ${messages.hideNotificationRetweetsLabel}
• ${messages.listRetweetsLabel}
• ${messages.defaultToLatestSearchLabel}
• ${messages.tweakQuoteTweetsPageLabel}

${messages.xFixesLabel}:

• ${messages.redirectToTwitterLabel}
• ${messages.redirectChatNavLabel}
• ${messages.replaceLogoLabel}
• ${messages.hideViewsLabel}
• ${messages.hideVerifiedNotificationsTabLabel}
• ${messages.restoreTweetSourceLabel}
• ${messages.addFocusedTweetAccountLocationLabel}
• ${messages.addUserHoverCardAccountLocationLabel}${messages.desktopVersion}
• ${messages.restoreLinkHeadlinesLabel}
• ${messages.restoreQuoteTweetsLinkLabel}
• ${messages.restoreOtherInteractionLinksLabel}
• ${messages.sortRepliesLabel} (${messages.option_recent} / ${messages.option_liked})
• ${messages.hideSortRepliesMenuLabel}
• ${messages.twitterBlueChecksLabel} (${messages.twitterBlueChecksOption_replace} / ${messages.option_hide})
• ${messages.hideTwitterBlueRepliesLabel}
• ${messages.hideTwitterBlueUpsellsLabel}
• ${messages.hideGrokLabel}
• ${messages.hideGrokTweetsLabel}
• ${messages.hideEditImageLabel}
• ${messages.hideJobsLabel}
• ${messages.hideSubscriptionsLabel}

${messages.uiTweaksOptionsLabel}:

• ${messages.dontUseChirpFontLabel}
• ${messages.disableTweetTextFormattingLabel}
• ${messages.navBaseFontSizeLabel}${messages.desktopVersion}
• ${messages.navDensityLabel}${messages.desktopVersion} (${messages.option_comfortable} / ${messages.option_compact})
• ${messages.dropdownMenuFontWeightLabel}
• ${messages.uninvertFollowButtonsLabel} (${messages.followButtonStyleOption_monochrome} / ${messages.followButtonStyleOption_themed})
• ${messages.bypassAgeVerificationLabel}
• ${messages.unblurSensitiveContentLabel}

${messages.reduceAlgorithmicContentOptionsLabel}:

• ${messages.hideSidebarContentLabel}${messages.desktopVersion}
• ${messages.hideExplorePageContentsLabel}
• ${messages.hideDiscoverSuggestionsLabel}

${messages.reduceEngagementOptionsLabel}:

• ${messages.hideMetricsLabel}
• ${messages.reducedInteractionModeLabel} - ${messages.reducedInteractionModeInfo}
• ${messages.hideComposeTweetLabel}
• ${messages.disableHomeTimelineLabel} - ${messages.disableHomeTimelineInfo}
• ${messages.notificationsLabel} (${messages.option_badges} / ${messages.option_hide})

${messages.hideUnusedUiItemsOptionsLabel}:

• ${messages.hideBookmarkButtonLabel}
• ${messages.hideShareTweetButtonLabel}
• ${messages.hideViewActivityLinksLabel}
• ${messages.hideTimelineTweetBoxLabel}${messages.desktopVersion}
• ${messages.hideAccountSwitcherLabel}${messages.desktopVersion}
• ${messages.hideMessagesDrawerLabel}${messages.desktopVersion}
• ${messages.hideExploreNavLabel}${messages.desktopVersion}
• ${messages.hideCreatorStudioNavLabel}
• ${messages.hideConnectNavLabel}
• ${messages.hideCommunitiesNavLabel}
• ${messages.hideMoreSlideOutMenuItemsOptionsLabel_desktop}
`.trim()

if (process.argv[3] == 'md') {
  storeDescription = storeDescription
    // Section titles
    .replace(/^([^:\n]+):$/gm, '**$1:**')
    // List items
    // .replace(/•/g, '-')
}


storeDescription += '\n\nTWITTER, TWEET and RETWEET are trademarks of Twitter Inc. or its affiliates'

clipboard.writeSync(storeDescription)
console.log(storeDescription)