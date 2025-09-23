'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBlogs } from '@/hooks/useBlogs';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { InlineError } from '@/components/ui/ErrorState';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const { blogs: searchResults, loading, error } = useBlogs({
    endpoint: '/api/blogs',
    published: true,
    limit: 50,
    search: query
  });

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SectionHeader title={`Searching for "${query}"`} className="mb-8" />
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SectionHeader title={`Search Results for "${query}"`} className="mb-8" />
          <InlineError message={`Error searching: ${error}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SectionHeader
          title={`Search Results for "${query}"`}
          className="mb-8"
        />

        {/* Search Stats */}
        <div className="mb-6">
          <p className="text-gray-600">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {/* Search Results */}
        {searchResults.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500 mb-4">
              We couldn't find any articles matching "{query}".
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Go back
              </button>
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Browse all articles
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((article) => (
              <ArticleCard
                key={article._id}
                blog={article}
                variant="default"
              />
            ))}
          </div>
        )}

        {/* Search Again */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Search Again</h3>
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Enter search terms..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={query}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch((e.target as HTMLInputElement).value);
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                    handleSearch(input.value);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}