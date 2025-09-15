import React from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface FilterWithClearProps {
  children: React.ReactNode;
  hasValue: boolean;
  onClear: () => void;
  label: string;
}

const FilterWithClear: React.FC<FilterWithClearProps> = ({
  children,
  hasValue,
  onClear,
  label
}) => {
  return (
    <div className="relative">
      {children}
      {hasValue && (
        <IconButton
          onClick={onClear}
          size="small"
          sx={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1000,
            color: "gray",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              color: "darkgray"
            },
            width: "24px",
            height: "24px",
            padding: "4px"
          }}
          aria-label={`Clear ${label} filter`}
        >
          <Close fontSize="small" />
        </IconButton>
      )}
    </div>
  );
};

export default FilterWithClear;
