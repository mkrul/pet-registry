import React from 'react';
import ItemPreview from '../../../shared/components/common/ItemPreview.jsx';
import StatusPill from '../../../shared/components/common/StatusPill.jsx';

const PetPreview = ({ pet, onClick }) => {
  const getStatusPill = () => {
    if (pet.status === 'archived') {
      return <StatusPill status="Archived" variant="default" />;
    }
    if (pet.status === 'missing') {
      return <StatusPill status="Missing" variant="error" />;
    }
    return <StatusPill status="Home" variant="success" />;
  };

  return (
    <ItemPreview
      item={pet}
      onClick={onClick}
      imageUrl={pet.image?.variantUrl}
      title={pet.name}
      statusPill={getStatusPill()}
      isArchived={pet.status === 'archived'}
    />
  );
};

export default PetPreview;
