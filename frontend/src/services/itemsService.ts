import { apiClient } from "@/lib/axios";
import { Item, UserItem } from "@/types/gem";

export const getItems = async (): Promise<Item[]> => {
  const { data: res } = await apiClient.get("/items");
  return res.data;
};

export const getItem = async (id: string): Promise<Item> => {
  const { data: res } = await apiClient.get(`/items/${id}`);
  return res.data;
};

export const buyItem = async (
  itemId: string,
): Promise<{ user_item: UserItem; balance: number }> => {
  const { data: res } = await apiClient.post(`/items/${itemId}/buy`);
  return res.data;
};

export const getMyItems = async (): Promise<UserItem[]> => {
  const { data: res } = await apiClient.get("/user-items/me");
  return res.data;
};
