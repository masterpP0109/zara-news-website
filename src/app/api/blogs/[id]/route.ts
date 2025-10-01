// File: src/app/api/blogs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Blog, { IBlog } from '@/app/models/blog';

const VALID_CATEGORIES = [
  'politics',
  'trending',
  'hotSpot',
  'editors',
  'featured',
  'other',
];

// ------------------ GET Single Blog ------------------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ------------------ UPDATE Blog ------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      author,
      category,
      tags,
      imageUrl,
      published,
    } = body;

    // Basic validation
    if (title && title.length > 200) {
      return NextResponse.json(
        { message: 'Title must be less than 200 characters' },
        { status: 400 }
      );
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json({ message: 'Invalid category' }, { status: 400 });
    }

    const blogData: Partial<IBlog> = {};

    if (title !== undefined) blogData.title = title.trim();
    if (content !== undefined) blogData.content = content;
    if (excerpt !== undefined) blogData.excerpt = excerpt;
    if (author !== undefined) blogData.author = author.trim();
    if (category !== undefined) blogData.category = category;
    if (tags !== undefined)
      blogData.tags = Array.isArray(tags)
        ? tags.map((tag) => tag.trim())
        : [];
    if (imageUrl !== undefined) blogData.imageUrl = imageUrl;
    if (published !== undefined) {
      blogData.published = Boolean(published);
      if (published && !blogData.publishedAt) {
        // Only set publishedAt if blog is being published for the first time
        const existingBlog = await Blog.findById(id).select('publishedAt');
        if (!existingBlog?.publishedAt) {
          blogData.publishedAt = new Date().toISOString();
        }
      } else if (!published) {
        blogData.publishedAt = null;
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, blogData, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ------------------ LIKE/UNLIKE or ADD COMMENT ------------------
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { action, userId, userName, comment } = body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    // Handle like/unlike
    if (action === 'like' || action === 'unlike') {
      if (!userId || !['like', 'unlike'].includes(action)) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
      }

      blog.likes = blog.likes || [];
      if (action === 'like') {
        if (!blog.likes.includes(userId)) {
          blog.likes.push(userId);
        }
      } else if (action === 'unlike') {
        blog.likes = blog.likes.filter((like: string) => like !== userId);
      }

      await blog.save();

      return NextResponse.json({ likes: blog.likes.length, liked: blog.likes.includes(userId) });
    }

    // Handle comment
    if (comment !== undefined) {
      if (!userId || !userName || !comment) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }

      blog.comments = blog.comments || [];
      blog.comments.push({
        userId,
        userName,
        comment,
        createdAt: new Date().toISOString()
      });

      await blog.save();

      return NextResponse.json(blog.comments[blog.comments.length - 1]);
    }

    return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ------------------ DELETE Blog ------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
