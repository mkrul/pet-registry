import React from "react";
import { TextField } from "@mui/material";
import { BasicInfoFieldsProps } from "../../../types/Report";
import { commonInputStyles } from "../../../styles/commonStyles";
import Tip from "../../common/Tip";
import { FormFieldError } from "../../common/FormFieldError";

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  onInputChange,
  readOnly,
  error,
  descriptionError
}) => {
  return (
    <div className="space-y-6">
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
          error={!!error}
        />
        <FormFieldError error={error} />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Pet's Name:</label>{" "}
        <span className="text-sm text-gray-500"> (Leave blank if not known)</span>
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

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Description:</label>
        <Tip>Describe the animal's appearance, behavior, and other relevant details.</Tip>
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
          error={!!descriptionError}
        />
        <FormFieldError error={descriptionError} />
      </div>
    </div>
  );
};
