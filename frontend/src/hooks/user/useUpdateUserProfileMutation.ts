import { UpdateUserDto, updateProfile } from "@/services/userService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";

export const useUpdateUserProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserDto | FormData) => updateProfile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.user] });
    },
  });
};
