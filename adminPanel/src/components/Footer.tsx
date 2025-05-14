import React from 'react'

function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} PostCraft AI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer