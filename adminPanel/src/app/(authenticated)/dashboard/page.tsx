'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { generateContent } from '@/services/posts/generate'
import { useAuth } from '@clerk/nextjs'
import { savePost } from '@/services/posts/savePost'
import { getUsers, getStats, deleteUser, User } from '@/services/users'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Users, FileText, Globe } from 'lucide-react'

export default function Dashboard() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState('')
  const [content, setContent] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showGeneratedContent, setShowGeneratedContent] = useState(false)
  const [showSpecialRequests, setShowSpecialRequests] = useState(false)
  const [wordLimit, setWordLimit] = useState('')
  const [pronoun, setPronoun] = useState<'first' | 'second' | 'third' | ''>('')
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    publicPosts: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const { getToken } = useAuth()

  const typeText = (text: string) => {
    let index = 0
    setIsTyping(true)
    setContent('')
    setShowGeneratedContent(true)

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setContent(prev => prev + text[index])
        index++
      } else {
        clearInterval(typingInterval)
        setIsTyping(false)
      }
    }, 30)
  }

  const handleGenerate = async () => {
    if (!topic || !style) {
      toast.error('Please fill in both topic and writing style')
      return
    }

    setIsGenerating(true)
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      
      const generatedContent = await generateContent({ topic, style, token })
      typeText(generatedContent)
      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!content) {
      toast.error('No content to save')
      return
    }
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      const savedPost = await savePost({ title: topic, content, style, token })
      console.log(savedPost)
      toast.success('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      toast.error('Failed to save draft')
    }
  }

  const fetchData = async () => {
    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      const [usersData, statsData] = await Promise.all([
        getUsers(token),
        getStats(token)
      ])

      setUsers(usersData)
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      await deleteUser(userId, token)
      setUsers((prevUsers: User[]) => prevUsers.filter(user => user.id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Posts</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.publicPosts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage your platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 