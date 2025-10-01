'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import DateDisplay from '@/components/dateDisplay';

interface Blog {
  _id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
  author: string;
}

export default function SuperAdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?limit=10');
      const data = await response.json();
      setBlogs(data.blogs || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBlogs(blogs.filter(blog => blog._id !== id));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published: !currentStatus }),
      });

      if (response.ok) {
        setBlogs(blogs.map(blog =>
          blog._id === id ? { ...blog, published: !currentStatus } : blog
        ));
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">{session?.user?.name}&apos;s Super Admin Dashboard</h1>
            <Link
              href="/admin/blogs/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              Create New Blog
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">Recent Blogs</h2>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No blogs found</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <li key={blog._id} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                      <p className="text-sm text-gray-500">
                        By {blog.author} • {blog.category} • <DateDisplay date={blog.createdAt} />
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.published ? 'Published' : 'Draft'}
                      </span>
                      <button
                        onClick={() => togglePublish(blog._id, blog.published)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        {blog.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <Link
                        href={`/admin/blogs/${blog._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteBlog(blog._id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}