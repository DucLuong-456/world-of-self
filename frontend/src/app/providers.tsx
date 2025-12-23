"use client";

import React from "react";
import { useApplyTheme } from "@/store/themeStore";
import { AuthProvider } from "@/providers/authProvider";
import { AppQueryClientProvider } from "@/providers/queryClientProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  useApplyTheme();

  return (
    <AppQueryClientProvider>
      <AuthProvider>{children}</AuthProvider>
    </AppQueryClientProvider>
  );
}
