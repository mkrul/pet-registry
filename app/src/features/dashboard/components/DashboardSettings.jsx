import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useUpdateSettingsMutation, useDeleteAccountMutation } from '../../../store/features/auth/authApiSlice';
import ConfirmationModal from '../../../shared/components/common/ConfirmationModal';

const DashboardSettings = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [emailMessageNotifications, setEmailMessageNotifications] = useState(true);
  const [emailNewConversationNotifications, setEmailNewConversationNotifications] = useState(true);
  const [allowContact, setAllowContact] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (user?.settings) {
      setEmailNotifications(user.settings.emailNotifications ?? true);
      setEmailMessageNotifications(user.settings.emailMessageNotifications ?? true);
      setEmailNewConversationNotifications(user.settings.emailNewConversationNotifications ?? true);
      setAllowContact(user.settings.allowContact ?? true);
    }
  }, [user]);

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        email_notifications: emailNotifications,
        email_message_notifications: emailMessageNotifications,
        email_new_conversation_notifications: emailNewConversationNotifications,
        allow_contact: allowContact,
        dark_mode: isDarkMode
      }).unwrap();
    } catch (err) {
    }
  };

  const handleResetToDefaults = async () => {
    try {
      setEmailNotifications(true);
      setEmailMessageNotifications(true);
      setEmailNewConversationNotifications(true);
      setAllowContact(true);
      await updateSettings({
        email_notifications: true,
        email_message_notifications: true,
        email_new_conversation_notifications: true,
        allow_contact: true,
        dark_mode: isDarkMode
      }).unwrap();
    } catch (err) {
    }
  };

  const handleOpenDelete = () => setIsDeleteOpen(true);
  const handleCloseDelete = () => setIsDeleteOpen(false);
  const handleConfirmDelete = async () => {
    try {
      await deleteAccount().unwrap();
    } catch (err) {
    } finally {
      setIsDeleteOpen(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h2>

      <div className="max-w-2xl space-y-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tips</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email notification when someone posts a tip on your report</p>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Messages</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email notification when someone sends you a message</p>
              </div>
              <button
                onClick={() => setEmailMessageNotifications(!emailMessageNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailMessageNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailMessageNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conversations</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email notification when someone starts a new conversation with you</p>
              </div>
              <button
                onClick={() => setEmailNewConversationNotifications(!emailNewConversationNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNewConversationNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNewConversationNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Matches</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email notification someone reports a lost pet that looks like yours</p>
              </div>
              <button
                onClick={() => setEmailMessageNotifications(!emailMessageNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailMessageNotifications ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailMessageNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Privacy</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Direct Messages</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Let other users contact you directly about your reports
                </p>
              </div>
              <button
                onClick={() => setAllowContact(!allowContact)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  allowContact ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    allowContact ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme across the application</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div> */}

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Account Actions</h3>
          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={isLoading}
              className="w-48 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              onClick={handleResetToDefaults}
              disabled={isLoading}
              className="w-48 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:bg-gray-300 dark:disabled:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleOpenDelete}
              className="w-48 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              aria-label="Delete my account"
              data-testid="delete-account-button"
            >
              Delete my account
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isDeleteOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete your account?"
        message={
          "This action is permanent. Your account, pets, and reports will be deleted."
        }
        confirmText="Yes, delete my account"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardSettings;
