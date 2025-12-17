import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["password", "passwordConfirmation", "passwordError"]

  validatePasswordMatch() {
    if (!this.hasPasswordTarget || !this.hasPasswordConfirmationTarget) {
      return
    }

    const password = this.passwordTarget.value
    const confirmation = this.passwordConfirmationTarget.value

    if (confirmation.length === 0) {
      this.hideError()
      return
    }

    if (password !== confirmation) {
      this.showError()
    } else {
      this.hideError()
    }
  }

  showError() {
    if (this.hasPasswordErrorTarget) {
      this.passwordErrorTarget.classList.remove("hidden")
    }
    if (this.hasPasswordConfirmationTarget) {
      this.passwordConfirmationTarget.classList.add("border-red-500", "dark:border-red-400")
      this.passwordConfirmationTarget.classList.remove("border-gray-300", "dark:border-gray-600")
    }
  }

  hideError() {
    if (this.hasPasswordErrorTarget) {
      this.passwordErrorTarget.classList.add("hidden")
    }
    if (this.hasPasswordConfirmationTarget) {
      this.passwordConfirmationTarget.classList.remove("border-red-500", "dark:border-red-400")
      this.passwordConfirmationTarget.classList.add("border-gray-300", "dark:border-gray-600")
    }
  }
}
