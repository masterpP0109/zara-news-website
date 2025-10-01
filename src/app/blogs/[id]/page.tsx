"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MessageCircle, User, Share2, Clock, Tag } from 'lucide-react';
import { formatDate, getDisplayDate } from '@/lib/dateUtils';
import { Blog } from '@/types/blog';
import { IComment } from '@/app/models/blog';
import { ArticleCard } from '@/components/ui/ArticleCard';

const BlogDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  const fetchBlog = useCallback(async () => {
    try {
      const res = await fetch(`/api/blogs/${id}`);
      if (!res.ok) throw new Error('Failed to fetch blog');
      const data: Blog = await res.json();
      setBlog(data);
      setLikesCount(data.likes?.length || 0);
      setComments(data.comments || []);
      setLiked(session?.user?.id ? data.likes?.includes(session.user.id) : false);
    } catch {
      setError('Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  }, [id, session?.user?.id]);

  const fetchRelatedBlogs = useCallback(async () => {
    if (!blog) return;
    try {
      const res = await fetch(`/api/blogs/category/${blog.category}?limit=3&published=true`);
      if (res.ok) {
        const data = await res.json();
        setRelatedBlogs(data.blogs.filter((b: Blog) => b._id !== id));
      }
    } catch {
      console.error('Failed to fetch related blogs');
    }
  }, [blog, id]);

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id, fetchBlog]);

  useEffect(() => {
    if (blog) {
      fetchRelatedBlogs();
    }
  }, [blog, fetchRelatedBlogs]);

  const handleLike = async () => {
    if (!session?.user?.id) return;
    try {
      const action = liked ? 'unlike' : 'like';
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId: session.user.id }),
      });
      if (!res.ok) throw new Error('Failed to update like');
      const data = await res.json();
      setLiked(data.liked);
      setLikesCount(data.likes);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          userName: session.user.name || 'Anonymous',
          comment: newComment.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to add comment');
      const newCommentData = await res.json();
      setComments([...comments, newCommentData]);
      setNewComment('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt || blog?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const readingTime = blog ? Math.ceil(blog.content.split(' ').length / 200) : 0;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (error || !blog) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h1>
        <p className="text-gray-600">{error || 'Blog not found'}</p>
      </div>
    </div>
  );

  const displayDate = getDisplayDate({
    publishedAt: blog.publishedAt || undefined,
    createdAt: blog.createdAt
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium uppercase">
              {blog.category}
            </span>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{readingTime} min read</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>

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

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

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

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          {/* Tags */}
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

        {/* Engagement Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={handleLike}
              disabled={!session?.user}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${
                liked
                  ? 'bg-red-50 text-red-600 border-2 border-red-200'
                  : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:bg-gray-100'
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

          {/* Add Comment */}
          {session?.user ? (
            <form onSubmit={handleComment} className="mb-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={submitting || !newComment.trim()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg mb-8">
              <p className="text-gray-600 mb-4">Join the conversation</p>
              <Link href="/login" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign In to Comment
              </Link>
            </div>
          )}

          {/* Comments */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No comments yet. Be the first to share your thoughts!</p>
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

        {/* Related Articles */}
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