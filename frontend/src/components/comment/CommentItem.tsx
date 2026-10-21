import React, { useState } from "react";
import { Comment } from "@/types/comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentInput } from "./CommentInput";
import { useGetReplies } from "@/hooks/comment/useGetReplies";
import { useCreateCommentMutation } from "@/hooks/comment/useCreateCommentMutation";
import { Heart, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  level?: number;
  maxLevel?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId, 
  level = 0,
  maxLevel = 3 // Limit UI maximum indentation to 3-4 levels
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  const { data: repliesData, isLoading } = useGetReplies(comment.id, showReplies);
  const { mutateAsync: createReply } = useCreateCommentMutation(postId);

  const handlePostReply = async (content: string) => {
    await createReply({ content, parent_id: comment.id });
    setShowReplies(true);
    setIsReplying(false);
  };

  const nextLevel = level; // Removed forced padding left logic since we use native thread wrapper

  // Extract elapsed time logic using date-fns without locale for simplicity, or manually
  const formattedTime = (() => {
    try {
       // date-fns doesn't complain without locale if we fallback to basic 'ago'
       const dist = formatDistanceToNow(new Date(comment.created_at));
       // Basic translation mapping for common words
       return dist.replace('about ', '').replace('less than a minute', 'Vừa xong').replace(' minute', ' phút').replace(' minutes', ' phút').replace(' hour', ' giờ').replace(' hours', ' giờ').replace(' day', ' ngày').replace(' days', ' ngày').replace(' month', ' tháng').replace(' months', ' tháng').replace(' year', ' năm').replace(' years', ' năm') + ' trước';
    } catch {
       return "Vừa xong";
    }
  })();

  const hasChildren = (comment.repliesCount ?? 0) > 0 || (repliesData?.replies?.length ?? 0) > 0;
  const isThreaded = showReplies && hasChildren;

  return (
    <div className="flex flex-col w-full relative">
      <div className="flex gap-2 group pt-2 relative z-10">
        <Avatar className="w-8 h-8 shrink-0 relative z-20">
          <AvatarImage src={comment.user?.avatar || undefined} />
          <AvatarFallback>{comment.user?.user_name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col min-w-0 max-w-full group/inner">
          <div className="bg-muted px-3 py-2 rounded-2xl max-w-full w-fit">
            <span className="font-semibold text-[13px] block leading-tight">{comment.user?.user_name}</span>
            <span className="text-[14px] leading-snug whitespace-pre-wrap break-words">{comment.content}</span>
          </div>

          <div className="flex gap-4 text-xs font-semibold text-muted-foreground mt-1 ml-2 items-center">
            {/* React Action - static for now */}
            <button className="flex items-center gap-1 hover:underline text-muted-foreground/80 hover:text-red-500 transition-colors">
              <Heart className="h-3 w-3" />
              <span>Thích</span> {/* You can map react_count here later */}
            </button>
            <button 
              className="hover:underline transition-colors"
              onClick={() => setIsReplying(!isReplying)}
            >
              Trả lời
            </button>
            <span className="font-normal text-muted-foreground/70 flex items-center gap-2">
              {formattedTime}
              <button className="opacity-0 group-hover/inner:opacity-100 transition-opacity">
                <MoreHorizontal className="h-3 w-3" />
              </button>
            </span>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-10 mt-2 mb-2 max-w-[90%] pr-4 relative z-20">
          <CommentInput 
            isReply 
            onCancel={() => setIsReplying(false)} 
            onPost={handlePostReply}
          />
        </div>
      )}

      {!showReplies && (comment.repliesCount ?? 0) > 0 && (
        <div className="ml-10 mt-1 mb-2 relative z-20">
           <button 
             className="text-[13px] font-semibold hover:underline flex items-center gap-2 text-primary"
             onClick={() => setShowReplies(true)}
           >
             <div className="w-8 border-t-2 border-muted"></div>
             {comment.repliesCount} phản hồi
           </button>
        </div>
      )}

      {isThreaded && (
        <div className="ml-4 pl-4 border-l-2 border-muted relative z-10 mt-1 flex flex-col gap-2">
          {isLoading ? (
            <div className="text-xs text-muted-foreground py-1">Đang tải phản hồi...</div>
          ) : (
            repliesData?.replies.map((reply: Comment) => (
              <CommentItem 
                key={reply.id} 
                comment={reply} 
                postId={postId} 
                level={nextLevel + 1}
                maxLevel={maxLevel} 
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
