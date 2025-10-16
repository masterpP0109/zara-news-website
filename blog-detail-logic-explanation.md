# Blog Detail Page Logic: Complete Implementation Guide

This document provides a comprehensive, line-by-line explanation of how the blog detail functionality works in a Next.js application. It covers navigation, data fetching, likes, comments, and the complete user interaction flow. This guide is designed so you can understand the logic and recreate it in your own projects.

## Table of Contents
1. [Overview](#overview)
2. [Navigation Flow](#navigation-flow)
3. [ArticleCard Component](#articlecard-component)
4. [Blog Detail Page](#blog-detail-page)
5. [API Routes](#api-routes)
6. [Data Models](#data-models)
7. [Complete User Flow](#complete-user-flow)

## Overview

The blog detail system consists of:
- **Navigation**: Clicking a blog preview navigates to full article
- **Data Fetching**: Dynamic route loads blog content from API
- **Interactions**: Users can like and comment on articles
- **State Management**: Real-time updates for likes and comments
- **Authentication**: Protected interactions requiring user login

## Navigation Flow

### How Users Navigate to Blog Details

1. **User sees blog previews** on homepage, category pages, or search results
2. **Clicks on ArticleCard component** (blog preview)
3. **Next.js performs client-side navigation** to `/blogs/{blogId}`
4. **Dynamic route `[id].tsx` loads** and fetches blog data
5. **Full blog page renders** with content, likes, and comments

## ArticleCard Component

The `ArticleCard` component handles the initial click that starts the navigation process.

```tsx
// File: src/components/ui/ArticleCard.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';  // KEY: Next.js Link for client-side navigation
import { User } from 'lucide-react';
import { Blog } from '@/types/blog';
import { getDisplayDate } from '@/lib/dateUtils';
import DateDisplay from '@/components/dateDisplay';

interface ArticleCardProps {
  blog: Blog;  // Blog data passed as prop
  variant?: 'featured' | 'sidebar' | 'compact';
  className?: string;
  showImage?: boolean;
  showExcerpt?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  blog,  // Contains blog._id, title, etc.
  variant = 'featured',
  className = '',
  showImage = true,
  showExcerpt = false
}) => {
  // Calculate display date from blog timestamps
  const displayDate = getDisplayDate({
    publishedAt: blog.publishedAt || undefined,
    createdAt: blog.createdAt
  });

  // Three different layouts: sidebar, compact, featured
  if (variant === 'sidebar') {
    return (
      // KEY: Link component wraps the entire card
      // href uses template literal to create dynamic URL
      <Link href={`/blogs/${blog._id}`}>
        <div className="...cursor-pointer hover:bg-gray-50...">
          {/* Sidebar layout: category, title, date, optional image */}
          <div className="flex flex-col items-start gap-2 my-2">
            <h5 className="...">{blog.category}</h5>
            <h3 className="...">{blog.title}</h3>
            <DateDisplay date={displayDate} />
          </div>
          {showImage && (
            <div className="...">
              <Image
                src={blog.imageUrl || '/images/article_image1.jpg'}
                alt={blog.title || 'Article image'}
                width={60} height={60}
                className="object-cover rounded-[1px]"
                priority  // Load immediately for performance
              />
            </div>
          )}
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blogs/${blog._id}`}>  // Same pattern
        <article className="...cursor-pointer hover:bg-gray-50...">
          {/* Compact layout for grids/related articles */}
          {showImage && (
            <div className="relative h-36 sm:h-40...">
              <Image src={blog.imageUrl || '/images/article_image1.jpg'}
                     alt={blog.title || 'Article image'}
                     fill
                     className="object-cover"
                     priority />
            </div>
          )}
          <p className="...">{blog.category}</p>
          <h5 className="...">{blog.title}</h5>
          {showExcerpt && blog.excerpt && (
            <p className="...">{blog.excerpt}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <span className="...">
                <User className="..." />
              </span>
              <p className="...">{blog.author}</p>
            </div>
            <DateDisplay date={displayDate} />
          </div>
        </article>
      </Link>
    );
  }

  // Default featured variant (most common)
  return (
    <Link href={`/blogs/${blog._id}`}>  // CRITICAL: This creates the navigation
      <article className="...cursor-pointer hover:shadow-lg...">
        {/* Full featured layout */}
        {showImage && (
          <div className="relative h-30 sm:h-32...">
            <Image src={blog.imageUrl || '/images/article_image1.jpg'}
                   alt={blog.title || 'Article image'}
                   fill
                   className="object-cover rounded-[1px]"
                   priority />
          </div>
        )}
        <p className="...">{blog.category}</p>
        <h5 className="...">{blog.title}</h5>
        {showExcerpt && blog.excerpt && (
          <p className="...">{blog.excerpt}</p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center gap-1">
            <span className="...">
              <User className="..." />
            </span>
            <p className="...">{blog.author}</p>
          </div>
          <DateDisplay date={displayDate} />
        </div>
      </article>
    </Link>
  );
};
```

**Key Learning Points:**
- `Link` component enables client-side navigation (no full page reload)
- `href={`/blogs/${blog._id}`}` creates dynamic URLs
- `cursor-pointer` and hover effects provide user feedback
- `priority` on images improves loading performance

## Blog Detail Page

The main page component that renders when users visit `/blogs/[id]`.

```tsx
// File: src/app/blogs/[id]/page.tsx

"use client";  // Required for hooks and client-side features

// Imports for functionality
import { useParams } from 'next/navigation';  // Get URL parameters
import { useEffect, useState, useCallback } from 'react';  // React hooks
import { useSession } from 'next-auth/react';  // Authentication
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, User, Share2, Clock, Tag } from 'lucide-react';
import { formatDate, getDisplayDate } from '@/lib/dateUtils';
import { Blog } from '@/types/blog';
import { IComment } from '@/app/models/blog';
import { ArticleCard } from '@/components/ui/ArticleCard';

const BlogDetail = () => {
  // URL parameter extraction - gets the blog ID from /blogs/123
  const { id } = useParams();  // id = "123" for /blogs/123

  // Authentication state
  const { data: session } = useSession();  // Current user session

  // Component state management
  const [blog, setBlog] = useState<Blog | null>(null);  // Blog data
  const [loading, setLoading] = useState(true);  // Loading indicator
  const [error, setError] = useState('');  // Error messages
  const [liked, setLiked] = useState(false);  // User's like status
  const [likesCount, setLikesCount] = useState(0);  // Total likes
  const [comments, setComments] = useState<IComment[]>([]);  // Comments array
  const [newComment, setNewComment] = useState('');  // Comment input
  const [submitting, setSubmitting] = useState(false);  // Comment submission state
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);  // Related articles

  // Function to fetch blog data from API
  const fetchBlog = useCallback(async () => {
    try {
      // API call to get blog by ID
      const res = await fetch(`/api/blogs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');

      // Parse JSON response
      const data: Blog = await res.json();

      // Update all relevant state
      setBlog(data);
      setLikesCount(data.likes?.length || 0);  // Count from likes array
      setComments(data.comments || []);

      // Check if current user liked this blog
      setLiked(session?.user?.email ?
        data.likes?.includes(session.user.email) : false);

    } catch (error) {
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);  // Stop loading regardless of success/failure
    }
  }, [id, session?.user?.email]);  // Dependencies for useCallback

  // Function to fetch related blogs in same category
  const fetchRelatedBlogs = useCallback(async () => {
    if (!blog) return;  // Don't fetch if no blog loaded yet

    try {
      // Get blogs in same category, limit to 3, only published ones
      const res = await fetch(
        `/api/blogs/category/${blog.category}?limit=3&published=true`
      );

      if (res.ok) {
        const data = await res.json();
        // Filter out current blog from results
        setRelatedBlogs(data.blogs.filter((b: Blog) => b._id !== id));
      }
    } catch (error) {
      console.error('Failed to fetch related blogs');  // Non-blocking error
    }
  }, [blog, id]);

  // Effect: Fetch blog when component mounts or ID changes
  useEffect(() => {
    if (id) {  // Only fetch if ID exists (handles initial load)
      fetchBlog();
    }
  }, [id, fetchBlog]);

  // Effect: Fetch related blogs after blog data loads
  useEffect(() => {
    if (blog) {  // Only fetch after blog is available
      fetchRelatedBlogs();
    }
  }, [blog, fetchRelatedBlogs]);

  // Handle like/unlike functionality
  const handleLike = async () => {
    if (!session?.user?.id) return;  // Require authentication

    try {
      // Determine action based on current state
      const action = liked ? 'unlike' : 'like';

      // Send POST request to same API endpoint
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,  // 'like' or 'unlike'
          userId: session.user.email  // User's email as identifier
        }),
      });

      if (!res.ok) throw new Error('Failed to update like');

      // Update local state with server response
      const data = await res.json();
      setLiked(data.liked);  // Updated like status
      setLikesCount(data.likes);  // Updated count

    } catch (error) {
      console.error('Like error:', error);  // Log error, don't show to user
    }
  };

  // Handle comment submission
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent form default submission

    // Validation: require auth and non-empty comment
    if (!session?.user?.email || !newComment.trim()) return;

    setSubmitting(true);  // Show loading state

    try {
      // Send comment data to API
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.email,
          userName: session.user.name || 'Anonymous',
          comment: newComment.trim(),  // Clean whitespace
        }),
      });

      if (!res.ok) throw new Error('Failed to add comment');

      // Add new comment to local state immediately (optimistic update)
      const newCommentData = await res.json();
      setComments([...comments, newCommentData]);

      // Clear form
      setNewComment('');

    } catch (error) {
      console.error('Comment error:', error);
    } finally {
      setSubmitting(false);  // Reset loading state
    }
  };

  // Handle share functionality
  const handleShare = () => {
    if (navigator.share) {  // Check if Web Share API available (mobile)
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt || blog?.title,
        url: window.location.href,  // Current page URL
      });
    } else {  // Fallback for desktop
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Calculate reading time estimate
  const readingTime = blog ?
    Math.ceil(blog.content.split(' ').length / 200) : 0;  // 200 words per minute

  // Loading state UI
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  // Error state UI
  if (error || !blog) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
        <p className="text-gray-600">{error || 'Blog not found'}</p>
      </div>
    </div>
  );

  // Prepare display date
  const displayDate = getDisplayDate({
    publishedAt: blog.publishedAt || undefined,
    createdAt: blog.createdAt
  });

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Category badge and reading time */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium uppercase">
              {blog.category}
            </span>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{readingTime} min read</span>
            </div>
          </div>

          {/* Blog title */}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Author info and share button */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{blog.author}</p>
                  <p className="text-sm text-gray-500">{formatDate(displayDate)}</p>
                </div>
              </div>
            </div>

            <button onClick={handleShare} className="...">
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {/* Blog image */}
          {blog.imageUrl && (
            <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden mb-8">
              <Image
                src={blog.imageUrl}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Blog content - HTML rendered from database */}
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags section */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Engagement Section - Likes and Comments */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          {/* Like and comment counts */}
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={handleLike}
              disabled={!session?.user}  // Disabled if not logged in
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${
                liked ? 'bg-red-50 text-red-600 border-2 border-red-200' :
                        'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
              } ${!session?.user ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </button>

            <div className="flex items-center gap-3 text-gray-600">
              <MessageCircle className="w-6 h-6" />
              <span className="font-medium">{comments.length} Comments</span>
            </div>
          </div>

          {/* Comment form - only for authenticated users */}
          {session?.user ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}  // Controlled component
                    onChange={(e) => setNewComment(e.target.value)}  // Update state
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}  // Validation
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* Sign-in prompt for non-authenticated users */
            <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
              <p className="text-gray-600 mb-4">Join the conversation</p>
              <Link href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments display */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="flex gap-4 pb-6 border-b border-gray-100 last:border-b-0">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-gray-900">{comment.userName}</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <ArticleCard
                  key={relatedBlog._id}
                  blog={relatedBlog}
                  variant="compact"
                  className="h-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
```

**Key Learning Points:**
- `useParams()` extracts dynamic route parameters
- `useCallback()` prevents unnecessary re-renders of functions
- Optimistic UI updates (immediate feedback, then server sync)
- Proper loading and error states
- Authentication checks for protected actions
- `dangerouslySetInnerHTML` for rendering stored HTML content

## API Routes

The backend API that handles data operations.

```tsx
// File: src/app/api/blogs/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog, { IBlog } from '@/app/models/blog';

// GET handler - Fetch single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();  // Connect to MongoDB

    const { id } = await params;  // Extract ID from URL
    const blog = await Blog.findById(id);  // Query database

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);  // Return blog data
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST handler - Handle likes and comments
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();  // Parse request body
    const { action, userId, userName, comment } = body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    // Handle like/unlike actions
    if (action === 'like' || action === 'unlike') {
      if (!userId || !['like', 'unlike'].includes(action)) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
      }

      blog.likes = blog.likes || [];  // Initialize if undefined

      if (action === 'like') {
        if (!blog.likes.includes(userId)) {  // Prevent duplicates
          blog.likes.push(userId);  // Add user to likes
        }
      } else if (action === 'unlike') {
        blog.likes = blog.likes.filter((like: string) => like !== userId);  // Remove user
      }

      await blog.save();  // Save to database

      return NextResponse.json({
        likes: blog.likes.length,  // Return updated count
        liked: blog.likes.includes(userId)  // Return user's like status
      });
    }

    // Handle comment submission
    if (comment !== undefined) {
      if (!userId || !userName || !comment) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }

      blog.comments = blog.comments || [];  // Initialize comments array
      blog.comments.push({  // Add new comment
        userId,
        userName,
        comment,
        createdAt: new Date().toISOString()  // Timestamp
      });

      await blog.save();  // Save to database

      return NextResponse.json(blog.comments[blog.comments.length - 1]);  // Return new comment
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
```

**Key Learning Points:**
- Single API endpoint handles multiple actions via request body
- Proper validation and error handling
- Database operations with Mongoose
- RESTful response patterns

## Data Models

The database schema definitions.

```tsx
// File: src/app/models/blog.ts

import mongoose, { Document, Schema } from 'mongoose';

// Comment interface and schema
export interface IComment {
  userId: string;    // Who made the comment
  userName: string;  // Display name
  comment: string;   // Comment content
  createdAt: string; // ISO timestamp
}

const commentSchema = new Schema<IComment>({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()  // Auto-generate timestamp
  }
});

// Blog interface and schema
export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  likes: string[];      // Array of user IDs who liked
  comments: IComment[]; // Array of comment objects
}

const blogSchema = new Schema<IBlog>({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  author: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'trending', 'hotspot', 'Editors', 'featured', 'other', 'world', 'sports', 'tech', 'modern', 'swimming', 'boxing', 'basketball', 'football'],
    default: 'other'
  },
  tags: [{ type: String, trim: true }],
  imageUrl: { type: String, trim: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: String },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  likes: [{ type: String }],  // Simple array of user identifiers
  comments: [commentSchema]   // Subdocument array for comments
});

// Pre-save middleware to update timestamps
blogSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

// Database indexes for performance
blogSchema.index({ category: 1, published: 1, publishedAt: -1 });  // Category filtering
blogSchema.index({ title: 'text', content: 'text' });  // Text search
blogSchema.index({ 'comments.userId': 1 });  // Comment queries

// Prevent model redefinition
delete mongoose.models.Blog;
const Blog = mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;
```

**Key Learning Points:**
- Mongoose schemas define data structure and validation
- Subdocuments for complex nested data (comments)
- Indexes improve query performance
- Default values and validation rules

## Complete User Flow

1. **Navigation**: User clicks ArticleCard → Next.js routes to `/blogs/[id]`
2. **Page Load**: Component mounts → `useParams()` gets ID → `fetchBlog()` called
3. **API Call**: GET `/api/blogs/{id}` → Database query → Blog data returned
4. **State Update**: Blog data stored in state → UI renders
5. **Related Fetch**: After blog loads → Fetch related blogs in same category
6. **User Interaction**:
   - **Like**: Click heart → `handleLike()` → POST to API → Database update → UI updates
   - **Comment**: Submit form → `handleComment()` → POST to API → Database update → Comments list updates
7. **Real-time Updates**: All changes reflect immediately in UI

## Implementation Tips for Your Project

1. **Start with the data model** - Define your schema first
2. **Create API routes** - Build backend endpoints before frontend
3. **Implement navigation** - ArticleCard with Link components
4. **Add state management** - Use React hooks for local state
5. **Handle authentication** - Protect interactions with session checks
6. **Add error handling** - Loading states, error messages, validation
7. **Optimize performance** - useCallback, indexes, image optimization

This implementation provides a complete, production-ready blog detail system with likes, comments, and related articles. Each component is modular and reusable, making it easy to adapt for your own projects.