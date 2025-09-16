import React from 'react';
import { ReportProps } from '../../types/Report';

interface ReportDetailViewProps {
  report: ReportProps;
  onBack: () => void;
}

const ReportDetailView: React.FC<ReportDetailViewProps> = ({ report, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reports
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={report.image?.variantUrl || "/images/placeholder.png"}
              alt={report.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{report.title}</h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                report.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {report.status}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-900">{report.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Species</h4>
                  <p className="text-gray-900 capitalize">{report.species}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Breed</h4>
                  <p className="text-gray-900">{report.breed1}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                  <p className="text-gray-900 capitalize">{report.gender || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                  <p className="text-gray-900">{report.name || 'Unknown'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                <p className="text-gray-900">
                  {[report.area, report.state, report.country]
                    .filter(Boolean)
                    .join(', ') || 'Location not specified'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                <p className="text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailView;
