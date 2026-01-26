"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/hooks/user/useLoginMutation";
import { useAuthStore } from "@/store/authStore";
import { LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Header = () => {
  const { user, setUser, setIsAuthenticated } = useAuthStore();
  const router = useRouter();
  const { mutateAsync } = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await mutateAsync();
      setUser(null);
      setIsAuthenticated(false);
      router.push("/login");
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 shadow-sm p-4 sticky top-0 z-50 border-b">
      <div className="w-full px-10 flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm">
          Zinze
        </h1>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="outline-none">
                <Avatar className="h-9 w-9 border cursor-pointer hover:opacity-80 transition">
                  <AvatarImage src={user?.avatar} alt={user?.user_name} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {user?.user_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Trang cá nhân</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
