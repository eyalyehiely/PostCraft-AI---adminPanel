'use client'

import { UserButton, useUser, useClerk } from '@clerk/nextjs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Moon, User, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { editProfile } from '@/services/profile/edit-profile'
import { useAuth } from '@clerk/nextjs'

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [isEditing, setIsEditing] = useState(false)
  const [tempFirstName, setTempFirstName] = useState(firstName)
  const [tempLastName, setTempLastName] = useState(lastName)
  const { getToken } = useAuth()

  // Update state when user data is available
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '')
      setLastName(user.lastName || '')
      setTempFirstName(user.firstName || '')
      setTempLastName(user.lastName || '')
    }
  }, [user])

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been successfully signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const handleEdit = () => {
    setTempFirstName(firstName)
    setTempLastName(lastName)
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      // Here you would typically update the user's profile with Clerk
      setFirstName(tempFirstName)
      setLastName(tempLastName)
      const token = await getToken()
      if (!token) {
        throw new Error('Not authenticated')
      }
      await editProfile({ firstName: tempFirstName, lastName: tempLastName }, token)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error("Failed to update profile")
    }
  }

  const handleCancel = () => {
    setTempFirstName(firstName)
    setTempLastName(lastName)
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Application Settings</h1>
      <div className="grid gap-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <CardTitle>Theme Settings</CardTitle>
            </div>
            <CardDescription>Customize your application appearance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <Switch 
                  id="dark-mode" 
                  checked={mounted && theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              <CardTitle>Profile Settings</CardTitle>
            </div>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-accent/5">
                <UserButton afterSignOutUrl="/" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEdit}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={isEditing ? tempFirstName : firstName}
                      onChange={(e) => isEditing && setTempFirstName(e.target.value)}
                      placeholder="Enter your first name"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={isEditing ? tempLastName : lastName}
                      onChange={(e) => isEditing && setTempLastName(e.target.value)}
                      placeholder="Enter your last name"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.emailAddresses[0]?.emailAddress || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <Button
                variant="outline"
                onClick={handleSignOut}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 