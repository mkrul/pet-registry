import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]
  static values = { open: { type: Boolean, default: false } }

  toggle() {
    this.openValue = !this.openValue
  }

  close(event) {
    if (!this.element.contains(event.target)) {
      this.openValue = false
    }
  }

  openValueChanged() {
    this.menuTarget.classList.toggle('hidden', !this.openValue)
  }

  connect() {
    this.boundClose = this.close.bind(this)
    document.addEventListener('click', this.boundClose)
  }

  disconnect() {
    document.removeEventListener('click', this.boundClose)
  }
}
