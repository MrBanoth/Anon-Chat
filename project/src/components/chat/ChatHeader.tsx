import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { X, RefreshCw, Crown, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ChatbotModal } from '../ChatbotModal';

interface ChatHeaderProps {
  userName: string;
  avatarUrl?: string;
  avatarColor: string;
  isOnline: boolean;
  isPremium: boolean;
  onEndChat: () => void;
  onFindNew: () => void;
  onlineCount?: number;
  onUserClick?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  userName,
  avatarUrl,
  avatarColor,
  isOnline,
  isPremium,
  onEndChat,
  onFindNew,
  onlineCount,
  onUserClick,
}) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const openChatbot = () => setIsChatbotOpen(true);
  const closeChatbot = () => setIsChatbotOpen(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary-500/20 bg-secondary/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div
            className="cursor-pointer"
            onClick={onUserClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onUserClick && onUserClick();
              }
            }}
          >
            <Avatar 
              name={userName} 
              imageUrl={avatarUrl}
              color={avatarColor} 
              showStatus 
              isOnline={isOnline} 
            />
          </div>
          
          <div>
            <div className="flex items-center">
              <h3
                className="font-medium text-primary-400 cursor-pointer"
                onClick={onUserClick}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onUserClick && onUserClick();
                  }
                }}
              >
                {userName}
              </h3>
              {isPremium && (
                <Badge 
                  variant="premium" 
                  size="sm" 
                  className="ml-2 flex items-center gap-1"
                >
                  <Crown size={12} />
                  <span>Premium</span>
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400">
              {isOnline ? 'Online' : 'Offline'}
            </p>
            {onlineCount !== undefined && (
              <p className="text-xs text-gray-400 mt-1">
                {onlineCount} member{onlineCount !== 1 ? 's' : ''} online now
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="md" 
              className="text-primary-500 hover:text-primary-400 hover:bg-primary-500/20 shadow-lg"
              onClick={onFindNew}
              title="Find new spirit"
            >
              <RefreshCw size={24} className="animate-glow" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button 
              variant="ghost" 
              size="md" 
              className="text-primary-500 hover:text-primary-400 hover:bg-primary-500/20 shadow-lg"
              onClick={onEndChat}
              title="End chat"
            >
              <X size={24} />
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="md"
              className="text-primary-500 hover:text-primary-400 hover:bg-primary-500/20 shadow-lg"
              onClick={openChatbot}
              title="Help"
            >
              <HelpCircle size={24} />
            </Button>
          </motion.div>
        </div>
      </div>
      <ChatbotModal isOpen={isChatbotOpen} onClose={closeChatbot} />
    </>
  );
};
