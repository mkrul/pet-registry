import React, { useState } from 'react';
import { useSendMessageMutation } from '../../../store/features/messages/messagesApi.js';

const ConversationForm = ({ conversationId, onSend, onCancel, placeholder = "Type your message..." }) => {
  const [value, setValue] = useState('');
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!value.trim() || !conversationId) return;

    try {
      await sendMessage({ conversationId, body: value }).unwrap();
      setValue('');
      if (onSend) {
        onSend();
      }
    } catch (error) {
    }
  };

  const handleCancel = () => {
    setValue('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit}>
        <label htmlFor={`conversation-message-${conversationId}`} className="block text-sm font-medium text-gray-900 mb-2">
          Send a message
        </label>
        <textarea
          id={`conversation-message-${conversationId}`}
          rows="4"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          required
        />
        <div className="flex justify-end gap-3 mt-3">
          {onCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSending || !value.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-md transition-colors"
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationForm;

