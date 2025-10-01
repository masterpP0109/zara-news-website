import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
  className?: string;
  itemClassName?: string;
}

/**
 * Reusable loading skeleton component
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 1,
  className = '',
  itemClassName = ''
}) => {
  return (
    <div className={className}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={`animate-pulse ${itemClassName}`}>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Specific skeleton for article cards (featured variant)
 */
export const ArticleSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <div className="flex flex-col divide-y w-full max-w-sm mx-auto lg:mx-0 space-x-4 divide-gray-300 border border-r-gray-500 mb-12 px-2 border-b-0">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="flex flex-col py-4">
          <div className="relative h-30 w-[200px] mb-3 bg-gray-200 animate-pulse rounded-[1px]"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-200 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </article>
      ))}
    </div>
  );
};

/**
 * Specific skeleton for sidebar items
 */
export const SidebarSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="px-2 py-2 w-full">
      <div className="flex flex-col w-full max-w-xs mx-auto lg:mx-0 border-l border-l-gray-500 mb-12 px-3 border-b-0">
        {/* Top Stories Section */}
        <div className="w-[150px] h-[9px] flex gap-[6px] mb-2">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3 animate-pulse"></div>
          <div>
            <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px] animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {Array.from({ length: count }, (_, index) => (
            <div key={index} className="flex items-center justify-between my-2">
              <div className="flex flex-col items-start gap-2">
                <div className="h-2 bg-gray-200 rounded w-12 uppercase animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center rounded-full justify-center mb-4 w-[60px] h-[60px]">
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-[1px] animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div className="w-60 h-60 relative mb-12 bg-gray-200 animate-pulse rounded-[1px]"></div>

        {/* Trending Section */}
        <div className="w-[150px] h-[9px] flex gap-[6px] mb-2">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3 animate-pulse"></div>
          <div>
            <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px] animate-pulse"></div>
          </div>
        </div>
        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {Array.from({ length: count }, (_, index) => (
            <div key={`trending-${index}`} className="flex items-center justify-between my-2">
              <div className="flex flex-col items-start gap-2">
                <div className="h-2 bg-gray-200 rounded w-12 uppercase animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
                <div className="h-2 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
              <div className="flex items-center rounded-full justify-center mb-4 w-[60px] h-[60px]">
                <div className="w-[60px] h-[60px] bg-gray-200 rounded-[1px] animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Specific skeleton for search results grid
 */
export const SearchSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <article key={index} className="flex flex-col py-4 bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <div className="relative h-30 w-full mb-3 bg-gray-200 animate-pulse rounded-[1px]"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full border border-gray-200 bg-gray-200 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-12 animate-pulse"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </article>
      ))}
    </div>
  );
};