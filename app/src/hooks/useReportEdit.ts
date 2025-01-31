import { useState } from "react";
import { useUpdateReportMutation } from "../redux/features/reports/reportsApi";
import { getColorOptions } from "../lib/reports/colorList";
import { getBreedsBySpecies } from "../lib/reports/breedList";
import { getGenderOptions } from "../lib/reports/genderList";
import { getSpeciesOptions } from "../lib/reports/speciesList";
import { validateReportForm } from "../services/validation/ReportFormValidation";
import { ReportProps } from "../types/Report";
import { transformToSnakeCase } from "../lib/apiHelpers";
import { SelectChangeEvent } from "@mui/material";

export const useReportEdit = (report: ReportProps) => {
  const [formData, setFormData] = useState(report);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || "/images/placeholder.png");
  const [showBreed2, setShowBreed2] = useState(!!formData.breed2);
  const [showColor2, setShowColor2] = useState(!!formData.color2);
  const [showColor3, setShowColor3] = useState(!!formData.color3);
  const [isSaving, setIsSaving] = useState(false);

  const [updateReport] = useUpdateReportMutation();

  const speciesOptions = getSpeciesOptions();
  const colorOptions = getColorOptions();
  const breedOptions = formData.species
    ? getBreedsBySpecies(formData.species.toLowerCase() as "dog" | "cat")
    : [];
  const genderOptions = getGenderOptions();
  const VIEW_ZOOM_LEVEL = 15;

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | {
          target: { name: string; value: string | null };
        }
  ) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const newFormData = { ...prev };

      // Handle color-specific logic
      if (name.startsWith("color")) {
        if (value) {
          if (name === "color1") {
            if (value === prev.color2) {
              newFormData.color2 = null;
              setShowColor2(false);
            }
            if (value === prev.color3) {
              newFormData.color3 = null;
              setShowColor3(false);
            }
          } else if (name === "color2") {
            if (value === prev.color3) {
              newFormData.color3 = null;
              setShowColor3(false);
            }
          }
        }
      }

      // Handle species change - reset breeds if species changes
      if (name === "species") {
        newFormData.breed1 = "";
        newFormData.breed2 = null;
        setShowBreed2(false);
      }

      // Update the field value
      (newFormData as any)[name] = value;
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

  const addBreed = () => setShowBreed2(true);
  const removeBreed = () => {
    setShowBreed2(false);
    setFormData(prev => ({ ...prev, breed2: null }));
  };

  const addColor = () => {
    if (!showColor2) setShowColor2(true);
    else if (!showColor3) setShowColor3(true);
  };

  const removeColor = (colorIndex: number) => {
    if (colorIndex === 1) {
      if (formData.color3) {
        setFormData(prev => ({
          ...prev,
          color2: formData.color3,
          color3: null
        }));
        setShowColor3(false);
      } else {
        setFormData(prev => ({ ...prev, color2: null }));
        setShowColor2(false);
      }
    } else if (colorIndex === 2) {
      setFormData(prev => ({ ...prev, color3: null }));
      setShowColor3(false);
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
    intersection: string | null;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...location
    }));
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

    const validationError = validateReportForm(formData, newImageFile);
    if (validationError) {
      setIsSaving(false);
      return { error: validationError as string };
    }

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
      return { success: response };
    } catch (error: any) {
      setIsSaving(false);
      return { error: error.data?.message || "Failed to update report" };
    }
  };

  return {
    formData,
    isSaving,
    imageSrc,
    showBreed2,
    showColor2,
    showColor3,
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
    addBreed,
    removeBreed,
    addColor,
    removeColor,
    handleLocationSelect,
    getFilteredBreedOptions,
    getFilteredColorOptions
  };
};
