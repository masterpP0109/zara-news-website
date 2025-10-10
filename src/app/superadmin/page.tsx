'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardSidebar from '@/components/ui/DashboardSidebar';
import StatCard from '@/components/ui/StatCard';
import RecentUsers from '@/components/ui/RecentUsers';
import RecentBlogs from '@/components/ui/RecentBlogs';
import BlogList from '@/components/ui/BlogList';
import { Menu } from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

interface Blog {
  _id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
  author: string;
}


interface Stats {
  totalUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalComments: number;
  totalLikes: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, recentBlogsRes, allBlogsRes] = await Promise.all([
        fetch('/api/stats'),
        fetch('/api/users?limit=5'),
        fetch('/api/blogs?limit=5'),
        fetch('/api/blogs?limit=100') // For superadmin, fetch more blogs
      ]);

      const [statsData, usersData, recentBlogsData, allBlogsData] = await Promise.all([
        statsRes.json(),
        usersRes.json(),
        recentBlogsRes.json(),
        allBlogsRes.json()
      ]);

      setStats(statsData);
      setRecentUsers(usersData.users || []);
      setRecentBlogs(recentBlogsData.blogs || []);
      setAllBlogs(allBlogsData.blogs || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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
        setAllBlogs(allBlogs.filter(blog => blog._id !== id));
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
        setAllBlogs(allBlogs.map(blog =>
          blog._id === id ? { ...blog, published: !currentStatus } : blog
        ));
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
        <DashboardSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

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
                    Welcome back, {session?.user?.name || 'Super Admin'}
                  </h1>
                  <p className="text-gray-600 text-sm md:text-base">
                    Here is what is happening with your blog today.
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
                title="Total Users"
                value={stats?.totalUsers || 0}
                change="↑ 12% from last month"
              />
              <StatCard
                title="Total Comments"
                value={stats?.totalComments || 0}
                change="↑ 8% from last month"
              />
              <StatCard
                title="Published Posts"
                value={stats?.publishedPosts || 0}
                change="↑ 15% from last month"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecentUsers users={recentUsers} />
              <RecentBlogs blogs={recentBlogs} />
            </div>

            {/* Blog Management */}
            <div className="mt-8">
              <BlogList
                blogs={allBlogs}
                loading={loading}
                onTogglePublish={togglePublish}
                onDelete={deleteBlog}
                title="All Posts"
                showAuthor={true}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}