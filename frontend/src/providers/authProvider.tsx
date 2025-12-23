"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useGetUser } from "@/hooks";
import { useAuthStore } from "@/store/authStore";
import { PUBLIC_ROUTES } from "@/config";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const { data, isFetched, isLoading, isError } = useGetUser();
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (!isFetched) {
      return;
    }

    if (data && !isError) {
      setUser(data);
      setIsAuthenticated(true);
      if (isPublicRoute) {
        router.push("/");
      }
    } else {
      setUser(null);
      if (!isPublicRoute) {
        router.push("/login");
      }
    }
  }, [
    isFetched,
    data,
    pathname,
    router,
    setUser,
    setIsAuthenticated,
    isPublicRoute,
    isError,
  ]);

  if (isLoading || !isFetched) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};
