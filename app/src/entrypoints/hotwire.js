import "@hotwired/turbo-rails"
import { Application } from "@hotwired/stimulus"

import ThemeController from "@controllers/theme_controller"
import DropdownController from "@controllers/dropdown_controller"
import ModalController from "@controllers/modal_controller"
import ToastController from "@controllers/toast_controller"
import FormController from "@controllers/form_controller"
import PasswordVisibilityController from "@controllers/password_visibility_controller"
import FormSubmitController from "@controllers/form_submit_controller"
import FormValidationController from "@controllers/form_validation_controller"
import MobileMenuController from "@controllers/mobile_menu_controller"
import ProfileDropdownController from "@controllers/profile_dropdown_controller"

const application = Application.start()
application.debug = false
window.Stimulus = application

application.register("theme", ThemeController)
application.register("dropdown", DropdownController)
application.register("modal", ModalController)
application.register("toast", ToastController)
application.register("form", FormController)
application.register("password-visibility", PasswordVisibilityController)
application.register("form-submit", FormSubmitController)
application.register("form-validation", FormValidationController)
application.register("mobile-menu", MobileMenuController)
application.register("profile-dropdown", ProfileDropdownController)
