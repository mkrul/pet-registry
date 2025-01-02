import React from "react";
import { FormControl, Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { ImageUploadProps } from "../../../types/common/Image";

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, preview, disabled }) => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB.");
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        alert("Unsupported file type. Please upload a JPEG, PNG, or GIF image.");
        return;
      }

      onImageSelect(file);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900 mb-2">Upload Image</h2>
      <FormControl fullWidth>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          sx={{ mt: 1, width: "fit-content" }}
          disabled={disabled}
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
          <div className="relative w-32 h-32 mt-3">
            <img src={preview} alt="Selected" className="object-cover w-full h-full rounded-md" />
          </div>
        )}
      </FormControl>
    </div>
  );
};
