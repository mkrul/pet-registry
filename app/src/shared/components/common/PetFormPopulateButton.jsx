import React from "react";
import { Button } from "@mui/material";

const generateMicrochipId = () => {
  const prefix = "985";
  const remainingDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + remainingDigits;
};

export const PetFormPopulateButton = ({
  setFormData,
  handleImageSelect
}) => {
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

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <Button
      variant="outlined"
      color="secondary"
      onClick={populateFormWithDummyData}
      className="mb-4"
    >
      Populate Form (Dev Only)
    </Button>
  );
};

