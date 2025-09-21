import React from "react";
import { TextField } from "@mui/material";
import { BasicInfoFieldsProps } from "../../types/Report";
import { commonInputStyles } from "../../../../shared/commonStyles";
import Tip from "../../../../shared/components/common/Tip";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError";

export const BasicInfoFields:  = ({
  formData,
  onInputChange,
  readOnly,
  error,
  descriptionError
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Pet Name:</label>
        <span className="text-sm text-gray-500"> (Leave blank if not known)</span>
        <TextField
          name="name"
          value={formData.name}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          disabled={readOnly}
          sx={commonInputStyles}
        />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Title:</label>
        <TextField
          name="title"
          value={formData.title}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          multiline
          rows={1}
          required
          disabled={readOnly}
          error={!!error}
          sx={commonInputStyles}
        />
        <FormFieldError error={error} />
      </div>

      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Description:</label>
        <TextField
          name="description"
          value={formData.description}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          required
          disabled={readOnly}
          error={!!descriptionError}
          sx={commonInputStyles}
        />
        <FormFieldError error={descriptionError} />
      </div>
    </div>
  );
};
