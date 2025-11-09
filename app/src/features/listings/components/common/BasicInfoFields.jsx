import React from "react";
import { TextField } from "@mui/material";
import { commonInputStyles } from "../../../../shared/commonStyles.js";
import Tip from "../../../../shared/components/common/Tip.jsx";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError.jsx";

export const BasicInfoFields = ({
  formData,
  onInputChange,
  readOnly,
  error,
  descriptionError,
  dashboard = false
}) => {
  if (dashboard) {
    return (
      <div className="space-y-6">
        <div>
          <label htmlFor="pet-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pet Name
            <span className="text-sm text-gray-500 dark:text-gray-400 font-normal ml-1">(Leave blank if not known)</span>
          </label>
          <input
            id="pet-name"
            name="name"
            type="text"
            value={formData.name || ""}
            onChange={onInputChange}
            disabled={readOnly}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Enter pet name (optional)"
          />
          <FormFieldError error={error} />
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <textarea
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={onInputChange}
            required
            disabled={readOnly}
            rows={1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            placeholder="Enter title"
          />
          <FormFieldError error={error} />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={onInputChange}
            required
            disabled={readOnly}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900/60 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            placeholder="Enter description"
          />
          <FormFieldError error={descriptionError} />
        </div>
      </div>
    );
  }

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
