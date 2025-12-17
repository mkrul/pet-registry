import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["backdrop", "dialog", "title", "message", "confirmButton"]
  static values = {
    open: { type: Boolean, default: false },
    pendingUrl: String
  }

  connect() {
    window.confirmModal = this
  }

  disconnect() {
    window.confirmModal = null
  }

  show(options = {}) {
    const { title, message, url, onConfirm } = options

    if (this.hasTitleTarget && title) {
      this.titleTarget.textContent = title
    }

    if (this.hasMessageTarget && message) {
      this.messageTarget.textContent = message
    }

    this.pendingUrlValue = url || ""
    this.onConfirmCallback = onConfirm

    this.openValue = true
  }

  close() {
    this.openValue = false
    this.pendingUrlValue = ""
    this.onConfirmCallback = null
  }

  confirm() {
    if (this.onConfirmCallback) {
      this.onConfirmCallback()
    } else if (this.pendingUrlValue) {
      window.open(this.pendingUrlValue, "_blank", "noopener,noreferrer")
    }

    this.close()
  }

  closeOnEscape(event) {
    if (event.key === "Escape" && this.openValue) {
      this.close()
    }
  }

  openValueChanged() {
    if (this.openValue) {
      this.element.classList.remove("hidden")
      document.body.classList.add("overflow-hidden")

      if (this.hasConfirmButtonTarget) {
        this.confirmButtonTarget.focus()
      }
    } else {
      this.element.classList.add("hidden")
      document.body.classList.remove("overflow-hidden")
    }
  }
}
