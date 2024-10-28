import React, { useState } from "react";
import { IReport } from "../../types/reports/Report";
import { faPencil, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
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
  const [image, setImage] = useState<IImage>(report.image);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [updateReport] = useUpdateReportMutation();
  const [imageIsLoading, setImageIsLoading] = useState(true);

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
      setImageIsLoading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await updateReport({ id: formData.id, data: formDataToSend }).unwrap();
      setIsEditing(false);
    } catch (error: any) {
      console.error("Failed to update report:", error);
      if (error.data && error.data.errors) {
        setErrors(error.data.errors);
      }
    }
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
        <div className="flex justify-between">
          {isEditing ? (
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">Title:</h3>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md shadow-sm mb-4"
              />
            </div>
          ) : (
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 max-w-[60%]">
              {formData.title}
            </h2>
          )}
          {isEditing ? (
            <button onClick={handleSaveChanges} className="text-green-600 flex items-center h-6">
              <FontAwesomeIcon icon={faSave} className="mr-2" /> Save
            </button>
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
              <h3 className="text-lg font-semibold text-gray-800">Photo:</h3>
              <div className="mt-4">
                <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
                {image && image.filename && (
                  <div>
                    <p className="text-gray-700 mt-2">Current image:</p>
                    <img
                      src={image.thumbnailUrl}
                      alt={formData.title}
                      className="mt-2 object-cover w-32 h-32"
                    />
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mb-8 w-full relative">
              {imageIsLoading && (
                <div className="mt-6 absolute inset-0 flex justify-center items-center bg-white bg-opacity-75">
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-300 fill-blue-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
              )}
              <img
                src={isEditing ? image.thumbnailUrl : image.variantUrl} // Use thumbnail when editing
                alt={formData.title}
                onLoad={handleImageLoad}
                className="object-cover"
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
              className="border-gray-300 rounded-md shadow-sm"
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
                  className="border-gray-300 rounded-md shadow-sm mb-4"
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
