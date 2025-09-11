import { ReportPropsForm } from "../types/Report";

interface FormDataOptions {
  showBreed2: boolean;
  showColor2: boolean;
  showColor3: boolean;
}

export const createFormData = (
  formData: ReportPropsForm,
  selectedImage: File | null,
  { showBreed2, showColor2, showColor3 }: FormDataOptions
): FormData => {
  const formDataToSend = new FormData();
  const data = {
    title: formData.title,
    description: formData.description,
    name: formData.name,
    gender: formData.gender,
    species: formData.species.toLowerCase(),
    breed_1: formData.breed1,
    breed_2: showBreed2 && formData.breed2 ? formData.breed2 : null,
    color_1: formData.color1?.toLowerCase(),
    color_2: showColor2 && formData.color2 ? formData.color2.toLowerCase() : null,
    color_3: showColor3 && formData.color3 ? formData.color3.toLowerCase() : null,
    microchip_id: formData.microchipId,
    area: formData.area,
    state: formData.state,
    country: formData.country,
    latitude: formData.latitude,
    longitude: formData.longitude,
    intersection: formData.intersection,
    is_altered: formData.isAltered
  };

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formDataToSend.append(key, value.toString());
    }
  });

  if (selectedImage) {
    formDataToSend.append("image", selectedImage);
  }

  return formDataToSend;
};
