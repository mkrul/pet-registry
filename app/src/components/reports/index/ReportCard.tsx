import React, { useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../common/Spinner";
import { ReportCardProps } from "../../../types/Report";
import LocationDisplay from "../../common/LocationDisplay";

const ReportCard: React.FC<ReportCardProps> = ({ report, currentPage, currentQuery }) => {
  const placeholderPath = "/images/placeholder.png";
  const [imageIsLoading, setImageIsLoading] = useState(true);
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
        <div className="p-4 bg-white rounded-lg sm:flex w-full">
          <div className="flex-shrink-0 relative w-full sm:w-48 h-72 sm:h-48 mb-4 sm:mb-0">
            {imageIsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <Spinner />
              </div>
            )}
            <div
              className={`relative w-full h-72 sm:h-48 ${
                report.createdLast24Hours
                  ? "ring-4 ring-blue-500 rounded-lg"
                  : report.updatedLastXDays
                    ? "ring-4 ring-green-500 rounded-lg"
                    : ""
              }`}
            >
              <img
                src={imageSrc}
                alt={report.title}
                className={`w-full h-72 sm:h-48 object-cover rounded-lg ${imageIsLoading ? "hidden" : "block"}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
              {report.createdLast24Hours && (
                <span
                  className="absolute bottom-0 right-0 z-10 bg-blue-500 text-blue-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md cursor-pointer dark:bg-blue-500 dark:text-blue-100"
                  tabIndex={0}
                  aria-describedby={`tooltip-${report.id}`}
                >
                  NEW
                </span>
              )}
              {!report.createdLast24Hours && report.updatedLastXDays && (
                <span
                  className="absolute bottom-0 right-0 z-10 bg-green-500 text-green-100 text-base font-medium px-3 pb-0.5 pt-1 rounded-tl-md cursor-pointer dark:bg-green-500 dark:text-green-100"
                  tabIndex={0}
                  aria-describedby={`tooltip-${report.id}`}
                >
                  UPDATED
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:ml-4 flex-grow">
            <h2 className="text-xl font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            <LocationDisplay area={report.area} state={report.state} country={report.country} />
            <div className="border-t border-gray-200 mt-3 pt-3">
              <div className="text-gray-500 text-md">
                {report.description.length > 100
                  ? `${report.description.substring(0, 160)}...`
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
