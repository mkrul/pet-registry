import React from "react";
import { useTheme } from "../../hooks/useTheme";

const RememberFiltersToggle = ({
  isEnabled,
  onToggle
}) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
        isDarkMode ? "border-gray-700" : "border-gray-200 bg-white"
      }`}
      style={
        isDarkMode
          ? { backgroundColor: "rgba(29, 29, 29, 1)" }
          : undefined
      }
    >
      <div className="flex items-center">
        <span className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          Remember search preferences
        </span>
      </div>
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 ${
          isDarkMode
            ? "focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            : "focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white"
        } ${
          isEnabled ? "bg-blue-600" : isDarkMode ? "bg-gray-500" : "bg-gray-300"
        }`}
        role="switch"
        aria-checked={isEnabled}
        aria-label="Remember search filters"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isEnabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
};

export default RememberFiltersToggle;
