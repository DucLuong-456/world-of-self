"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetPosts } from "@/hooks/post/useGetPosts";
import { Post } from "@/types/post";
import { User } from "@/types/user";
import {
  Bell,
  Calendar,
  Camera,
  Edit,
  Heart,
  LinkIcon,
  Loader2,
  MapPin,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { useRef } from "react";

interface ProfileViewProps {
  user: User;
  isOwnProfile: boolean;
  isUploadingAvatar?: boolean;
  isUploadingCover?: boolean;
  onEditAvatar?: (file: File) => void;
  onEditCover?: (file: File) => void;
  onEditProfile?: () => void;
}

function PostCard({ post }: { post: Post }) {
  const firstImage = post.images?.[0];
  const hasImage = !!firstImage;

  if (hasImage) {
    return (
      <div className="group relative aspect-square overflow-hidden rounded-xl border border-border shadow-sm cursor-pointer">
        <img
          src={firstImage.path}
          alt="Post"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-6 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-[2px]">
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <Heart className="h-4 w-4 fill-white" /> {post.react_count}
          </span>
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <MessageCircle className="h-4 w-4 fill-white" /> 0
          </span>
        </div>
      </div>
    );
  }

  // Text-only post (with or without template)
  return (
    <div
      className="group relative aspect-square overflow-hidden rounded-xl border border-border shadow-sm cursor-pointer flex items-center justify-center p-4"
      style={post.template ? { background: post.template.bg_color } : undefined}
    >
      <p
        className="text-sm font-semibold text-center line-clamp-4 leading-snug"
        style={
          post.template
            ? {
                color: post.template.text_color,
                fontStyle: post.template.font_style || "normal",
              }
            : undefined
        }
      >
        {post.content}
      </p>
      <div className="absolute inset-0 flex items-center justify-center gap-4 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="flex items-center gap-1 text-sm font-bold text-white">
          <Heart className="h-4 w-4 fill-white" /> {post.react_count}
        </span>
      </div>
    </div>
  );
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
  const posts = postsData?.posts ?? [];

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
          <TabsContent value="posts" className="mt-0 animate-in fade-in duration-500">
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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="photos" className="mt-0 animate-in fade-in duration-500">
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <p className="text-sm font-medium text-muted-foreground">
                Ảnh sẽ xuất hiện ở đây.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="likes" className="mt-0 animate-in fade-in duration-500">
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
