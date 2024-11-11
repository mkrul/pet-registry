import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IReport } from "../../types/reports/Report";
import Spinner from "../shared/Spinner";

interface ReportProps {
  report: IReport;
}

const ReportCard = ({ report }: ReportProps) => {
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

  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow">
      <Link to={`/reports/${report.id}`} className="block">
        <div className="p-4 bg-white rounded-lg flex w-full">
          <div className="flex-shrink-0 relative w-48 h-48">
            {/* Added relative positioning and fixed size */}
            {imageIsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <Spinner />
              </div>
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
            {/* Added margin and flex-grow */}
            <h2 className="text-xl font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            <div className="flex items-center">
              {report.updatedLastThreeDays && (
                <span
                  className="relative h-[20px] mt-2 bg-green-100 text-green-900 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-700 dark:text-green-200 cursor-pointer"
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
                      className="absolute top-0 left-full ml-2 mt-0 px-2 py-1 text-xs text-green-800 bg-green-100 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400 shadow-lg z-10"
                    >
                      {/* Tooltip Content */}
                      <div>{formattedDate},</div>
                      <div className="whitespace-nowrap">{formattedTime}</div>
                    </div>
                  )}
                </span>
              )}
            </div>
            <div className="text-gray-500 text-md mt-2">
              {report.description.length > 100
                ? `${report.description.substring(0, 100)}...`
                : report.description}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ReportCard;
