import React from 'react';
import DashboardHeader from './DashboardHeader';

const FormLayout = ({
  title,
  backButton,
  children,
  formWrapperClassName = "w-full mx-auto px-2",
  primaryAction,
  secondaryAction,
  headerActions
}) => {
  const renderActionButtons = () => {
    if (!primaryAction && !secondaryAction) return null;

    return (
      <div className="flex gap-2">
        {primaryAction && (
          <button
            type={primaryAction.type || "button"}
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled}
            className={primaryAction.className || "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"}
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            type={secondaryAction.type || "button"}
            onClick={secondaryAction.onClick}
            disabled={secondaryAction.disabled}
            className={secondaryAction.className || "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"}
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    );
  };

  const headerButton = backButton && {
    label: backButton.label,
    onClick: backButton.onClick,
    className: backButton.className || "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
  };

  const renderHeaderActions = () => {
    const actions = [];

    if (headerActions) {
      const extras = Array.isArray(headerActions) ? headerActions : [headerActions];
      actions.push(...extras.filter(Boolean));
    }

    if (primaryAction || secondaryAction) {
      actions.push(
        <React.Fragment key="form-actions">
          {renderActionButtons()}
        </React.Fragment>
      );
    } else if (headerButton) {
      actions.push(
        <button
          key="back-button"
          onClick={headerButton.onClick}
          className={headerButton.className}
        >
          {headerButton.label}
        </button>
      );
    }

    if (actions.length === 0) return null;

    return (
      <div className="flex items-center gap-2">
        {actions}
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        {renderHeaderActions()}
      </div>

      <div className={formWrapperClassName}>
        {children}
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="pt-6">
          {renderActionButtons()}
        </div>
      )}
    </div>
  );
};

export default FormLayout;
