'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Crown,
  LogOut,
  Users,
  FileText,
  Eye,
  TrendingUp
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const AdminSidebar = ({ isOpen = true, onToggle }: AdminSidebarProps) => {
  const pathname = usePathname();
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalUsers: 0,
    totalComments: 0
  });

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
    },
    {
      name: 'All Posts',
      href: '/admin/posts',
    },
    {
      name: 'Create Post',
      href: '/admin/blogs/create',
    },
    {
      name: 'Profile',
      href: '/admin/profile',
    },
    {
      name: 'Settings',
      href: '/admin/settings',
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className={`w-72 bg-gradient-to-b from-gray-50 to-gray-100 shadow-[8px_0_16px_rgba(163,177,198,0.6),-8px_0_16px_rgba(255,255,255,0.8)] flex flex-col rounded-r-3xl fixed md:relative z-50 h-full transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo */}
      <div className="p-8 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-500/90 rounded-2xl flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.1)]">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-800 font-bold text-xl">Admin</h1>
            <p className="text-gray-600 text-sm">Blog Management</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-6">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`block px-4 py-3 rounded-2xl transition-all duration-300 text-center font-semibold ${
                    isActive
                      ? 'bg-rose-500/90 text-white shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.1)]'
                      : 'text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)]'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="px-6 pb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Quick Stats</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Posts</span>
            </div>
            <span className="text-sm font-bold text-blue-600">{stats.totalPosts}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Published</span>
            </div>
            <span className="text-sm font-bold text-green-600">{stats.publishedPosts}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Users</span>
            </div>
            <span className="text-sm font-bold text-purple-600">{stats.totalUsers}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Comments</span>
            </div>
            <span className="text-sm font-bold text-orange-600">{stats.totalComments}</span>
          </div>
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-6 border-t border-gray-300">
        <button className="flex items-center justify-center px-4 py-3 w-full text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 hover:shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] rounded-2xl transition-all duration-300 font-semibold">
          <LogOut className="w-5 h-5 mr-2 text-rose-500" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;