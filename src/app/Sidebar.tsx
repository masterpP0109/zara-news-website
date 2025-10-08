"use client";
import React from "react";
import Image from "next/image";
import { useBlogs } from "@/hooks/useBlogs";
import { SidebarSkeleton } from "@/components/ui/LoadingSkeleton";
import { InlineError } from "@/components/ui/ErrorState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArticleCard } from "@/components/ui/ArticleCard";

const Sidebar = () => {
  const {
    blogs: topStories,
    loading: topStoriesLoading,
    error: topStoriesError,
  } = useBlogs({
    endpoint: "/api/blogs",
    published: true,
    limit: 4,
  });

  const {
    blogs: trendingStories,
    loading: trendingLoading,
    error: trendingError,
  } = useBlogs({
    endpoint: "/api/blogs/category/World,Tech,Business",
    published: true,
    limit: 4,
  });

  if (topStoriesLoading || trendingLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="px-2 py-2 w-full">
      <div className="flex flex-col w-full max-w-xs mx-auto lg:mx-0 border-l border-l-gray-500 mb-12 px-3 border-b-0">
        <SectionHeader className="text-[10px]" title="Top Stories" />

        {topStoriesError && <InlineError message={topStoriesError} />}

        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {topStories.map((story) => (
            <ArticleCard key={story._id} blog={story} variant="sidebar" />
          ))}
        </div>

        <div className="w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-60 lg:h-60 relative mb-12">
          <Image
            src="/images/article_image6.jpg"
            alt="Promotional banner"
            fill
            className="object-cover rounded-[1px]"
            priority
          />
        </div>

        <SectionHeader className="text-[10px]" title="Trending" />

        {trendingError && <InlineError message={trendingError} />}

        <div className="flex flex-col divide-y divide-gray-300 mb-12 px-3 border-b-0">
          {trendingStories.map((story) => (
            <ArticleCard key={story._id} blog={story} variant="sidebar" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
