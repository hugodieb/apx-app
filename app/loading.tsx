'use client'

import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="relative">
        {/* Spinner circular */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>

        {/* Efeito pulsante ao redor */}
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-blue-500 opacity-50 animate-ping"></div>
      </div>
    </div>
  );
}