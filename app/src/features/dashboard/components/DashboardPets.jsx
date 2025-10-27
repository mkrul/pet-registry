import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserPetsData } from '../../../shared/hooks/useUserPetsData.js';
import PetPreview from '../../pets/components/PetPreview';
import PetDetailView from '../../pets/components/PetDetailView';
import PetEditForm from '../../pets/components/forms/PetEditForm.jsx';
import ConfirmationModal from '../../../shared/components/common/ConfirmationModal.jsx';
import PetNewForm from '../../pets/components/forms/PetNewForm.jsx';
import { useDeletePetMutation, useArchivePetMutation, useGetUserPetsQuery } from '../../../store/features/pets/petsApi.js';
import { useDeleteReportMutation } from '../../../store/features/reports/reportsApi.js';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.js';
import { addNotification } from '../../../store/features/notifications/notificationsSlice.js';
import DashboardHeader from '../../../shared/components/common/DashboardHeader.jsx';
import FilterButtons from '../../../shared/components/common/FilterButtons.jsx';
import EmptyState from '../../../shared/components/common/EmptyState.jsx';
import LoadingState from '../../../shared/components/common/LoadingState.jsx';
import ItemGrid from '../../../shared/components/common/ItemGrid.jsx';
import FormLayout from '../../../shared/components/common/FormLayout.jsx';

