import { apiClient } from "@/lib/axios";
import {
  Comment,
  CreateCommentPayload,
  PaginatedComments,
  PaginatedReplies,
  UpdateCommentPayload,
} from "@/types/comment";

export const getRootComments = async (
  postId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedComments> => {
  const { data: res } = await apiClient.get(`/posts/${postId}/comments`, {
    params: { page, limit },
  });
  return { comments: res.data, paging: res.paging };
};

export const getReplies = async (
  commentId: string,
  page: number = 1,
  limit: number = 20
): Promise<PaginatedReplies> => {
  const { data: res } = await apiClient.get(`/comments/${commentId}/replies`, {
    params: { page, limit },
  });
  return { replies: res.data, paging: res.paging };
};

export const createComment = async (
  postId: string,
  payload: CreateCommentPayload
): Promise<Comment> => {
  const { data } = await apiClient.post(`/posts/${postId}/comments`, payload);
  return data.data;
};

export const updateComment = async (
  commentId: string,
  payload: UpdateCommentPayload
): Promise<Comment> => {
  const { data } = await apiClient.patch(`/comments/${commentId}`, payload);
  return data.data;
};

export const deleteComment = async (commentId: string): Promise<boolean> => {
  const { data } = await apiClient.delete(`/comments/${commentId}`);
  return data.data?.success ?? true;
};
