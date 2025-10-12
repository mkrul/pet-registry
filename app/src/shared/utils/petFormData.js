
export const createPetFormData = (
  formData,
  selectedImage
) => {
  console.log("[createPetFormData] Input formData:", formData);
  console.log("[createPetFormData] Input selectedImage:", selectedImage);

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

  console.log("[createPetFormData] Transformed data object:", data);

  Object.entries(data).forEach(([key, value]) => {
    const valueToAppend = value !== null && value !== undefined ? value.toString() : "";
    console.log(`[createPetFormData] Appending ${key}: "${valueToAppend}"`);
    formDataToSend.append(key, valueToAppend);
  });

  if (selectedImage) {
    console.log("[createPetFormData] Appending image:", {
      name: selectedImage.name,
      type: selectedImage.type,
      size: selectedImage.size
    });
    formDataToSend.append("image", selectedImage);
  } else {
    console.warn("[createPetFormData] No image provided");
  }

  return formDataToSend;
};
