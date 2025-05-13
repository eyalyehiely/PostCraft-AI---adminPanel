import { toast } from 'sonner';
import axios from 'axios';
import { Post } from '@/types/post';

interface FetchPostsParams {
  token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export async function fetchPosts({ token }: FetchPostsParams): Promise<Post[]> {
  try {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { data } = await axios.get(`${API_URL}/posts/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
} 