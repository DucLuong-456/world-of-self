"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserProfileMutation } from "@/hooks/user/useUpdateUserProfileMutation";
import { useGetUser } from "@/hooks/user/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import { useEffect } from "react";
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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { data: userData } = useGetUser();
  const { mutateAsync: updateProfile } = useUpdateUserProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      user_name: userData?.user_name || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      bio: userData?.profile?.bio || "",
      location: userData?.profile?.location || "",
      profession: userData?.profile?.profession || "",
    },
  });

  useEffect(() => {
    if (userData && isOpen) {
      reset({
        user_name: userData.user_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        bio: userData.profile?.bio || "",
        location: userData.profile?.location || "",
        profession: userData.profile?.profession || "",
      });
    }
  }, [userData, isOpen, reset]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      await updateProfile(values);
      toast.success("Cập nhật thông tin thành công");
      onClose();
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        axiosError?.response?.data?.message || "Cập nhật thất bại";
      toast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Chỉnh sửa thông tin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user_name">Họ và tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="user_name"
                  className={`pl-9 ${errors.user_name ? "border-red-500" : ""}`}
                  {...register("user_name")}
                />
              </div>
              {errors.user_name && (
                <p className="text-xs text-red-500">{errors.user_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
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
                  className={`pl-9 ${errors.phone ? "border-red-500" : ""}`}
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="profession">Nghề nghiệp</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="profession"
                  className={`pl-9 ${errors.profession ? "border-red-500" : ""}`}
                  {...register("profession")}
                />
              </div>
              {errors.profession && (
                <p className="text-xs text-red-500">{errors.profession.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Địa chỉ</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                className={`pl-9 ${errors.location ? "border-red-500" : ""}`}
                {...register("location")}
              />
            </div>
            {errors.location && (
              <p className="text-xs text-red-500">{errors.location.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              rows={4}
              className={errors.bio ? "border-red-500" : ""}
              {...register("bio")}
              placeholder="Giới thiệu một chút về bản thân bạn..."
            />
            {errors.bio && (
              <p className="text-xs text-red-500">{errors.bio.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[100px]">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
