export type Database = {
  public: {
    Tables: {
      posts: {
        Row: { id: number; title: string; content: string; image_url: string | null; author_id: string | null; author_name: string; created_at: string };
        Insert: { title: string; content: string; image_url?: string | null; author_id?: string | null; author_name?: string };
      };
      comments: {
        Row: { id: number; post_id: number; author_id: string | null; author_name: string; content: string; created_at: string };
        Insert: { post_id: number; content: string; author_id?: string | null; author_name?: string };
      };
      reactions: {
        Row: { id: number; post_id: number; type: "LIKE" | "LOVE" | "LAUGH" | "WOW"; created_at: string };
        Insert: { post_id: number; type: "LIKE" | "LOVE" | "LAUGH" | "WOW" };
      };
    };
  };
}; 