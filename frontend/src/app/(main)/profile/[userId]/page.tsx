"use client";

import { ProfileView } from "@/components/profile/ProfileView";
import { useGetUserById } from "@/hooks/user/useGetUserById";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.userId as string;
  const { user: currentUser } = useAuthStore();

  // Redirect to /profile/me if viewing own profile
  useEffect(() => {
    if (currentUser?.id && userId === currentUser.id) {
      router.replace("/profile/me");
    }
  }, [userId, currentUser?.id, router]);

  const { data: user, isLoading, isError } = useGetUserById(userId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <p className="text-lg font-semibold text-foreground">
          Không tìm thấy người dùng này.
        </p>
        <p className="text-sm text-muted-foreground">
          Tài khoản có thể đã bị xóa hoặc không tồn tại.
        </p>
      </div>
    );
  }

  return <ProfileView user={user} isOwnProfile={false} />;
}
