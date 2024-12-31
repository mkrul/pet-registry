import React from "react";
import { TextField } from "@mui/material";
import { BasicInfoFieldsProps } from "../../../types/Report";

const commonInputStyles = {
  backgroundColor: "white",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white"
  }
};

export const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  formData,
  onInputChange,
  readOnly
}) => {
  return (
    <>
      <TextField
        label="Title"
        name="title"
        value={formData.title || ""}
        onChange={onInputChange}
        variant="outlined"
        fullWidth
        disabled={readOnly}
        sx={commonInputStyles}
      />

      <TextField
        label="Description"
        name="description"
        value={formData.description || ""}
        onChange={onInputChange}
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        disabled={readOnly}
        sx={commonInputStyles}
      />

      <TextField
        label="Pet's Name (leave blank if not known)"
        name="name"
        value={formData.name || ""}
        onChange={onInputChange}
        variant="outlined"
        fullWidth
        disabled={readOnly}
        sx={commonInputStyles}
      />
    </>
  );
};
