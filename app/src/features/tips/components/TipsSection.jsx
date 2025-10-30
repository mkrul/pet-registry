import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { useGetTipsQuery } from '../../../store/features/tips/tipsApi.js';
import TipForm from './TipForm.jsx';
import TipList from './TipList.jsx';
import { useCreateConversationForReportMutation } from '../../../store/features/messages/messagesApi.js';

const TipsSection = ({ reportId, report }) => {
  const [showTipForm, setShowTipForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStarting }] = useCreateConversationForReportMutation();
  const { data: tipsData, isLoading } = useGetTipsQuery({
    reportId,
    page: currentPage,
    perPage: 5
  });

  const isOwner = user && report && user.id === report.userId;
  const isArchived = report && report.status === 'archived';

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
  const totalTipsCount = tipsData?.pagination?.count || tips.length;

  const handleMessageOwner = async () => {
    try {
      await startConversation(reportId).unwrap();
      navigate('/dashboard/messages');
    } catch (e) {
    }
  };

  return (
    <div className="space-y-6">
      {isOwner && (
        <div className="bg-white rounded-lg border border-gray-200">
          <button
            onClick={toggleCollapse}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Tips ({totalTipsCount})</h3>
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

      {user && !isArchived && (
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
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowTipForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit a Tip
                </button>
                {!isOwner && (
                  <button
                    onClick={handleMessageOwner}
                    disabled={isStarting}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    aria-label="Send a message to the report owner"
                  >
                    {isStarting ? 'Starting…' : 'Start a Conversation'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TipsSection;
