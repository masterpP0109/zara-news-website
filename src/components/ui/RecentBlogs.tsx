interface Blog {
  _id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
  author: string;
}

interface RecentBlogsProps {
  blogs: Blog[];
}

const RecentBlogs = ({ blogs }: RecentBlogsProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-800 text-xl font-bold">Recent Blogs</h3>
        <button className="text-purple-600 hover:text-purple-700 text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] transition-all duration-300">
          See all
        </button>
      </div>

      <div className="space-y-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] transition-all duration-300">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {blog.title.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-800 text-sm font-medium truncate">{blog.title}</span>
                  <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] ${
                    blog.published
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  By {blog.author} • {blog.category}
                </p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className="text-gray-500 text-xs">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentBlogs;