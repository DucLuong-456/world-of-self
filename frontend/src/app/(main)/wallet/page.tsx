"use client";

import { useState } from "react";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import {
  useGemTransactions,
  useRedeemCode,
  useTransferGems,
} from "@/hooks/gem/useGemActions";
import { GemTxType, GemTransaction } from "@/types/gem";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Gem,
  Gift,
  Loader2,
  Send,
  Sparkles,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const TX_CONFIG: Record<
  GemTxType,
  { label: string; icon: React.ReactNode; isPositive: boolean }
> = {
  [GemTxType.EARN_INVITE]: {
    label: "Nhập mã mời",
    icon: <Ticket className="h-4 w-4" />,
    isPositive: true,
  },
  [GemTxType.EARN_LOGIN]: {
    label: "Điểm danh",
    icon: <Sparkles className="h-4 w-4" />,
    isPositive: true,
  },
  [GemTxType.EARN_SPIN]: {
    label: "Vòng quay",
    icon: <Sparkles className="h-4 w-4" />,
    isPositive: true,
  },
  [GemTxType.EARN_QUEST]: {
    label: "Nhiệm vụ",
    icon: <Sparkles className="h-4 w-4" />,
    isPositive: true,
  },
  [GemTxType.SPEND_BUY]: {
    label: "Mua vật phẩm",
    icon: <Gift className="h-4 w-4" />,
    isPositive: false,
  },
  [GemTxType.TRANSFER_SEND]: {
    label: "Chuyển Ngọc",
    icon: <ArrowUpRight className="h-4 w-4" />,
    isPositive: false,
  },
  [GemTxType.TRANSFER_RECV]: {
    label: "Nhận Ngọc",
    icon: <ArrowDownLeft className="h-4 w-4" />,
    isPositive: true,
  },
};

function TransactionRow({ tx }: { tx: GemTransaction }) {
  const cfg = TX_CONFIG[tx.type] ?? {
    label: tx.type,
    icon: <Gem className="h-4 w-4" />,
    isPositive: true,
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div
        className={cn(
          "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
          cfg.isPositive
            ? "bg-green-500/10 text-green-400"
            : "bg-red-500/10 text-red-400",
        )}
      >
        {cfg.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{cfg.label}</p>
        {tx.note && (
          <p className="text-xs text-muted-foreground truncate">{tx.note}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        <p
          className={cn(
            "font-bold text-sm",
            cfg.isPositive ? "text-green-400" : "text-red-400",
          )}
        >
          {cfg.isPositive ? "+" : "-"}
          {tx.amount.toLocaleString()} 💎
        </p>
        <p className="text-[11px] text-muted-foreground">
          {new Date(tx.created_at).toLocaleDateString("vi-VN")}
        </p>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { data: wallet, isLoading: walletLoading } = useGemWallet();
  const { data: txData, isLoading: txLoading } = useGemTransactions(1, 30);

  const { mutate: redeem, isPending: isRedeeming } = useRedeemCode();
  const { mutate: transfer, isPending: isTransferring } = useTransferGems();

  const [code, setCode] = useState("");
  const [toUserId, setToUserId] = useState("");
  const [amount, setAmount] = useState("");

  const balance = wallet?.balance ?? 0;
  const transactions = txData?.transactions ?? [];

  const handleRedeem = () => {
    if (!code.trim()) return;
    redeem(code, { onSuccess: () => setCode("") });
  };

  const handleTransfer = () => {
    const amt = parseInt(amount);
    if (!toUserId.trim() || !amt || amt <= 0) return;
    transfer(
      { to_user_id: toUserId.trim(), amount: amt },
      {
        onSuccess: () => {
          setToUserId("");
          setAmount("");
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Balance Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
        <div className="relative">
          <p className="text-sm font-medium text-blue-200 mb-1">
            Số dư Ngọc Vàng
          </p>
          <div className="flex items-end gap-2">
            <Gem className="h-8 w-8 text-blue-300 mb-1" />
            {walletLoading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <span className="text-5xl font-black tabular-nums tracking-tight">
                {balance.toLocaleString()}
              </span>
            )}
            <span className="text-blue-200 mb-1">💎</span>
          </div>
          <p className="text-xs text-blue-300 mt-3">
            Dùng Ngọc Vàng để mua vật phẩm trong{" "}
            <Link
              href="/shop"
              className="underline font-semibold hover:text-white"
            >
              Cửa hàng
            </Link>
          </p>
        </div>
      </div>

      {/* Actions grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Redeem code */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Ticket className="h-4 w-4 text-green-400" />
            Nhập mã mời
          </div>
          <Input
            placeholder="VD: TANTHU"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
            className="font-mono tracking-widest"
          />
          <Button
            className="w-full bg-green-500 hover:bg-green-600 font-bold"
            onClick={handleRedeem}
            disabled={!code.trim() || isRedeeming}
          >
            {isRedeeming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Nhận Ngọc 💎"
            )}
          </Button>
        </div>

        {/* Transfer */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Send className="h-4 w-4 text-blue-400" />
            Chuyển Ngọc
          </div>
          <Input
            placeholder="User ID người nhận"
            value={toUserId}
            onChange={(e) => setToUserId(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Số lượng 💎"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={1}
          />
          <Button
            className="w-full font-bold bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            onClick={handleTransfer}
            disabled={!toUserId || !amount || isTransferring}
          >
            {isTransferring ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Chuyển 💎"
            )}
          </Button>
        </div>
      </div>

      {/* Transaction history */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Gem className="h-4 w-4 text-blue-400" />
          <h2 className="font-bold text-sm">Lịch sử giao dịch</h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {txData?.paging?.totalCount ?? 0} giao dịch
          </span>
        </div>

        <div className="px-5">
          {txLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Chưa có giao dịch nào.
            </div>
          ) : (
            transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
          )}
        </div>
      </div>
    </div>
  );
}
