import React, { useState, useCallback } from 'react';
import { useCreateConversationForReportWithMessageMutation } from '../../../store/features/messages/messagesApi.js';
import { useGetLastLocationQuery } from '../../../store/features/tips/tipsApi.js';
import { useAppDispatch } from '../../../store/hooks.js';
import { addNotification } from '../../../store/features/notifications/notificationsSlice.js';
import { TipLocationSelect } from '../../tips/components/TipLocationSelect.jsx';
import { createMapLocation } from '../../../shared/utils/mapUtils.js';

const TIP_ZOOM_LEVEL = 15;

const ConversationStartForm = ({ reportId, onSuccess, onCancel }) => {
  const [createConversation, { isLoading }] = useCreateConversationForReportWithMessageMutation();
  const { data: lastLocationData, isLoading: isLastLocationLoading } = useGetLastLocationQuery(reportId);
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

    if (!formData.latitude || !formData.longitude) {
      dispatch(addNotification({
        type: 'ERROR',
        message: 'Please select a location on the map or type the address '
      }));
      return;
    }

    const payload = {
      reportId,
      body: formData.message,
      area: formData.area,
      state: formData.state,
      country: formData.country,
      latitude: formData.latitude,
      longitude: formData.longitude,
      intersection: formData.intersection,
      external_links: formData.external_links.filter(link => link.trim() !== '')
    };

    try {
      const result = await createConversation(payload).unwrap();

      dispatch(addNotification({
        type: 'SUCCESS',
        message: 'Message sent successfully'
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
        onSuccess(result.id);
      }
    } catch (error) {
      console.error('ConversationStartForm: Error sending message:', error);
      dispatch(addNotification({
        type: 'ERROR',
        message: error.data?.message || 'Failed to send message'
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

    if (lastLocationData?.latitude && lastLocationData?.longitude) {
      return createMapLocation({
        latitude: parseFloat(lastLocationData.latitude),
        longitude: parseFloat(lastLocationData.longitude),
        area: lastLocationData.area,
        state: lastLocationData.state,
        country: lastLocationData.country,
        intersection: lastLocationData.intersection
      });
    }

    return null;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Start a Conversation</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-900">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share any information about this lost pet. Describe what you saw, when you saw it, and any other details that might help."
              required
              disabled={isFormDisabled}
            />
              <div className="mt-8">
              <label className="text-lg font-medium text-gray-900">
                External Links (optional):
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Add up to 3 links to social media posts, news articles, or other relevant information.
              </p>
              {formData.external_links.map((link, index) => (
                <div key={index} className="mb-3">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => handleExternalLinkChange(index, e.target.value)}
                    placeholder={`Link ${index + 1} (e.g., https://www.facebook.com/...)`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isFormDisabled}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            {(() => {
              const initialLocation = getInitialLocation();
              return (
                <TipLocationSelect
                  onLocationSelect={handleLocationSelect}
                  initialLocation={initialLocation}
                  isLoading={isFormDisabled}
                  isLocationDataLoading={isLastLocationLoading}
                  required={true}
                  onProcessingStateChange={handleLocationProcessingStateChange}
                  showTip={false}
                  labelStyle="microchip"
                  initialZoom={TIP_ZOOM_LEVEL}
                  showInitialMarker={false}
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
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isFormDisabled}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationStartForm;

