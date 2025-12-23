import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { getUser } from "@/services/userService";

export const useGetUser = () => {
  return useQuery({
    queryKey: [QueryKey.user],
    queryFn: getUser,
  });
};
