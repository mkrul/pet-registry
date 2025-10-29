import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../../shared/components/common/Spinner.jsx";
import LocationDisplay from "../../../shared/components/common/LocationDisplay.jsx";
import { useAppDispatch } from "../../../store/hooks.js";
import { setScrollPosition } from "../../../store/features/search/searchSlice.js";

const ReportCard = ({ report, currentPage, currentQuery }) => {
  const dispatch = useAppDispatch();
  const placeholderPath = "/images/placeholder.png";
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(report.image?.variantUrl || placeholderPath);

  const getReportStatusDisplay = (report) => {
    const ringStyle = report.recentlyCreated
      ? "ring-4 ring-blue-500 rounded-lg"
      : report.recentlyUpdated
        ? "ring-4 ring-green-500 rounded-lg"
        : "";

    const badge = report.recentlyCreated ? (
      <span
        className="absolute bottom-0 right-0 z-10 bg-blue-500 text-blue-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md cursor-pointer dark:bg-blue-500 dark:text-blue-100"
        tabIndex={0}
        aria-label="Report created within the last hour"
        aria-describedby={`tooltip-${report.id}`}
      >
        NEW
      </span>
    ) : report.recentlyUpdated ? (
      <span
        className="absolute bottom-0 right-0 z-10 bg-green-500 text-green-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md cursor-pointer dark:bg-green-500 dark:text-green-100"
        tabIndex={0}
        aria-label="Report updated within the last two days"
        aria-describedby={`tooltip-${report.id}`}
      >
        UPDATED
      </span>
    ) : null;

    return { ringStyle, badge };
  };

  const formattedDate = new Date(report.updatedAt).toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });

  const formattedTime = new Date(report.updatedAt).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short"
  });

  const handleImageLoad = () => {
    setImageIsLoading(false);
  };

  const handleImageError = () => {
    if (imageSrc !== placeholderPath) {
      setImageSrc(placeholderPath);
    } else {
      setImageIsLoading(false);
    }
  };

  const reportUrl = `/reports/${report.id}?query=${encodeURIComponent(currentQuery)}&page=${currentPage}`;

  const { ringStyle, badge } = getReportStatusDisplay(report);

  const handleReportClick = () => {
    dispatch(setScrollPosition(window.scrollY));

    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow">
      <Link to={reportUrl} className="block" onClick={handleReportClick}>
        <div className="p-4 bg-white rounded-lg sm:flex w-full">
          <div className="flex-shrink-0 relative w-full sm:w-48 h-72 sm:h-48 mb-4 sm:mb-0">
            {imageIsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <Spinner />
              </div>
            )}
            <div className={`relative w-full h-72 sm:h-48 ${ringStyle}`}>
              <img
                src={imageSrc}
                alt={report.title}
                className={`w-full h-72 sm:h-48 object-cover rounded-lg ${imageIsLoading ? "hidden" : "block"}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {badge}
            </div>
          </div>
          <div className="flex flex-col sm:ml-4 flex-grow">
            <h2 className="text-lg font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            {report.breed1 && (
              <p className="mt-0 text-sm text-gray-600">
                {report.breed2 ? `${report.breed1} / ${report.breed2}` : report.breed1}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-600">
              <div className="font-medium text-gray-800">Last seen at: </div>
              {(() => {
                const area = report.lastSeenLocation?.area || report.area;
                const state = report.lastSeenLocation?.state || report.state;
                const intersection = report.lastSeenLocation?.intersection || report.intersection;

                if (area && state) {
                  const stateAbbrev = state.length > 2 ? state.substring(0, 2).toUpperCase() : state;
                  const locationText = intersection && intersection !== ""
                    ? `${intersection} in ${area}, ${stateAbbrev}`
                    : `${area}, ${stateAbbrev}`;
                  return <span>{locationText}</span>;
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportCard;
