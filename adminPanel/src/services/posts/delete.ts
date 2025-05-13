import { Post } from '@/types/post'
import axios from 'axios'
import { toast } from 'sonner'

export async function deletePost(postUuid: string, token: string) {
  const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
  
  // Show confirmation toast first
  const confirmed = await new Promise<boolean>((resolve) => {
    toast('Are you sure you want to delete this post?', {
      action: {
        label: 'Delete',
        onClick: () => resolve(true)
      },
      cancel: {
        label: 'Cancel',
        onClick: () => resolve(false)
      },
      duration: Infinity,
    })
  })

  if (!confirmed) {
    return null
  }

  // Show loading state only after confirmation
  try {
    const response = await axios.delete(`${PUBLIC_API_URL}/posts/${postUuid}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    toast.success('Post deleted successfully')
    return response.data
  } catch (error) {
    console.error('Error deleting post:', error)
    toast.error('Failed to delete post')
    throw error
  }
}
