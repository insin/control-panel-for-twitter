import { expect, test } from 'vitest'

import { DEFAULT_SETTINGS } from '../default-settings.js'
import {
  createSettingsExport,
  SETTINGS_SCHEMA_VERSION,
  validateSettingsExport,
} from '../schemas.js'

test.each(['4.99.0', '5.0.0'])('round-trips all settings exported by %s', (version) => {
  const exported = JSON.parse(JSON.stringify(createSettingsExport(DEFAULT_SETTINGS, version)))

  expect(exported.schemaVersion).toBe(SETTINGS_SCHEMA_VERSION)
  expect(exported.version).toBe(version)
  expect(validateSettingsExport(exported)).toEqual({
    settings: DEFAULT_SETTINGS,
    invalid: [],
    unknown: [],
  })
})

test.each(['4.99.1', '5.1.0', '99.0.0', undefined])(
  'validates using the schema version independently of extension version %s',
  (version) => {
    const result = validateSettingsExport({
      schemaVersion: 1,
      version,
      settings: { hideGrok: false, customTheme: '#abcdef' },
    })

    expect(result).toEqual({
      settings: { hideGrok: false, customTheme: '#abcdef' },
      invalid: [],
      unknown: [],
    })
  },
)

test.each([undefined, null, '1', 0, -1, 1.5, true, {}, [], Number.MAX_SAFE_INTEGER + 1])(
  'rejects missing or invalid schema version %j',
  (schemaVersion) => {
    expect(validateSettingsExport({ schemaVersion, settings: { hideGrok: true } })).toEqual({
      settings: {},
      invalid: [],
      unknown: [],
      error: 'invalidSettingsSchemaVersion',
    })
  },
)

test('warns about a newer schema while importing recognised, valid settings', () => {
  expect(
    validateSettingsExport({
      schemaVersion: SETTINGS_SCHEMA_VERSION + 1,
      settings: { hideGrok: false, hideAdsNav: 'yes', futureFlag: true },
    }),
  ).toEqual({
    settings: { hideGrok: false },
    invalid: ['hideAdsNav'],
    unknown: ['futureFlag'],
    warning: 'newerSettingsSchemaVersion',
  })
})

test('reports invalid values and unknown new flags while importing compatible settings', () => {
  expect(
    validateSettingsExport({
      schemaVersion: 1,
      settings: { hideGrok: false, hideAdsNav: 'yes', futureFlag: true },
    }),
  ).toEqual({
    settings: { hideGrok: false },
    invalid: ['hideAdsNav'],
    unknown: ['futureFlag'],
  })
})

test.each([null, [], true, {}, { settings: [] }, { settings: null }])(
  'rejects an invalid export envelope %j',
  (input) => {
    expect(validateSettingsExport(input).error).toBe('noSettingsObject')
  },
)

test('rejects an unversioned debugging export', () => {
  expect(validateSettingsExport({ version: '4.998.0', settings: { hideGrok: true } }).error).toBe(
    'invalidSettingsSchemaVersion',
  )
})
