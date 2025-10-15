import React from 'react';
import type { ComponentWithClassName } from '../../types';

interface LoadingProps extends ComponentWithClassName {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  overlay?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  className = '',
  size = 'medium',
  text,
  overlay = false,
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
  );

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {spinner}
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;