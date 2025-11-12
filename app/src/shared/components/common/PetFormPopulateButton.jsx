import React from "react";
import { useAppSelector } from "../../../store/hooks.js";

const generateMicrochipId = () => {
  const prefix = "985";
  const remainingDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + remainingDigits;
};

export const PetFormPopulateButton = ({
  setFormData,
  handleImageSelect,
  className = "mb-4"
}) => {
  const user = useAppSelector(state => state.auth.user);
  const isAdmin = !!user?.admin;

  const loadDummyImage = () => {
    fetch("/images/cat.png")
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "cat.png", { type: "image/png" });
        handleImageSelect(file, "");
        const reader = new FileReader();
        reader.onloadend = () => handleImageSelect(file, reader.result);
        reader.readAsDataURL(file);
      });
  };

  const populateFormWithDummyData = () => {
    setFormData({
      name: "Whiskers",
      species: "Cat",
      breed1: "Domestic Shorthair",
      breed2: "",
      gender: "Female",
      isAltered: true,
      microchipId: generateMicrochipId(),
      color1: "Orange",
      color2: "White",
      color3: "",
      image: {
        id: "1",
        url: "/images/cat.png",
        thumbnailUrl: "/images/cat-thumbnail.png",
        variantUrl: "/images/cat-variant.png",
        filename: "cat.png",
        publicId: "cat"
      }
    });

    loadDummyImage();
  };

  if (process.env.NODE_ENV !== "development" || !isAdmin) return null;

  return (
    <button
      type="button"
      onClick={populateFormWithDummyData}
      className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors border border-purple-200 bg-purple-100 text-purple-700 hover:bg-purple-200 hover:border-purple-300 dark:border-purple-700 dark:bg-purple-700/30 dark:text-purple-200 dark:hover:bg-purple-600/40 dark:hover:border-purple-600 ${className}`}
    >
      Form Fill (Dev Only)
    </button>
  );
};

