# ArticleCard Component: Routing and Usage in Zara News Website

## Overview

The `ArticleCard` component is a reusable React component in the Zara News website that displays blog article previews in various layouts. It plays a crucial role in the application's routing system by providing clickable links to individual blog detail pages.

## Component Structure

### File Location
```
src/components/ui/ArticleCard.tsx
```

### Props Interface
```typescript
interface ArticleCardProps {
  blog: Blog;
  variant?: 'featured' | 'sidebar' | 'compact';
  className?: string;
  showImage?: boolean;
  showExcerpt?: boolean;
}
```

### Variants

The component supports three different display variants:

1. **Featured** (default): Full-width card with image, title, category, author, and date
2. **Sidebar**: Horizontal layout with circular image, optimized for sidebars
3. **Compact**: Smaller card with image, title, and metadata, used in grids

## Routing Mechanism

### Link Structure
Each `ArticleCard` wraps its content in a Next.js `Link` component that navigates to:
```
/blogs/${blog._id}
```

Where `blog._id` is the unique identifier of the blog post.

### Dynamic Route Handling
The routing connects to the dynamic route file:
```
src/app/blogs/[id]/page.tsx
```

This page component:
- Uses `useParams()` to extract the blog ID from the URL
- Fetches the full blog data from `/api/blogs/${id}`
- Displays the complete article with comments, likes, and related articles

## Usage Across the Application

### 1. Featured Section (`src/app/featured.tsx`)
- Displays featured articles on the homepage
- Uses `variant="featured"`
- Fetches data from `/api/blogs/category/Featured`

### 2. Sidebar Component (`src/app/Sidebar.tsx`)
- Shows recent or trending articles in sidebar layout
- Uses `variant="sidebar"`
- Provides quick navigation to articles

### 3. Editor's Picks (`src/app/editorsPicks.tsx`)
- Displays curated articles selected by editors
- Uses `variant="compact"` in carousel layout
- Similar to featured section but different data source

### 4. Business Sidebar (`src/components/businessSideBar.tsx`)
- Specialized sidebar for business category articles
- Uses `variant="sidebar"`

### 5. Search Results (`src/components/SearchPageContent.tsx`)
- Displays search results using ArticleCard
- Uses `variant="featured"` for grid layout

### 6. Blog Detail Page (`src/app/blogs/[id]/page.tsx`)
- Uses ArticleCard for "Related Articles" section
- Uses `variant="compact"` to show related blogs in a grid

### 7. World Top News (`src/components/worldTopNews.tsx`)
- Displays featured article with custom layout (wrapped with Link)
- Shows additional articles using `variant="sidebar"`
- Fetches from multiple categories

### 8. Sports (`src/components/sports.tsx`)
- Displays featured article with custom layout (wrapped with Link)
- Shows additional articles using `variant="compact"` in grid
- Fetches sports-related categories

### 9. HotSpot (`src/app/hotSpot.tsx`)
- Displays articles in horizontal layout
- Each article wrapped with Link for routing
- Shows 3 articles in a row

### 10. Trending (`src/app/trending.tsx`)
- Rotating single article display
- Entire component wrapped with Link for routing
- Auto-rotates through trending articles

### 11. Politics (`src/app/politics.tsx`)
- Complex rotating layout with main article and sub-articles
- Main article and image wrapped with Link
- Sub-articles individually wrapped with Link
- Uses Framer Motion for animations

## Recent Updates

All article displays in the Zara News website now consistently use routing to individual blog detail pages. Components that previously showed articles without clickable links have been updated to either use the ArticleCard component or wrap their content with Next.js Link components pointing to `/blogs/${blog._id}`.

### Updated Components:
- **World Top News**: Featured article now clickable, additional articles use ArticleCard sidebar variant
- **Sports**: Featured article now clickable, additional articles use ArticleCard compact variant in grid
- **HotSpot**: All articles now wrapped with Link for routing
- **Trending**: Entire rotating display now clickable
- **Politics**: Main article, image, and all sub-articles now individually clickable

This ensures a consistent user experience where every article preview is clickable and leads to the full article view.

## Data Flow

1. **Data Fetching**: Components fetch blog data from various API endpoints:
   - `/api/blogs/category/{category}` - Category-specific blogs
   - `/api/blogs` - General blog list
   - `/api/blogs/{id}` - Individual blog details

2. **Component Rendering**: Each blog object is passed to ArticleCard with appropriate variant

3. **Navigation**: Clicking ArticleCard navigates to `/blogs/${blog._id}`

4. **Detail Page**: The detail page loads full blog content and shows related articles using ArticleCard again

## Key Features

### Responsive Design
- Uses Tailwind CSS classes for responsive layouts
- Different image sizes and text sizes across breakpoints
- Optimized for mobile, tablet, and desktop views

### Image Handling
- Uses Next.js `Image` component for optimization
- Fallback to default image if blog.imageUrl is not available
- Different image treatments per variant (rectangle, circle, etc.)

### Date Display
- Uses custom `getDisplayDate` utility for consistent date formatting
- Shows published date if available, otherwise created date

### Accessibility
- Proper alt text for images
- Semantic HTML structure
- Keyboard navigation support through Link component

## Integration with Next.js App Router

The component leverages Next.js 13+ App Router features:
- Client-side navigation with `Link` component
- Dynamic routing with `[id]` segments
- API routes for data fetching
- Built-in optimization for images and performance

## Performance Considerations

- Uses `priority` prop on images for above-the-fold content
- Lazy loading for images not marked as priority
- Efficient re-rendering with proper key props in lists
- Minimal prop drilling with direct blog object passing

## Future Enhancements

Potential improvements could include:
- Skeleton loading states (already implemented in some parent components)
- Image lazy loading optimization
- Additional variants for different use cases
- Analytics tracking for click events
- Prefetching of linked blog details