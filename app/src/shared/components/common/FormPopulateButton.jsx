import React from "react";
import { useAppSelector } from "../../../store/hooks.js";


const generateMicrochipId = () => {
  const prefix = "985";
  const remainingDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + remainingDigits;
};

export const FormPopulateButton = ({
  setFormData,
  handleImageSelect,
  className = "mb-4"
}) => {
  const user = useAppSelector(state => state.auth.user);
  const isAdmin = !!user?.admin;

  const loadDummyImage = () => {
    fetch("/images/golden-retriever.png")
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "golden-retriever.png", { type: "image/png" });
        handleImageSelect(file, "");
        const reader = new FileReader();
        reader.onloadend = () => handleImageSelect(file, reader.result);
        reader.readAsDataURL(file);
      });
  };

  const populateFormWithDummyData = () => {
    setFormData({
      title: "Lost Golden Retriever",
      description:
        "Our beloved dog Max went missing from our backyard. He's very friendly and loves treats. Last seen wearing a blue collar.",
      name: "Max",
      species: "Dog",
      breed1: "Golden Retriever",
      breed2: "",
      gender: "Male",
      isAltered: true,
      microchipId: generateMicrochipId(),
      color1: "Cream",
      color2: "",
      color3: "",
      area: "Cedar Bluff",
      state: "Virginia",
      country: "United States",
      latitude: 37.269039,
      longitude: -79.931999,
      intersection: "7th Street Southeast at 6th Street Southeast",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      image: {
        id: "1",
        url: "/images/golden-retriever.png",
        thumbnailUrl: "/images/golden-retriever-thumbnail.png",
        variantUrl: "/images/golden-retriever-variant.png",
        filename: "golden-retriever.png",
        publicId: "golden-retriever"
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
