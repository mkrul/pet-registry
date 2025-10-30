import React, { useState } from 'react';
import { useGetConversationsQuery, useGetConversationQuery, useSendMessageMutation } from '../../../store/features/messages/messagesApi';

const ConversationListItem = ({ conversation, isActive, onSelect }) => {
  const unread = conversation.unread_count || conversation.unreadCount;
  const name = conversation.other_user?.display_name || conversation.other_user?.displayName;
  const lastBody = conversation.last_message?.body || '';
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 border-b ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}
      aria-label={`Open conversation with ${name}`}
    >
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-900 dark:text-gray-100">{name}</div>
        {unread > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {unread}
          </span>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{lastBody}</div>
    </button>
  );
};

const MessageComposer = ({ onSend, isSending }) => {
  const [value, setValue] = useState('');
  const submit = async () => {
    if (!value.trim()) return;
    await onSend(value);
    setValue('');
  };
  return (
    <div className="p-3 border-t bg-white dark:bg-gray-900">
      <label htmlFor="message" className="sr-only">Message</label>
      <textarea
        id="message"
        rows="2"
        className="w-full border rounded-md p-2 text-sm dark:bg-gray-800 dark:text-gray-100"
        placeholder="Type a message"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <div className="flex justify-end mt-2">
        <button onClick={submit} disabled={isSending} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm">{isSending ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  );
};

const ConversationThread = ({ conversationId }) => {
  const { data, isLoading } = useGetConversationQuery({ id: conversationId, page: 1 }, { skip: !conversationId });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();

  if (!conversationId) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Select a conversation</div>;
  }
  if (isLoading) return <div className="p-4">Loading...</div>;

  const onSend = async (body) => {
    await sendMessage({ conversationId, body }).unwrap();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-gray-900">
        {data?.messages?.map(m => (
          <div key={m.id} className="max-w-xl">
            <div className="text-xs text-gray-500 dark:text-gray-400">{m.user?.display_name || m.user?.displayName}</div>
            <div className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md px-3 py-2 text-sm whitespace-pre-wrap">{m.body}</div>
          </div>
        ))}
      </div>
      <MessageComposer onSend={onSend} isSending={isSending} />
    </div>
  );
};

const MessagesPage = () => {
  const { data: conversations } = useGetConversationsQuery(1);
  const [activeId, setActiveId] = useState(null);

  const hasConversations = Array.isArray(conversations) && conversations.length > 0;

  return (
    <div className="grid grid-cols-12 gap-4 h-[70vh]">
      <div className="col-span-4 border rounded-lg overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 font-semibold">Conversations</div>
        <div className="divide-y overflow-y-auto h-full">
          {hasConversations ? (
            conversations.map(c => (
              <ConversationListItem key={c.id} conversation={c} isActive={activeId === c.id} onSelect={() => setActiveId(c.id)} />
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">No conversations yet.</div>
          )}
        </div>
      </div>
      <div className="col-span-8 border rounded-lg overflow-hidden">
        {hasConversations ? (
          <ConversationThread conversationId={activeId} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            You have no messages yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;


