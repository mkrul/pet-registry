import React, { useEffect, useState } from 'react';

const FlyerGenerationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const [rewardAmount, setRewardAmount] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, isLoading]);

  useEffect(() => {
    if (!isOpen) {
      setRewardAmount('');
      setAdditionalNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm({ rewardAmount, additionalNotes });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 id="modal-title" className="text-lg font-semibold text-gray-900 mb-4">
          Generate Lost Pet Flyer
        </h3>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="reward-amount" className="block text-sm font-medium text-gray-700 mb-2">
              Reward Amount (Optional)
            </label>
            <input
              id="reward-amount"
              type="text"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              placeholder="e.g., $500"
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label htmlFor="additional-notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="additional-notes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g., Friendly, answers to name, has a distinctive bark..."
              rows={4}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Flyer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlyerGenerationModal;

