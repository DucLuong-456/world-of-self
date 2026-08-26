"use client";

import { useCheckInStatus, useCheckIn } from "@/hooks/gem/useGamification";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { CalendarCheck, CheckCircle2, Flame, Gem, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Thưởng ngày 1-7, lặp lại hàng tuần */
const STREAK_REWARDS = [50, 60, 70, 80, 90, 100, 200];

export default function CheckInPage() {
  const { data: status, isLoading } = useCheckInStatus();
  const { data: wallet } = useGemWallet();
  const { mutate: checkIn, isPending } = useCheckIn();

  const streak = status?.current_streak ?? 0;
  const checkedToday = status?.checked_today ?? false;
  const balance = wallet?.balance ?? 0;

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-black flex items-center justify-center gap-2">
          <CalendarCheck className="h-6 w-6 text-green-400" />
          Điểm danh hàng ngày
        </h1>
        <p className="text-sm text-muted-foreground">
          Điểm danh mỗi ngày để nhận Ngọc Vàng và duy trì streak!
        </p>
      </div>

      {/* Balance */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30">
          <Gem className="h-4 w-4 text-blue-400" />
          <span className="font-bold text-blue-400 tabular-nums">
            {balance.toLocaleString()} 💎
          </span>
        </div>
      </div>

      {/* Streak card */}
      <div className="rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-500/10 to-red-500/5 p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
          <Flame className="h-7 w-7 text-orange-400" />
        </div>
        <div>
          <p className="text-3xl font-black text-orange-400">{streak} ngày</p>
          <p className="text-sm text-muted-foreground">Streak hiện tại</p>
        </div>
        {checkedToday && (
          <CheckCircle2 className="ml-auto h-6 w-6 text-green-400 flex-shrink-0" />
        )}
      </div>

      {/* Weekly streak calendar */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <p className="text-sm font-bold">Phần thưởng 7 ngày</p>
        <div className="grid grid-cols-7 gap-2">
          {STREAK_REWARDS.map((gems, i) => {
            const dayNum = i + 1;
            const streakDay = streak % 7 || 7;
            const isPast = dayNum < streakDay;
            const isCurrent = dayNum === streakDay;
            const isFuture = dayNum > streakDay;

            return (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl p-2 border transition-all",
                  isPast && "bg-green-500/10 border-green-400/30",
                  isCurrent &&
                    checkedToday &&
                    "bg-green-500/20 border-green-400/60 ring-2 ring-green-400/50",
                  isCurrent &&
                    !checkedToday &&
                    "bg-yellow-500/10 border-yellow-400/50 ring-2 ring-yellow-400/40",
                  isFuture && "border-border opacity-50",
                )}
              >
                <span className="text-[10px] font-bold text-muted-foreground">
                  N{dayNum}
                </span>
                {isPast ? (
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                ) : (
                  <Gem
                    className={cn(
                      "h-4 w-4",
                      isCurrent ? "text-yellow-400" : "text-muted-foreground",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-[10px] font-bold tabular-nums",
                    isCurrent ? "text-yellow-400" : "text-muted-foreground",
                  )}
                >
                  {gems}💎
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Check-in button */}
      <Button
        size="lg"
        disabled={checkedToday || isPending || isLoading}
        onClick={() => checkIn()}
        className={cn(
          "w-full h-14 rounded-2xl text-base font-black shadow-lg transition-all",
          checkedToday
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white hover:scale-[1.02]",
        )}
      >
        {isLoading || isPending ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : checkedToday ? (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            Đã điểm danh hôm nay!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Điểm danh — nhận{" "}
            {status?.today_reward ?? STREAK_REWARDS[streak % 7]} 💎
          </span>
        )}
      </Button>

      {/* Recent history */}
      {status?.recent_checkins && status.recent_checkins.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-5 py-3 border-b border-border text-sm font-bold">
            Lịch sử 7 ngày gần nhất
          </div>
          <div className="divide-y divide-border/50">
            {status.recent_checkins.map((ci) => (
              <div key={ci.id} className="flex items-center gap-3 px-5 py-3">
                <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {new Date(ci.checked_date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "numeric",
                      month: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Streak: {ci.streak} ngày
                  </p>
                </div>
                <span className="font-bold text-green-400 text-sm">
                  +{ci.gems_earned} 💎
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
