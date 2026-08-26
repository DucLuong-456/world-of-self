import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  endGameSession,
  startGameSession,
  startStrikersSession,
  endStrikersSession,
} from "@/services/gamesService";

export const useStartGame = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startGameSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gem-wallet"] });
      qc.invalidateQueries({ queryKey: ["gem-transactions"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err?.response?.data?.message || "Không thể bắt đầu trò chơi");
    },
  });
};

export const useEndGame = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: endGameSession,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["gem-wallet"] });
      qc.invalidateQueries({ queryKey: ["gem-transactions"] });
      toast.success(
        `🎉 Chúc mừng! Bạn đã nhận được ${data.reward} 💎 từ trò chơi.`,
      );
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message || "Lỗi khi hoàn thành trò chơi",
      );
    },
  });
};

export const useStartStrikers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: startStrikersSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gem-wallet"] });
      qc.invalidateQueries({ queryKey: ["gem-transactions"] });
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message ||
          "Không thể khởi tạo trận chiến Strikers!",
      );
    },
  });
};

export const useEndStrikers = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, score }: { sessionId: string; score: number }) =>
      endStrikersSession(sessionId, score),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["gem-wallet"] });
      qc.invalidateQueries({ queryKey: ["gem-transactions"] });
      toast.success(
        `🏆 Game Over! Bạn đạt ${data.score} điểm và nhận được ${data.reward} 💎.`,
      );
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(
        err?.response?.data?.message || "Lỗi khi đồng bộ dữ liệu trận chiến!",
      );
    },
  });
};
