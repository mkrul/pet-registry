import React from "react";
import { TextField, SelectChangeEvent } from "@mui/material";
import { IReportForm } from "../../types/Report";

const commonInputStyles = {
  backgroundColor: "white",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white"
  }
};

interface BasicInfoFieldsProps {
  formData: IReportForm;
  onInputChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => void;
  readOnly?: boolean;
}

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
