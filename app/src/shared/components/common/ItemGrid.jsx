import React from 'react';

const ItemGrid = ({
  children,
  className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ItemGrid;
