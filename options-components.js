/**
 * @tag options-toggle
 * @attr {string} name - setting name, label locale key and label id.
 * @attr {string} [label] - option label to use if a translation is unavailble.
 * @attr {string} [info] - include a description, with optional fallback text - key and id are `${name}Info`.
 * @attr {boolean} [dynamic-label] - create an empty label for options.js to populate.
 * @attr {string} [dynamic-info] - id of an empty description for options.js to populate.
 */
export class OptionsToggle extends HTMLElement {
  connectedCallback() {
    // Preserve input and current state when moving or reconnecting
    if (this.querySelector(':scope > .option-control')) return

    const document = this.ownerDocument
    const name = this.getAttribute('name') || ''
    const id = `option-${name}`
    const label = document.createElement('label')
    label.className = 'option-label'
    label.htmlFor = id
    const text = document.createElement('span')
    text.id = name
    if (!this.hasAttribute('dynamic-label')) {
      text.textContent = chrome.i18n.getMessage(name) || this.getAttribute('label') || ''
    }
    label.append(text)
    const control = document.createElement('label')
    control.className = 'option-control'
    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    input.setAttribute('name', name)
    input.id = id
    const descriptions = []
    const dynamicInfo = this.getAttribute('dynamic-info')
    if (this.hasAttribute('info') || dynamicInfo) {
      const description = document.createElement('p')
      description.className = 'option-description'
      description.id = dynamicInfo || `${name}Info`
      if (!dynamicInfo) {
        description.textContent =
          chrome.i18n.getMessage(description.id) || this.getAttribute('info') || ''
      }
      input.setAttribute('aria-describedby', description.id)
      descriptions.push(description)
    }
    const toggle = document.createElement('span')
    toggle.className = 'toggle'
    toggle.setAttribute('aria-hidden', 'true')
    control.append(input, toggle)
    this.classList.add('checkbox', 'option-row')
    this.replaceChildren(label, control, ...descriptions)
  }
}

customElements.define('options-toggle', OptionsToggle)

/**
 * Generates a labelled native select from authored option/optgroup children.
 * Choices use `option_${value}` locale keys unless an option has a label-key
 * attribute. Untranslated choices retain their authored text. Attributes are
 * read on first connection; values and dynamic text are managed by options.js.
 *
 * @tag options-select
 * @attr {string} name - setting name and label locale key/id - select id is `option-${name}`.
 * @attr {string} [label] - option label to use if a translation is unavailable.
 * @attr {string} [label-key] - override for option label locale key.
 * @attr {string} [info-id] - id of an external description, associated with the native select.
 */
export class OptionsSelect extends HTMLElement {
  connectedCallback() {
    if (this.querySelector(':scope > select')) return

    const document = this.ownerDocument
    const name = this.getAttribute('name') || ''
    const label = document.createElement('label')
    label.className = 'option-label'
    label.id = name
    label.htmlFor = `option-${name}`
    label.textContent =
      chrome.i18n.getMessage(this.getAttribute('label-key') || name) ||
      this.getAttribute('label') ||
      ''
    const select = document.createElement('select')
    select.id = label.htmlFor
    select.setAttribute('name', name)
    const infoId = this.getAttribute('info-id')
    if (infoId) select.setAttribute('aria-describedby', infoId)
    select.append(...Array.from(this.childNodes))
    for (const option of select.querySelectorAll('option')) {
      const key = option.getAttribute('label-key') || `option_${option.value}`
      const translation = chrome.i18n.getMessage(key)
      if (translation) option.textContent = translation
    }
    this.classList.add('option-row')
    this.replaceChildren(label, select)
  }
}

customElements.define('options-select', OptionsSelect)

/**
 * @tag options-button
 * @attr {string} name - native button id and button-text locale key.
 * @attr {string} [label] - option label to use if a translation is unavailable.
 * @attr {string} [label-key] - override for label locale key and id - id defaults to `${name}Label`.
 * @attr {string} [button] - button text to use when no translation is available.
 */
export class OptionsButton extends HTMLElement {
  connectedCallback() {
    if (this.querySelector(':scope > button')) return

    const document = this.ownerDocument
    const name = this.getAttribute('name') || ''
    const labelKey = this.getAttribute('label-key')
    const label = document.createElement('span')
    label.className = 'option-label'
    label.id = labelKey || `${name}Label`
    label.textContent =
      (labelKey && chrome.i18n.getMessage(labelKey)) || this.getAttribute('label') || ''
    const button = document.createElement('button')
    button.setAttribute('type', 'button')
    button.id = name
    button.textContent = chrome.i18n.getMessage(name) || this.getAttribute('button') || ''
    button.setAttribute('aria-describedby', label.id)
    this.classList.add('option-row', 'button')
    this.replaceChildren(label, button)
  }
}

customElements.define('options-button', OptionsButton)
