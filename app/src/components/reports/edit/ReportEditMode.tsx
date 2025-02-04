import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FormControl, Select, MenuItem, TextField, SelectChangeEvent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Map from "../../common/Map";
import Spinner from "../../common/Spinner";
import { ReportEditModeProps } from "../../../types/Report";
import formatDate from "../../../lib/formatDate";
import BreedSearch from "../../common/BreedSearch";
import LocationDisplay from "../../common/LocationDisplay";
import { LocationSelect } from "../form/LocationSelect";
import { commonInputStyles } from "../../../styles/commonStyles";
import Tip from "../../common/Tip";
import { BasicInfoFields } from "../form/BasicInfoFields";
import { IdentificationFields } from "../form/IdentificationFields";
import { ColorFields } from "../form/ColorFields";
import { ImageUpload } from "../form/ImageUpload";
import ActionButtons from "../form/ActionButtons";

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
  showColor2,
  showColor3,
  addBreed,
  removeBreed,
  addColor,
  removeColor,
  handleLocationSelect,
  speciesOptions,
  breedOptions,
  getFilteredBreedOptions,
  colorOptions,
  getFilteredColorOptions,
  genderOptions,
  VIEW_ZOOM_LEVEL
}) => {
  return (
    <form id="edit-report-form" onSubmit={handleSaveChanges} className="space-y-6">
      <ActionButtons
        isSaving={isSaving}
        onSave={handleSaveChanges}
        onCancel={handleCancelChanges}
      />

      <BasicInfoFields formData={formData} onInputChange={handleInputChange} readOnly={isSaving} />

      <ImageUpload
        onImageSelect={(file, preview) => {
          const event = new Event("change", {
            bubbles: true
          }) as unknown as React.ChangeEvent<HTMLInputElement>;
          Object.defineProperty(event, "target", {
            writable: false,
            value: { files: [file] }
          });
          handleFileChange(event);
        }}
        preview={imageSrc}
        disabled={isSaving}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
      />

      <IdentificationFields
        formData={formData}
        showBreed2={showBreed2}
        onInputChange={handleInputChange}
        onBreedChange={breed => {
          const event = {
            target: { name: "breed1", value: breed }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(event);
        }}
        onBreed2Change={breed => {
          const event = {
            target: { name: "breed2", value: breed }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(event);
        }}
        onSpeciesChange={species => {
          const event = {
            target: { name: "species", value: species }
          } as React.ChangeEvent<HTMLInputElement>;
          handleInputChange(event);
        }}
        onShowBreed2Change={show => {
          if (!show) {
            const event = {
              target: { name: "breed2", value: "" }
            } as React.ChangeEvent<HTMLInputElement>;
            handleInputChange(event);
          }
          removeBreed();
        }}
        isLoading={isSaving}
      />

      {/* Colors */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Colors:</label>
        <ColorFields
          formData={formData}
          showColor2={showColor2}
          showColor3={showColor3}
          onInputChange={handleInputChange}
          onShowColor2Change={show => {
            if (!show) {
              const event = {
                target: { name: "color2", value: null }
              };
              handleInputChange(event);
            }
            removeColor(1);
          }}
          onShowColor3Change={show => {
            if (!show) {
              const event = {
                target: { name: "color3", value: null }
              };
              handleInputChange(event);
            }
            removeColor(2);
          }}
          isLoading={isSaving}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <LocationSelect
          onLocationSelect={handleLocationSelect}
          initialLocation={{
            latitude: formData.latitude || 0,
            longitude: formData.longitude || 0,
            area: formData.area || "",
            state: formData.state || "",
            country: formData.country || "",
            intersection: formData.intersection || null
          }}
        />
      </div>

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
