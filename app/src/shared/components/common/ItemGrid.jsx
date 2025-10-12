import React from 'react';

const ItemGrid = ({
  children,
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ItemGrid;
