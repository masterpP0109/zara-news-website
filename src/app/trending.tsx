"use client"; // if you're in Next.js App Router

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DateDisplay from "@/components/dateDisplay";

interface Blog {
  _id: string;
  title: string;
  category: string;
  author: string;
  publishedAt: string;
  excerpt: string;
  imageUrl: string;
}

const Trending = () => {
  const [trending, setTrending] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch('/api/blogs/category/Trending?published=true&limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch trending articles');
        }
        const data = await response.json();
        setTrending(data.blogs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % trending.length);
      }, 7000); // changes every 7s
      return () => clearInterval(interval);
    }
  }, [trending.length]);

  if (loading) {
    return (
      <section className="flex justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="relative h-48 sm:h-56 md:h-64 w-full max-w-sm mb-3 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex justify-center">
        <div className="w-full flex flex-col items-center">
          <p className="text-red-500">Error loading trending articles: {error}</p>
        </div>
      </section>
    );
  }

  if (trending.length === 0) {
    return (
      <section className="flex justify-center">
        <div className="w-full flex flex-col items-center">
          <p className="text-gray-500">No trending articles available</p>
        </div>
      </section>
    );
  }

  const trend = trending[current];

  return (
    <section className="flex justify-center">
      <div className="w-full flex flex-col items-center">
        {/* Image */}
        <div className="relative h-[240px] sm:h-[270px] md:h-[300px] lg:h-[320px] xl:h-[340px] w-full sm:w-[380px] md:w-[400px] lg:w-[420px] xl:w-[440px] mb-3">
          <Image
            src={trend.imageUrl || '/images/article_image1.jpg'}
            alt={trend.title}
            fill
            className="object-cover rounded-[1px]"
            priority
          />
        </div>

        {/* Text */}
        <p className="text-[9px] sm:text-[10px] px-[1px] py-[1px] border border-gray-300 text-gray-500">
          {trend.category}
        </p>
        <h4 className="font-extrabold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-[28px] leading-[30px] sm:leading-[33px] md:leading-[36px] lg:leading-[40px] tracking-normal text-center align-middle capitalize text-[#183354]">{trend.title}</h4>

        <div className="flex gap-2 text-xs sm:text-sm text-gray-500">
           <p>{trend.author}</p>
           <span className="hidden sm:inline">•</span>
           <DateDisplay date={trend.publishedAt} />
           <span className="hidden sm:inline">•</span>
           <p>5 Mins</p>
         </div>
        <div className="flex items-center text-center justify-center px-2 sm:px-4" >
              <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-500 max-w-[90%] sm:max-w-[85%] md:max-w-[80%]" >{trend.excerpt || 'Read more about this trending topic...'}</p>
        </div>
      </div>
    </section>
  );
};

export default Trending;


/*
"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Image from "next/image";

const Trending = () => {
  const trending = [
    { id: 1, title: "First Trend", category: "Business", author: "Admin", date: "1 Sept, 2024", readTime: "10 Mins", image: "/images/trend1.jpg" },
    { id: 2, title: "Second Trend", category: "Tech", author: "Admin", date: "2 Sept, 2024", readTime: "15 Mins", image: "/images/trend2.jpg" },
    { id: 3, title: "Third Trend", category: "Design", author: "Admin", date: "3 Sept, 2024", readTime: "8 Mins", image: "/images/trend3.jpg" },
  ];

  return (
    <section className="w-full">
      <Swiper
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 4000 }}
        loop
      >
        {trending.map((trend) => (
          <SwiperSlide key={trend.id}>
            <div className="flex flex-col items-center">
              <div className="relative h-[250px] w-[400px] mb-3">
                <Image
                  src={trend.image}
                  alt={trend.title}
                  fill
                  className="object-cover rounded-[1px]"
                  priority
                />
              </div>

              <p className="text-[9px] px-[1px] py-[1px] border border-gray-300 text-gray-500">
                {trend.category}
              </p>
              <h4>{trend.title}</h4>

              <div className="flex gap-2 text-xs text-gray-500">
                <p>{trend.author}</p>
                <p>{trend.date}</p>
                <p>{trend.readTime}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Trending;
ccccccccccccccccc */
