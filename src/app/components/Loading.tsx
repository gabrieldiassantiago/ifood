import React from 'react';

export function FoodItemSkeleton() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  );
}
