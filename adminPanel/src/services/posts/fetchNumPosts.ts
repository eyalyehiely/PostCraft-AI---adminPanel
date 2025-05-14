import { toast } from 'sonner';
import axios from 'axios';

interface FetchPostsParams {
  token: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export async function fetchNumPosts({ token }: FetchPostsParams): Promise<number> {
  try {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { data } = await axios.get(`${API_URL}/admin/all-posts/`, {
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