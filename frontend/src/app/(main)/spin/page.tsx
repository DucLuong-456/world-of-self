"use client";

import { useRef, useState } from "react";
import { useSpinStatus, useSpin } from "@/hooks/gem/useGamification";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { Gem, Loader2, RotateCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// 8 ô vòng quay — phải khớp với SPIN_SLOTS ở backend
const SLOTS = [
  { gems: 30, label: "30 💎", color: "from-slate-500  to-slate-600" },
  { gems: 50, label: "50 💎", color: "from-blue-500   to-blue-600" },
  { gems: 100, label: "100 💎", color: "from-green-500  to-green-600" },
  { gems: 150, label: "150 💎", color: "from-teal-500   to-teal-600" },
  { gems: 200, label: "200 💎", color: "from-violet-500 to-violet-600" },
  { gems: 300, label: "300 💎", color: "from-purple-500 to-purple-600" },
  { gems: 500, label: "500 💎", color: "from-pink-500   to-pink-600" },
  { gems: 1000, label: "1000 💎 🎉", color: "from-yellow-400 to-amber-500" },
];

const SLOT_COUNT = SLOTS.length;
const SLOT_DEG = 360 / SLOT_COUNT; // 45° mỗi ô

export default function SpinPage() {
  const { data: status, isLoading } = useSpinStatus();
  const { data: wallet } = useGemWallet();
  const { mutate: spin, isPending } = useSpin();

  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{
    gems_earned: number;
    label: string;
    slot_index: number;
  } | null>(null);
  const baseRotationRef = useRef(0);

  const handleSpin = () => {
    if (isSpinning || status?.spun_today) return;
    setResult(null);
    setIsSpinning(true);

    spin(undefined, {
      onSuccess: (data) => {
        // Tính góc quay: quay ít nhất 5 vòng + dừng đúng ô
        const targetSlot = data.slot_index;
        // Ô 0 nằm ở góc 0°, quay ngược chiều kim → ô targetSlot ở góc targetSlot * SLOT_DEG
        const stopAngle = 360 - targetSlot * SLOT_DEG - SLOT_DEG / 2;
        const extraRotations = 5 * 360;
        const newRotation =
          baseRotationRef.current + extraRotations + stopAngle;
        baseRotationRef.current = newRotation % 360;
        setRotation(newRotation);

        setTimeout(() => {
          setIsSpinning(false);
          setResult({
            gems_earned: data.gems_earned,
            label: data.label,
            slot_index: data.slot_index,
          });
        }, 4500);
      },
      onError: () => {
        setIsSpinning(false);
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 pb-12 flex flex-col items-center">
      {/* Title */}
      <div className="text-center space-y-1 w-full">
        <h1 className="text-2xl font-black tracking-tight flex items-center justify-center gap-2">
          <RotateCw className="h-6 w-6 text-yellow-400" />
          Vòng quay may mắn
        </h1>
        <p className="text-sm text-muted-foreground">
          Quay 1 lần mỗi ngày — nhận từ 30 đến 1000 💎
        </p>
      </div>

      {/* Balance */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30">
        <Gem className="h-4 w-4 text-blue-400" />
        <span className="font-bold text-blue-400 tabular-nums">
          {wallet?.balance?.toLocaleString() ?? "0"} 💎
        </span>
      </div>

      {/* Wheel */}
      {isLoading ? (
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      ) : (
        <div
          className="relative flex items-center justify-center"
          style={{ width: 300, height: 300 }}
        >
          {/* Pointer (mũi tên ở trên) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20 text-2xl drop-shadow-lg">
            ▼
          </div>

          {/* Vòng quay */}
          <div
            className="relative w-[280px] h-[280px] rounded-full border-4 border-white/20 shadow-2xl overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning
                ? "transform 4s cubic-bezier(0.17,0.67,0.12,0.99)"
                : "none",
            }}
          >
            {SLOTS.map((slot, i) => {
              const angle = i * SLOT_DEG;
              return (
                <div
                  key={i}
                  className={cn(
                    "absolute inset-0 flex items-start justify-center",
                    `bg-gradient-to-b ${slot.color}`,
                  )}
                  style={{
                    clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((angle - SLOT_DEG / 2) * Math.PI) / 180)}% ${50 - 50 * Math.sin(((angle - SLOT_DEG / 2) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((angle + SLOT_DEG / 2) * Math.PI) / 180)}% ${50 - 50 * Math.sin(((angle + SLOT_DEG / 2) * Math.PI) / 180)}%)`,
                  }}
                >
                  <span
                    className="text-white font-black text-[11px] mt-4 select-none"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-80px)`,
                      display: "block",
                      width: 60,
                      textAlign: "center",
                      textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    }}
                  >
                    {slot.label}
                  </span>
                </div>
              );
            })}
            {/* Center circle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gray-200">
                <Gem className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div className="w-full rounded-2xl bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/40 p-5 text-center space-y-1 animate-in fade-in slide-in-from-bottom-3">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-500">
            Chúc mừng!
          </p>
          <p className="text-3xl font-black text-yellow-400">{result.label}</p>
          <p className="text-sm text-muted-foreground">
            Đã cộng vào ví của bạn
          </p>
        </div>
      )}

      {/* Spin button */}
      <Button
        size="lg"
        disabled={isSpinning || status?.spun_today || isLoading || isPending}
        onClick={handleSpin}
        className={cn(
          "w-48 h-12 rounded-full font-black text-base shadow-lg transition-all",
          status?.spun_today
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black hover:scale-105",
        )}
      >
        {isSpinning ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : status?.spun_today ? (
          "Đã quay hôm nay"
        ) : (
          "QUAY NGAY!"
        )}
      </Button>

      {status?.spun_today && (
        <p className="text-xs text-muted-foreground">
          Quay lại vào ngày mai nhé 😊
        </p>
      )}

      {/* History */}
      {status?.history && status.history.length > 0 && (
        <div className="w-full rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <h2 className="font-bold text-sm">Lịch sử vòng quay</h2>
          </div>
          <div className="divide-y divide-border/50">
            {status.history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 px-5 py-3">
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold bg-gradient-to-br",
                    SLOTS[h.slot_index]?.color ?? "from-gray-500 to-gray-600",
                  )}
                >
                  <span className="text-white text-xs">
                    #{h.slot_index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {SLOTS[h.slot_index]?.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(h.created_at).toLocaleString("vi-VN")}
                  </p>
                </div>
                <span className="font-bold text-green-400 text-sm">
                  +{h.gems_earned.toLocaleString()} 💎
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
