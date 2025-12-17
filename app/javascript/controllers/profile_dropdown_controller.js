import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu"]
  static values = { open: { type: Boolean, default: false } }

  toggle() {
    this.openValue = !this.openValue
  }

  close() {
    this.openValue = false
  }

  closeOnClickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.openValue = false
    }
  }

  openValueChanged() {
    if (this.hasMenuTarget) {
      this.menuTarget.classList.toggle("hidden", !this.openValue)
      this.menuTarget.classList.toggle("block", this.openValue)
    }

    if (this.openValue) {
      document.addEventListener("click", this.boundCloseOnClickOutside)
    } else {
      document.removeEventListener("click", this.boundCloseOnClickOutside)
    }
  }

  connect() {
    this.boundCloseOnClickOutside = this.closeOnClickOutside.bind(this)
  }

  disconnect() {
    document.removeEventListener("click", this.boundCloseOnClickOutside)
  }
}
