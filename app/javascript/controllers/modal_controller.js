import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog"]
  static values = { open: { type: Boolean, default: false } }

  open() {
    this.openValue = true
    document.body.classList.add('overflow-hidden')
  }

  close() {
    this.openValue = false
    document.body.classList.remove('overflow-hidden')
  }

  openValueChanged() {
    this.dialogTarget.classList.toggle('hidden', !this.openValue)
  }

  closeOnEscape(event) {
    if (event.key === 'Escape' && this.openValue) {
      this.close()
    }
  }

  closeOnBackdrop(event) {
    if (event.target === this.dialogTarget) {
      this.close()
    }
  }
}
