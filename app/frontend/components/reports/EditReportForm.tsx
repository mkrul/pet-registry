import React, { useState, useCallback } from "react";
import Slider from "react-slick";
import { IReport } from "../../types/reports/Report";
import { faPencil, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloudinaryWidget from "../shared/CloudinaryWidget";
import { IImage } from "../../types/shared/Image";
import { IReportForm } from "../../types/reports/Report";
import { useUpdateReportMutation } from "../../redux/features/reports/reportsApi";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { dogBreedOptionsList } from "../../lib/reports/dogBreedOptionsList";
import { catBreedOptionsList } from "../../lib/reports/catBreedOptionsList";

interface EditReportFormProps {
  report: IReport;
  errors?: string[];
}

const EditReportForm: React.FC<EditReportFormProps> = ({ report, errors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(report);
  const [images, setImages] = useState<IImage[]>(report.images); // Assuming report.images is also of type IImage[]
  const [newImages, setNewImages] = useState<File[]>([]);
  const [updateReport] = useUpdateReportMutation();

  const breedOptions =
    formData.species.toLowerCase() === "dog"
      ? dogBreedOptionsList
      : formData.species.toLowerCase() === "cat"
        ? catBreedOptionsList
        : [];

  const [showBreed2, setShowBreed2] = useState(!!formData.breed2);
  const [showColor2, setShowColor2] = useState(!!formData.color2);
  const [showColor3, setShowColor3] = useState(!!formData.color3);

  const carouselSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: images.length,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: images.length,
          slidesToScroll: 1,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

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
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    const imageIdsToKeep = images.filter(img => img.id !== undefined).map(img => img.id as number);

    const formDataToSend = new FormData();

    // Append form fields
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

    // Append image IDs to keep
    imageIdsToKeep.forEach(id => {
      formDataToSend.append("image_ids_to_keep[]", id.toString());
    });

    // Append new images
    newImages.forEach(file => {
      formDataToSend.append("images[]", file);
    });

    try {
      await updateReport({ id: formData.id, data: formDataToSend }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update report:", error);
    }
  };

  const handleUploadSuccess = useCallback((updatedImages: IImage[]) => {
    setFormData(prev => ({
      ...prev,
      images: updatedImages // updatedImages should be of type IImage[]
    }));
  }, []);

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
            <>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border-gray-300 rounded-md shadow-sm mb-4"
              />
            </>
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
          <h3 className="text-lg font-semibold text-gray-800">Photos:</h3>
          {isEditing ? (
            <div className="mt-4">
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </div>
          ) : (
            images.length > 0 && (
              <div className="mb-8 w-full">
                <Slider {...carouselSettings}>
                  {images.map((image, index) => (
                    <div key={index} className="image-slide">
                      <img
                        src={image.url}
                        alt={`Report image ${index + 1}`}
                        className="rounded-lg image-style"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )
          )}
        </div>

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
          <h3 className="text-lg font-semibold text-gray-800">Microchipped:</h3>
          {isEditing ? (
            <div className="mt-1">
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
                      value={formData.color3 || ""} // Ensure value falls back to an empty string if null/undefined
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
