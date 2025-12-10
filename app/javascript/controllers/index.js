import { application } from "./application";

import HelloController from "./hello_controller";
import DropdownController from "./dropdown_controller";
import ModalController from "./modal_controller";
import ToastController from "./toast_controller";
import ThemeController from "./theme_controller";
import FormController from "./form_controller";
import ImageUploadController from "./image_upload_controller";

application.register("hello", HelloController);
application.register("dropdown", DropdownController);
application.register("modal", ModalController);
application.register("toast", ToastController);
application.register("theme", ThemeController);
application.register("form", FormController);
application.register("image-upload", ImageUploadController);
