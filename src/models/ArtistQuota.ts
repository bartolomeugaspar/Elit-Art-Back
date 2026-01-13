import { supabase } from '../config/database';

export interface ArtistQuota {
  id: string;
  artist_id: string;
  amount: number;
  payment_date: Date;
  payment_method?: string;
  payment_reference?: string;
  status: 'pending' | 'approved' | 'rejected';
  proof_of_payment?: string;
  notes?: string;
  approved_by?: string;
  approved_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface ArtistQuotaCreate {
  artist_id: string;
  amount: number;
  payment_date: Date;
  payment_method?: string;
  payment_reference?: string;
  proof_of_payment?: string;
  notes?: string;
}

export interface ArtistQuotaUpdate {
  amount?: number;
  payment_date?: Date;
  payment_method?: string;
  payment_reference?: string;
  proof_of_payment?: string;
  notes?: string;
  status?: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
}

class ArtistQuotaModel {
  async create(quota: ArtistQuotaCreate): Promise<string> {
    const { data, error } = await supabase
      .from('artist_quota_payments')
      .insert({
        artist_id: quota.artist_id,
        valor: quota.amount,
        data_pagamento: quota.payment_date,
        metodo_pagamento: quota.payment_method || null,
        mes_referencia: quota.payment_reference || null,
        comprovante_url: quota.proof_of_payment || null,
        observacoes: quota.notes || null,
        status: 'pendente'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async findById(id: string): Promise<ArtistQuota | null> {
    const { data, error } = await supabase
      .from('artist_quota_payments')
      .select(`
        *,
        artist:users!artist_id(name, email),
        approver:users!aprovado_por(name)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      artist_id: data.artist_id,
      artist_name: data.artist?.name,
      artist_email: data.artist?.email,
      amount: parseFloat(data.valor),
      payment_date: data.data_pagamento,
      payment_method: data.metodo_pagamento,
      payment_reference: data.mes_referencia,
      status: data.status === 'pendente' ? 'pending' : data.status === 'aprovado' ? 'approved' : 'rejected',
      proof_of_payment: data.comprovante_url,
      notes: data.observacoes,
      approved_by: data.aprovado_por,
      approved_by_name: data.approver?.name,
      approved_at: data.data_aprovacao,
      created_at: data.created_at,
      updated_at: data.updated_at
    } as any;
  }

  async findByArtist(artistId: string): Promise<ArtistQuota[]> {
    const { data, error } = await supabase
      .from('artist_quota_payments')
      .select(`
        *,
        approver:users!aprovado_por(name)
      `)
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(item => ({
      id: item.id,
      artist_id: item.artist_id,
      amount: parseFloat(item.valor),
      payment_date: item.data_pagamento,
      payment_method: item.metodo_pagamento,
      payment_reference: item.mes_referencia,
      status: item.status === 'pendente' ? 'pending' : item.status === 'aprovado' ? 'approved' : 'rejected',
      proof_of_payment: item.comprovante_url,
      notes: item.observacoes,
      approved_by: item.aprovado_por,
      approved_by_name: item.approver?.name,
      approved_at: item.data_aprovacao,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) as any;
  }

  async findAll(status?: string): Promise<ArtistQuota[]> {
    // Map status from English to Portuguese
    const statusMap: Record<string, string> = {
      'pending': 'pendente',
      'approved': 'aprovado',
      'rejected': 'rejeitado'
    };

    let query = supabase
      .from('artist_quota_payments')
      .select(`
        *,
        artist:users!artist_id(name, email),
        approver:users!aprovado_por(name)
      `)
      .order('created_at', { ascending: false });

    if (status && statusMap[status]) {
      query = query.eq('status', statusMap[status]);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('Error fetching quotas:', error);
      return [];
    }

    console.log('✅ Fetched quotas from DB:', data.length);

    // Map Portuguese column names to English interface
    return data.map(item => ({
      id: item.id,
      artist_id: item.artist_id,
      artist_name: item.artist?.name,
      artist_email: item.artist?.email,
      amount: parseFloat(item.valor),
      payment_date: item.data_pagamento,
      payment_method: item.metodo_pagamento,
      payment_reference: item.mes_referencia,
      status: item.status === 'pendente' ? 'pending' : item.status === 'aprovado' ? 'approved' : 'rejected',
      proof_of_payment: item.comprovante_url,
      notes: item.observacoes,
      approved_by: item.aprovado_por,
      approved_by_name: item.approver?.name,
      approved_at: item.data_aprovacao,
      created_at: item.created_at,
      updated_at: item.updated_at
    })) as any;
  }

  async update(id: string, quota: ArtistQuotaUpdate): Promise<boolean> {
    const updateData: any = {};

    // Map English fields to Portuguese column names
    if (quota.amount !== undefined) updateData.valor = quota.amount;
    if (quota.payment_date !== undefined) updateData.data_pagamento = quota.payment_date;
    if (quota.payment_method !== undefined) updateData.metodo_pagamento = quota.payment_method;
    if (quota.payment_reference !== undefined) updateData.mes_referencia = quota.payment_reference;
    if (quota.proof_of_payment !== undefined) updateData.comprovante_url = quota.proof_of_payment;
    if (quota.notes !== undefined) updateData.observacoes = quota.notes;
    
    // Map status from English to Portuguese
    if (quota.status !== undefined) {
      const statusMap: Record<string, string> = {
        'pending': 'pendente',
        'approved': 'aprovado',
        'rejected': 'rejeitado'
      };
      updateData.status = statusMap[quota.status] || quota.status;
    }
    
    if (quota.approved_by !== undefined) {
      updateData.aprovado_por = quota.approved_by;
      if (quota.status === 'approved' || quota.status === 'rejected') {
        updateData.data_aprovacao = new Date().toISOString();
      }
    }

    if (Object.keys(updateData).length === 0) return false;

    const { error } = await supabase
      .from('artist_quota_payments')
      .update(updateData)
      .eq('id', id);

    return !error;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('artist_quota_payments')
      .delete()
      .eq('id', id);

    return !error;
  }

  async getArtistStats(artistId: string): Promise<{
    total_quotas: number;
    pending_quotas: number;
    approved_quotas: number;
    rejected_quotas: number;
    total_amount_paid: number;
  }> {
    const { data, error } = await supabase
      .from('artist_quota_payments')
      .select('status, valor')
      .eq('artist_id', artistId);

    if (error || !data) {
      return {
        total_quotas: 0,
        pending_quotas: 0,
        approved_quotas: 0,
        rejected_quotas: 0,
        total_amount_paid: 0
      };
    }

    return {
      total_quotas: data.length,
      pending_quotas: data.filter(q => q.status === 'pendente').length,
      approved_quotas: data.filter(q => q.status === 'aprovado').length,
      rejected_quotas: data.filter(q => q.status === 'rejeitado').length,
      total_amount_paid: data
        .filter(q => q.status === 'aprovado')
        .reduce((sum, q) => sum + (parseFloat(q.valor) || 0), 0)
    };
  }
}

export default new ArtistQuotaModel();
