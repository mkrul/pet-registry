import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../common/Spinner";
import { ReportCardProps } from "../../../types/Report";
import LocationDisplay from "../../common/LocationDisplay";

const ReportCard: React.FC<ReportCardProps> = ({ report, currentPage, currentQuery }) => {
  const placeholderPath = "/images/placeholder.png";
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [imageSrc, setImageSrc] = useState(report.image?.thumbnailUrl || placeholderPath);

  // Format the date
  const formattedDate = new Date(report.updatedAt).toLocaleDateString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric"
  });

  // Format the time with timezone
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

  // Construct the URL with query parameters
  const reportUrl = `/reports/${report.id}?query=${encodeURIComponent(currentQuery)}&page=${currentPage}`;

  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow">
      {/* Pass `query` and `page` as query parameters */}
      <Link to={reportUrl} className="block">
        <div className="p-4 bg-white rounded-lg flex w-full">
          <div className="flex-shrink-0 relative w-48 h-48">
            {imageIsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <Spinner />
              </div>
            )}
            <div
              className={`relative w-full h-full ${
                report.updatedLastThreeDays ? "ring-4 ring-green-500 rounded-lg" : ""
              }`}
            >
              <img
                src={imageSrc}
                alt={report.title}
                className={`w-full h-full object-cover rounded-lg ${imageIsLoading ? "hidden" : "block"}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {report.updatedLastThreeDays && (
                <span
                  className="absolute bottom-0 right-0 z-10 bg-green-500 text-green-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md cursor-pointer dark:bg-green-500 dark:text-green-100"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                  tabIndex={0}
                  aria-describedby={`tooltip-${report.id}`}
                >
                  UPDATED
                  {showTooltip && (
                    <div
                      id={`tooltip-${report.id}`}
                      role="tooltip"
                      className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs text-green-800 bg-green-100 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 shadow-lg z-20"
                    >
                      <div>{formattedDate},</div>
                      <div className="whitespace-nowrap">{formattedTime}</div>
                    </div>
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-between h-full ml-4 flex-grow">
            <h2 className="text-xl font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            <LocationDisplay area={report.area} state={report.state} country={report.country} />
            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="text-gray-500 text-md">
                {report.description.length > 100
                  ? `${report.description.substring(0, 100)}...`
                  : report.description}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportCard;
