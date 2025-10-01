import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'lucide-react';
import { Blog } from '@/types/blog';
import { getDisplayDate } from '@/lib/dateUtils';
import DateDisplay from '@/components/dateDisplay';

interface ArticleCardProps {
  blog: Blog;
  variant?: 'featured' | 'sidebar' | 'compact';
  className?: string;
  showImage?: boolean;
  showExcerpt?: boolean;
}

/**
 * Reusable article card component with different variants
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
  blog,
  variant = 'featured',
  className = '',
  showImage = true,
  showExcerpt = false
}) => {
  const displayDate = getDisplayDate({
    publishedAt: blog.publishedAt || undefined,
    createdAt: blog.createdAt
  });

  if (variant === 'sidebar') {
    return (
      <Link href={`/blogs/${blog._id}`}>
        <div className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${className}`}>
          <div className="flex flex-col items-start gap-2 my-2">
            <h5 className="text-[9px] sm:text-[10px] md:text-[11px] text-gray-500 uppercase">{blog.category}</h5>
            <h3 className="text-[13px] sm:text-[14px] md:text-[15px] font-medium">{blog.title}</h3>
            <DateDisplay date={displayDate} />
          </div>

          {showImage && (
            <div className="flex items-center rounded-full justify-center mb-4 w-[60px] h-[60px] sm:w-[65px] sm:h-[65px] md:w-[70px] md:h-[70px]">
              <Image
                src={blog.imageUrl || '/images/article_image1.jpg'}
                alt={blog.title || 'Article image'}
                width={60}
                height={60}
                className="object-cover rounded-[1px]"
                priority
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blogs/${blog._id}`}>
        <article className={`flex flex-col py-2 cursor-pointer hover:bg-gray-50 transition-colors ${className}`}>
          {showImage && (
            <div className="relative h-36 sm:h-40 md:h-44 lg:h-48 xl:h-52 w-full mb-2">
              <Image
                src={blog.imageUrl || '/images/article_image1.jpg'}
                alt={blog.title || 'Article image'}
                fill
                className="object-cover "
                priority
              />
            </div>
          )}

          <p className="text-xs sm:text-sm text-gray-500">{blog.category}</p>
          <h5 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">{blog.title}</h5>

          {showExcerpt && blog.excerpt && (
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">{blog.excerpt}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-600 flex items-center justify-center">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
              </span>
              <p className="text-xs sm:text-sm text-gray-500">{blog.author}</p>
            </div>
            <DateDisplay date={displayDate} />
          </div>
        </article>
      </Link>
    );
  }

  // Default featured variant
  return (
    <Link href={`/blogs/${blog._id}`}>
      <article className={`flex flex-col py-4 cursor-pointer hover:shadow-lg transition-shadow ${className}`}>
        {showImage && (
          <div className="relative h-30 sm:h-32 md:h-36 lg:h-40 xl:h-44 w-full sm:w-[200px] md:w-[220px] lg:w-[240px] xl:w-[260px] mb-3">
            <Image
              src={blog.imageUrl || '/images/article_image1.jpg'}
              alt={blog.title || 'Article image'}
              fill
              className="object-cover rounded-[1px]"
              priority
            />
          </div>
        )}

        <p className="text-xs sm:text-sm md:text-base text-gray-500">{blog.category}</p>
        <h5 className="text-[0.7rem] sm:text-xs md:text-sm lg:text-base font-bold text-gray-600">{blog.title}</h5>

        {showExcerpt && blog.excerpt && (
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{blog.excerpt}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </span>
            <p className="text-xs sm:text-sm text-gray-500">{blog.author}</p>
          </div>
          <DateDisplay date={displayDate} />
        </div>
      </article>
    </Link>
  );
};