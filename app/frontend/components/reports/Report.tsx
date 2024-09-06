import React from "react";
import { Link } from "react-router-dom";
import IReport from "../../types/reports/IReport";

interface ReportProps {
  report: IReport;
}

const Report = ({ report }: ReportProps) => {
  return (
    <div key={`report-${report.id}`}>
      <Link to={`/reports/${report.id}`} className="block" target="_blank">
        <div className="p-4 bg-white rounded-lg shadow flex w-full lg:w-auto flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-row">
          <div className="flex-shrink-0">
            {report.imageUrls?.length > 0 && (
              <img
                src={report.imageUrls[0]}
                alt={report.title}
                className="w-48 h-48 object-cover"
              />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {report.title.length > 30
                ? `${report.title.substring(0, 35)}...`
                : report.title}
            </h2>
            <div className="text-gray-500 text-sm mt-2">
              Posted:
              {new Date(report.createdAt).toLocaleString()}
            </div>
            {report.createdAt !== report.updatedAt && (
              <div className="text-gray-500 text-sm mt-2">
                Updated:
                {new Date(report.updatedAt).toLocaleString()}
              </div>
            )}
            {/* truncated description */}
            <p className="mt-2 text-gray-700">
              {report.description.length > 35
                ? `${report.description.substring(0, 100)}...`
                : report.description}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Report;
