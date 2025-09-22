import React from 'react';

const ItemPreview = ({
  item,
  onClick,
  imageUrl,
  title,
  statusPill,
  isArchived = false
}) => {
  const placeholderPath = "/images/placeholder.png";
  const imageSrc = imageUrl || placeholderPath;

  return (
    <div onClick={() => onClick(item)} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="aspect-square relative">
          <img
            src={imageSrc}
            alt={title}
            className={`w-full h-full object-cover ${isArchived ? 'grayscale' : ''}`}
            onError={(e) => {
              if (e.currentTarget.src !== placeholderPath) {
                e.currentTarget.src = placeholderPath;
              }
            }}
          />
          {statusPill && (
            <div className="absolute bottom-2 right-2">
              {statusPill}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default ItemPreview;
