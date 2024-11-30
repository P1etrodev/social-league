export type Post = {
  id: string;
  created_at: string;
  champion: string;
  content: string;
  comments: { count: number }[];
};

export type NewPost = Omit<Post, 'id' | 'comments'>;
