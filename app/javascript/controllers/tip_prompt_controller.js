import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  showForm() {
    const tipFormContainer = this.element.closest("[id^='tip_form_']")
    if (!tipFormContainer) return

    const reportId = tipFormContainer.id.replace("tip_form_", "")

    fetch(`/reports/${reportId}/tip_form`, {
      headers: {
        "Accept": "text/html"
      }
    })
      .then(response => response.text())
      .then(html => {
        tipFormContainer.innerHTML = html
      })
      .catch(error => {
        console.error("Failed to load tip form:", error)
      })
  }
}
