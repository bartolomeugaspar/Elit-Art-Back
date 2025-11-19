export interface IBlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  category: 'magazine' | 'story' | 'article' | 'poetry' | 'drama' | 'other'
  author_id: string
  author_name: string
  status: 'draft' | 'published' | 'archived'
  views: number
  likes: number
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface IBlogPostInput {
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image: string
  category: 'magazine' | 'story' | 'article' | 'poetry' | 'drama' | 'other'
  author_id: string
  author_name: string
  status?: 'draft' | 'published' | 'archived'
  published_at?: Date
}
