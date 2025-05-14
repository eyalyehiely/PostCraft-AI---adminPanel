import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export async function getUsers(token: string): Promise<User[]> {
  try {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const { data } = await axios.get(`${API_URL}/admin/all-users`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function deleteUser(userId: string, token: string): Promise<void> {
  try {
    if (!token) {
      throw new Error('Not authenticated');
    }

    await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}