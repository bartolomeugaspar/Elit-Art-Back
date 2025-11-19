import { supabase } from '../config/database'
import { IPressRelease, IPressReleaseInput, IMediaKit, IMediaKitInput } from '../models/PressRelease'

export class PressService {
  // ===== PRESS RELEASES =====
  static async getAllPressReleases(status: string = 'published'): Promise<IPressRelease[]> {
    let query = supabase.from('press_releases').select('*')

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query.order('publication_date', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getPressReleaseById(id: string): Promise<IPressRelease | null> {
    const { data, error } = await supabase
      .from('press_releases')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async createPressRelease(releaseData: IPressReleaseInput): Promise<IPressRelease> {
    const { data, error } = await supabase
      .from('press_releases')
      .insert({
        ...releaseData,
        status: releaseData.status || 'draft',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updatePressRelease(id: string, releaseData: Partial<IPressReleaseInput>): Promise<IPressRelease> {
    const { data, error } = await supabase
      .from('press_releases')
      .update(releaseData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deletePressRelease(id: string): Promise<boolean> {
    const { error } = await supabase.from('press_releases').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async publishPressRelease(id: string): Promise<IPressRelease> {
    const { data, error } = await supabase
      .from('press_releases')
      .update({ status: 'published', publication_date: new Date() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  // ===== MEDIA KIT =====
  static async getAllMediaKits(): Promise<IMediaKit[]> {
    const { data, error } = await supabase
      .from('media_kits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  }

  static async getMediaKitById(id: string): Promise<IMediaKit | null> {
    const { data, error } = await supabase
      .from('media_kits')
      .select('*')
      .eq('id', id)
      .single()

    if (error && error.code !== 'PGRST116') throw new Error(error.message)
    return data || null
  }

  static async createMediaKit(kitData: IMediaKitInput): Promise<IMediaKit> {
    const { data, error } = await supabase
      .from('media_kits')
      .insert({
        ...kitData,
        downloads: 0,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async updateMediaKit(id: string, kitData: Partial<IMediaKitInput>): Promise<IMediaKit> {
    const { data, error } = await supabase
      .from('media_kits')
      .update(kitData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }

  static async deleteMediaKit(id: string): Promise<boolean> {
    const { error } = await supabase.from('media_kits').delete().eq('id', id)

    if (error) throw new Error(error.message)
    return true
  }

  static async incrementDownloads(id: string): Promise<IMediaKit> {
    const kit = await this.getMediaKitById(id)
    if (!kit) throw new Error('Media kit not found')

    const { data, error } = await supabase
      .from('media_kits')
      .update({ downloads: (kit.downloads || 0) + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return data
  }
}
