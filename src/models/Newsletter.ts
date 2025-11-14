export interface INewsletter {
  id: string
  email: string
  isSubscribed: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface INewsletterInput {
  email: string
  isSubscribed?: boolean
}
