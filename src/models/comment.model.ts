export interface Comment {
  created_at: string;
  champion: string;
  content: string;
  post_id: string;
  post: {
    id: string;
    content: string;
  };
}

export type NewComment = Omit<Comment, 'post'>;
