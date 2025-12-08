import { supabase } from '../config/database'
import { IArtwork, IArtworkInput } from '../models/Artwork'

export class ArtworkService {
  static async getAllArtworks(type?: string, isAvailable: boolean = true): Promise<IArtwork[]> {
    let query = supabase.from('artworks').select('*')

    if (type) {
      query = query.eq('type', type)
    }

    if (isAvailable) {
      query = query.eq('is_available', true)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getArtworkById(id: string): Promise<IArtwork | null> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async getArtworksByArtist(artistId: string): Promise<IArtwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('artist_id', artistId)
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async createArtwork(artworkData: IArtworkInput): Promise<IArtwork> {
    const { data, error } = await supabase
      .from('artworks')
      .insert({
        ...artworkData,
        is_available: artworkData.is_available !== false,
        is_featured: artworkData.is_featured || false,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updateArtwork(id: string, artworkData: Partial<IArtworkInput>): Promise<IArtwork> {
    const { data, error } = await supabase
      .from('artworks')
      .update(artworkData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteArtwork(id: string): Promise<boolean> {
    const { error } = await supabase.from('artworks').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async getFeaturedArtworks(limit: number = 6): Promise<IArtwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw new Error(error.message)
    return data || []
  }

  static async searchArtworks(query: string): Promise<IArtwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%,artist_name.ilike.%${query}%`)
      .eq('is_available', true)

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getArtworksByType(type: string): Promise<IArtwork[]> {
    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .eq('type', type)
      .eq('is_available', true)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async incrementLikes(id: string): Promise<IArtwork | null> {
    const artwork = await this.getArtworkById(id)
    if (!artwork) return null

    const { data, error } = await supabase
      .from('artworks')
      .update({ likes: (artwork.likes || 0) + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async decrementLikes(id: string): Promise<IArtwork | null> {
    const artwork = await this.getArtworkById(id)
    if (!artwork) return null

    const currentLikes = artwork.likes || 0
    const newLikes = Math.max(0, currentLikes - 1)

    const { data, error } = await supabase
      .from('artworks')
      .update({ likes: newLikes })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
