export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: 'politics' | 'trending' | 'hotSpot' | 'editors' | 'featured' | 'other';
  tags?: string[];
  imageUrl?: string;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  likes: string[];
  comments: {
    userId: string;
    userName: string;
    comment: string;
    createdAt: string;
  }[];
}

export interface BlogResponse {
  blogs: Blog[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  status?: number;
}