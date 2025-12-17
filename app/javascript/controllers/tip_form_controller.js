import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "submitButton", "latitude", "longitude"]

  cancel() {
    const tipFormContainer = this.element.closest("[id^='tip_form_']")
    if (tipFormContainer) {
      tipFormContainer.innerHTML = `
        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Have Information?</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            If you've seen this pet or have any information that might help, please share it.
          </p>
          <div class="flex items-center justify-center gap-3">
            <button type="button"
                    class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                    data-action="click->tip-prompt#showForm">
              Submit a Tip
            </button>
          </div>
        </div>
      `
    }
  }

  submit(event) {
    if (this.hasSubmitButtonTarget) {
      this.submitButtonTarget.disabled = true
      this.submitButtonTarget.textContent = "Submitting..."
    }
  }
}
