export interface CommentCreation {
  review_id: number;
  text: string;
}

export interface CommentDataGet {
  id: number;
  user_id: number;
  is_deletable: boolean;
  review_id: number;
  text: string;
  created_at: Date;
  likes: number;
  user_name: string;
  liked_by_user: boolean;
}
