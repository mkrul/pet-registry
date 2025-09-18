import React from 'react';
import { ReportProps } from '../../types/Report';
import ReportStatusPill from '../reports/ReportStatusPill';

interface ReportPreviewProps {
  report: ReportProps;
  onClick: (report: ReportProps) => void;
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ report, onClick }) => {
  const placeholderPath = "/images/placeholder.png";
  const imageSrc = report.image?.variantUrl || placeholderPath;

  return (
    <div onClick={() => onClick(report)} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <img
            src={imageSrc}
            alt={report.title}
            className={`w-full h-full object-cover ${report.status === 'archived' ? 'grayscale' : ''}`}
            onError={(e) => {
              if (e.currentTarget.src !== placeholderPath) {
                e.currentTarget.src = placeholderPath;
              }
            }}
          />
          <div className="absolute bottom-2 right-2">
            <ReportStatusPill status={report.status} />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{report.title}</h3>
        </div>
      </div>
    </div>
  );
};

export default ReportPreview;
