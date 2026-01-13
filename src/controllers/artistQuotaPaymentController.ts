import { Request, Response } from 'express';
import { supabase } from '../config/database';
import { SupabaseStorageService } from '../services/SupabaseStorageService';
import { 
  sendEmail, 
  emailNovoPagamentoPendente, 
  emailPagamentoAprovado, 
  emailPagamentoRejeitado 
} from '../config/email';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Criar novo pagamento de cota
 */
export const createQuotaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { valor, mes_referencia, metodo_pagamento, observacoes, comprovante_url } = req.body;
    const artistId = req.user!.id;

    // Validações
    if (!valor || !mes_referencia) {
      return res.status(400).json({
        success: false,
        message: 'Valor e mês de referência são obrigatórios'
      });
    }

    // Usar o arquivo enviado ou o link fornecido
    let comprovanteUrl = comprovante_url;
    if (req.file) {
      try {
        comprovanteUrl = await SupabaseStorageService.uploadImage(req.file);
      } catch (uploadError) {
        console.error('Erro ao fazer upload do comprovante:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer upload do comprovante'
        });
      }
    }

    // Validar ano - apenas ano atual
    const currentYear = new Date().getFullYear();
    const [paymentYear] = mes_referencia.split('-');
    
    if (parseInt(paymentYear) !== currentYear) {
      return res.status(400).json({
        success: false,
        message: `Apenas pagamentos do ano ${currentYear} são permitidos`
      });
    }

    // Verificar se já existe um pagamento aprovado ou pendente para este mês
    const { data: existingPayments } = await supabase
      .from('artist_quota_payments')
      .select('*')
      .eq('artist_id', artistId)
      .eq('mes_referencia', mes_referencia)
      .in('status', ['pendente', 'aprovado']);

    if (existingPayments && existingPayments.length > 0) {
      const status = existingPayments[0].status;
      return res.status(400).json({
        success: false,
        message: status === 'aprovado' 
          ? 'Este mês já foi pago e aprovado' 
          : 'Já existe um pagamento pendente para este mês'
      });
    }

    // Criar pagamento
    const { data: payment, error } = await supabase
      .from('artist_quota_payments')
      .insert([{
        artist_id: artistId,
        valor,
        mes_referencia,
        metodo_pagamento,
        observacoes,
        comprovante_url: comprovanteUrl,
        status: 'pendente'
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar pagamento de cota:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao criar pagamento de cota'
      });
    }

    // Buscar informações do artista
    const { data: artist } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', artistId)
      .single();

    // Notificar administradores por email
    const { data: admins } = await supabase
      .from('users')
      .select('email, name')
      .eq('role', 'admin');

    if (admins && admins.length > 0) {
      for (const admin of admins) {
        try {
          await sendEmail({
            to: admin.email,
            subject: '🔔 Novo Pagamento de Quota Pendente - Ação Necessária',
            html: emailNovoPagamentoPendente(
              admin.name || admin.email,
              artist?.name || artist?.email || 'Artista',
              artist?.email || '',
              valor,
              mes_referencia,
              metodo_pagamento
            )
          });
        } catch (emailError) {
          console.error('Erro ao enviar email para admin:', emailError);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'Pagamento de cota submetido com sucesso',
      data: payment
    });
  } catch (error) {
    console.error('Erro ao criar pagamento de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao criar pagamento de cota'
    });
  }
};

/**
 * Listar pagamentos de cota do artista ou todos (admin)
 */
export const getQuotaPayments = async (req: AuthRequest, res: Response) => {
  try {
    const artistId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';
    const { status, mes_referencia } = req.query;

    let query = supabase
      .from('artist_quota_payments')
      .select(`
        *,
        artist:users!artist_quota_payments_artist_id_fkey (
          id,
          name,
          email
        ),
        aprovador:users!artist_quota_payments_aprovado_por_fkey (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    // Se não for admin, mostrar apenas pagamentos do próprio artista
    if (!isAdmin) {
      query = query.eq('artist_id', artistId);
    }

    // Filtros opcionais
    if (status) {
      query = query.eq('status', status as string);
    }

    if (mes_referencia) {
      query = query.eq('mes_referencia', mes_referencia as string);
    }

    const { data: payments, error } = await query;

    if (error) {
      console.error('Erro ao buscar pagamentos de cota:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar pagamentos de cota'
      });
    }

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Erro ao buscar pagamentos de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pagamentos de cota'
    });
  }
};

/**
 * Buscar pagamento de cota por ID
 */
export const getQuotaPaymentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const artistId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    const { data: payment, error } = await supabase
      .from('artist_quota_payments')
      .select(`
        *,
        artist:users!artist_quota_payments_artist_id_fkey (
          id,
          name,
          email
        ),
        aprovador:users!artist_quota_payments_aprovado_por_fkey (
          id,
          name
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento de cota não encontrado'
      });
    }

    // Verificar permissão
    if (!isAdmin && payment.artist_id !== artistId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para acessar este pagamento'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Erro ao buscar pagamento de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar pagamento de cota'
    });
  }
};

/**
 * Atualizar pagamento de cota (artista pode atualizar apenas pendentes)
 */
