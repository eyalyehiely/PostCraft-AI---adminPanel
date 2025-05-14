import { getToken } from './auth';
import { Post } from '@/types/post';

// Define the Post type based on the actual API response
export interface Post {
  _id: string;
  title: string;
  content: string;
  style: string;
  author: string;
  clerkId: string;
  isPublic: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  publicId: string;
}

// API URL should be from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to fetch posts: ${response.status}`);
    }

    const data = await response.json();
    
    // Ensure we have an array of posts
    if (!Array.isArray(data)) {
      console.error('Expected array of posts, got:', data);
      throw new Error('Invalid response format');
    }

    // Validate each post has required fields
    return data.map(post => ({
      _id: post._id || '',
      title: post.title || '',
      content: post.content || '',
      style: post.style || '',
      author: post.author || '',
      clerkId: post.clerkId || '',
      isPublic: Boolean(post.isPublic),
      uuid: post.uuid || '',
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: post.updatedAt || new Date().toISOString(),
      __v: Number(post.__v) || 0,
      publicId: post.publicId || ''
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}; 