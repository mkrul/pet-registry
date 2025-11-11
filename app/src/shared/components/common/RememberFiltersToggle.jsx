import React from "react";

const RememberFiltersToggle = ({
  isEnabled,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Remember search preferences
        </span>
      </div>
      <button
        onClick={() => onToggle(!isEnabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${
          isEnabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
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
