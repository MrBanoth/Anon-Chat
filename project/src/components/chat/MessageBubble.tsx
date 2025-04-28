import React, { useEffect, useState } from 'react';
import { cn, formatMessageTime } from '../../lib/utils';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  isPremium: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isCurrentUser,
  isPremium,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(message.vanishAfter || 0);
  
  // Handle vanishing messages for premium feature
  useEffect(() => {
    if (isPremium && message.isVanished && message.vanishAfter) {
      const intervalId = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setTimeout(() => setIsVisible(false), 300);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(intervalId);
    }
  }, [isPremium, message.isVanished, message.vanishAfter]);
  
  if (!isVisible) return null;
  
  return (
    <div
      className={cn(
        'flex flex-col mb-2 max-w-[80%] transition-opacity duration-300 group',
        isCurrentUser ? 'items-end ml-auto' : 'items-start mr-auto',
        isPremium && message.isVanished && 'hover:opacity-50',
      )}
    >
      <div
        className={cn(
          'px-4 py-2 rounded-2xl animate-fade-in shadow-md',
          isCurrentUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-tr-2xl rounded-br-2xl rounded-tl-2xl'
            : 'bg-gray-200 text-gray-800 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
        )}
      >
        <p>{message.text}</p>
        
        {isPremium && message.isVanished && timeRemaining > 0 && (
          <div className="text-xs opacity-70 mt-1">
            Vanishes in {timeRemaining}s
          </div>
        )}
      </div>
      
      <div
        className={cn(
          'flex items-center space-x-1 text-xs mt-1',
          isCurrentUser ? 'text-gray-600' : 'text-gray-500'
        )}
      >
        <span>{formatMessageTime(message.timestamp)}</span>
        
        {isCurrentUser && (
          <span>
            {message.isRead ? (
              <CheckCheck size={14} className="text-primary-500" />
            ) : (
              <Check size={14} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};