"use client";

import { Loader2 } from "lucide-react";
import { PostCard } from "@/components/post/PostCard";
import { CreatePost } from "@/components/post/CreatePost";
import { StoriesSection } from "@/components/feed/StoriesSection";
import { useGetPosts } from "@/hooks/post/useGetPosts";
import { useToggleReactMutation } from "@/hooks/post/useToggleReactMutation";
import { Post } from "@/types/post";

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
};

export default function HomePage() {
  const { data: postsData, isLoading: isLoadingPosts } = useGetPosts({
    page: 1,
    limit: 10,
  });

  const { mutate: toggleReact } = useToggleReactMutation();
  const posts: Post[] = postsData?.posts ?? [];

  return (
    <div className="space-y-6 pb-10">
      <StoriesSection />
      <CreatePost />

      {/* Feed */}
      <div className="space-y-4">
        {isLoadingPosts ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-400 py-10 text-sm">
            Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              author={{
                name: post.user?.user_name ?? "Ẩn danh",
                username: post.user?.user_name
                  ?.toLowerCase()
                  .replace(/\s+/g, ""),
                avatar: post.user?.avatar,
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
          ))
        )}

        {!isLoadingPosts && posts.length > 0 && (
          <div className="text-center text-muted-foreground py-10 text-xs font-medium">
            Bạn đã xem hết các bài viết mới nhất.
          </div>
        )}
      </div>
    </div>
  );
}
