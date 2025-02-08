import React from "react";
import { Alert } from "@mui/material";

interface FormFieldErrorProps {
  error?: string | null;
}

export const FormFieldError: React.FC<FormFieldErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {error}
    </Alert>
  );
};
