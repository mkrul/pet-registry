import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog", "backdrop"]
  static values = {
    open: { type: Boolean, default: false }
  }

  connect() {
    this.boundHandleKeydown = this.handleKeydown.bind(this)
    this.previousActiveElement = null
  }

  disconnect() {
    this.#removeListeners()
    document.body.classList.remove("overflow-hidden")
  }

  open(event) {
    event?.preventDefault()
    this.previousActiveElement = document.activeElement
    this.openValue = true
  }

  close(event) {
    event?.preventDefault()
    this.openValue = false
  }

  openValueChanged() {
    if (this.openValue) {
      this.#showModal()
      this.#addListeners()
      this.#trapFocus()
    } else {
      this.#hideModal()
      this.#removeListeners()
      this.#restoreFocus()
    }
  }

  handleKeydown(event) {
    if (event.key === "Escape") {
      this.close()
    }

    if (event.key === "Tab") {
      this.#handleTabKey(event)
    }
  }

  backdropClick(event) {
    if (event.target === this.backdropTarget) {
      this.close()
    }
  }

  #showModal() {
    if (this.hasDialogTarget) {
      this.dialogTarget.classList.remove("hidden")
      this.dialogTarget.setAttribute("aria-hidden", "false")
    }
    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.remove("hidden")
    }
    document.body.classList.add("overflow-hidden")
  }

  #hideModal() {
    if (this.hasDialogTarget) {
      this.dialogTarget.classList.add("hidden")
      this.dialogTarget.setAttribute("aria-hidden", "true")
    }
    if (this.hasBackdropTarget) {
      this.backdropTarget.classList.add("hidden")
    }
    document.body.classList.remove("overflow-hidden")
  }

  #trapFocus() {
    const focusableElements = this.#getFocusableElements()
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }

  #restoreFocus() {
    this.previousActiveElement?.focus()
  }

  #handleTabKey(event) {
    const focusableElements = this.#getFocusableElements()
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }

  #getFocusableElements() {
    if (!this.hasDialogTarget) return []

    const selector = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    return Array.from(this.dialogTarget.querySelectorAll(selector))
  }

  #addListeners() {
    document.addEventListener("keydown", this.boundHandleKeydown)
  }

  #removeListeners() {
    document.removeEventListener("keydown", this.boundHandleKeydown)
  }
}
