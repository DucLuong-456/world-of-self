import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { getPosts } from "@/services/postService";
import { SearchPostParams } from "@/types/post";

export const useGetPosts = (params?: SearchPostParams) => {
  return useQuery({
    queryKey: [QueryKey.posts, params],
    queryFn: () => getPosts(params),
  });
};
