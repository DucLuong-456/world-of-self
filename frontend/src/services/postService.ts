import { apiClient } from "@/lib/axios";
import {
  CreatePostPayload,
  PaginatedPosts,
  Post,
  SearchPostParams,
} from "@/types/post";

export const getPosts = async (
  params?: SearchPostParams,
): Promise<PaginatedPosts> => {
  const { data: res } = await apiClient.get("/posts", { params });
  // Backend TransformInterceptor returns { data: Post[], paging }
  return { posts: res.data, paging: res.paging };
};

export const createPost = async (payload: CreatePostPayload): Promise<Post> => {
  const formData = new FormData();
  if (payload.title) formData.append("title", payload.title);
  formData.append("content", payload.content);
  if (payload.category) formData.append("category", payload.category);
  if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);

  const { data } = await apiClient.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
