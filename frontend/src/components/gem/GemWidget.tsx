"use client";

import Link from "next/link";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { Gem, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GemWidget() {
  const { data: wallet, isLoading } = useGemWallet();

  return (
    <Link
      href="/wallet"
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-gradient-to-r from-blue-500/10 to-indigo-500/10",
        "border border-blue-400/30 hover:border-blue-400/60",
        "transition-all duration-200 hover:shadow-md hover:shadow-blue-500/10",
        "group",
      )}
    >
      <Gem className="h-4 w-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
      ) : (
        <span className="text-sm font-bold text-blue-500 dark:text-blue-300 tabular-nums">
          {wallet?.balance?.toLocaleString() ?? "0"}
        </span>
      )}
    </Link>
  );
}
