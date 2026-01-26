"use client";

import { AuthProvider } from "@/providers/authProvider";
import { AppQueryClientProvider } from "@/providers/queryClientProvider";
import { useApplyTheme } from "@/store/themeStore";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useApplyTheme();

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AppQueryClientProvider>
        <AuthProvider>{children}</AuthProvider>
      </AppQueryClientProvider>
    </GoogleOAuthProvider>
  );
}
