import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["menu", "button"]
  static values = {
    open: { type: Boolean, default: false }
  }

  connect() {
    this.boundClickOutside = this.clickOutside.bind(this)
    this.boundHandleKeydown = this.handleKeydown.bind(this)
  }

  disconnect() {
    this.#removeListeners()
  }

  toggle(event) {
    event?.preventDefault()
    this.openValue = !this.openValue
  }

  open() {
    this.openValue = true
  }

  close() {
    this.openValue = false
  }

  openValueChanged() {
    if (this.openValue) {
      this.#showMenu()
      this.#addListeners()
    } else {
      this.#hideMenu()
      this.#removeListeners()
    }
  }

  clickOutside(event) {
    if (!this.element.contains(event.target)) {
      this.close()
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.close()
      this.buttonTarget?.focus()
    }
  }

  #showMenu() {
    if (this.hasMenuTarget) {
      this.menuTarget.classList.remove("hidden")
      this.menuTarget.setAttribute("aria-hidden", "false")
    }
    if (this.hasButtonTarget) {
      this.buttonTarget.setAttribute("aria-expanded", "true")
    }
  }

  #hideMenu() {
    if (this.hasMenuTarget) {
      this.menuTarget.classList.add("hidden")
      this.menuTarget.setAttribute("aria-hidden", "true")
    }
    if (this.hasButtonTarget) {
      this.buttonTarget.setAttribute("aria-expanded", "false")
    }
  }

  #addListeners() {
    document.addEventListener("click", this.boundClickOutside)
    document.addEventListener("keydown", this.boundHandleKeydown)
  }

  #removeListeners() {
    document.removeEventListener("click", this.boundClickOutside)
    document.removeEventListener("keydown", this.boundHandleKeydown)
  }
}
