export interface ITestimonial {
  id: string
  authorId: string
  eventId: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ITestimonialInput {
  authorId: string
  eventId: string
  rating: number
  comment: string
  isApproved?: boolean
}
