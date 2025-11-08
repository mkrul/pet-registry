import React, { useRef } from "react";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { commonInputStyles } from "../../../../shared/commonStyles.js";
import Tip from "../../../../shared/components/common/Tip.jsx";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";
import { useAppDispatch } from "../../../../store/hooks";
import { addNotification } from "../../../../store/features/notifications/notificationsSlice";

export const ImageUpload = ({
  onImageSelect,
  onFileChange,
  preview,
  disabled,
  onImageLoad,
  onImageError,
  error,
  required = true,
  dashboard = false
}) => {
  const fileInputRef = useRef(null);
  const dispatch = useAppDispatch();
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        dispatch(addNotification({
          type: "ERROR",
          message: "File size exceeds 5MB."
        }));
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        dispatch(addNotification({
          type: "ERROR",
          message: "Unsupported file type. Please upload a JPEG, PNG, or GIF image."
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect?.(file, reader.result);
        onFileChange?.(e);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDashboardButtonClick = () => {
    if (disabled) {
      return;
    }
    fileInputRef.current?.click();
  };

  const renderButton = () => {
    if (dashboard) {
      return (
        <button
          type="button"
          onClick={handleDashboardButtonClick}
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900/60 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
          disabled={disabled}
        >
          <CloudUpload fontSize="small" />
          Choose File
        </button>
      );
    }

    return (
      <Button
        variant="outlined"
        startIcon={<CloudUpload />}
        disabled={disabled}
        sx={{
          ...commonInputStyles,
          width: "fit-content",
          position: "relative",
          borderColor: error ? "error.main" : undefined
        }}
      >
        Choose File
      </Button>
    );
  };

  return (
    <div className="space-y-2">
      <label className={`mb-2 ${dashboard ? 'block text-sm font-medium text-gray-700 dark:text-gray-300' : 'text-lg font-medium text-gray-900 dark:text-gray-100'}`}>
        Photo
      </label>
      <Tip>We support images up to 5MB (JPEG or PNG only). The photo should be well lit, with the animal centered in the frame.</Tip>
      <div className="mt-1">
        <input
          ref={fileInputRef}
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          disabled={disabled}
          data-testid="file-input"
          required={required}
        />
        {renderButton()}
        <FormFieldError error={error} />
        {preview && (
          <div className="mt-2 relative w-48 h-48">
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full rounded-md"
              onLoad={onImageLoad}
              onError={onImageError}
            />
          </div>
        )}
      </div>
    </div>
  );
};
