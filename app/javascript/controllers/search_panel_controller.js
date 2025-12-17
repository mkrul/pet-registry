import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["panel", "backdrop", "toggleButton", "buttonLabel"]
  static values = { open: { type: Boolean, default: false } }

  connect() {
    this.boundCloseOnEscape = this.closeOnEscape.bind(this)
    document.addEventListener("keydown", this.boundCloseOnEscape)

    const remembered = localStorage.getItem("searchPanelFirstClick")
    if (!remembered) {
      this.toggleButtonTarget.classList.add("animate-glow-pulse")
    }
  }

  disconnect() {
    document.removeEventListener("keydown", this.boundCloseOnEscape)
  }

  toggle() {
    this.openValue = !this.openValue

    if (!localStorage.getItem("searchPanelFirstClick")) {
      localStorage.setItem("searchPanelFirstClick", "true")
      this.toggleButtonTarget.classList.remove("animate-glow-pulse")
    }
  }

  open() {
    this.openValue = true
  }

  close() {
    this.openValue = false
  }

  openValueChanged() {
    if (this.openValue) {
      this.panelTarget.classList.remove("translate-x-full")
      this.panelTarget.classList.add("translate-x-0")
      this.panelTarget.setAttribute("aria-hidden", "false")
      this.backdropTarget.classList.remove("hidden")

      this.toggleButtonTarget.classList.remove("bg-green-600", "hover:bg-green-700")
      this.toggleButtonTarget.classList.add("bg-gray-500", "hover:bg-gray-600")
      this.toggleButtonTarget.setAttribute("aria-pressed", "true")

      if (this.hasButtonLabelTarget) {
        this.buttonLabelTarget.textContent = "Close"
      }

      document.body.classList.add("overflow-hidden")
    } else {
      this.panelTarget.classList.add("translate-x-full")
      this.panelTarget.classList.remove("translate-x-0")
      this.panelTarget.setAttribute("aria-hidden", "true")
      this.backdropTarget.classList.add("hidden")

      this.toggleButtonTarget.classList.add("bg-green-600", "hover:bg-green-700")
      this.toggleButtonTarget.classList.remove("bg-gray-500", "hover:bg-gray-600")
      this.toggleButtonTarget.setAttribute("aria-pressed", "false")

      if (this.hasButtonLabelTarget) {
        this.buttonLabelTarget.textContent = "Search"
      }

      document.body.classList.remove("overflow-hidden")
    }
  }

  closeOnEscape(event) {
    if (event.key === "Escape" && this.openValue) {
      this.close()
    }
  }

  handleSearch() {
    this.close()
  }
}
