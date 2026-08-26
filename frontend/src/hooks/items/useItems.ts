import { buyItem, getItems, getMyItems } from "@/services/itemsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useItems = () => {
  return useQuery({
    queryKey: ["items"],
    queryFn: getItems,
    staleTime: 60_000,
  });
};

export const useMyItems = () => {
  return useQuery({
    queryKey: ["my-items"],
    queryFn: getMyItems,
  });
};

export const useBuyItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => buyItem(itemId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gem-wallet"] });
      queryClient.invalidateQueries({ queryKey: ["gem-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["my-items"] });
      toast.success(`Mua thành công! Số dư còn lại: ${data.balance} 💎`);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Mua vật phẩm thất bại.");
    },
  });
};
