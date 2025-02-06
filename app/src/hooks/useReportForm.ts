import React, { useState, useEffect } from "react";
import { SelectChangeEvent } from "@mui/material";
import { ReportPropsForm } from "../types/Report";
import { Species } from "../lib/reports/breedList";

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

  const handleInputChange = (
    e:
      | SelectChangeEvent
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string | null } }
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpeciesChange = (species: Species) => {
    setFormData(prev => ({
      ...prev,
      species,
      breed1: "",
      breed2: null
    }));
    setShowBreed2(false);
  };

  const handleLocationSelect = (location: {
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
  };

  const initializeColors = () => {
    if (formData.color2) {
      setShowColor2(true);
    }
    if (formData.color3) {
      setShowColor3(true);
    }
  };

  const removeColor2 = () => {
    setFormData(prev => ({ ...prev, color2: null }));
    setShowColor2(false);
  };

  const removeColor3 = () => {
    setFormData(prev => ({ ...prev, color3: null }));
    setShowColor3(false);
  };

  const handleColor1Change = (value: string) => {
    setFormData(prev => ({ ...prev, color1: value }));
  };

  const handleColor2Change = (value: string) => {
    setFormData(prev => ({ ...prev, color2: value }));
  };

  const handleColor3Change = (value: string) => {
    setFormData(prev => ({ ...prev, color3: value }));
  };

  const handleImageSelect = (file: File, preview: string) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };

  const removeBreed2 = () => {
    setFormData(prev => ({ ...prev, breed2: null }));
    setShowBreed2(false);
  };

  const showBreed2Field = () => setShowBreed2(true);
  const showColor2Field = () => setShowColor2(true);
  const showColor3Field = () => setShowColor3(true);

  const handleImageLoad = () => {};
  const handleImageError = () => {};

  useEffect(() => {
    initializeColors();
  }, [formData.color2, formData.color3]);

  return {
    formData,
    setFormData,
    selectedImage,
    imagePreview,
    showBreed2,
    showColor2,
    showColor3,
    handleInputChange,
    handleLocationSelect,
    removeColor2,
    removeColor3,
    handleColor1Change,
    handleColor2Change,
    handleColor3Change,
    handleImageSelect,
    removeBreed2,
    showBreed2Field,
    showColor2Field,
    showColor3Field,
    handleImageLoad,
    handleImageError
  };
};
