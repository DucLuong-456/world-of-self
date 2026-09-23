import {
  doCheckIn,
  doSpin,
  getCheckInStatus,
  getSpinStatus,
} from "@/services/gamificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCheckInStatus = () =>
  useQuery({ queryKey: ["checkin-status"], queryFn: getCheckInStatus });

export const useCheckIn = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doCheckIn,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["checkin-status"] });
      qc.invalidateQueries({ queryKey: ["gem-wallet"] });
      qc.invalidateQueries({ queryKey: ["gem-transactions"] });
      toast.success(
        `🎉 Điểm danh thành công! +${data.gems_earned} 💎 — Streak: ${data.streak} ngày`,
      );
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Điểm danh thất bại.");
    },
  });
};

export const useSpinStatus = () =>
  useQuery({ queryKey: ["spin-status"], queryFn: getSpinStatus });

export const useSpin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: doSpin,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["spin-status"] });
      qc.invalidateQueries({ queryKey: ["gem-wallet"] });
      qc.invalidateQueries({ queryKey: ["gem-transactions"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Quay thất bại.");
    },
  });
};
