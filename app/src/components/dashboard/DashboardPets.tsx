import React, { useState, useEffect } from 'react';
import { useUserPetsData } from '../../hooks/useUserPetsData';
import { PetProps } from '../../types/Pet';
import { NotificationState, NotificationType } from '../../types/common/Notification';
import PetPreview from '../pets/PetPreview';
import PetDetailView from '../pets/PetDetailView';
import PetEditView from '../pets/PetEditView';
import Notification from '../common/Notification';
import ConfirmationModal from '../common/ConfirmationModal';
import NewPetForm from '../pets/forms/NewPetForm';
import { useGetNewPetQuery, useDeletePetMutation } from '../../redux/features/pets/petsApi';
import Spinner from '../common/Spinner';

interface DashboardPetsProps {
  shouldCreatePet?: boolean;
}

type PetFilter = 'all' | 'dog' | 'cat';

const DashboardPets: React.FC<DashboardPetsProps> = ({ shouldCreatePet = false }) => {
  const [page, setPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState<PetProps | null>(null);
  const [editingPet, setEditingPet] = useState<PetProps | null>(null);
  const [petToDelete, setPetToDelete] = useState<PetProps | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [activeFilter, setActiveFilter] = useState<PetFilter>('all');
  const { pets, isLoading, notification: apiNotification } = useUserPetsData(page, activeFilter);
  const { isLoading: isLoadingNewPet } = useGetNewPetQuery();
  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();

  const handleEditPet = (pet: PetProps) => {
    setEditingPet(pet);
  };

  const handleDeletePet = (pet: PetProps) => {
    setPetToDelete(pet);
  };

  const handleConfirmDelete = async () => {
    if (!petToDelete) return;

    try {
      await deletePet(petToDelete.id).unwrap();
      setPetToDelete(null);
      setNotification({
        type: NotificationType.SUCCESS,
        message: 'Pet deleted successfully'
      });
    } catch (error: any) {
      setNotification({
        type: NotificationType.ERROR,
        message: error.data?.message || 'Failed to delete pet'
      });
    }
  };

  const handleCancelDelete = () => {
    setPetToDelete(null);
  };

  const handleFilterChange = (filter: PetFilter) => {
    setActiveFilter(filter);
    setPage(1);
  };

  const handleCreatePet = () => {
    setIsCreatingPet(true);
  };

  const handleBackToPets = () => {
    setIsCreatingPet(false);
    setSelectedPet(null);
    setEditingPet(null);
    setPetToDelete(null);
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

  const handleNotificationClose = () => {
    setNotification(null);
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
          onDelete={handleDeletePet}
        />
      ) : pets.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {pets.map(pet => (
            <PetPreview
              key={pet.id}
              pet={pet}
              onClick={setSelectedPet}
              onEdit={handleEditPet}
              onDelete={handleDeletePet}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No pets registered</h3>
          <p className="mt-1 text-sm text-gray-500">Register your first pet to get started.</p>
          <div className="mt-6">
            <button
              onClick={handleCreatePet}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Register Pet
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!petToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Pet"
        message={`Are you sure you want to delete "${petToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPets;