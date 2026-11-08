/**
 * A light DOM checkbox row with native form behavior.
 * Author label content and an optional description paragraph as children.
 * Storage, localization and browser appearance belong to the consuming page.
 */
export class OptionsToggle extends HTMLElement {
  connectedCallback() {
    // Preserve input and current state whe nmoving or reconnecting
    if (this.querySelector(':scope > .option-control')) return

    const document = this.ownerDocument
    const label = document.createElement('label')
    label.className = 'option-label'
    const control = document.createElement('label')
    control.className = 'option-control'
    const input = document.createElement('input')
    input.setAttribute('type', 'checkbox')
    const name = this.getAttribute('name') || ''
    input.setAttribute('name', name)
    let id = this.getAttribute('input-id') || `option-${name}`
    const baseId = id
    for (let index = 2; document.getElementById(id); index++) id = `${baseId}-${index}`
    input.id = id
    input.checked = this.hasAttribute('checked')
    input.disabled = this.hasAttribute('disabled')
    label.htmlFor = id
    const descriptions = Array.from(this.querySelectorAll(':scope > p'))
    const descriptionIds = descriptions.map(($description) => $description.id).filter(Boolean)
    if (descriptionIds.length) input.setAttribute('aria-describedby', descriptionIds.join(' '))
    for (const $child of Array.from(this.childNodes)) {
      if (!descriptions.includes(/** @type {Element} */ ($child))) label.append($child)
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
