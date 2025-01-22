import React from "react";
import { Button } from "@mui/material";
import { ReportPropsForm } from "../../types/Report";

interface FormPopulateButtonProps {
  setFormData: (data: ReportPropsForm) => void;
  setSelectedImage: (file: File | null) => void;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  setShowBreed2: (show: boolean) => void;
  setShowColor2: (show: boolean) => void;
  setShowColor3: (show: boolean) => void;
}

const generateMicrochipId = () => {
  const prefix = "985";
  const remainingDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
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
      description:
        "Our beloved dog Max went missing from our backyard. He's very friendly and loves treats. Last seen wearing a blue collar.",
      name: "Max",
      species: "Dog",
      breed1: "Golden Retriever",
      breed2: "",
      gender: "Male",
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      image: {
        id: "1",
        url: "/images/golden-retriever.png",
        thumbnailUrl: "/images/golden-retriever-thumbnail.png",
        variantUrl: "/images/golden-retriever-variant.png",
        filename: "golden-retriever.png",
        publicId: "golden-retriever"
      }
    });

    fetch("/images/golden-retriever.png")
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
