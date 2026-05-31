"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PostCardProps {
  author: {
    name: string;
    username?: string;
    avatar?: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  onReact?: () => void;
}

export function PostCard({
  author,
  content,
  image,
  likes,
  comments,
  shares,
  timestamp,
  isLiked = false,
  isBookmarked: initialBookmarked = false,
  onReact,
}: PostCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  return (
    <article className="rounded-xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-card-foreground">
              {author.name}
            </p>
            <p className="text-xs text-muted-foreground">
              @{author.username || 'user'} · {timestamp}
            </p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Report post</DropdownMenuItem>
            <DropdownMenuItem>Mute user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap">
          {content}
        </p>
      </div>

      {/* Image */}
      {image && (
        <div className="px-4 pb-3">
          <div className="rounded-lg overflow-hidden border bg-muted/30">
            <img
              src={image}
              alt="Post image"
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-border px-4 py-3">
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-2 text-muted-foreground hover:text-primary",
              isLiked && "text-red-500 hover:text-red-600"
            )}
            onClick={onReact}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            <span className="text-xs">{likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="text-xs">{comments}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">{shares}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 text-muted-foreground hover:text-primary transition-colors",
            isBookmarked && "text-primary"
          )}
          onClick={() => setIsBookmarked(!isBookmarked)}
        >
          <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
        </Button>
      </div>
    </article>
  );
}
