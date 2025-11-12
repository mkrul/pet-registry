import React, { useState, useCallback, useEffect } from 'react';
import { useCreateTipMutation, useGetLastLocationQuery } from '../../../store/features/tips/tipsApi.js';
import { useAppDispatch } from '../../../store/hooks.js';
import { addNotification } from '../../../store/features/notifications/notificationsSlice.js';
import { TipLocationSelect } from './TipLocationSelect.jsx';
import { createMapLocation } from '../../../shared/utils/mapUtils.js';

const TIP_ZOOM_LEVEL = 15;

const TipForm = ({ reportId, onSuccess, onCancel }) => {
  const [createTip, { isLoading }] = useCreateTipMutation();
  const { data: lastLocationData, isLoading: isLastLocationLoading, isFetching: isLastLocationFetching } = useGetLastLocationQuery(reportId);
  const dispatch = useAppDispatch();
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

  const [formData, setFormData] = useState({
    message: '',
    area: '',
    state: '',
    country: '',
    latitude: '',
    longitude: '',
    intersection: '',
    external_links: ['', '', '']
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleExternalLinkChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      external_links: prev.external_links.map((link, i) => i === index ? value : link)
    }));
  };

  const handleLocationSelect = useCallback((location) => {
    setFormData(prev => ({
      ...prev,
      area: location.area || '',
      state: location.state || '',
      country: location.country || '',
      latitude: location.latitude || '',
      longitude: location.longitude || '',
      intersection: location.intersection || ''
    }));
  }, []);

  const handleLocationProcessingStateChange = useCallback((isProcessing) => {
    setIsProcessingLocation(isProcessing);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      dispatch(addNotification({
        type: 'ERROR',
        message: 'Message is required'
      }));
      return;
    }

    const tipPayload = {
      reportId,
      message: formData.message,
      area: formData.area,
      state: formData.state,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
      intersection: formData.intersection,
      external_links: formData.external_links.filter(link => link.trim() !== '')
    };

    try {
      const result = await createTip(tipPayload).unwrap();

      dispatch(addNotification({
        type: 'SUCCESS',
        message: result.message
      }));

      setFormData({
        message: '',
        area: '',
        state: '',
        country: '',
        latitude: '',
        longitude: '',
        intersection: '',
        external_links: ['', '', '']
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      dispatch(addNotification({
        type: 'ERROR',
        message: error.data?.message || 'Failed to submit tip'
      }));
    }
  };

  const isFormDisabled = isLoading || isProcessingLocation;

  const getInitialLocation = () => {
    if (formData.latitude && formData.longitude) {
      return createMapLocation({
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        area: formData.area,
        state: formData.state,
        country: formData.country,
        intersection: formData.intersection
      });
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 uppercase tracking-wide mb-4">Submit a Tip</h4>

      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Privacy Notice:</strong> Tips are publicly viewable by all users. This includes the message, location information, and any links you provide.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Message */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              placeholder="Share any information about this lost pet. Describe what you saw, when you saw it, and any other details that might help."
              required
              disabled={isFormDisabled}
            />
              <div className="mt-8">
              <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                External Links (optional):
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Add up to 3 links to social media posts, news articles, or other relevant information.
              </p>
              {formData.external_links.map((link, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleExternalLinkChange(index, e.target.value)}
                    placeholder={`Link ${index + 1} (e.g., https://www.facebook.com/...)`}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                    disabled={isFormDisabled}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Location */}
          <div>
            {(() => {
              const initialLocation = getInitialLocation();
              return (
                <TipLocationSelect
                  onLocationSelect={handleLocationSelect}
                  initialLocation={initialLocation}
                  isLoading={isFormDisabled}
                  isLocationDataLoading={isLastLocationLoading}
                  required={false}
                  onProcessingStateChange={handleLocationProcessingStateChange}
                  showTip={false}
                  labelStyle="microchip"
                  initialZoom={TIP_ZOOM_LEVEL}
                  showInitialMarker={false}
                  placeholderText=""
                  mapCenterLocation={lastLocationData}
                />
              );
            })()}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isFormDisabled}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isFormDisabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isLoading ? 'Submitting...' : 'Submit Tip'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TipForm;
