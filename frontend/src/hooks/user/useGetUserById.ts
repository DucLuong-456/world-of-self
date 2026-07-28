import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { getUserById } from "@/services/userService";

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QueryKey.user, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
