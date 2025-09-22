import React from "react";
import { Alert } from "@mui/material";

export const FormFieldError = ({ error }) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
};
