import React from "react";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const FilterWithClear = ({
  children,
  hasValue,
  onClear,
  label,
  isDarkMode = false
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
            color: "rgb(255, 255, 255)",
            backgroundColor: "rgba(29, 29, 29, 0.9)",
            "&:hover": {
              backgroundColor: "rgba(55, 65, 81, 0.85)",
              color: "rgb(255, 255, 255)"
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
