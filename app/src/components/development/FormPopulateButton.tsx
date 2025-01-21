import React from "react";
import { Button } from "@mui/material";
import { ReportFormData } from "../../types/Report";

interface FormPopulateButtonProps {
  setFormData: (data: ReportFormData) => void;
  setSelectedImage: (file: File | null) => void;
  setImagePreview: (preview: string | null) => void;
  setShowBreed2: (show: boolean) => void;
  setShowColor2: (show: boolean) => void;
  setShowColor3: (show: boolean) => void;
}

const generateMicrochipId = () => {
  // Format: 15 digits, starting with 985 (standard prefix)
  const prefix = '985';
  const remainingDigits = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
  return prefix + remainingDigits;
};

export const FormPopulateButton: React.FC<FormPopulateButtonProps> = ({
  setFormData,
  setSelectedImage,
  setImagePreview,
  setShowBreed2,
  setShowColor2,
  setShowColor3
}) => {
  const populateFormWithDummyData = () => {
    setFormData({
      title: "Lost Golden Retriever",
      description: "Our beloved dog Max went missing from our backyard. He's very friendly and loves treats. Last seen wearing a blue collar.",
      name: "Max",
      species: "Dog",
      breed1: "Golden Retriever",
      breed2: "",
      gender: "Male",
      microchipId: generateMicrochipId(),
      color1: "Cream",
      color3: "",
      area: "Portland",
      state: "Oregon",
      country: "United States",
      latitude: 45.5155,
      longitude: -122.6789,
      intersection: "SE Main St at SE 2nd Ave",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    fetch('/images/golden-retriever.png')
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "golden-retriever.png", { type: "image/png" });
        setSelectedImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
      });

    setShowBreed2(false);
    setShowColor2(true);
    setShowColor3(false);
  };

  if (process.env.NODE_ENV !== 'development') return null;

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