"use client";

import { Heart, MessageCircle, UserPlus, AtSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: "1",
    type: "like",
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    },
    content: "đã thích bài viết của bạn",
    timestamp: "2 phút trước",
    isRead: false,
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    },
    content: "đã bình luận về ảnh của bạn",
    timestamp: "15 phút trước",
    isRead: false,
  },
  {
    id: "3",
    type: "follow",
    user: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    },
    content: "đã bắt đầu theo dõi bạn",
    timestamp: "1 giờ trước",
    isRead: false,
  },
  {
    id: "4",
    type: "mention",
    user: {
      name: "Alex Thompson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    },
    content: "đã nhắc đến bạn trong một bình luận",
    timestamp: "2 giờ trước",
    isRead: true,
  },
  {
    id: "5",
    type: "like",
    user: {
      name: "Jessica Lee",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    },
    content: "đã thích bình luận của bạn",
    timestamp: "3 giờ trước",
    isRead: true,
  },
];

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  mention: AtSign,
};

const iconColorMap = {
  like: "bg-red-500/20 text-red-500",
  comment: "bg-blue-500/20 text-blue-500",
  follow: "bg-green-500/20 text-green-500",
  mention: "bg-yellow-500/20 text-yellow-500",
};

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Thông báo</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground font-medium hover:text-primary">
          Đánh dấu tất cả là đã đọc
        </Button>
      </div>
      
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden text-card-foreground">
        {notifications.map((notification, index) => {
          const Icon = iconMap[notification.type as keyof typeof iconMap];
          const iconColor = iconColorMap[notification.type as keyof typeof iconColorMap];
          
          return (
            <div
              key={notification.id}
              className={cn(
                "flex items-center gap-4 p-4 transition-all hover:bg-muted/30 cursor-pointer",
                index !== notifications.length - 1 && "border-b border-border",
                !notification.isRead && "bg-primary/5"
              )}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 border border-border">
                  <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className={cn("absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card shadow-sm", iconColor)}>
                  <Icon className="h-3 w-3" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="font-bold text-foreground">{notification.user.name}</span>{" "}
                  <span className="text-muted-foreground">{notification.content}</span>
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{notification.timestamp}</p>
              </div>
              {!notification.isRead && (
                <div className="h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
          <p className="text-muted-foreground">Bạn chưa có thông báo nào.</p>
        </div>
      )}
    </div>
  );
}
