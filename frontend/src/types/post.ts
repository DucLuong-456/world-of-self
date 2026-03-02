import { User } from "./user";

export enum PostCategory {
  News = "news",
  Technology = "technology",
  Entertainment = "entertainment",
}

export interface StoredImage {
  id: string;
  path: string;
  ext: string;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  react_count: number;
  user_id: string;
  category?: PostCategory;
  stored_image_id?: string;
  image?: StoredImage;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface PaginatedPosts {
  posts: Post[];
  paging: {
    limit: number;
    page: number;
    totalCount: number;
  };
}

export interface SearchPostParams {
  keyword?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface CreatePostPayload {
  title?: string;
  content: string;
  category?: PostCategory;
  thumbnail?: File;
}
