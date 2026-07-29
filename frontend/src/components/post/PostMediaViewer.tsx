"use client";

import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { PostImage } from "@/types/post";

interface PostMediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: PostImage[];
  initialIndex?: number;
  postAuthor: {
    name: string;
    username?: string;
    avatar?: string;
  };
  postContent: string;
  postTimestamp: string;
  likes: number;
  isLiked?: boolean;
  onReact?: () => void;
}

export function PostMediaViewer({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  postAuthor,
  postContent,
  postTimestamp,
  likes,
  isLiked,
  onReact,
}: PostMediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reset index when opened with a new initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < images.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  if (!isOpen || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full w-screen h-screen m-0 p-0 rounded-none border-none bg-black flex overflow-hidden">
        <DialogTitle className="sr-only">Trình xem ảnh</DialogTitle>
        <DialogDescription className="sr-only">
          Hiển thị chi tiết ảnh của bài viết
        </DialogDescription>

        {/* Left Side: Dark Media Viewer (~75%) */}
        <div className="flex-1 relative flex items-center justify-center bg-black/95 select-none touch-none">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50 text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Navigation Prev */}
          {currentIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* Current Image */}
          <div className="w-full h-full p-4 flex items-center justify-center relative">
            <Image
              src={images[currentIndex].path}
              alt={`Ảnh ${currentIndex + 1}`}
              fill
              quality={100}
              className="object-contain p-4"
            />
          </div>

          {/* Navigation Next */}
          {currentIndex < images.length - 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-white/10 hover:bg-white/20 text-white rounded-full h-12 w-12"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}
        </div>

        {/* Right Side: White Post Info Sidebar (~360px width) */}
        <div className="w-[360px] shrink-0 bg-background flex flex-col border-l border-border relative overflow-y-auto custom-scrollbar">
          {/* Sidebar Header (Author) */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border shadow-sm cursor-pointer">
                <AvatarImage src={postAuthor.avatar} alt={postAuthor.name} />
                <AvatarFallback>{postAuthor.name[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[15px] font-semibold text-card-foreground leading-tight hover:underline cursor-pointer">
                  {postAuthor.name}
                </p>
                <p className="text-[13px] text-muted-foreground flex items-center gap-1 hover:underline cursor-pointer">
                  {postTimestamp}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-4">
            <p className="text-[15px] leading-relaxed text-card-foreground whitespace-pre-wrap">
              {postContent}
            </p>
          </div>

          {/* Action Stats (Empty spacing mimicking FB) */}
          <div className="flex flex-col px-4 py-2 mt-auto"></div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between border-y border-border/60 px-2 py-1 mx-4">
            <Button
              variant="ghost"
              className={cn(
                "flex-1 gap-2 text-muted-foreground hover:bg-muted font-semibold text-[14px]",
                isLiked &&
                  "text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-500 dark:hover:bg-blue-950",
              )}
              onClick={onReact}
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
              {likes > 0 ? likes : "Thích"}
            </Button>
            <Button
              variant="ghost"
              className="flex-1 gap-2 text-muted-foreground hover:bg-muted font-semibold text-[14px]"
            >
              <MessageCircle className="h-5 w-5" />
              Bình luận
            </Button>
            <Button
              variant="ghost"
              className="flex-1 gap-2 text-muted-foreground hover:bg-muted font-semibold text-[14px]"
            >
              <Share2 className="h-5 w-5" />
              Chia sẻ
            </Button>
          </div>

          {/* Comment Section Placeholder */}
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mb-3 text-muted/30" />
            <h4 className="font-semibold text-foreground">
              Chưa có bình luận nào
            </h4>
            <p className="text-sm mt-1">Hãy là người đầu tiên bình luận.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
