import React from "react";
import { TextField } from "@mui/material";
import { commonInputStyles } from "../../../../shared/commonStyles";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";

export const PetBasicInfoFields = ({
  formData,
  onInputChange,
  readOnly,
  error,
  dashboard = false
}) => {
  if (dashboard) {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pet Name
          </label>
          <input
            id="pet-name"
            name="name"
            type="text"
            value={formData.name || ""}
            onChange={onInputChange}
            required
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter pet name"
          />
          <FormFieldError error={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 dark:text-gray-100">Pet Name:</label>
        <TextField
          name="name"
          value={formData.name}
          onChange={onInputChange}
          variant="outlined"
          fullWidth
          required
          disabled={readOnly}
          error={!!error}
          sx={commonInputStyles}
        />
        <FormFieldError error={error} />
      </div>
    </div>
  );
};
