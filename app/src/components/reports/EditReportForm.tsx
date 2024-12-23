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

interface EditReportFormProps {
  report: IReport;
  errors?: string[];
}

interface UpdateReportResponse {
  message: string;
  report: IReport;
}

const EditReportForm: React.FC<EditReportFormProps> = ({ report }) => {
  const placeholderPath = "/images/placeholder.png"; // Define placeholder path
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || placeholderPath);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(report);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [showBreed2, setShowBreed2] = useState(!!formData.breed2);
  const [showColor2, setShowColor2] = useState(!!formData.color2);
  const [showColor3, setShowColor3] = useState(!!formData.color3);
  const [imageIsLoading, setImageIsLoading] = useState(true);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
    setNotification(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageObject: IImage = {
        id: "",
        url: URL.createObjectURL(file),
        thumbnailUrl: URL.createObjectURL(file),
        variantUrl: URL.createObjectURL(file),
        filename: file.name,
        publicId: ""
      };
      setFormData(prev => ({ ...prev, image: imageObject }));
      setNewImageFile(file);
      setImageIsLoading(true); // Show spinner while the image loads
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } else {
      setImageIsLoading(false);
    }
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
        {errors && errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-3">
            <strong className="font-bold">
              {errors.length} error(s) prohibited this report from being saved:
            </strong>
            <ul className="mt-2 list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSaveChanges}>
          <div className="flex justify-between">
            {isEditing ? (
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-gray-800">Title:</h3>
                <input
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-md shadow-sm mb-4"
                  disabled={isSaving}
                />
              </div>
            ) : (
              <h2 className="text-2xl font-semibold mb-4 text-blue-600 max-w-[60%]">
                {formData.title}
              </h2>
            )}
            {isEditing ? (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:w-[9rem]">
                <button
                  type="submit"
                  className="text-green-600 flex items-center h-6 mb-3 sm:mb-1"
                  disabled={isSaving}
                >
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelChanges}
                  className="text-gray-600 flex items-center h-6"
                  disabled={isSaving}
                >
                  <FontAwesomeIcon icon={faCancel} className="mr-1" /> Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={displayEditForm}
                className="text-blue-600 flex items-center h-6"
              >
                <FontAwesomeIcon icon={faPencil} className="mr-2" /> Edit Report
              </button>
            )}
          </div>
          <div className="mb-4">
            {isEditing ? (
              <>
                {/* Image Upload Section */}
                <h3 className="text-lg font-semibold text-gray-800">Photo:</h3>
                <div className="mt-1 relative overflow-clip">
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isSaving}
                  />
                  {formData.image && formData.image.filename && (
                    <div className="relative w-32 h-32 mt-3">
                      <img
                        src={imageSrc}
                        alt={formData.title}
                        className={`object-cover w-full h-full ${imageIsLoading ? "hidden" : "block"} rounded-md`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                      {imageIsLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md">
                          <Spinner />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
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
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md shadow-sm w-full w-[85%] max-w-[20rem]"
                disabled={isSaving}
              />
            ) : (
              <p className="text-gray-700">{formData.name ? formData.name : "Unknown"}</p>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-32"
                disabled={isSaving}
              />
            ) : (
              <p className="text-gray-700">{formData.description}</p>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gender:</h3>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender || ""}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md shadow-sm"
                disabled={isSaving}
              >
                {genderOptions.map((gender, index) => (
                  <option key={index} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-gray-700">{formData.gender}</p>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Microchipped:</h3>
            {isEditing ? (
              <div className="mt-1 mb-4">
                <div>
                  <input
                    type="radio"
                    id="microchipped-yes"
                    name="microchipped"
                    value={"true"}
                    checked={formData.microchipped === true}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                  <label htmlFor="microchipped-yes" className="ml-2">
                    Yes
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="microchipped-no"
                    name="microchipped"
                    value={"false"}
                    checked={formData.microchipped === false}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                  <label htmlFor="microchipped-no" className="ml-2">
                    No
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="microchipped-unknown"
                    name="microchipped"
                    value={""}
                    checked={formData.microchipped === null}
                    onChange={handleInputChange}
                    required
                    disabled={isSaving}
                  />
                  <label htmlFor="microchipped-unknown" className="ml-2">
                    I don't know
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mb-4">{formatMicrochipped(formData.microchipped)}</p>
            )}

            {formData.microchipped === true && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mt-4">Microchip ID:</h3>
                {isEditing ? (
                  <input
                    name="microchipId"
                    value={formData.microchipId || ""}
                    onChange={handleInputChange}
                    className="border-gray-300 rounded-md shadow-sm mb-4 w-[85%] max-w-[20rem]"
                    disabled={isSaving}
                  />
                ) : (
                  <p className="text-gray-700 mb-4">{formData.microchipId}</p>
                )}
              </div>
            )}

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Species:</h3>
              {isEditing ? (
                <select
                  name="species"
                  value={formData.species || ""}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-md shadow-sm mb-2"
                  disabled={isSaving}
                >
                  <option value="">Select species</option>
                  {["dog", "cat"].map((species, index) => (
                    <option key={index} value={species}>
                      {species.charAt(0).toUpperCase() + species.slice(1)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-gray-700">{formData.species}</p>
              )}
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mt-4">Breeds:</h3>
              {isEditing ? (
                <>
                  <select
                    name="breed1"
                    value={formData.breed1 || ""}
                    onChange={handleInputChange}
                    className="border-gray-300 rounded-md shadow-sm mb-2"
                    disabled={isSaving}
                  >
                    <option value="">Select breed</option>
                    {breedOptions.map(renderBreedOptions)}
                  </select>

                  {showBreed2 && (
                    <div className="flex items-center mb-2">
                      <select
                        name="breed2"
                        value={formData.breed2 || ""}
                        onChange={handleInputChange}
                        className="border-gray-300 rounded-md shadow-sm"
                        disabled={isSaving}
                        required
                      >
                        <option value="">Select breed</option>
                        {getFilteredBreedOptions([formData.breed1]).map(renderBreedOptions)}
                      </select>
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

                  {!showBreed2 ? (
                    <div>
                      <button
                        type="button"
                        onClick={addBreed}
                        className="mt-2 text-blue-600 font-medium"
                        disabled={isSaving}
                      >
                        + Add another breed
                      </button>
                    </div>
                  ) : (
                    <div>{/* Optionally, you can add a button to remove breed2 if needed */}</div>
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
                  {/* Color1 */}
                  <div className="flex items-center mb-2">
                    <select
                      name="color1"
                      value={formData.color1}
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-md shadow-sm"
                      disabled={isSaving}
                      required
                    >
                      <option value="">Select color</option>
                      {colorListJson.options.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    {/* No remove button for color1 as it's mandatory */}
                  </div>

                  {/* Color2 */}
                  {showColor2 && (
                    <div className="flex items-center mb-2">
                      <select
                        name="color2"
                        value={formData.color2 || ""}
                        onChange={handleInputChange}
                        className="border-gray-300 rounded-md shadow-sm"
                        disabled={isSaving}
                        required
                      >
                        <option value="">Select color</option>
                        {getFilteredColorOptions([formData.color1]).map((color, index) => (
                          <option key={index} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeColor(1)} // colorIndex 1 corresponds to color2
                        className="text-red-600 flex items-center ml-2 font-medium"
                        disabled={isSaving}
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove
                      </button>
                    </div>
                  )}

                  {/* Color3 */}
                  {showColor3 && (
                    <div className="flex items-center mb-2">
                      <select
                        name="color3"
                        value={formData.color3 || ""}
                        onChange={handleInputChange}
                        className="border-gray-300 rounded-md shadow-sm"
                        disabled={isSaving}
                        required
                      >
                        <option value="">Select color</option>
                        {getFilteredColorOptions([formData.color1, formData.color2]).map(
                          (color, index) => (
                            <option key={index} value={color}>
                              {color}
                            </option>
                          )
                        )}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeColor(2)} // colorIndex 2 corresponds to color3
                        className="text-red-600 flex items-center ml-2 font-medium"
                        disabled={isSaving}
                      >
                        <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove
                      </button>
                    </div>
                  )}

                  {/* "Add another color" Button */}
                  {canAddMoreColors && (
                    <div>
                      <button
                        type="button"
                        onClick={addColor}
                        className="mt-2 text-blue-600 font-medium"
                        disabled={isSaving}
                      >
                        + Add another color
                      </button>
                    </div>
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
                    <div>
                      <label className="block font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                        disabled={true}
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                        disabled={true}
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-gray-700">Country</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="mt-4 h-[400px]">
                    <Map
                      onLocationSelect={handleLocationSelect}
                      initialLocation={{
                        latitude: formData.latitude,
                        longitude: formData.longitude
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-gray-700">
                    {[formData.city, formData.state].filter(Boolean).join(", ")}
                  </p>
                  <div>{formData.country}</div>
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
