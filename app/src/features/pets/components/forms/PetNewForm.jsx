import React, { useState } from "react";
import {
  useSubmitPetMutation
} from "../../../../store/features/pets/petsApi.js";
import { usePetForm } from "../../../../shared/hooks/usePetForm.js";
import { usePetSubmit } from "../../../../shared/hooks/usePetSubmit.js";
import { usePetFormSubmission } from "../../../../shared/hooks/usePetFormSubmission.js";
import { PetBasicInfoFields } from "../common/PetBasicInfoFields.jsx";
import { PetIdentificationFields } from "../common/PetIdentificationFields.jsx";
import { PetColorFields } from "../common/PetColorFields.jsx";
import { ImageUpload } from "../../../listings/components/common/ImageUpload.jsx";
import { PetFormPopulateButton } from "../../../../shared/components/common/PetFormPopulateButton.jsx";
import Spinner from "../../../../shared/components/common/Spinner.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewPetForm = () => {
  const [submitPet, { isLoading }] = useSubmitPetMutation();

  const {
    formData,
    setFormData,
    selectedImage,
    imagePreview,
    handleInputChange,
    handleImageSelect,
    handleImageLoad,
    handleImageError
  } = usePetForm();

  const { handleSubmit } = usePetSubmit({
    submitPet
  });

  const { onSubmit } = usePetFormSubmission(handleSubmit);

  const handleFormSubmit = (
    e,
    formData,
    selectedImage
  ) => {
    e.preventDefault();
    onSubmit(e, formData, selectedImage);
  };

  return (
    <div>
      <div className="max-w-2xl">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <form id="new-pet-form" className="space-y-6" onSubmit={e => handleFormSubmit(e, formData, selectedImage)} encType="multipart/form-data" noValidate>
            <PetFormPopulateButton
              setFormData={setFormData}
              handleImageSelect={handleImageSelect}
            />

            <div className="mt-[0.5rem]">
              <p className="text-md text-gray-500 dark:text-gray-400">
                Register your pet to keep track of their information and make it easier to create reports if they ever go missing.
              </p>
            </div>

            <PetBasicInfoFields
              formData={formData}
              onInputChange={handleInputChange}
              error={""}
              dashboard
            />

            <PetIdentificationFields
              formData={formData}
              onInputChange={handleInputChange}
              isLoading={isLoading}
              error={""}
              breedError={""}
              alteredError={""}
              microchipError={""}
              dashboard
            />

            <PetColorFields
              formData={formData}
              isLoading={isLoading}
              handleColor1Change={(value) => handleInputChange({ target: { name: "color1", value } })}
              handleColor2Change={(value) => handleInputChange({ target: { name: "color2", value } })}
              handleColor3Change={(value) => handleInputChange({ target: { name: "color3", value } })}
              error={""}
              dashboard
            />

            <ImageUpload
              onImageSelect={handleImageSelect}
              preview={imagePreview}
              disabled={isLoading}
              onImageLoad={handleImageLoad}
              onImageError={handleImageError}
              error={""}
              required={true}
              dashboard
            />
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={(e) => handleFormSubmit(e, formData, selectedImage)}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <Spinner inline size={16} className="mr-2" color="text-white" />
                    Submitting...
                  </div>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Submit
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPetForm;
