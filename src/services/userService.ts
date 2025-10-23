"use server";

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
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to register user');
  }

  const result = await response.json();
  return result;
}
