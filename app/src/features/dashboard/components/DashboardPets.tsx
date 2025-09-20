import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPetsData } from '../../../shared/hooks/useUserPetsData';
import { PetProps } from '../../pets/types/Pet';
import { NotificationState, NotificationType } from '../../../shared/types/common/Notification';
import PetPreview from '../../pets/components/PetPreview';
import PetDetailView from '../../pets/components/PetDetailView';
import PetEditView from '../../pets/components/PetEditView';
import Notification from '../../../shared/components/common/Notification';
import ConfirmationModal from '../../../shared/components/common/ConfirmationModal';
import NewPetForm from '../../pets/components/forms/NewPetForm';
import { useGetNewPetQuery, useDeletePetMutation, useArchivePetMutation } from '../../../store/features/pets/petsApi';
import { useDeleteReportMutation } from '../../../store/features/reports/reportsApi';
import Spinner from '../../../shared/components/common/Spinner';
import { useAppDispatch } from '../../../store/hooks';
import { useClearNotificationsOnUnmount } from '../../../shared/hooks/useAutoClearNotifications';
import DashboardHeader from '../../../shared/components/common/DashboardHeader';
import FilterButtons from '../../../shared/components/common/FilterButtons';
import EmptyState from '../../../shared/components/common/EmptyState';
import LoadingState from '../../../shared/components/common/LoadingState';
import ItemGrid from '../../../shared/components/common/ItemGrid';
import FormLayout from '../../../shared/components/common/FormLayout';

interface DashboardPetsProps {
  shouldCreatePet?: boolean;
}

type PetFilter = 'all' | 'dog' | 'cat' | 'archived';

