import { Response } from 'express';
import { supabase } from '../config/database';
import { AuthRequest } from '../middleware/auth';

/**
 * Buscar perfil do artista (dados do usuário)
 */
export const getArtistProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    
    // Artista só pode ver seu próprio perfil, admin pode ver qualquer um
    if (req.user!.role !== 'admin' && userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para acessar este perfil'
      });
    }

    // Buscar dados do usuário
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'Artista não encontrado'
      });
    }

    // Buscar dados adicionais da tabela artists se existir
    const { data: artistData } = await supabase
      .from('artists')
      .select('artistic_name, area, description')
      .eq('email', user.email)
      .single();

    // Retornar dados formatados
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profile_image || user.image, // Usar profile_image primeiro, depois image como fallback
        profile_image: user.profile_image || user.image, // Manter compatibilidade com ambos os campos
        phone: user.phone || '',
        artisticName: artistData?.artistic_name || '', // Nome artístico da tabela artists
        area: artistData?.area || '', // Área de atuação
        description: artistData?.description || '', // Descrição/bio
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });
  } catch (error) {
    console.error('Erro ao buscar perfil do artista:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar perfil do artista'
    });
  }
};

/**
 * Atualizar senha do artista
 */
export const updateArtistPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    // Artista só pode alterar sua própria senha
    if (userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para alterar esta senha'
      });
    }

    // Validações
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual e nova senha são obrigatórias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'A nova senha deve ter no mínimo 6 caracteres'
      });
    }

    // Buscar usuário
    const { data: user } = await supabase
      .from('users')
      .select('password')
      .eq('id', id)
      .single();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Verificar senha atual
    const bcrypt = require('bcryptjs');
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Senha atual incorreta'
      });
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualizar senha
    const { error } = await supabase
      .from('users')
      .update({ 
        password: hashedPassword,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Senha alterada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar senha'
    });
  }
};

/**
 * Atualizar nome do artista
 */
export const updateArtistName = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name } = req.body;

    // Artista só pode alterar seu próprio nome
    if (userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Você não tem permissão para alterar este perfil'
      });
    }

    // Validações
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nome é obrigatório'
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Nome não pode ter mais de 100 caracteres'
      });
    }

    // Atualizar nome na tabela users
    const { data: user, error } = await supabase
      .from('users')
      .update({ 
        name: name.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Tentar atualizar também na tabela artists se existir
    const { data: artistData } = await supabase
      .from('artists')
      .select('id')
      .eq('email', user.email)
      .single();

    if (artistData) {
      await supabase
        .from('artists')
        .update({ 
          name: name.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', artistData.id);
    }

    res.json({
      success: true,
      message: 'Nome atualizado com sucesso',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.profile_image || user.image,
        profile_image: user.profile_image || user.image
      }
    });
  } catch (error) {
    console.error('Erro ao atualizar nome:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar nome'
    });
  }
};
