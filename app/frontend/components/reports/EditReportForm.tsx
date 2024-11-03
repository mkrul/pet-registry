import React, { useState } from "react";
import Spinner from "../shared/Spinner";
import Notification from "../shared/Notification";
import { IReport } from "../../types/reports/Report";
import { faPencil, faSave, faTimes, faCancel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IImage } from "../../types/shared/Image";
import { useUpdateReportMutation } from "../../redux/features/reports/reportsApi";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { dogBreedOptionsList } from "../../lib/reports/dogBreedOptionsList";
import { catBreedOptionsList } from "../../lib/reports/catBreedOptionsList";

interface EditReportFormProps {
  report: IReport;
  errors?: string[];
}

const EditReportForm: React.FC<EditReportFormProps> = ({ report }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(report);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<{
    type: "success" | "danger";
    message: string;
  } | null>(null);
  const [updateReport] = useUpdateReportMutation();
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const breedOptions =
    formData.species.toLowerCase() === "dog"
      ? dogBreedOptionsList
      : formData.species.toLowerCase() === "cat"
        ? catBreedOptionsList
        : [];

  const [showBreed2, setShowBreed2] = useState(!!formData.breed2);
  const [showColor2, setShowColor2] = useState(!!formData.color2);
  const [showColor3, setShowColor3] = useState(!!formData.color3);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]:
        value === "true" ? true : value === "false" ? false : value === "unknown" ? null : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageObject: IImage = {
        id: undefined,
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
    setImageIsLoading(true);
    setIsSaving(true);

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.title || "");
    formDataToSend.append("description", formData.description || "");
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("species", formData.species || "");
    formDataToSend.append("breed_1", formData.breed1 || "");
    formDataToSend.append("breed_2", formData.breed2 || "");
    formDataToSend.append("color_1", formData.color1 || "");
    formDataToSend.append("color_2", formData.color2 || "");
    formDataToSend.append("color_3", formData.color3 || "");
    formDataToSend.append("gender", formData.gender || "");
    formDataToSend.append(
      "microchipped",
      formData.microchipped !== null ? formData.microchipped.toString() : ""
    );
    formDataToSend.append("microchip_id", formData.microchipId || "");
    if (newImageFile) {
      formDataToSend.append("image", newImageFile);
    }
    try {
      const updatedReport = await updateReport({ id: formData.id, data: formDataToSend }).unwrap();
      setFormData(updatedReport);
      setIsEditing(false);
      setNotification({ type: "success", message: "Report updated successfully!" }); // Success notification
    } catch (error: any) {
      console.error("Failed to update report:", error);
      if (error.data && error.data.errors) {
        setErrors(error.data.errors);
      }
      setNotification({ type: "danger", message: "Failed to update report. Please try again." }); // Error notification
    } finally {
      setImageIsLoading(false);
      setIsSaving(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(null);
  };

  const handleCancelChanges = () => {
    setFormData(report);
    setIsEditing(false);
    setImageIsLoading(true);
    setErrors([]);
  };

  const handleImageLoad = () => {
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

  // Add additional color
  const addColor = () => {
    if (!showColor2) {
      setShowColor2(true);
    } else if (!showColor3) {
      setShowColor3(true);
    }
  };

  // Remove additional color
  const removeColor = (colorIndex: number) => {
    if (colorIndex === 2) {
      setShowColor3(false);
      setFormData(prevData => ({
        ...prevData,
        color3: null
      }));
    } else if (colorIndex === 1) {
      setShowColor2(false);
      setFormData(prevData => ({
        ...prevData,
        color2: null
      }));
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
        <div className="flex justify-between">
          {isEditing ? (
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">Title:</h3>
              <input
                name="title"
                value={formData.title}
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
                onClick={handleSaveChanges}
                className="text-green-600 flex items-center h-6 mb-3 sm:mb-1"
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faSave} className="mr-1" /> Save
              </button>
              <button
                onClick={handleCancelChanges}
                className="text-gray-600 flex items-center h-6"
                disabled={isSaving}
              >
                <FontAwesomeIcon icon={faCancel} className="mr-1" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 flex items-center h-6"
            >
              <FontAwesomeIcon icon={faPencil} className="mr-2" /> Edit Report
            </button>
          )}
        </div>
        {errors && errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
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
                      src={formData.image.thumbnailUrl}
                      alt={formData.title}
                      className="object-cover w-full h-full"
                      onLoad={handleImageLoad}
                    />
                    {imageIsLoading && <Spinner />}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mb-8 w-full relative">
              {imageIsLoading && <Spinner />}
              <img
                src={formData.image.variantUrl}
                alt={formData.title}
                onLoad={() => setImageIsLoading(false)}
                className={`object-cover w-full ${imageIsLoading ? "hidden" : ""}`}
              />
            </div>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Name:</h3>
          {isEditing ? (
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border-gray-300 rounded-md shadow-sm w-full w-[85%] max-w-[20rem]"
              disabled={isSaving}
            />
          ) : (
            <p className="text-gray-700">{formData.name}</p>
          )}
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
          {isEditing ? (
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-32"
              disabled={isSaving}
            />
          ) : (
            <p className="text-gray-700">{formData.description}</p>
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
                value={formData.species}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md shadow-sm mb-2"
                disabled={isSaving}
              >
                <option value="">Select species</option>
                {["Dog", "Cat"].map((species, index) => (
                  <option key={index} value={species}>
                    {species}
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
                  value={formData.breed1}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-md shadow-sm mb-2"
                  disabled={isSaving}
                >
                  <option value="">Select breed</option>
                  {breedOptions.map((breed, index) => (
                    <option key={index} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>

                {showBreed2 && (
                  <div>
                    <select
                      name="breed2"
                      value={formData.breed2 || ""}
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-md shadow-sm"
                      disabled={isSaving}
                    >
                      <option value="">Select breed</option>
                      {breedOptions.map((breed, index) => (
                        <option key={index} value={breed}>
                          {breed}
                        </option>
                      ))}
                    </select>
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
                      Add another breed
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={removeBreed}
                      className="mt-3 text-red-600 flex items-center font-medium"
                      disabled={isSaving}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove second breed
                    </button>
                  </div>
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
                <select
                  name="color1"
                  value={formData.color1 || ""}
                  onChange={handleInputChange}
                  className="border-gray-300 rounded-md shadow-sm mb-2"
                  disabled={isSaving}
                >
                  <option value="">Select color</option>
                  {colorOptionsList.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                {showColor2 && (
                  <div className="flex items-center mb-2">
                    <select
                      name="color2"
                      value={formData.color2 || ""}
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-md shadow-sm"
                      disabled={isSaving}
                    >
                      <option value="">Select color</option>
                      {colorOptionsList.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeColor(1)}
                      className="text-red-600 flex items-center ml-2 font-medium"
                      disabled={isSaving}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove
                    </button>
                  </div>
                )}

                {showColor3 && (
                  <div className="flex items-center">
                    <select
                      name="color3"
                      value={formData.color3 || ""}
                      onChange={handleInputChange}
                      className="border-gray-300 rounded-md shadow-sm"
                      disabled={isSaving}
                    >
                      <option value="">Select color</option>
                      {colorOptionsList.map((color, index) => (
                        <option key={index} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeColor(2)}
                      className="text-red-600 flex items-center ml-2 font-medium"
                      disabled={isSaving}
                    >
                      <FontAwesomeIcon icon={faTimes} className="mr-1" /> Remove
                    </button>
                  </div>
                )}

                {!showColor3 && (
                  <div>
                    <button
                      type="button"
                      onClick={addColor}
                      className="mt-2 text-blue-600 font-medium"
                      disabled={isSaving}
                    >
                      Add another color
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
        </div>
      </div>
    </div>
  );
};

export default EditReportForm;
