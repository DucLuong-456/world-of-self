"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserProfileMutation } from "@/hooks/user/useUpdateUserProfileMutation";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Briefcase,
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const profileSchema = z.object({
  user_name: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên không được vượt quá 50 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  bio: z.string().max(500, "Tiểu sử không được vượt quá 500 ký tự").optional(),
  location: z
    .string()
    .max(100, "Địa chỉ không được vượt quá 100 ký tự")
    .optional(),
  profession: z
    .string()
    .max(100, "Nghề nghiệp không được vượt quá 100 ký tự")
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const router = useRouter();
  const { user: userAuth } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      user_name: userAuth?.user_name || "",
      email: userAuth?.email || "",
      phone: userAuth?.phone || "",
      bio: userAuth?.profile?.bio || "",
      location: userAuth?.profile?.location || "",
      profession: userAuth?.profile?.profession || "",
    },
  });

  // State quản lý việc preview ảnh và file thực tế
  const [previews, setPreviews] = useState({
    avatar: userAuth?.avatar || "/avatar-placeholder.jpg",
    cover: userAuth?.profile?.cover_avatar || "",
  });

  // Cập nhật lại form và preview khi userAuth thay đổi (ví dụ sau khi refresh)
  useEffect(() => {
    if (userAuth) {
      reset({
        user_name: userAuth.user_name || "",
        email: userAuth.email || "",
        phone: userAuth.phone || "",
        bio: userAuth.profile?.bio || "",
        location: userAuth.profile?.location || "",
        profession: userAuth.profile?.profession || "",
      });
      setPreviews({
        avatar: userAuth.avatar || "/avatar-placeholder.jpg",
        cover: userAuth.profile?.cover_avatar || "",
      });
    }
  }, [userAuth, reset]);

  const [files, setFiles] = useState<{
    avatar: File | null;
    cover: File | null;
  }>({
    avatar: null,
    cover: null,
  });

  // Refs để trigger click input file ẩn
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutateAsync } = useUpdateUserProfileMutation();

  const onSubmit = async (values: ProfileFormValues) => {
    const data = new FormData();
    data.append("user_name", values.user_name);
    data.append("email", values.email);
    if (values.phone) data.append("phone", values.phone);
    if (values.bio) data.append("bio", values.bio);
    if (values.location) data.append("location", values.location);
    if (values.profession) data.append("profession", values.profession);

    if (files.avatar) data.append("avatar", files.avatar);
    if (files.cover) data.append("cover_avatar", files.cover);

    try {
      await mutateAsync(data);
      toast.success("Cập nhật hồ sơ thành công");
      router.push("/profile/me");
    } catch (error: unknown) {
      console.error(error);
      const errorMessage =
        (error as any)?.response?.data?.message || "Cập nhật hồ sơ thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-10">
      <div className="max-w-2xl mx-auto">
        {/* Header điều hướng */}
        <div className="p-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Chỉnh sửa hồ sơ</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4">
          {/* Section: Ảnh bìa & Avatar */}
          <div className="relative">
            {/* Cover Photo Edit */}
            <div
              className="h-48 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden relative cursor-pointer group"
              onClick={() => coverInputRef.current?.click()}
            >
              {previews.cover && (
                <img
                  src={previews.cover}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white h-8 w-8" />
              </div>
              <input
                type="file"
                hidden
                ref={coverInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e, "cover")}
              />
            </div>

            {/* Avatar Edit */}
            <div className="absolute -bottom-12 left-6">
              <div
                className="relative group cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white dark:ring-gray-900">
                  <AvatarImage src={previews.avatar} />
                  <AvatarFallback>
                    {userAuth?.user_name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white h-6 w-6" />
                </div>
                <input
                  type="file"
                  hidden
                  ref={avatarInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "avatar")}
                />
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <Card className="mt-16 border-none shadow-sm">
            <CardContent className="pt-14 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_name">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="user_name"
                      className={`pl-9 ${errors.user_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("user_name")}
                    />
                  </div>
                  {errors.user_name && (
                    <p className="text-sm text-red-500">
                      {errors.user_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      className={`pl-9 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      type="email"
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      className={`pl-9 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("phone")}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profession">Nghề nghiệp</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="profession"
                      className={`pl-9 ${errors.profession ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...register("profession")}
                    />
                  </div>
                  {errors.profession && (
                    <p className="text-sm text-red-500">
                      {errors.profession.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Địa chỉ</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    className={`pl-9 ${errors.location ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    {...register("location")}
                  />
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Tiểu sử</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  className={
                    errors.bio
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }
                  {...register("bio")}
                  placeholder="Giới thiệu một chút về bản thân bạn..."
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 sticky bottom-4 bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-md p-4 rounded-xl border">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
