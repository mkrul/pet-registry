import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import LocationDisplay from "../../../shared/components/common/LocationDisplay.jsx";
import Map from "../../../shared/components/common/Map.jsx";
import DateDisplay from "./common/DateDisplay.jsx";
import { createMapLocation } from "../../../shared/utils/mapUtils.js";
import { MAP_ZOOM_LEVELS } from "../../../shared/constants/map.js";

const ListingDetailsCard = ({ report }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || "/images/placeholder.png");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const handleBackClick = () => {
    const query = searchParams.get("query") || "";
    const page = searchParams.get("page") || "1";
    navigate(`/?query=${encodeURIComponent(query)}&page=${page}`);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
  };

  const handleImageError = () => {
    const placeholderPath = "/images/placeholder.png";
    if (imageSrc !== placeholderPath) {
      setImageSrc(placeholderPath);
    } else {
      setIsImageLoading(false);
    }
  };

  const getReportStatusDisplay = (report) => {
    const ringStyle = report.recentlyCreated
      ? "ring-4 ring-blue-500 rounded-lg"
      : report.recentlyUpdated
        ? "ring-4 ring-green-500 rounded-lg"
        : "";

    const badge = report.recentlyCreated ? (
      <span
        className="absolute bottom-0 right-0 z-10 bg-blue-500 text-blue-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md"
        aria-label="Report created within the last hour"
      >
        NEW
      </span>
    ) : report.recentlyUpdated ? (
      <span
        className="absolute bottom-0 right-0 z-10 bg-green-500 text-green-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md"
        aria-label="Report updated within the last two days"
      >
        UPDATED
      </span>
    ) : null;

    return { ringStyle, badge };
  };

  const { ringStyle, badge } = getReportStatusDisplay(report);

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 relative">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <Spinner />
                </div>
              )}
              <div
                className={`relative ${ringStyle} cursor-pointer group`}
                onClick={handleImageClick}
              >
                <img
                  src={imageSrc}
                  alt={report.title}
                  className={`w-full h-96 md:h-full md:min-h-[600px] object-cover ${report.status === 'archived' ? 'grayscale' : ''} ${isImageLoading ? "hidden" : "block"}`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to enlarge
                </div>
                {badge}
              </div>
            </div>

            <div className="md:w-1/2 p-6 md:p-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{report.title}</h1>
                    {report.status === 'archived' && (
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{report.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Name</h4>
                    <p className="text-gray-900 font-medium">{report.name || "Unknown"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Species</h4>
                    <p className="text-gray-900 font-medium capitalize">{report.species}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Breed</h4>
                    <p className="text-gray-900 font-medium">{report.breed1}</p>
                    {report.breed2 && (
                      <p className="text-gray-900 font-medium">{report.breed2}</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Gender</h4>
                    <p className="text-gray-900 font-medium capitalize">{report.gender || "Unknown"}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Spayed/Neutered</h4>
                    <p className="text-gray-900 font-medium">
                      {report.isAltered === true ? "Yes" : report.isAltered === false ? "No" : "Unknown"}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                        {report.color1}
                      </span>
                      {report.color2 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {report.color2}
                        </span>
                      )}
                      {report.color3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                          {report.color3}
                        </span>
                      )}
                    </div>
                  </div>

                  {report.microchipId && (
                    <div className="sm:col-span-2">
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Microchip ID</h4>
                      <p className="text-gray-900 font-medium font-mono">{report.microchipId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Location Details</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <LocationDisplay
                area={report.area}
                state={report.state}
                country={report.country}
                intersection={report.intersection}
                useStateAbbreviation={true}
              />
              <div className="mt-4">
                <Map
                  initialLocation={createMapLocation(report)}
                  readOnly={true}
                  onLocationSelect={() => {}}
                  initialZoom={MAP_ZOOM_LEVELS.VIEW}
                />
              </div>
            </div>
            <div className="pt-4">
              <DateDisplay createdAt={report.createdAt} updatedAt={report.updatedAt} />
            </div>
          </div>
        </div>
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
            src={imageSrc}
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

export default ListingDetailsCard;
