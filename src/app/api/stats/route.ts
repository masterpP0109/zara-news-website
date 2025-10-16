import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/app/models/user';
import Blog from '@/app/models/blog';

export async function GET() {
  try {
    await connectToDatabase();

    // Get total users
    const totalUsers = await User.countDocuments();

    // Get total blogs/posts
    const totalPosts = await Blog.countDocuments();

    // Get total comments by aggregating from all blogs
    const commentStats = await Blog.aggregate([
      {
        $group: {
          _id: null,
          totalComments: { $sum: { $size: '$comments' } },
          totalLikes: { $sum: { $size: '$likes' } }
        }
      }
    ]);

    const totalComments = commentStats[0]?.totalComments || 0;
    const totalLikes = commentStats[0]?.totalLikes || 0;

    // Get published posts count
    const publishedPosts = await Blog.countDocuments({ published: true });

    return NextResponse.json({
      totalUsers,
      totalPosts,
      publishedPosts,
      totalComments,
      totalLikes
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}