import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { PageLayout } from '../../components/layout/PageLayout';
import { useAuthStore } from '../../store/authStore';
import { useChatStore } from '../../store/chatStore';
import { useThemeStore } from '../../store/themeStore';
import { ChatHeader } from '../../components/chat/ChatHeader';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { MessageInput } from '../../components/chat/MessageInput';
import { Loader2, RefreshCw } from 'lucide-react';

interface ChatPageProps {
  isChatbotOpen: boolean;
}

export const ChatPage: React.FC<ChatPageProps> = ({ isChatbotOpen }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn, isPremium } = useAuthStore();
  const {
    chats,
    currentChatId,
    isLoading,
    isTyping,
    randomUser,
    initializeChat,
    sendMessage,
    markMessagesAsRead,
    endChat,
    findNewChat,
    onlineUsers,
    connect,
    disconnect,
  } = useChatStore();
  const { theme, setTheme } = useThemeStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }

    if (!currentChatId && user) {
      initializeChat(user.id);
    }

    if (user) {
      connect(user.id);
    }

    return () => {
      disconnect();
    };
  }, [isLoggedIn, currentChatId, user, initializeChat, navigate, connect, disconnect]);

  useEffect(() => {
    if (currentChatId && user) {
      markMessagesAsRead(currentChatId, user.id);
    }
  }, [currentChatId, user?.id, markMessagesAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, isTyping]);

  const handleSendMessage = (text: string, options?: { vanish?: boolean; timer?: number }) => {
    if (!user || !text.trim()) return;

    const vanishOptions = isPremium && options?.vanish
      ? { isVanished: true, vanishAfter: options.timer || 10 }
      : {};

    sendMessage(user.id, text);
  };

  const handleEndChat = () => {
    endChat();
    navigate('/');
  };

  const handleNewChat = () => {
    if (user) {
      findNewChat(user.id);
    }
  };

  const currentChat = currentChatId
    ? chats.find(chat => chat.id === currentChatId)
    : null;

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as 'light' | 'dark' | 'system');
  };

  return (
    <PageLayout>
      <div
        className={`max-w-4xl mx-auto min-h-[calc(100vh-160px)] flex flex-col relative rounded-lg shadow-lg border border-gray-300 ${theme === 'dark' ? 'bg-gray-900' : theme === 'light' ? 'bg-white' : 'bg-gray-50'} transition-colors duration-300`}
        style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '960px',
          minWidth: '320px',
          height: 'calc(100vh - 160px)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          padding: '8px',
          borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
        }}
      >
        <div className="sticky top-0 z-40 shadow-md bg-gray-50 dark:bg-gray-900">
          {randomUser && (
            <ChatHeader
              userName={randomUser.name}
              avatarColor={randomUser.avatarColor}
              isOnline={onlineUsers.includes(randomUser.id)}
              isPremium={randomUser.isPremium}
              onEndChat={handleEndChat}
              onFindNew={handleNewChat}
              onlineCount={onlineUsers.length}
              onUserClick={() => {
                if (isPremium) {
                  navigate(`/profile/${randomUser.id}`);
                }
              }}
            />
          )}
        </div>
        {isLoading ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
              <p className="text-lg text-gray-600">Finding someone to chat with...</p>
            </div>
          </div>
        ) : !currentChat ? (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="bg-gray-100 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-2">Start a new chat</h3>
                <p className="text-gray-600 mb-4">
                  Connect with someone random across India and start a conversation.
                </p>
                <Button
                  onClick={handleNewChat}
                  leftIcon={<RefreshCw size={18} />}
                >
                  Find Someone
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={`flex-grow flex flex-col bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden ${
                isChatbotOpen ? 'pointer-events-none select-none' : ''
              }`}
              style={{
                width: '100%',
              }}
            >
              <div className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-indigo-900">
                {currentChat?.messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <p>Wel-Come to Match</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {currentChat?.messages.map(message => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isCurrentUser={user?.id === message.senderId}
                        isPremium={isPremium}
                      />
                    ))}

                    {isTyping && (
                      <div className="flex items-start max-w-[80%] mr-auto">
                        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none inline-flex items-center">
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>
              <div className="p-4 border-t border-gray-300 bg-white flex flex-col space-y-4 sticky bottom-0 z-30 shadow-lg rounded-b-lg">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isPremium={isPremium}
                />
                {isPremium && (
                  <div className="flex items-center space-x-2">
                    <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">
                      Background Theme:
                    </label>
                    <select
                      id="theme-select"
                      value={theme}
                      onChange={handleThemeChange}
                      className="border border-gray-300 rounded p-1"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};
