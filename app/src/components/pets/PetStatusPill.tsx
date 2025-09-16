import React from 'react';

interface PetStatusPillProps {
  status: 'home' | 'missing';
}

const PetStatusPill: React.FC<PetStatusPillProps> = ({ status }) => {
  if (status === 'missing') {
    return (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
        Missing
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
      Home
    </span>
  );
};

export default PetStatusPill;
