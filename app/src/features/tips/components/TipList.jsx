import React from 'react';
import DateDisplay from '../../listings/components/common/DateDisplay.jsx';
import Pagination from '../../../shared/components/common/Pagination.jsx';

const TipList = ({ reportId, tipsData, pagination, onPageChange }) => {
  const tips = tipsData?.tips || [];

  if (tips.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tips have been submitted yet.
      </div>
    );
  }

  return (
    <div>
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
      {pagination && pagination.pages > 1 && onPageChange && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default TipList;
