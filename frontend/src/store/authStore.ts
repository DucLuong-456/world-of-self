// src/store/authStore.ts
import { User } from "@/types/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Giả sử token được lưu trong httpOnly cookie cho bảo mật
// nên không cần persist token vào localStorage
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  finishInitialLoad: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Bắt đầu là true để kiểm tra token lúc đầu
      login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
      logout: () =>
        set({ user: null, isAuthenticated: false, isLoading: false }),
      setUser: (user) => set({ user }),
      finishInitialLoad: () => set({ isLoading: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage), // Dùng sessionStorage để đóng tab là xóa
      // Chỉ persist user và isAuthenticated, không cần isLoading
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
