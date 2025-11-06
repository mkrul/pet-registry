import React, { useState, useEffect } from 'react';
import { truncate } from 'lodash';
import Spinner from '../../shared/components/common/Spinner.jsx';
import StatusPill from '../../shared/components/common/StatusPill.jsx';
import useFlyerGeneration from "../../shared/hooks/useFlyerGeneration";
import FlyerGenerationModal from "../../shared/components/common/FlyerGenerationModal";
import LostPetFlyer from "../../shared/components/common/LostPetFlyer";

const ReportDetailView = ({ report, user, onBack, onEdit, onDelete }) => {
  const { isModalOpen, isGenerating, openModal, closeModal, handleGenerateFlyer, flyerRef, rewardAmount, customDescription, phoneNumber } = useFlyerGeneration(report.id);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit?.(report);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete?.(report);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsImageModalOpen(false);
    }
  };

  useEffect(() => {
    if (isImageModalOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          setIsImageModalOpen(false);
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isImageModalOpen]);

  const getStatusPill = () => {
    if (report.status === 'archived') {
      return <StatusPill status="Archived" variant="default" />;
    }
    return <StatusPill status="Active" variant="info" />;
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
          Back to Reports
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative">
            {imageLoading && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                <Spinner size={40} inline={true} bgFaded={false} />
              </div>
            )}
            <div
              className="relative cursor-pointer group"
              onClick={handleImageClick}
            >
              <img
                src={report.image?.variantUrl || "/images/placeholder.png"}
                alt={report.title}
                className={`w-full h-64 md:h-full object-cover ${report.status === 'archived' ? 'grayscale' : ''} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Click to enlarge
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 truncate flex-1 mr-4">{report.title}</h3>
              <div className="flex space-x-2">
                {onEdit && report.status !== 'archived' && (
                  <button
                    onClick={handleEditClick}
                    className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                    aria-label="Edit report"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                )}
                {onDelete && report.status !== 'archived' && (
                  <button
                    onClick={handleDeleteClick}
                    className="p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Delete report"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                  <p className="text-gray-900 capitalize">
                    {getStatusPill()}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Name</h4>
                  <p className="text-gray-900">{report.name || 'Unknown'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Breed</h4>
                  <p className="text-gray-900">{report.breed1}</p>
                  {report.breed2 && (
                    <p className="text-gray-900">{report.breed2}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Spayed/Neutered</h4>
                  <p className="text-gray-900 truncate">{report.isAltered ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last seen:</h4>
                <p className="text-gray-900">
                  {report.lastSeenLocation
                    ? [report.lastSeenLocation.area, report.lastSeenLocation.state, report.lastSeenLocation.country]
                        .filter(Boolean)
                        .join(', ')
                    : 'Location not specified'}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Reported</h4>
                <p className="text-gray-900">
                  {new Date(report.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {report.status === 'active' && (
              <div className="mt-4">
                <button
                  onClick={openModal}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  <span className="mr-1">📄</span> Generate Lost Pet Flyer
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <FlyerGenerationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleGenerateFlyer}
        isLoading={isGenerating}
        initialDescription={report.description}
      />

      <div style={{ display: 'none' }}>
        <LostPetFlyer
          ref={flyerRef}
          pet={null}
          report={report}
          user={user}
          rewardAmount={rewardAmount}
          customDescription={customDescription}
          phoneNumber={phoneNumber}
        />
      </div>

      {isImageModalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={handleCloseModal}
          onKeyDown={handleModalKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Full size image view"
          tabIndex={-1}
        >
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Close full size image"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={report.image?.variantUrl || "/images/placeholder.png"}
            alt={report.title}
            className="max-h-full max-w-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black bg-opacity-50 py-2">
            {report.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailView;
