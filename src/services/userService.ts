"use server";
import { cookies } from "next/headers";

export type RegisterRequest = {
  email: string;
  name: string;
  surname: string;
  role: string;
};

export type RegisterResponse = {
  message: string;
  password: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function RegisterUser(data: RegisterRequest): Promise<RegisterResponse> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")?.value
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  const result = await response.json();
  return result;
}

export type User = {
  id: number;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
};

export type GetUsersResponse = {
  message: string;
  items: User[];
};

// Function to fetch users
export async function getUsersService(): Promise<GetUsersResponse> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store", // always fetch fresh data
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

