import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";
import { toggleReact } from "@/services/postService";

export const useToggleReactMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => toggleReact(postId),
    onSuccess: () => {
      // Invalidate posts list to refetch updated react count and status
      queryClient.invalidateQueries({ queryKey: [QueryKey.posts] });
    },
  });
};
