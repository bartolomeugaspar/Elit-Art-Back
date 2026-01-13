import { supabase } from '../config/database'
import { IArtist, IArtistInput } from '../models/Artist'
import { sendEmail, emailCredenciaisArtista } from '../config/email'
import bcrypt from 'bcryptjs'

export class ArtistService {
  static async createArtist(artistData: IArtistInput): Promise<IArtist> {
    // 1. Verificar se o email já existe na tabela users
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', artistData.email)
      .single()

    if (existingUser) {
      throw new Error('Já existe um usuário com este e-mail')
    }

    // 2. Criar artista
    const { data: artist, error } = await supabase
      .from('artists')
      .insert(artistData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    try {
      // 3. Gerar senha temporária
      const senhaTemporaria = Math.random().toString(36).slice(-8)
      const hashedPassword = await bcrypt.hash(senhaTemporaria, 10)

      // 4. Criar usuário na tabela users
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([{
          name: artist.name,
          email: artist.email,
          password: hashedPassword,
          role: 'artist',
          artist_id: artist.id
        }])
        .select()
        .single()

      if (userError) {
        console.error('Erro ao criar usuário:', userError)
        // Reverter criação do artista
        await supabase.from('artists').delete().eq('id', artist.id)
        throw new Error('Erro ao criar usuário para o artista')
      }

      // 5. Enviar email com credenciais
      console.log('\n========== ENVIO DE EMAIL ==========')
      console.log(`✅ Artista criado! Email: ${artist.email}`)
      console.log(`🔑 Senha temporária gerada: ${senhaTemporaria}`)
      console.log('📧 Iniciando envio de email...')
      
      try {
        const emailHTML = emailCredenciaisArtista(artist.name, artist.email, senhaTemporaria)
        console.log('✓ Template de email gerado')
        
        const emailResult = await sendEmail({
          to: artist.email,
          subject: 'Bem-vindo à Elit-Art - Suas Credenciais de Acesso',
          html: emailHTML
        })

        if (emailResult.success) {
          console.log(`✅ Email enviado com sucesso para ${artist.email}`)
          console.log(`📨 Message ID: ${emailResult.messageId}`)
        } else {
          console.error(`❌ Erro ao enviar email para ${artist.email}:`, emailResult.error)
          // Não bloquear a criação se o email falhar
        }
      } catch (emailError) {
        console.error('❌ Exceção ao enviar email:', emailError)
      }
      console.log('====================================\n')

    } catch (emailOrUserError) {
      console.error('Erro no processo de criação de usuário/email:', emailOrUserError)
      // Se falhar após criar o artista, o artista continua mas sem usuário
      // Isso pode ser tratado manualmente depois
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
