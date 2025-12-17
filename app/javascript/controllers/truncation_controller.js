import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["truncatable", "chevron", "collapsedContent"]
  static values = { tipId: Number, truncated: { type: Boolean, default: false } }

  connect() {
    this.checkTruncation()

    this.resizeObserver = new ResizeObserver(() => {
      this.checkTruncation()
    })

    if (this.hasCollapsedContentTarget) {
      this.resizeObserver.observe(this.collapsedContentTarget)
    }
  }

  disconnect() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
    }
  }

  checkTruncation() {
    let isTruncated = false

    this.truncatableTargets.forEach(element => {
      if (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) {
        isTruncated = true
      }
    })

    if (!isTruncated && this.hasCollapsedContentTarget) {
      const contentDiv = this.collapsedContentTarget.querySelector('.flex-1')
      if (contentDiv) {
        const visibleChildren = Array.from(contentDiv.children).filter(child => {
          return child.textContent && child.textContent.trim().length > 0 && !child.classList.contains('hidden')
        })

        if (visibleChildren.length > 1) {
          isTruncated = true
        }
      }
    }

    this.truncatedValue = isTruncated
  }

  truncatedValueChanged() {
    if (this.hasChevronTarget) {
      if (this.truncatedValue) {
        this.chevronTarget.classList.remove("hidden")
      } else {
        this.chevronTarget.classList.add("hidden")
      }
    }
  }
}
