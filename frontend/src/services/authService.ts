// src/apis/auth.api.ts

import { apiClient } from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  user_name?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
}

export const loginApi = async (payload: LoginPayload) => {
  const { data } = await apiClient.post("/auth/login", payload);
  return data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const { data } = await apiClient.post("/auth/register", payload);
  return data;
};

export const logoutApi = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};
