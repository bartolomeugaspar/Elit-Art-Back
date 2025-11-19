export interface IRegistration {
  id: string
  user_id: string
  event_id: string
  status: 'registered' | 'attended' | 'cancelled'
  registration_date: Date
  payment_status: 'pending' | 'completed' | 'failed' | 'pending_approval'
  payment_method?: string
  proof_url?: string
  full_name?: string
  email?: string
  phone_number?: string
  payment_notes?: string
  created_at: Date
  updated_at: Date
}

export interface IRegistrationInput {
  user_id?: string
  event_id: string
  status?: 'registered' | 'attended' | 'cancelled'
  payment_status?: 'pending' | 'completed' | 'failed' | 'pending_approval'
  payment_method?: string
  proof_url?: string
  full_name?: string
  email?: string
  phone_number?: string
  payment_notes?: string
}
