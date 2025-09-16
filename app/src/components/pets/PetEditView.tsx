import React from 'react';
import { PetProps } from '../../types/Pet';
import { usePetEdit } from '../../hooks/usePetEdit';
import Notification from '../common/Notification';
import { NotificationState } from '../../types/common/Notification';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import Spinner from '../common/Spinner';
import { PetBasicInfoFields } from './common/PetBasicInfoFields';
import { PetIdentificationFields } from './common/PetIdentificationFields';
import { PetColorFields } from './common/PetColorFields';
import { ImageUpload } from '../reports/common/ImageUpload';

interface PetEditViewProps {
  pet: PetProps;
  onBack: () => void;
  onSaveSuccess?: () => void;
  notification?: NotificationState | null;
  onNotificationClose?: () => void;
}

const PetEditView: React.FC<PetEditViewProps> = ({
  pet,
  onBack,
  onSaveSuccess,
  notification,
  onNotificationClose
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
    getFilteredColorOptions
  } = usePetEdit(pet);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSaveChanges(e);
    if (result.success) {
      onSaveSuccess?.();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Pet</h2>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {isSaving ? (
              <div className="flex items-center">
                <Spinner inline size={16} className="mr-2" color="text-white" />
                Saving...
              </div>
            ) : (
              <>
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                Save
              </>
            )}
          </button>
          <button
            onClick={onBack}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Pets
          </button>
        </div>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={onNotificationClose}
        />
      )}

      <div className="w-full mx-auto px-2">
        <form id="edit-pet-form" className="space-y-4">
          <PetBasicInfoFields formData={formData} onInputChange={handleInputChange} readOnly={isSaving} />

          <ImageUpload
            onFileChange={handleFileChange}
            preview={imageSrc}
            disabled={isSaving}
            onImageLoad={handleImageLoad}
            onImageError={handleImageError}
            required={true}
          />

          <PetIdentificationFields
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isSaving}
            error=""
          />

          <PetColorFields
            formData={formData}
            isLoading={isSaving}
            handleColor1Change={value => handleInputChange({ target: { name: "color1", value } })}
            handleColor2Change={value => handleInputChange({ target: { name: "color2", value } })}
            handleColor3Change={value => handleInputChange({ target: { name: "color3", value } })}
          />
        </form>
      </div>
    </div>
  );
};

export default PetEditView;
