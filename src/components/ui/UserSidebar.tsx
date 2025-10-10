'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LogOut,
  UserCircle
} from 'lucide-react';

interface UserSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const UserSidebar = ({ isOpen = true, onToggle }: UserSidebarProps) => {
  const pathname = usePathname();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/user',
    },
    {
      name: 'My Posts',
      href: '/user/posts',
    },
    {
      name: 'Create Post',
      href: '/admin/blogs/create',
    },
    {
      name: 'Profile',
      href: '/user/profile',
    },
    {
      name: 'Settings',
      href: '/user/settings',
    },
  ];

  return (
    <div className={`w-72 bg-gradient-to-b from-gray-50 to-gray-100 shadow-[8px_0_16px_rgba(163,177,198,0.6),-8px_0_16px_rgba(255,255,255,0.8)] flex flex-col rounded-r-3xl fixed md:relative z-50 h-full transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      {/* Logo */}
      <div className="p-8 border-b border-gray-300">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-rose-500/90 rounded-2xl flex items-center justify-center shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.1)]">
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-800 font-bold text-xl">User</h1>
            <p className="text-gray-600 text-sm">My Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6">
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

export default UserSidebar;