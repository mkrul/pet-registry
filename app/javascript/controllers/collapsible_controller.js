import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["content", "indicator"]
  static values = { open: { type: Boolean, default: true } }

  toggle() {
    this.openValue = !this.openValue
  }

  openValueChanged() {
    if (this.hasContentTarget) {
      this.contentTarget.classList.toggle("hidden", !this.openValue)
    }

    if (this.hasIndicatorTarget) {
      this.indicatorTarget.textContent = this.openValue ? "▼" : "▶"
    }

    const button = this.element.querySelector("button[aria-expanded]")
    if (button) {
      button.setAttribute("aria-expanded", this.openValue)
    }
  }
}
