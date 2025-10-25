import React from "react";
import formatDate from "../../../../shared/formatDate";

const DateDisplay = ({ createdAt, updatedAt }) => {
  if (!updatedAt && createdAt) {
    return (
      <div className="text-sm text-gray-600">
        {formatDate(createdAt)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Posted At</h4>
        <p className="text-gray-900 font-medium">{formatDate(createdAt)}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Updated At</h4>
        <p className="text-gray-900 font-medium">{formatDate(updatedAt)}</p>
      </div>
    </div>
  );
};

export default DateDisplay;
