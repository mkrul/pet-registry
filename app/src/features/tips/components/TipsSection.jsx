import React, { useState } from 'react';
import { useAppSelector } from '../../../store/hooks.js';
import { useGetTipsQuery } from '../../../store/features/tips/tipsApi.js';
import TipForm from './TipForm.jsx';
import TipList from './TipList.jsx';

const TipsSection = ({ reportId }) => {
  const [showTipForm, setShowTipForm] = useState(false);
  const user = useAppSelector(state => state.auth.user);
  const { data: tipsData, isLoading } = useGetTipsQuery(reportId);

  const handleTipSuccess = () => {
    setShowTipForm(false);
  };

  // Don't show the section if there are no tips and user is not authenticated
  if (!isLoading && (!tipsData?.tips || tipsData.tips.length === 0) && !user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <TipList reportId={reportId} />

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
