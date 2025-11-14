export interface IRegistration {
  id: string
  userId: string
  eventId: string
  status: 'registered' | 'attended' | 'cancelled'
  registrationDate: Date
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentMethod?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface IRegistrationInput {
  userId: string
  eventId: string
  status?: 'registered' | 'attended' | 'cancelled'
  paymentStatus?: 'pending' | 'completed' | 'failed'
  paymentMethod?: string
  notes?: string
}
