import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { getRootComments } from "@/services/commentService";

export const useGetComments = (postId: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [QueryKey.comments, postId, page, limit],
    queryFn: () => getRootComments(postId, page, limit),
    enabled: !!postId,
  });
};
