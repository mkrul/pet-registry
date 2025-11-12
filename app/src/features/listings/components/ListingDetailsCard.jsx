import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import LocationDisplay from "../../../shared/components/common/LocationDisplay.jsx";
import DateDisplay from "./common/DateDisplay.jsx";
import TipsSection from "../../tips/components/TipsSection.jsx";
import { useGetTipsQuery } from "../../../store/features/tips/tipsApi.js";
import MessageText from "../../messages/components/MessageText.jsx";
import ConfirmationModal from "../../../shared/components/common/ConfirmationModal.jsx";
import TipsPagination from "./TipsPagination.jsx";

const ListingDetailsCard = ({ report }) => {
  const [tipsPage, setTipsPage] = useState(1);
  const { data: tipsData } = useGetTipsQuery({ reportId: report.id, page: tipsPage, perPage: 5 });
  const tips = tipsData?.tips || [];
  const pagination = tipsData?.pagination;
  const navigate = useNavigate();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);
  const [expandedTips, setExpandedTips] = useState(new Set());
  const [truncatedTips, setTruncatedTips] = useState(new Set());

  const extractUrlsFromText = (text) => {
    if (!text) return [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    return matches || [];
  };

  const getUniqueExternalLinks = (tip) => {
    if (!tip.external_links || tip.external_links.length === 0) return [];
    const messageUrls = extractUrlsFromText(tip.message);
    const googleMapsUrl = tip.latitude && tip.longitude
      ? `https://www.google.com/maps?q=${tip.latitude},${tip.longitude}`
      : null;
    return tip.external_links.filter(link => {
      if (messageUrls.includes(link)) return false;
      if (googleMapsUrl && link.includes('google.com/maps')) return false;
      return true;
    });
  };

  const isExternalUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const currentHostname = window.location.hostname;
      return urlObj.hostname !== currentHostname;
    } catch {
      return false;
    }
  };

  const handleLinkClick = (url, e) => {
    e.preventDefault();

    if (isExternalUrl(url)) {
      setPendingUrl(url);
      setShowLinkModal(true);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleConfirmLinkOpen = () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
    }
    setShowLinkModal(false);
    setPendingUrl(null);
  };

  const handleCloseLinkModal = () => {
    setShowLinkModal(false);
    setPendingUrl(null);
  };

  const handleTipsPageChange = (page) => {
    setTipsPage(page);
    setExpandedTips(new Set());
    setTruncatedTips(new Set());
  };

  const toggleTipExpansion = (tipId) => {
    setExpandedTips(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tipId)) {
        newSet.delete(tipId);
      } else {
        newSet.add(tipId);
      }
      return newSet;
    });
  };

  const interactiveElementsSelector = 'a, button, input, textarea, select, [role="button"]';

  const handleTipContainerClick = (event, tipId) => {
    const target = event.target;
    if (typeof Element !== 'undefined' && target instanceof Element) {
      const interactiveAncestor = target.closest(interactiveElementsSelector);
      if (interactiveAncestor && interactiveAncestor !== event.currentTarget) {
        return;
      }
    }
    toggleTipExpansion(tipId);
  };

  const handleTipContainerKeyDown = (event, tipId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTipExpansion(tipId);
    }
  };

  const checkTruncation = (tipId, containerElement) => {
    if (!containerElement) return;

    const truncatedElements = containerElement.querySelectorAll('.truncate');
    let isTruncated = false;

    truncatedElements.forEach(element => {
      if (element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight) {
        isTruncated = true;
      }
    });

    if (!isTruncated) {
      const contentDiv = containerElement.querySelector('.flex-1');
      if (contentDiv) {
        const childCount = Array.from(contentDiv.children).filter(child => {
          return child.textContent && child.textContent.trim().length > 0;
        }).length;
        const tip = tips.find(t => t.id === tipId);
        if (tip) {
          const hasLocation = tip.area || tip.state || tip.country || tip.intersection;
          const hasMapLink = tip.latitude && tip.longitude;
          const uniqueLinks = getUniqueExternalLinks(tip);
          const hasLinks = uniqueLinks.length > 0;
          const totalItems = (hasLocation ? 1 : 0) + (hasMapLink ? 1 : 0) + (tip.message ? 1 : 0) + (hasLinks ? uniqueLinks.length : 0);
          if (totalItems > 1) {
            isTruncated = true;
          }
        }
      }
    }

    setTruncatedTips(prev => {
      const newSet = new Set(prev);
      if (isTruncated) {
        newSet.add(tipId);
      } else {
        newSet.delete(tipId);
      }
      return newSet;
    });
  };

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

  useEffect(() => {
    const handleResize = () => {
      setTruncatedTips(new Set());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tips]);

  return (
    <div className="min-h-screen py-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Reports
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 relative md:flex md:items-stretch">
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 z-20">
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
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{report.title}</h1>
                    {report.status === 'archived' && (
                      <span className="px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full flex-shrink-0">
                        Archived
                      </span>
                    )}
                  </div>
                </div>

                {(report.name || report.species) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {report.name && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1">Name</h4>
                        <p className="text-gray-700 dark:text-gray-100 font-normal">{report.name}</p>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1">Description</h4>
                  <p className="text-gray-700 dark:text-gray-100 font-normal">{report.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1">Breed</h4>
                    <p className="text-gray-700 dark:text-gray-100 font-normal">{report.breed1}</p>
                    {report.breed2 && (
                      <p className="text-gray-700 dark:text-gray-100 font-normal">{report.breed2}</p>
                    )}
                  </div>

                  {report.gender && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1">Gender</h4>
                      <p className="text-gray-700 dark:text-gray-100 font-normal capitalize">{report.gender}</p>
                    </div>
                  )}

                  {report.isAltered !== null && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1">Spayed/Neutered</h4>
                      <p className="text-gray-700 dark:text-gray-100 font-normal">
                        {report.isAltered ? "Yes" : "No"}
                      </p>
                    </div>
                  )}

                  {report.microchipId && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-400 uppercase tracking-wide mb-1">Microchip ID</h4>
                      <p className="text-gray-700 dark:text-gray-100 font-normal">{report.microchipId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-6 md:p-8">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-2">Sightings & Tips</h4>
          <div className="flex items-start gap-2 mb-5">
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              The information below lists the original location where the animal went missing, along with any subsequent sightings or tips reported by community members.
            </p>
          </div>
          <div className="space-y-3">
            {tips.map((tip) => {
              const isExpanded = expandedTips.has(tip.id);
              const hasLocation = tip.area || tip.state || tip.country || tip.intersection;
              const hasMapLink = tip.latitude && tip.longitude;
              const uniqueLinks = getUniqueExternalLinks(tip);
              const hasLinks = uniqueLinks.length > 0;
              const hasContent = hasLocation || hasMapLink || tip.message || hasLinks;
              const tipTimestamp = tip.createdAt || tip.created_at ? new Date(tip.createdAt || tip.created_at) : null;
              const formattedDate = tipTimestamp
                ? tipTimestamp.toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric"
                  })
                : null;
              const formattedTime = tipTimestamp
                ? tipTimestamp.toLocaleTimeString(undefined, {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                  })
                : null;

              return (
                <div key={tip.id} className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <div
                    className={`flex items-start gap-4${hasContent ? ' cursor-pointer rounded-md transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-800' : ''}`}
                    onClick={hasContent ? (event) => handleTipContainerClick(event, tip.id) : undefined}
                    onKeyDown={hasContent ? (event) => handleTipContainerKeyDown(event, tip.id) : undefined}
                    role={hasContent ? 'button' : undefined}
                    tabIndex={hasContent ? 0 : undefined}
                    aria-expanded={hasContent ? isExpanded : undefined}
                  >
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex flex-col md:flex-row md:items-center flex-shrink-0">
                      {formattedDate && formattedTime ? (
                        <>
                          <span>{`${formattedDate},`}</span>
                          <span className="md:ml-1">{formattedTime}</span>
                        </>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        {isExpanded ? (
                          <div className="space-y-2">
                            {hasLocation && (
                              <LocationDisplay
                                textStyle="text-sm font-normal text-gray-700 dark:text-gray-200"
                                area={tip.area}
                                state={tip.state}
                                country={tip.country}
                                intersection={tip.intersection}
                                useStateAbbreviation={true}
                                showReportedMissing={true}
                              />
                            )}
                            {hasMapLink && (
                              <a
                                href={`https://www.google.com/maps?q=${tip.latitude},${tip.longitude}`}
                                onClick={(e) => handleLinkClick(`https://www.google.com/maps?q=${tip.latitude},${tip.longitude}`, e)}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline inline-block cursor-pointer"
                              >
                                🗺️📍 View on Google Maps
                              </a>
                            )}
                            {tip.message && (
                              <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap pt-0.5">
                                <MessageText text={tip.message} />
                              </p>
                            )}
                            {hasLinks && (
                              <div className="space-y-1">
                                {uniqueLinks.map((link, index) => (
                                  <a
                                    key={index}
                                    href={link}
                                    onClick={(e) => handleLinkClick(link, e)}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline block cursor-pointer truncate"
                                    title={link}
                                  >
                                    🔗 {link}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            ref={(el) => {
                              if (el && !isExpanded) {
                                setTimeout(() => checkTruncation(tip.id, el), 100);
                              }
                            }}
                            className="flex items-center gap-2 min-w-0"
                          >
                            <div className="flex-1 min-w-0">
                              {hasLocation && (
                                <div className="truncate">
                                  <LocationDisplay
                                    textStyle="text-sm font-normal text-gray-700 dark:text-gray-200"
                                    area={tip.area}
                                    state={tip.state}
                                    country={tip.country}
                                    intersection={tip.intersection}
                                    useStateAbbreviation={true}
                                    showReportedMissing={true}
                                  />
                                </div>
                              )}
                              {!hasLocation && hasMapLink && (
                                <div className="truncate text-sm text-blue-600 dark:text-blue-400">
                                  🗺️📍 View on Google Maps
                                </div>
                              )}
                              {!hasLocation && !hasMapLink && tip.message && (
                                <p className="text-sm text-gray-700 dark:text-gray-200 truncate" title={tip.message}>
                                  {tip.message}
                                </p>
                              )}
                              {!hasLocation && !hasMapLink && !tip.message && hasLinks && (
                                <div className="truncate text-sm text-blue-600 dark:text-blue-400">
                                  🔗 {uniqueLinks[0]}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {hasContent && (truncatedTips.has(tip.id) || isExpanded) && (
                        <span className="flex-shrink-0 mt-1 text-gray-400 dark:text-gray-500 transition-colors" aria-hidden="true">
                          <svg
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {pagination && pagination.pages > 1 && (
            <div className="mt-4">
              <TipsPagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handleTipsPageChange}
              />
            </div>
          )}
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

      <ConfirmationModal
        isOpen={showLinkModal}
        onClose={handleCloseLinkModal}
        onConfirm={handleConfirmLinkOpen}
        title="You are about to open an external link."
        message={`If the link you clicked is not from a trusted source, it may contain potential security risks. \n\nAre you sure you want to open it?`}
        confirmText="Continue"
        cancelText="Cancel"
        confirmButtonColor="blue"
      />
    </div>
  );
};

export default ListingDetailsCard;
