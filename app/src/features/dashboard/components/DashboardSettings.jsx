import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useUpdateSettingsMutation, useDeleteAccountMutation } from '../../../store/features/auth/authApiSlice';
import ConfirmationModal from '../../../shared/components/common/ConfirmationModal';

const DEFAULT_SETTINGS = {
  sendEmailForTip: true,
  sendEmailForMessage: true,
  sendEmailForConversation: true,
  sendEmailForMatch: true,
  allowContact: false,
  darkMode: false,
};

const DashboardSettings = () => {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation();
  const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

  const [sendEmailForTip, setSendEmailForTip] = useState(true);
  const [sendEmailForMessage, setSendEmailForMessage] = useState(true);
  const [sendEmailForConversation, setSendEmailForConversation] = useState(true);
  const [sendEmailForMatch, setSendEmailForMatch] = useState(true);
  const [allowContact, setAllowContact] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [initialSettings, setInitialSettings] = useState({
    sendEmailForTip: true,
    sendEmailForMessage: true,
    sendEmailForConversation: true,
    sendEmailForMatch: true,
    allowContact: false,
    darkMode: false,
  });

  useEffect(() => {
    if (!user?.settings) {
      return;
    }

    const nextSettings = {
      sendEmailForTip: user.settings.sendEmailForTip ?? true,
      sendEmailForMessage: user.settings.sendEmailForMessage ?? true,
      sendEmailForConversation: user.settings.sendEmailForConversation ?? true,
      sendEmailForMatch: user.settings.sendEmailForMatch ?? true,
      allowContact: user.settings.allowContact ?? false,
      darkMode: user.settings.darkMode ?? false,
    };

    setSendEmailForTip(nextSettings.sendEmailForTip);
    setSendEmailForMessage(nextSettings.sendEmailForMessage);
    setSendEmailForConversation(nextSettings.sendEmailForConversation);
    setSendEmailForMatch(nextSettings.sendEmailForMatch);
    setAllowContact(nextSettings.allowContact);
    setInitialSettings(nextSettings);
  }, [user]);

  useEffect(() => {
    if (typeof user?.settings?.darkMode !== 'boolean') {
      return;
    }

    setDarkMode(user.settings.darkMode);
  }, [user?.settings?.darkMode, setDarkMode]);

  const hasChanges =
    sendEmailForTip !== initialSettings.sendEmailForTip ||
    sendEmailForMessage !== initialSettings.sendEmailForMessage ||
    sendEmailForConversation !== initialSettings.sendEmailForConversation ||
    sendEmailForMatch !== initialSettings.sendEmailForMatch ||
    allowContact !== initialSettings.allowContact ||
    isDarkMode !== initialSettings.darkMode;

  const handleSaveSettings = async () => {
    try {
      await updateSettings({
        send_email_for_tip: sendEmailForTip,
        send_email_for_message: sendEmailForMessage,
        send_email_for_conversation: sendEmailForConversation,
        send_email_for_match: sendEmailForMatch,
        allow_contact: allowContact,
        dark_mode: isDarkMode
      }).unwrap();
    } catch (err) {
    }
  };

  const handleResetToDefaults = () => {
    setIsResetOpen(true);
  };

  const handleCloseReset = () => {
    setIsResetOpen(false);
  };

  const handleConfirmReset = async () => {
    try {
      const defaultSettings = { ...DEFAULT_SETTINGS };

      setSendEmailForTip(defaultSettings.sendEmailForTip);
      setSendEmailForMessage(defaultSettings.sendEmailForMessage);
      setSendEmailForConversation(defaultSettings.sendEmailForConversation);
      setSendEmailForMatch(defaultSettings.sendEmailForMatch);
      setAllowContact(defaultSettings.allowContact);
      setInitialSettings(defaultSettings);
      setDarkMode(defaultSettings.darkMode);

      await updateSettings({
        send_email_for_tip: defaultSettings.sendEmailForTip,
        send_email_for_message: defaultSettings.sendEmailForMessage,
        send_email_for_conversation: defaultSettings.sendEmailForConversation,
        send_email_for_match: defaultSettings.sendEmailForMatch,
        allow_contact: defaultSettings.allowContact,
        dark_mode: defaultSettings.darkMode
      }).unwrap();
    } catch (err) {
    } finally {
      setIsResetOpen(false);
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
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Settings</h2>

      <div className="w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tips</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email notification when someone posts a tip on your report</p>
              </div>
              <button
                onClick={() => setSendEmailForTip(!sendEmailForTip)}
                className={`ml-6 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  sendEmailForTip ? 'bg-blue-600' : isDarkMode ? 'dark:bg-gray-600 bg-gray-200' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sendEmailForTip ? 'translate-x-6' : 'translate-x-1'
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
                onClick={() => setSendEmailForMessage(!sendEmailForMessage)}
                className={`ml-6 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  sendEmailForMessage ? 'bg-blue-600' : isDarkMode ? 'dark:bg-gray-600 bg-gray-200' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sendEmailForMessage ? 'translate-x-6' : 'translate-x-1'
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
                onClick={() => setSendEmailForConversation(!sendEmailForConversation)}
                className={`ml-6 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  sendEmailForConversation ? 'bg-blue-600' : isDarkMode ? 'dark:bg-gray-600 bg-gray-200' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sendEmailForConversation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Matches
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">Powered by AI</span>
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email notification when someone reports a lost pet that looks like yours</p>
              </div>
              <button
                onClick={() => setSendEmailForMatch(!sendEmailForMatch)}
                className={`ml-6 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  sendEmailForMatch ? 'bg-blue-600' : isDarkMode ? 'dark:bg-gray-600 bg-gray-200' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    sendEmailForMatch ? 'translate-x-6' : 'translate-x-1'
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
                className={`ml-6 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  allowContact ? 'bg-blue-600' : isDarkMode ? 'dark:bg-gray-600 bg-gray-200' : 'bg-gray-200'
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

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Dark Mode</label>
                <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme across the application</p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`ml-6 relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
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
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Account Actions</h3>
          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
                disabled={isLoading || !hasChanges}
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
      <ConfirmationModal
        isOpen={isResetOpen}
        onClose={handleCloseReset}
        onConfirm={handleConfirmReset}
        title="Reset settings to default?"
        message="This will overwrite your current preferences with the default settings."
        confirmText="Confirm"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardSettings;
