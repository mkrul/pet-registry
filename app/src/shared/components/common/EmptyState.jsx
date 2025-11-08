import React from 'react';

const EmptyState = ({
  icon,
  title,
  description,
  actionButton
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
      <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {actionButton && (
        <div className="mt-6">
          <button
            onClick={actionButton.onClick}
            className={actionButton.className || "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"}
          >
            {actionButton.label}
          </button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
