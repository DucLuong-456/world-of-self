"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { MainSidebar } from "./MainSidebar";
import { RightSidebar } from "./RightSidebar";

type DefaultLayoutProps = {
  children: ReactNode;
};

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <MainSidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 transition-all duration-300">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex gap-6">
            {/* Feed/Page Section */}
            <div className="flex-1 min-w-0 space-y-4">
              {children}
            </div>

            {/* Right Sidebar - Desktop Only (Fixed Width) - Only on home */}
            {isHomePage && (
              <div className="hidden xl:block shrink-0">
                <RightSidebar />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
