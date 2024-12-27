import React, { useState, useEffect } from "react";
import formatDate from "../../lib/formatDate";
import Spinner from "../shared/Spinner";
import Notification from "../shared/Notification";
import { IReport } from "../../types/Report";
import { faPencil, faSave, faTimes, faCancel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IImage } from "../../types/shared/Image";
import { useUpdateReportMutation } from "../../redux/features/reports/reportsApi";
import colorListJson from "../../../../config/colors.json";
import { getBreedsBySpecies } from "../../lib/reports/breedLists";
import { getGenderOptions } from "../../lib/reports/genderLists";
import Map from "../shared/Map";
import speciesListJson from "../../../../config/species.json";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationState, NotificationType } from "../../types/Notification";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  SelectChangeEvent,
  Button
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import { validateReportForm } from "./ReportFormValidation";

interface EditReportFormProps {
  report: IReport;
  errors?: string[];
}

interface UpdateReportResponse {
  message: string;
  report: IReport;
}

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

const speciesOptions = speciesListJson.options;

const EditReportForm: React.FC<EditReportFormProps> = ({ report }) => {
  const placeholderPath = "/images/placeholder.png";
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || placeholderPath);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(report);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showBreed2, setShowBreed2] = useState(!!formData.breed2);
  const [showColor2, setShowColor2] = useState(!!formData.color2);
  const [showColor3, setShowColor3] = useState(!!formData.color3);
  const [imageIsLoading, setImageIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const canAddMoreColors = !showColor2 || !showColor3;
  const breedOptions = formData.species
    ? getBreedsBySpecies(formData.species.toLowerCase() as "dog" | "cat")
    : [];

  const [updateReport] = useUpdateReportMutation();

  const getFilteredBreedOptions = (selectedBreeds: (string | null)[]) => {
    return breedOptions.filter(breed => !selectedBreeds.includes(breed));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    if (name === "breed1" && value === formData.breed2) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        breed2: null
      }));
      setShowBreed2(false);
      return;
    }

    if (name === "color1" && (value === formData.color2 || value === formData.color3)) {
      // If new color1 matches color2, remove color2
      if (value === formData.color2) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          color2: null
        }));
        setShowColor2(false);
      }
      // If new color1 matches color3, remove color3
      if (value === formData.color3) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          color3: null
        }));
        setShowColor3(false);
      }
      return;
    }

    if (name === "color2") {
      // If new color2 matches color3, remove color3
      if (value === formData.color3) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          color3: null
        }));
        setShowColor3(false);
        return;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const localUrl = URL.createObjectURL(file);

      // Update image source immediately
      setImageSrc(localUrl);
      setImageIsLoading(false);

      const imageObject: IImage = {
        id: "",
        url: localUrl,
        thumbnailUrl: localUrl,
        variantUrl: localUrl,
        filename: file.name,
        publicId: ""
      };

      setFormData(prev => ({ ...prev, image: imageObject }));
      setNewImageFile(file);

      // Cleanup URL when component unmounts
      return () => URL.revokeObjectURL(localUrl);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Add validation check
    const validationError = validateReportForm(formData, newImageFile);
    if (validationError) {
      setNotification({
        type: NotificationType.ERROR,
        message: validationError
      });
      setIsSaving(false);
      return;
    }

    const formDataToSend = new FormData();

    // Add existing form data
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("species", formData.species.toLowerCase());
    formDataToSend.append("breed_1", formData.breed1);
    formDataToSend.append("breed_2", formData.breed2 || "");
    formDataToSend.append("color_1", formData.color1);
    formDataToSend.append("color_2", formData.color2 || "");
    formDataToSend.append("color_3", formData.color3 || "");
    formDataToSend.append("gender", formData.gender || "");
    formDataToSend.append("microchip_id", formData.microchipId || "");

    // Add location data
    formDataToSend.append("area", formData.area || "");
    formDataToSend.append("state", formData.state || "");
    formDataToSend.append("country", formData.country || "");
    formDataToSend.append("latitude", formData.latitude?.toString() || "");
    formDataToSend.append("longitude", formData.longitude?.toString() || "");

    if (newImageFile) {
      formDataToSend.append("image", newImageFile);
    }

    try {
      const response = (await updateReport({
        id: report.id,
        data: formDataToSend
      }).unwrap()) as UpdateReportResponse;
      setIsEditing(false);
      if (response?.message) {
        setNotification({
          type: NotificationType.SUCCESS,
          message: response.message
        });
      }
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || "Failed to update report"
      });
    } finally {
      setIsSaving(false); // Reset saving state regardless of outcome
    }
  };

  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (location.state?.isNewReport) {
      navigate("/reports"); // Go to reports index without params
    } else {
      // Existing back navigation logic
      navigate(-1);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleCancelChanges = () => {
    setNotification(null);
    setFormData(report);
    setIsEditing(false);
    setImageIsLoading(true);
    setErrors([]);
  };

  const displayEditForm = () => {
    setNotification(null);
    setIsEditing(true);
  };

  const handleImageLoad = () => {
    setImageIsLoading(false);
  };

  const handleImageError = () => {
    if (imageSrc !== placeholderPath) {
      setImageSrc(placeholderPath);
    }
    setImageIsLoading(false);
  };

  const addBreed = () => {
    setShowBreed2(true);
  };

  const removeBreed = () => {
    setShowBreed2(false);
    setFormData(prevData => ({
      ...prevData,
      breed2: null
    }));
  };

  const addColor = () => {
    if (!showColor2) {
      setShowColor2(true);
    } else if (!showColor3) {
      setShowColor3(true);
    }
  };

  /**
   * Updated removeColor function to handle shifting colors
   * @param colorIndex - 1 for color2, 2 for color3
   */
  const removeColor = (colorIndex: number) => {
    if (colorIndex === 1) {
      // Removing color2
      if (formData.color3) {
        // Shift color3 to color2
        setFormData(prevData => ({
          ...prevData,
          color2: formData.color3,
          color3: null
        }));
        setShowColor3(false);
      } else {
        // Remove color2 without shifting
        setFormData(prevData => ({
          ...prevData,
          color2: null
        }));
        setShowColor2(false);
      }
    } else if (colorIndex === 2) {
      // Removing color3
      setFormData(prevData => ({
        ...prevData,
        color3: null
      }));
      setShowColor3(false);
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    area: string;
    state: string;
    country: string;
  }) => {
    setFormData(prevData => ({
      ...prevData,
      latitude: location.latitude,
      longitude: location.longitude,
      area: location.area,
      state: location.state,
      country: location.country
    }));
  };

  const getFilteredColorOptions = (selectedColors: (string | null)[]) => {
    return colorListJson.options.filter(color => !selectedColors.includes(color));
  };

  const genderOptions = getGenderOptions();

  useEffect(() => {
    if (location.state?.isNewReport) {
      setNotification({
        type: NotificationType.SUCCESS,
        message: location.state.message
      });
    }
  }, [location]);

  // First, add a constant for the zoom levels
  const VIEW_ZOOM_LEVEL = 15; // More zoomed in for viewing
  const EDIT_ZOOM_LEVEL = 13; // Less zoomed in for editing

  return (
    <div className="container mx-auto">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={handleCloseNotification}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end mb-4 gap-2">
          {isEditing ? (
            <>
              <button
                type="submit"
                form="edit-report-form"
                disabled={isSaving}
                onClick={handleSaveChanges}
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
            </>
          ) : (
            <button
              type="button"
              onClick={displayEditForm}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <FontAwesomeIcon icon={faPencil} className="mr-2" />
              Edit
            </button>
          )}
          <button
            type="button"
            onClick={handleBackClick}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>

        <form id="edit-report-form" onSubmit={handleSaveChanges} className="space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Title</label>
            {isEditing ? (
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
            ) : (
              <p className="text-gray-500 whitespace-pre-wrap">{formData.title}</p>
            )}
          </div>

          {/* Image Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Photo</label>
            {isEditing ? (
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
            ) : (
              <div className="mt-1">
                <img
                  src={imageSrc}
                  alt={formData.title}
                  className="w-full rounded-lg shadow-sm"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Description</label>
            {isEditing ? (
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
            ) : (
              <p className="text-gray-500 whitespace-pre-wrap">{formData.description}</p>
            )}
          </div>

          {/* Name Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Name</label>
            {isEditing ? (
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
            ) : (
              <p className="text-md text-gray-500 mb-4">{formData.name || "Unknown"}</p>
            )}
          </div>

          {/* Species Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Species</label>
            {isEditing ? (
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
            ) : (
              <p className="text-md text-gray-500 mb-4">{formData.species}</p>
            )}
          </div>

          {/* Breeds Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Breed(s)</label>
            {isEditing ? (
              <div className="space-y-3">
                <FormControl fullWidth>
                  <Select
                    name="breed1"
                    value={formData.breed1}
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
                    {breedOptions.map((breed, index) => (
                      <MenuItem key={`${breed}-${index}`} value={breed}>
                        {breed}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {showBreed2 ? (
                  <div className="flex items-center gap-2">
                    <FormControl fullWidth>
                      <Select
                        name="breed2"
                        value={formData.breed2 || ""}
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
                        {getFilteredBreedOptions([formData.breed1]).map((breed, index) => (
                          <MenuItem key={`${breed}-${index}`} value={breed}>
                            {breed}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
            ) : (
              <div className="space-y-1">
                <p className="text-md text-gray-500">{formData.breed1}</p>
                {formData.breed2 && <p className="text-md text-gray-500">{formData.breed2}</p>}
              </div>
            )}
          </div>

          {/* Gender Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Gender</label>
            {isEditing ? (
              <FormControl fullWidth>
                <Select
                  name="gender"
                  value={formData.gender || ""}
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
                  {genderOptions.map((gender, index) => (
                    <MenuItem key={index} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <p className="text-md text-gray-500 mb-4">{formData.gender || "Unknown"}</p>
            )}
          </div>

          {/* Microchip ID Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Microchip ID</label>
            {isEditing ? (
              <TextField
                name="microchipId"
                value={formData.microchipId || ""}
                onChange={handleInputChange}
                placeholder="Enter microchip ID (if known)"
                variant="outlined"
                fullWidth
                sx={commonInputStyles}
              />
            ) : (
              <p className="text-md text-gray-500 mb-4">{formData.microchipId || "Unknown"}</p>
            )}
          </div>

          {/* Colors Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-2">Colors</label>
            {isEditing ? (
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
                    {colorListJson.options.map((color, index) => (
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
                        {getFilteredColorOptions([formData.color1, formData.color2]).map(
                          (color, index) => (
                            <MenuItem key={`${color}-${index}`} value={color}>
                              {color}
                            </MenuItem>
                          )
                        )}
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

                {canAddMoreColors && (
                  <Button
                    onClick={addColor}
                    disabled={isSaving}
                    color="primary"
                    variant="text"
                    className="mt-2"
                  >
                    + ADD ANOTHER COLOR
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-md text-gray-500">{formData.color1}</p>
                {formData.color2 && <p className="text-md text-gray-500">{formData.color2}</p>}
                {formData.color3 && <p className="text-md text-gray-500">{formData.color3}</p>}
              </div>
            )}
          </div>

          {/* Location Section */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900 mb-4">Location</label>
            <p className="text-gray-500 mt-2">
              {[formData.area, formData.state, formData.country].filter(Boolean).join(", ")}
            </p>
            <div className="mt-1">
              <Map
                onLocationSelect={handleLocationSelect}
                initialLocation={{
                  latitude: formData.latitude,
                  longitude: formData.longitude
                }}
                initialZoom={isEditing ? EDIT_ZOOM_LEVEL : VIEW_ZOOM_LEVEL}
                readOnly={!isEditing}
              />
            </div>
          </div>

          {/* Dates Section */}
          <div className="space-y-2">
            <div className="flex gap-8">
              <div>
                <label className="text-lg font-medium text-gray-900 mb-2">Posted at</label>
                <p className="text-md text-gray-500 mb-4">{formatDate(formData.createdAt)}</p>
              </div>
              <div>
                <label className="text-lg font-medium text-gray-900 mb-2">Updated at</label>
                <p className="text-md text-gray-500 mb-4">{formatDate(formData.updatedAt)}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportForm;
