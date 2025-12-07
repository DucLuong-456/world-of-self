// app/profile/me/page.tsx
import { Bell, Calendar, Camera, Link2, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const FeedPost = ({ author, content, time, likes, comments }: any) => (
  <Card className="mb-4 hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/avatar-placeholder.jpg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>
      <p className="mb-4 text-gray-800 dark:text-gray-200">{content}</p>
      <div className="flex justify-between border-t pt-3 text-sm text-gray-500">
        <Button variant="ghost" size="sm" className="space-x-1">
          <span>Thích</span>
          <span>({likes})</span>
        </Button>
        <Button variant="ghost" size="sm" className="space-x-1">
          <span>Bình luận</span>
          <span>({comments})</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function ProfilePage() {
  const user = {
    name: "Jane Doe",
    username: "janedoe",
    bio: "Full-stack developer | Yêu thích Next.js, Tailwind & cà phê ☕ | Đang xây dựng những thứ đẹp đẽ trên internet",
    location: "Hà Nội, Việt Nam",
    website: "https://janedoe.dev",
    joinedDate: "Tháng 3 năm 2023",
    following: 342,
    followers: 1208,
    coverImage: "/cover-placeholder.jpg", // bạn có thể thay bằng ảnh thực
    avatar: "/avatar-placeholder.jpg",
  };

  const posts = [
    {
      author: "Jane Doe",
      content:
        "Vừa hoàn thành dự án mới với Next.js 14 + App Router + Server Components. Cảm giác thật tuyệt khi mọi thứ mượt mà hơn bao giờ hết!",
      time: "2 giờ trước",
      likes: 42,
      comments: 8,
    },
    {
      author: "Jane Doe",
      content:
        "Ai dùng Shadcn/ui chưa? Mình thấy đây là bộ UI đẹp và dễ tùy biến nhất từ trước đến nay cho Tailwind CSS.",
      time: "1 ngày trước",
      likes: 89,
      comments: 15,
    },
    {
      author: "Jane Doe",
      content: "Cuối tuần đi cà phê và code tiếp nào các bạn ơi",
      time: "3 ngày trước",
      likes: 156,
      comments: 23,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo */}
        <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-4 right-4"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        {/* Avatar + Info */}
        <div className="relative px-4 -mt-20 md:-mt-32">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <div className="flex items-end space-x-6">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 ring-4 ring-white dark:ring-gray-900">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-4xl">JD</AvatarFallback>
              </Avatar>

              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button>
                <Settings className="mr-2 h-4 w-4" />
                Chỉnh sửa hồ sơ
              </Button>
              <Button variant="outline">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bio & Info */}
          <div className="mt-6 space-y-3">
            <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.website && (
                <div className="flex items-center gap-1">
                  <Link2 className="h-4 w-4" />
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Tham gia {user.joinedDate}</span>
              </div>
            </div>

            <div className="flex gap-6 py-2">
              <div className="text-center">
                <span className="font-bold text-xl">{user.following}</span>
                <p className="text-gray-500">Đang theo dõi</p>
              </div>
              <div className="text-center">
                <span className="font-bold text-xl">{user.followers}</span>
                <p className="text-gray-500">Người theo dõi</p>
              </div>
            </div>
          </div>

          <Separator className="my-8" />
        </div>

        {/* Tabs: Bài viết, Bình luận, Thích, Media */}
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts">Bài viết</TabsTrigger>
            <TabsTrigger value="replies">Trả lời</TabsTrigger>
            <TabsTrigger value="likes">Thích</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {posts.map((post, i) => (
              <FeedPost key={i} {...post} />
            ))}
          </TabsContent>

          <TabsContent value="replies" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Chưa có bình luận nào được hiển thị công khai.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="likes" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Các bài viết bạn đã thích sẽ xuất hiện ở đây.
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="mt-6">
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                Chưa có media nào được đăng.
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
