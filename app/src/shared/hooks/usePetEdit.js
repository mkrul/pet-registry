import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useUpdatePetMutation } from "../../store/features/pets/petsApi.js";
import { addNotification } from "../../store/features/notifications/notificationsSlice.js";
import { getColorOptions } from "../reports/colorList";
import { getBreedsBySpecies } from "../reports/breedList";
import { getGenderOptions } from "../reports/genderList";
import { getSpeciesOptions } from "../reports/speciesList";
import { transformToSnakeCase } from "../apiHelpers";

export const usePetEdit = (pet) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(pet);

  useEffect(() => {
    setFormData(pet);
    setImageSrc(pet.image?.variantUrl || "/images/placeholder.png");
  }, [pet]);

  const [newImageFile, setNewImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(pet.image?.variantUrl || "/images/placeholder.png");
  const [isSaving, setIsSaving] = useState(false);

  const [updatePet] = useUpdatePetMutation();

  const speciesOptions = getSpeciesOptions();
  const colorOptions = getColorOptions();
  const breedOptions = formData.species
    ? getBreedsBySpecies(formData.species.toLowerCase())
    : [];
  const genderOptions = getGenderOptions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newFormData = { ...prev };

      if (name === "species" && prev.species !== value) {
        newFormData.breed1 = "";
        newFormData.breed2 = null;
      }

      if (name.startsWith("color")) {
        if (value) {
          if (name === "color1") {
            if (value === prev.color2) {
              newFormData.color2 = null;
            }
            if (value === prev.color3) {
              newFormData.color3 = null;
            }
          } else if (name === "color2") {
            if (value === prev.color3) {
              newFormData.color3 = null;
            }
          }
        }
      }

      newFormData[name] = value;
      return newFormData;
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);
      setImageSrc(localUrl);
      setNewImageFile(file);
    }
  };

  const handleImageLoad = () => {};
  const handleImageError = () => {
    if (imageSrc !== "/images/placeholder.png") {
      setImageSrc("/images/placeholder.png");
    }
  };

  const getFilteredBreedOptions = (selectedBreeds) => {
    return breedOptions.filter(breed => !selectedBreeds.includes(breed));
  };

  const getFilteredColorOptions = (selectedColors) => {
    return colorOptions.filter(color => !selectedColors.includes(color));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    const formDataToSend = new FormData();
    const snakeCaseData = transformToSnakeCase(formData);

    Object.entries(snakeCaseData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && key !== "image") {
        formDataToSend.append(key, value.toString());
      }
    });

    if (newImageFile) {
      formDataToSend.append("image", newImageFile);
    }

    try {
      const response = await updatePet({
        id: pet.id,
        data: formDataToSend
      }).unwrap();
      setIsSaving(false);
      dispatch(addNotification({
        type: "SUCCESS",
        message: response.message || "Pet updated successfully"
      }));
      return { success: response };
    } catch (error) {
      setIsSaving(false);
      dispatch(addNotification({
        type: "ERROR",
        message: error.data?.message || "Failed to update pet"
      }));
      return { error: error.data?.message || "Failed to update pet" };
    }
  };

  return {
    formData,
    isSaving,
    imageSrc,
    speciesOptions,
    breedOptions,
    colorOptions,
    genderOptions,
    handleInputChange,
    handleFileChange,
    handleImageLoad,
    handleImageError,
    handleSaveChanges,
    getFilteredBreedOptions,
    getFilteredColorOptions
  };
};
