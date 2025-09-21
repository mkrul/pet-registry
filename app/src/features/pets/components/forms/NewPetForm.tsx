import React, { useState, FormEvent } from "react";
import {
  useGetNewPetQuery,
  useSubmitPetMutation
} from "../../../../store/features/pets/petsApi";
import { usePetForm } from "../../../../shared/hooks/usePetForm";
import { usePetSubmit } from "../../../../shared/hooks/usePetSubmit";
import { usePetFormSubmission } from "../../../../shared/hooks/usePetFormSubmission";
import { PetBasicInfoFields } from "../common/PetBasicInfoFields";
import { PetIdentificationFields } from "../common/PetIdentificationFields";
import { PetColorFields } from "../common/PetColorFields";
import { ImageUpload } from "../../../reports/components/common/ImageUpload";
import { SubmitButton } from "../../../../shared/components/common/SubmitButton";
import Spinner from "../../../../shared/components/common/Spinner";
import {
  PetPropsForm
} from "../../types/Pet";

const NewPetForm: React.FC = () => {
  const { isLoading: isLoadingNewPet } = useGetNewPetQuery();
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
    e: FormEvent<HTMLFormElement>,
    formData: PetPropsForm,
    selectedImage: File | null
  ) => {
    e.preventDefault();
    onSubmit(e, formData, selectedImage);
  };

  if (isLoadingNewPet) return <Spinner />;

  return (
    <form
      className="space-y-6"
      id="new-pet-form"
      onSubmit={e => handleFormSubmit(e, formData, selectedImage)}
      encType="multipart/form-data"
      noValidate
    >

      <div className="mt-[0.5rem]">
        <p className="text-md text-gray-500">
          Register your pet to keep track of their information and make it easier to create reports if they ever go missing.
        </p>
      </div>

      <PetBasicInfoFields
        formData={formData}
        onInputChange={handleInputChange}
        error={""}
      />

      <PetIdentificationFields
        formData={formData}
        onInputChange={handleInputChange}
        isLoading={isLoading}
        error={""}
        breedError={""}
        alteredError={""}
        microchipError={""}
      />

      <PetColorFields
        formData={formData}
        isLoading={isLoading}
        handleColor1Change={(value: string) => handleInputChange({ target: { name: "color1", value } })}
        handleColor2Change={(value: string) => handleInputChange({ target: { name: "color2", value } })}
        handleColor3Change={(value: string) => handleInputChange({ target: { name: "color3", value } })}
        error={""}
      />

      <ImageUpload
        onImageSelect={handleImageSelect}
        preview={imagePreview}
        disabled={isLoading}
        onImageLoad={handleImageLoad}
        onImageError={handleImageError}
        error={""}
        required={true}
      />

      <SubmitButton isLoading={isLoading} />
    </form>
  );
};

export default NewPetForm;
