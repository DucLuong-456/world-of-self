export interface CommentUser {
  id: string;
  user_name: string;
  avatar: string | null;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  parent_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  user: CommentUser;
  repliesCount?: number;
}

export interface PaginatedComments {
  comments: Comment[];
  paging: {
    limit: number;
    page: number;
    totalCount: number;
  };
}

export interface PaginatedReplies {
  replies: Comment[];
  paging: {
    limit: number;
    page: number;
    totalCount: number;
  };
}

export interface CreateCommentPayload {
  content: string;
  parent_id?: string;
}

export interface UpdateCommentPayload {
  content: string;
}
