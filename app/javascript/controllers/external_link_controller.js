import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  intercept(event) {
    const url = this.element.href

    if (!url) return

    if (!this.isExternalUrl(url)) {
      return
    }

    event.preventDefault()

    if (window.confirmModal) {
      window.confirmModal.show({
        title: "You are about to open an external link.",
        message: "If the link you clicked is not from a trusted source, it may contain potential security risks.\n\nAre you sure you want to open it?",
        url: url
      })
    } else {
      if (confirm("You are about to open an external link. Continue?")) {
        window.open(url, "_blank", "noopener,noreferrer")
      }
    }
  }

  isExternalUrl(url) {
    try {
      const urlObj = new URL(url, window.location.origin)
      return urlObj.hostname !== window.location.hostname
    } catch {
      return false
    }
  }
}
