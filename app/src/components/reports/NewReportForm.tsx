import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../redux/features/reports/reportsApi";
import Map from "../shared/Map";
import { IReport, IReportForm } from "../../types/Report";
import colorListJson from "../../../../config/colors.json";
import { getBreedsBySpecies } from "../../lib/reports/breedLists";
import speciesListJson from "../../../../config/species.json";
import Spinner from "../shared/Spinner";
import { getGenderOptions } from "../../lib/reports/genderLists";
import Notification from "../shared/Notification";
import { NotificationState, NotificationType } from "../../types/Notification";
import SearchableBreedSelect from "./SearchableBreedSelect";
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
  Button,
  Tooltip
} from "@mui/material";
import { CloudUpload, Close as CloseIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Errors } from "../../types/ErrorMessages";

interface SubmitResponse {
  message?: string;
  report?: IReport;
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

// Update the location fields with a more prominent disabled style
const disabledInputStyles = {
  ...commonInputStyles,
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#e5e7eb" // Tailwind gray-200, slightly darker
  },
  "& .MuiInputBase-input.Mui-disabled": {
    backgroundColor: "#e5e7eb",
    WebkitTextFillColor: "#6b7280" // Tailwind gray-500 for text
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#6b7280" // Matching text color
  }
};

const NewReportForm: React.FC = () => {
  const {
    isLoading: isLoadingNewReport,
    isError: isNewReportError,
    error: newReportError
  } = useGetNewReportQuery();
  const [submitReport, { isLoading }] = useSubmitReportMutation();
  const [knowsName, setKnowsName] = useState<boolean | null>(null);
  const [breedOptions, setBreedOptions] = useState<string[]>([]);
  const [showBreed2, setShowBreed2] = useState(false);
  const [showColor2, setShowColor2] = useState(false);
  const [showColor3, setShowColor3] = useState(false);

  const [formData, setFormData] = useState<IReportForm>({
    title: "",
    description: "",
    name: "",
    gender: "",
    species: "",
    breed1: "",
    breed2: "",
    color1: "",
    color2: "",
    color3: "",
    image: {
      id: "",
      url: "",
      thumbnailUrl: "",
      variantUrl: "",
      filename: "",
      publicId: ""
    },
    microchipped: null,
    microchipId: "",
    city: "",
    state: "",
    country: "",
    latitude: null,
    longitude: null
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const genderOptions = getGenderOptions();
  const speciesOptions = useMemo(() => speciesListJson.options, []);
  const colorOptions = useMemo(() => colorListJson.options, []);

  const [notification, setNotification] = useState<NotificationState | null>(null);
  const navigate = useNavigate();

  // Add state for tracking tooltip visibility
  const [showBreedTooltip, setShowBreedTooltip] = useState(false);

  useEffect(() => {
    setBreedOptions(
      formData.species ? getBreedsBySpecies(formData.species.toLowerCase() as "dog" | "cat") : []
    );
  }, [formData]);

  const getFilteredBreedOptions = (selectedBreeds: (string | null)[]) => {
    return breedOptions.filter(breed => !selectedBreeds.includes(breed));
  };

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | SelectChangeEvent
  ) => {
    const { name, value } = e.target;

    if (name === "microchipped") {
      setFormData(prev => ({
        ...prev,
        [name]: value === "true" ? true : value === "false" ? false : null
      }));
      return;
    }

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
      if (value === formData.color2) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          color2: null
        }));
        setShowColor2(false);
      }
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

  const handleLocationSelect = useCallback(
    (location: {
      latitude: number;
      longitude: number;
      city: string;
      state: string;
      country: string;
    }) => {
      setFormData(prev => ({
        ...prev,
        ...location
      }));
    },
    []
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB.");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Unsupported file type. Please upload a JPEG, PNG, or GIF image.");
        return;
      }

      setSelectedImage(file);
      setFormData(prev => ({
        ...prev,
        image: {
          ...prev.image,
          filename: file.name
        }
      }));

      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const formDataToSend = new FormData();
    const data = {
      title: formData.title,
      description: formData.description,
      name: formData.name,
      gender: formData.gender,
      species: formData.species.toLowerCase(),
      breed_1: formData.breed1,
      breed_2: showBreed2 && formData.breed2 ? formData.breed2 : "",
      color_1: formData.color1.toLowerCase(),
      color_2: showColor2 && formData.color2 ? formData.color2.toLowerCase() : "",
      color_3: showColor3 && formData.color3 ? formData.color3.toLowerCase() : "",
      microchipped: formData.microchipped !== null ? formData.microchipped.toString() : "",
      microchip_id: formData.microchipId || "",
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "",
      latitude: formData.latitude || null,
      longitude: formData.longitude || null
    };

    formDataToSend.append("title", data.title);
    formDataToSend.append("description", data.description);
    formDataToSend.append("name", data.name);
    formDataToSend.append("gender", data.gender);
    formDataToSend.append("species", data.species);
    formDataToSend.append("breed_1", data.breed_1);
    formDataToSend.append("breed_2", data.breed_2);
    formDataToSend.append("color_1", data.color_1);
    formDataToSend.append("color_2", data.color_2);
    formDataToSend.append("color_3", data.color_3);
    formDataToSend.append("microchipped", data.microchipped);
    formDataToSend.append("microchip_id", data.microchip_id);
    formDataToSend.append("city", data.city);
    formDataToSend.append("state", data.state);
    formDataToSend.append("country", data.country);
    formDataToSend.append("latitude", data.latitude?.toString() || "");
    formDataToSend.append("longitude", data.longitude?.toString() || "");

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formDataToSend.append(key, value.toString());
      }
    });

    if (selectedImage) {
      formDataToSend.append("image", selectedImage);
    }

    try {
      const response = await submitReport(formDataToSend).unwrap();
      navigate(`/reports/${response.id}`, {
        state: { message: response.message, isNewReport: true }
      });
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || Errors.REPORT_SUBMISSION_FAILED
      });
    }
  };

  const getFilteredColorOptions = (selectedColors: (string | null)[]) => {
    return colorListJson.options.filter(color => !selectedColors.includes(color));
  };

  // Update the autoFillPrevent object to specifically target text inputs
  const autoFillPrevent = {
    autoComplete: "off",
    InputProps: {
      autoComplete: "off"
    },
    inputProps: {
      type: "text",
      autoComplete: "chrome-off" // Chrome-specific prevention
    }
  };

  // Update the microchipped radio group handler
  const handleMicrochippedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      microchipped: value === "true" ? true : value === "false" ? false : null,
      microchipId: value === "false" ? "" : prev.microchipId // Clear microchipId if "No" is selected
    }));
  };

  if (isLoadingNewReport) return <Spinner />;
  if (isNewReportError && "data" in newReportError) {
    return (
      <Notification
        type={NotificationType.ERROR}
        message={(newReportError.data as any)?.message || Errors.REPORT_LOAD_FAILED}
        onClose={() => {}}
      />
    );
  }

  return (
    <form
      className="space-y-6"
      id="lost-pet-report-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="mt-[0.5rem]">
        <span className="text-red-400 font-bold">IMPORTANT: </span>
        Please include as many details as possible and upload your best photo of the animal. If the
        animal's breeds are unknown, provide your best guess along with a thorough description.
      </div>
      <div className="text-sm text-gray-500 mb-3">
        <p>
          Fields marked with <span className="text-red-400">*</span> are required.
        </p>
      </div>

      {/* Title */}
      <TextField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
        variant="outlined"
        fullWidth
        multiline
        rows={1}
        {...autoFillPrevent}
        sx={commonInputStyles}
      />

      {/* Description */}
      <TextField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        required
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        {...autoFillPrevent}
        sx={commonInputStyles}
      />

      {/* Knows Name */}
      <FormControl required>
        <FormLabel id="knows-name-label">Do you know the animal's name?</FormLabel>
        <RadioGroup
          name="knowsName"
          value={knowsName === null ? "" : knowsName.toString()}
          onChange={e => setKnowsName(e.target.value === "" ? null : e.target.value === "true")}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
        </RadioGroup>
      </FormControl>

      {/* Name */}
      {knowsName && (
        <TextField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          multiline
          rows={1}
          {...autoFillPrevent}
          sx={commonInputStyles}
        />
      )}

      <br />

      {/* Microchipped */}
      <FormControl required>
        <FormLabel id="microchipped-label">Is the animal microchipped?</FormLabel>
        <RadioGroup
          name="microchipped"
          value={formData.microchipped === null ? "" : formData.microchipped.toString()}
          onChange={handleMicrochippedChange}
        >
          <FormControlLabel value="true" control={<Radio />} label="Yes" />
          <FormControlLabel value="false" control={<Radio />} label="No" />
          <FormControlLabel value="" control={<Radio />} label="I don't know" />
        </RadioGroup>
      </FormControl>

      {/* Microchip ID */}
      {formData.microchipped === true && (
        <TextField
          label="Microchip ID"
          name="microchipId"
          value={formData.microchipId || ""}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          {...autoFillPrevent}
          sx={commonInputStyles}
        />
      )}

      {/* Gender */}
      <FormControl fullWidth>
        <InputLabel id="gender-label" required>
          Gender
        </InputLabel>
        <Select
          labelId="gender-label"
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
          label="Gender"
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

      {/* Species */}
      <FormControl fullWidth>
        <InputLabel id="species-label" required>
          Species
        </InputLabel>
        <Select
          labelId="species-label"
          id="species"
          name="species"
          value={formData.species}
          onChange={handleInputChange}
          required
          label="Species"
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

      {/* Breed 1 */}
      <Tooltip
        title="Please select a species first"
        open={showBreedTooltip && !formData.species}
        placement="top"
        onClose={() => setShowBreedTooltip(false)}
        componentsProps={{
          tooltip: {
            sx: {
              fontSize: "1rem",
              padding: "8px 12px"
            }
          }
        }}
      >
        <div
          onClick={() => !formData.species && setShowBreedTooltip(true)}
          onMouseEnter={() => !formData.species && setShowBreedTooltip(true)}
          onMouseLeave={() => setShowBreedTooltip(false)}
        >
          <SearchableBreedSelect
            value={formData.breed1}
            onChange={breed => setFormData(prev => ({ ...prev, breed1: breed }))}
            disabled={!formData.species}
            required
            label="Breed 1"
            availableBreeds={breedOptions}
            sx={commonInputStyles}
          />
        </div>
      </Tooltip>

      {/* Button to Add Breed 2 */}
      {!showBreed2 && formData.breed1 && (
        <button
          type="button"
          onClick={() => setShowBreed2(true)}
          className="mt-2 text-blue-600 font-medium"
          disabled={isLoading}
        >
          Add another breed
        </button>
      )}

      {/* Breed 2 */}
      {showBreed2 && (
        <div className="flex items-center gap-2">
          <SearchableBreedSelect
            value={formData.breed2 || ""}
            onChange={breed => setFormData(prev => ({ ...prev, breed2: breed }))}
            disabled={!formData.species}
            label="Breed 2"
            availableBreeds={getFilteredBreedOptions([formData.breed1])}
            sx={commonInputStyles}
          />
          <button
            type="button"
            onClick={() => {
              setShowBreed2(false);
              setFormData(prev => ({ ...prev, breed2: "" }));
            }}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Breed 2"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      )}

      {/* Color 1 */}
      <FormControl fullWidth>
        <InputLabel id="color1-label" required>
          Color 1
        </InputLabel>
        <Select
          labelId="color1-label"
          id="color1"
          name="color1"
          value={formData.color1}
          onChange={handleInputChange}
          required
          label="Color 1"
          sx={commonInputStyles}
        >
          <MenuItem value="">Choose one</MenuItem>
          {colorOptions.map((color, index) => (
            <MenuItem key={`${color}-${index}`} value={color}>
              {color}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Button to Add Color 2 */}
      {!showColor2 && formData.color1 && (
        <button
          type="button"
          onClick={() => setShowColor2(true)}
          className="mt-2 text-blue-600 font-medium"
          disabled={isLoading}
        >
          Add another color
        </button>
      )}

      {/* Color 2 */}
      {showColor2 && (
        <div className="flex items-center gap-2">
          <FormControl fullWidth>
            <InputLabel id="color2-label">Color 2</InputLabel>
            <Select
              labelId="color2-label"
              id="color2"
              name="color2"
              value={formData.color2 || ""}
              onChange={handleInputChange}
              label="Color 2"
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
            onClick={() => {
              setShowColor2(false);
              setFormData(prev => ({ ...prev, color2: "" }));
            }}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Color 2"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      )}

      {/* Button to Add Color 3 */}
      {!showColor3 && showColor2 && formData.color2 && (
        <button
          type="button"
          onClick={() => setShowColor3(true)}
          className="mt-2 text-blue-600 font-medium"
          disabled={isLoading}
        >
          Add another color
        </button>
      )}

      {/* Color 3 */}
      {showColor3 && (
        <div className="flex items-center gap-2">
          <FormControl fullWidth>
            <InputLabel id="color3-label">Color 3</InputLabel>
            <Select
              labelId="color3-label"
              id="color3"
              name="color3"
              value={formData.color3 || ""}
              onChange={handleInputChange}
              label="Color 3"
              sx={commonInputStyles}
            >
              <MenuItem value="">Choose one</MenuItem>
              {getFilteredColorOptions([formData.color1, formData.color2]).map((color, index) => (
                <MenuItem key={`${color}-${index}`} value={color}>
                  {color}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <button
            type="button"
            onClick={() => {
              setShowColor3(false);
              setFormData(prev => ({ ...prev, color3: "" }));
            }}
            className="text-red-600 hover:text-red-700 p-1 ml-1"
            disabled={isLoading}
            aria-label="Remove Color 3"
          >
            <CloseIcon fontSize="medium" />
          </button>
        </div>
      )}

      {/* Image Upload */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Image</h2>
        <p className="text-sm text-gray-500 mb-4">Please upload your best photo of the animal.</p>
        <FormControl fullWidth>
          <Button
            component="label"
            variant="outlined"
            startIcon={<CloudUpload />}
            sx={{ mt: 1 }}
            disabled={isLoading}
          >
            Choose File
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              disabled={isLoading}
            />
          </Button>
          {imagePreview && (
            <div className="relative w-32 h-32 mt-3">
              <img
                src={imagePreview}
                alt="Selected"
                className="object-cover w-full h-full rounded-md"
              />
            </div>
          )}
        </FormControl>
      </div>

      {/* Location Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Location Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click on the map to drop a pin where the pet was last seen.
        </p>

        <Map onLocationSelect={handleLocationSelect} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className={`w-fit inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            Submitting...
            <Spinner inline size={16} className="ml-2" color="text-white" />
          </>
        ) : (
          "Submit"
        )}
      </button>
    </form>
  );
};

export default NewReportForm;
