import React from "react";
import { TextField } from "@mui/material";
import { BasicInfoFieldsProps } from "../../../types/Report";
import { commonInputStyles } from "../../../styles/commonStyles";

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  onInputChange,
  readOnly
}) => {
  return (
    <>
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Title:</label>
        <TextField
          name="title"
          value={formData.title || ""}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          required
          disabled={readOnly}
          sx={commonInputStyles}
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Description:</label>
        <TextField
          name="description"
          value={formData.description || ""}
          onChange={onInputChange}
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          required
          disabled={readOnly}
          sx={commonInputStyles}
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Pet's Name (if known):</label>
        <TextField
          name="name"
          value={formData.name || ""}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          disabled={readOnly}
          sx={commonInputStyles}
        />
      </div>
    </>
  );
};
