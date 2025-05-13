import { getAuth } from '@clerk/nextjs/server';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function deleteUser(userId: string, token: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }
}

export async function getStats(token: string): Promise<{
  totalUsers: number;
  totalPosts: number;
  publicPosts: number;
}> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }

  return response.json();
} 