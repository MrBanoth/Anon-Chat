import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Send } from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    messages, 
    isConnected, 
    isTyping, 
    connect, 
    disconnect, 
    sendMessage, 
    setTyping 
  } = useChatStore();
  
  const [inputValue, setInputValue] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      connect(user.id);
    }
    return () => {
      disconnect();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setTyping(!!e.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.senderId === user?.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500">Someone is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            disabled={!isConnected}
          />
          <Button
            type="submit"
            disabled={!isConnected || !inputValue.trim()}
            className="bg-primary-500 text-white"
          >
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};