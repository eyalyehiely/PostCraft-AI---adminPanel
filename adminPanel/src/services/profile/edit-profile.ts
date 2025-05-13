import { Post } from '@/types/post'
import { User } from '@clerk/nextjs/server'
import axios from 'axios'

export async function editProfile( userData: Partial<User>, token: string) {
  const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  try {
    const response = await axios.patch(`http://localhost:3000/api/profile/edit-profile`, userData, {
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
