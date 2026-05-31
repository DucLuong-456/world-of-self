"use client";

import { Image, Video, Smile, MapPin, Send, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useCreatePostMutation } from "@/hooks/post/useCreatePostMutation";

export function CreatePost() {
  const { user } = useAuthStore();
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: createPost, isPending: isCreating } = useCreatePostMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePost = () => {
    if (!content.trim() && !imageFile) return;
    createPost(
      {
        content,
        thumbnail: imageFile || undefined,
      },
      {
        onSuccess: () => {
          setContent("");
          setImageFile(null);
          setImagePreview(null);
        },
      }
    );
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={user?.avatar} />
          <AvatarFallback>{user?.user_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Bạn đang nghĩ gì?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none border-0 bg-transparent pt-1.5 px-2 text-card-foreground placeholder:text-muted-foreground focus-visible:ring-0"
          />

          {imagePreview && (
            <div className="relative group rounded-lg overflow-hidden border border-border mb-3">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto object-cover max-h-[300px]"
              />
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-5 w-5" />
              </Button>
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
              />
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary">
                <MapPin className="h-5 w-5" />
              </Button>
            </div>
            <Button
              size="sm"
              className="gap-2 font-bold px-4"
              disabled={isCreating || (!content.trim() && !imageFile)}
              onClick={handlePost}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Đăng
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
