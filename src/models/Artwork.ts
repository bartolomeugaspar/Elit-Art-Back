export interface IArtwork {
  id: string
  title: string
  description: string
  artist_id: string
  artist_name: string
  type: 'musica' | 'literatura' | 'teatro' | 'danca' | 'cinema' | 'desenho'
  year: number
  dimensions?: string
  medium?: string
  image_url: string
  gallery_images?: string[]
  price?: number
  is_available: boolean
  is_featured: boolean
  created_at: Date
  updated_at: Date
}

export interface IArtworkInput {
  title: string
  description: string
  artist_id: string
  artist_name: string
  type: 'musica' | 'literatura' | 'teatro' | 'danca' | 'cinema' | 'desenho'
  year: number
  dimensions?: string
  medium?: string
  image_url: string
  gallery_images?: string[]
  price?: number
  is_available?: boolean
  is_featured?: boolean
}
