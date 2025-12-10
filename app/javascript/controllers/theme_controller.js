import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["toggle", "icon"]
  static values = {
    dark: { type: Boolean, default: false }
  }

  connect() {
    this.darkValue = this.#getStoredTheme()
    this.#applyTheme()
  }

  toggle() {
    this.darkValue = !this.darkValue
    this.#storeTheme()
    this.#applyTheme()
  }

  darkValueChanged() {
    this.#updateToggleState()
  }

  #getStoredTheme() {
    try {
      return localStorage.getItem('darkMode') === 'true'
    } catch {
      return false
    }
  }

  #storeTheme() {
    try {
      localStorage.setItem('darkMode', this.darkValue.toString())
    } catch {
      // localStorage not available
    }
  }

  #applyTheme() {
    if (this.darkValue) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  #updateToggleState() {
    if (this.hasToggleTarget) {
      this.toggleTarget.setAttribute("aria-pressed", this.darkValue.toString())
    }
    if (this.hasIconTarget) {
      this.iconTarget.dataset.theme = this.darkValue ? "dark" : "light"
    }
  }
}
