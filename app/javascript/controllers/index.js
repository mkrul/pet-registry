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

import SelectController from "./select_controller"
import SearchPanelController from "./search_panel_controller"
import FilterController from "./filter_controller"
import CollapsibleController from "./collapsible_controller"
import ImageLoaderController from "./image_loader_controller"
import ImageModalController from "./image_modal_controller"
import ConfirmModalController from "./confirm_modal_controller"
import ExternalLinkController from "./external_link_controller"
import TipExpanderController from "./tip_expander_controller"
import TruncationController from "./truncation_controller"
import TipFormController from "./tip_form_controller"
import TipPromptController from "./tip_prompt_controller"
import ConversationController from "./conversation_controller"

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
