import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { ReportPropsForm } from "../types/Report";
import { createMapLocation, adaptFormDataToLocation } from "../utils/mapUtils";

export const useReportForm = (initialData?: Partial<ReportPropsForm>) => {
  const [formData, setFormData] = useState<ReportPropsForm>({
    title: "",
    description: "",
    name: "",
    gender: "",
    species: "",
    breed1: "",
    breed2: null,
    color1: "",
    color2: null,
    color3: null,
    image: {
      id: "",
      url: "",
      thumbnailUrl: "",
      variantUrl: "",
      filename: "",
      publicId: ""
    },
    microchipId: "",
    area: null,
    state: null,
    country: null,
    latitude: null,
    longitude: null,
    intersection: null,
    ...initialData
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showBreed2, setShowBreed2] = useState(false);
  const [showColor2, setShowColor2] = useState(false);
  const [showColor3, setShowColor3] = useState(false);

  const initializeColors = React.useCallback(() => {
    if (formData.color2) {
      setShowColor2(true);
    }
    if (formData.color3) {
      setShowColor3(true);
    }
  }, [formData.color2, formData.color3, setShowColor2, setShowColor3]);

  useEffect(() => {
    initializeColors();
  }, [initializeColors]);

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };
  const handleImageLoad = () => {};
  const handleImageError = () => {};

  const getInitialLocation = React.useCallback(
    () =>
      formData.latitude && formData.longitude
        ? createMapLocation(adaptFormDataToLocation(formData))
        : undefined,
    [formData]
  );

  const handleInputChange = React.useCallback(
    (
      e:
        | SelectChangeEvent
        | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        | { target: { name: string; value: string | null } }
    ) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value === null ? null : value }));
    },
    [setFormData]
  );

  const handleLocationSelect = React.useCallback(
    (location: {
      latitude: number;
      longitude: number;
      area: string;
      state: string;
      country: string;
      intersection: string;
    }) => {
      setFormData(prev => ({
        ...prev,
        ...location
      }));
    },
    [setFormData]
  );

  const showField = (setter: React.Dispatch<React.SetStateAction<boolean>>) => () => setter(true);

  const removeField =
    (
      fieldName: "breed2" | "color2" | "color3",
      setter: React.Dispatch<React.SetStateAction<boolean>>
    ) =>
    () => {
      setFormData(prev => ({ ...prev, [fieldName]: null }));
      setter(false);
    };

  const handleColorChange = React.useCallback(
    (colorField: "color1" | "color2" | "color3") => (value: string) => {
      setFormData(prev => ({ ...prev, [colorField]: value }));
    },
    [setFormData]
  );

  const handleColor1Change = handleColorChange("color1");
  const handleColor2Change = handleColorChange("color2");
  const handleColor3Change = handleColorChange("color3");

  const showBreed2Field = showField(setShowBreed2);
  const showColor2Field = showField(setShowColor2);
  const showColor3Field = showField(setShowColor3);

  const removeBreed2 = removeField("breed2", setShowBreed2);
  const removeColor2 = removeField("color2", setShowColor2);
  const removeColor3 = removeField("color3", setShowColor3);

  return {
    // Form data
    formData,
    setFormData,
    handleInputChange,
    handleLocationSelect,
    getInitialLocation,

    // Image handling
    selectedImage,
    imagePreview,
    handleImageSelect,
    handleImageLoad,
    handleImageError,

    // Visibility state
    showBreed2,
    showColor2,
    showColor3,
    showBreed2Field,
    showColor2Field,
    showColor3Field,

    // Field removal
    removeBreed2,
    removeColor2,
    removeColor3,

    // Color handling
    handleColor1Change,
    handleColor2Change,
    handleColor3Change
  };
};
