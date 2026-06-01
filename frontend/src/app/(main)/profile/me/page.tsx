"use client";

import { Camera, MapPin, Calendar, LinkIcon, Edit, Bell, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useGetUser } from "@/hooks/user/useUser";
import { useUpdateUserProfileMutation } from "@/hooks/user/useUpdateUserProfileMutation";
import { useRef, useState } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user: userAuth } = useAuthStore();
  const { data: userData } = useGetUser();
  const { mutateAsync: updateProfile } = useUpdateUserProfileMutation();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState<{avatar?: boolean; cover?: boolean}>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const user = {
    name: userData?.user_name || userAuth?.user_name || "Guest User",
    username: userData?.user_name || userAuth?.user_name || "guest",
    bio: userData?.profile?.bio || userAuth?.profile?.bio || "Chưa có tiểu sử",
    location: userData?.profile?.location || userAuth?.profile?.location || "Chưa cập nhật",
    website: userData?.profile?.website || userAuth?.profile?.website || "",
    joinedDate: (userData?.created_at || userAuth?.created_at)
      ? new Date(userData?.created_at || userAuth?.created_at || "").toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
      : "Đang cập nhật...",
    following: 0,
    followers: 0,
    avatar: userData?.avatar || userAuth?.avatar || "",
    cover: userData?.profile?.cover_avatar || userAuth?.profile?.cover_avatar || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    if (type === "avatar") {
      formData.append("avatar", file);
    } else {
      formData.append("cover_avatar", file);
    }

    try {
      setIsUploading(prev => ({ ...prev, [type]: true }));
      await updateProfile(formData);
      toast.success(`Cập nhật ${type === "avatar" ? "ảnh đại hiện" : "ảnh bìa"} thành công`);
    } catch (error: any) {
      toast.error(`Cập nhật ${type === "avatar" ? "ảnh đại hiện" : "ảnh bìa"} thất bại`);
    } finally {
      setIsUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  // Mock posts for the grid view like in the dashboard
  const userPosts = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=400&fit=crop",
      likes: 128,
      comments: 24,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&h=400&fit=crop",
      likes: 256,
      comments: 42,
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=400&fit=crop",
      likes: 412,
      comments: 67,
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Cover & Avatar */}
      <div className="relative">
        <div className="h-48 w-full rounded-xl bg-gradient-to-r from-primary/30 via-primary/20 to-accent/30 overflow-hidden border border-border relative">
          <img
            src={user.cover}
            alt="Cover"
            className="h-full w-full object-cover opacity-50"
          />
          {isUploading.cover && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="absolute right-4 top-4 gap-2 shadow-sm"
            onClick={() => coverInputRef.current?.click()}
            disabled={isUploading.cover}
          >
            <Camera className="h-4 w-4" />
            Edit Cover
          </Button>
          <input
            type="file"
            className="hidden"
            ref={coverInputRef}
            onChange={(e) => handleFileChange(e, "cover")}
            accept="image/*"
          />
        </div>
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl rounded-full overflow-hidden">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-3xl bg-muted font-bold">
                {user.name.substring(0, 1).toUpperCase()}
              </AvatarFallback>
              {isUploading.avatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </Avatar>
            <button 
              className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors border-2 border-background disabled:opacity-50"
              onClick={() => avatarInputRef.current?.click()}
              disabled={isUploading.avatar}
            >
              <Camera className="h-4 w-4" />
            </button>
            <input
              type="file"
              className="hidden"
              ref={avatarInputRef}
              onChange={(e) => handleFileChange(e, "avatar")}
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-12 px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground font-medium small">@{user.username}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsEditModalOpen(true)} className="gap-2 font-bold shadow-sm">
                <Edit className="h-4 w-4" />
                Edit Profile
            </Button>
            <Button variant="outline" size="icon" className="shadow-sm">
                <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <p className="mt-4 text-sm text-foreground/80 leading-relaxed max-w-2xl">
          {user.bio}
        </p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
          {user.location && (
            <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {user.location}
            </span>
          )}
          {user.website && (
            <span className="flex items-center gap-1.5">
                <LinkIcon className="h-4 w-4" />
                <a href={user.website} target="_blank" className="text-primary hover:underline transition-colors">
                {user.website.replace(/^https?:\/\//, "")}
                </a>
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Tham gia {user.joinedDate}
          </span>
        </div>

        <div className="mt-6 flex gap-8 text-sm">
          <button className="hover:underline transition-all group">
            <span className="font-bold text-lg text-foreground group-hover:text-primary">{user.following}</span>{" "}
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Đang theo dõi</span>
          </button>
          <button className="hover:underline transition-all group">
            <span className="font-bold text-lg text-foreground group-hover:text-primary">{user.followers}</span>{" "}
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Người theo dõi</span>
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="posts" className="px-6">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-8 mb-6">
          <TabsTrigger 
            value="posts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 font-bold text-sm tracking-wide"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="photos" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 font-bold text-sm tracking-wide"
          >
            Photos
          </TabsTrigger>
          <TabsTrigger 
            value="likes" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 font-bold text-sm tracking-wide"
          >
            Likes
          </TabsTrigger>
        </TabsList>

        <div className="min-h-[400px]">
          <TabsContent value="posts" className="mt-0 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-border shadow-sm cursor-pointer"
                >
                  <img
                    src={post.image}
                    alt="Post"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                      ❤️ {post.likes}
                    </span>
                    <span className="flex items-center gap-2 text-sm font-bold text-white">
                      💬 {post.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="mt-0 animate-in fade-in duration-500">
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Ảnh của bạn sẽ xuất hiện ở đây.</p>
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-0 animate-in fade-in duration-500">
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">Các bài viết bạn đã thích sẽ xuất hiện ở đây.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}
