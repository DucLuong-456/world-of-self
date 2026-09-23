"use client";

import { useEffect, useRef, useState } from "react";
import { useStartStrikers, useEndStrikers } from "@/hooks/games/useGames";
import { useGemWallet } from "@/hooks/gem/useGemWallet";
import { Gem, Play, Loader2, Rocket, RotateCcw, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- ENGINE CONFIG ---
const CANVAS_W = 800;
const CANVAS_H = 600;

export default function SpaceShooterPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: wallet } = useGemWallet();
  const { mutate: startGame, isPending: isStarting } = useStartStrikers();
  const { mutate: endGame, isPending: isEnding } = useEndStrikers();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [weaponLvlState, setWeaponLvlState] = useState(1);
  const [bossHp, setBossHp] = useState(0);
  const [bossMaxHp, setBossMaxHp] = useState(0);

  const isPlayingRef = useRef(false);
  const scoreRef = useRef(0);
  const nextBossScoreRef = useRef(50); // Mốc điểm xuất hiện Boss đầu tiên

  // Sprites
  const images = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    const loadImg = (name: string, src: string) => {
      const img = new Image();
      img.src = src;
      images.current[name] = img;
    };
    loadImg("player", "/games/strikers/player.png");
    loadImg("meteor", "/games/strikers/meteor.png"); // Thay vì hình thù vô định, thiên thạch tròn
    loadImg("enemy", "/games/strikers/enemy.png");
    loadImg("boss", "/games/strikers/boss.png");
  }, []);

  const handleStart = () => {
    startGame(undefined, {
      onSuccess: (res) => {
        setSessionId(res.session_id);
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setWeaponLvlState(1);
        setBossHp(0);

        scoreRef.current = 0;
        nextBossScoreRef.current = 50; // Trở lại mốc 50
        isPlayingRef.current = true;
      },
    });
  };

  const handleEndGame = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setGameOver(true);
    if (sessionId) {
      endGame(
        { sessionId, score: scoreRef.current },
        {
          onSuccess: () => setSessionId(null),
        },
      );
    }
  };

  // --- GAME ENGINE LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = 0;

    // Khởi tạo Player (to hơn tí cho đẹp Sprite)
    const player = {
      x: CANVAS_W / 2,
      y: CANVAS_H - 80,
      w: 60,
      h: 60,
      speed: 400,
    };

    // Weapon & Power-ups
    let weaponLvl = 1;
    let weaponTimer = 0;

    // Game Entities
    const bullets: {
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      vx: number;
    }[] = [];
    const enemyBullets: {
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      vx: number;
    }[] = [];

    // type = 0 (meteor), type = 1 (enemy ship)
    const enemies: {
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
      hp: number;
      maxHp: number;
      type: number;
    }[] = [];
    const items: {
      x: number;
      y: number;
      w: number;
      h: number;
      speed: number;
    }[] = [];
    let boss: {
      active: boolean;
      x: number;
      y: number;
      w: number;
      h: number;
      hp: number;
      maxHp: number;
      timer: number;
      phaseY: boolean;
    } = {
      active: false,
      x: 0,
      y: 0,
      w: 180,
      h: 180,
      hp: 0,
      maxHp: 0,
      timer: 0,
      phaseY: true,
    };
    let globalTime = 0;

    // Inputs
    const keys = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      Space: false,
    };

    // Timers
    let bulletTimer = 0;
    let enemyTimer = 0;
    const fireRate = 0.12;
    let enemySpawnRate = 1.2;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keys) keys[e.code as keyof typeof keys] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keys) keys[e.code as keyof typeof keys] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Chuột / Touch
    const handleMouse = (e: MouseEvent | TouchEvent) => {
      if (!isPlayingRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const clientX =
        e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
      const clientY =
        e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;

      const scaleX = CANVAS_W / rect.width;
      const scaleY = CANVAS_H / rect.height;

      const px = (clientX - rect.left) * scaleX;
      let py = (clientY - rect.top) * scaleY;

      // Ở mobile, đẩy vị trí ngón tay lệch xuống dưới xíu để không che mất tàu
      if (typeof TouchEvent !== "undefined" && e instanceof TouchEvent) {
        py -= 60;
      }

      // Smooth follow
      player.x += (px - player.x) * 0.3;
      player.y += (py - player.y) * 0.3;

      // Giới hạn
      if (player.x < player.w / 2) player.x = player.w / 2;
      if (player.x > CANVAS_W - player.w / 2)
        player.x = CANVAS_W - player.w / 2;
      if (player.y < player.h / 2) player.y = player.h / 2;
      if (player.y > CANVAS_H - player.h / 2)
        player.y = CANVAS_H - player.h / 2;
    };
    canvas.addEventListener("mousemove", handleMouse);
    canvas.addEventListener("touchmove", handleMouse);

    const update = (dt: number) => {
      if (!isPlayingRef.current) return;
      globalTime += dt;

      // Phím cứng di chuyển
      if (keys.ArrowLeft && player.x > player.w / 2)
        player.x -= player.speed * dt;
      if (keys.ArrowRight && player.x < CANVAS_W - player.w / 2)
        player.x += player.speed * dt;
      if (keys.ArrowUp && player.y > player.h / 2)
        player.y -= player.speed * dt;
      if (keys.ArrowDown && player.y < CANVAS_H - player.h / 2)
        player.y += player.speed * dt;

      // Update Timer Weapon
      if (weaponTimer > 0) {
        weaponTimer -= dt;
        if (weaponTimer <= 0) {
          weaponLvl = 1;
          setWeaponLvlState(1);
        }
      }

      // Bắn Đạn Player
      bulletTimer += dt;
      if (bulletTimer >= fireRate) {
        bulletTimer = 0;
        const bSpeed = 800;
        // Weapon Lvl tuỳ số lượng tia
        if (weaponLvl === 1) {
          bullets.push({
            x: player.x,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: 0,
          });
        } else if (weaponLvl === 2) {
          bullets.push({
            x: player.x - 15,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: 0,
          });
          bullets.push({
            x: player.x + 15,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: 0,
          });
        } else {
          bullets.push({
            x: player.x,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: 0,
          });
          bullets.push({
            x: player.x - 20,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: -50,
          });
          bullets.push({
            x: player.x + 20,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: 50,
          });
          bullets.push({
            x: player.x - 30,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: -120,
          });
          bullets.push({
            x: player.x + 30,
            y: player.y - player.h / 2,
            w: 4,
            h: 20,
            speed: bSpeed,
            vx: 120,
          });
        }
      }

      // Cập nhật trạng thái Đạn Player
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.y -= b.speed * dt;
        b.x += b.vx * dt;
        if (b.y < -b.h || b.x < 0 || b.x > CANVAS_W) bullets.splice(i, 1);
      }

      // Cập nhật Đạn Enemy
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const b = enemyBullets[i];
        b.y += b.speed * dt;
        b.x += b.vx * dt;

        // Va chạm Đạn Enemy vs Player
        const dist = Math.hypot(b.x - player.x, b.y - player.y);
        if (dist < (player.w / 2) * 0.5) {
          // hitbox thật gắt
          handleEndGame();
          return;
        }

        if (b.y > CANVAS_H + b.h) enemyBullets.splice(i, 1);
      }

      // Spawn Boss theo mốc
      if (scoreRef.current >= nextBossScoreRef.current && !boss.active) {
        nextBossScoreRef.current += 50;
        boss = {
          active: true,
          x: CANVAS_W / 2,
          y: -100, // ngoài rìa
          w: 150,
          h: 150,
          maxHp: 150 + Math.floor(scoreRef.current / 50) * 100,
          hp: 150 + Math.floor(scoreRef.current / 50) * 100,
          timer: 0,
          phaseY: true, // Đang chạy ra
        };
        setBossHp(boss.hp);
        setBossMaxHp(boss.maxHp);
      }

      // Cập nhật Boss
      if (boss.active) {
        boss.timer += dt;
        if (boss.phaseY) {
          boss.y += 100 * dt;
          if (boss.y >= 120) boss.phaseY = false;
        } else {
          // Boss di chuyển ngang mượt mà
          boss.x =
            CANVAS_W / 2 + Math.sin(globalTime * 1.5) * (CANVAS_W / 2 - boss.w);

          // Boss Xả Đạn chùm
          if (boss.timer > 1.2) {
            boss.timer = 0;
            // Bắn toả hình quạt
            const angles = [-0.6, -0.3, 0, 0.3, 0.6];
            angles.forEach((ang) => {
              enemyBullets.push({
                x: boss.x,
                y: boss.y + boss.h / 2,
                w: 8,
                h: 8,
                speed: 250,
                vx: Math.tan(ang) * 250,
              });
            });
          }
        }
      }

      // Spawn Enemies thông thường (Nếu ko có boss thì ra nhanh hơn)
      enemyTimer += dt;
      let spRate = boss.active ? enemySpawnRate * 2 : enemySpawnRate;

      if (enemyTimer >= spRate) {
        enemyTimer = 0;
        enemySpawnRate = Math.max(0.4, enemySpawnRate * 0.98); // Nhanh dần

        const type = Math.random() > 0.6 ? 1 : 0; // 0: meteor, 1: ship
        const w = type === 1 ? 70 : 50;
        const hp = type === 1 ? 5 : 2;

        enemies.push({
          x: Math.random() * (CANVAS_W - w * 2) + w,
          y: -w,
          w: w,
          h: w,
          speed: (type === 1 ? 120 : 180) + Math.random() * 80,
          hp,
          maxHp: hp,
          type,
        });
      }

      // Cập nhật Enemy
      for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        en.y += en.speed * dt;

        if (en.type === 1) {
          // Lạng lách
          en.x += Math.sin(globalTime * 3 + i) * 80 * dt;
        }

        if (en.y > CANVAS_H + en.h) {
          enemies.splice(i, 1);
          continue;
        }

        // Va chạm Quái vào Player
        const distToP = Math.hypot(en.x - player.x, en.y - player.y);
        if (distToP < ((en.w + player.w) / 2) * 0.6) {
          handleEndGame();
          return;
        }
      }

      // Cập nhật Item (Powerup)
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed * dt;

        // Player nhặt Item
        const dist = Math.hypot(it.x - player.x, it.y - player.y);
        if (dist < (it.w + player.w) / 2) {
          // Lên level súng
          weaponLvl = Math.min(weaponLvl + 1, 3);
          weaponTimer = 12; // 12 giây
          setWeaponLvlState(weaponLvl);
          items.splice(i, 1); // Ăn
          continue;
        }

        if (it.y > CANVAS_H) items.splice(i, 1);
      }

      // Lưới Va chạm Đạn Player <-> Kẻ Địch / Boss
      for (let j = bullets.length - 1; j >= 0; j--) {
        const b = bullets[j];
        let hit = false;

        // Vs Boss
        if (
          boss.active &&
          b.y > boss.y - boss.h / 2 &&
          b.y < boss.y + boss.h / 2 &&
          b.x > boss.x - boss.w / 2 &&
          b.x < boss.x + boss.w / 2
        ) {
          boss.hp -= 1;
          setBossHp(boss.hp);
          hit = true;
          if (boss.hp <= 0) {
            boss.active = false;
            scoreRef.current += 30; // Điểm to
            setScore(scoreRef.current);
            // Nhả cục Powerup luôn cho VIP
            items.push({ x: boss.x - 30, y: boss.y, w: 30, h: 30, speed: 100 });
            items.push({ x: boss.x + 30, y: boss.y, w: 30, h: 30, speed: 100 });
          }
        }

        // Vs Thường
        if (!hit) {
          for (let i = enemies.length - 1; i >= 0; i--) {
            const en = enemies[i];

            // Xấp xỉ HCN cho nhanh
            if (
              b.x > en.x - en.w / 2 &&
              b.x < en.x + en.w / 2 &&
              b.y > en.y - en.h / 2 &&
              b.y < en.y + en.h / 2
            ) {
              en.hp--;
              hit = true;
              if (en.hp <= 0) {
                // Tỉ lệ rớt hòm vũ khí 15% hoặc nếu lvl1 thì hên 25% cho mau lên
                const dropRate = weaponLvl === 1 ? 0.25 : 0.08;
                if (Math.random() < dropRate) {
                  items.push({ x: en.x, y: en.y, w: 30, h: 30, speed: 150 });
                }

                enemies.splice(i, 1);
                scoreRef.current += en.type === 1 ? 2 : 1;
                setScore(scoreRef.current);
                break;
              }
            }
          }
        }

        if (hit) bullets.splice(j, 1);
      }
    };

    const draw = () => {
      // Background (Space dark)
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

      // Effect sao bay tuỳ thời gian
      ctx.fillStyle = "#ffffff";
      for (let i = 0; i < 30; i++) {
        const sx = (i * 123 + globalTime * 50) % CANVAS_W;
        const sy = (i * 321 + globalTime * 200) % CANVAS_H;
        ctx.fillRect(sx, sy, 2, 2);
      }

      if (!isPlayingRef.current) {
        ctx.fillStyle = "rgba(20, 20, 30, 0.6)";
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        return;
      }

      // Draw Item
      items.forEach((it) => {
        // Cục nâng cấp VIP
        ctx.fillStyle = "#fbbf24";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f59e0b";
        ctx.beginPath();
        ctx.arc(it.x, it.y, it.w / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("P", it.x, it.y + 5);
        ctx.shadowBlur = 0;
      });

      // Draw Player Sprite hoặc Fallback
      if (
        images.current.player?.complete &&
        images.current.player.naturalHeight
      ) {
        ctx.drawImage(
          images.current.player,
          player.x - player.w / 2,
          player.y - player.h / 2,
          player.w,
          player.h,
        );
      } else {
        ctx.fillStyle = "#3b82f6";
        ctx.beginPath();
        ctx.moveTo(player.x, player.y - player.h / 2);
        ctx.lineTo(player.x - player.w / 2, player.y + player.h / 2);
        ctx.lineTo(player.x + player.w / 2, player.y + player.h / 2);
        ctx.fill();
      }

      // Draw engine fire
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(
        player.x,
        player.y + player.h / 2 + Math.random() * 5,
        player.w / 5,
        0,
        Math.PI,
      );
      ctx.fill();

      // Draw Player Bullets
      ctx.fillStyle = "#22d3ee"; // Màu xanh dương nhạt Laser
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#06b6d4";
      bullets.forEach((b) => {
        // Nghiêng viên đạn theo vx cho chân thực
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.vx * 0.002);
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      });
      ctx.shadowBlur = 0;

      // Draw Enemy Bullets
      ctx.fillStyle = "#ef4444"; // Đạn địch đỏ
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ef4444";
      enemyBullets.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.w, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Draw Enemies
      enemies.forEach((en) => {
        ctx.save();
        ctx.translate(en.x, en.y);

        let img = en.type === 1 ? images.current.enemy : images.current.meteor;

        if (img?.complete && img.naturalHeight) {
          if (en.type === 0) {
            // Xoay thiên thạch cho ngầu
            ctx.rotate(globalTime * 2 + en.x);
          }
          ctx.drawImage(img, -en.w / 2, -en.h / 2, en.w, en.h);
        } else {
          // Fallback
          ctx.fillStyle = en.type === 1 ? "#ec4899" : "#64748b";
          ctx.beginPath();
          ctx.arc(0, 0, en.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vẽ Bar HP mini
        if (en.hp < en.maxHp) {
          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(-en.w / 2, -en.h / 2 - 10, en.w, 4);
          ctx.fillStyle = "#10b981";
          ctx.fillRect(-en.w / 2, -en.h / 2 - 10, en.w * (en.hp / en.maxHp), 4);
        }
        ctx.restore();
      });

      // Draw Boss
      if (boss.active) {
        ctx.save();
        ctx.translate(boss.x, boss.y);
        if (
          images.current.boss?.complete &&
          images.current.boss.naturalHeight
        ) {
          ctx.drawImage(
            images.current.boss,
            -boss.w / 2,
            -boss.h / 2,
            boss.w,
            boss.h,
          );
        } else {
          ctx.fillStyle = "#b91c1c";
          ctx.fillRect(-boss.w / 2, -boss.h / 2, boss.w, boss.h);
        }
        ctx.restore();
      }
    };

    const gameLoop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (dt < 0.1) update(dt);
      draw();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(gameLoop);
    } else {
      draw(); // Draw standby background
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("mousemove", handleMouse);
      canvas.removeEventListener("touchmove", handleMouse);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12 flex flex-col items-center">
      <div className="text-center space-y-1 w-full relative z-10">
        <h1 className="text-3xl font-black tracking-tight flex items-center justify-center gap-2">
          <Rocket className="h-8 w-8 text-rose-500" />
          Strikers 1945
        </h1>
        <p className="text-sm text-muted-foreground">
          Boss xuất hiện mỗi 50 Điểm. | Hộp nâng cấp súng (P) chùm tia.
        </p>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-[800px] flex flex-col md:flex-row items-center justify-between gap-4 py-2 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
            <Gem className="h-5 w-5 text-blue-400" />
            <span className="font-black text-blue-100 text-lg tabular-nums">
              {wallet?.balance?.toLocaleString() ?? "0"}
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-sm min-w-32 justify-center">
            <Crosshair className="h-5 w-5 text-rose-400" />
            <span className="font-black text-white text-lg tabular-nums">
              {score} 💥
            </span>
          </div>

          {/* Cấp độ Vũ khí Tạm thời */}
          <div className="flex items-center px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 font-bold">
            Lv.{weaponLvlState} Đạn
          </div>
        </div>

        <Button
          size="lg"
          disabled={isPlaying || isStarting || isEnding}
          onClick={handleStart}
          className={cn(
            "h-12 px-6 rounded-full font-black text-base shadow-lg",
            isPlaying
              ? "bg-slate-700 text-slate-300"
              : "bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 border-none text-white hover:scale-105",
          )}
        >
          {isStarting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : isPlaying ? (
            "Chạm chuột vào Vũ Trụ để lái"
          ) : (
            <span className="flex items-center gap-2">
              {gameOver ? (
                <RotateCcw className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              {gameOver ? "Chơi Lại (10 💎)" : "Xuất Kích (10 💎)"}
            </span>
          )}
        </Button>
      </div>

      {/* Vùng chứa Game */}
      <div className="relative w-full aspect-[4/3] max-w-[800px] rounded-3xl overflow-hidden shadow-2xl bg-black touch-none">
        {/* Boss HP HUD */}
        {isPlaying && bossHp > 0 && bossMaxHp > 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-64 h-6 bg-slate-900/80 border border-slate-600 rounded-full p-1 z-20 flex overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full transition-all duration-300"
              style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
            />
            <span className="absolute inset-0 flex text-[10px] items-center justify-center font-black text-white drop-shadow-md">
              BOSS HP: {bossHp} / {bossMaxHp}
            </span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 z-30">
            <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-yellow-500 uppercase tracking-widest drop-shadow-lg mb-6">
              Game Over
            </h2>
            <div className="bg-slate-900/90 border-2 border-slate-700/50 p-8 rounded-3xl shadow-xl flex flex-col items-center gap-4 min-w-[320px]">
              <div className="text-xl font-bold text-slate-400 uppercase tracking-widest">
                Score
              </div>
              <div className="text-7xl font-black text-white tabular-nums drop-shadow-2xl">
                {score}
              </div>

              <div className="w-full h-px bg-slate-700 my-4" />

              <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Phần thưởng (10 điểm = 5 💎)
              </div>
              <div className="text-4xl font-black text-blue-400 flex items-center gap-3 tabular-nums mt-1">
                + {Math.floor(score / 10) * 5}{" "}
                <Gem className="h-10 w-10 text-cyan-400 drop-shadow-lg" />
              </div>

              {isEnding && (
                <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mt-4 bg-rose-500/10 px-4 py-2 rounded-full border border-rose-500/20">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang cập nhật Ví
                  Ngọc...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
