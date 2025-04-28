import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  isOnline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  color,
  size = 'md',
  showStatus = false,
  isOnline = false,
  className,
  onClick,
}) => {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const statusSizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };
  
  const AvatarWrapper = onClick ? motion.button : motion.div;
  
  return (
    <div className="relative">
      <AvatarWrapper
        whileHover={onClick ? { scale: 1.05 } : undefined}
        whileTap={onClick ? { scale: 0.95 } : undefined}
        onClick={onClick}
        className={cn(
          'rounded-full flex items-center justify-center font-medium text-white overflow-hidden',
          'ring-2 ring-primary-500/20 hover:ring-primary-500/40 transition-all',
          sizeClasses[size],
          className
        )}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={cn('w-full h-full flex items-center justify-center', color)}>
            {initials}
          </div>
        )}
      </AvatarWrapper>
      
      {showStatus && (
        <span 
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-background',
            'animate-pulse transition-colors duration-300',
            isOnline ? 'bg-primary-500' : 'bg-gray-400',
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
};