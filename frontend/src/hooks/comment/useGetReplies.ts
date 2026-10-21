import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { getReplies } from "@/services/commentService";

export const useGetReplies = (commentId: string, enabled: boolean = false, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [QueryKey.replies, commentId, page, limit],
    queryFn: () => getReplies(commentId, page, limit),
    enabled: !!commentId && enabled,
  });
};
