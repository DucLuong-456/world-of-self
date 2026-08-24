"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPosts } from "@/hooks/post/useGetPosts";
import { useToggleReactMutation } from "@/hooks/post/useToggleReactMutation";
import { Post } from "@/types/post";
import { User } from "@/types/user";
import {
  Bell,
  Calendar,
  Camera,
  Edit,
  LinkIcon,
  Loader2,
  MapPin,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useRef } from "react";
import { PostCard } from "@/components/post/PostCard";

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
};

interface ProfileViewProps {
  user: User;
  isOwnProfile: boolean;
  isUploadingAvatar?: boolean;
  isUploadingCover?: boolean;
  onEditAvatar?: (file: File) => void;
  onEditCover?: (file: File) => void;
  onEditProfile?: () => void;
}

export function ProfileView({
  user,
  isOwnProfile,
  isUploadingAvatar,
  isUploadingCover,
  onEditAvatar,
  onEditCover,
  onEditProfile,
}: ProfileViewProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { data: postsData, isLoading: isLoadingPosts } = useGetPosts({
    userId: user.id,
    limit: 20,
  });
  const posts: Post[] = postsData?.posts ?? [];
  const { mutate: toggleReact } = useToggleReactMutation();

  const displayName = user.user_name || "User";
  const bio = user.profile?.bio || (isOwnProfile ? "Chưa có tiểu sử" : "");
  const location = user.profile?.location;
  const website = user.profile?.website;
  const coverUrl =
    user.profile?.cover_avatar ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop";
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Cover & Avatar */}
      <div className="relative">
        <div className="h-48 w-full rounded-xl bg-gradient-to-r from-primary/30 via-primary/20 to-accent/30 overflow-hidden border border-border relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt="Cover"
            className="h-full w-full object-cover opacity-50"
          />
          {isUploadingCover && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          {isOwnProfile && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute right-4 top-4 gap-2 shadow-sm"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
              >
                <Camera className="h-4 w-4" />
                Edit Cover
              </Button>
              <input
                type="file"
                hidden
                accept="image/*"
                ref={coverInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onEditCover?.(file);
                }}
              />
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl rounded-full overflow-hidden">
              <AvatarImage src={user.avatar} alt={displayName} />
              <AvatarFallback className="text-3xl bg-muted font-bold">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </Avatar>
            {isOwnProfile && (
              <>
                <button
                  className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors border-2 border-background disabled:opacity-50"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  ref={avatarInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onEditAvatar?.(file);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-12 px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              {displayName}
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              @{displayName}
            </p>
          </div>
          <div className="flex gap-2">
            {isOwnProfile ? (
              <>
                <Button
                  onClick={onEditProfile}
                  className="gap-2 font-bold shadow-sm"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="icon" className="shadow-sm">
                  <Bell className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button className="gap-2 font-bold shadow-sm">
                  <UserPlus className="h-4 w-4" />
                  Theo dõi
                </Button>
                <Button variant="outline" className="gap-2 shadow-sm">
                  <MessageCircle className="h-4 w-4" />
                  Nhắn tin
                </Button>
              </>
            )}
          </div>
        </div>

        {bio && (
          <p className="mt-4 text-sm text-foreground/80 leading-relaxed max-w-2xl">
            {bio}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              {location}
            </span>
          )}
          {website && (
            <span className="flex items-center gap-1.5">
              <LinkIcon className="h-4 w-4" />
              <a
                href={website}
                target="_blank"
                className="text-primary hover:underline transition-colors"
              >
                {website.replace(/^https?:\/\//, "")}
              </a>
            </span>
          )}
          {joinedDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Tham gia {joinedDate}
            </span>
          )}
        </div>

        <div className="mt-6 flex gap-8 text-sm">
          <button className="hover:underline transition-all group">
            <span className="font-bold text-lg text-foreground group-hover:text-primary">
              0
            </span>{" "}
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              Đang theo dõi
            </span>
          </button>
          <button className="hover:underline transition-all group">
            <span className="font-bold text-lg text-foreground group-hover:text-primary">
              0
            </span>{" "}
            <span className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
              Người theo dõi
            </span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="posts" className="px-6">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 gap-8 mb-6">
          <TabsTrigger
            value="posts"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 pb-3 font-bold text-sm tracking-wide"
          >
            Posts {posts.length > 0 && `(${posts.length})`}
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
          <TabsContent
            value="posts"
            className="mt-0 animate-in fade-in duration-500"
          >
            {isLoadingPosts ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                  {isOwnProfile
                    ? "Bạn chưa có bài đăng nào."
                    : "Người dùng này chưa có bài đăng nào."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    author={{
                      name: post.user?.user_name ?? user.user_name ?? "Ẩn danh",
                      username: post.user?.user_name
                        ?.toLowerCase()
                        .replace(/\s+/g, ""),
                      avatar: post.user?.avatar ?? user.avatar,
                      userId: post.user_id,
                    }}
                    content={post.content}
                    images={post.images ?? []}
                    template={post.template}
                    timestamp={formatTime(post.created_at)}
                    likes={post.react_count}
                    comments={0}
                    shares={0}
                    isLiked={post.is_reacted}
                    onReact={() => toggleReact(post.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="photos"
            className="mt-0 animate-in fade-in duration-500"
          >
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Ảnh sẽ xuất hiện ở đây.
              </p>
            </div>
          </TabsContent>

          <TabsContent
            value="likes"
            className="mt-0 animate-in fade-in duration-500"
          >
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Các bài viết đã thích sẽ xuất hiện ở đây.
              </p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
