import React, { useEffect, useState, useMemo, useCallback } from "react";
import CloudinaryWidget from "../shared/CloudinaryWidget";
import {
  useGetNewReportQuery,
  useSubmitReportMutation
} from "../../redux/features/reports/reportsApi";
import { IReportForm } from "../../types/reports/Report";
import { IImage } from "../../types/shared/Image";
import { colorOptionsList } from "../../lib/reports/colorOptionsList";
import { genderOptionsList } from "../../lib/reports/genderOptionsList";
import { catBreedOptionsList } from "../../lib/reports/catBreedOptionsList";
import { dogBreedOptionsList } from "../../lib/reports/dogBreedOptionsList";
import { speciesOptionsList } from "../../lib/reports/speciesOptionsList";

const ReportForm: React.FC = () => {
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
    images: [], // Initialize as an empty array of IImage
    imageIdsToKeep: [],
    microchipped: null,
    microchipId: ""
  });

  const genderOptions = useMemo(() => genderOptionsList, []);
  const speciesOptions = useMemo(() => speciesOptionsList, []);
  const colorOptions = useMemo(() => colorOptionsList, []);
  const dogBreeds = useMemo(() => dogBreedOptionsList, []);
  const catBreeds = useMemo(() => catBreedOptionsList, []);

  useEffect(() => {
    setBreedOptions(
      formData.species === "Dog" ? dogBreeds : formData.species === "Cat" ? catBreeds : []
    );
    setShowBreed2(!!formData.breed1);
    setShowColor2(!!formData.color1);
    setShowColor3(!!formData.color2);
  }, [formData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData(prev => ({
        ...prev,
        [name]: value === "true" ? true : value === "false" ? false : value
      }));
    },
    []
  );

  const handleUploadSuccess = (images: IImage[]) => {
    setFormData(prev => ({
      ...prev,
      images: images // images is IImage[]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filteredFormData = {
      ...formData,
      breed2: showBreed2 ? formData.breed2 : null,
      color2: showColor2 ? formData.color2 : null,
      color3: showColor3 ? formData.color3 : null
    };

    try {
      await submitReport({ data: filteredFormData }).unwrap();
      alert("Report submitted successfully!");
    } catch (error) {
      console.error("Failed to submit report:", error);
    }
  };

  if (isLoadingNewReport) return <div>Loading report form...</div>;
  if (isNewReportError) return <div>Failed to load report form.</div>;

  return (
    <form className="space-y-6" id="lost-pet-report-form" onSubmit={handleSubmit}>
      <div className="mt-[0.5rem]">
        Please include as many details as possible and upload <strong>at least</strong> 1 to 3
        photos of the animal. If the animal's breeds are unknown, provide your best guess along with
        a thorough description.
      </div>
      <div className="text-sm text-gray-500 mb-3">
        <p>
          Fields marked with <span className="text-red-400">*</span> are required.
        </p>
      </div>
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
              value={"true"}
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
              value={"unknown"}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="microchipped-unknown" className="ml-2">
              I don't know
            </label>
          </div>
        </div>
      </div>

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
      <div>
        <label className="block font-medium text-gray-700">
          Breed 1: <span className="ml-1 text-red-400">*</span>
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
        </div>
      )}

      <div>
        <label className="block font-medium text-gray-700">
          Color 1: <span className="ml-1 text-red-400">*</span>
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
        </div>
      )}

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
        </div>
      )}

      <CloudinaryWidget onUploadSuccess={handleUploadSuccess} />

      <button
        type="submit"
        className="fit-content inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>

      {isError && <p className="text-red-500">Failed to submit the report.</p>}
      {isSuccess && <p className="text-green-500">Report submitted successfully.</p>}
    </form>
  );
};

export default ReportForm;
