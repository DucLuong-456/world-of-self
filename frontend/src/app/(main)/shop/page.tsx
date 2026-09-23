"use client";

import { useState } from "react";
import Image from "next/image";
import { useItems } from "@/hooks/items/useItems";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { useBuyItem } from "@/hooks/items/useItems";
import { Item, ItemRarity } from "@/types/gem";
import { Gem, Loader2, ShoppingBag, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const RARITY_CONFIG: Record<
  ItemRarity,
  { label: string; color: string; border: string; glow: string; badge: string }
> = {
  [ItemRarity.COMMON]: {
    label: "Phổ Thông",
    color: "text-gray-400",
    border: "border-gray-500/40",
    glow: "",
    badge: "bg-gray-700 text-gray-300",
  },
  [ItemRarity.RARE]: {
    label: "Hiếm",
    color: "text-blue-400",
    border: "border-blue-500/50",
    glow: "shadow-blue-500/20",
    badge: "bg-blue-900/60 text-blue-300",
  },
  [ItemRarity.EPIC]: {
    label: "Sử Thi",
    color: "text-purple-400",
    border: "border-purple-500/60",
    glow: "shadow-purple-500/30",
    badge: "bg-purple-900/60 text-purple-300",
  },
  [ItemRarity.LEGENDARY]: {
    label: "Huyền Thoại",
    color: "text-yellow-400",
    border: "border-yellow-500/60",
    glow: "shadow-yellow-500/30",
    badge: "bg-yellow-900/60 text-yellow-300",
  },
};

// Fallback ảnh theo rarity
const FALLBACK_IMAGES: Record<ItemRarity, string> = {
  [ItemRarity.COMMON]: "/items/golden_rose.png",
  [ItemRarity.RARE]: "/items/emerald_gem.png",
  [ItemRarity.EPIC]: "/items/crystal_crown.png",
  [ItemRarity.LEGENDARY]: "/items/legendary_dragon.png",
};

function ItemCard({
  item,
  walletBalance,
  onBuy,
}: {
  item: Item;
  walletBalance: number;
  onBuy: (item: Item) => void;
}) {
  const rarity = RARITY_CONFIG[item.rarity] ?? RARITY_CONFIG[ItemRarity.COMMON];
  const canAfford = walletBalance >= item.gem_price;
  const imgSrc = item.image_url || FALLBACK_IMAGES[item.rarity];

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-2xl bg-card border overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1",
        "hover:shadow-xl",
        rarity.border,
        rarity.glow && `hover:shadow-lg ${rarity.glow}`,
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

      {/* Image */}
      <div className="relative w-full aspect-square bg-gradient-to-b from-black/60 to-black/20 overflow-hidden">
        <Image
          src={imgSrc}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className={cn("font-bold text-sm leading-snug", rarity.color)}>
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 font-bold text-sm">
            <Gem className="h-4 w-4 text-blue-400" />
            <span className="text-foreground">
              {item.gem_price.toLocaleString()}
            </span>
          </div>
          <Button
            size="sm"
            disabled={!canAfford}
            onClick={() => onBuy(item)}
            className={cn(
              "text-xs h-7 px-3 font-bold rounded-full",
              canAfford
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow"
                : "opacity-40 cursor-not-allowed",
            )}
          >
            {canAfford ? "Mua" : "Thiếu 💎"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function BuyModal({
  item,
  balance,
  onConfirm,
  onClose,
  isPending,
}: {
  item: Item;
  balance: number;
  onConfirm: () => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const rarity = RARITY_CONFIG[item.rarity] ?? RARITY_CONFIG[ItemRarity.COMMON];
  const imgSrc = item.image_url || FALLBACK_IMAGES[item.rarity];
  const remaining = balance - item.gem_price;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          "bg-card border rounded-2xl p-6 w-full max-w-sm shadow-2xl",
          rarity.border,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Xác nhận mua</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-5">
          <div className="relative h-20 w-20 rounded-xl overflow-hidden border border-border flex-shrink-0">
            <Image src={imgSrc} alt={item.name} fill className="object-cover" />
          </div>
          <div>
            <p className={cn("font-bold", rarity.color)}>{item.name}</p>
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                rarity.badge,
              )}
            >
              {rarity.label}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm bg-muted/40 rounded-xl p-4 mb-5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giá</span>
            <span className="font-bold flex items-center gap-1">
              <Gem className="h-3.5 w-3.5 text-blue-400" />
              {item.gem_price.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số dư hiện tại</span>
            <span className="font-bold flex items-center gap-1">
              <Gem className="h-3.5 w-3.5 text-blue-400" />
              {balance.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2 mt-2">
            <span className="text-muted-foreground">Còn lại</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <Gem className="h-3.5 w-3.5 text-blue-400" />
              {remaining.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isPending}
          >
            Huỷ
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Xác nhận mua"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  const { data: items = [], isLoading } = useItems();
  const { data: wallet } = useGemWallet();
  const { mutate: buy, isPending } = useBuyItem();
  const [selected, setSelected] = useState<Item | null>(null);
  const [filter, setFilter] = useState<ItemRarity | "all">("all");

  const balance = wallet?.balance ?? 0;
  const filtered =
    filter === "all" ? items : items.filter((i) => i.rarity === filter);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <h1 className="text-2xl font-black tracking-tight">
              Cửa hàng vật phẩm
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Dùng Ngọc Vàng để sở hữu các vật phẩm độc đáo
          </p>
        </div>
        <Link
          href="/wallet"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-400/30 hover:border-blue-400/60 transition-all"
        >
          <Gem className="h-4 w-4 text-blue-400" />
          <span className="font-bold text-blue-500 dark:text-blue-300 tabular-nums">
            {balance.toLocaleString()} 💎
          </span>
          <span className="text-xs text-muted-foreground">Ví của bạn</span>
        </Link>
      </div>

      {/* Rarity filter */}
      <div className="flex flex-wrap gap-2">
        {(
          ["all", ...Object.values(ItemRarity)] as Array<ItemRarity | "all">
        ).map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all",
              filter === r
                ? r === "all"
                  ? "bg-foreground text-background border-foreground"
                  : `${RARITY_CONFIG[r].badge} ${RARITY_CONFIG[r].border} border`
                : "border-border text-muted-foreground hover:border-foreground/40",
            )}
          >
            {r === "all" ? "Tất cả" : RARITY_CONFIG[r].label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-16 text-center">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-40" />
          <p className="text-muted-foreground font-medium">
            Chưa có vật phẩm nào. Admin sẽ thêm sớm!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              walletBalance={balance}
              onBuy={setSelected}
            />
          ))}
        </div>
      )}

      {/* Buy modal */}
      {selected && (
        <BuyModal
          item={selected}
          balance={balance}
          isPending={isPending}
          onConfirm={() =>
            buy(selected.id, { onSuccess: () => setSelected(null) })
          }
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
