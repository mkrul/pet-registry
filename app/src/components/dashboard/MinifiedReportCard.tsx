import React from 'react';
import { ReportProps } from '../../types/Report';

interface MinifiedReportCardProps {
  report: ReportProps;
  onClick: (report: ReportProps) => void;
  onEdit?: (report: ReportProps) => void;
  onDelete?: (report: ReportProps) => void;
}

const MinifiedReportCard: React.FC<MinifiedReportCardProps> = ({ report, onClick, onEdit, onDelete }) => {
  const placeholderPath = "/images/placeholder.png";
  const imageSrc = report.image?.variantUrl || placeholderPath;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(report);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(report);
  };

  return (
    <div onClick={() => onClick(report)} className="block">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <img
            src={imageSrc}
            alt={report.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== placeholderPath) {
                e.currentTarget.src = placeholderPath;
              }
            }}
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                aria-label="Edit report"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                aria-label="Delete report"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinifiedReportCard;
