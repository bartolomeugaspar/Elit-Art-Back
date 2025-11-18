export interface IEvent {
  id: string
  title: string
  description: string
  full_description?: string
  category: 'Workshop' | 'Exposição' | 'Master' | 'Network'
  date: string
  time: string
  location: string
  image: string
  images?: string[]
  capacity: number
  attendees: number
  available_spots: number
  price: number
  is_free: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizer_id: string
  bank_details?: {
    account_holder?: string
    account_number?: string
    bank_name?: string
    iban?: string
  }
  created_at: Date
  updated_at: Date
}

export interface IEventInput {
  title: string
  description: string
  full_description?: string
  category: 'Workshop' | 'Exposição' | 'Master' | 'Network'
  date: string
  time: string
  location: string
  image: string
  images?: string[]
  capacity: number
  price?: number
  is_free?: boolean
  bank_details?: {
    account_holder?: string
    account_number?: string
    bank_name?: string
    iban?: string
  }
  organizer_id: string
}

// Calculate available spots
export function calculateAvailableSpots(capacity: number, attendees: number): number {
  const available = capacity - attendees
  return Math.max(0, available) // Never return negative values
}
