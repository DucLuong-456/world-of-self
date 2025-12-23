import { loginApi, LoginPayload, logoutApi } from "@/services/authService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKey } from "../keys";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.user] });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.user] });
    },
  });
};
