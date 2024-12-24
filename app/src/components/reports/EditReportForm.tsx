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
    setIsSaving(true); // Set saving state when starting save
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
    formDataToSend.append("gender", formData.gender);
    formDataToSend.append("microchipped", formData.microchipped?.toString() || "");
    formDataToSend.append("microchip_id", formData.microchipId || "");

    // Add location data
    formDataToSend.append("city", formData.city || "");
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

  const formatMicrochipped = (microchipped: boolean | null) => {
    if (microchipped === true) {
      return "Yes";
    } else if (microchipped === false) {
      return "No";
    } else {
      return "Unknown";
    }
  };

  const handleLocationSelect = (location: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  }) => {
    setFormData(prevData => ({
      ...prevData,
      latitude: location.latitude,
      longitude: location.longitude,
      city: location.city,
      state: location.state,
      country: location.country
    }));
  };

  const getFilteredColorOptions = (selectedColors: (string | null)[]) => {
    return colorListJson.options.filter(color => !selectedColors.includes(color));
  };

  const renderBreedOptions = (breed: string, index: number) => (
    <option key={`${breed}-${index}`} value={breed}>
      {breed}
    </option>
  );

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
            onClose={() => setNotification(null)}
          />
        )}

        {/* Move Action Buttons to top */}
        <div className="flex justify-end mb-2 gap-4">
          <div className="flex gap-2 mt-4">
            {isEditing ? (
              <>
                <Button
                  type="submit"
                  form="edit-report-form"
                  variant="contained"
                  color="success"
                  disabled={isSaving}
                  onClick={handleSaveChanges}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSaving ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSaving ? (
                    <>
                      <Spinner inline size={16} className="mr-2" color="text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSave} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancelChanges}
                  disabled={isSaving}
                  startIcon={<FontAwesomeIcon icon={faCancel} />}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={displayEditForm}
                startIcon={<FontAwesomeIcon icon={faPencil} />}
              >
                Edit Report
              </Button>
            )}
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={handleBackClick}
              disabled={isSaving}
            >
              Back to Reports
            </Button>
          </div>
        </div>

        {/* Add id to the form for the Save button to work */}
        <form id="edit-report-form" onSubmit={handleSaveChanges}>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Title:</h3>
            <div className="flex justify-between">
              {isEditing ? (
                <div className="flex flex-col flex-grow mr-4">
                  <TextField
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={1}
                    disabled={isSaving}
                    sx={commonInputStyles}
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-semibold mb-4 text-blue-600 max-w-[60%]">
                  {formData.title}
                </h2>
              )}
            </div>
          </div>
          <div className="mb-4">
            {/* Image Upload */}
            <h3 className="text-lg font-semibold text-gray-800">Photo:</h3>
            {isEditing ? (
              <FormControl fullWidth>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  sx={{ mt: 1 }}
                  disabled={isSaving}
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
                {formData.image && formData.image.filename && (
                  <div className="relative w-32 h-32 mt-3">
                    {imageIsLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                        <Spinner />
                      </div>
                    )}
                    <img
                      src={imageSrc}
                      alt={formData.title}
                      className={`object-cover w-full h-full rounded-md ${imageIsLoading ? "hidden" : "block"}`}
                      onLoad={handleImageLoad}
                      onError={handleImageError}
                    />
                  </div>
                )}
              </FormControl>
            ) : (
              <div className="mb-8 w-full relative">
                {imageIsLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                    <Spinner />
                  </div>
                )}
                <img
                  src={imageSrc}
                  alt={formData.title}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  className={`object-cover w-full rounded-md ${imageIsLoading ? "hidden" : "block"}`}
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Name:</h3>
            {isEditing ? (
              <TextField
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
                disabled={isSaving}
                sx={commonInputStyles}
              />
            ) : (
              <p className="text-gray-700">{formData.name ? formData.name : "Unknown"}</p>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
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
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{formData.description}</p>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gender:</h3>
            {isEditing ? (
              <FormControl fullWidth>
                <Select
                  id="gender"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  required
                  disabled={isSaving}
                  sx={commonInputStyles}
                >
                  <MenuItem value="">Choose one</MenuItem>
                  {genderOptions.map((gender, index) => (
                    <MenuItem key={index} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <p className="text-gray-700">{formData.gender}</p>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isEditing ? "Is the animal microchipped?" : "Microchipped:"}
            </h3>
            {isEditing ? (
              <FormControl required>
                <RadioGroup
                  name="microchipped"
                  value={formData.microchipped === null ? "" : formData.microchipped.toString()}
                  onChange={handleInputChange}
                >
                  <FormControlLabel
                    value="true"
                    control={<Radio />}
                    label="Yes"
                    disabled={isSaving}
                  />
                  <FormControlLabel
                    value="false"
                    control={<Radio />}
                    label="No"
                    disabled={isSaving}
                  />
                  <FormControlLabel
                    value=""
                    control={<Radio />}
                    label="I don't know"
                    disabled={isSaving}
                  />
                </RadioGroup>
              </FormControl>
            ) : (
              <p className="text-gray-700">{formatMicrochipped(formData.microchipped)}</p>
            )}

            {formData.microchipped === true && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4">Microchip ID:</h3>
                {isEditing ? (
                  <div className="mb-4">
                    <TextField
                      name="microchipId"
                      value={formData.microchipId || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      disabled={isSaving}
                      sx={commonInputStyles}
                    />
                  </div>
                ) : (
                  <p className="text-gray-700 mb-4">{formData.microchipId}</p>
                )}
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Species:</h3>
              {isEditing ? (
                <FormControl fullWidth>
                  <Select
                    id="species"
                    name="species"
                    value={formData.species || ""}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                    sx={commonInputStyles}
                  >
                    <MenuItem value="">Choose one</MenuItem>
                    {speciesOptions.map((species, index) => (
                      <MenuItem key={`${species}-${index}`} value={species}>
                        {species}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <p className="text-gray-700">{formData.species}</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mt-4">Breeds:</h3>
              {isEditing ? (
                <>
                  <FormControl fullWidth>
                    <Select
                      id="breed1"
                      name="breed1"
                      value={formData.breed1 || ""}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      sx={commonInputStyles}
                    >
                      <MenuItem value="">Select breed</MenuItem>
                      {breedOptions.map((breed, index) => (
                        <MenuItem key={`${breed}-${index}`} value={breed}>
                          {breed}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {showBreed2 && (
                    <div className="flex items-center gap-2 mt-2">
                      <FormControl fullWidth>
                        <Select
                          id="breed2"
                          name="breed2"
                          value={formData.breed2 || ""}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          sx={commonInputStyles}
                        >
                          <MenuItem value="">Select breed</MenuItem>
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
                        className="text-red-600 flex items-center ml-2 font-medium"
                        disabled={isSaving}
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove
                      </button>
                    </div>
                  )}

                  {!showBreed2 && formData.breed1 && (
                    <button
                      type="button"
                      onClick={addBreed}
                      className="mt-2 text-blue-600 font-medium"
                      disabled={isSaving}
                    >
                      + Add another breed
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-700">{formData.breed1}</p>
                  {formData.breed2 && <p className="text-gray-700">{formData.breed2}</p>}
                </>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Colors:</h3>
              {isEditing ? (
                <>
                  <FormControl fullWidth>
                    <Select
                      id="color1"
                      name="color1"
                      value={formData.color1}
                      onChange={handleInputChange}
                      required
                      disabled={isSaving}
                      sx={commonInputStyles}
                    >
                      <MenuItem value="">Choose one</MenuItem>
                      {colorListJson.options.map((color, index) => (
                        <MenuItem key={`${color}-${index}`} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {showColor2 && (
                    <div className="flex items-center gap-2 mt-2">
                      <FormControl fullWidth>
                        <Select
                          id="color2"
                          name="color2"
                          value={formData.color2 || ""}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          sx={commonInputStyles}
                        >
                          <MenuItem value="">Choose one</MenuItem>
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
                        aria-label="Remove Color 2"
                      >
                        <CloseIcon fontSize="medium" />
                      </button>
                    </div>
                  )}

                  {showColor3 && (
                    <div className="flex items-center gap-2 mt-2">
                      <FormControl fullWidth>
                        <Select
                          id="color3"
                          name="color3"
                          value={formData.color3 || ""}
                          onChange={handleInputChange}
                          disabled={isSaving}
                          sx={commonInputStyles}
                        >
                          <MenuItem value="">Choose one</MenuItem>
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
                        aria-label="Remove Color 3"
                      >
                        <CloseIcon fontSize="medium" />
                      </button>
                    </div>
                  )}

                  {canAddMoreColors && (
                    <button
                      type="button"
                      onClick={addColor}
                      className="mt-2 text-blue-600 font-medium"
                      disabled={isSaving}
                    >
                      Add another color
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p className="text-gray-700">{formData.color1}</p>
                  {formData.color2 && <p className="text-gray-700">{formData.color2}</p>}
                  {formData.color3 && <p className="text-gray-700">{formData.color3}</p>}
                </>
              )}
            </div>

            {/* Location Information */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Location:</h3>
              {isEditing ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      disabled={true}
                      sx={commonInputStyles}
                    />

                    <TextField
                      label="State"
                      name="state"
                      value={formData.state || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      disabled={true}
                      sx={commonInputStyles}
                    />

                    <TextField
                      label="Country"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      variant="outlined"
                      fullWidth
                      disabled={true}
                      sx={commonInputStyles}
                    />
                  </div>
                  <div className="mt-4 h-[400px]">
                    <Map
                      onLocationSelect={handleLocationSelect}
                      initialLocation={{
                        latitude: formData.latitude,
                        longitude: formData.longitude
                      }}
                      initialZoom={EDIT_ZOOM_LEVEL}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700">
                    {[formData.city, formData.state].filter(Boolean).join(", ")}
                  </p>
                  <div>{formData.country}</div>
                  <div className="mt-4 h-[400px]">
                    <Map
                      initialLocation={{
                        latitude: formData.latitude,
                        longitude: formData.longitude
                      }}
                      initialZoom={VIEW_ZOOM_LEVEL}
                      readOnly
                    />
                  </div>
                </>
              )}
            </div>

            {/* Posted and Updated Dates */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Posted at:</h3>
              <p className="text-gray-700">{formatDate(formData.createdAt)}</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Updated at:</h3>
              <p className="text-gray-700">{formatDate(formData.updatedAt)}</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReportForm;
