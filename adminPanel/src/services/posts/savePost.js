import { toast } from 'sonner';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function savePost({ title, content, style, token }) {
  try {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { data } = await axios.post(`${API_URL}/posts/save`, {
      title,
      content,
      style
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
} 