import { apiClient } from "@/lib/axios";
import { User } from "@/types/user";

export const getUser = async (): Promise<User> => {
  const { data } = await apiClient.get("/user");
  return data;
};
