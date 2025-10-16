import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '.env.local' });

// Comment Schema
const commentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  author: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'trending', 'hotSpot', 'editors', 'featured', 'other', 'world', 'sports', 'tech', 'modern', 'swimming', 'boxing', 'basketball', 'football'],
    default: 'other'
  },
  tags: [{ type: String, trim: true }],
  imageUrl: { type: String, trim: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() },
  likes: [{ type: String }],
  comments: [commentSchema]
});

const Blog = mongoose.model('Blog', blogSchema);

async function updateTrendingImages() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB Atlas successfully');

    // Get all trending blogs
    const trendingBlogs = await Blog.find({ category: { $in: ['trending', 'Trending'] }, published: true }).sort({ publishedAt: -1 });

    console.log(`Found ${trendingBlogs.length} trending blogs`);

    // Available images for trending blogs (using article images 1-15, excluding ones already used if possible)
    const availableImages = [
      '/images/article_image1.jpg',
      '/images/article_image2.jpg',
      '/images/article_image3.jpg',
      '/images/article_image4.jpg',
      '/images/article_image5.jpg',
      '/images/article_image6.jpg',
      '/images/article_image7.jpg',
      '/images/article_image8.jpg',
      '/images/article_image9.jpg',
      '/images/article_image10.jpg',
      '/images/article_image11.jpg',
      '/images/article_image12.jpg',
      '/images/article_image13.jpg',
      '/images/article_image14.jpg',
      '/images/article_image15.jpg',
      '/images/trendingArticle.jpg',
      '/images/trendingArticle.png'
    ];

    // Assign unique images to each trending blog
    for (let i = 0; i < trendingBlogs.length; i++) {
      const blog = trendingBlogs[i];
      const newImageUrl = availableImages[i % availableImages.length];

      await Blog.updateOne(
        { _id: blog._id },
        {
          $set: {
            imageUrl: newImageUrl,
            updatedAt: new Date().toISOString()
          }
        }
      );

      console.log(`Updated blog "${blog.title}" with image: ${newImageUrl}`);
    }

    console.log(`Successfully updated ${trendingBlogs.length} trending blogs with unique images`);

  } catch (error) {
    console.error('Error updating database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

updateTrendingImages();