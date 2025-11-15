export interface IEvent {
  id: string
  title: string
  description: string
  fullDescription?: string
  category: 'Workshop' | 'Exposição' | 'Masterclass' | 'Networking'
  date: string
  time: string
  location: string
  image: string
  images?: string[]
  capacity: number
  attendees: number
  availableSpots: number
  price: number
  isFree: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizerId: string
  createdAt: Date
  updatedAt: Date
}

export interface IEventInput {
  title: string
  description: string
  fullDescription?: string
  category: 'Workshop' | 'Exposição' | 'Masterclass' | 'Networking'
  date: string
  time: string
  location: string
  image: string
  images?: string[]
  capacity: number
  price?: number
  isFree?: boolean
  organizerId: string
}

// Calculate available spots
export function calculateAvailableSpots(capacity: number, attendees: number): number {
  const available = capacity - attendees
  return Math.max(0, available) // Never return negative values
}
