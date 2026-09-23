"use client";

import Image from "next/image";
import { useMyItems } from "@/hooks/items/useItems";
import { ItemRarity, UserItem } from "@/types/gem";
import { Gem, Loader2, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const RARITY_CONFIG: Record<
  ItemRarity,
  { label: string; border: string; badge: string; color: string }
> = {
  [ItemRarity.COMMON]: {
    label: "Phổ Thông",
    border: "border-gray-500/40",
    badge: "bg-gray-700 text-gray-300",
    color: "text-gray-400",
  },
  [ItemRarity.RARE]: {
    label: "Hiếm",
    border: "border-blue-500/50",
    badge: "bg-blue-900/60 text-blue-300",
    color: "text-blue-400",
  },
  [ItemRarity.EPIC]: {
    label: "Sử Thi",
    border: "border-purple-500/60",
    badge: "bg-purple-900/60 text-purple-300",
    color: "text-purple-400",
  },
  [ItemRarity.LEGENDARY]: {
    label: "Huyền Thoại",
    border: "border-yellow-500/60",
    badge: "bg-yellow-900/60 text-yellow-300",
    color: "text-yellow-400",
  },
};

const FALLBACK_IMAGES: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: "/items/golden_rose.png",
  [ItemRarity.RARE]: "/items/emerald_gem.png",
  [ItemRarity.EPIC]: "/items/crystal_crown.png",
  [ItemRarity.LEGENDARY]: "/items/legendary_dragon.png",
};

function InventoryCard({
  userItem,
  count,
}: {
  userItem: UserItem;
  count: number;
}) {
  const item = userItem.item;
  if (!item) return null;
  const rarity = RARITY_CONFIG[item.rarity] ?? RARITY_CONFIG[ItemRarity.COMMON];
  const imgSrc = item.image_url || FALLBACK_IMAGES[item.rarity];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card border overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        rarity.border,
      )}
    >
      {/* Rarity badge */}
      <span
        className={cn(
          "absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
          rarity.badge,
        )}
      >
        {rarity.label}
      </span>

      {/* Số lượng badge */}
      {count > 1 && (
        <span className="absolute top-3 right-3 z-10 text-[11px] font-black px-2 py-0.5 rounded-full bg-black/70 text-white border border-white/20">
          ×{count}
        </span>
      )}

      {/* Gifted badge (chỉ hiện khi chỉ có 1) */}
      {count === 1 && userItem.status === "gifted" && (
        <span className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-900/60 text-pink-300">
          🎁 Quà
        </span>
      )}

      {/* Image */}
      <div className="relative w-full aspect-square bg-black/30 overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <h3 className={cn("font-bold text-sm leading-snug", rarity.color)}>
          {item.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {item.description}
        </p>
        <div className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
          <Gem className="h-3 w-3 text-blue-400" />
          <span>{item.gem_price.toLocaleString()} 💎</span>
          <span className="ml-auto">
            {new Date(userItem.created_at).toLocaleDateString("vi-VN")}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const { data: items = [], isLoading } = useMyItems();

  // Group theo item_id, lấy bản ghi đầu tiên + đếm số lượng
  const grouped = Object.values(
    items.reduce<Record<string, { userItem: UserItem; count: number }>>(
      (acc, ui) => {
        if (!ui.item) return acc;
        if (acc[ui.item_id]) {
          acc[ui.item_id].count += 1;
        } else {
          acc[ui.item_id] = { userItem: ui, count: 1 };
        }
        return acc;
      },
      {},
    ),
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2">
          <PackageOpen className="h-6 w-6 text-indigo-400" />
          Kho vật phẩm của tôi
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length} vật phẩm ({grouped.length} loại)
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : grouped.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center space-y-3">
          <PackageOpen className="h-12 w-12 text-muted-foreground mx-auto opacity-40" />
          <p className="font-medium text-muted-foreground">
            Kho đồ trống! Hãy ghé{" "}
            <a
              href="/shop"
              className="text-indigo-400 underline hover:text-indigo-300"
            >
              Cửa hàng
            </a>{" "}
            để mua vật phẩm đầu tiên.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {grouped.map(({ userItem, count }) => (
            <InventoryCard
              key={userItem.item_id}
              userItem={userItem}
              count={count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
