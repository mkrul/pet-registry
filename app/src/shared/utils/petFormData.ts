import { PetPropsForm } from "../../features/pets/types/Pet";

export const createPetFormData = (
  formData: PetPropsForm,
  selectedImage: File | null
): FormData => {
  const formDataToSend = new FormData();
  const data = {
    name: formData.name,
    gender: formData.gender,
    species: formData.species?.toLowerCase() || "",
    breed_1: formData.breed1,
    breed_2: formData.breed2,
    color_1: formData.color1?.toLowerCase() || "",
    color_2: formData.color2?.toLowerCase() || null,
    color_3: formData.color3?.toLowerCase() || null,
    microchip_id: formData.microchipId,
    is_altered: formData.isAltered
  };

  Object.entries(data).forEach(([key, value]) => {
    formDataToSend.append(key, value !== null && value !== undefined ? value.toString() : "");
  });

  if (selectedImage) {
    formDataToSend.append("image", selectedImage);
  }

  return formDataToSend;
};
