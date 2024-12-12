import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../redux/features/reports/reportsApi";
import Map from "../shared/Map";
import { IReportForm } from "../../types/Report";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { genderOptionsList } from "../../lib/reports/genderOptionsList";
import { catBreedOptionsList } from "../../lib/reports/catBreedOptionsList";
import { dogBreedOptionsList } from "../../lib/reports/dogBreedOptionsList";
import { speciesOptionsList } from "../../lib/reports/speciesOptionsList";
import Spinner from "../shared/Spinner";

const NewReportForm: React.FC = () => {
  const { isLoading: isLoadingNewReport, isError: isNewReportError } = useGetNewReportQuery();
  const [submitReport, { isLoading, isError, isSuccess }] = useSubmitReportMutation();

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

  const genderOptions = useMemo(() => genderOptionsList, []);
  const speciesOptions = useMemo(() => speciesOptionsList, []);
  const colorOptions = useMemo(() => colorOptionsList, []);
  const dogBreeds = useMemo(() => dogBreedOptionsList, []);
  const catBreeds = useMemo(() => catBreedOptionsList, []);

  useEffect(() => {
    setBreedOptions(
      formData.species.toLowerCase() === "dog"
        ? dogBreeds
        : formData.species.toLowerCase() === "cat"
          ? catBreeds
          : []
    );
    setShowBreed2(!!formData.breed1);
    setShowColor2(!!formData.color1);
    setShowColor3(!!formData.color2);
  }, [formData, dogBreeds, catBreeds]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;

      let processedValue: any = value;
      if (type === "radio" && name === "microchipped") {
        if (value === "true") processedValue = true;
        else if (value === "false") processedValue = false;
        else processedValue = null;
      }

      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));
    },
    []
  );

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
      await submitReport(formDataToSend).unwrap();
      // Optionally, reset the form
      setFormData({
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
      setSelectedImage(null);
      setImagePreview("");
    } catch (error) {
      console.error("Failed to submit report:", error);
      // Optionally, display error messages to the user
    }
  };

  if (isLoadingNewReport) return <Spinner />;
  if (isNewReportError) return <div>Failed to load report form.</div>;

  return (
    <form
      className="space-y-6"
      id="lost-pet-report-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
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
      <div>
        <label className="block font-medium text-gray-700">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-medium text-gray-700">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block font-medium text-gray-700">Pet's name, if known:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block font-medium text-gray-700">
          Gender: <span className="ml-1 text-red-400">*</span>
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">Choose one</option>
          {genderOptions.map((gender, index) => (
            <option key={index} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>

      {/* Species */}
      <div>
        <label className="block font-medium text-gray-700">
          Species: <span className="ml-1 text-red-400">*</span>
        </label>
        <select
          name="species"
          value={formData.species}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">Choose one</option>
          {speciesOptions.map((species, index) => (
            <option key={index} value={species}>
              {species}
            </option>
          ))}
        </select>
      </div>

      {/* Microchipped */}
      <div>
        <label className="block font-medium text-gray-700">
          Is the animal microchipped?: <span className="ml-1 text-red-400">*</span>
        </label>
        <div className="mt-1">
          <div>
            <input
              type="radio"
              id="microchipped-yes"
              name="microchipped"
              value="true"
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
              value="false"
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
              value="unknown"
              onChange={handleInputChange}
              required
            />
            <label htmlFor="microchipped-unknown" className="ml-2">
              I don't know
            </label>
          </div>
        </div>
      </div>

      {/* Microchip ID */}
      {formData.microchipped === true && (
        <div className="mt-4">
          <label className="block font-medium text-gray-700">Microchip ID:</label>
          <input
            type="text"
            name="microchipId"
            value={formData.microchipId || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      )}

      {/* Breed 1 */}
      <div>
        <label className="block font-medium text-gray-700">
          Breed 1: <span className="text-red-400">*</span>
        </label>
        <select
          name="breed1"
          value={formData.breed1}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">Choose one</option>
          {breedOptions.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
      </div>

      {/* Breed 2 */}
      {showBreed2 && (
        <div>
          <label className="block font-medium text-gray-700">Breed 2:</label>
          <select
            name="breed2"
            value={formData.breed2 || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Choose one</option>
            {breedOptions.map((breed, index) => (
              <option key={index} value={breed}>
                {breed}
              </option>
            ))}
          </select>
          {/* Option to Remove Breed 2 */}
          <button
            type="button"
            onClick={() => setShowBreed2(false)}
            className="mt-2 text-red-600 font-medium"
            disabled={isLoading}
          >
            Remove Breed 2
          </button>
        </div>
      )}

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

      {/* Color 1 */}
      <div>
        <label className="block font-medium text-gray-700">
          Color 1: <span className="text-red-400">*</span>
        </label>
        <select
          name="color1"
          value={formData.color1}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        >
          <option value="">Choose one</option>
          {colorOptions.map((color, index) => (
            <option key={index} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>

      {/* Color 2 */}
      {showColor2 && (
        <div>
          <label className="block font-medium text-gray-700">Color 2:</label>
          <select
            name="color2"
            value={formData.color2 || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Choose one</option>
            {colorOptions.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
          {/* Option to Remove Color 2 */}
          <button
            type="button"
            onClick={() => setShowColor2(false)}
            className="mt-2 text-red-600 font-medium"
            disabled={isLoading}
          >
            Remove Color 2
          </button>
        </div>
      )}

      {/* Color 3 */}
      {showColor3 && (
        <div>
          <label className="block font-medium text-gray-700">Color 3:</label>
          <select
            name="color3"
            value={formData.color3 || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          >
            <option value="">Choose one</option>
            {colorOptions.map((color, index) => (
              <option key={index} value={color}>
                {color}
              </option>
            ))}
          </select>
          {/* Option to Remove Color 3 */}
          <button
            type="button"
            onClick={() => setShowColor3(false)}
            className="mt-2 text-red-600 font-medium"
            disabled={isLoading}
          >
            Remove Color 3
          </button>
        </div>
      )}

      {/* Button to Add Color 2 or 3 */}
      {formData.color1 && !showColor2 && (
        <button
          type="button"
          onClick={() => setShowColor2(true)}
          className="mt-2 text-blue-600 font-medium"
          disabled={isLoading}
        >
          Add another color
        </button>
      )}
      {showColor2 && !showColor3 && (
        <button
          type="button"
          onClick={() => setShowColor3(true)}
          className="mt-2 text-blue-600 font-medium"
          disabled={isLoading}
        >
          Add third color
        </button>
      )}

      {/* Image Upload */}
      <div>
        <label className="block font-medium text-gray-700">Upload Image:</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full"
          disabled={isLoading}
        />
        {imagePreview && (
          <div className="relative w-32 h-32 mt-3">
            <img
              src={imagePreview}
              alt="Selected"
              className="object-cover w-full h-full rounded-md"
            />
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Location Information</h2>
        <p className="text-sm text-gray-500 mb-4">
          Click on the map to drop a pin where the pet was last seen. The address details will be
          automatically filled in.
        </p>

        <Map onLocationSelect={handleLocationSelect} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block font-medium text-gray-700">
              City <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              State <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700">
              Country <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-fit inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      {/* Success and Error Messages */}
      {isError && <p className="text-red-500">Failed to submit the report.</p>}
      {isSuccess && <p className="text-green-500">Report submitted successfully.</p>}
    </form>
  );
};

export default NewReportForm;
