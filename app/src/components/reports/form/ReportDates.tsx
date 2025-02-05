import React from "react";
import formatDate from "../../../lib/formatDate";

interface ReportDatesProps {
  createdAt: string;
  updatedAt: string;
}

const ReportDates: React.FC<ReportDatesProps> = ({ createdAt, updatedAt }) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-8">
        <div>
          <label className="text-lg font-medium text-gray-900 mb-2">Posted at:</label>
          <p className="text-md text-gray-500">{formatDate(createdAt)}</p>
        </div>
        <div>
          <label className="text-lg font-medium text-gray-900 mb-2">Updated at:</label>
          <p className="text-md text-gray-500">{formatDate(updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportDates;
