// app/friends/page.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, UserMinus, Users } from "lucide-react";

interface Friend {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  bio?: string;
  location?: string;
  mutualFriends: number;
  isFollowing: boolean; // nếu là trang "Người theo dõi" thì đổi thành true/false phù hợp
}

const mockFriends: Friend[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    username: "nguyenvana",
    bio: "Front-end Developer | React & Next.js",
    location: "TP. Hồ Chí Minh",
    mutualFriends: 28,
    isFollowing: true,
  },
  {
    id: 2,
    name: "Trần Thị B",
    username: "tranthib",
    bio: "UI/UX Designer | Figma Master",
    location: "Đà Nẵng",
    mutualFriends: 15,
    isFollowing: true,
  },
  {
    id: 3,
    name: "Lê Minh C",
    username: "leminhc",
    bio: "Full-stack | Node.js | Love coffee",
    mutualFriends: 42,
    isFollowing: true,
  },
  {
    id: 4,
    name: "Phạm Hồng D",
    username: "phamhongd",
    bio: "Mobile Dev | Flutter enthusiast",
    location: "Hà Nội",
    mutualFriends: 9,
    isFollowing: true,
  },
  {
    id: 5,
    name: "Hoàng Yến Nhi",
    username: "hoangyennhi",
    bio: "Content Creator | Travel & Food",
    location: "Hà Nội",
    mutualFriends: 56,
    isFollowing: true,
  },
  {
    id: 6,
    name: "Đỗ Đức E",
    username: "doduce",
    bio: "DevOps Engineer | Kubernetes & Docker",
    mutualFriends: 33,
    isFollowing: true,
  },
];

export default function FriendsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Bạn bè
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {mockFriends.length} người bạn
          </p>
        </div>

        {/* Thanh tìm kiếm */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Tìm kiếm bạn bè..." className="pl-10" />
        </div>

        {/* Tabs (Bạn bè / Đang theo dõi / Người theo dõi) – có thể mở rộng sau */}
        <div className="flex gap-4 mb-6 border-b">
          <Button
            variant="ghost"
            className="pb-4 px-1 border-b-2 border-blue-600 text-blue-600"
          >
            Tất cả bạn bè
          </Button>
          {/* <Button variant="ghost" className="pb-4 px-1">Đang theo dõi</Button>
          <Button variant="ghost" className="pb-4 px-1">Người theo dõi</Button> */}
        </div>

        {/* Danh sách bạn bè dạng lưới */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockFriends.map((friend) => (
            <Card key={friend.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-gray-200">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="text-lg">
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{friend.name}</h3>
                      <p className="text-sm text-gray-500">
                        @{friend.username}
                      </p>

                      {friend.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                          {friend.bio}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                        {friend.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {friend.location}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {friend.mutualFriends} bạn chung
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nút hành động */}
                  <Button
                    variant={friend.isFollowing ? "outline" : "default"}
                    size="sm"
                    className="mt-1"
                  >
                    {friend.isFollowing ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-1" />
                        Hủy kết bạn
                      </>
                    ) : (
                      "Theo dõi lại"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nếu không có bạn bè nào */}
        {mockFriends.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Bạn chưa có bạn bè nào.</p>
              <Button className="mt-4">Tìm bạn bè</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
