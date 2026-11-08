import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { sortProperties } from '../lib.mjs'

export const template = {
  ACCOUNT_BASED_IN: 'Account based in {country}',
  ADD_MUTED_WORD: 'Add muted word',
  FOLLOWING_USER: 'Following @{screenName}',
  FOLLOW_BACK_USER: 'Follow back @{screenName}',
  FOLLOW_USER: 'Follow @{screenName}',
  HOME: 'Home',
  LIKES: 'Likes',
  LIVE_ON_X: 'Live on X',
  MUTE_THIS_CONVERSATION: 'Mute this conversation',
  NEW_POST: 'New post',
  POST: 'Post',
  POSTS: 'Posts',
  POST_ALL: 'Post all',
  POST_COUNT: '{formattedCount} {count, plural, one {post} other {posts}}',
  POST_UNAVAILABLE: 'This post is unavailable.',
  POST_YOUR_REPLY: 'Post your reply',
  QUOTE: 'Quote',
  QUOTES: 'Quotes',
  RECENT: 'Recent',
  RELEVANT: 'Relevant',
  REPOST: 'Repost',
  REPOSTS: 'Reposts',
  SHOW: 'Show',
  SORT_BY: 'Sort by',
  SORT_REPLIES: 'Sort replies',
  TWEET_TITLE: '{name} on X: "{text}"',
  UNFOLLOW_USER: 'Unfollow @{screenName}',
  VIEW: 'View',
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
    if (code != 'en') {
      for (const key of Object.keys(locale)) {
        if (locale[key] == locales.en[key]) delete locale[key]
      }
    }
    locales[code] = sortProperties(locale)
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
