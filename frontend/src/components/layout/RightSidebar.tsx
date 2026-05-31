"use client";

import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const suggestedFriends = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    username: "nguyenvana",
    avatar: "",
    mutualFriends: 12,
  },
  {
    id: "2",
    name: "Trần Thị B",
    username: "tranthib",
    avatar: "",
    mutualFriends: 8,
  },
  {
    id: "3",
    name: "Lê Minh C",
    username: "leminhc",
    avatar: "",
    mutualFriends: 5,
  },
];

const trendingTopics = [
  { id: "1", tag: "#WorldOfSelf", posts: "12.5K posts" },
  { id: "2", tag: "#Nextjs14", posts: "8.2K posts" },
  { id: "3", tag: "#OKLCH", posts: "6.1K posts" },
  { id: "4", tag: "#Frontend", posts: "4.8K posts" },
  { id: "5", tag: "#SocialMedia", posts: "3.9K posts" },
];

export function RightSidebar() {
  return (
    <aside className="w-80 space-y-6">
      {/* Suggested Friends */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Gợi ý kết bạn
        </h3>
        <div className="space-y-4">
          {suggestedFriends.map((friend) => (
            <div key={friend.id} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={friend.avatar} alt={friend.name} />
                <AvatarFallback>{friend.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-bold text-card-foreground">
                  {friend.name}
                </p>
                <p className="truncate text-xs text-muted-foreground font-medium">
                  {friend.mutualFriends} bạn chung
                </p>
              </div>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold rounded-lg px-3">
                <UserPlus className="h-3.5 w-3.5" />
                Thêm
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Xu hướng
        </h3>
        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <button
              key={topic.id}
              className="block w-full text-left transition-all hover:bg-muted/50 rounded-lg p-2 -mx-2 group"
            >
              <p className="text-sm font-bold text-primary group-hover:underline">{topic.tag}</p>
              <p className="text-[11px] font-medium text-muted-foreground">{topic.posts}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 text-[10px] font-medium text-muted-foreground">
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          <a href="#" className="hover:underline">Giới thiệu</a>
          <a href="#" className="hover:underline">Hỗ trợ</a>
          <a href="#" className="hover:underline">Quyền riêng tư</a>
          <a href="#" className="hover:underline">Điều khoản</a>
        </div>
        <p className="mt-2 tracking-tight">© 2026 WorldOfSelf. All rights reserved.</p>
      </div>
    </aside>
  );
}
