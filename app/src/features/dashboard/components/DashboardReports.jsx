import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useUserReportsData } from '../../../shared/hooks/useUserReportsData.js';
import ReportPreview from './ReportPreview';
import ReportDetailView from './ReportDetailView';
import ReportEditView from './ReportEditView';
import Notification from '../../../shared/components/common/Notification.jsx';
import ConfirmationModal from '../../../shared/components/common/ConfirmationModal.jsx';
import NewReportForm from '../../reports/components/forms/NewReportForm';
import { useGetNewReportQuery, useArchiveReportMutation } from '../../../store/features/reports/reportsApi.js';
import { useGetPetQuery } from '../../../store/features/pets/petsApi.js';
import Spinner from '../../../shared/components/common/Spinner.jsx';
import { useAppDispatch } from '../../../store/hooks.js';
import { useClearNotificationsOnUnmount } from '../../../shared/hooks/useAutoClearNotifications.js';
import DashboardHeader from '../../../shared/components/common/DashboardHeader.jsx';
import FilterButtons from '../../../shared/components/common/FilterButtons.jsx';
import EmptyState from '../../../shared/components/common/EmptyState.jsx';
import LoadingState from '../../../shared/components/common/LoadingState.jsx';
import ItemGrid from '../../../shared/components/common/ItemGrid.jsx';
import FormLayout from '../../../shared/components/common/FormLayout.jsx';

const mapPetToReportForm = (pet) => ({
  name: pet.name,
  species: pet.species,
  breed1: pet.breed1,
  breed2: pet.breed2,
  color1: pet.color1,
  color2: pet.color2,
  color3: pet.color3,
  gender: pet.gender || '',
  isAltered: pet.isAltered,
  microchipId: pet.microchipId || '',
  image: {
    id: pet.image?.id || '',
    url: pet.image?.url || '',
    thumbnailUrl: pet.image?.thumbnailUrl || '',
    variantUrl: pet.image?.variantUrl || '',
    filename: pet.image?.filename || '',
    publicId: pet.image?.publicId || ''
  }
});

const DashboardReports = ({ shouldCreateReport = false }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const [reportToArchive, setReportToArchive] = useState(null);
  const [isCreatingReport, setIsCreatingReport] = useState(false);
  const [activeFilter, setActiveFilter] = useState('active');
  const [notification, setNotification] = useState(null);
  const { reports, isLoading, isPreloading, notification: apiNotification, refetch } = useUserReportsData(page, activeFilter, true);
  const { isLoading: isLoadingNewReport } = useGetNewReportQuery();
  const [archiveReport, { isLoading: isArchiving }] = useArchiveReportMutation();

  useClearNotificationsOnUnmount(setNotification);

  const petId = searchParams.get('petId');
  const reportId = searchParams.get('reportId');
  const action = searchParams.get('action');
  const { data: petData, isLoading: isLoadingPet } = useGetPetQuery(
    petId ? parseInt(petId) : 0,
    { skip: !petId }
  );


  const handleEditReport = (report) => {
    setEditingReport(report);
  };

  const handleDeleteReport = (report) => {
    setReportToArchive(report);
  };

  const handleConfirmArchive = async () => {
    if (!reportToArchive) return;

    try {
      await archiveReport(reportToArchive.id).unwrap();
      setReportToArchive(null);
      setNotification({
        type: "SUCCESS",
        message: 'Report archived successfully'
      });
    } catch (error) {
      setNotification({
        type: "ERROR",
        message: error.data?.message || 'Failed to archive report'
      });
    }
  };

  const handleCancelArchive = () => {
    setReportToArchive(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleCreateReport = () => {
    navigate('/dashboard?section=reports&action=create');
  };

  const handleBackToReports = () => {
    navigate('/dashboard?section=reports');
    setIsCreatingReport(false);
    setSelectedReport(null);
    setEditingReport(null);
    setReportToArchive(null);
  };

  const handleEditSaveSuccess = () => {
    setEditingReport(null);
    setNotification({
      type: "SUCCESS",
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

  useEffect(() => {
    if (action === 'create') {
      setIsCreatingReport(true);
    } else if (action !== 'create' && isCreatingReport) {
      setIsCreatingReport(false);
    }
  }, [action, isCreatingReport]);

  useEffect(() => {
    if (reportId) {
      if (reports.length > 0) {
        const report = reports.find(r => r.id === parseInt(reportId));
        if (report) {
          setSelectedReport(report);
        }
      } else if (!isLoading) {
        setSelectedReport(null);
      }
    }
  }, [reportId, reports, isLoading]);

  useEffect(() => {
    if (action === 'create' && !isCreatingReport) {
      refetch();
    }
  }, [action, isCreatingReport, refetch]);

  const handleNotificationClose = () => {
    setNotification(null);
  };



  if (isCreatingReport) {
    return (
      <FormLayout
        title="Create New Report"
        backButton={{
          label: "Back to Reports",
          onClick: handleBackToReports,
          className: "bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
        notification={notification}
        onNotificationClose={handleNotificationClose}
      >
        <NewReportForm
          initialData={petData ? mapPetToReportForm(petData) : undefined}
          petId={petId ? parseInt(petId) : undefined}
        />
      </FormLayout>
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

  const reportFilters = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' }
  ];

  return (
    <div>
      <DashboardHeader
        title="My Reports"
        actionButton={{
          label: "Create New Report",
          onClick: handleCreateReport,
          className: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
      />

      <FilterButtons
        filters={reportFilters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        disabled={!!selectedReport}
        activeColor="bg-blue-600"
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={handleNotificationClose}
        />
      )}

      {!isLoading && selectedReport ? (
        <ReportDetailView
          report={selectedReport}
          onBack={() => setSelectedReport(null)}
          onEdit={handleEditReport}
          onDelete={handleDeleteReport}
        />
      ) : !isLoading && reports.length > 0 ? (
        <ItemGrid>
          {reports.map(report => (
            <ReportPreview
              key={report.id}
              report={report}
              onClick={setSelectedReport}
            />
          ))}
        </ItemGrid>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <EmptyState
          icon={
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title={activeFilter === 'archived' ? 'No archived reports' : 'No active reports'}
          description={
            activeFilter === 'archived'
              ? 'You haven\'t archived any reports yet.'
              : 'Report a lost pet by clicking the button below.'
          }
          actionButton={
            activeFilter === 'active'
              ? {
                  label: 'Create Report',
                  onClick: handleCreateReport,
                  className: 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
                }
              : undefined
          }
        />
      )}

      <ConfirmationModal
        isOpen={!!reportToArchive}
        onClose={handleCancelArchive}
        onConfirm={handleConfirmArchive}
        title="Archive Report"
        message={`Are you sure you want to archive "${reportToArchive?.title}"? This report will no longer be visible to others in search results.`}
        confirmText="Archive"
        cancelText="Cancel"
        isLoading={isArchiving}
      />
    </div>
  );
};

export default DashboardReports;
