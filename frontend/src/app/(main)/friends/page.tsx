"use client";

import { useState } from "react";
import { UserMinus, MessageCircle, Users, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const mockFriends = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    username: "nguyenvana",
    avatar: "",
    status: "online",
  },
  {
    id: "2",
    name: "Trần Thị B",
    username: "tranthib",
    avatar: "",
    status: "offline",
  },
  {
    id: "3",
    name: "Lê Minh C",
    username: "leminhc",
    avatar: "",
    status: "online",
  },
];

const friendRequests = [
  {
    id: "r1",
    name: "Jessica Lee",
    username: "jessical",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    mutualFriends: 12,
  },
];

const statusColors = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  away: "bg-yellow-500",
};

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Bạn bè</h2>
        <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
           <Input placeholder="Tìm kiếm bạn bè..." className="pl-9 h-9 border-none bg-muted/50 focus-visible:ring-1" />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-6">
          <TabsTrigger 
            value="all" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 font-bold"
          >
            Tất cả bạn bè
          </TabsTrigger>
          <TabsTrigger 
            value="requests" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 font-bold relative"
          >
            Lời mời
            {friendRequests.length > 0 && (
              <span className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {friendRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="following" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-2 font-bold"
          >
            Đang theo dõi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockFriends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <Avatar className="h-14 w-14 border">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-card ${
                      statusColors[friend.status as keyof typeof statusColors]
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-card-foreground">
                    {friend.name}
                  </p>
                  <p className="text-xs text-muted-foreground">@{friend.username}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                    <UserMinus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-sm"
              >
                <Avatar className="h-14 w-14 border">
                  <AvatarImage src={request.avatar} alt={request.name} />
                  <AvatarFallback>{request.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-card-foreground">
                    {request.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {request.mutualFriends} bạn chung
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-8 px-3 text-xs bg-primary hover:bg-primary/90">
                    Chấp nhận
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Từ chối
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="following" className="mt-6">
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <Users className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">Danh sách đang theo dõi sẽ xuất hiện ở đây.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
