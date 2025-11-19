export interface IBlogComment {
  id: string
  post_id: string
  user_id?: string
  author_name: string
  author_email: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: Date
  updated_at: Date
}

export interface IBlogCommentInput {
  post_id: string
  user_id?: string
  author_name: string
  author_email: string
  content: string
  status?: 'pending' | 'approved' | 'rejected'
}
