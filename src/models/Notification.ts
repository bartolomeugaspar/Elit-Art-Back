export interface INotification {
  id: string
  user_id: string
  type: 'contact' | 'registration' | 'order' | 'comment' | 'user' | 'blog' | 'artwork' | 'artist' | 'event' | 'press' | 'general'
  title: string
  message: string
  link?: string
  reference_id?: string
  reference_type?: string
  read: boolean
  created_at: Date
  read_at?: Date
}

export interface INotificationInput {
  user_id: string
  type: INotification['type']
  title: string
  message: string
  link?: string
  reference_id?: string
  reference_type?: string
}
