
export const createFormData = (
  formData,
  selectedImage,
  petId
) => {
  const formDataToSend = new FormData();
  const data = {
    title: formData.title,
    description: formData.description,
    name: formData.name,
    gender: formData.gender,
    species: formData.species?.toLowerCase() || "",
    breed_1: formData.breed1,
    breed_2: formData.breed2,
    color_1: formData.color1?.toLowerCase() || "",
    color_2: formData.color2?.toLowerCase() || null,
    color_3: formData.color3?.toLowerCase() || null,
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
    // Always send the value, even if it's an empty string, so validations can be triggered
    formDataToSend.append(key, value !== null && value !== undefined ? value.toString() : "");
  });

  if (petId) {
    formDataToSend.append("pet_id", petId.toString());
  }

  if (selectedImage) {
    formDataToSend.append("image", selectedImage);
  }

  return formDataToSend;
};
