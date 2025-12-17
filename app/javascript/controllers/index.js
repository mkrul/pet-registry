import { application } from "./application"

import ThemeController from "./theme_controller"
import DropdownController from "./dropdown_controller"
import ModalController from "./modal_controller"
import ToastController from "./toast_controller"
import FormController from "./form_controller"
import PasswordVisibilityController from "./password_visibility_controller"
import FormSubmitController from "./form_submit_controller"
import FormValidationController from "./form_validation_controller"
import MobileMenuController from "./mobile_menu_controller"
import ProfileDropdownController from "./profile_dropdown_controller"

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
