import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "dropzone", "placeholder", "previewContainer", "preview", "filename"]
  static values = {
    maxSize: { type: Number, default: 10485760 }
  }

  connect() {
    this.allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  }

  dragOver(event) {
    event.preventDefault()
    this.dropzoneTarget.classList.add("border-blue-400", "dark:border-blue-500", "bg-blue-50", "dark:bg-blue-900/20")
  }

  dragEnter(event) {
    event.preventDefault()
    this.dropzoneTarget.classList.add("border-blue-400", "dark:border-blue-500", "bg-blue-50", "dark:bg-blue-900/20")
  }

  dragLeave(event) {
    event.preventDefault()
    this.dropzoneTarget.classList.remove("border-blue-400", "dark:border-blue-500", "bg-blue-50", "dark:bg-blue-900/20")
  }

  drop(event) {
    event.preventDefault()
    this.dropzoneTarget.classList.remove("border-blue-400", "dark:border-blue-500", "bg-blue-50", "dark:bg-blue-900/20")

    const files = event.dataTransfer.files
    if (files.length > 0) {
      this.processFile(files[0])
    }
  }

  handleFileSelect(event) {
    const files = event.target.files
    if (files.length > 0) {
      this.processFile(files[0])
    }
  }

  processFile(file) {
    if (!this.validateFile(file)) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      this.showPreview(e.target.result, file.name)
    }
    reader.readAsDataURL(file)

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    this.inputTarget.files = dataTransfer.files
  }

  validateFile(file) {
    if (!this.allowedTypes.includes(file.type)) {
      alert("Please select an image file (JPEG, PNG, GIF, or WebP)")
      return false
    }

    if (file.size > this.maxSizeValue) {
      const maxSizeMB = Math.round(this.maxSizeValue / 1024 / 1024)
      alert(`File size must be less than ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  showPreview(dataUrl, filename) {
    if (this.hasPlaceholderTarget) {
      this.placeholderTarget.classList.add("hidden")
    }

    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.classList.remove("hidden")
    }

    if (this.hasPreviewTarget) {
      this.previewTarget.src = dataUrl
    }

    if (this.hasFilenameTarget) {
      this.filenameTarget.textContent = filename
    }
  }

  remove(event) {
    event.preventDefault()

    this.inputTarget.value = ""

    if (this.hasPreviewContainerTarget) {
      this.previewContainerTarget.classList.add("hidden")
    }

    if (this.hasPlaceholderTarget) {
      this.placeholderTarget.classList.remove("hidden")
    }

    if (this.hasPreviewTarget) {
      this.previewTarget.src = ""
    }

    if (this.hasFilenameTarget) {
      this.filenameTarget.textContent = ""
    }
  }
}
