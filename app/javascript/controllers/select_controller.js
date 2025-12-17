import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "button", "dropdown", "label", "chevron", "option", "clearButton"]
  static values = { name: String, open: { type: Boolean, default: false } }

  connect() {
    this.boundCloseOnClickOutside = this.closeOnClickOutside.bind(this)
    document.addEventListener("click", this.boundCloseOnClickOutside)
  }

  disconnect() {
    document.removeEventListener("click", this.boundCloseOnClickOutside)
  }

  toggle(event) {
    event.preventDefault()
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
      this.dropdownTarget.classList.remove("hidden")
      this.chevronTarget.classList.add("rotate-180")
      this.buttonTarget.setAttribute("aria-expanded", "true")
      this.focusSelectedOrFirst()
    } else {
      this.dropdownTarget.classList.add("hidden")
      this.chevronTarget.classList.remove("rotate-180")
      this.buttonTarget.setAttribute("aria-expanded", "false")
    }
  }

  selectOption(event) {
    const option = event.currentTarget
    const value = option.dataset.value
    const label = option.textContent.trim()

    this.inputTarget.value = value
    this.labelTarget.textContent = label
    this.labelTarget.classList.remove("text-gray-500", "dark:text-gray-400")

    this.optionTargets.forEach(opt => {
      opt.classList.remove("bg-blue-50", "dark:bg-blue-900/30")
      opt.setAttribute("aria-selected", "false")
    })
    option.classList.add("bg-blue-50", "dark:bg-blue-900/30")
    option.setAttribute("aria-selected", "true")

    if (this.hasClearButtonTarget) {
      this.clearButtonTarget.classList.remove("hidden")
    }

    this.close()
    this.dispatchChangeEvent()
  }

  clear(event) {
    event.preventDefault()
    event.stopPropagation()

    this.inputTarget.value = ""
    this.labelTarget.textContent = this.buttonTarget.querySelector("[data-select-target='label']")?.dataset.placeholder || "Select..."
    this.labelTarget.classList.add("text-gray-500", "dark:text-gray-400")

    this.optionTargets.forEach(opt => {
      opt.classList.remove("bg-blue-50", "dark:bg-blue-900/30")
      opt.setAttribute("aria-selected", "false")
    })

    if (this.hasClearButtonTarget) {
      this.clearButtonTarget.classList.add("hidden")
    }

    this.dispatchChangeEvent()
  }

  handleKeydown(event) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        this.toggle(event)
        break
      case "Escape":
        this.close()
        break
      case "ArrowDown":
        event.preventDefault()
        if (!this.openValue) {
          this.open()
        } else {
          this.focusNextOption()
        }
        break
      case "ArrowUp":
        event.preventDefault()
        if (!this.openValue) {
          this.open()
        } else {
          this.focusPreviousOption()
        }
        break
    }
  }

  handleOptionKeydown(event) {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault()
        this.selectOption(event)
        break
      case "Escape":
        this.close()
        this.buttonTarget.focus()
        break
      case "ArrowDown":
        event.preventDefault()
        this.focusNextOption()
        break
      case "ArrowUp":
        event.preventDefault()
        this.focusPreviousOption()
        break
    }
  }

  closeOnClickOutside(event) {
    if (!this.element.contains(event.target) && this.openValue) {
      this.close()
    }
  }

  focusSelectedOrFirst() {
    const selected = this.optionTargets.find(opt => opt.getAttribute("aria-selected") === "true")
    if (selected) {
      selected.focus()
    } else if (this.optionTargets.length > 0) {
      this.optionTargets[0].focus()
    }
  }

  focusNextOption() {
    const focused = document.activeElement
    const index = this.optionTargets.indexOf(focused)
    const nextIndex = index < this.optionTargets.length - 1 ? index + 1 : 0
    this.optionTargets[nextIndex]?.focus()
  }

  focusPreviousOption() {
    const focused = document.activeElement
    const index = this.optionTargets.indexOf(focused)
    const prevIndex = index > 0 ? index - 1 : this.optionTargets.length - 1
    this.optionTargets[prevIndex]?.focus()
  }

  dispatchChangeEvent() {
    const event = new CustomEvent("select:change", {
      bubbles: true,
      detail: {
        name: this.nameValue,
        value: this.inputTarget.value
      }
    })
    this.element.dispatchEvent(event)

    this.inputTarget.dispatchEvent(new Event("change", { bubbles: true }))
  }
}
