import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["submitButton", "input", "error"]
  static values = {
    submitting: { type: Boolean, default: false },
    submitText: { type: String, default: "Submit" },
    submittingText: { type: String, default: "Submitting..." }
  }

  connect() {
    this.originalButtonText = this.hasSubmitButtonTarget
      ? this.submitButtonTarget.textContent
      : this.submitTextValue
  }

  disableSubmit() {
    this.submittingValue = true
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.textContent = this.submittingTextValue
    }
  }

  enableSubmit() {
    this.submittingValue = false
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = false
      this.submitButtonTarget.textContent = this.originalButtonText
    }
  }

  validateField(event) {
    const field = event.target
    const errorElement = this.#findErrorElement(field)

    if (field.validity.valid) {
      this.#clearError(field, errorElement)
    } else {
      this.#showError(field, errorElement)
    }
  }

  clearErrors() {
    this.inputTargets.forEach(input => {
      const errorElement = this.#findErrorElement(input)
      this.#clearError(input, errorElement)
    })
  }

  #findErrorElement(field) {
    const fieldName = field.name || field.id
    return this.errorTargets.find(el => el.dataset.field === fieldName)
  }

  #showError(field, errorElement) {
    field.classList.add("border-red-500", "dark:border-red-400")
    field.classList.remove("border-gray-300", "dark:border-gray-600")

    if (errorElement) {
      errorElement.textContent = field.validationMessage
      errorElement.classList.remove("hidden")
    }
  }

  #clearError(field, errorElement) {
    field.classList.remove("border-red-500", "dark:border-red-400")
    field.classList.add("border-gray-300", "dark:border-gray-600")

    if (errorElement) {
      errorElement.textContent = ""
      errorElement.classList.add("hidden")
    }
  }
}
