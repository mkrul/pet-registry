import React from "react";
import { Link } from "react-router-dom";
import IReport from "../../types/reports/Report";
import formatDate from "../../lib/formatDate";
interface ReportProps {
  report: IReport;
}

const Report = ({ report }: ReportProps) => {

  console.log(report)
  return (
    <div key={`report-${report.id}`} className="flex flex-col justify-between h-full bg-white rounded-lg shadow">
      <Link to={`/reports/${report.id}`} className="block" target="_blank">
        <div className="p-4 bg-white rounded-lg flex w-full">
          <div className="flex-shrink-0">
            {report.images?.length > 0 && (
              <img
                src={report.images[0].url}
                alt={report.title}
                className="w-48 h-48 object-cover report__image"
              />
            )}
          </div>
          <div className="flex flex-col justify-between h-full report__title">
            <h2 className="text-xl font-bold">
              {report.title.length > 30
                ? `${report.title.substring(0, 35)}...`
                : report.title}
            </h2>
            <div className="text-gray-500 text-sm mt-2">
              Posted:
              <div>
                {formatDate(report.createdAt)}
              </div>
            </div>
            {report.createdAt !== report.updatedAt && (
              <div className="text-gray-500 text-sm mt-2">
                Updated:
                <div>
                  {formatDate(report.updatedAt)}
                </div>
              </div>
            )}
          </div>
        </div>
        <p className="px-4 pb-4 text-gray-700">
          {report.description.length > 150
            ? `${report.description.substring(0, 125)}...`
            : report.description}
        </p>
      </Link>
    </div>
  );
};

export default Report;
