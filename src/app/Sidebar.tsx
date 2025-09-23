"use client";
import React from "react";
import Image from 'next/image';
import { useBlogs } from '@/hooks/useBlogs';
import { SidebarSkeleton } from '@/components/ui/LoadingSkeleton';
import { InlineError } from '@/components/ui/ErrorState';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ArticleCard } from '@/components/ui/ArticleCard';

const Sidebar = () => {
  const { blogs: topStories, loading, error } = useBlogs({
    endpoint: '/api/blogs',
    published: true,
    limit: 3
  });

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="px-2 py-2 w-full">
      <div className="flex flex-col w-full max-w-xs mx-auto lg:mx-0 border-l border-l-gray-500 mb-12 px-3 border-b-0">
        <SectionHeader 
        className="text-[10px]"
        title="Top Stories" />

        {error && <InlineError message={error} />}

        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {topStories.map((story) => (
            <ArticleCard
              key={story._id}
              blog={story}
              variant="sidebar"
            />
          ))}
        </div>

        <div className="w-60 h-60 relative mb-12">
          <Image
            src="/images/8471e75fe110f1871ae8ab7eafbf883806222f1b (1).jpg"
            alt="Promotional banner"
            fill
            className="object-cover rounded-[1px]"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

