import React, { useState } from 'react';
import { useGetUserEventsQuery } from '../../../store/features/events/eventsApi.js';
import Pagination from '../../../shared/components/common/Pagination.jsx';
import LoadingState from '../../../shared/components/common/LoadingState.jsx';
import formatDate from '../../../shared/formatDate.js';

const DashboardOverview = ({ onNavigate }) => {
  const [page, setPage] = useState(1);
  const { data: eventsData, isLoading, error } = useGetUserEventsQuery({ page });

  const formatEventCategory = (category) => {
    switch (category) {
      case 'report_tip':
        return 'Submitted a tip';
      case 'report_created':
        return 'Created a report';
      case 'report_updated':
        return 'Updated a report';
      case 'report_archived':
        return 'Archived a report';
      case 'report_deleted':
        return 'Deleted a report';
      case 'pet_created':
        return 'Registered a pet';
      case 'pet_updated':
        return 'Updated a pet';
      case 'pet_archived':
        return 'Archived a pet';
      case 'conversation_started':
        return 'Started a conversation';
      default:
        return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getEventIcon = (category) => {
    switch (category) {
      case 'report_tip':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        );
      case 'report_created':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'report_updated':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'report_archived':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
          </svg>
        );
      case 'report_deleted':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'pet_created':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'pet_updated':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'pet_archived':
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'conversation_started':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getEventableDescription = (eventableSummary) => {
    if (!eventableSummary) return '';

    switch (eventableSummary.type) {
      case 'Report':
        return `for ${eventableSummary.title} (${eventableSummary.status})`;
      case 'Pet':
        return `for ${eventableSummary.name} (${eventableSummary.species})`;
      case 'Conversation':
        return `with user #${eventableSummary.recipientId}`;
      default:
        return `for ${eventableSummary.type} #${eventableSummary.id}`;
    }
  };

  const getEventableUrl = (eventableSummary) => {
    if (!eventableSummary) return null;

    switch (eventableSummary.type) {
      case 'Report':
        return `/reports/${eventableSummary.id}?query=&page=1`;
      case 'Pet':
        return `/dashboard/pets?petId=${eventableSummary.id}`;
      case 'Conversation':
        return `/dashboard/messages/${eventableSummary.id}`;
      default:
        return null;
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-red-50 rounded-lg p-6 text-center">
          <h3 className="text-sm font-medium text-red-900">Error loading activity</h3>
          <p className="mt-1 text-sm text-red-600">Unable to load recent activity. Please try again later.</p>
        </div>
      </div>
    );
  }

  const events = eventsData?.data || [];
  const pagination = eventsData?.pagination;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>

      {events.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first report or registering a pet.</p>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {getEventIcon(event.category)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {formatEventCategory(event.category)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(event.createdAt)}
                      </p>
                    </div>
                    {event.eventableSummary && (
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">
                          {getEventableDescription(event.eventableSummary)}
                          {getEventableUrl(event.eventableSummary) && (
                          <a
                            href={getEventableUrl(event.eventableSummary)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center text-xs text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
