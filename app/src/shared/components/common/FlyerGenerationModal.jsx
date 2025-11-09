import React, { useEffect, useState } from 'react';
import { formatPhoneNumber, isValidPhoneNumber } from '../../utils/phoneUtils';

const FlyerGenerationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  initialDescription = ''
}) => {
  const [rewardAmount, setRewardAmount] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

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
      setDescription('');
      setPhoneNumber('');
    } else {
      setDescription(initialDescription);
    }
  }, [isOpen, initialDescription]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // Allow only digits, spaces, parentheses, hyphens, and plus sign
    const cleaned = value.replace(/[^\d\s\(\)\-\+]/g, '');
    setPhoneNumber(cleaned);
  };

  const handleConfirm = () => {
    onConfirm({ rewardAmount, description, phoneNumber });
  };

  return (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Generate Lost Pet Flyer
        </h3>

        <div className="space-y-4 mb-6">
          <div>
              <label htmlFor="reward-amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reward Amount (Optional)
            </label>
            <input
              id="reward-amount"
              type="text"
              value={rewardAmount}
              onChange={(e) => setRewardAmount(e.target.value)}
              placeholder="e.g., $500"
              maxLength={10}
              disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>

          <div>
              <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number (Optional)
            </label>
            <input
              id="phone-number"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="(XXX) XXX-XXXX"
              disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>

          <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Edit the description for the flyer..."
              rows={4}
              disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100 dark:disabled:bg-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Please wait...
              </>
            ) : (
              'Generate Flyer'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlyerGenerationModal;

