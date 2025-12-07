import { Bell, Home, MessageSquare, Settings, User, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

// --- Các Component Phụ trợ (Chúng ta sẽ định nghĩa chúng bên dưới) ---
const MainSidebar = () => {
  // Dữ liệu mẫu cho thanh điều hướng
  const navItems = [
    { icon: Home, label: "Trang Chủ", href: "/" },
    { icon: User, label: "Hồ sơ", href: "/profile/me" },
    { icon: Users, label: "Bạn bè", href: "/friends" },
    { icon: MessageSquare, label: "Tin nhắn", href: "/messages" },
    { icon: Bell, label: "Thông báo", href: "/notifications" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ];

  return (
    <div className="hidden lg:block lg:w-[250px] p-4 space-y-4 sticky top-0 h-screen overflow-y-auto">
      {/* Thẻ thông tin người dùng */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center space-x-4 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/avatar-placeholder.jpg" alt="Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold text-base">Jane Doe</p>
            <p className="text-sm text-gray-500">@janedoe</p>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="p-2">
          {/* Các liên kết điều hướng */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  variant={item.label === "Trang Chủ" ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};

const FeedPost = ({ author, content, time, likes, comments }: any) => (
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

const RightSidebar = () => (
  <div className="hidden xl:block xl:w-[300px] p-4 space-y-4 sticky top-0 h-screen overflow-y-auto">
    {/* Widget Bạn có thể biết */}
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Bạn có thể biết</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0">
        {["Alice", "Bob", "Charlie"].map((name, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{name}</span>
            </div>
            <Button variant="outline" size="sm">
              Theo dõi
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>

    {/* Widget Xu hướng */}
    <Card className="shadow-sm">
      <CardHeader className="p-4">
        <CardTitle className="text-lg">Xu hướng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-4 pt-0 text-sm">
        <p className="font-semibold">#Nextjs14</p>
        <p className="text-gray-500">2.5k bài viết</p>
        <Separator />
        <p className="font-semibold">#ShadcnUI</p>
        <p className="text-gray-500">1.8k bài viết</p>
      </CardContent>
    </Card>
  </div>
);

// --- Component Chính Trang Chủ ---
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
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header / Thanh điều hướng cố định (Bạn cần tạo component này) */}
      {/* <AppHeader /> */}

      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[250px_1fr_300px] gap-4">
          {/* Cột trái: Điều hướng */}
          <MainSidebar />

          {/* Cột giữa: Bảng tin chính */}
          <div className="p-4 lg:p-6 lg:border-x">
            <h1 className="text-2xl font-bold mb-6">Bảng tin</h1>

            {/* Khu vực tạo bài đăng mới */}
            <Card className="mb-6 shadow-md">
              <CardContent className="p-4 space-y-3">
                <Input placeholder="Bạn đang nghĩ gì?" className="p-6" />
                <div className="flex justify-end">
                  <Button size="sm">Đăng bài</Button>
                </div>
              </CardContent>
            </Card>

            {/* Danh sách các bài đăng */}
            {mockPosts.map((post, index) => (
              <FeedPost key={index} {...post} />
            ))}

            <div className="text-center text-gray-500 mt-8">
              Đã tải hết bài viết.
            </div>
          </div>

          {/* Cột phải: Widget */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}
