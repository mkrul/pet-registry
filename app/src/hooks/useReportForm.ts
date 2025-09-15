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
  const [imagePreview, setImagePreview] = useState<string>("");
  const [showBreed2, setShowBreed2] = useState(!!initialData?.breed2);
  const [showColor2, setShowColor2] = useState(false);
  const [showColor3, setShowColor3] = useState(false);

  const initializeColors = useCallback(() => {
    if (formData.color2) {
      setShowColor2(true);
    }
    if (formData.color3) {
      setShowColor3(true);
    }
  }, [formData.color2, formData.color3]);

  useEffect(() => {
    initializeColors();
  }, [initializeColors]);

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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    // Hide breed2 field if it's cleared
    if (e.target.name === "breed2" && !e.target.value) {
      setShowBreed2(false);
    }
  }, []);

  const handleLocationSelect = useCallback((location: LocationData) => {
    setFormData(prev => ({ ...prev, ...location }));
  }, []);

  const showField = (setter: Dispatch<SetStateAction<boolean>>) => () => setter(true);


  const handleColorChange = useCallback(
    (colorField: "color1" | "color2" | "color3") => (value: string) => {
      setFormData(prev => ({ ...prev, [colorField]: value }));

      // Hide the field if it's cleared and it's color2 or color3
      if (!value && colorField === "color2") {
        setShowColor2(false);
      }
      if (!value && colorField === "color3") {
        setShowColor3(false);
      }
    },
    []
  );

  const handleColor1Change = handleColorChange("color1");
  const handleColor2Change = handleColorChange("color2");
  const handleColor3Change = handleColorChange("color3");

  const showBreed2Field = showField(setShowBreed2);
  const showColor2Field = showField(setShowColor2);
  const showColor3Field = showField(setShowColor3);

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
    setShowBreed2,
    showColor2,
    showColor3,
    showBreed2Field,
    showColor2Field,
    showColor3Field,

    // Color handling
    handleColor1Change,
    handleColor2Change,
    handleColor3Change
  };
};
