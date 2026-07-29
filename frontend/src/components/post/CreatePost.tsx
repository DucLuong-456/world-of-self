"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePostMutation } from "@/hooks/post/useCreatePostMutation";
import { useGetPostTemplates } from "@/hooks/post/useGetPostTemplates";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { PostTemplate } from "@/types/post";
import {
  Globe2,
  Image as ImageIcon,
  Loader2,
  MapPin,
  Mic,
  MoreHorizontal,
  Smile,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const MAX_IMAGES = 10;
const MAX_TEMPLATE_CONTENT_LENGTH = 150;

export function CreatePost() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PostTemplate | null>(
    null,
  );
  const [showTemplates, setShowTemplates] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: templates = [] } = useGetPostTemplates();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optional: reset form when closing or keep draft. Keeping draft is usually better JS UX,
      // but we need to reset when successful anyway. Let's just keep draft on casual close.
    }
  };

  const { mutate: createPost, isPending: isCreating } = useCreatePostMutation({
    onSuccess: () => {
      toast.success("Đăng bài thành công!");
      setContent("");
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedTemplate(null);
      setShowTemplates(false);
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error?.message || "Đăng bài thất bại, vui lòng thử lại!");
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > MAX_IMAGES) {
      toast.warning(`Tối đa ${MAX_IMAGES} ảnh mỗi bài đăng.`);
      return;
    }
    const newFiles = [...imageFiles, ...files];
    setImageFiles(newFiles);

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    // Automatically disable templates when user adds an image
    if (showTemplates) {
      setShowTemplates(false);
      setSelectedTemplate(null);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const isTextOnly = imageFiles.length === 0;
  const canUseTemplate =
    isTextOnly && content.length <= MAX_TEMPLATE_CONTENT_LENGTH;

  const handlePost = () => {
    if (!content.trim() && imageFiles.length === 0) return;
    createPost({
      content,
      images: imageFiles.length > 0 ? imageFiles : undefined,
      template_id:
        canUseTemplate && selectedTemplate ? selectedTemplate.id : undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {/* TRIGGER UI: Fake input bar similar to Facebook */}
      <DialogTrigger asChild>
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.user_name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-full bg-muted/60 hover:bg-muted py-2.5 px-4 text-muted-foreground text-sm font-medium transition-colors">
            Bạn đang nghĩ gì thế, {user?.user_name?.split(" ")[0] || "bạn"}?
          </div>
        </div>
      </DialogTrigger>

      {/* MODAL / DIALOG UI */}
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden gap-0 flex flex-col max-h-[85vh]">
        <DialogHeader className="px-4 py-3 border-b border-border/60 relative">
          <DialogTitle className="text-center text-lg font-bold">
            Tạo bài viết
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 overflow-y-auto custom-scrollbar">
          {/* User Info & Privacy */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.user_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold leading-tight">
                {user?.user_name}
              </p>
              <div className="flex items-center gap-1 mt-1 bg-muted px-2 py-0.5 rounded-md text-xs font-semibold text-muted-foreground w-fit">
                <Globe2 className="h-3 w-3" />
                Công khai
              </div>
            </div>
          </div>

          {/* Editor Area */}
          <div
            className={cn(
              "rounded-lg transition-all mb-4 mt-2",
              selectedTemplate && canUseTemplate
                ? "min-h-[250px] flex items-center justify-center p-6"
                : "min-h-[120px]",
            )}
            style={
              selectedTemplate && canUseTemplate
                ? { background: selectedTemplate.bg_color }
                : {}
            }
          >
            <Textarea
              placeholder={`Bạn đang nghĩ gì thế, ${user?.user_name?.split(" ")[0] || "bạn"}?`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={cn(
                "resize-none border-0 bg-transparent px-2 focus-visible:ring-0 text-foreground custom-scrollbar",
                selectedTemplate && canUseTemplate
                  ? "text-center text-2xl font-bold placeholder:text-white/70 overflow-hidden text-white leading-snug"
                  : "text-xl placeholder:text-muted-foreground min-h-[120px]",
              )}
              style={
                selectedTemplate && canUseTemplate
                  ? {
                      color: selectedTemplate.text_color,
                      fontStyle: selectedTemplate.font_style || "normal",
                    }
                  : {}
              }
            />
          </div>

          {/* Template Toggle (Facebook "Aa" button equivalent) & Quick Access */}
          {!imagePreviews.length && (
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    if (!canUseTemplate) {
                      toast.info(
                        `Template chỉ dùng được cho bài viết ngắn (≤ ${MAX_TEMPLATE_CONTENT_LENGTH} ký tự).`,
                      );
                      return;
                    }
                    setShowTemplates((v) => !v);
                  }}
                  className={cn(
                    "flex items-center justify-center p-1.5 rounded-md hover:bg-muted transition-colors",
                    showTemplates && canUseTemplate && "bg-muted",
                  )}
                  title="Chọn hiệu ứng nền"
                >
                  {/* Fake "Aa" gradient icon */}
                  <div className="w-8 h-8 rounded shrink-0 bg-gradient-to-tr from-rose-400 via-fuchsia-500 to-indigo-500 flex items-center justify-center text-white font-bold font-serif text-lg tracking-tighter leading-none shadow-sm">
                    Aa
                  </div>
                </button>

                {showTemplates && canUseTemplate && (
                  <div className="flex gap-2 items-center slide-in-from-left animate-in duration-200">
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className={cn(
                        "h-8 w-8 rounded-md bg-muted border flex items-center justify-center shadow-sm shrink-0",
                        !selectedTemplate
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border",
                      )}
                    >
                      <div className="w-5 h-5 bg-background border rounded-sm" />
                    </button>
                    {templates.map((tpl) => (
                      <button
                        key={tpl.id}
                        onClick={() => setSelectedTemplate(tpl)}
                        className={cn(
                          "h-8 w-8 rounded-md shadow-sm border shrink-0 transition-all hover:scale-105",
                          selectedTemplate?.id === tpl.id
                            ? "border-primary ring-2 ring-primary/20 scale-105"
                            : "border-transparent",
                        )}
                        style={{ background: tpl.bg_color }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground w-8 h-8 rounded-full"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>
          )}

          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="p-2 border rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2 px-2">
                <span className="text-sm font-semibold">Ảnh/Video</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md">
                    {imageFiles.length}/{MAX_IMAGES}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-semibold px-2 hover:bg-muted"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Thêm ảnh
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1 rounded-md overflow-hidden bg-muted relative min-h-[100px]">
                {imagePreviews
                  .map((src, i) => (
                    <div
                      key={i}
                      className={cn(
                        "relative group overflow-hidden bg-background aspect-square",
                        // Dynamic grid logic just for preview visual flair
                        imagePreviews.length === 1 && "col-span-2 aspect-video",
                        imagePreviews.length === 3 &&
                          i === 0 &&
                          "col-span-2 aspect-video",
                        imagePreviews.length >= 5 && "col-span-1",
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt={`Ảnh xem trước ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 hover:bg-white text-black shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {imageFiles.length > 4 &&
                        i === 3 &&
                        imageFiles.length - 4 > 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
                            <span className="text-white text-xl font-bold">
                              +{imageFiles.length - 4}
                            </span>
                          </div>
                        )}
                    </div>
                  ))
                  .slice(0, 4)}
                {/* Visual cap at 4 in preview grid for succinctness */}
              </div>
            </div>
          )}

          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Add to Post Toolbar */}
          <div className="flex items-center justify-between border border-border rounded-lg px-4 py-2 mt-2 shadow-sm">
            <span className="text-sm font-semibold cursor-default">
              Thêm vào bài viết
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-green-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
                onClick={() => fileInputRef.current?.click()}
                title="Ảnh/Video"
              >
                <ImageIcon className="h-5 w-5 fill-green-500/20" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 hidden sm:inline-flex"
              >
                <MapPin className="h-5 w-5 fill-blue-500/20" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 hidden sm:inline-flex"
              >
                <Mic className="h-5 w-5 fill-rose-500/20" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:bg-muted"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-card/60 backdrop-blur-sm">
          <Button
            className="w-full font-bold text-md h-10 shadow-sm"
            disabled={
              isCreating || (!content.trim() && imageFiles.length === 0)
            }
            onClick={handlePost}
          >
            {isCreating ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Đăng bài"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
