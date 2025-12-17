import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["collapsed", "expanded", "chevron", "chevronIcon", "container"]
  static values = { expanded: { type: Boolean, default: false } }

  toggle(event) {
    const target = event.target
    const interactiveSelector = 'a, button, input, textarea, select, [role="button"]'
    const interactiveAncestor = target.closest(interactiveSelector)

    if (interactiveAncestor && interactiveAncestor !== event.currentTarget) {
      return
    }

    this.expandedValue = !this.expandedValue
  }

  handleKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      this.toggle(event)
    }
  }

  expandedValueChanged() {
    if (this.expandedValue) {
      this.showExpanded()
    } else {
      this.showCollapsed()
    }
  }

  showExpanded() {
    if (this.hasCollapsedTarget) {
      this.collapsedTarget.classList.add("hidden")
    }
    if (this.hasExpandedTarget) {
      this.expandedTarget.classList.remove("hidden")
    }
    if (this.hasChevronIconTarget) {
      this.chevronIconTarget.classList.add("rotate-180")
    }
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("aria-expanded", "true")
    }
  }

  showCollapsed() {
    if (this.hasCollapsedTarget) {
      this.collapsedTarget.classList.remove("hidden")
    }
    if (this.hasExpandedTarget) {
      this.expandedTarget.classList.add("hidden")
    }
    if (this.hasChevronIconTarget) {
      this.chevronIconTarget.classList.remove("rotate-180")
    }
    if (this.hasContainerTarget) {
      this.containerTarget.setAttribute("aria-expanded", "false")
    }
  }
}
