'use client'

// @ts-ignore
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useAuth, useUser, RedirectToSignIn } from '@clerk/nextjs'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Loader2, Users, FileText, Globe } from 'lucide-react'
import { fetchNumPosts } from '@/services/posts/fetchNumPosts'
import { fetchPublicPosts } from '@/services/posts/publicPosts'
import Footer from '@/components/Footer'
import { deleteUser, getUsers } from '@/services/posts/fetchUsers'

// Define the User type with the required properties
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  clerkId?: string
  userId?: string  // Alternative property name
  isAdmin?: boolean
  role?: string    // For role-based admin checking
}

interface DashboardData {
  numPosts: number
  numUsers: number
  publicPosts: number
  users: User[]
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    numPosts: 0,
    numUsers: 0,
    publicPosts: 0,
    users: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const { getToken, isLoaded, isSignedIn } = useAuth()
  const { user } = useUser()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  const USERS_PER_PAGE = 10

  const fetchData = async () => {
    if (!isLoaded || !isSignedIn || !user?.id) {
      setIsLoading(false)
      return
    }

    try {
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }

      // Fetch all data in parallel
      const [numberPosts, users, publicPosts] = await Promise.all([
        fetchNumPosts({ token }),
        getUsers(token),
        fetchPublicPosts({ token })
      ])

      // Check if current user is admin
      const currentUser = users.find((u: any) => u.clerkId === user.id || u.userId === user.id) as any
      
      // Set admin status
      const adminStatus = currentUser ? (!!currentUser.isAdmin || currentUser.role === 'admin') : false

      setIsAdmin(adminStatus)

      setData({
        numPosts: numberPosts,
        numUsers: users?.length || 0,
        publicPosts,
        users: users || []
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to fetch dashboard data')
      setIsAdmin(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id && isAdmin === null) {
      fetchData()
    }
  }, [isLoaded, isSignedIn, user?.id, isAdmin])

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Add debug logging for render

  // Show loading while checking auth and admin status
  if (!isLoaded || isLoading || isAdmin === null) {
    console.log('Showing loader')
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) {
    console.log('Not signed in, redirecting')
    return <RedirectToSignIn />
  }

  if (!isAdmin) {
    console.log('Access denied, isAdmin:', isAdmin)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Access denied. Admin privileges required.</p>
      </div>
    )
  }

  console.log('Rendering dashboard')

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
      setData((prev: DashboardData) => ({
        ...prev,
        users: prev.users.filter((user: User) => user.id !== userId),
        numUsers: prev.numUsers - 1
      }))
      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete user')
    }
  }

  // Filter users based on search term
  const filteredUsers = data.users.filter((user: User) => 
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const startIndex = (currentPage - 1) * USERS_PER_PAGE
  const endIndex = startIndex + USERS_PER_PAGE
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  // Format date helper
  const formatDate = (dateString: string | undefined | null) => {

    
    if (!dateString) return 'N/A'
    
    try {
      // Handle the format "13/05/2025 20:11:41" (DD/MM/YYYY HH:mm:ss)
      if (dateString.includes('/')) {
        const [datePart] = dateString.split(' ')
        const [day, month, year] = datePart.split('/')
        // Create ISO format: YYYY-MM-DD
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        const date = new Date(isoDate)
        
        if (isNaN(date.getTime())) {
          console.log('Invalid date after parsing:', dateString)
          return 'Invalid Date'
        }
        
        const formatted = date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
        console.log('Formatted date:', formatted)
        return formatted
      }
      
      // Fallback to regular Date parsing
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        console.log('Invalid date:', dateString)
        return 'Invalid Date'
      }
      
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
      console.log('Formatted date:', formatted)
      return formatted
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Error'
    }
  }

  return (
    <>
    
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.numUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.numPosts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Public Posts</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.publicPosts}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage your platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
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
              {currentUsers.length > 0 ? (
                currentUsers.map((user: User) => {
                  console.log('User data:', user);
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        {(() => {
                          // Check for various name property formats
                          if (user.firstName && user.lastName) {
                            return `${user.firstName} ${user.lastName}`;
                          }
                          if ((user as any).first_name && (user as any).last_name) {
                            return `${(user as any).first_name} ${(user as any).last_name}`;
                          }
                          if ((user as any).name) {
                            return (user as any).name;
                          }
                          if ((user as any).displayName) {
                            return (user as any).displayName;
                          }
                          if ((user as any).username) {
                            return (user as any).username;
                          }
                          return 'No name available';
                        })()}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {formatDate(user.createdAt)}
                      </TableCell>
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
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <Footer />
    </>
  )
}