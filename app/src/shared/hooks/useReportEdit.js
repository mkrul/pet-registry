import { useState, useEffect } from "react";
import { useUpdateReportMutation } from "../../store/features/reports/reportsApi.js";
import { getColorOptions } from "../reports/colorList.js";
import { getBreedsBySpecies } from "../reports/breedList.js";
import { getGenderOptions } from "../reports/genderList.js";
import { getSpeciesOptions } from "../reports/speciesList.js";
import { transformToSnakeCase, transformToCamelCase } from "../apiHelpers.js";

export const useReportEdit = (report) => {
  const [formData, setFormData] = useState(() => {
    const initialData = { ...report };
    if (report.lastSeenLocation) {
      initialData.area = report.lastSeenLocation.area;
      initialData.state = report.lastSeenLocation.state;
      initialData.country = report.lastSeenLocation.country;
      initialData.latitude = report.lastSeenLocation.latitude;
      initialData.longitude = report.lastSeenLocation.longitude;
      initialData.intersection = report.lastSeenLocation.intersection;
    }
    return initialData;
  });

  useEffect(() => {
    const updatedFormData = { ...report };
    if (report.lastSeenLocation) {
      updatedFormData.area = report.lastSeenLocation.area;
      updatedFormData.state = report.lastSeenLocation.state;
      updatedFormData.country = report.lastSeenLocation.country;
      updatedFormData.latitude = report.lastSeenLocation.latitude;
      updatedFormData.longitude = report.lastSeenLocation.longitude;
      updatedFormData.intersection = report.lastSeenLocation.intersection;
    }
    setFormData(updatedFormData);
    setImageSrc(report.image?.variantUrl || "/images/placeholder.png");
  }, [report]);

  const [newImageFile, setNewImageFile] = useState(null);
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || "/images/placeholder.png");
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const hasAssociatedPet = report.petId !== null && report.petId !== undefined;

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (hasAssociatedPet) {
      setShowConfirmModal(true);
      return { pending: true };
    }

    return await performSave();
  };

  const performSave = async () => {
    setIsSaving(true);
    setShowConfirmModal(false);

    const formDataToSend = new FormData();
    const snakeCaseData = transformToSnakeCase(formData);

    const excludedFields = [
      "id", "image", "created_at", "updated_at",
      "recently_updated", "recently_created", "user_id",
      "area", "state", "country", "latitude", "longitude", "intersection",
      "last_seen_location", "pet_id"
    ];

    Object.entries(snakeCaseData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && !excludedFields.includes(key)) {
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

  const handleConfirmSave = async () => {
    return await performSave();
  };

  const handleCancelSave = () => {
    setShowConfirmModal(false);
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
    getFilteredColorOptions,
    showConfirmModal,
    handleConfirmSave,
    handleCancelSave,
    hasAssociatedPet
  };
};
