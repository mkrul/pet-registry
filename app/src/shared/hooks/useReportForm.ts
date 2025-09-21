import { useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";
import { SelectChangeEvent } from "@mui/material";
import { ReportPropsForm, LocationData } from "../types/redux/features/reports/ReportsApi";
import { FormInputEvent } from "../types/forms/FormEvent";
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
    isAltered: null,
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
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image?.variantUrl || "");

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };
  const handleImageLoad = () => {};
  const handleImageError = () => {};

  const getInitialLocation = useCallback(
    () =>
      formData.latitude && formData.longitude
        ? createMapLocation(adaptFormDataToLocation(formData))
        : undefined,
    [formData]
  );

  const handleInputChange = useCallback((e: FormInputEvent) => {
    setFormData(prev => {
      const newData = { ...prev, [e.target.name]: e.target.value };

      if (e.target.name === "species" && prev.species !== e.target.value) {
        newData.breed1 = "";
        newData.breed2 = "";
      }

      return newData;
    });
  }, []);

  const handleLocationSelect = useCallback((location: LocationData) => {
    setFormData(prev => ({ ...prev, ...location }));
  }, []);

  const handleColor1Change = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, color1: value }));
  }, []);

  const handleColor2Change = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, color2: value }));
  }, []);

  const handleColor3Change = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, color3: value }));
  }, []);

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

    // Color handling
    handleColor1Change,
    handleColor2Change,
    handleColor3Change
  };
};
