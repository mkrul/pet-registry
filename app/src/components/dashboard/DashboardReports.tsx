import React, { useState, useEffect } from 'react';
import { useUserReportsData } from '../../hooks/useUserReportsData';
import { ReportProps } from '../../types/Report';
import { NotificationState, NotificationType } from '../../types/common/Notification';
import MinifiedReportCard from './MinifiedReportCard';
import Notification from '../common/Notification';

const DashboardReports: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportProps | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const { reports, isLoading, notification: apiNotification } = useUserReportsData(page);

  const handleEditReport = (report: ReportProps) => {
    console.log('Edit report:', report.id);
  };

  const handleDeleteReport = (report: ReportProps) => {
    console.log('Delete report:', report.id);
  };

  useEffect(() => {
    if (apiNotification) {
      setNotification(apiNotification);
    }
  }, [apiNotification]);

  const handleNotificationClose = () => {
    setNotification(null);
  };


  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Create New Report
          </button>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          Create New Report
        </button>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={handleNotificationClose}
        />
      )}

      {selectedReport ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedReport(null)}
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
                  src={selectedReport.image?.variantUrl || "/images/placeholder.png"}
                  alt={selectedReport.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedReport.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedReport.status}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-900">{selectedReport.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Species</h4>
                      <p className="text-gray-900 capitalize">{selectedReport.species}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Breed</h4>
                      <p className="text-gray-900">{selectedReport.breed1}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                      <p className="text-gray-900 capitalize">{selectedReport.gender || 'Unknown'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                      <p className="text-gray-900">{selectedReport.name || 'Unknown'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
                    <p className="text-gray-900">
                      {[selectedReport.area, selectedReport.state, selectedReport.country]
                        .filter(Boolean)
                        .join(', ') || 'Location not specified'}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Created</h4>
                    <p className="text-gray-900">
                      {new Date(selectedReport.createdAt).toLocaleDateString('en-US', {
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
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {reports.map(report => (
            <MinifiedReportCard
              key={report.id}
              report={report}
              onClick={setSelectedReport}
              onEdit={handleEditReport}
              onDelete={handleDeleteReport}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first pet report.</p>
          <div className="mt-6">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Create Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardReports;
