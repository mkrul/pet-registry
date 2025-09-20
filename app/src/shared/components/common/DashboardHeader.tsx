import React from 'react';

interface DashboardHeaderProps {
  title: string;
  actionButton: {
    label: string;
    onClick: () => void;
    className?: string;
  };
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  actionButton
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
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
