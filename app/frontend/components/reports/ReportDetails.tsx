import React from 'react';
import Slider from "react-slick";
import { Link } from 'react-router-dom';
import { IReport } from '../../types/reports/Report'; // Import the report interface
import formatDate from '../../lib/formatDate'; // Assuming you have a formatDate utility

interface ReportDetailsProps {
  report: IReport;
  errors?: string[];
}

const ReportDetails: React.FC<ReportDetailsProps> = ({ report, errors }) => {
  const carouselSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true
  };


  return (
    <div className="container mx-auto p-4">
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

      <div className="p-6 bg-white rounded-lg shadow-lg">
        {report.images && report.images.length > 0 && (
          <div className="mb-8 w-[22rem]">
            <Slider {...carouselSettings}>
              {report.images.map((image, index) => (
                (report.images[0] && report.images[0].url) &&
                <div key={index}>
                  <img
                    src={image.url}
                    alt={`Report image ${index + 1}`}
                    className="object-cover w-full h-96 rounded-lg shadow-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
        <h2 className="text-2xl font-semibold mb-4 text-blue-600">{report.title}</h2>

        {report.name && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Name:</h3>
            <p className="text-gray-700">{report.name}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Description:</h3>
          <p className="text-gray-700">{report.description}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Microchip:</h3>
          <p className="text-gray-700">{report.microchipped ? 'Yes' : 'No'}</p>
        </div>

        {report.microchipped && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Chip ID:</h3>
            <p className="text-gray-700">{report.microchipId?.toUpperCase()}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Species:</h3>
          <p className="text-gray-700">{report.species}</p>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Breeds:</h3>
          {[report.breed1, report.breed2].filter(Boolean).map((breed, index) => (
            <p key={index} className="text-gray-700">{breed}</p>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Colors:</h3>
          {[report.color1, report.color2, report.color3].filter(Boolean).map((color, index) => (
            <p key={index} className="text-gray-700">{color}</p>
          ))}
        </div>

        {report.archivedAt && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Archived At:</h3>
            <p className="text-gray-700">{formatDate(report.archivedAt)}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Posted:</h3>
          <p className="text-gray-700">{formatDate(report.createdAt)}</p>
        </div>

        { report.createdAt !== report.updatedAt && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Updated:</h3>
            <p className="text-gray-700">{formatDate(report.updatedAt)}</p>
          </div>
        )}
      </div>

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
