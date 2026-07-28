import { useQuery } from "@tanstack/react-query";
import { getPostTemplates } from "@/services/postService";
import { QueryKey } from "../keys";

export const useGetPostTemplates = () => {
  return useQuery({
    queryKey: [QueryKey.posts, "templates"],
    queryFn: getPostTemplates,
    staleTime: Infinity, // templates are static seed data, rarely change
  });
};
