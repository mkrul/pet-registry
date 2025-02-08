import React from "react";
import { Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { commonInputStyles } from "../../styles/commonStyles";

interface AddFieldButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  testId?: string;
}

export const AddFieldButton: React.FC<AddFieldButtonProps> = ({
  onClick,
  disabled = false,
  label = "ADD FIELD",
  testId = "add-field-button"
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      color="primary"
      variant="text"
      sx={commonInputStyles}
      data-testid={testId}
    >
      <div className="flex items-center">
        <FontAwesomeIcon icon={faPlus} className="mr-2 mb-[3px]" />
        <span>{label}</span>
      </div>
    </Button>
  );
};
