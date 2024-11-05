import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IReport } from "../../types/reports/Report";
import formatDate from "../../lib/formatDate";
import Spinner from "../shared/Spinner"; // Make sure to import your Spinner component

interface ReportProps {
  report: IReport;
}

const ReportCard = ({ report }: ReportProps) => {
  const [imageIsLoading, setImageIsLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const formattedUpdatedAt = formatDate(report.updatedAt);
  console.log("REPORT", report);

  const handleImageLoad = () => {
    setImageIsLoading(false);
  };

  return (
    <div className="flex flex-col justify-between h-full bg-white rounded-lg shadow">
      <Link to={`/reports/${report.id}`} className="block">
        <div className="p-4 bg-white rounded-lg flex w-full">
          <div className="flex-shrink-0">
            {imageIsLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner />
              </div>
            )}
            {report.image && (
              <img
                src={report.image.thumbnailUrl}
                alt={report.title}
                className={`md:w-48 md:h-48 lg:w-48 lg:h-48 object-cover report__image ${imageIsLoading ? "hidden" : "block"}`}
                onLoad={handleImageLoad}
              />
            )}
          </div>
          <div className="flex flex-col justify-between h-full report__title">
            <h2 className="text-xl font-bold">
              {report.title.length > 25 ? `${report.title.substring(0, 25)}...` : report.title}
            </h2>
            <div className="flex justify-between">
              {report.updatedLastThreeDays && (
                <span
                  className="relative h-[20px] mt-2 bg-green-300/80 text-green-900 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full light:bg-green-700/90 light:text-green-200 cursor-pointer"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  Updated
                  {showTooltip && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 text-xs text-green-800 bg-green-100 rounded light:bg-gray-700 light:text-green-400 border border-green-400 shadow-lg whitespace-nowrap">
                      {formattedUpdatedAt}
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
