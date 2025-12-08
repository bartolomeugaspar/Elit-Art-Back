import { supabase } from '../config/database'
import { IArtist, IArtistInput } from '../models/Artist'

export class ArtistService {
  static async createArtist(artistData: IArtistInput): Promise<IArtist> {
    const { data: artist, error } = await supabase
      .from('artists')
      .insert(artistData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return artist
  }

  static async getArtists(showAll: boolean = false): Promise<IArtist[]> {
    let query = supabase
      .from('artists')
      .select('*')
    
    // Se não for para mostrar todos, filtrar apenas os públicos
    if (!showAll) {
      query = query.eq('show_in_public', true)
    }
    
    const { data: artists, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return artists || []
  }

  static async getArtistById(id: string): Promise<IArtist | null> {
    const { data: artist, error } = await supabase
      .from('artists')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return artist
  }

  static async updateArtist(id: string, updates: Partial<IArtist>): Promise<IArtist | null> {
    const { data: artist, error } = await supabase
      .from('artists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return null
    }

    return artist
  }

  static async deleteArtist(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('artists')
      .delete()
      .eq('id', id)

    return !error
  }

  static async searchArtists(searchQuery: string): Promise<IArtist[]> {
    const { data: artists, error } = await supabase
      .from('artists')
      .select('*')
      .or(`name.ilike.%${searchQuery}%,area.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)

    if (error) {
      throw new Error(error.message)
    }

    return artists || []
  }
}
