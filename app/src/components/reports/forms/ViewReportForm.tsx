import React, { useState } from "react";
import formatDate from "../../../lib/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Map from "../../common/Map";
import { ViewReportFormProps } from "../../../types/Report";
import Spinner from "../../common/Spinner";
import LocationDisplay from "../../common/LocationDisplay";
import DateDisplay from "../common/DateDisplay";
import { createMapLocation } from "../../../utils/mapUtils";
import { MAP_ZOOM_LEVELS } from "../../../constants/map";

const ViewReportForm: React.FC<ViewReportFormProps> = ({
  report,
  onEditClick,
  onBackClick,
  imageSrc,
  handleImageLoad,
  handleImageError
}) => {
  const [isImageLoading, setIsImageLoading] = useState(true);

  const onImageLoad = () => {
    setIsImageLoading(false);
    handleImageLoad();
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onEditClick}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <FontAwesomeIcon icon={faPencil} className="mr-2" />
          Edit
        </button>
        <button
          type="button"
          onClick={onBackClick}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-900">{report.title}</h2>

      {/* Image */}
      <div className="space-y-2">
        <div className="mt-1 relative">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 mb-4 mt-4">
              <Spinner size={32} />
            </div>
          )}
          <img
            src={imageSrc}
            alt={report.title}
            className="w-full rounded-lg shadow-sm"
            onLoad={onImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Name:</label>
        <p className="text-md text-gray-500 mb-4">{report.name || "Unknown"}</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Description:</label>
        <p className="text-gray-500 whitespace-pre-wrap">{report.description}</p>
      </div>

      {/* Species */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Species:</label>
        <p className="text-md text-gray-500 mb-4">{report.species}</p>
      </div>

      {/* Breeds */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Breed(s):</label>
        <div className="space-y-1">
          <p className="text-md text-gray-500">{report.breed1}</p>
          {report.breed2 && <p className="text-md text-gray-500">{report.breed2}</p>}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Gender:</label>
        <p className="text-md text-gray-500 mb-4">{report.gender || "Unknown"}</p>
      </div>

      {/* Microchip ID */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Microchip ID:</label>
        <p className="text-md text-gray-500 mb-4">{report.microchipId || "Unknown"}</p>
      </div>

      {/* Altered Status */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Spayed/Neutered:</label>
        <p className="text-md text-gray-500 mb-4">
          {report.isAltered === true ? "Yes" : report.isAltered === false ? "No" : "Unknown"}
        </p>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-2">Colors:</label>
        <div className="space-y-1">
          <p className="text-md text-gray-500">{report.color1}</p>
          {report.color2 && <p className="text-md text-gray-500">{report.color2}</p>}
          {report.color3 && <p className="text-md text-gray-500">{report.color3}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-lg font-medium text-gray-900 mb-4">Location:</label>
        <LocationDisplay
          area={report.area}
          state={report.state}
          country={report.country}
          intersection={report.intersection}
        />
        <div className="mt-1">
          <Map
            initialLocation={createMapLocation(report)}
            readOnly={true}
            onLocationSelect={() => {}}
            initialZoom={MAP_ZOOM_LEVELS.VIEW}
          />
        </div>
      </div>
      <DateDisplay createdAt={report.createdAt} updatedAt={report.updatedAt} />
    </div>
  );
};

export default ViewReportForm;
