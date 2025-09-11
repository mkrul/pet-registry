import React from "react";
import { Button, FormControl } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { ImageUploadProps } from "../../../types/common/Image";
import { commonInputStyles } from "../../../styles/commonStyles";
import Tip from "../../common/Tip";
import { FormFieldError } from "../../common/FormFieldError";

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onFileChange,
  preview,
  disabled,
  onImageLoad,
  onImageError,
  error
}) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB.");
        return;
      }

      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Unsupported file type. Please upload a JPEG, PNG, or GIF image.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelect?.(file, reader.result as string);
        onFileChange?.(e);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-lg font-medium text-gray-900 mb-2">Photo:</label>
      <Tip>We support images up to 5MB (JPEG or PNG only). The photo should be well lit, with the animal centered in the frame.</Tip>
      <div className="mt-1">
        <div className="relative">
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
              zIndex: 1
            }}
            disabled={disabled}
            data-testid="file-input"
            required
          />
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
        </div>
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
