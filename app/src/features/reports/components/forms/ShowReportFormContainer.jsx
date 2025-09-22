import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import ViewReportForm from "./ViewReportForm";
import EditReportForm from "./EditReportForm";
import Notification from "../../../../shared/components/common/Notification.jsx";
import { useReportEdit } from "../../../../shared/hooks/useReportEdit.js";
import { useSelector, useDispatch } from "react-redux";
import { setNotification } from "../../../../store/features/notifications/notificationsSlice.js";

const ShowReportFormContainer = ({ report, errors }) => {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notifications.notification);
  const location = useLocation();

  const {
    formData,
    isSaving,
    imageSrc,
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

  const handleSubmit = async (e) => {
    const result = await handleSaveChanges(e);
    if (result.error) {
      dispatch(
        setNotification({
          type: "ERROR",
          message: result.error
        })
      );
    } else if (result.success) {
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
        {isEditing ? (
          <EditReportForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleFileChange={handleFileChange}
            handleSaveChanges={handleSubmit}
            handleCancelChanges={handleCancelEdit}
            isSaving={isSaving}
            imageSrc={imageSrc}
            handleImageLoad={handleImageLoad}
            handleImageError={handleImageError}
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
          <ViewReportForm
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
