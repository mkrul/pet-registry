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

import SelectController from "@controllers/select_controller"
import SearchPanelController from "@controllers/search_panel_controller"
import FilterController from "@controllers/filter_controller"
import CollapsibleController from "@controllers/collapsible_controller"
import ImageLoaderController from "@controllers/image_loader_controller"
import ImageModalController from "@controllers/image_modal_controller"
import ConfirmModalController from "@controllers/confirm_modal_controller"
import ExternalLinkController from "@controllers/external_link_controller"
import TipExpanderController from "@controllers/tip_expander_controller"
import TruncationController from "@controllers/truncation_controller"
import TipFormController from "@controllers/tip_form_controller"
import TipPromptController from "@controllers/tip_prompt_controller"
import ConversationController from "@controllers/conversation_controller"

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

application.register("select", SelectController)
application.register("search-panel", SearchPanelController)
application.register("filter", FilterController)
application.register("collapsible", CollapsibleController)
application.register("image-loader", ImageLoaderController)
application.register("image-modal", ImageModalController)
application.register("confirm-modal", ConfirmModalController)
application.register("external-link", ExternalLinkController)
application.register("tip-expander", TipExpanderController)
application.register("truncation", TruncationController)
application.register("tip-form", TipFormController)
application.register("tip-prompt", TipPromptController)
application.register("conversation", ConversationController)
