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

async function updateImageUrls() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable is not set');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB Atlas successfully');

    // Update imageUrl fields to prepend "/images/" if not already present
    const result = await Blog.updateMany(
      { imageUrl: { $exists: true, $not: { $regex: /^\/images\// } } },
      [
        {
          $set: {
            imageUrl: { $concat: ["/images/", "$imageUrl"] },
            updatedAt: new Date().toISOString()
          }
        }
      ]
    );

    console.log(`Updated ${result.modifiedCount} blog documents to prepend "/images/" to imageUrl`);

    // Also update category to uppercase if needed
    const categoryResult = await Blog.updateMany(
      { category: "editors" },
      { $set: { category: "Editors", updatedAt: new Date().toISOString() } }
    );

    console.log(`Updated ${categoryResult.modifiedCount} blog documents with lowercase categories`);

  } catch (error) {
    console.error('Error updating database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

updateImageUrls();