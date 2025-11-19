export interface IForumTopic {
  id: string
  title: string
  description: string
  category: 'general' | 'art' | 'events' | 'collaboration' | 'feedback'
  author_id: string
  author_name: string
  replies_count: number
  views: number
  is_pinned: boolean
  is_closed: boolean
  created_at: Date
  updated_at: Date
}

export interface IForumTopicInput {
  title: string
  description: string
  category: 'general' | 'art' | 'events' | 'collaboration' | 'feedback'
  author_id: string
  author_name: string
  replies_count?: number
  views?: number
  is_pinned?: boolean
  is_closed?: boolean
}

export interface IForumReply {
  id: string
  topic_id: string
  author_id: string
  author_name: string
  content: string
  likes: number
  created_at: Date
  updated_at: Date
}

export interface IForumReplyInput {
  topic_id: string
  author_id: string
  author_name: string
  content: string
}
