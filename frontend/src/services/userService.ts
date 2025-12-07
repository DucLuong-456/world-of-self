// src/services/userService.ts
import { apiClient } from "@/lib/axios";
import { User } from "@/types/user";

export const userService = {
  getProfile: (): Promise<User> => {
    return apiClient.get("/user/profile").then((res) => res.data);
  },
  updateProfile: (data: Partial<User>): Promise<User> => {
    return apiClient.put("/user/profile", data).then((res) => res.data);
  },
};
