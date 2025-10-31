import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks.js';
import { useGetTipsQuery } from '../../../store/features/tips/tipsApi.js';
import TipForm from './TipForm.jsx';
import TipList from './TipList.jsx';
import { useCreateConversationForReportMutation } from '../../../store/features/messages/messagesApi.js';
import ConversationForm from '../../messages/components/ConversationForm.jsx';

const TipsSection = ({ reportId, report }) => {
  const [showTipForm, setShowTipForm] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [conversationId, setConversationId] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStarting }] = useCreateConversationForReportMutation();
  const { data: tipsData, isLoading } = useGetTipsQuery({
    reportId,
    page: currentPage,
    perPage: 5
  });

  const isOwner = Boolean(
    user?.id &&
    report?.userId &&
    String(user.id) === String(report.userId)
  );
  const isArchived = report?.status === 'archived';

  console.log('[TipsSection] isOwner:', isOwner);

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
      const result = await startConversation(reportId).unwrap();
      setConversationId(result.id);
      setMessageSent(false);
    } catch (e) {
    }
  };

  const handleConversationCancel = () => {
    setConversationId(null);
    setMessageSent(false);
  };

  const handleMessageSent = () => {
    setMessageSent(true);
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

      {user && !isArchived && !isOwner && (
        showTipForm ? (
          <TipForm
            reportId={reportId}
            onSuccess={handleTipSuccess}
            onCancel={() => setShowTipForm(false)}
          />
        ) : conversationId ? (
          messageSent ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Message sent!</h3>
                <p className="text-gray-600 mb-4">
                  Your message has been sent to the report owner.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setConversationId(null);
                      setMessageSent(false);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/messages/${conversationId}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    View Conversation
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <ConversationForm
              conversationId={conversationId}
              onSend={handleMessageSent}
              onCancel={handleConversationCancel}
              placeholder="Type your message to the report owner..."
            />
          )
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