const DashboardPets: React.FC<DashboardPetsProps> = ({ shouldCreatePet = false }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<PetProps | null>(null);
  const [editingPet, setEditingPet] = useState<PetProps | null>(null);
  const [petToArchive, setPetToArchive] = useState<PetProps | null>(null);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PetFilter>('all');
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const { pets, isLoading, isPreloading, notification: apiNotification, refetch } = useUserPetsData(page, activeFilter, true);
  const { isLoading: isLoadingNewPet } = useGetNewPetQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
  const [archivePet, { isLoading: isArchiving }] = useArchivePetMutation();
  const [deleteReport, { isLoading: isDeletingReport }] = useDeleteReportMutation();

  useClearNotificationsOnUnmount(setNotification);

  const handleEditPet = (pet: PetProps) => {
    setEditingPet(pet);
  };

  const handleArchivePet = (pet: PetProps) => {
    setPetToArchive(pet);
  };

  const handleConfirmArchive = async () => {
    if (!petToArchive) return;

    try {
      await archivePet(petToArchive.id).unwrap();
      setPetToArchive(null);
      setNotification({
        type: NotificationType.SUCCESS,
        message: 'Pet archived successfully'
      });
    } catch (error: any) {
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || 'Failed to archive pet'
      });
    }
  };

  const handleCancelArchive = () => {
    setPetToArchive(null);
  };

  const handleFilterChange = (filter: PetFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleCreatePet = () => {
    setIsCreatingPet(true);
  };

  const handleCreateReport = (pet: PetProps) => {
    navigate(`/dashboard?section=reports&action=create&petId=${pet.id}`);
  };

  const handleDeleteReport = async (pet: PetProps) => {
    if (!pet.reportId) return;

    try {
      await deleteReport(pet.reportId).unwrap();
      await refetch();
      setNotification({
        type: NotificationType.SUCCESS,
        message: 'Report deleted successfully. Pet status updated to home.'
      });
    } catch (error: any) {
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || 'Failed to delete report'
      });
    }
  };

  const handleBackToPets = () => {
    setIsCreatingPet(false);
    setSelectedPet(null);
    setEditingPet(null);
    setPetToArchive(null);
  };

  const handleEditSaveSuccess = () => {
    setEditingPet(null);
    setNotification({
      type: NotificationType.SUCCESS,
      message: 'Pet updated successfully'
    });
  };

  useEffect(() => {
    if (apiNotification) {
      setNotification(apiNotification);
    }
  }, [apiNotification]);


  useEffect(() => {
    if (shouldCreatePet) {
      setIsCreatingPet(true);
    }
  }, [shouldCreatePet]);

  useEffect(() => {
    if (selectedPet && pets.length > 0) {
      const updatedPet = pets.find(p => p.id === selectedPet.id);
      if (updatedPet) {
        setSelectedPet(updatedPet);
      }
    }
  }, [pets, selectedPet]);

  const handleNotificationClose = () => {
    setNotification(null);
  };

  if (isLoadingNewPet) {
    return (
      <div>
        <DashboardHeader
          title="My Pets"
          actionButton={{
            label: "Register New Pet",
            onClick: handleCreatePet,
            className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          }}
        />
        <LoadingState className="flex justify-center items-center py-12" />
      </div>
    );
  }

  if (isCreatingPet) {
    return (
      <FormLayout
        title="Register New Pet"
        backButton={{
          label: "Back to Pets",
          onClick: handleBackToPets,
          className: "bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
        notification={notification}
        onNotificationClose={handleNotificationClose}
      >
        <NewPetForm />
      </FormLayout>
    );
  }

  if (editingPet) {
    return (
      <PetEditView
        pet={editingPet}
        onBack={handleBackToPets}
        onSaveSuccess={handleEditSaveSuccess}
        notification={notification}
        onNotificationClose={handleNotificationClose}
      />
    );
  }

  const petFilters = [
    { value: 'all', label: 'All Pets' },
    { value: 'dog', label: 'Dogs' },
    { value: 'cat', label: 'Cats' },
    { value: 'archived', label: 'Archived' }
  ];

  return (
    <div>
      <DashboardHeader
        title="My Pets"
        actionButton={{
          label: "Register New Pet",
          onClick: handleCreatePet,
          className: "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
      />

      <FilterButtons<PetFilter>
        filters={petFilters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        disabled={!!selectedPet}
        activeColor="bg-green-600"
      />

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={handleNotificationClose}
        />
      )}

      {(isLoading || isPreloading) && (
        <LoadingState className="flex justify-center items-center py-12" />
      )}

      {!isLoading && !isPreloading && selectedPet ? (
        <PetDetailView
          pet={selectedPet}
          onBack={() => setSelectedPet(null)}
          onEdit={handleEditPet}
          onDelete={handleArchivePet}
          onCreateReport={handleCreateReport}
          onDeleteReport={handleDeleteReport}
        />
      ) : !isLoading && !isPreloading && pets.length > 0 ? (
        <ItemGrid>
          {pets.map(pet => (
            <PetPreview
              key={pet.id}
              pet={pet}
              onClick={setSelectedPet}
            />
          ))}
        </ItemGrid>
      ) : !isLoading && !isPreloading ? (
        <EmptyState
          icon={
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          title={activeFilter === 'archived' ? 'No archived pets' : 'No pets registered'}
          description={
            activeFilter === 'archived'
              ? 'You haven\'t archived any pets yet.'
              : 'Register your first pet to get started.'
          }
          actionButton={
            activeFilter !== 'archived'
              ? {
                  label: 'Register Pet',
                  onClick: handleCreatePet,
                  className: 'bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors'
                }
              : undefined
          }
        />
      ) : null}

      <ConfirmationModal
        isOpen={!!petToArchive}
        onClose={handleCancelArchive}
        onConfirm={handleConfirmArchive}
        title="Archive Pet"
        message={`Are you sure you want to archive "${petToArchive?.name}"? This pet will be hidden from your pets list.`}
        confirmText="Archive"
        cancelText="Cancel"
        isLoading={isArchiving}
      />
    </div>
  );
};

export default DashboardPets;