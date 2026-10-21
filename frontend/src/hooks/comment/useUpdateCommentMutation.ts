import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { updateComment } from "@/services/commentService";
import { UpdateCommentPayload } from "@/types/comment";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useUpdateCommentMutation = (options?: Options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, payload }: { commentId: string; payload: UpdateCommentPayload }) => 
      updateComment(commentId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.comments] });
      await queryClient.invalidateQueries({ queryKey: [QueryKey.replies] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => options?.onError?.(error),
  });
};
