import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sortProperties } from '../lib.mjs'

export const template = {
  ACCOUNT_BASED_IN: 'Account based in {country}',
  ADD_MUTED_WORD: 'Add muted word',
  AD_FROM: 'Ad from {url}',
  BACK: 'Back',
  CHOOSE_AUDIENCE: 'Choose audience: {audience}',
  DRAFTS: 'Drafts',
  FOLLOWING_USER: 'Following @{screenName}',
  FOLLOW_BACK_USER: 'Follow back @{screenName}',
  FOLLOW_USER: 'Follow @{screenName}',
  HOME: 'Home',
  LIKES: 'Likes',
  LIVE_ON_X: 'Live on X',
  MEDIA_VIEWER: 'Media Viewer',
  MEDIA_COUNT: '{formattedCount} {count, plural, one {photos & videos} other {photos & videos}}',
  MUTE_THIS_CONVERSATION: 'Mute this conversation',
  NEW_POST: 'New post',
  POST: 'Post',
  POSTS: 'Posts',
  POST_ALL: 'Post all',
  POST_COUNT: '{formattedCount} {count, plural, one {post} other {posts}}',
  POST_TITLE: '{name} on X: "{text}"',
  POST_UNAVAILABLE: 'This post is unavailable.',
  POST_YOUR_REPLY: 'Post your reply',
  QUOTE: 'Quote',
  QUOTES: 'Quotes',
  QUOTE_COUNT: '{formattedCount} {count, plural, one {quote} other {quotes}}',
  RECENT: 'Recent',
  RELEVANT: 'Relevant',
  REPOST: 'Repost',
  REPOSTS: 'Reposts',
  REPOST_COUNT: '{formattedCount} {count, plural, one {repost} other {reposts}}',
  SHOW: 'Show',
  SHOW_POSTS: 'Show {count, plural, one {# post} other {# posts}}',
  SORT_BY: 'Sort by',
  SORT_REPLIES: 'Sort replies',
  UNFOLLOW_USER: 'Unfollow @{screenName}',
  USER_REPOSTED: '{name} reposted',
  VIEW: 'View',
  WHO_CAN_REPLY: 'Who can reply: {replyPolicy}',
  YOU_REPOSTED: 'You reposted',
}

/**
 * @param {Record<string, Record<string, string>>} base
 * @param {Record<string, Record<string, string>>} catalogs
 */
export function createLocales(base, catalogs) {
  if (!catalogs.en) throw new Error('Missing English xweb catalog')
  for (const phrase of Object.values(template)) {
    if (!Object.hasOwn(catalogs.en, phrase))
      throw new Error(`Missing English source phrase: ${phrase}`)
  }
  const locales = structuredClone(base)
  for (const [sourceLocale, catalog] of Object.entries(catalogs)) {
    const code = sourceLocale
    locales[code] ??= {}
    const locale = locales[code]
    for (const [key, phrase] of Object.entries(template)) {
      const translation = catalog[phrase]
      if (typeof translation != 'string' || !translation) continue
      locale[key] = translation
    }
  }
  for (const [code, locale] of Object.entries(locales)) {
    // xweb's diagnostic and pseudo-locales are not display languages
    if (code == 'en-ss' || code == 'en-xx') {
      delete locales[code]
      continue
    }
    if (code != 'en') {
      for (const key of Object.keys(locale)) {
        if (locale[key] == locales.en[key]) delete locale[key]
      }
    }
    if (Object.keys(locale).length == 0) delete locales[code]
    else locales[code] = sortProperties(locale)
  }
  return sortProperties(locales)
}

/** @param {Record<string, Record<string, string>>} locales */
export function formatLocales(locales) {
  return `const locales = {\n${Object.entries(locales)
    .map(
      ([code, locale]) =>
        `  ${JSON.stringify(code)}: {\n${Object.entries(locale)
          .map(([key, value]) => `    ${key}: ${JSON.stringify(value)}`)
          .join(',\n')}\n  }`,
    )
    .join(',\n')}\n}\n`
}

if (process.argv[1] && path.resolve(process.argv[1]) == fileURLToPath(import.meta.url)) {
  const directory = path.dirname(fileURLToPath(import.meta.url))
  const catalogDirectory = path.resolve(process.argv[2] || path.join(directory, 'json'))
  const output = path.resolve(process.argv[3] || path.join(directory, 'locales.js'))
  const base = JSON.parse(fs.readFileSync(path.join(directory, 'base-locales.json'), 'utf8'))
  const catalogs = Object.fromEntries(
    fs
      .readdirSync(catalogDirectory)
      .filter((file) => file.endsWith('.json'))
      .map((file) => [
        path.basename(file, '.json'),
        JSON.parse(fs.readFileSync(path.join(catalogDirectory, file), 'utf8')),
      ]),
  )
  fs.writeFileSync(output, formatLocales(createLocales(base, catalogs)), 'utf8')
  console.log(`Generated ${output}`)
}
