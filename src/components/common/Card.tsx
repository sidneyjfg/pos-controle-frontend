import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, hover = false }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-soft p-6 border border-gray-100 transition-all duration-300 ${
      hover ? 'hover:shadow-soft-lg hover:-translate-y-1' : ''
    } ${className}`}>
      {title && <h2 className="text-xl font-bold mb-6 text-gray-800 border-b border-gray-100 pb-3">{title}</h2>}
      {children}
    </div>
  );
};
