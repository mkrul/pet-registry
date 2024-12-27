import React from "react";
import { BasicInfoFields } from "./BasicInfoFields";
import { IdentificationFields } from "./IdentificationFields";
import { ColorFields } from "./ColorFields";
import { ImageUpload } from "./ImageUpload";
import { ReportLocationSelect } from "./ReportLocationSelect";
import { IReportForm } from "../../types/Report";
import { SelectChangeEvent } from "@mui/material";
import { Species } from "../../lib/reports/breedLists";

interface ReportEditModeProps {
  formData: IReportForm;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent
      | { target: { name: string; value: boolean | null } }
  ) => void;
  onBreedChange: (breed: string) => void;
  onBreed2Change: (breed: string) => void;
  onSpeciesChange: (species: Species) => void;
  onShowBreed2Change: (show: boolean) => void;
  onShowColor2Change: (show: boolean) => void;
  onShowColor3Change: (show: boolean) => void;
  onLocationSelect: (location: any) => void;
  onImageSelect: (file: File) => void;
  showBreed2: boolean;
  showColor2: boolean;
  showColor3: boolean;
  imagePreview?: string;
  isLoading: boolean;
}

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
