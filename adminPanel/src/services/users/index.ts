import { getAuth } from '@clerk/nextjs/server';

export interface User {
  _id?: string;        // MongoDB uses _id
  id?: string;         // Some may use id
  clerkId: string;
  email: string;
  first_name: string;  // API uses snake_case
  last_name: string;   // API uses snake_case
  createdAt: string;
  isAdmin: string;     // API returns string "true"/"false"
}

export async function getUsers(token: string): Promise<User[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/admin';
  const response = await fetch(`${baseUrl}/all-users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  const data = await response.json();
  
  // Return data directly since API returns array of users
  if (!Array.isArray(data)) {
    console.error('API response:', data);
    return [];
  }
  
  return data;
}

export async function deleteUser(userId: string, token: string): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/admin';
  const response = await fetch(`${baseUrl}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}
