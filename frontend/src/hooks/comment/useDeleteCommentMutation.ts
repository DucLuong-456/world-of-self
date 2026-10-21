import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { deleteComment } from "@/services/commentService";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeleteCommentMutation = (options?: Options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.comments] });
      await queryClient.invalidateQueries({ queryKey: [QueryKey.replies] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
};
