import React from 'react';
import { useGetTipsQuery } from '../../../store/features/tips/tipsApi.js';
import DateDisplay from '../../listings/components/common/DateDisplay.jsx';

const TipList = ({ reportId }) => {
  const { data: tipsData, isLoading, error } = useGetTipsQuery(reportId);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips</h3>
        <div className="text-red-600 text-center py-4">
          Failed to load tips. Please try again.
        </div>
      </div>
    );
  }

  const tips = tipsData?.tips || [];

  // Don't render anything if there are no tips
  if (tips.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Tips ({tips.length})
      </h3>

      <div className="space-y-4">
        {tips.map((tip) => (
          <div key={tip.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {tip.user.display_name || 'Anonymous'}
                  </p>
                  <DateDisplay createdAt={tip.created_at} />
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-3">{tip.message}</p>

            {(tip.area || tip.state || tip.country) && (
              <div className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Location:</span>{' '}
                {[tip.area, tip.state, tip.country].filter(Boolean).join(', ')}
              </div>
            )}

            {tip.latitude && tip.longitude && (
              <div className="text-sm text-gray-500">
                <span className="font-medium">Coordinates:</span>{' '}
                {tip.latitude}, {tip.longitude}
              </div>
            )}

            {tip.external_links && tip.external_links.length > 0 && (
              <div className="mt-3">
                <span className="text-sm font-medium text-gray-700">Links:</span>
                <div className="mt-1 space-y-1">
                  {tip.external_links.map((link, index) => (
                    <div key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm underline break-all"
                      >
                        {link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TipList;
