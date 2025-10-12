import React, { useState } from 'react';
import Spinner from './Spinner.jsx';

const ItemPreview = ({
  item,
  onClick,
  imageUrl,
  title,
  statusPill,
  isArchived = false
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const placeholderPath = "/images/placeholder.png";
  const imageSrc = imageUrl || placeholderPath;

  return (
    <div onClick={() => onClick(item)} className="block group">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
        <div className="relative w-full pb-[100%] bg-gray-100">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Spinner size={40} inline={true} />
            </div>
          )}
          <img
            src={imageSrc}
            alt={title}
            className={`absolute inset-0 w-full h-full object-cover ${isArchived ? 'grayscale' : ''} ${isImageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity`}
            onLoad={() => setIsImageLoading(false)}
            onError={(e) => {
              setIsImageLoading(false);
              if (e.currentTarget.src !== placeholderPath) {
                e.currentTarget.src = placeholderPath;
              }
            }}
          />
          {statusPill && (
            <div className="absolute bottom-2 right-2 z-20">
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
