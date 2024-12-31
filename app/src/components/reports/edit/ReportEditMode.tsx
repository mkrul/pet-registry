import React from "react";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { IdentificationFields } from "../form/IdentificationFields";
import { ColorFields } from "../form/ColorFields";
import { ImageUpload } from "../form/ImageUpload";
import { ReportLocationSelect } from "../form/ReportLocationSelect";
import { ReportEditModeProps } from "../../../types/Report";

export const ReportEditMode: React.FC<ReportEditModeProps> = ({
  formData,
  onInputChange,
  onBreedChange,
  onBreed2Change,
  onSpeciesChange,
  onShowBreed2Change,
  onShowColor2Change,
  onShowColor3Change,
  onLocationSelect,
  onImageSelect,
  showBreed2,
  showColor2,
  showColor3,
  imagePreview,
  isLoading
}) => (
  <>
    <BasicInfoFields formData={formData} onInputChange={onInputChange} />
    <IdentificationFields
      formData={formData}
      showBreed2={showBreed2}
      onInputChange={onInputChange}
      onBreedChange={onBreedChange}
      onBreed2Change={onBreed2Change}
      onSpeciesChange={onSpeciesChange}
      onShowBreed2Change={onShowBreed2Change}
      isLoading={isLoading}
    />
    <ColorFields
      formData={formData}
      showColor2={showColor2}
      showColor3={showColor3}
      onInputChange={onInputChange}
      onShowColor2Change={onShowColor2Change}
      onShowColor3Change={onShowColor3Change}
      isLoading={isLoading}
    />
    <ImageUpload onImageSelect={onImageSelect} preview={imagePreview} disabled={isLoading} />
    <ReportLocationSelect onLocationSelect={onLocationSelect} />
  </>
);
