import { useSession } from 'next-auth/react';

const ProfileCard = () => {
  const { data: session } = useSession();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-4 md:p-8 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)]">
      <h3 className="text-gray-800 text-xl font-bold mb-6">Profile Information</h3>

      <div className="flex items-center space-x-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white text-2xl font-bold shadow-[inset_4px_4px_8px_rgba(255,255,255,0.3),inset_-4px_-4px_8px_rgba(0,0,0,0.1)]">
          {session?.user?.name ? getInitials(session.user.name) : 'U'}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-gray-800 font-bold text-xl truncate">
            {session?.user?.name || 'User'}
          </h4>
          <p className="text-gray-600 text-base truncate">
            {session?.user?.email || 'user@example.com'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)]">
          <label className="block text-sm font-semibold text-gray-700">Name</label>
          <p className="mt-2 text-base text-gray-800 font-medium truncate">{session?.user?.name || 'N/A'}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)]">
          <label className="block text-sm font-semibold text-gray-700">Email</label>
          <p className="mt-2 text-base text-gray-800 font-medium truncate">{session?.user?.email || 'N/A'}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)]">
          <label className="block text-sm font-semibold text-gray-700">Role</label>
          <p className="mt-2 text-base text-gray-800 font-medium capitalize">{session?.user?.role || 'user'}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)]">
          <label className="block text-sm font-semibold text-gray-700">Account Status</label>
          <p className="mt-2 text-base text-rose-500 font-bold">Active</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;