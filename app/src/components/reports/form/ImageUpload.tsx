import React from "react";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { ImageUploadProps } from "../../../types/common/Image";
import { commonInputStyles } from "../../../styles/commonStyles";
import Tip from "../../common/Tip";

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onFileChange,
  preview,
  disabled,
  onImageLoad,
  onImageError
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
      <Tip>
        The best photos are taken outdoors with good lighting. Your photo should be well lit, with
        the animal's face centered in the frame.
      </Tip>
      <div className="mt-1">
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          disabled={disabled}
          sx={{ ...commonInputStyles, width: "fit-content" }}
        >
          Choose File
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            disabled={disabled}
            data-testid="file-input"
          />
        </Button>
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
