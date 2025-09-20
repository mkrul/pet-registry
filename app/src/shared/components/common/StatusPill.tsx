import React from 'react';

interface StatusPillProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  customColors?: {
    bg: string;
    text: string;
  };
}

const StatusPill: React.FC<StatusPillProps> = ({
  status,
  variant = 'default',
  customColors
}) => {
  const getVariantClasses = () => {
    if (customColors) {
      return `${customColors.bg} ${customColors.text}`;
    }

    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'error':
        return 'bg-red-100 text-red-600';
      case 'info':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getVariantClasses()}`}>
      {status}
    </span>
  );
};

export default StatusPill;
