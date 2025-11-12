import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../store/hooks.js';
import { useGetLastLocationQuery } from '../../../store/features/tips/tipsApi.js';
import { useCreateConversationForReportMutation } from '../../../store/features/messages/messagesApi.js';
import { addNotification } from '../../../store/features/notifications/notificationsSlice.js';
import TipForm from './TipForm.jsx';

const TipsSection = ({ reportId, report }) => {
  const [showTipForm, setShowTipForm] = useState(false);
  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationForReportMutation();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isOwner = Boolean(
    user?.id &&
    report?.userId &&
    String(user.id) === String(report.userId)
  );
  const isArchived = report?.status === 'archived';
  const canShowTipForm = user && !isArchived && !isOwner;
  const ownerAllowsContact = report?.ownerAllowContact ?? true;

  useGetLastLocationQuery(reportId, {
    skip: !canShowTipForm
  });

  const handleTipSuccess = () => {
    setShowTipForm(false);
  };

  const handleStartConversation = async () => {
    try {
      const result = await createConversation(reportId).unwrap();
      dispatch(addNotification({
        type: 'SUCCESS',
        message: 'Conversation started'
      }));
      navigate(`/dashboard/messages/${result.id}`);
    } catch (error) {
      dispatch(addNotification({
        type: 'ERROR',
        message: error.data?.error || 'Failed to start conversation'
      }));
    }
  };

  return (
    <div className="space-y-6">
      {user && !isArchived && !isOwner && (
        showTipForm ? (
          <TipForm
            reportId={reportId}
            onSuccess={handleTipSuccess}
            onCancel={() => setShowTipForm(false)}
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Have Information?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you've seen this pet or have any information that might help, please share it.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowTipForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Submit a Tip
                </button>
                {ownerAllowsContact && (
                  <button
                    onClick={handleStartConversation}
                    disabled={isCreatingConversation}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-md text-sm font-medium transition-colors"
                    aria-label="Send a message to the report owner"
                  >
                    {isCreatingConversation ? 'Starting...' : 'Start a Conversation'}
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
