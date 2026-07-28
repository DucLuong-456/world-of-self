"use client";

import { useAuthStore } from "@/store/authStore";
import { useGetUser } from "@/hooks/user/useUser";
import { useUpdateUserProfileMutation } from "@/hooks/user/useUpdateUserProfileMutation";
import { useState } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { ProfileView } from "@/components/profile/ProfileView";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user: userAuth } = useAuthStore();
  const { data: userData } = useGetUser();
  const { mutateAsync: updateProfile } = useUpdateUserProfileMutation();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<{
    avatar?: boolean;
    cover?: boolean;
  }>({});

  const user = userData || userAuth;

  if (!user) return null;

  const handleEditAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      setIsUploading((prev) => ({ ...prev, avatar: true }));
      await updateProfile(formData);
      toast.success("Cập nhật ảnh đại diện thành công");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại");
    } finally {
      setIsUploading((prev) => ({ ...prev, avatar: false }));
    }
  };

  const handleEditCover = async (file: File) => {
    const formData = new FormData();
    formData.append("cover_avatar", file);
    try {
      setIsUploading((prev) => ({ ...prev, cover: true }));
      await updateProfile(formData);
      toast.success("Cập nhật ảnh bìa thành công");
    } catch {
      toast.error("Cập nhật ảnh bìa thất bại");
    } finally {
      setIsUploading((prev) => ({ ...prev, cover: false }));
    }
  };

  return (
    <>
      <ProfileView
        user={user}
        isOwnProfile
        isUploadingAvatar={isUploading.avatar}
        isUploadingCover={isUploading.cover}
        onEditAvatar={handleEditAvatar}
        onEditCover={handleEditCover}
        onEditProfile={() => setIsEditModalOpen(true)}
      />
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}
