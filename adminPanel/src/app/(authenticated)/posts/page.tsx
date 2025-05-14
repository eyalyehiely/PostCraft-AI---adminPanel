'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth } from '@clerk/nextjs'
import { getAllPosts } from '@/services/posts'
import { Post } from '@/types/post'
import { Loader2 } from 'lucide-react'

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  const fetchPosts = async () => {
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      const fetchedPosts = await getAllPosts()
      if (!Array.isArray(fetchedPosts)) {
        console.error('Expected array of posts, got:', fetchedPosts)
        throw new Error('Invalid response format')
      }
      // Ensure each post is properly formatted
      const formattedPosts = fetchedPosts.map(post => ({
        ...post,
        title: post.title || 'Untitled',
        content: post.content || 'No content',
        createdAt: post.createdAt || new Date().toISOString(),
        isPublic: Boolean(post.isPublic)
      }))
      setPosts(formattedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
      toast.error('Failed to fetch posts')
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Posts</h1>
        <div className="text-center text-muted-foreground">
          No posts found
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Posts</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post._id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{String(post.title)}</CardTitle>
              <CardDescription>
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {String(post.content)}
              </p>
            </CardContent>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {post.isPublic ? 'Public' : 'Private'}
                </span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 