const DashboardPets = ({ shouldCreatePet = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [page, setPage] = useState(1);
  const [selectedPet, setSelectedPet] = useState(null);
  const [editingPet, setEditingPet] = useState(null);
  const [petToArchive, setPetToArchive] = useState(null);
  const [showSuccessPulse, setShowSuccessPulse] = useState(false);
  const action = searchParams.get('action');
  const filterParam = searchParams.get('filter');
  const petIdParam = searchParams.get('petId');
  const [isCreatingPet, setIsCreatingPet] = useState(action === 'create');
  const getInitialFilter = () => {
    const validFilters = ['all', 'dog', 'cat', 'archived'];
    return validFilters.includes(filterParam) ? filterParam : 'all';
  };
  const [activeFilter, setActiveFilter] = useState(getInitialFilter);
  const { pets, isLoading, isPreloading } = useUserPetsData(page, activeFilter, true);

  // Get refetch function for manual data refresh
  const speciesFilter = activeFilter === 'all' || activeFilter === 'archived' ? undefined : activeFilter;
  const archivedFilter = activeFilter === 'archived';
  const { refetch: refetchPets } = useGetUserPetsQuery({
    page,
    items: 21,
    species: speciesFilter,
    archived: archivedFilter
  });

  const [deletePet, { isLoading: isDeleting }] = useDeletePetMutation();
  const [archivePet, { isLoading: isArchiving }] = useArchivePetMutation();
  const [deleteReport, { isLoading: isDeletingReport }] = useDeleteReportMutation();

  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
    const params = new URLSearchParams();
    params.set('petId', pet.id);
    if (activeFilter !== 'all') {
      params.set('filter', activeFilter);
    }
    navigate(`/dashboard/pets?${params.toString()}`);
  };

  const handleDeselectPet = () => {
    setSelectedPet(null);
    const params = new URLSearchParams();
    if (activeFilter !== 'all') {
      params.set('filter', activeFilter);
    }
    navigate(`/dashboard/pets${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
  };

  const handleArchivePet = (pet) => {
    setPetToArchive(pet);
  };

  const handleConfirmArchive = async () => {
    if (!petToArchive) return;

    try {
      await archivePet(petToArchive.id).unwrap();
      setPetToArchive(null);
      dispatch(addNotification({
        type: "SUCCESS",
        message: 'Pet archived successfully'
      }));
    } catch (error) {
      dispatch(addNotification({
        type: "ERROR",
        message: error.data?.message || 'Failed to archive pet'
      }));
    }
  };

  const handleCancelArchive = () => {
    setPetToArchive(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPage(1);
    const params = new URLSearchParams();
    if (filter !== 'all') {
      params.set('filter', filter);
    }
    navigate(`/dashboard/pets${params.toString() ? '?' + params.toString() : ''}`);
  };

  const handleCreatePet = () => {
    navigate('/dashboard/pets?action=create');
  };

  const handleCreateReport = (pet) => {
    navigate(`/dashboard/reports?action=create&petId=${pet.id}`);
  };

  const handleDeleteReport = async (pet) => {
    if (!pet.reportId) return;

    try {
      await deleteReport(pet.reportId).unwrap();
      dispatch(addNotification({
        type: "SUCCESS",
        message: 'Report deleted successfully. Pet status updated to home.'
      }));
      // Refetch pets to ensure fresh data with updated status
      await refetchPets();
      // Show success pulse animation
      setShowSuccessPulse(true);
      // Hide pulse after 2 seconds
      setTimeout(() => {
        setShowSuccessPulse(false);
      }, 2000);
    } catch (error) {
      dispatch(addNotification({
        type: "ERROR",
        message: error.data?.message || 'Failed to delete report'
      }));
    }
  };

  const handleBackToPets = () => {
    const params = new URLSearchParams();
    if (activeFilter !== 'all') {
      params.set('filter', activeFilter);
    }
    navigate(`/dashboard/pets${params.toString() ? '?' + params.toString() : ''}`);
    setIsCreatingPet(false);
    setSelectedPet(null);
    setEditingPet(null);
    setPetToArchive(null);
  };

  const handleEditSaveSuccess = () => {
    setEditingPet(null);
  };

  useEffect(() => {
    if (shouldCreatePet) {
      setIsCreatingPet(true);
    }
  }, [shouldCreatePet]);

  useEffect(() => {
    if (action === 'create') {
      setIsCreatingPet(true);
    } else if (action !== 'create' && isCreatingPet) {
      setIsCreatingPet(false);
    }
  }, [action, isCreatingPet]);

  useEffect(() => {
    const validFilters = ['all', 'dog', 'cat', 'archived'];
    const newFilter = validFilters.includes(filterParam) ? filterParam : 'all';
    if (newFilter !== activeFilter) {
      setActiveFilter(newFilter);
    }
  }, [filterParam]);

  useEffect(() => {
    if (petIdParam && pets.length > 0) {
      const pet = pets.find((p) => p.id === parseInt(petIdParam));
      if (pet && (!selectedPet || selectedPet.id !== pet.id)) {
        setSelectedPet(pet);
      }
    } else if (!petIdParam && selectedPet) {
      setSelectedPet(null);
    }
  }, [petIdParam, pets, selectedPet]);

  useEffect(() => {
    if (selectedPet && pets.length > 0) {
      const updatedPet = pets.find((p) => p.id === selectedPet.id);
      if (updatedPet) {
        setSelectedPet(updatedPet);
      }
    }
  }, [pets, selectedPet]);

  // Refetch pet data when component mounts to ensure fresh data after report creation
  useEffect(() => {
    refetchPets();
  }, [refetchPets]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (isCreatingPet) {
    return (
      <FormLayout
        title="Register New Pet"
        backButton={{
          label: "Back to Pets",
          onClick: handleBackToPets,
          className: "bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        }}
      >
        <PetNewForm />
      </FormLayout>
    );
  }

  if (editingPet) {
    return (
      <PetEditForm
        pet={editingPet}
        onBack={handleBackToPets}
        onSaveSuccess={handleEditSaveSuccess}
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

      <FilterButtons
        filters={petFilters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        disabled={!!selectedPet}
        activeColor="bg-green-600"
      />

      {(isLoading || isPreloading) && (
        <LoadingState className="flex justify-center items-center py-12" />
      )}

      {!isLoading && !isPreloading && selectedPet ? (
        <PetDetailView
          pet={selectedPet}
          onBack={handleDeselectPet}
          onEdit={handleEditPet}
          onDelete={handleArchivePet}
          onCreateReport={handleCreateReport}
          onDeleteReport={handleDeleteReport}
          showSuccessPulse={showSuccessPulse}
        />
      ) : !isLoading && !isPreloading && pets.length > 0 ? (
        <ItemGrid>
          {pets.map((pet) => (
            <PetPreview
              key={pet.id}
              pet={pet}
              onClick={handleSelectPet}
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
              : 'Register your pet to get started.'
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