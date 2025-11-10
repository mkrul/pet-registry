import React from 'react';
import { usePetEdit } from '../../../../shared/hooks/usePetEdit.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from '../../../../shared/components/common/Spinner.jsx';
import FormLayout from '../../../../shared/components/common/FormLayout.jsx';
import { PetBasicInfoFields } from '../common/PetBasicInfoFields.jsx';
import { PetIdentificationFields } from '../common/PetIdentificationFields.jsx';
import { PetColorFields } from '../common/PetColorFields.jsx';
import { ImageUpload } from '../../../listings/components/common/ImageUpload.jsx';
import AssociatedRecordUpdateModal from '../../../../shared/components/common/AssociatedRecordUpdateModal.jsx';


const PetEditForm = ({
  pet,
  onBack,
  onSaveSuccess
}) => {
  const {
    formData,
    isSaving,
    imageSrc,
    speciesOptions,
    breedOptions,
    colorOptions,
    genderOptions,
    handleInputChange,
    handleFileChange,
    handleImageLoad,
    handleImageError,
    handleSaveChanges,
    getFilteredBreedOptions,
    getFilteredColorOptions,
    showConfirmModal,
    handleConfirmSave,
    handleCancelSave
  } = usePetEdit(pet);

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await handleSaveChanges(e);
    if (result.success) {
      onSaveSuccess?.();
    }
  };

  const handleConfirmAndSave = async () => {
    const result = await handleConfirmSave();
    if (result.success) {
      onSaveSuccess?.();
    }
  };

  const SaveButtonContent = () => (
    isSaving ? (
      <div className="flex items-center">
        <Spinner inline size={16} className="mr-2" color="text-white" />
        Saving...
      </div>
    ) : (
      <>
        <FontAwesomeIcon icon={faSave} className="mr-2" />
        Save
      </>
    )
  );

  return (
    <FormLayout
      title="Edit Pet"
      primaryAction={{
        label: <SaveButtonContent />,
        onClick: handleSave,
        disabled: isSaving,
        className: "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      }}
      secondaryAction={{
        label: "Back to Pets",
        onClick: onBack,
        className: "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
      }}
      formWrapperClassName="w-full"
    >
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <form id="edit-pet-form" className="space-y-6">
          <PetBasicInfoFields formData={formData} onInputChange={handleInputChange} readOnly={isSaving} dashboard />

          <ImageUpload
            onFileChange={handleFileChange}
            preview={imageSrc}
            disabled={isSaving}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            required={true}
            dashboard
          />

          <PetIdentificationFields
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isSaving}
            error=""
            breedError=""
            alteredError=""
            microchipError=""
            dashboard
          />

          <PetColorFields
            formData={formData}
            isLoading={isSaving}
            handleColor1Change={(value) => handleInputChange({ target: { name: "color1", value } })}
            handleColor2Change={(value) => handleInputChange({ target: { name: "color2", value } })}
            handleColor3Change={(value) => handleInputChange({ target: { name: "color3", value } })}
            dashboard
          />
        </form>
      </div>

      <AssociatedRecordUpdateModal
        isOpen={showConfirmModal}
        onClose={handleCancelSave}
        onConfirm={handleConfirmAndSave}
        recordType="pet"
        isLoading={isSaving}
      />
    </FormLayout>
  );
};

export default PetEditForm;
