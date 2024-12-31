import React, { useState } from "react";
import { ShowReportFormContainerProps } from "../../../types/Report";
import ReportViewMode from "../edit/ReportViewMode";
import ReportEditMode from "../edit/ReportEditMode";
import Notification from "../../common/Notification";
import { NotificationState, NotificationType } from "../../../types/common/Notification";
import { useLocation } from "react-router-dom";
import { useReportEdit } from "../../../hooks/useReportEdit";

const ShowReportFormContainer: React.FC<ShowReportFormContainerProps> = ({ report, errors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const location = useLocation();

  const {
    formData,
    isSaving,
    imageSrc,
    showBreed2,
    showColor2,
    showColor3,
    speciesOptions,
    breedOptions,
    colorOptions,
    genderOptions,
    EDIT_ZOOM_LEVEL,
    handleInputChange,
    handleFileChange,
    handleImageLoad,
    handleImageError,
    handleSaveChanges,
    addBreed,
    removeBreed,
    addColor,
    removeColor,
    handleLocationSelect,
    getFilteredBreedOptions,
    getFilteredColorOptions
  } = useReportEdit(report);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleBackClick = () => {
    window.history.back();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const result = await handleSaveChanges(e);
    if (result.error) {
      setNotification({
        type: NotificationType.ERROR,
        message: result.error
      });
    } else if (result.success) {
      setNotification({
        type: NotificationType.SUCCESS,
        message: result.success.message
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 w-full md:w-[50rem] lg:w-[50rem]">
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

      <div className="p-6 bg-white rounded-lg shadow-lg">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {isEditing ? (
          <ReportEditMode
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleSaveChanges={handleSubmit}
            handleCancelChanges={handleCancelEdit}
            isSaving={isSaving}
            imageSrc={imageSrc}
            handleImageLoad={handleImageLoad}
            handleImageError={handleImageError}
            showBreed2={showBreed2}
            showColor2={showColor2}
            showColor3={showColor3}
            addBreed={addBreed}
            removeBreed={removeBreed}
            addColor={addColor}
            removeColor={removeColor}
            handleLocationSelect={handleLocationSelect}
            speciesOptions={speciesOptions}
            breedOptions={breedOptions}
            getFilteredBreedOptions={getFilteredBreedOptions}
            colorOptions={colorOptions}
            getFilteredColorOptions={getFilteredColorOptions}
            genderOptions={genderOptions}
            EDIT_ZOOM_LEVEL={EDIT_ZOOM_LEVEL}
          />
        ) : (
          <ReportViewMode
            report={formData}
            onEditClick={handleEditClick}
            onBackClick={handleBackClick}
            imageSrc={imageSrc}
            handleImageLoad={handleImageLoad}
            handleImageError={handleImageError}
          />
        )}
      </div>
    </div>
  );
};

export default ShowReportFormContainer;