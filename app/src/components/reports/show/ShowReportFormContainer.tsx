import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { ShowReportFormContainerProps } from "../../../types/Report";
import ReportViewMode from "../edit/ReportViewMode";
import ReportEditMode from "../edit/ReportEditMode";
import Notification from "../../common/Notification";
import { NotificationType } from "../../../types/common/Notification";
import { useReportEdit } from "../../../hooks/useReportEdit";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { setNotification } from "../../../redux/features/notifications/notificationsSlice";

const ShowReportFormContainer: React.FC<ShowReportFormContainerProps> = ({ report, errors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notifications.notification);
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
    VIEW_ZOOM_LEVEL,
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.notification) {
      dispatch(setNotification(location.state.notification));
    }
  }, [location.state, dispatch]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleBackClick = () => {
    const query = searchParams.get("query") || "";
    const page = searchParams.get("page") || "1";
    navigate(`/?query=${encodeURIComponent(query)}&page=${page}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    const result = await handleSaveChanges(e);
    if (result.error) {
      dispatch(
        setNotification({
          type: NotificationType.ERROR,
          message: result.error
        })
      );
    } else if (result.success) {
      dispatch(
        setNotification({
          type: NotificationType.SUCCESS,
          message: result.success.message
        })
      );
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
            onClose={() => dispatch(setNotification(null))}
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
            VIEW_ZOOM_LEVEL={VIEW_ZOOM_LEVEL}
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
