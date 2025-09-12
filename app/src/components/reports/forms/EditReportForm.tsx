import React from "react";
import { EditReportFormProps } from "../../../types/Report";
import { LocationSelect } from "../common/LocationSelect";
import { BasicInfoFields } from "../common/BasicInfoFields";
import { IdentificationFields } from "../common/IdentificationFields";
import { ColorFields } from "../common/ColorFields";
import { ImageUpload } from "../common/ImageUpload";
import ActionButtons from "../common/ActionButtons";
import DateDisplay from "../common/DateDisplay";
import { createMapLocation } from "../../../utils/mapUtils";
import { MAP_ZOOM_LEVELS } from "../../../constants/map";

const EditReportForm: React.FC<EditReportFormProps> = ({
  formData,
  handleInputChange,
  handleFileChange,
  handleSaveChanges,
  handleCancelChanges,
  isSaving,
  imageSrc,
  handleImageLoad,
  handleImageError,
  showBreed2,
  setShowBreed2,
  showColor2,
  showColor3,
  setShowColor2,
  setShowColor3,
  removeBreed,
  addColor,
  removeColor,
  handleLocationSelect
}) => {
  React.useEffect(() => {
    if (formData.color2) {
      setShowColor2(true);
    }
    if (formData.color3) {
      setShowColor3(true);
    }
  }, [formData.color2, formData.color3, setShowColor2, setShowColor3]);

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
        showBreed2={showBreed2}
        onInputChange={handleInputChange}
        setShowBreed2={setShowBreed2}
        onBreed2Remove={removeBreed}
        isLoading={isSaving}
        error=""
      />

      <ColorFields
        formData={formData}
        showColor2={showColor2}
        showColor3={showColor3}
        setShowColor2={setShowColor2}
        setShowColor3={setShowColor3}
        onColor2Add={() => setShowColor2(true)}
        onColor3Add={() => setShowColor3(true)}
        onColor2Remove={() => {
          handleInputChange({
            target: { name: "color2", value: null }
          });
          setShowColor2(false);
        }}
        onColor3Remove={() => {
          handleInputChange({
            target: { name: "color3", value: null }
          });
          setShowColor3(false);
        }}
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
