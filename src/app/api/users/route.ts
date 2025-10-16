import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/app/models/user';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent users, sorted by creation date
    const recentUsers = await User.find({})
      .select('name email createdAt role')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Get total user count
    const totalUsers = await User.countDocuments();

    return NextResponse.json({
      users: recentUsers,
      total: totalUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}