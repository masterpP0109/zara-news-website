"use client";

import React from 'react';
import Image from 'next/image';
import { useBlogs } from '@/hooks/useBlogs';
import { WideSectionHeader } from '@/components/ui/SectionHeader';
import DateDisplay from '@/components/dateDisplay';

const Sports = () => {
  const { blogs: articles, loading, error } = useBlogs({
    endpoint: '/api/blogs/category/Sports,Swimming,Boxing,Basketball,Football',
    published: true,
    limit: 5
  });



  const sportsArticle = articles.length > 0 ? articles[0] : null;

  if (loading) {
    return (
      <div>
        <div className="w-[150px] h-[9px] flex gap-[6px] mb-4">
          <Image src="/images/roseLine.png" alt="rose line" width={30} height={5} className="transform skew-x-3 animate-pulse" />
          <div>
            <div className="w-[70px] border-t-[1px] border-b-[1px] border-gray-400 h-[5px] animate-pulse"></div>
          </div>
        </div>
        <div className="w-auto h-auto flex gap-6 items-center justify-center">
          <div className="flex flex-col">
            <div className="w-95 h-60 relative bg-gray-200 animate-pulse rounded-[2px] mb-4"></div>
            <div className="flex flex-col flex-1 justify-center">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex gap-[5px] items-center">
                <div className="w-20 h-15 relative bg-gray-200 animate-pulse rounded-[1px]"></div>
                <div className="flex flex-col flex-wrap w-40">
                  <div className="h-2 bg-gray-200 rounded w-12 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                  <div className="h-2 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
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
        title="Sports"
        className="mb-4"
      />
<div className="w-auto h-auto flex flex-col sm:flex-row gap-6 items-center justify-center">
  <div
  className="flex flex-col "
  >



  <div className="w-full sm:w-95 h-48 sm:h-60 relative">
    <Image
      src={sportsArticle?.imageUrl || "/images/featuredArticle2.jpg"}
      alt="World Top News"
      fill
      className="object-cover rounded-[2px]"
      priority
    />
  </div>

  <div className="flex flex-col flex-1 justify-center">
    {sportsArticle ? (
      <>
        <p className="text-sm text-gray-500 mb-2">{sportsArticle.category}</p>
        <h1 className="text-sm sm:text-[14px] font-bold text-gray-800 mb-4">{sportsArticle.title}</h1>



        <div className="flex items-center gap-4 mb-4">
          <DateDisplay date={sportsArticle.publishedAt || sportsArticle.createdAt} />
        </div>


      </>
    ) : (
      <div className="text-center text-gray-500">
        <p>No featured article available</p>
      </div>
    )}
  </div>
    </div>

  <div className="flex flex-col gap-2" >
           { articles.length > 1 ? articles.slice(1, 5).map((article) => (
              <div
              key={article._id || `article-${article.title}`}
              className="flex gap-[5px] items-center"
              >
                  <div className="w-20 h-15 relative inset-0  ">
                             <Image
                               src={article?.imageUrl || "/images/featuredArticle2.jpg"}
                               alt="image"
                               fill
                               className="object-cover rounded-[1px]"
                               priority
                             />
                           </div>
               <div
               className="flex flex-col flex-wrap w-40"
               >
                  <p className="text-[10px] text-gray-500 ">{article.category}</p>
               <h1 className="text-[12px] font-bold text-gray-800 ">{article.title}</h1>
                <DateDisplay date={article.publishedAt || article.createdAt} />
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

export default Sports;
