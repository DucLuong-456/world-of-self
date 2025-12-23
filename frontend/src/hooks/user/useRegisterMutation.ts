import { registerApi, RegisterPayload } from "@/services/authService";
import { useMutation } from "@tanstack/react-query";

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
  });
};
