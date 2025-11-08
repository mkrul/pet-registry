import React from 'react';
import DashboardHeader from './DashboardHeader';

const FormLayout = ({
  title,
  backButton,
  children,
  formWrapperClassName = "w-full mx-auto px-2"
}) => {
  return (
    <div>
      <DashboardHeader
        title={title}
        actionButton={{
          label: backButton.label,
          onClick: backButton.onClick,
          className: backButton.className || "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
      />

      <div className={formWrapperClassName}>
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
