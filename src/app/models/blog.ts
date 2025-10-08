import mongoose, { Document, Schema } from 'mongoose';

export interface IComment {
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: 'politics' | 'Politics' | 'trending' | 'Trending' | 'hotspot' | 'hotSpot' | 'HotSpot' | 'Editors' | 'featured' | 'Featured' | 'other' | 'world' | 'World' | 'sports' | 'Sports' | 'tech' | 'Tech' | 'modern' | 'Modern' | 'swimming' | 'Swimming' | 'boxing' | 'Boxing' | 'basketball' | 'Basketball' | 'football' | 'Football';
  tags?: string[];
  imageUrl?: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  likes: string[]; // Array of user IDs who liked
  comments: IComment[];
}

const commentSchema = new Schema<IComment>({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  }
});

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    maxlength: 300
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'Politics', 'trending', 'Trending', 'hotspot', 'hotSpot', 'HotSpot', 'Editors', 'featured', 'Featured', 'other', 'world', 'World', 'sports', 'Sports', 'tech', 'Tech', 'modern', 'Modern', 'swimming', 'Swimming', 'boxing', 'Boxing', 'basketball', 'Basketball', 'football', 'Football'],
    default: 'other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: String
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  likes: [{
    type: String // User IDs
  }],
  comments: [commentSchema]
});

// Update the updatedAt field before saving
blogSchema.pre('save', function(next) {
  this.updatedAt = new Date().toISOString();
  next();
});

// Index for better query performance
blogSchema.index({ category: 1, published: 1, publishedAt: -1 });
blogSchema.index({ title: 'text', content: 'text' });
blogSchema.index({ 'comments.userId': 1 });

delete mongoose.models.Blog;
const Blog = mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;