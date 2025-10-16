'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import UserSidebar from '@/components/ui/UserSidebar';
import StatCard from '@/components/ui/StatCard';
import ProfileCard from '@/components/ui/ProfileCard';
import BlogList from '@/components/ui/BlogList';
import { Menu } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
  author: string;
}

interface UserStats {
  totalPosts: number;
  publishedPosts: number;
  totalComments: number;
  totalLikes: number;
}

export default function UserDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const fetchDashboardData = useCallback(async () => {
    try {
      const [blogsRes, statsRes] = await Promise.all([
        fetch(`/api/blogs?limit=10&author=${session?.user?.name}`),
        fetch('/api/stats')
      ]);

      const [blogsData, statsData] = await Promise.all([
        blogsRes.json(),
        statsRes.json()
      ]);

      setBlogs(blogsData.blogs || []);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <UserSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <div className="flex-1 md:ml-0">
          {/* Header */}
          <header className="bg-gradient-to-br from-gray-50 to-gray-100 px-4 md:px-8 py-6 shadow-[0_4px_8px_rgba(163,177,198,0.4),0_-4px_8px_rgba(255,255,255,0.6)] rounded-bl-3xl md:rounded-bl-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-800">
                    Welcome back, {session?.user?.name || 'User'}
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">
                    Manage your blog posts and track your activity.
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="My Posts"
                value={blogs.filter(blog => blog.author === session?.user?.name).length}
                change="Your published content"
              />
              <StatCard
                title="Published Posts"
                value={blogs.filter(blog => blog.published && blog.author === session?.user?.name).length}
                change="Live on the site"
              />
              <StatCard
                title="Total Comments"
                value={stats?.totalComments || 0}
                change="Community engagement"
              />
            </div>

            {/* Profile and Blog List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ProfileCard />
              </div>
              <div className="lg:col-span-2">
                <BlogList
                  blogs={blogs}
                  loading={loading}
                  onTogglePublish={togglePublish}
                  onDelete={deleteBlog}
                  title="Your Recent Posts"
                  showAuthor={false}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}