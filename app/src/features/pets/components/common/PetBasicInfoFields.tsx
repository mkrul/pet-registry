import React from "react";
import { TextField } from "@mui/material";
import { PetBasicInfoFieldsProps } from "../../types/Pet";
import { commonInputStyles } from "../../../../shared/commonStyles";
import { FormFieldError } from "../../../../shared/components/common/FormFieldError";

export const PetBasicInfoFields:  = ({
  formData,
  onInputChange,
  readOnly,
  error
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900">Pet Name:</label>
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
