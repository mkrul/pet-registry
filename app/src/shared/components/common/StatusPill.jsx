import React from 'react';
import { Home, Warning, CheckCircle, Archive } from '@mui/icons-material';

const StatusPill = ({
  status,
  variant = 'default',
  customColors
}) => {
  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case 'home':
        return <Home sx={{ fontSize: 14 }} />;
      case 'missing':
        return <Warning sx={{ fontSize: 14 }} />;
      case 'active':
        return <CheckCircle sx={{ fontSize: 14 }} />;
      case 'archived':
        return <Archive sx={{ fontSize: 14 }} />;
      default:
        return null;
    }
  };

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
    <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getVariantClasses()}`}>
      {getStatusIcon()}
      {status}
    </span>
  );
};

export default StatusPill;
