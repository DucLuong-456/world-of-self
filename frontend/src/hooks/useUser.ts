// src/hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

export const useUser = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();

  return useQuery({
    queryKey: ["user-profile"], // Key để cache
    queryFn: userService.getProfile, // Hàm fetch data
    enabled: isAuthenticated && !isAuthLoading, // Chỉ chạy query khi đã đăng nhập
    staleTime: 5 * 60 * 1000, // 5 phút
    retry: 1, // Thử lại 1 lần nếu lỗi
  });
};
