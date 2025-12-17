import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submitButton", "input"]

  disableSubmit() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.originalButtonText = this.submitButtonTarget.textContent
      this.submitButtonTarget.textContent = "Submitting..."
    }
  }

  enableSubmit() {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
      if (this.originalButtonText) {
        this.submitButtonTarget.textContent = this.originalButtonText
      }
    }
  }

  reset() {
    this.element.reset()
    this.enableSubmit()
  }
}
