"use server";

import { cookies } from "next/headers";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: string;
  userRole: string;
  accessToken: string;
  refreshToken: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// =======================
// Login
// =======================
export async function loginService({ email, password }: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data: LoginResponse = await res.json();

  const cookieStore = await cookies();

  // Save tokens securely
  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  cookieStore.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return data;
}

// =======================
// Logout
// =======================
export async function logoutService(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
}

// =======================
// Refresh Token
// =======================
export async function refreshService(): Promise<{ userId: string; role: string; accessToken: string }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    throw new Error("No refresh token found");
  }

  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    throw new Error("Failed to refresh token");
  }

  const data = await res.json();

  // Save new access token
  cookieStore.set("accessToken", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  cookieStore.set("refreshToken", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return data;
}

// =======================
// Check Cookies
// =======================
export async function validateSessionService(): Promise<boolean> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // both must exist
  return Boolean(accessToken && refreshToken);
}