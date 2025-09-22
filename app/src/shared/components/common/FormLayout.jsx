import React from 'react';
import DashboardHeader from './DashboardHeader';
import Notification from './Notification';

const FormLayout = ({
  title,
  backButton,
  notification,
  onNotificationClose,
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
          className: backButton.className || "bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
      />

      {notification && onNotificationClose && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={onNotificationClose}
        />
      )}

      <div className={formWrapperClassName}>
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
