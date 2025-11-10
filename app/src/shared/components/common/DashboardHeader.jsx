import React from 'react';

const DashboardHeader = ({
  title,
  actionButton
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
      <button
        onClick={actionButton.onClick}
        className={actionButton.className || "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"}
      >
        {actionButton.label}
      </button>
    </div>
  );
};

export default DashboardHeader;
