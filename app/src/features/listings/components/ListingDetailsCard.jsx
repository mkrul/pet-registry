import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import LocationDisplay from "../../../shared/components/common/LocationDisplay.jsx";
import Map from "../../../shared/components/common/Map.jsx";
import DateDisplay from "./common/DateDisplay.jsx";
import TipsSection from "../../tips/components/TipsSection.jsx";
import { useGetAllTipsQuery } from "../../../store/features/tips/tipsApi.js";
import { createMapLocation } from "../../../shared/utils/mapUtils.js";
import { MAP_ZOOM_LEVELS } from "../../../shared/constants/map.js";
import { Place } from "@mui/icons-material";

const ListingDetailsCard = ({ report }) => {
  const { data: tipsData } = useGetAllTipsQuery(report.id);
  const tips = tipsData?.tips || [];
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
    const ringStyle = "";
    const badge = null;

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
            <div className="md:w-1/2 relative md:flex md:items-stretch">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-20">
                  <Spinner />
                </div>
              )}
              <div
                className={`relative w-full ${ringStyle} cursor-pointer group`}
                onClick={handleImageClick}
              >
                <img
                  src={imageSrc}
                  alt={report.title}
                  className={`w-full h-64 md:h-full md:min-h-[350px] sm:min-h-[400px] xs:min-h-[300px] object-cover ${report.status === 'archived' ? 'grayscale' : ''} ${isImageLoading ? "hidden" : "block"}`}
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

            <div className="md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                    {report.status === 'archived' && (
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full flex-shrink-0">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                {(report.name || report.species) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {report.name && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Name</h4>
                        <p className="text-gray-900 font-medium">{report.name}</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Description</h4>
                  <p className="text-gray-900 font-medium">{report.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Breed</h4>
                    <p className="text-gray-900 font-medium">{report.breed1}</p>
                    {report.breed2 && (
                      <p className="text-gray-900 font-medium">{report.breed2}</p>
                    )}
                  </div>

                  {report.gender && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Gender</h4>
                      <p className="text-gray-900 font-medium capitalize">{report.gender}</p>
                    </div>
                  )}

                  {report.isAltered !== null && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Spayed/Neutered</h4>
                      <p className="text-gray-900 font-medium">
                        {report.isAltered ? "Yes" : "No"}
                      </p>
                    </div>
                  )}

                  {report.microchipId && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Microchip ID</h4>
                      <p className="text-gray-900 font-medium font-mono">{report.microchipId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Location Details</h4>
          <div className="flex items-start gap-2 mb-5">
            <p className="text-sm text-gray-600 mt-2">
              The information below lists the original report location and any subsequent sightings reported by community members.
            </p>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <div className="text-sm text-gray-600 whitespace-nowrap">
                {new Date(report.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric"
                })}, {new Date(report.createdAt).toLocaleTimeString(undefined, {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true
                })}
              </div>
              <LocationDisplay
                textStyle="font-medium text-black"
                area={report.area}
                state={report.state}
                country={report.country}
                intersection={report.intersection}
                useStateAbbreviation={true}
                showReportedMissing={true}
              />
            </div>

            {tips
              .filter(tip => tip.area || tip.state || tip.country || tip.intersection)
              .slice()
              .reverse()
              .map((tip) => (
              <div key={tip.id} className="grid grid-cols-[auto_1fr] gap-4 items-center border-t border-gray-200 pt-3">
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  {(tip.createdAt || tip.created_at) ? (
                    <>
                      {new Date(tip.createdAt || tip.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "numeric",
                        day: "numeric"
                      })}, {new Date(tip.createdAt || tip.created_at).toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true
                      })}
                    </>
                  ) : (
                    '—'
                  )}
                </div>
                <LocationDisplay
                  textStyle="font-medium text-black"
                  area={tip.area}
                  state={tip.state}
                  country={tip.country}
                  intersection={tip.intersection}
                  useStateAbbreviation={true}
                  showReportedMissing={true}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <TipsSection reportId={report.id} report={report} />
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
