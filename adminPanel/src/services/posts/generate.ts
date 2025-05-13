import { toast } from 'sonner';
import axios from 'axios';

interface GenerateParams {
  topic: string;
  style: string;
  token: string;
  wordLimit?: number;
  pronoun?: 'first' | 'second' | 'third';
  specialRequest?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
export async function generateContent({ topic, style, token, wordLimit, pronoun, specialRequest }: GenerateParams): Promise<string> {
  try {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { data } = await axios.post(`${API_URL}/posts/generate`, {
      topic,
      style,
      wordLimit,
      pronoun,
      specialRequest
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