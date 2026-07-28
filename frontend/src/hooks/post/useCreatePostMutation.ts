import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { createPost } from "@/services/postService";
import { CreatePostPayload } from "@/types/post";

type Options = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useCreatePostMutation = (options?: Options) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.posts] });
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      options?.onError?.(error);
    },
  });
};
