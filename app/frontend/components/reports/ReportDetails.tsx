import React from 'react';
import { Link } from 'react-router-dom';
import { IReport } from '../../types/reports/Report'; // Import the report interface
import formatDate from '../../lib/formatDate'; // Assuming you have a formatDate utility

interface ReportDetailsProps {
  report: IReport;
  errors?: string[];
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, errors }) => {
  return (
    <div className="container mx-auto p-4">
      {/* Error Display */}
      {errors && errors.length > 0 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">{errors.length} error(s) prohibited this report from being saved:</strong>
          <ul className="mt-2 list-disc list-inside">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Report Details */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">{report.title}</h2>

        {/* Name */}
        {report.name && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Name:</h3>
            <p className="text-gray-700">{report.name}</p>
          </div>
        )}

        {/* Description */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
          <p className="text-gray-700">{report.description}</p>
        </div>

        {/* Species */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Species:</h3>
          <p className="text-gray-700">{report.species}</p>
        </div>

        {/* Breeds */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Breed:</h3>
          {[report.breed1, report.breed2].filter(Boolean).map((breed, index) => (
            <p key={index} className="text-gray-700">{breed}</p>
          ))}
        </div>

        {/* Colors */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Colors:</h3>
          {[report.color1, report.color2, report.color3].filter(Boolean).map((color, index) => (
            <p key={index} className="text-gray-700">{color}</p>
          ))}
        </div>

        {/* Archived Date */}
        {report.archivedAt && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Archived At:</h3>
            <p className="text-gray-700">{formatDate(report.archivedAt)}</p>
          </div>
        )}

        {/* Created and Updated Timestamps */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800">Timestamps:</h3>
          <p className="text-gray-700">Created at: {formatDate(report.createdAt)}</p>
          {report.createdAt !== report.updatedAt && (
            <p className="text-gray-700">Last updated: {formatDate(report.updatedAt)}</p>
          )}
        </div>

        {/* Images */}
        {report.images && report.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 w-100">Images:</h3>
            <div className="flex flex-wrap mt-4">
              {report.images.map((image, index) => (
                <img
                  key={index}
                  src={image.thumbnailUrl}
                  alt={`Report image ${index + 1}`}
                  className="object-cover rounded-lg shadow-lg mr-4 mb-4"
                  width={200}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6">
        <Link
          to={`/reports/${report.id}/edit`}
          className="inline-block px-4 py-2 bg-yellow-500 text-white font-semibold rounded hover:bg-yellow-600"
        >
          Edit Report
        </Link>
        <Link
          to="/reports"
          className="inline-block ml-4 px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600"
        >
          Back to Reports
        </Link>
      </div>
    </div>
  );
};

export default ReportDetails;
