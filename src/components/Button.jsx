"use client"

import React from 'react';

export default function Button({ 
  children, 
  onClick, 
  className = '', 
  type = 'number',
  ariaLabel,
  theme  
}) {
  const baseClass = type === 'number' 
    ? theme.numberKey
    : type === 'special'
    ? theme.delResetKey
    : theme.equalsKey;

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${className} cursor-pointer rounded-lg font-bold text-3xl h-16 transition-all active:translate-y-1 active:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50`}
      aria-label={ariaLabel}
      tabIndex={0}
    >
      {children}
    </button>
  );
}