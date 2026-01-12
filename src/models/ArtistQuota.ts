import { supabase } from '../config/database';

export interface ArtistQuota {
  id: number;
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
  async create(quota: ArtistQuotaCreate): Promise<number> {
    const { data, error } = await supabase
      .from('artist_quotas')
      .insert({
        artist_id: quota.artist_id,
        amount: quota.amount,
        payment_date: quota.payment_date,
        payment_method: quota.payment_method || null,
        payment_reference: quota.payment_reference || null,
        proof_of_payment: quota.proof_of_payment || null,
        notes: quota.notes || null,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async findById(id: number): Promise<ArtistQuota | null> {
    const { data, error } = await supabase
      .from('artist_quotas')
      .select(`
        *,
        artist:artists(name),
        approver:users!approved_by(name)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return {
      ...data,
      artist_name: data.artist?.name,
      approved_by_name: data.approver?.name
    } as any;
  }

  async findByArtist(artistId: string): Promise<ArtistQuota[]> {
    const { data, error } = await supabase
      .from('artist_quotas')
      .select(`
        *,
        approver:users!approved_by(name)
      `)
      .eq('artist_id', artistId)
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(item => ({
      ...item,
      approved_by_name: item.approver?.name
    })) as any;
  }

  async findAll(status?: string): Promise<ArtistQuota[]> {
    let query = supabase
      .from('artist_quotas')
      .select(`
        *,
        artist:artists(name),
        approver:users!approved_by(name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error || !data) return [];

    return data.map(item => ({
      ...item,
      artist_name: item.artist?.name,
      approved_by_name: item.approver?.name
    })) as any;
  }

  async update(id: number, quota: ArtistQuotaUpdate): Promise<boolean> {
    const updateData: any = {};

    if (quota.amount !== undefined) updateData.amount = quota.amount;
    if (quota.payment_date !== undefined) updateData.payment_date = quota.payment_date;
    if (quota.payment_method !== undefined) updateData.payment_method = quota.payment_method;
    if (quota.payment_reference !== undefined) updateData.payment_reference = quota.payment_reference;
    if (quota.proof_of_payment !== undefined) updateData.proof_of_payment = quota.proof_of_payment;
    if (quota.notes !== undefined) updateData.notes = quota.notes;
    if (quota.status !== undefined) updateData.status = quota.status;
    
    if (quota.approved_by !== undefined) {
      updateData.approved_by = quota.approved_by;
      if (quota.status === 'approved' || quota.status === 'rejected') {
        updateData.approved_at = new Date().toISOString();
      }
    }

    if (Object.keys(updateData).length === 0) return false;

    const { error } = await supabase
      .from('artist_quotas')
      .update(updateData)
      .eq('id', id);

    return !error;
  }

  async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('artist_quotas')
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
      .from('artist_quotas')
      .select('status, amount')
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
      pending_quotas: data.filter(q => q.status === 'pending').length,
      approved_quotas: data.filter(q => q.status === 'approved').length,
      rejected_quotas: data.filter(q => q.status === 'rejected').length,
      total_amount_paid: data
        .filter(q => q.status === 'approved')
        .reduce((sum, q) => sum + (q.amount || 0), 0)
    };
  }
}

export default new ArtistQuotaModel();
