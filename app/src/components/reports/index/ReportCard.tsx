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
            {report.updatedLastThreeDays && (
              <span
                className="absolute top-2 right-2 z-10 bg-green-300 text-green-900 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-500 dark:text-green-100 cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                tabIndex={0}
                aria-describedby={`tooltip-${report.id}`}
              >
                Updated
                {showTooltip && (
                  <div
                    id={`tooltip-${report.id}`}
                    role="tooltip"
                    className="absolute top-full right-0 mt-2 px-2 py-1 text-xs text-green-800 bg-green-100 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 shadow-lg z-20"
                  >
                    <div>{formattedDate},</div>
                    <div className="whitespace-nowrap">{formattedTime}</div>
                  </div>
                )}
              </span>
            )}
            <img
              src={imageSrc}
              alt={report.title}
              className={`w-full h-full object-cover rounded-lg ${imageIsLoading ? "hidden" : "block"}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          </div>
          <div className="flex flex-col justify-between h-full ml-4 flex-grow">
            <h2 className="text-xl font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            <div className="text-gray-500 text-md mt-2">
              {report.description.length > 100
                ? `${report.description.substring(0, 100)}...`
                : report.description}
            </div>
            <LocationDisplay area={report.area} state={report.state} country={report.country} />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportCard;
