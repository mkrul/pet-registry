import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserPetsData } from '../../hooks/useUserPetsData';
import { PetProps } from '../../types/Pet';
import { NotificationState, NotificationType } from '../../types/common/Notification';
import PetPreview from '../pets/PetPreview';
import PetDetailView from '../pets/PetDetailView';
import PetEditView from '../pets/PetEditView';
import Notification from '../common/Notification';
import ConfirmationModal from '../common/ConfirmationModal';
import NewPetForm from '../pets/forms/NewPetForm';
import { useGetNewPetQuery, useDeletePetMutation, useArchivePetMutation } from '../../redux/features/pets/petsApi';
import { useDeleteReportMutation } from '../../redux/features/reports/reportsApi';
import Spinner from '../common/Spinner';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setNotification } from '../../redux/features/notifications/notificationsSlice';

interface DashboardPetsProps {
  shouldCreatePet?: boolean;
}

type PetFilter = 'all' | 'dog' | 'cat' | 'archived';

const DashboardPets: React.FC<DashboardPetsProps> = ({ shouldCreatePet = false }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const notification = useAppSelector(state => state.notifications.notification);
  const [page, setPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<PetProps | null>(null);
  const [editingPet, setEditingPet] = useState<PetProps | null>(null);
  const [petToArchive, setPetToArchive] = useState<PetProps | null>(null);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PetFilter>('all');
  const { pets, isLoading, notification: apiNotification } = useUserPetsData(page, activeFilter);
  const { isLoading: isLoadingNewPet } = useGetNewPetQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
  const [archivePet, { isLoading: isArchiving }] = useArchivePetMutation();
  const [deleteReport, { isLoading: isDeletingReport }] = useDeleteReportMutation();

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
      dispatch(setNotification({
        type: NotificationType.SUCCESS,
        message: 'Pet archived successfully'
      }));
    } catch (error: any) {
      dispatch(setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || 'Failed to archive pet'
      }));
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
      dispatch(setNotification({
        type: NotificationType.SUCCESS,
        message: 'Report deleted successfully. Pet status updated to home.'
      }));
    } catch (error: any) {
      dispatch(setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || 'Failed to delete report'
      }));
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
    dispatch(setNotification({
      type: NotificationType.SUCCESS,
      message: 'Pet updated successfully'
    }));
  };

  useEffect(() => {
    if (apiNotification) {
      dispatch(setNotification(apiNotification));
    }
  }, [apiNotification, dispatch]);

  useEffect(() => {
    if (shouldCreatePet) {
      setIsCreatingPet(true);
    }
  }, [shouldCreatePet]);

  const handleNotificationClose = () => {
    dispatch(setNotification(null));
  };

  if (isLoading || isLoadingNewPet) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
          <button
            onClick={handleCreatePet}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Register New Pet
          </button>
        </div>
        <div className="flex justify-center items-center py-12">
          <Spinner />
        </div>
      </div>
    );
  }

  if (isCreatingPet) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Register New Pet</h2>
          <button
            onClick={handleBackToPets}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Back to Pets
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
          <NewPetForm />
        </div>
      </div>
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
        <button
          onClick={handleCreatePet}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Register New Pet
        </button>
      </div>

      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => handleFilterChange('all')}
          disabled={!!selectedPet}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPet
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : activeFilter === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Pets
        </button>
        <button
          onClick={() => handleFilterChange('dog')}
          disabled={!!selectedPet}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPet
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : activeFilter === 'dog'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Dogs
        </button>
        <button
          onClick={() => handleFilterChange('cat')}
          disabled={!!selectedPet}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPet
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : activeFilter === 'cat'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cats
        </button>
        <button
          onClick={() => handleFilterChange('archived')}
          disabled={!!selectedPet}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPet
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : activeFilter === 'archived'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Archived
        </button>
      </div>

      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={handleNotificationClose}
        />
      )}

      {selectedPet ? (
        <PetDetailView
          pet={selectedPet}
          onBack={() => setSelectedPet(null)}
          onEdit={handleEditPet}
          onDelete={handleArchivePet}
          onCreateReport={handleCreateReport}
          onDeleteReport={handleDeleteReport}
        />
      ) : pets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {pets.map(pet => (
            <PetPreview
              key={pet.id}
              pet={pet}
              onClick={setSelectedPet}
              onEdit={handleEditPet}
              onDelete={handleArchivePet}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {activeFilter === 'archived' ? 'No archived pets' : 'No pets registered'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeFilter === 'archived'
              ? 'You haven\'t archived any pets yet.'
              : 'Register your first pet to get started.'
            }
          </p>
          {activeFilter !== 'archived' && (
            <div className="mt-6">
              <button
                onClick={handleCreatePet}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Register Pet
              </button>
            </div>
          )}
        </div>
      )}

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