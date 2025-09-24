import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';

dotenv.config({ path: '.env.local' });

const blogData = JSON.parse(fs.readFileSync('./data.json', 'utf8'));

// Blog Schema (matching the TypeScript interface)
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  content: { type: String, required: true },
  excerpt: { type: String, maxlength: 300 },
  author: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['Politics', 'Trending', 'HotSpot', 'Editors', 'Featured', 'Other', 'World', 'Sports', 'Tech', 'Modern', 'Swimming', 'Boxing', 'Basketball', 'Football'],
    default: 'other'
  },
  tags: [{ type: String, trim: true }],
  imageUrl: { type: String, trim: true },
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
blogSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for better query performance
blogSchema.index({ category: 1, published: 1, publishedAt: -1 });
blogSchema.index({ title: 'text', content: 'text' });

const Blog = mongoose.model('Blog', blogSchema);


async function seedDatabase() {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI environment variable is not set');
      console.error('Please set your MongoDB connection string in .env.local');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('Database:', mongoose.connection.db.databaseName);

    // Clear existing data
    console.log('🧹 Clearing existing blog data...');
    await Blog.deleteMany({});

    // Insert new data
    console.log('📝 Inserting comprehensive blog data...');
    const insertedBlogs = await Blog.insertMany(blogData);

    console.log(`✅ Successfully seeded ${insertedBlogs.length} blogs!`);
    console.log('📊 Blog distribution by category:');

    const categoryStats = await Blog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} blogs`);
    });

    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedDatabase();
