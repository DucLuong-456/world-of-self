"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PostImage, PostTemplate } from "@/types/post";
import { PostMediaViewer } from "./PostMediaViewer";

interface PostCardProps {
  author: {
    name: string;
    username?: string;
    avatar?: string;
  };
  content: string;
  images?: PostImage[];
  template?: PostTemplate | null;
  timestamp: string;
  isLiked?: boolean;
  onReact?: () => void;
}

// --- Image Grid Component (Facebook Style) ---
function PostImageGrid({
  images,
  onImageClick,
}: {
  images: PostImage[];
  onImageClick: (index: number) => void;
}) {
  const count = images.length;
  if (count === 0) return null;

  const MAX_VISIBLE = 5;
  const visibleImages = images.slice(0, MAX_VISIBLE);
  const remaining = count - MAX_VISIBLE;

  return (
    <div className="rounded-lg overflow-hidden border border-border">
      {count === 1 && (
        <div
          className="w-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
          onClick={() => onImageClick(0)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visibleImages[0].path}
            alt="Post image"
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>
      )}

      {count === 2 && (
        <div className="grid grid-cols-2 gap-[2px] h-[350px]">
          {visibleImages.map((img, idx) => (
            <div
              key={img.id}
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.path}
                alt={`Post img ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="grid grid-cols-2 gap-[2px] h-[400px]">
          <div
            className="w-full h-full bg-muted col-span-1 border-r-[2px] border-background cursor-pointer hover:opacity-95 transition-opacity"
            onClick={() => onImageClick(0)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visibleImages[0].path}
              alt="Post img 0"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-[2px] h-full col-span-1">
            <div
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(1)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[1].path}
                alt="Post img 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(2)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[2].path}
                alt="Post img 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {count === 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-[2px] h-[400px]">
          {visibleImages.map((img, idx) => (
            <div
              key={img.id}
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(idx)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.path}
                alt={`Post img ${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {count >= 5 && (
        <div className="flex flex-col gap-[2px] h-[500px]">
          <div className="grid grid-cols-2 gap-[2px] h-1/2">
            <div
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(0)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[0].path}
                alt="Post img 0"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(1)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[1].path}
                alt="Post img 1"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-[2px] h-1/2">
            <div
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(2)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[2].path}
                alt="Post img 2"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-full h-full bg-muted cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(3)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[3].path}
                alt="Post img 3"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-full h-full bg-muted relative cursor-pointer hover:opacity-95 transition-opacity"
              onClick={() => onImageClick(4)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visibleImages[4].path}
                alt="Post img 4"
                className="w-full h-full object-cover"
              />
              {remaining > 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors">
                  <span className="text-white text-3xl font-semibold">
                    +{remaining}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Text-only Template Renderer ---
function PostTextTemplate({
  content,
  template,
}: {
  content: string;
  template: PostTemplate;
}) {
  return (
    <div
      className="flex items-center justify-center rounded-[8px] px-8 py-10 min-h-[350px] text-center shadow-inner cursor-pointer"
      style={{ background: template.bg_color }}
    >
      <p
        className="text-3xl font-bold leading-snug tracking-tight"
        style={{
          color: template.text_color,
          fontStyle: template.font_style ?? "normal",
        }}
      >
        {content}
      </p>
    </div>
  );
}

// --- PostCard ---
export function PostCard({
  author,
  content,
  images = [],
  template,
  timestamp,
  isLiked = false,
  onReact,
}: PostCardProps) {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const hasImages = images.length > 0;
  const showTemplate = !hasImages && !!template;

  // React count proxy to pass to Media viewer since this simplified Prop type doesn't have it explicitly mapped yet
  const likesCount = isLiked ? 1 : 0;

  return (
    <>
      <article className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border shadow-sm cursor-pointer">
              <AvatarImage src={author.avatar} alt={author.name} />
              <AvatarFallback>{author.name[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[15px] font-semibold text-card-foreground leading-tight hover:underline cursor-pointer">
                {author.name}
              </p>
              <p className="text-[13px] text-muted-foreground flex items-center gap-1 hover:underline cursor-pointer">
                {timestamp}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground rounded-full hover:bg-muted"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Lưu bài viết</DropdownMenuItem>
              <DropdownMenuItem>Bật thông báo về bài viết này</DropdownMenuItem>
              <DropdownMenuItem>Nhúng</DropdownMenuItem>
              <DropdownMenuItem className="text-rose-500 font-semibold focus:text-rose-500 focus:bg-rose-50 dark:focus:bg-rose-950">
                Báo cáo bài viết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="px-4 pb-3 pt-1">
          {!showTemplate && (
            <p className="text-[15px] leading-relaxed text-card-foreground whitespace-pre-wrap">
              {content}
            </p>
          )}
        </div>

        {/* Media (Template or Images) */}
        <div className={showTemplate ? "px-4 pb-4" : ""}>
          {showTemplate ? (
            <PostTextTemplate content={content} template={template!} />
          ) : hasImages ? (
            <PostImageGrid
              images={images}
              onImageClick={(idx) => setViewerIndex(idx)}
            />
          ) : null}
        </div>

        {/* Action Stats */}
        <div className="flex flex-col px-4 py-2"></div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-border/60 px-2 py-1 mx-4">
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
            Thích
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
      </article>

      {/* Media Viewer Modal */}
      {viewerIndex !== null && (
        <PostMediaViewer
          isOpen={viewerIndex !== null}
          onClose={() => setViewerIndex(null)}
          images={images}
          initialIndex={viewerIndex}
          postAuthor={author}
          postContent={content}
          postTimestamp={timestamp}
          likes={likesCount}
          isLiked={isLiked}
          onReact={onReact}
        />
      )}
    </>
  );
}
