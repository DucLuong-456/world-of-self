import { User } from "./user";

export enum PostCategory {
  News = "news",
  Technology = "technology",
  Entertainment = "entertainment",
}

export interface PostImage {
  id: string;
  path: string;
  ext: string;
  sort_order: number;
}

export interface PostTemplate {
  id: string;
  name: string;
  bg_color: string;
  text_color: string;
  font_style: string | null;
}

export interface Post {
  id: string;
  title?: string;
  content: string;
  react_count: number;
  user_id: string;
  category?: PostCategory;
  template_id?: string;
  images?: PostImage[];
  template?: PostTemplate | null;
  user?: User;
  is_reacted?: boolean;
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
  images?: File[];
  template_id?: string;
}
