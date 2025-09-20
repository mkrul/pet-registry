import React from "react";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { commonInputStyles } from "../../../../shared/commonStyles";

interface RemoveFieldButtonProps {
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
  ariaLabel?: string;
}

export const RemoveFieldButton: React.FC<RemoveFieldButtonProps> = ({
  onClick,
  disabled = false,
  testId = "remove-field-button",
  ariaLabel = "Remove Field"
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      color="error"
      variant="text"
      startIcon={<CloseIcon fontSize="medium" />}
      aria-label={ariaLabel}
      sx={commonInputStyles}
      data-testid={testId}
    >
      Remove
    </Button>
  );
};
