import Link from 'next/link';
import DateDisplay from '@/components/dateDisplay';

interface Blog {
  _id: string;
  title: string;
  category: string;
  published: boolean;
  createdAt: string;
  author: string;
}

interface BlogListProps {
  blogs: Blog[];
  loading: boolean;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  title: string;
  showAuthor?: boolean;
}

const BlogList = ({
  blogs,
  loading,
  onTogglePublish,
  onDelete,
  title,
  showAuthor = true
}: BlogListProps) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-gray-800 text-xl font-bold">{title}</h3>
        <Link
          href="/admin/blogs/create"
          className="bg-gradient-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)]"
        >
          Create New Post
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Loading posts...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-slate-400">No posts found</p>
          <Link
            href="/admin/blogs/create"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mt-2 inline-block"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] hover:shadow-[8px_8px_16px_rgba(163,177,198,0.6),-8px_-8px_16px_rgba(255,255,255,0.8)] transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-800 font-bold text-lg mb-2 truncate">
                    {blog.title}
                  </h4>
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    {showAuthor && <span className="font-medium">By {blog.author}</span>}
                    <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">{blog.category}</span>
                    <span className="font-medium"><DateDisplay date={blog.createdAt} /></span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 ml-6">
                  <span className={`inline-flex px-4 py-2 text-xs font-bold rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.1)] ${
                    blog.published
                      ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                  <button
                    onClick={() => onTogglePublish(blog._id, blog.published)}
                    className="text-rose-500 hover:text-rose-600 text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] transition-all duration-300"
                  >
                    {blog.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <Link
                    href={`/blogs/${blog._id}`}
                    className="text-blue-500 hover:text-blue-600 text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] transition-all duration-300"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/blogs/${blog._id}/edit`}
                    className="text-rose-500 hover:text-rose-600 text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] transition-all duration-300"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => onDelete(blog._id)}
                    className="text-red-500 hover:text-red-600 text-sm font-semibold px-3 py-2 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-[4px_4px_8px_rgba(163,177,198,0.4),-4px_-4px_8px_rgba(255,255,255,0.6)] hover:shadow-[6px_6px_12px_rgba(163,177,198,0.5),-6px_-6px_12px_rgba(255,255,255,0.7)] transition-all duration-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;