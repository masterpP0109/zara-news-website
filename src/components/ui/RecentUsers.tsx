interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role: string;
}

interface RecentUsersProps {
  users: User[];
}

const RecentUsers = ({ users }: RecentUsersProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      'bg-cyan-500',
      'bg-purple-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-pink-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-800 text-xl font-bold">Recent Users</h3>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] transition-all duration-300">
          See all
        </button>
      </div>

      <div className="space-y-4">
        {users.map((user, index) => (
          <div key={user._id} className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] transition-all duration-300">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${getAvatarColor(index)}`}>
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-800 text-sm font-medium truncate">{user.name}</p>
              <p className="text-gray-600 text-xs truncate">{user.email}</p>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === 'superadmin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                user.role === 'admin' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {user.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;