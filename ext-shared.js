/**
 * Shared module for settings validation. No `chrome.*` APIs.
 */

//#region Typedefs
/**
 * @typedef {{
 *   validate: (value: any) => boolean
 *   normalise?: (value: any) => any
 * }} FieldDescriptor
 */

/**
 * @typedef {[string, Record<string, FieldDescriptor>][]} SettingsSchemas
 */

/**
 * @typedef {{
 *   settings: Record<string, unknown>
 *   invalid: string[]
 *   unknown: string[]
 * }} ValidateSettingsResult
 */
//#endregion

//#region Helpers
/**
 * @param {string} previous
 * @param {string} current
 * @param {string} threshold
 */
export function crossesVersionThreshold(previous, current, threshold) {
  return isVersionLessThan(previous, threshold) && !isVersionLessThan(current, threshold)
}

/**
 * @param {string} v1
 * @param {string} v2
 */
export function isVersionLessThan(v1, v2) {
  let a = v1.split('.').map(Number)
  let b = v2.split('.').map(Number)
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const diff = (a[i] || 0) - (b[i] || 0)
    if (diff < 0) return true
    if (diff > 0) return false
  }
  return false
}

/** @param {unknown} value */
export function isObject(value) {
  return value != null && typeof value == 'object'
}
//#endregion

//#region Field descriptor factories
/** @returns {FieldDescriptor} */
export function boolean() {
  return {
    validate: (value) => typeof value == 'boolean',
  }
}

/**
 * @param {{ maxLength?: number }} [options]
 * @returns {FieldDescriptor}
 */
export function string({ maxLength } = {}) {
  return {
    validate: (value) =>
      typeof value == 'string' &&
      (maxLength == null || value.length <= maxLength),
  }
}

/**
 * @param {string[]} allowedValues
 * @returns {FieldDescriptor}
 */
export function oneOf(allowedValues) {
  return {
    validate: (value) => typeof value == 'string' && allowedValues.includes(value),
  }
}

/**
 * Validates that an array has at least one valid item. Only valid items are
 * retained.
 * @param {FieldDescriptor} item
 * @param {{ maxLength?: number }} [options]
 * @returns {FieldDescriptor}
 */
export function arrayOf(item, { maxLength } = {}) {
  return {
    validate: (value) =>
      Array.isArray(value) &&
      (maxLength == null || value.length <= maxLength) &&
      value.some(item.validate),
    normalise: (values) => {
      const valid = values.filter(item.validate)
      return maxLength != null ? valid.slice(0, maxLength) : valid
    },
  }
}

/**
 * Wraps a field descriptor to also accept `null`/`undefined`.
 * Use for optional fields within `object()` descriptors.
 * @param {FieldDescriptor} field
 * @returns {FieldDescriptor}
 */
export function optional(field) {
  return {
    validate: (value) => value == null || field.validate(value),
  }
}

/**
 * Validates a plain object against a map of field descriptors.
 * All fields are required unless wrapped with `optional()`.
 * @param {Record<string, FieldDescriptor>} fields
 * @returns {FieldDescriptor}
 */
export function object(fields) {
  return {
    validate: (value) =>
      isObject(value) &&
      Object.entries(fields).every(([key, field]) => field.validate(value[key])),
  }
}
//#endregion

//#region Schema lookup
/**
 * Returns the appropriate schema for a given extension version by finding the
 * highest schema version that does not exceed the extension version.
 * Falls back to the oldest schema if the version predates all known schemas.
 * @param {SettingsSchemas} schemas settings schemas in ascending version order
 * @param {string} version extension version to look up
 * @returns {Record<string, FieldDescriptor>}
 */
export function getSchemaForVersion(schemas, version) {
  for (let i = schemas.length - 1; i >= 0; i--) {
    const [schemaVersion, schema] = schemas[i]
    if (!isVersionLessThan(version, schemaVersion)) return schema
  }
  return schemas[0][1]
}
//#endregion

//#region Validation
/**
 * Validates and normalises a settings object against a schema.
 * Unknown and invalid keys are dropped.
 * @param {Record<string, unknown>} input
 * @param {Record<string, FieldDescriptor>} schema
 * @returns {ValidateSettingsResult}
 */
export function validateSettings(input, schema) {
  /** @type {Record<string, unknown>} */
  let settings = {}
  let invalid = []
  let unknown = []

  for (let [key, value] of Object.entries(input)) {
    let field = schema[key]
    if (!field) {
      unknown.push(key)
      continue
    }
    if (!field.validate(value)) {
      invalid.push(key)
      continue
    }
    settings[key] = field.normalise ? field.normalise(value) : value
  }

  return { settings, invalid, unknown }
}
//#endregion