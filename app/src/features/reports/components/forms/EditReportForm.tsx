import React from "react";
import { EditReportFormProps } from "../../types/Report";
import { LocationSelect } from "../common/LocationSelect";
import { BasicInfoFields } from "../common/BasicInfoFields";
import { IdentificationFields } from "../common/IdentificationFields";
import { ColorFields } from "../common/ColorFields";
import { ImageUpload } from "../common/ImageUpload";
import ActionButtons from "../common/ActionButtons";
import DateDisplay from "../common/DateDisplay";
import { createMapLocation } from "../../../../shared/utils/mapUtils";
import { MAP_ZOOM_LEVELS } from "../../../../shared/constants/map";

const EditReportForm:  = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleSaveChanges,
  handleCancelChanges,
  isSaving,
  imageSrc,
  handleImageLoad,
  handleImageError,
  handleLocationSelect
}) => {

  return (
    <form id="edit-report-form" onSubmit={handleSaveChanges} className="space-y-4">
      <ActionButtons
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />

      <BasicInfoFields formData={formData} onInputChange={handleInputChange} readOnly={isSaving} />

      <ImageUpload
        onFileChange={handleFileChange}
        preview={imageSrc}
        disabled={isSaving}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        required={false}
      />

      <IdentificationFields
        formData={formData}
        onInputChange={handleInputChange}
        isLoading={isSaving}
        error=""
      />

      <ColorFields
        formData={formData}
        isLoading={isSaving}
        handleColor1Change={value => handleInputChange({ target: { name: "color1", value } })}
        handleColor2Change={value => handleInputChange({ target: { name: "color2", value } })}
        handleColor3Change={value => handleInputChange({ target: { name: "color3", value } })}
      />

      <LocationSelect
        onLocationSelect={handleLocationSelect}
        initialLocation={createMapLocation({
          latitude: formData.latitude ?? 0,
          longitude: formData.longitude ?? 0,
          area: formData.area ?? "",
          state: formData.state ?? "",
          country: formData.country ?? "",
          intersection: formData.intersection ?? ""
        })}
        isLoading={isSaving}
        required={false}
      />

      <DateDisplay createdAt={formData.createdAt ?? ""} updatedAt={formData.updatedAt ?? ""} />
    </form>
  );
};

export default EditReportForm;
