import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, fullWidth = true, className, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={cn(fullWidth && 'w-full', 'mb-4')}>
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-3 py-2',
              'border border-gray-300 rounded-md',
              'focus:outline-none focus:ring-2 focus:ring-primary-500',
              'text-primary-600', // Changed to green text
              'placeholder:text-gray-400',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';