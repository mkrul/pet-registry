import React, { useState } from "react";
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
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | { target: { name: string; value: boolean | null } }
  ) => {
    const { name, value } = e.target;

    if (name === "breed1" && value === formData.breed2) {
      setFormData(prev => ({
        ...prev,
        breed2: null
      }));
      setShowBreed2(false);
      return;
    }

    if (name === "color1" && (value === formData.color2 || value === formData.color3)) {
      if (value === formData.color2) {
        setFormData(prev => ({
          ...prev,
          color2: null
        }));
        setShowColor2(false);
      }
      if (value === formData.color3) {
        setFormData(prev => ({
          ...prev,
          color3: null
        }));
        setShowColor3(false);
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    intersection: string | null;
  }) => {
    setFormData(prev => ({
      ...prev,
      ...location
    }));
  };

  return {
    formData,
    setFormData,
    selectedImage,
    setSelectedImage,
    imagePreview,
    setImagePreview,
    showBreed2,
    setShowBreed2,
    showColor2,
    setShowColor2,
    showColor3,
    setShowColor3,
    handleInputChange,
    handleSpeciesChange,
    handleLocationSelect
  };
};
