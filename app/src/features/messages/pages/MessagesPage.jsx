import React, { useState, useEffect, useRef } from 'react';
import { useGetConversationsQuery, useGetConversationQuery, useSendMessageMutation } from '../../../store/features/messages/messagesApi';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { messagesApi } from '../../../store/features/messages/messagesApi';
import { useParams, useNavigate } from 'react-router-dom';
import MessageText from '../components/MessageText.jsx';

const ConversationListItem = ({ conversation, isActive, onSelect }) => {
  const unread = conversation.unread_count || conversation.unreadCount;
  const name = conversation.other_user?.display_name || conversation.other_user?.displayName;
  const lastOtherBody = conversation.last_message_from_other?.body || conversation.lastMessageFromOther?.body;
  const lastBody = lastOtherBody || conversation.last_message?.body || '';
  const messageable = conversation.messageable || {};
  const reportTitle = messageable.title;
  const thumb = messageable.image?.thumbnail_url || messageable.image?.thumbnailUrl || messageable.image?.variant_url || messageable.image?.variantUrl;
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 border-b ${isActive ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}`}
      aria-label={`Open conversation with ${name}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {thumb && (
            <img src={thumb} alt={reportTitle || 'Report image'} className="w-8 h-8 rounded object-cover flex-shrink-0" />
          )}
          <div className="min-w-0">
            <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{`re: ${reportTitle}` || name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{lastBody}</div>
          </div>
        </div>
        {unread > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {unread}
          </span>
        )}
      </div>
    </button>
  );
};

const MessageComposer = ({ onSend, isSending }) => {
  const [value, setValue] = useState('');
  const submit = async () => {
    if (!value.trim() || isSending) return;
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
        placeholder="Type a message (Press Enter to send, Shift+Enter for new line)"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
      />
      <div className="flex justify-end mt-2">
        <button onClick={submit} disabled={isSending || !value.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md text-sm">{isSending ? 'Sending...' : 'Send'}</button>
      </div>
    </div>
  );
};

const ConversationThread = ({ conversationId, onBack }) => {
  const { data, isLoading } = useGetConversationQuery({ id: conversationId, page: 1 }, { skip: !conversationId });
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const headerRef = useRef(null);

  useEffect(() => {
    if (conversationId && data) {
      // Opening a conversation marks messages read on the server; refresh unread counters and list
      dispatch(messagesApi.util.invalidateTags(['UnreadCount', 'Conversations']));
      // Move focus to header for a11y on open (useful on mobile)
      headerRef.current?.focus?.();
    }
  }, [conversationId, data, dispatch]);

  if (!conversationId) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Select a conversation</div>;
  }
  if (isLoading) return <div className="p-4">Loading...</div>;

  const onSend = async (body) => {
    await sendMessage({ conversationId, body }).unwrap();
  };

  const conversation = data?.conversation || {};
  const messageable = conversation.messageable || {};
  const headerTitle = messageable.title;
  const headerImage = messageable.image?.variant_url || messageable.image?.variantUrl || messageable.image?.thumbnail_url || messageable.image?.thumbnailUrl;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b bg-gray-50 dark:bg-gray-800">
        <button
          onClick={onBack}
          className="md:hidden inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          aria-label="Back to conversations"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        {headerImage && (
          <img src={headerImage} alt={headerTitle || 'Report image'} className="w-10 h-10 rounded object-cover" />
        )}
        <div ref={headerRef} tabIndex={-1} className="font-semibold text-gray-900 dark:text-gray-100">{`re: ${headerTitle}` || 'Conversation'}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-gray-900">
        {data?.messages?.map(m => {
          const messageUserId = m.user?.id ?? m.userId ?? m.user_id;
          const otherUserId = data?.conversation?.other_user?.id ?? data?.conversation?.otherUser?.id;
          const currentUserId = user?.id;
          const mineViaAuth = currentUserId != null && messageUserId != null && String(messageUserId) === String(currentUserId);
          const mineViaOther = otherUserId != null && messageUserId != null && String(messageUserId) !== String(otherUserId);
          const isMine = Boolean(mineViaAuth || mineViaOther);
          return (
            <div key={m.id} className={`w-full flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl ${isMine ? 'text-right' : ''}`}>
                <div className="text-xs text-gray-500 dark:text-gray-400">{m.user?.display_name || m.user?.displayName}</div>
                <div className={`inline-block rounded-md px-3 py-2 text-sm whitespace-pre-wrap ${isMine ? 'bg-blue-100 text-blue-900 dark:bg-blue-200 dark:text-blue-900 text-right' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'}`}>
                  <MessageText text={m.body} />
                </div>
                <div className={`mt-1 text-[11px] text-gray-400 ${isMine ? 'text-right' : 'text-left'}`}>
                  {(() => {
                    const ts = m.created_at || m.createdAt;
                    if (!ts) return null;
                    try {
                      const d = new Date(ts);
                      return d.toLocaleString(undefined, { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' });
                    } catch {
                      return ts;
                    }
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageComposer onSend={onSend} isSending={isSending} />
    </div>
  );
};

const MessagesPage = () => {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [allConversations, setAllConversations] = useState([]);
  const { data, isLoading } = useGetConversationsQuery(currentPage);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (routeId) setActiveId(routeId);
  }, [routeId]);

  useEffect(() => {
    if (data?.conversations) {
      if (currentPage === 1) {
        setAllConversations(data.conversations);
      } else {
        setAllConversations(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newConversations = data.conversations.filter(c => !existingIds.has(c.id));
          return [...prev, ...newConversations];
        });
      }
    }
  }, [data?.conversations, currentPage]);

  const pagination = data?.pagination;
  const hasConversations = allConversations.length > 0;
  const hasMorePages = pagination && currentPage < pagination.pages;

  const handleLoadMore = () => {
    if (hasMorePages && !isLoading) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSelect = (id) => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    setActiveId(id);
    if (!isDesktop) navigate(`/dashboard/messages/${id}`);
  };

  const handleBackToList = () => {
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) navigate('/dashboard/messages');
    setActiveId(null);
  };

  return (
    <div className="md:grid md:grid-cols-12 md:gap-4 h-[70vh]">
      <div className={`border rounded-lg overflow-hidden ${activeId ? 'hidden md:block md:col-span-4' : 'block md:block md:col-span-4'}`}>
        <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 font-semibold">Conversations</div>
        <div className="divide-y overflow-y-auto h-full flex flex-col">
          <div className="flex-1">
          {hasConversations ? (
              allConversations.map(c => (
              <ConversationListItem key={c.id} conversation={c} isActive={activeId === c.id} onSelect={() => handleSelect(c.id)} />
            ))
            ) : isLoading && currentPage === 1 ? (
              <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading...</div>
          ) : (
            <div className="p-4 text-sm text-gray-500 dark:text-gray-400">No conversations yet.</div>
            )}
          </div>
          {hasMorePages && (
            <div className="p-4 border-t">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={`border rounded-lg overflow-hidden ${activeId ? 'block md:block md:col-span-8' : 'hidden md:block md:col-span-8'}`}>
        {hasConversations ? (
          <ConversationThread conversationId={activeId} onBack={handleBackToList} />
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


