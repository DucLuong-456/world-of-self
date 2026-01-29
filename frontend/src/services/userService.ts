import { apiClient } from "@/lib/axios";
import { User } from "@/types/user";

export class UpdateUserDto {
  user_name?: string;
  email?: string;
  phone?: string;
  avatar?: File;
  bio?: string;
  location?: string;
  profession?: string;
  company?: string;
  education?: string;
  cover_avatar?: File;
}

export const getUser = async (): Promise<User> => {
  const { data } = await apiClient.get("/user");
  return data;
};

export const updateProfile = async (
  data: UpdateUserDto | FormData,
): Promise<User> => {
  const { data: res } = await apiClient.patch("/user", data);
  return res;
};
