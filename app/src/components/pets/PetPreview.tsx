import React from 'react';
import { PetProps } from '../../types/Pet';
import PetStatusPill from './PetStatusPill';

interface PetPreviewProps {
  pet: PetProps;
  onClick: (pet: PetProps) => void;
  onEdit?: (pet: PetProps) => void;
  onDelete?: (pet: PetProps) => void;
}

const PetPreview: React.FC<PetPreviewProps> = ({ pet, onClick, onEdit, onDelete }) => {
  const placeholderPath = "/images/placeholder.png";
  const imageSrc = pet.image?.variantUrl || placeholderPath;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(pet);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(pet);
  };

  return (
    <div onClick={() => onClick(pet)} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <img
            src={imageSrc}
            alt={pet.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== placeholderPath) {
                e.currentTarget.src = placeholderPath;
              }
            }}
          />
          <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {onEdit && (
              <button
                onClick={handleEditClick}
                className="p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                aria-label="Edit pet"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-1 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                aria-label="Archive pet"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{pet.name}</h3>
          <div className="mt-1">
            <PetStatusPill status={pet.status} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetPreview;
