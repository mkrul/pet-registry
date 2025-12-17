import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["queryInput", "rememberCheckbox"]
  static values = { remember: { type: Boolean, default: true } }

  connect() {
    this.loadSavedFilters()
  }

  reset(event) {
    event.preventDefault()

    if (this.hasQueryInputTarget) {
      this.queryInputTarget.value = ""
    }

    const hiddenInputs = this.element.querySelectorAll('input[type="hidden"]')
    hiddenInputs.forEach(input => {
      if (input.name !== "authenticity_token" && input.name !== "sort") {
        input.value = ""
        input.dispatchEvent(new Event("change", { bubbles: true }))
      }
    })

    const sortInput = this.element.querySelector('input[name="sort"]')
    if (sortInput) {
      sortInput.value = "Newest"
      sortInput.dispatchEvent(new Event("change", { bubbles: true }))
    }

    this.clearSavedFilters()

    window.Turbo.visit(window.location.pathname, { action: "replace" })
  }

  toggleRemember(event) {
    this.rememberValue = event.target.checked
    localStorage.setItem("rememberFiltersEnabled", this.rememberValue)

    if (!this.rememberValue) {
      this.clearSavedFilters()
    } else {
      this.saveCurrentFilters()
    }
  }

  saveCurrentFilters() {
    if (!this.rememberValue) return

    const formData = new FormData(this.element)
    const filters = {}

    for (const [key, value] of formData.entries()) {
      if (key !== "authenticity_token" && value) {
        filters[key] = value
      }
    }

    localStorage.setItem("savedFilters", JSON.stringify(filters))
  }

  loadSavedFilters() {
    const rememberEnabled = localStorage.getItem("rememberFiltersEnabled")
    if (rememberEnabled !== null) {
      this.rememberValue = rememberEnabled === "true"
    }

    if (this.hasRememberCheckboxTarget) {
      this.rememberCheckboxTarget.checked = this.rememberValue
    }

    const hasUrlParams = window.location.search.length > 0
    if (hasUrlParams) return

    if (!this.rememberValue) return

    const saved = localStorage.getItem("savedFilters")
    if (!saved) return

    try {
      const filters = JSON.parse(saved)
      const params = new URLSearchParams()

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        }
      })

      if (params.toString()) {
        window.Turbo.visit(`${window.location.pathname}?${params.toString()}`, { action: "replace" })
      }
    } catch (e) {
      console.error("Failed to load saved filters:", e)
    }
  }

  clearSavedFilters() {
    localStorage.removeItem("savedFilters")
  }
}
