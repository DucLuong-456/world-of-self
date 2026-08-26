"use client";

import { useState, useEffect } from "react";
import { useEndGame, useStartGame } from "@/hooks/games/useGames";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { Gem, Play, Loader2, Gamepad2, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

// 6 ảnh mặt trước (Quái thú Yugioh)
const ICONS = [
  "/games/memory-match/card-1.png", // Dark Magician
  "/games/memory-match/card-2.png", // Blue Eyes
  "/games/memory-match/card-3.png", // Red Eyes Darkness
  "/games/memory-match/card-4.png", // Dragoon
  "/games/memory-match/card-5.png", // Monster Reborn
  "/games/memory-match/card-6.png", // Double Spell
];
const generateDeck = () => {
  const deck = [...ICONS, ...ICONS].map((icon, id) => ({
    id,
    imageSrc: icon,
    isFlipped: false,
    isMatched: false,
  }));
  // Xáo trộn mảng
  return deck.sort(() => Math.random() - 0.5);
};

export default function MemoryMatchPage() {
  const { data: wallet } = useGemWallet();
  const { mutate: startGame, isPending: isStarting } = useStartGame();
  const { mutate: endGame, isPending: isEnding } = useEndGame();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [cards, setCards] = useState(generateDeck());
  const [flippedIndexes, setFlippedIndexes] = useState<number[]>([]);
  const [lockBoard, setLockBoard] = useState(false);
  const [isWon, setIsWon] = useState(false);

  // Check matched
  useEffect(() => {
    if (flippedIndexes.length === 2) {
      setLockBoard(true);
      const [idx1, idx2] = flippedIndexes;

      if (cards[idx1].imageSrc === cards[idx2].imageSrc) {
        // Matched
        setTimeout(() => {
          setCards((prev) => {
            const newCards = [...prev];
            newCards[idx1].isMatched = true;
            newCards[idx2].isMatched = true;
            return newCards;
          });
          setFlippedIndexes([]);
          setLockBoard(false);
        }, 500);
      } else {
        // Not matched
        setTimeout(() => {
          setCards((prev) => {
            const newCards = [...prev];
            newCards[idx1].isFlipped = false;
            newCards[idx2].isFlipped = false;
            return newCards;
          });
          setFlippedIndexes([]);
          setLockBoard(false);
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flippedIndexes]);

  // Check win
  useEffect(() => {
    if (sessionId && cards.every((c) => c.isMatched)) {
      setIsWon(true);
      if (!isEnding) {
        endGame(sessionId, {
          onSuccess: () => setSessionId(null),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards, sessionId]);

  const handleStart = () => {
    startGame(undefined, {
      onSuccess: (res) => {
        setSessionId(res.session_id);
        setCards(generateDeck());
        setFlippedIndexes([]);
        setIsWon(false);
        setLockBoard(false);
      },
    });
  };

  const handleCardClick = (index: number) => {
    if (lockBoard) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (!sessionId) return; // Chưa bắt đầu

    setCards((prev) => {
      const newCards = [...prev];
      newCards[index].isFlipped = true;
      return newCards;
    });

    setFlippedIndexes((prev) => [...prev, index]);
  };

  const isPlaying = !!sessionId;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12 flex flex-col items-center select-none">
      {/* Title */}
      <div className="text-center space-y-1 w-full">
        <h1 className="text-3xl font-black tracking-tight flex items-center justify-center gap-2">
          <BrainCircuit className="h-8 w-8 text-indigo-400" />
          Thẻ Bài Trí Nhớ
        </h1>
        <p className="text-sm text-muted-foreground">
          Lật tìm 6 cặp biến thể giống nhau để nhận 50 💎
        </p>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-4 flex flex-col items-center gap-4 shadow-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/30">
          <Gem className="h-4 w-4 text-blue-400" />
          <span className="font-bold text-blue-400 tabular-nums">
            {wallet?.balance?.toLocaleString() ?? "0"} 💎
          </span>
        </div>

        <Button
          size="lg"
          disabled={isPlaying || isStarting || isEnding}
          onClick={handleStart}
          className={cn(
            "w-full h-12 rounded-full font-black text-base transition-all",
            isPlaying
              ? "bg-muted text-muted-foreground"
              : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:scale-105 hover:shadow-indigo-500/20",
          )}
        >
          {isStarting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            "Đang chơi..."
          ) : (
            <span className="flex items-center gap-2">
              <Play className="h-5 w-5" /> Bắt đầu (10 💎)
            </span>
          )}
        </Button>
      </div>

      {/* Game Board */}
      <div
        className={cn(
          "grid grid-cols-4 gap-4 md:gap-6 p-6 md:p-8 rounded-3xl bg-slate-900 shadow-inner relative transition-opacity duration-300",
          !isPlaying && !isWon
            ? "opacity-50 pointer-events-none grayscale-[50%]"
            : "opacity-100",
        )}
      >
        {!isPlaying && !isWon && (
          <div className="absolute inset-0 z-10 flex items-center justify-center backdrop-blur-[2px] rounded-3xl">
            <Gamepad2 className="h-16 w-16 text-white/30" />
          </div>
        )}

        {cards.map((card, i) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(i)}
            className="w-20 h-28 md:w-[110px] md:h-[160px] lg:w-[130px] lg:h-[188px] cursor-pointer relative"
            style={{ perspective: "1000px" }}
          >
            {/* Inner Flip */}
            <div
              className={cn(
                "w-full h-full relative transition-transform duration-500 rounded-xl shadow-lg",
              )}
              style={{
                transformStyle: "preserve-3d",
                transform:
                  card.isFlipped || card.isMatched
                    ? "rotateY(180deg)"
                    : "rotateY(0deg)",
              }}
            >
              {/* Mặt úp (Back Face) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl overflow-hidden shadow-lg",
                  "backface-hidden",
                )}
                style={{ backfaceVisibility: "hidden" }}
              >
                <Image
                  src="/games/memory-match/card-back.png"
                  alt="Card back"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Mặt ngửa (Front Face) */}
              <div
                className={cn(
                  "absolute inset-0 rounded-xl overflow-hidden shadow-lg border-2 transition-colors",
                  card.isMatched ? "border-green-400" : "border-slate-800",
                  "backface-hidden",
                )}
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <Image
                  src={card.imageSrc}
                  alt="Monster"
                  fill
                  className="object-cover"
                />
                {card.isMatched && (
                  <div className="absolute inset-0 bg-green-400/20 pointer-events-none animate-pulse z-10"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/40 p-5 text-center space-y-2 animate-in fade-in zoom-in-95">
          <p className="text-sm font-bold uppercase tracking-widest text-yellow-500">
            Tuyệt Vời!
          </p>
          <div className="text-3xl font-black text-yellow-400 flex justify-center items-center gap-2">
            +50 <Gem className="h-6 w-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            Đã cộng thưởng vào ví của bạn
          </p>
          {isEnding && (
            <Loader2 className="h-4 w-4 animate-spin mx-auto text-yellow-500 mt-2" />
          )}
        </div>
      )}
    </div>
  );
}
