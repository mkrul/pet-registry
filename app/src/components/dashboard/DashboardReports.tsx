import React, { useState, useEffect } from 'react';
import { useUserReportsData } from '../../hooks/useUserReportsData';
import { ReportProps } from '../../types/Report';
import { NotificationState, NotificationType } from '../../types/common/Notification';
import ReportPreview from './ReportPreview';
import ReportDetailView from './ReportDetailView';
import ReportEditView from './ReportEditView';
import Notification from '../common/Notification';
import ConfirmationModal from '../common/ConfirmationModal';
import NewReportForm from '../reports/forms/NewReportForm';
import { useGetNewReportQuery, useArchiveReportMutation } from '../../redux/features/reports/reportsApi';
import Spinner from '../common/Spinner';

interface DashboardReportsProps {
  shouldCreateReport?: boolean;
}

const DashboardReports: React.FC<DashboardReportsProps> = ({ shouldCreateReport = false }) => {
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<ReportProps | null>(null);
  const [editingReport, setEditingReport] = useState<ReportProps | null>(null);
  const [reportToArchive, setReportToArchive] = useState<ReportProps | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const { reports, isLoading, notification: apiNotification } = useUserReportsData(page);
  const { isLoading: isLoadingNewReport } = useGetNewReportQuery();
  const [archiveReport, { isLoading: isArchiving }] = useArchiveReportMutation();

  const handleEditReport = (report: ReportProps) => {
    setEditingReport(report);
  };

  const handleDeleteReport = (report: ReportProps) => {
    setReportToArchive(report);
  };

  const handleConfirmArchive = async () => {
    if (!reportToArchive) return;

    try {
      await archiveReport(reportToArchive.id).unwrap();
      setReportToArchive(null);
      setNotification({
        type: NotificationType.SUCCESS,
        message: 'Report archived successfully'
      });
    } catch (error: any) {
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || 'Failed to archive report'
      });
    }
  };

  const handleCancelArchive = () => {
    setReportToArchive(null);
  };

  const handleCreateReport = () => {
    setIsCreatingReport(true);
  };

  const handleBackToReports = () => {
    setIsCreatingReport(false);
    setSelectedReport(null);
    setEditingReport(null);
    setReportToArchive(null);
  };

  const handleEditSaveSuccess = () => {
    setEditingReport(null);
    setNotification({
      type: NotificationType.SUCCESS,
      message: 'Report updated successfully'
    });
  };

  useEffect(() => {
    if (apiNotification) {
      setNotification(apiNotification);
    }
  }, [apiNotification]);

  useEffect(() => {
    if (shouldCreateReport) {
      setIsCreatingReport(true);
    }
  }, [shouldCreateReport]);

  const handleNotificationClose = () => {
    setNotification(null);
  };


  if (isLoading || isLoadingNewReport) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
          <button
            onClick={handleCreateReport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Create New Report
          </button>
        </div>
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isCreatingReport) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Report</h2>
          <button
            onClick={handleBackToReports}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Reports
          </button>
        </div>

        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={handleNotificationClose}
          />
        )}

        <div className="w-full mx-auto px-2">
          <NewReportForm />
        </div>
      </div>
    );
  }

  if (editingReport) {
    return (
      <ReportEditView
        report={editingReport}
        onBack={handleBackToReports}
        onSaveSuccess={handleEditSaveSuccess}
        notification={notification}
        onNotificationClose={handleNotificationClose}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
        <button
          onClick={handleCreateReport}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
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
        <ReportDetailView
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
        />
      ) : reports.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {reports.map(report => (
            <ReportPreview
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
            <button
              onClick={handleCreateReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Create Report
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!reportToArchive}
        onClose={handleCancelArchive}
        onConfirm={handleConfirmArchive}
        title="Archive Report"
        message={`Are you sure you want to archive "${reportToArchive?.title}"? This action can be undone.`}
        confirmText="Archive"
        cancelText="Cancel"
        isLoading={isArchiving}
      />
    </div>
  );
};

export default DashboardReports;
