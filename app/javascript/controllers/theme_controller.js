import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { dark: { type: Boolean, default: false } }

  connect() {
    this.darkValue = localStorage.getItem('darkMode') === 'true'
  }

  toggle() {
    this.darkValue = !this.darkValue
    localStorage.setItem('darkMode', this.darkValue)
    document.documentElement.classList.toggle('dark', this.darkValue)
  }

  darkValueChanged() {
    document.documentElement.classList.toggle('dark', this.darkValue)
  }
}
