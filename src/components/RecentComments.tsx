"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MessageCircle, User } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface RecentComment {
  blogId: string;
  blogTitle: string;
  comment: {
    userId: string;
    userName: string;
    comment: string;
    createdAt: string;
  };
}

const RecentComments = () => {
  const [comments, setComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecentComments = async () => {
      try {
        const res = await fetch('/api/comments?limit=5');
        if (!res.ok) throw new Error('Failed to fetch comments');
        const data: RecentComment[] = await res.json();
        setComments(data);
      } catch (err) {
        setError('Failed to load recent comments');
        console.error('Recent comments error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentComments();
  }, []);

  if (loading) {
    return (
      <div className="px-2 py-2 w-full">
        <div className="flex flex-col w-full max-w-xs mx-auto lg:mx-0 border-l border-l-gray-500 mb-12 px-3 border-b-0">
          <SectionHeader className="text-[10px]" title="Recent Comments" />
          <div className="space-y-3 mb-12 px-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || comments.length === 0) {
    return null; // Don't show if no comments or error
  }

  return (
    <div className="px-2 py-2 w-full">
      <div className="flex flex-col w-full max-w-xs mx-auto lg:mx-0 border-l border-l-gray-500 mb-12 px-3 border-b-0">
        <SectionHeader className="text-[10px]" title="Recent Comments" />

        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {comments.map((item, index) => (
            <Link
              key={`${item.blogId}-${index}`}
              href={`/blogs/${item.blogId}`}
              className="py-3 hover:bg-gray-50 transition-colors block"
            >
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.comment.userName}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                    {item.comment.comment}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MessageCircle className="w-3 h-3" />
                    <span className="truncate">{item.blogTitle}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {formatDate(item.comment.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentComments;