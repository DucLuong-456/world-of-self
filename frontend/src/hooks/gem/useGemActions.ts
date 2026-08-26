import {
  getMyTransactions,
  redeemInviteCode,
  transferGems,
} from "@/services/gemWalletService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGemTransactions = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["gem-transactions", page, limit],
    queryFn: () => getMyTransactions(page, limit),
  });
};

export const useRedeemCode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => redeemInviteCode(code),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gem-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["gem-transactions"] });
      toast.success(
        `Nhận thành công +${data.earned} 💎! Số dư: ${data.balance} 💎`,
      );
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Mã mời không hợp lệ.");
    },
  });
};

export const useTransferGems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      to_user_id,
      amount,
    }: {
      to_user_id: string;
      amount: number;
    }) => transferGems(to_user_id, amount),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gem-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["gem-transactions"] });
      toast.success(`Chuyển thành công! Số dư còn lại: ${data.balance} 💎`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Chuyển Ngọc thất bại.");
    },
  });
};
