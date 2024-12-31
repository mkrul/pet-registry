import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { FormControl, Select, MenuItem, TextField, Button, SelectChangeEvent } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import Map from "../../common/Map";
import Spinner from "../../common/Spinner";
import { ReportEditModeProps } from "../../../types/Report";
import formatDate from "../../../lib/formatDate";
import BreedSearch from "../../common/BreedSearch";

const commonInputStyles = {
  backgroundColor: "white",
  "& .MuiSelect-select": {
    backgroundColor: "white"
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white"
  },
  "& .MuiButton-outlined": {
    backgroundColor: "white"
  }
};

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
  EDIT_ZOOM_LEVEL
}) => {
  return (
    <form id="edit-report-form" onSubmit={handleSaveChanges} className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          {isSaving ? (
            <div className="flex items-center">
              <Spinner inline size={16} className="mr-2" color="text-white" />
              Saving...
            </div>
          ) : (
            <>
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleCancelChanges}
          disabled={isSaving}
          className="px-4 py-2 border border-blue-500 bg-white text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Title:</label>
        <TextField
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          required
          variant="outlined"
          fullWidth
          disabled={isSaving}
          sx={commonInputStyles}
        />
      </div>

      {/* Image */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Photo:</label>
        <div className="mt-1">
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            disabled={isSaving}
            sx={{ ...commonInputStyles, width: "fit-content" }}
          >
            Choose File
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
              disabled={isSaving}
            />
          </Button>
          {imageSrc && (
            <div className="mt-2 relative w-48 h-48">
              <img
                src={imageSrc}
                alt={formData.title}
                className="object-cover w-full h-full rounded-md"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Description:</label>
        <TextField
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          required
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          disabled={isSaving}
          sx={commonInputStyles}
        />
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Name:</label>
        <TextField
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
          variant="outlined"
          placeholder="Enter name (if known)"
          fullWidth
          disabled={isSaving}
          sx={commonInputStyles}
        />
      </div>

      {/* Species */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Species:</label>
        <FormControl fullWidth>
          <Select
            name="species"
            value={formData.species}
            onChange={handleInputChange}
            required
            disabled={isSaving}
            sx={commonInputStyles}
          >
            {speciesOptions.map((species, index) => (
              <MenuItem key={`${species}-${index}`} value={species}>
                {species}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Breeds */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Breed(s):</label>
        <div className="space-y-3">
          <BreedSearch
            species={formData.species.toLowerCase() as "dog" | "cat"}
            value={formData.breed1}
            onChange={breed => {
              const event = {
                target: { name: "breed1", value: breed }
              } as React.ChangeEvent<HTMLInputElement>;
              handleInputChange(event);
            }}
            disabled={isSaving}
            excludeBreeds={formData.breed2 ? [formData.breed2] : []}
            required
            hideLabel
            size="medium"
            disableClearable
          />

          {showBreed2 ? (
            <div className="flex items-center gap-2">
              <BreedSearch
                species={formData.species.toLowerCase() as "dog" | "cat"}
                value={formData.breed2 || ""}
                onChange={breed =>
                  handleInputChange({
                    target: { name: "breed2", value: breed }
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                disabled={isSaving}
                excludeBreeds={[formData.breed1]}
                size="medium"
                hideLabel
                disableClearable
              />
              <button
                type="button"
                onClick={removeBreed}
                className="text-red-600 hover:text-red-700 p-1 ml-1"
                disabled={isSaving}
                aria-label="Remove Breed"
              >
                <CloseIcon fontSize="medium" />
              </button>
            </div>
          ) : (
            <Button
              onClick={addBreed}
              disabled={isSaving}
              color="primary"
              variant="text"
              className="mt-2"
            >
              + ADD ANOTHER BREED
            </Button>
          )}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Gender:</label>
        <FormControl fullWidth>
          <Select
            name="gender"
            value={formData.gender || ""}
            onChange={handleInputChange}
            disabled={isSaving}
            sx={commonInputStyles}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200
                }
              }
            }}
          >
            {genderOptions.map((gender, index) => (
              <MenuItem key={index} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Microchip ID */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Microchip ID:</label>
        <TextField
          name="microchipId"
          value={formData.microchipId || ""}
          onChange={handleInputChange}
          placeholder="Enter microchip ID (if known)"
          variant="outlined"
          fullWidth
          disabled={isSaving}
          sx={commonInputStyles}
        />
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Colors:</label>
        <div className="space-y-3">
          <FormControl fullWidth>
            <Select
              name="color1"
              value={formData.color1}
              onChange={handleInputChange}
              required
              disabled={isSaving}
              sx={commonInputStyles}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200
                  }
                }
              }}
            >
              {colorOptions.map((color, index) => (
                <MenuItem key={`${color}-${index}`} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {showColor2 ? (
            <div className="flex items-center gap-2">
              <FormControl fullWidth>
                <Select
                  name="color2"
                  value={formData.color2 || ""}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  sx={commonInputStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200
                      }
                    }
                  }}
                >
                  {getFilteredColorOptions([formData.color1]).map((color, index) => (
                    <MenuItem key={`${color}-${index}`} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <button
                type="button"
                onClick={() => removeColor(1)}
                className="text-red-600 hover:text-red-700 p-1 ml-1"
                disabled={isSaving}
                aria-label="Remove Color"
              >
                <CloseIcon fontSize="medium" />
              </button>
            </div>
          ) : null}

          {showColor3 ? (
            <div className="flex items-center gap-2">
              <FormControl fullWidth>
                <Select
                  name="color3"
                  value={formData.color3 || ""}
                  onChange={handleInputChange}
                  disabled={isSaving}
                  sx={commonInputStyles}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 200
                      }
                    }
                  }}
                >
                  {getFilteredColorOptions([
                    formData.color1,
                    ...(formData.color2 ? [formData.color2] : [])
                  ]).map((color, index) => (
                    <MenuItem key={`${color}-${index}`} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <button
                type="button"
                onClick={() => removeColor(2)}
                className="text-red-600 hover:text-red-700 p-1 ml-1"
                disabled={isSaving}
                aria-label="Remove Color"
              >
                <CloseIcon fontSize="medium" />
              </button>
            </div>
          ) : null}

          {!showColor2 || !showColor3 ? (
            <Button
              onClick={addColor}
              disabled={isSaving}
              color="primary"
              variant="text"
              className="mt-2"
            >
              + ADD ANOTHER COLOR
            </Button>
          ) : null}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-4">Location:</label>
        <p className="text-gray-500 mt-2">
          {[formData.area, formData.state, formData.country].filter(Boolean).join(", ")}
        </p>
        <div className="mt-1">
          <Map
            onLocationSelect={handleLocationSelect}
            initialLocation={{
              latitude: formData.latitude || 0,
              longitude: formData.longitude || 0
            }}
            initialZoom={EDIT_ZOOM_LEVEL}
            readOnly={false}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-2">
        <div className="flex gap-8">
          <div>
            <label className="text-lg font-medium text-gray-900 mb-2">Posted at:</label>
            <p className="text-md text-gray-500 mb-4">{formatDate(formData.createdAt)}</p>
          </div>
          <div>
            <label className="text-lg font-medium text-gray-900 mb-2">Updated at:</label>
            <p className="text-md text-gray-500 mb-4">{formatDate(formData.updatedAt)}</p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ReportEditMode;
