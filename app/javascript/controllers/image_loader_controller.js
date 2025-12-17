import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["image", "spinner"]
  static values = { placeholder: { type: String, default: "/images/placeholder.png" } }

  connect() {
    if (this.hasImageTarget && this.imageTarget.complete) {
      if (this.imageTarget.naturalWidth > 0) {
        this.loaded()
      } else {
        this.error()
      }
    }
  }

  loaded() {
    this.hideSpinner()
    this.showImage()
  }

  error() {
    const currentSrc = this.imageTarget.src
    if (!currentSrc.includes(this.placeholderValue)) {
      this.imageTarget.src = this.placeholderValue
    } else {
      this.hideSpinner()
      this.showImage()
    }
  }

  hideSpinner() {
    if (this.hasSpinnerTarget) {
      this.spinnerTarget.classList.add("opacity-0")
      this.spinnerTarget.classList.add("pointer-events-none")
    }
  }

  showImage() {
    this.imageTarget.classList.remove("opacity-0")
    this.imageTarget.classList.add("opacity-100")
  }
}
