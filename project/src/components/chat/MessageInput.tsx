import React, { useState } from 'react';
import { Send, Clock, Wand2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MessageInputProps {
  onSendMessage: (text: string, options?: { vanish?: boolean; timer?: number }) => void;
  isPremium: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isPremium,
}) => {
  const [message, setMessage] = useState('');
  const [isVanishMode, setIsVanishMode] = useState(false);
  const [vanishTimer, setVanishTimer] = useState(10); // Default 10 seconds
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message, {
        vanish: isVanishMode,
        timer: isVanishMode ? vanishTimer : undefined,
      });
      setMessage('');
    }
  };
  
  return (
    <form onSubmit={handleSendMessage} className="flex flex-col">
      {isPremium && isVanishMode && (
        <div className="bg-primary-50 p-2 rounded-t-lg border border-primary-200 flex items-center justify-between">
          <div className="flex items-center text-sm text-primary-800">
            <Clock size={16} className="mr-1" />
            <span>Vanish mode active</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-primary-700">Seconds:</span>
            <select
              value={vanishTimer}
              onChange={(e) => setVanishTimer(Number(e.target.value))}
              className="text-sm bg-white border border-primary-300 rounded p-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={60}>60</option>
            </select>
            
            <button
              type="button"
              onClick={() => setIsVanishMode(false)}
              className="text-xs text-primary-700 hover:text-primary-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <div className="flex items-center space-x-2 border border-gray-300 bg-white rounded-lg p-2">
        {isPremium && (
          <button
            type="button"
            onClick={() => setIsVanishMode(!isVanishMode)}
            className={cn(
              "p-2 rounded-full",
              isVanishMode ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:text-primary-600"
            )}
            title="Vanish mode (Premium)"
          >
            <Wand2 size={20} />
          </button>
        )}
        
<input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Type a message..."
  className="flex-grow py-3 px-4 bg-primary-50 text-primary-900 rounded-md outline-none focus:ring-2 focus:ring-primary-400 focus:outline-none transition-colors text-base placeholder:text-primary-400"
/>
        
        <button
          type="submit"
          className={cn(
            "p-2 rounded-full",
            message.trim()
              ? "bg-primary-600 text-white"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          )}
          disabled={!message.trim()}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};