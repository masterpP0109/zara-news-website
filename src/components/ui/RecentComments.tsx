interface Comment {
  blogId: string;
  blogTitle: string;
  comment: {
    userId: string;
    userName: string;
    comment: string;
    createdAt: string;
  };
}

interface RecentCommentsProps {
  comments: Comment[];
}

const RecentComments = ({ comments }: RecentCommentsProps) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-900 dark:text-white text-lg font-semibold">Recent Comments</h3>
        <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-sm font-medium">
          See all
        </button>
      </div>

      <div className="space-y-4">
        {comments.map((item, index) => (
          <div key={`${item.blogId}-${index}`} className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-100 dark:border-slate-600">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                {item.comment.userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-gray-900 dark:text-white text-sm font-medium">{item.comment.userName}</span>
                  <span className="text-gray-500 dark:text-slate-400 text-xs">
                    on {item.blogTitle}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-slate-300 text-sm leading-relaxed line-clamp-2">
                  {item.comment.comment}
                </p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-gray-500 dark:text-slate-500 text-xs">
                    {new Date(item.comment.createdAt).toLocaleDateString()}
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

export default RecentComments;