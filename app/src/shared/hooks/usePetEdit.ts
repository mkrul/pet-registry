import { useState, useEffect } from "react";
import { useUpdatePetMutation } from "../../store/features/pets/petsApi";
import { getColorOptions } from "../reports/colorList";
import { getBreedsBySpecies } from "../reports/breedList";
import { getGenderOptions } from "../reports/genderList";
import { getSpeciesOptions } from "../reports/speciesList";
import { PetProps } from "../types/Pet";
import { transformToSnakeCase } from "../apiHelpers";
import { SelectChangeEvent } from "@mui/material";

export const usePetEdit = (pet: PetProps) => {
  const [formData, setFormData] = useState(pet);

  useEffect(() => {
    setFormData(pet);
    setImageSrc(pet.image?.variantUrl || "/images/placeholder.png");
  }, [pet]);

  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState(pet.image?.variantUrl || "/images/placeholder.png");
  const [isSaving, setIsSaving] = useState(false);

  const [updatePet] = useUpdatePetMutation();

  const speciesOptions = getSpeciesOptions();
  const colorOptions = getColorOptions();
  const breedOptions = formData.species
    ? getBreedsBySpecies(formData.species.toLowerCase() as "dog" | "cat")
    : [];
  const genderOptions = getGenderOptions();

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | SelectChangeEvent
      | {
          target: { name: string; value: string | boolean | null };
        }
  ) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const getFilteredBreedOptions = (selectedBreeds: (string | null)[]) => {
    return breedOptions.filter(breed => !selectedBreeds.includes(breed));
  };

  const getFilteredColorOptions = (selectedColors: (string | null)[]) => {
    return colorOptions.filter(color => !selectedColors.includes(color));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
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
      return { success: response };
    } catch (error: any) {
      setIsSaving(false);
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
