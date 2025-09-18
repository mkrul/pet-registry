import React from 'react';

interface ReportStatusPillProps {
  status: string;
}

const ReportStatusPill: React.FC<ReportStatusPillProps> = ({ status }) => {
  if (status === 'archived') {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
        Archived
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">
      Active
    </span>
  );
};

export default ReportStatusPill;
