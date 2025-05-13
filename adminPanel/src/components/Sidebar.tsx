"use client"
import Link from 'next/link'
import { Home, Settings, FileText, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { UserButton, useUser, useClerk } from '@clerk/nextjs'
import { Button } from './ui/button'
import { toast } from 'sonner'
export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useUser()
  const { signOut } = useClerk()
  const pages = [
    {
      name: 'Home',
      href: '/dashboard',
      icon: Home
    },
    {
      name: 'Posts',
      href: '/posts',
      icon: FileText
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ]

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("You have been successfully signed out");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-[60] md:hidden p-2 rounded-lg bg-white shadow-md hover:bg-gray-100 transition-colors border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar container */}
      <div className="md:static">
        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed md:static w-64 border-r min-h-screen p-4 bg-white/95 dark:bg-gray-900/95 dark:border-gray-800 transition-transform duration-300 ease-in-out z-50 ${
            isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <nav className="space-y-2 mt-12 md:mt-0" >
            {pages.map((page) => (
              <Link
                key={page.name}
                href={page.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100  dark:text-white  dark:hover:bg-gray-900"
                onClick={() => setIsOpen(false)}
              >
                <page.icon className="h-4 w-4" />
                <span>{page.name}</span>
              </Link>
            ))}
          </nav>
           {/* User Section */}
        <div className="absolute bottom-16 left-0 right-0 p-4 border-t border-border">
          <div className="space-y-3">
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
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </div>
        </aside>
      </div>
    </>
  )
} 