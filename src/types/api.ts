// Shared API types for MCP server
export interface PagingParams {
  previous_params: Record<string, unknown> | null;
  next_params: Record<string, unknown> | null;
}

export interface Author {
  name: string;
  description: string;
  profile_image_url: string;
}

export interface Photo {
  width: number;
  height: number;
  photo_key: string;
  photo_album_key: string | null;
  author: Author;
  url: string;
  comment_count: number;
  emotion_count: number;
  created_at: number;
  is_video_thumbnail: boolean;
}

export interface Post {
  content: string;
  post_key: string;
  created_at: number;
  photos: Photo[];
  comment_count: number;
  author: Author;
}

export interface AlbumItem {
  photo_album_key: string;
  name: string;
  photo_count: number;
  cover_photo: Record<string, unknown> | null;
  created_at: number;
}

export interface EmulatedPage<T> {
  pageItems: T[];
  nextCursor?: string | null;
}
