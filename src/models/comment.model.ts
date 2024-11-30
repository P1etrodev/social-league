export interface Comment {
  created_at: string;
  champion: string;
  content: string;
  post_id: string;
}

export interface NewComment extends Comment {}
