import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["modal"]
  static values = { open: { type: Boolean, default: false } }

  open() {
    this.openValue = true
  }

  close() {
    this.openValue = false
  }

  closeOnBackdrop(event) {
    if (event.target === this.modalTarget) {
      this.close()
    }
  }

  closeOnEscape(event) {
    if (event.key === "Escape" && this.openValue) {
      this.close()
    }
  }

  stopPropagation(event) {
    event.stopPropagation()
  }

  openValueChanged() {
    if (this.openValue) {
      this.modalTarget.classList.remove("hidden")
      document.body.classList.add("overflow-hidden")
      this.modalTarget.focus()
    } else {
      this.modalTarget.classList.add("hidden")
      document.body.classList.remove("overflow-hidden")
    }
  }
}
