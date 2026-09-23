"use client";

import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Gem } from "lucide-react";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { cn } from "@/lib/utils";

// Danh sách trò chơi (sẽ query từ API Admin sau này)
const GAMES_LIST = [
  {
    id: "memory-match",
    name: "Thẻ Bài Trí Nhớ",
    title: "Vua Trò Chơi Yugioh",
    description: "Lật tìm 6 cặp thẻ bài để nhận thưởng nóng 50 Ngọc.",
    bannerUrl: "/games/memory-match-banner.png",
    url: "/games/memory-match",
    cost: 10,
    tags: ["Thử thách trí nhớ", "Yugioh"],
    disabled: false,
  },
  // Có thể thêm slots cho các game sắp ra mắt...
  {
    id: "strikers-1945",
    name: "Strikers 1945",
    title: "Không chiến sinh tồn",
    description:
      "Điều khiển máy bay, né đạn và bắn nổ kẻ thù để thu thập Ngọc Vàng.",
    bannerUrl: "/games/space-shooter-banner.png",
    url: "/games/strikers",
    cost: 10,
    tags: ["Bắn máy bay", "HTML5 Canvas"],
    disabled: false,
  },
];

export default function GamesCenterPage() {
  const { data: wallet } = useGemWallet();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Title & Wallet */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-indigo-500" />
            Game Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Trung tâm giải trí, kiếm ngọc và thư giãn
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30 shadow-sm">
          <span className="text-sm font-semibold text-blue-300">Đang có:</span>
          <Gem className="h-4 w-4 text-blue-400" />
          <span className="font-bold text-blue-400 tabular-nums text-lg">
            {wallet?.balance?.toLocaleString() ?? "0"}
          </span>
        </div>
      </div>

      {/* Games Grid (3 columns on PC, 2 on Tablet, 1 on Mobile) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {GAMES_LIST.map((game) => (
          <Link
            key={game.id}
            href={game.url}
            className={cn(
              "group relative flex flex-col rounded-2xl bg-card border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300",
              game.disabled
                ? "opacity-70 grayscale pointer-events-none"
                : "hover:-translate-y-1 hover:border-indigo-500/50",
            )}
          >
            {/* Banner Image */}
            <div className="relative w-full aspect-video bg-black/50 overflow-hidden">
              <Image
                src={game.bannerUrl}
                alt={game.name}
                fill
                className={cn(
                  "object-cover transition-transform duration-500 scale-105",
                  !game.disabled &&
                    "group-hover:scale-110 group-hover:rotate-1",
                )}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1 space-y-2 relative -mt-6">
              <div className="flex flex-wrap gap-1">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                      tag === "Coming Soon"
                        ? "bg-slate-800 text-slate-300"
                        : "bg-indigo-900/60 text-indigo-300 backdrop-blur-md",
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex-1 space-y-1 mt-2">
                <h3 className="font-black text-xl leading-tight text-white group-hover:text-indigo-400 transition-colors">
                  {game.name}
                </h3>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest text-indigo-300/70">
                  {game.title}
                </p>
                <p className="text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {game.description}
                </p>
              </div>

              {/* Price / Play button area */}
              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-2">
                <span className="text-sm font-semibold text-slate-300">
                  Phí vào:
                </span>
                {game.cost > 0 ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-bold text-sm">
                    {game.cost} <Gem className="h-4 w-4" />
                  </div>
                ) : (
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Miễn phí
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
