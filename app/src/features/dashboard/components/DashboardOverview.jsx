import React from 'react';

const DashboardOverview = ({ onNavigate }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first report or registering a pet.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;
