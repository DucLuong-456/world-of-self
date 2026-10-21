import React from "react";
import { useAuthStore } from "@/store/authStore";
import { useGetComments } from "@/hooks/comment/useGetComments";
import { useCreateCommentMutation } from "@/hooks/comment/useCreateCommentMutation";
import { CommentInput } from "./CommentInput";
import { CommentItem } from "./CommentItem";
import { Comment } from "@/types/comment";

interface CommentListProps {
  postId: string;
}

export const CommentList: React.FC<CommentListProps> = ({ postId }) => {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, error } = useGetComments(postId);
  const { mutateAsync: createComment } = useCreateCommentMutation(postId);

  const handlePostRoot = async (content: string) => {
    await createComment({ content });
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full max-w-full">
      <div className="px-1 border-t pt-2 shrink-0">
        <CommentInput onPost={handlePostRoot} placeholder="Bình luận nè..." userAvatar={user?.avatar} />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-0 pb-12 mt-2">
        {isLoading && <div className="text-center text-muted-foreground text-sm py-4">Đang tải bình luận...</div>}
        {error && <div className="text-center text-red-500 text-sm py-4">Lỗi khi tải bình luận</div>}
        
        {!isLoading && !error && data?.comments?.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-4">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
        )}

        {data?.comments.map((comment: Comment) => (
          <CommentItem key={comment.id} comment={comment} postId={postId} />
        ))}
      </div>
    </div>
  );
};
