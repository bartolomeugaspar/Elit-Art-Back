export interface IArtist {
  id: string
  name: string
  artistic_name?: string
  area: string
  description: string
  email: string
  phone: string
  image?: string
  role?: string
  created_at: Date
  updated_at: Date
}

export interface IArtistInput {
  name: string
  artistic_name?: string
  area: string
  description: string
  email: string
  phone: string
  image?: string
  role?: string
}
