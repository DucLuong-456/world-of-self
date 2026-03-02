import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { createPost } from "@/services/postService";
import { CreatePostPayload } from "@/types/post";

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload) => createPost(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.posts] });
    },
  });
};
