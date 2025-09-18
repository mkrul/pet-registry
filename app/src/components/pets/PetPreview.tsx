import React from 'react';
import { PetProps } from '../../types/Pet';
import PetStatusPill from './PetStatusPill';

interface PetPreviewProps {
  pet: PetProps;
  onClick: (pet: PetProps) => void;
}

const PetPreview: React.FC<PetPreviewProps> = ({ pet, onClick }) => {
  const placeholderPath = "/images/placeholder.png";
  const imageSrc = pet.image?.variantUrl || placeholderPath;

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
          <div className="absolute bottom-2 right-2">
            <PetStatusPill status={pet.status} />
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{pet.name}</h3>
        </div>
      </div>
    </div>
  );
};

export default PetPreview;
