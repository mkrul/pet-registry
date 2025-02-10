import React, { Dispatch, SetStateAction } from "react";
import { Button } from "@mui/material";
import { ReportPropsForm } from "../../types/redux/features/reports/ReportsApi";

interface FormPopulateButtonProps {
  setFormData: Dispatch<SetStateAction<ReportPropsForm>>;
  handleImageSelect: (file: File, preview: string) => void;
  showColor2Field: () => void;
}

const generateMicrochipId = () => {
  const prefix = "985";
  const remainingDigits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)).join("");
  return prefix + remainingDigits;
};

export const FormPopulateButton: React.FC<FormPopulateButtonProps> = ({
  setFormData,
  handleImageSelect,
  showColor2Field
}) => {
  const loadDummyImage = () => {
    fetch("/images/golden-retriever.png")
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], "golden-retriever.png", { type: "image/png" });
        handleImageSelect(file, "");
        const reader = new FileReader();
        reader.onloadend = () => handleImageSelect(file, reader.result as string);
        reader.readAsDataURL(file);
      });
  };

  const populateFormWithDummyData = () => {
    console.log("Populating form with altered:", 1);
    setFormData({
      title: "Lost Golden Retriever",
      description:
        "Our beloved dog Max went missing from our backyard. He's very friendly and loves treats. Last seen wearing a blue collar.",
      name: "Max",
      species: "Dog",
      breed1: "Golden Retriever",
      breed2: "",
      gender: "Male",
      altered: 1,
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
