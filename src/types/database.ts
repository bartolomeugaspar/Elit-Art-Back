// Types para Supabase

export interface User {
  id: string
  name: string
  email: string
  password: string
  phone?: string
  profile_image?: string
  bio?: string
  role: 'user' | 'artista' | 'admin'
  is_email_verified: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Event {
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
  created_at: string
  updated_at: string
}

export interface Registration {
  id: string
  user_id: string
  event_id: string
  status: 'registered' | 'attended' | 'cancelled'
  registration_date: string
  payment_status: 'pending' | 'completed' | 'failed'
  payment_method?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  author_id: string
  event_id: string
  rating: number
  comment: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface Newsletter {
  id: string
  email: string
  is_subscribed: boolean
  subscribed_at: string
  unsubscribed_at?: string
  created_at: string
  updated_at: string
}

// Types para respostas da API
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  token: string
}
