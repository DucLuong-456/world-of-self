import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { createComment } from "@/services/commentService";
import { CreateCommentPayload } from "@/types/comment";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreateCommentMutation = (postId: string, options?: Options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload) => createComment(postId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.comments, postId] });
      await queryClient.invalidateQueries({ queryKey: [QueryKey.replies] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
