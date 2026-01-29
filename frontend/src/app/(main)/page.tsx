"use client";

import {
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Send,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";

const FeedPost = ({
  author,
  authorAvatar,
  title,
  content,
  image,
  time,
  likes,
  comments,
}: {
  author: string;
  authorAvatar?: string;
  title?: string;
  content: string;
  image?: string;
  time: string;
  likes: number;
  comments: number;
}) => (
  <Card className="mb-4 overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow">
    <CardHeader className="flex flex-row items-center space-x-3 p-4">
      <Avatar className="h-10 w-10 border">
        <AvatarImage src={authorAvatar} />
        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold text-sm">{author}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0 space-y-3">
      {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
      {image && (
        <div className="rounded-xl overflow-hidden border bg-gray-100">
          <img
            src={image}
            alt="Post content"
            className="w-full h-auto max-h-[500px] object-contain"
          />
        </div>
      )}
      {/* Thanh hành động */}
      <div className="flex items-center gap-4 border-t pt-3 mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-red-500 hover:bg-red-50"
        >
          <Heart className="h-4 w-4" />
          <span className="font-medium">{likes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="font-medium">{comments}</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const resetForm = () => {
    setTitle("");
    setContent("");
    setImageFile(null);
    setImagePreview(null);
    setIsExpanded(false);
  };

  const handlePost = async () => {
    if (!content.trim() && !imageFile) return;
    setLoading(true);
    // Giả lập API gọi thành công
    setTimeout(() => {
      setLoading(false);
      resetForm();
    }, 1500);
  };

  const mockPosts = [
    {
      author: "Admin",
      authorAvatar: "/avatar-placeholder.jpg",
      title: "Chào mừng bạn đến với World of Self!",
      content:
        "Chào mừng đến với mạng xã hội mới được xây dựng bằng Next.js và Shadcn/ui! Hãy chia sẻ những khoảnh khắc tuyệt vời của bạn tại đây.",
      time: "1 giờ trước",
      likes: 15,
      comments: 3,
    },
    {
      author: "User A",
      content:
        "Tailwind CSS làm cho việc tạo kiểu giao diện thật dễ dàng và nhanh chóng! Minh chứng là giao diện trang chủ này được hoàn thiện chỉ trong vài phút.",
      time: "30 phút trước",
      likes: 8,
      comments: 1,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Post Creator */}
      <Card className="border-none shadow-md overflow-hidden bg-white dark:bg-gray-800 transition-all duration-300">
        <CardContent className="p-4 space-y-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user?.user_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Input
                placeholder="Tiêu đề bài viết (tùy chọn)..."
                className={`transition-all duration-300 border-none bg-gray-50 dark:bg-gray-900 focus-visible:ring-1 focus-visible:ring-blue-500 font-semibold ${
                  isExpanded
                    ? "opacity-100 h-10"
                    : "opacity-0 h-0 overflow-hidden"
                }`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Bạn đang nghĩ gì?"
                className="min-h-[40px] resize-none border-none bg-gray-50 dark:bg-gray-900 focus-visible:ring-1 focus-visible:ring-blue-500 text-base"
                rows={isExpanded ? 3 : 1}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onClick={() => setIsExpanded(true)}
              />
            </div>
          </div>

          {isExpanded && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Media Upload Buttons */}
              <div className="flex items-center gap-2 border-t pt-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-green-600 hover:bg-green-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Ảnh/Video
                </Button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {/* Preview Section */}
              {(title || content || imagePreview) && (
                <div className="border rounded-xl p-4 bg-gray-50/50 dark:bg-gray-900/50 space-y-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Xem trước bài viết
                  </p>
                  <div className="space-y-2">
                    {title && (
                      <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {title}
                      </h4>
                    )}
                    {content && (
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {content}
                      </p>
                    )}
                    {imagePreview && (
                      <div className="relative group rounded-lg overflow-hidden border">
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
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border">
                <p className="text-xs text-gray-500 pl-2 font-medium">
                  Chỉ mình bạn có thể thấy bản xem trước này
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsExpanded(false)}
                  >
                    Hủy
                  </Button>
                  <Button
                    size="sm"
                    disabled={loading || (!content.trim() && !imageFile)}
                    onClick={handlePost}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Đăng bài
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feed */}
      <div className="space-y-4">
        {mockPosts.map((post, index) => (
          <FeedPost key={index} {...post} />
        ))}
      </div>

      <div className="text-center text-gray-400 py-10 text-sm">
        Bạn đã xem hết các bài viết mới nhất.
      </div>
    </div>
  );
}
