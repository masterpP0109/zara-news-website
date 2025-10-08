import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog from '@/app/models/blog';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Aggregate to get recent comments from all blogs
    const recentComments = await Blog.aggregate([
      // Only include published blogs
      { $match: { published: true } },
      // Unwind the comments array
      { $unwind: '$comments' },
      // Sort by comment createdAt descending
      { $sort: { 'comments.createdAt': -1 } },
      // Limit the results
      { $limit: limit },
      // Project the needed fields
      {
        $project: {
          _id: 0,
          blogId: '$_id',
          blogTitle: '$title',
          comment: '$comments'
        }
      }
    ]);

    return NextResponse.json(recentComments);
  } catch (error) {
    console.error('Error fetching recent comments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}