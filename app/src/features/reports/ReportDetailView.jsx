import React, { useState } from 'react';
import { truncate } from 'lodash';
import Spinner from '../../shared/components/common/Spinner.jsx';
import StatusPill from '../../shared/components/common/StatusPill.jsx';
import useFlyerGeneration from "../../shared/hooks/useFlyerGeneration";
import FlyerGenerationModal from "../../shared/components/common/FlyerGenerationModal";
import LostPetFlyer from "../../shared/components/common/LostPetFlyer";

const ReportDetailView = ({ report, user, onBack, onEdit, onDelete }) => {
  const { isModalOpen, openModal, closeModal, handleGenerateFlyer, flyerRef, rewardAmount, additionalNotes } = useFlyerGeneration();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

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
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Spinner size={40} inline={true} bgFaded={false} />
              </div>
            )}
            <img
              src={report.image?.variantUrl || "/images/placeholder.png"}
              alt={report.title}
              className={`w-full h-64 md:h-full object-cover ${report.status === 'archived' ? 'grayscale' : ''} ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="md:w-1/2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900 truncate flex-1 mr-4">{report.title}</h3>
              <div className="flex space-x-2">
                {onEdit && (
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
                {onDelete && (
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

            <div className="space-y-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                <p className="text-gray-900">{truncate(report.description, { length: 200 })}</p>
              </div>
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
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Species</h4>
                  <p className="text-gray-900 capitalize">{report.species}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Breed</h4>
                  <p className="text-gray-900">{report.breed1}</p>
                  {report.breed2 && (
                    <p className="text-gray-900">{report.breed2}</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Last seen:</h4>
                <p className="text-gray-900">
                  {[report.area, report.state, report.country]
                    .filter(Boolean)
                    .join(', ') || 'Location not specified'}
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
      />

      <div style={{ display: 'none' }}>
        <LostPetFlyer
          ref={flyerRef}
          pet={null}
          report={report}
          user={user}
          rewardAmount={rewardAmount}
          additionalNotes={additionalNotes}
        />
      </div>
    </div>
  );
};

export default ReportDetailView;
