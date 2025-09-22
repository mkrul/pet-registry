import { useState, useCallback } from "react";

export const usePetForm = (initialData) => {
  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed1: "",
    breed2: null,
    color1: "",
    color2: null,
    color3: null,
    gender: "",
    isAltered: null,
    microchipId: "",
    image: {
      id: "",
      url: "",
      thumbnailUrl: "",
      variantUrl: "",
      filename: "",
      publicId: ""
    },
    ...initialData
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setImagePreview(preview);
  };
  const handleImageLoad = () => {};
  const handleImageError = () => {};

  const handleInputChange = useCallback((e) => {
    setFormData(prev => {
      const newData = { ...prev, [e.target.name]: e.target.value };

      if (e.target.name === "species" && prev.species !== e.target.value) {
        newData.breed1 = "";
        newData.breed2 = "";
      }

      return newData;
    });
  }, []);

  const handleColor1Change = useCallback((value) => {
    setFormData(prev => ({ ...prev, color1: value }));
  }, []);

  const handleColor2Change = useCallback((value) => {
    setFormData(prev => ({ ...prev, color2: value }));
  }, []);

  const handleColor3Change = useCallback((value) => {
    setFormData(prev => ({ ...prev, color3: value }));
  }, []);

  return {
    formData,
    setFormData,
    handleInputChange,
    selectedImage,
    imagePreview,
    handleImageSelect,
    handleImageLoad,
    handleImageError,
    handleColor1Change,
    handleColor2Change,
    handleColor3Change
  };
};
