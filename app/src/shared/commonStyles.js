export const commonInputStyles = {
  backgroundColor: "white",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white"
  },
  "& .MuiSelect-select": {
    backgroundColor: "white"
  },
  "& .MuiButton-outlined": {
    backgroundColor: "white"
  }
};

export const getDashboardSelectConfig = (isDarkMode) => {
  const selectTypography = {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: "1.5rem"
  };

  const backgroundColor = isDarkMode ? "rgba(29, 29, 29, 1)" : "white";
  const textColor = isDarkMode ? "rgb(243, 244, 246)" : "rgb(17, 24, 39)";
  const borderColor = isDarkMode ? "rgba(29, 29, 29, 1)" : "rgb(209, 213, 219)";

  return {
    selectSx: {
      "& .MuiSelect-select": {
        padding: "12px 14px",
        backgroundColor,
        borderRadius: "0.375rem",
        color: textColor,
        ...selectTypography
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: isDarkMode ? "rgba(29, 29, 29, 1)" : "rgb(156, 163, 175)"
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgb(59, 130, 246)",
        borderWidth: "2px"
      },
      backgroundColor,
      borderRadius: "0.375rem"
    },
    placeholderStyle: {
      color: isDarkMode ? "rgb(156, 163, 175)" : "rgb(107, 114, 128)",
      ...selectTypography
    },
    menuProps: {
      PaperProps: {
        sx: {
          borderRadius: "0.375rem",
          border: borderColor,
          backgroundColor,
          "& .MuiMenuItem-root": {
            color: textColor,
            ...selectTypography,
            "&.Mui-selected": {
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              color: isDarkMode ? "rgb(147, 197, 253)" : "#1d4ed8"
            },
            "&.Mui-selected:hover": {
              backgroundColor: "rgba(59, 130, 246, 0.2)"
            },
            "&:hover": {
              backgroundColor: isDarkMode
                ? "rgba(75, 85, 99, 0.6)"
                : "rgb(243, 244, 246)"
            }
          }
        }
      }
    }
  };
};
