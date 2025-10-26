import React, { useState } from 'react';
import { useAppSelector } from '../../../store/hooks.js';
import { useGetTipsQuery } from '../../../store/features/tips/tipsApi.js';
import TipForm from './TipForm.jsx';
import TipList from './TipList.jsx';

const TipsSection = ({ reportId, report }) => {
  const [showTipForm, setShowTipForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useAppSelector(state => state.auth.user);
  const { data: tipsData, isLoading } = useGetTipsQuery({
    reportId,
    page: currentPage,
    perPage: 5
  });

  const isOwner = user && report && user.id === report.userId;

  const handleTipSuccess = () => {
    setShowTipForm(false);
    setCurrentPage(1);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tips = tipsData?.tips || [];

  return (
    <div className="space-y-6">
      {isOwner && (
        <div className="bg-white rounded-lg border border-gray-200">
          <button
            onClick={toggleCollapse}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Tips ({tips.length})</h3>
            <svg
              className={`w-5 h-5 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {!isCollapsed && (
            <div className="px-6 pb-6">
              <TipList
                reportId={reportId}
                tipsData={tipsData}
                pagination={tipsData?.pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      )}

      {user && (
        showTipForm ? (
          <TipForm
            reportId={reportId}
            onSuccess={handleTipSuccess}
          />
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Have Information?</h3>
              <p className="text-gray-600 mb-4">
                If you've seen this pet or have any information that might help, please share it.
              </p>
              <button
                onClick={() => setShowTipForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Submit a Tip
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TipsSection;
