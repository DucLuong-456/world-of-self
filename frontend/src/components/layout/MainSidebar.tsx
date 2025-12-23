"use client";

import { Bell, Home, MessageSquare, Settings, User, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export const MainSidebar = () => {
  const navItems = [
    { icon: Home, label: "Trang Chủ", href: "/" },
    { icon: User, label: "Hồ sơ", href: "/profile/me" },
    { icon: Users, label: "Bạn bè", href: "/friends" },
    { icon: MessageSquare, label: "Tin nhắn", href: "/messages" },
    { icon: Bell, label: "Thông báo", href: "/notifications" },
    { icon: Settings, label: "Cài đặt", href: "/settings" },
  ];
  const [category, setCategory] = useState(navItems[0].label);

  const handleNavItemClick = (label: string) => {
    setCategory(label);
  };

  return (
    <div className="hidden lg:block lg:w-[250px] p-4 space-y-4 sticky top-0 h-screen overflow-y-auto">
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
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  onClick={() => {
                    handleNavItemClick(item.label);
                  }}
                  variant={item.label === category ? "secondary" : "ghost"}
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
