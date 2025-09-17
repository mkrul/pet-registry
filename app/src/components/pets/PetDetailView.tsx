import React from 'react';
import { PetProps } from '../../types/Pet';

interface PetDetailViewProps {
  pet: PetProps;
  onBack: () => void;
  onEdit?: (pet: PetProps) => void;
  onDelete?: (pet: PetProps) => void;
  onCreateReport?: (pet: PetProps) => void;
  onDeleteReport?: (pet: PetProps) => void;
}

const PetDetailView: React.FC<PetDetailViewProps> = ({ pet, onBack, onEdit, onDelete, onCreateReport, onDeleteReport }) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(pet);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(pet);
  };

  const handleCreateReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCreateReport?.(pet);
  };

  const handleDeleteReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteReport?.(pet);
  };

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
          Back to Pets
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden relative">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={pet.image?.variantUrl || "/images/placeholder.png"}
              alt={pet.name}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">{pet.name}</h3>
              <div className="flex space-x-2">
                {onEdit && (
                  <button
                    onClick={handleEditClick}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Edit pet"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Archive pet"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Species</h4>
                  <p className="text-gray-900 capitalize">{pet.species}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                  <p className="text-gray-900 capitalize">{pet.gender || 'Unknown'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Breeds</h4>
                  <p className="text-gray-900">{pet.breed1}</p>
                  {pet.breed2 && (
                    <p className="text-gray-900">{pet.breed2}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Spayed/Neutered</h4>
                  <p className="text-gray-900">
                    {pet.isAltered === true ? 'Yes' : pet.isAltered === false ? 'No' : 'Unknown'}
                  </p>
                </div>
                {pet.microchipId && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Microchip ID</h4>
                    <p className="text-gray-900">{pet.microchipId}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Registered</h4>
                <p className="text-gray-900">
                  {new Date(pet.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {pet.status === 'home' && onCreateReport && (
                <button
                  onClick={handleCreateReportClick}
                  className="px-3 py-1 bg-white border-2 border-red-500 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors self-end"
                >
                  {pet.name} is missing! Create a lost pet report
                </button>
              )}
              {pet.status === 'missing' && (
                <button
                  onClick={handleDeleteReportClick}
                  className="px-3 py-1 bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 rounded-lg text-sm font-medium transition-colors self-end"
                >
                  {pet.name} was found! Delete the open report
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailView;
