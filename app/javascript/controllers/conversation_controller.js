import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = { reportId: Number }
  static targets = ["button"]

  async startConversation(event) {
    event.preventDefault()

    if (this.hasButtonTarget) {
      this.buttonTarget.disabled = true
      this.buttonTarget.textContent = "Starting..."
    }

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")

      const response = await fetch(`/api/reports/${this.reportIdValue}/start_conversation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {})
        },
        credentials: "include"
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to start conversation")
      }

      this.showNotification("success", "Conversation started")

      window.Turbo.visit(`/dashboard/messages/${data.id}`)
    } catch (error) {
      this.showNotification("error", error.message || "Failed to start conversation")

      if (this.hasButtonTarget) {
        this.buttonTarget.disabled = false
        this.buttonTarget.textContent = "Start a Conversation"
      }
    }
  }

  showNotification(type, message) {
    const flashContainer = document.getElementById("flash_messages")
    if (!flashContainer) return

    const alertClass = type === "success"
      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"

    const toast = document.createElement("div")
    toast.className = `max-w-7xl mx-auto px-4 mt-4`
    toast.setAttribute("data-controller", "toast")
    toast.setAttribute("data-toast-auto-dismiss-value", "true")
    toast.setAttribute("data-toast-delay-value", "5000")

    toast.innerHTML = `
      <div class="${alertClass} border rounded-md p-4 flex justify-between items-center">
        <span>${message}</span>
        <button type="button" data-action="click->toast#dismiss" class="text-current opacity-70 hover:opacity-100">
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `

    flashContainer.appendChild(toast)
  }
}
