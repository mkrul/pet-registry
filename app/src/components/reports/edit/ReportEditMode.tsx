import React from "react";
import { ReportEditModeProps } from "../../../types/Report";
import formatDate from "../../../lib/formatDate";
import { LocationSelect } from "../form/LocationSelect";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { IdentificationFields } from "../form/IdentificationFields";
import { ColorFields } from "../form/ColorFields";
import { ImageUpload } from "../form/ImageUpload";
import ActionButtons from "../form/ActionButtons";
import { MAP_ZOOM_LEVELS } from "../../../constants/map";

const ReportEditMode: React.FC<ReportEditModeProps> = ({
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
    <form id="edit-report-form" onSubmit={handleSaveChanges} className="space-y-6">
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
      />

      <IdentificationFields
        formData={formData}
        showBreed2={showBreed2}
        onInputChange={handleInputChange}
        setShowBreed2={setShowBreed2}
        onBreed2Remove={removeBreed}
        isLoading={isSaving}
      />

      <ColorFields
        formData={formData}
        showColor2={showColor2}
        showColor3={showColor3}
        onInputChange={handleInputChange}
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
      />

      <LocationSelect
        onLocationSelect={handleLocationSelect}
        initialLocation={{
          latitude: formData.latitude ?? 0,
          longitude: formData.longitude ?? 0,
          area: formData.area ?? "",
          state: formData.state ?? "",
          country: formData.country ?? "",
          intersection: formData.intersection ?? ""
        }}
        isLoading={isSaving}
        zoomLevel={MAP_ZOOM_LEVELS.EDIT}
      />

      {/* Dates */}
      <div className="space-y-2">
        <div className="flex gap-8">
          <div>
            <label className="text-lg font-medium text-gray-900 mb-2">Posted at:</label>
            <p className="text-md text-gray-500 mb-4">
              {formData.createdAt ? formatDate(formData.createdAt) : ""}
            </p>
          </div>
          <div>
            <label className="text-lg font-medium text-gray-900 mb-2">Updated at:</label>
            <p className="text-md text-gray-500 mb-4">
              {formData.updatedAt ? formatDate(formData.updatedAt) : ""}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReportEditMode;
