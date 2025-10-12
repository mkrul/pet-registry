import { useState, useEffect } from "react";
import { useUpdateReportMutation } from "../../store/features/reports/reportsApi.js";
import { getColorOptions } from "../reports/colorList.js";
import { getBreedsBySpecies } from "../reports/breedList.js";
import { getGenderOptions } from "../reports/genderList.js";
import { getSpeciesOptions } from "../reports/speciesList.js";
import { transformToSnakeCase, transformToCamelCase } from "../apiHelpers.js";

export const useReportEdit = (report) => {
  const [formData, setFormData] = useState(report);

  useEffect(() => {
    setFormData(report);
    setImageSrc(report.image?.variantUrl || "/images/placeholder.png");
  }, [report]);

  const [newImageFile, setNewImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || "/images/placeholder.png");
  const [isSaving, setIsSaving] = useState(false);

  const [updateReport] = useUpdateReportMutation();

  const speciesOptions = getSpeciesOptions();
  const colorOptions = getColorOptions();
  const breedOptions = formData.species
    ? getBreedsBySpecies(formData.species.toLowerCase())
    : [];
  const genderOptions = getGenderOptions();

  const VIEW_ZOOM_LEVEL = 15;

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

  const handleLocationSelect = (location) => {
    setFormData(prev => ({ ...prev, ...location }));
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
      const response = await updateReport({
        id: report.id,
        data: formDataToSend
      }).unwrap();
      setIsSaving(false);
      const transformedReport = transformToCamelCase(response);
      return { success: transformedReport };
    } catch (error) {
      setIsSaving(false);
      return { error: error.data?.message || "Failed to update report" };
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
    VIEW_ZOOM_LEVEL,
    handleInputChange,
    handleFileChange,
    handleImageLoad,
    handleImageError,
    handleSaveChanges,
    handleLocationSelect,
    getFilteredBreedOptions,
    getFilteredColorOptions
  };
};
