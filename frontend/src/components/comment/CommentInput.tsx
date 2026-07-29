import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommentInputProps {
  userAvatar?: string | null;
  onPost: (content: string) => Promise<void>;
  placeholder?: string;
  isReply?: boolean;
  onCancel?: () => void;
}

export const CommentInput: React.FC<CommentInputProps> = ({
  userAvatar,
  onPost,
  placeholder = "Viết bình luận...",
  isReply = false,
  onCancel,
}) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isReply && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isReply]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await onPost(content);
      setContent("");
      if (isReply && onCancel) onCancel();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isReply) {
    return (
      <div className="relative w-full max-w-full flex items-center bg-muted/50 rounded-md border border-transparent focus-within:border-primary/30 transition-colors">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm py-2 px-3 min-w-0"
          disabled={isSubmitting}
        />
        <div className="flex items-center pr-2 gap-2 text-sm text-primary shrink-0">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
            className="font-semibold text-primary disabled:opacity-50 hover:underline px-1"
          >
            {isSubmitting ? "..." : "Gửi"}
          </button>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground font-semibold px-1"
          >
            x
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 items-center w-full max-w-full">
      <Avatar className="w-9 h-9 shrink-0">
        <AvatarImage src={userAvatar || undefined} />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div className="flex-1 bg-muted rounded-full px-4 py-2 border border-transparent focus-within:border-primary/30 transition-colors">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-sm min-w-0"
            disabled={isSubmitting}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !content.trim()}
          className="rounded-full px-5 h-9 shrink-0 bg-blue-500 hover:bg-blue-600 font-semibold"
        >
          {isSubmitting ? "..." : "Đăng"}
        </Button>
      </div>
    </div>
  );
};
