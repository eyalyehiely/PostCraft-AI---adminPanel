import { Post } from '@/types/post'
import axios from 'axios'

export async function editPost(postUuid: string, updatedPost: Partial<Post>, token: string) {
  const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  try {
    const response = await axios.put(`${PUBLIC_API_URL}/posts/${postUuid}`, updatedPost, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error updating post:', error)
    throw error
  }
}
