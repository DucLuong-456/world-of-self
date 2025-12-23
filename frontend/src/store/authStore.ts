import { createStore } from "./createStore";
import { User } from "@/types/user";

type StateAuth = {
  user: User | null;
  isAuthenticated: boolean;
};

type ActionsAuth = {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  resetAuth: () => void;
};

const initialStateAuth: StateAuth = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = createStore<StateAuth & ActionsAuth>()((set) => ({
  ...initialStateAuth,

  setUser: (user) => {
    set({ user });
  },

  setIsAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
  },

  resetAuth: () => {
    set(initialStateAuth);
  },
}));
