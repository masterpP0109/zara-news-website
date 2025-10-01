"use client";

import React from 'react';
import Image from 'next/image';
import { useBlogs } from '@/hooks/useBlogs';
import { WideSectionHeader } from '@/components/ui/SectionHeader';
import DateDisplay from '@/components/dateDisplay';

const WorldTopNews = () => {
  const { blogs: articles, loading, error } = useBlogs({
    endpoint: '/api/blogs/category/World,Tech,Politics,Modern',
    published: true,
    limit: 10
  });



  const featuredArticle = articles.length > 0 ? articles[0] : null;

  if (loading) {
    return (
      <div>
        <div className="w-[150px] h-[9px] flex gap-[6px] mb-4">
          <div className="h-[5px] w-[30px] bg-rose-500 transform skew-x-3 animate-pulse"></div>
          <div>
            <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px] animate-pulse"></div>
          </div>
        </div>
        <div className="w-[50vw] h-auto flex flex-wrap justify-between gap-[16px]">
          <div className="w-60 h-60 relative bg-gray-200 animate-pulse rounded-[2px]"></div>
          <div className="flex flex-col flex-1 justify-center">
            <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-3 bg-gray-200 rounded w-20 animate-pulse"></div>
              <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex gap-[1px] items-center">
                <div>
                  <div className="h-2 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                  <div className="h-2 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
                <div className="w-25 h-15 relative bg-gray-200 animate-pulse rounded-[1px]"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) return <div>Error loading news: {error}</div>;

  return (
    <div>
      <WideSectionHeader
        title="World Top News"
        className="mb-4"
      />

      <div className="w-[50vw] h-auto flex flex-wrap  justify-between gap-[16px] ">
        <div className="w-60 h-60 relative">
          <Image
            src={featuredArticle?.imageUrl || "/images/featuredArticle2.jpg"}
            alt="World Top News"
            fill
            className="object-cover rounded-[2px]"
            priority
          />
        </div>

        <div className="flex flex-col flex-1 justify-center">
          {featuredArticle ? (
            <>
              <p className="text-sm text-gray-500 mb-2">{featuredArticle.category}</p>
              <h1 className="text-[14px] font-bold text-gray-800 mb-4">{featuredArticle.title}</h1>

              {featuredArticle.excerpt && (
                <p className="text-gray-600 text-[12px] mb-4 line-clamp-3">{featuredArticle.excerpt}</p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm text-gray-500">By {featuredArticle.author}</span>
                <DateDisplay date={featuredArticle.publishedAt || featuredArticle.createdAt} />
              </div>

              <button
                className="bg-transparent text-blue-900 border-2 border-blue-900 font-bold px-6 py-2 rounded hover:bg-blue-900 hover:text-white transition-colors w-fit"
                aria-label={`Read more about ${featuredArticle.title}`}
              >
                Read More
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <p>No featured article available</p>
            </div>
          )}
        </div>

        <div className="flex gap-2 " >
           { articles.length > 1 ? articles.slice(1, 4).map((article, index) => (
              <div
              key={article._id || `article-${index}`}
              className="flex gap-[1px] items-center "
              >
               <div>
                  <p className="text-[10px] text-gray-500 ">{article.category}</p>
               <h1 className="text-[12px] font-bold text-gray-800 ">{article.title}</h1>
                <DateDisplay date={article.publishedAt || article.createdAt} />
               </div>

                <div className="w-25 h-15 relative inset-0  ">
                             <Image
                               src={article?.imageUrl || "/images/featuredArticle2.jpg"}
                               alt="image"
                               fill
                               className="object-cover rounded-[1px]"
                               priority
                             />
                           </div>
              </div>
           )) : (

             <div>
               <p>No additional articles found</p>
             </div>


           ) }
        </div>


      </div>
    </div>
  );
}

export default WorldTopNews;
