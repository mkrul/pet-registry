import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["button"]
  static values = {
    submittingText: { type: String, default: "Submitting..." }
  }

  disable() {
    if (this.hasButtonTarget) {
      this.originalText = this.buttonTarget.value || this.buttonTarget.textContent
      this.buttonTarget.disabled = true

      if (this.buttonTarget.tagName === "INPUT") {
        this.buttonTarget.value = this.submittingTextValue
      } else {
        this.buttonTarget.textContent = this.submittingTextValue
      }
    }
  }

  enable() {
    if (this.hasButtonTarget && this.originalText) {
      this.buttonTarget.disabled = false

      if (this.buttonTarget.tagName === "INPUT") {
        this.buttonTarget.value = this.originalText
      } else {
        this.buttonTarget.textContent = this.originalText
      }
    }
  }
}
