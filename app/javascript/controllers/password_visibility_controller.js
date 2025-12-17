import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "iconShow", "iconHide"]

  toggle() {
    const isPassword = this.inputTarget.type === "password"
    this.inputTarget.type = isPassword ? "text" : "password"

    if (this.hasIconShowTarget && this.hasIconHideTarget) {
      this.iconShowTarget.classList.toggle("hidden", !isPassword)
      this.iconHideTarget.classList.toggle("hidden", isPassword)
    }
  }
}