export const updateQuotaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const artistId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';
    const updateData = req.body;

    // Se houver arquivo, fazer upload
    if (req.file) {
      try {
        updateData.comprovante_url = await SupabaseStorageService.uploadImage(req.file);
      } catch (uploadError) {
        console.error('Erro ao fazer upload:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Erro ao fazer upload do comprovante'
        });
      }
    }

    // Buscar pagamento
    const { data: payment } = await supabase
      .from('artist_quota_payments')
      .select('*')
      .eq('id', id)
      .single();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento de cota não encontrado'
      });
    }

    // Verificar permissão
    if (!isAdmin && payment.artist_id !== artistId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para atualizar este pagamento'
      });
    }

    // Artista só pode atualizar pagamentos pendentes
    if (!isAdmin && payment.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Apenas pagamentos pendentes podem ser atualizados'
      });
    }

    // Atualizar pagamento
    const { data: updatedPayment, error } = await supabase
      .from('artist_quota_payments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar pagamento de cota:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao atualizar pagamento de cota'
      });
    }

    res.json({
      success: true,
      message: 'Pagamento de cota atualizado com sucesso',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Erro ao atualizar pagamento de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar pagamento de cota'
    });
  }
};

/**
 * Deletar pagamento de cota (apenas pendentes)
 */
export const deleteQuotaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const artistId = req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    // Buscar pagamento
    const { data: payment } = await supabase
      .from('artist_quota_payments')
      .select('*')
      .eq('id', id)
      .single();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento de cota não encontrado'
      });
    }

    // Verificar permissão
    if (!isAdmin && payment.artist_id !== artistId) {
      return res.status(403).json({
        success: false,
        message: 'Sem permissão para deletar este pagamento'
      });
    }

    // Apenas pagamentos pendentes podem ser deletados
    if (payment.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Apenas pagamentos pendentes podem ser deletados'
      });
    }

    // Deletar pagamento
    const { error } = await supabase
      .from('artist_quota_payments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar pagamento de cota:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao deletar pagamento de cota'
      });
    }

    res.json({
      success: true,
      message: 'Pagamento de cota deletado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao deletar pagamento de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar pagamento de cota'
    });
  }
};

/**
 * Aprovar pagamento de cota (apenas admin)
 */
export const approveQuotaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = req.user!.id;

    // Verificar se é admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem aprovar pagamentos'
      });
    }

    // Buscar pagamento com informações do artista
    const { data: payment } = await supabase
      .from('artist_quota_payments')
      .select(`
        *,
        artist:users!artist_quota_payments_artist_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento de cota não encontrado'
      });
    }

    if (payment.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Apenas pagamentos pendentes podem ser aprovados'
      });
    }

    // Aprovar pagamento
    const { data: updatedPayment, error } = await supabase
      .from('artist_quota_payments')
      .update({
        status: 'aprovado',
        aprovado_por: adminId,
        data_aprovacao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao aprovar pagamento de cota:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao aprovar pagamento de cota'
      });
    }

    // Notificar artista por email
    if (payment.artist?.email) {
      try {
        await sendEmail({
          to: payment.artist.email,
          subject: '✅ Pagamento de Quota Aprovado - Elit-Art',
          html: emailPagamentoAprovado(
            payment.artist.name || payment.artist.email,
            payment.valor,
            payment.mes_referencia,
            new Date().toISOString()
          )
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de aprovação:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Pagamento de cota aprovado com sucesso',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Erro ao aprovar pagamento de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao aprovar pagamento de cota'
    });
  }
};

/**
 * Rejeitar pagamento de cota (apenas admin)
 */
export const rejectQuotaPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { motivo_rejeicao } = req.body;
    const adminId = req.user!.id;

    // Verificar se é admin
    if (req.user!.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Apenas administradores podem rejeitar pagamentos'
      });
    }

    if (!motivo_rejeicao) {
      return res.status(400).json({
        success: false,
        message: 'Motivo da rejeição é obrigatório'
      });
    }

    // Buscar pagamento com informações do artista
    const { data: payment } = await supabase
      .from('artist_quota_payments')
      .select(`
        *,
        artist:users!artist_quota_payments_artist_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Pagamento de cota não encontrado'
      });
    }

    if (payment.status !== 'pendente') {
      return res.status(400).json({
        success: false,
        message: 'Apenas pagamentos pendentes podem ser rejeitados'
      });
    }

    // Rejeitar pagamento
    const { data: updatedPayment, error } = await supabase
      .from('artist_quota_payments')
      .update({
        status: 'rejeitado',
        motivo_rejeicao,
        aprovado_por: adminId,
        data_aprovacao: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao rejeitar pagamento de cota:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao rejeitar pagamento de cota'
      });
    }

    // Notificar artista por email
    if (payment.artist?.email) {
      try {
        await sendEmail({
          to: payment.artist.email,
          subject: '❌ Pagamento de Quota Não Aprovado - Elit-Art',
          html: emailPagamentoRejeitado(
            payment.artist.name || payment.artist.email,
            payment.valor,
            payment.mes_referencia,
            motivo_rejeicao
          )
        });
      } catch (emailError) {
        console.error('Erro ao enviar email de rejeição:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Pagamento de cota rejeitado',
      data: updatedPayment
    });
  } catch (error) {
    console.error('Erro ao rejeitar pagamento de cota:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao rejeitar pagamento de cota'
    });
  }
};
