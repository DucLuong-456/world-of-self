import { Home, MessageSquare } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const FeedPost = ({
  author,
  content,
  time,
  likes,
  comments,
}: {
  author: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
}) => (
  <Card className="mb-4">
    <CardHeader className="flex flex-row items-center space-x-3 p-4">
      <Avatar className="h-10 w-10">
        <AvatarFallback>{author.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </CardHeader>
    <CardContent className="p-4 pt-0">
      <p className="mb-4">{content}</p>
      {/* Thanh hành động */}
      <div className="flex justify-between border-t pt-2 text-sm text-gray-500">
        <Button variant="ghost" className="flex items-center space-x-1 p-2">
          <Home className="h-4 w-4" />
          <span>Thích ({likes})</span>
        </Button>
        <Button variant="ghost" className="flex items-center space-x-1 p-2">
          <MessageSquare className="h-4 w-4" />
          <span>Bình luận ({comments})</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const mockPosts = [
    {
      author: "Admin",
      content:
        "Chào mừng đến với mạng xã hội mới được xây dựng bằng Next.js và Shadcn/ui!",
      time: "1 giờ trước",
      likes: 15,
      comments: 3,
    },
    {
      author: "User A",
      content:
        "Tailwind CSS làm cho việc tạo kiểu giao diện thật dễ dàng và nhanh chóng!",
      time: "30 phút trước",
      likes: 8,
      comments: 1,
    },
    {
      author: "Admin",
      content:
        "Chào mừng đến với mạng xã hội mới được xây dựng bằng Next.js và Shadcn/ui!",
      time: "1 giờ trước",
      likes: 15,
      comments: 3,
    },
    {
      author: "User A",
      content:
        "Tailwind CSS làm cho việc tạo kiểu giao diện thật dễ dàng và nhanh chóng!",
      time: "30 phút trước",
      likes: 8,
      comments: 1,
    },
    {
      author: "Admin",
      content:
        "Chào mừng đến với mạng xã hội mới được xây dựng bằng Next.js và Shadcn/ui!",
      time: "1 giờ trước",
      likes: 15,
      comments: 3,
    },
    {
      author: "User A",
      content:
        "Tailwind CSS làm cho việc tạo kiểu giao diện thật dễ dàng và nhanh chóng!",
      time: "30 phút trước",
      likes: 8,
      comments: 1,
    },
  ];

  return (
    <div>
      <Card className="mb-6 shadow-md">
        <CardContent className="p-4 space-y-3">
          <Input placeholder="Bạn đang nghĩ gì?" className="p-6" />
          <div className="flex justify-end">
            <Button size="sm">Đăng bài</Button>
          </div>
        </CardContent>
      </Card>

      {mockPosts.map((post, index) => (
        <FeedPost key={index} {...post} />
      ))}

      <div className="text-center text-gray-500 mt-8">Đã tải hết bài viết.</div>
    </div>
  );
}
