import { supabase } from '../config/database'

export interface EventFinancialSummary {
  event_id: string
  event_title: string
  event_date: string
  event_category: string
  total_registrations: number
  confirmed_registrations: number
  pending_registrations: number
  cancelled_registrations: number
  total_revenue: number
  confirmed_revenue: number
  pending_revenue: number
  event_price: number
}

export interface FinancialOverview {
  total_revenue: number
  confirmed_revenue: number
  pending_revenue: number
  total_registrations: number
  confirmed_registrations: number
  pending_registrations: number
  events_with_revenue: number
}

export interface MonthlyRevenue {
  month: string
  year: number
  total_revenue: number
  confirmed_revenue: number
  registrations_count: number
}

export interface QuotaPaymentSummary {
  payment_id: string
  artist_id: string
  artist_name: string
  artist_email: string
  valor: number
  mes_referencia: string
  metodo_pagamento: string
  status: string
  data_envio: string
  data_aprovacao?: string
  aprovado_por_nome?: string
  observacoes?: string
  notas_admin?: string
}

export interface QuotaPaymentOverview {
  total_payments: number
  pending_payments: number
  approved_payments: number
  rejected_payments: number
  total_amount: number
  approved_amount: number
  pending_amount: number
  rejected_amount: number
}

export class FinancialReportService {
  /**
   * Obtém o resumo financeiro geral
   */
  static async getFinancialOverview(
    startDate?: string,
    endDate?: string
  ): Promise<FinancialOverview> {
    let query = supabase
      .from('registrations')
      .select(`
        payment_status,
        event:events(id, title, price, date)
      `)

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: registrations, error } = await query

    if (error) throw error

    const overview: FinancialOverview = {
      total_revenue: 0,
      confirmed_revenue: 0,
      pending_revenue: 0,
      total_registrations: registrations?.length || 0,
      confirmed_registrations: 0,
      pending_registrations: 0,
      events_with_revenue: 0,
    }

    const eventsSet = new Set<string>()

    registrations?.forEach((reg: any) => {
      const price = reg.event?.price || 0

      if (reg.payment_status === 'completed') {
        overview.confirmed_revenue += price
        overview.confirmed_registrations++
      } else if (reg.payment_status === 'pending' || reg.payment_status === 'pending_approval') {
        overview.pending_revenue += price
        overview.pending_registrations++
      }

      overview.total_revenue += price

      if (price > 0) {
        eventsSet.add(reg.event?.id)
      }
    })

    overview.events_with_revenue = eventsSet.size

    return overview
  }

  /**
   * Obtém o resumo financeiro por evento
   */
  static async getEventFinancialSummary(
    startDate?: string,
    endDate?: string
  ): Promise<EventFinancialSummary[]> {
    let query = supabase
      .from('events')
      .select(`
        id,
        title,
        date,
        category,
        price,
        registrations(id, payment_status, status)
      `)
      .order('date', { ascending: false })

    if (startDate) {
      query = query.gte('date', startDate)
    }
    if (endDate) {
      query = query.lte('date', endDate)
    }

    const { data: events, error } = await query

    if (error) throw error

    const summaries: EventFinancialSummary[] = []

    events?.forEach((event: any) => {
      const registrations = event.registrations || []
      const price = event.price || 0

      const summary: EventFinancialSummary = {
        event_id: event.id,
        event_title: event.title,
        event_date: event.date,
        event_category: event.category,
        total_registrations: registrations.length,
        confirmed_registrations: 0,
        pending_registrations: 0,
        cancelled_registrations: 0,
        total_revenue: 0,
        confirmed_revenue: 0,
        pending_revenue: 0,
        event_price: price,
      }

      registrations.forEach((reg: any) => {
        if (reg.status === 'cancelled') {
          summary.cancelled_registrations++
          return
        }

        summary.total_revenue += price

        if (reg.payment_status === 'completed') {
          summary.confirmed_registrations++
          summary.confirmed_revenue += price
        } else if (reg.payment_status === 'pending' || reg.payment_status === 'pending_approval') {
          summary.pending_registrations++
          summary.pending_revenue += price
        }
      })

      summaries.push(summary)
    })

    return summaries
  }

  /**
   * Obtém receitas mensais
   */
  static async getMonthlyRevenue(year?: number): Promise<MonthlyRevenue[]> {
    const targetYear = year || new Date().getFullYear()

    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        created_at,
        payment_status,
        event:events(price)
      `)
      .gte('created_at', `${targetYear}-01-01`)
      .lte('created_at', `${targetYear}-12-31`)

    if (error) throw error

    const monthlyData: { [key: string]: MonthlyRevenue } = {}

    // Inicializar todos os meses
    for (let i = 1; i <= 12; i++) {
      const monthKey = `${targetYear}-${String(i).padStart(2, '0')}`
      monthlyData[monthKey] = {
        month: new Date(targetYear, i - 1).toLocaleString('pt-PT', { month: 'long' }),
        year: targetYear,
        total_revenue: 0,
        confirmed_revenue: 0,
        registrations_count: 0,
      }
    }

    registrations?.forEach((reg: any) => {
      const date = new Date(reg.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const price = reg.event?.price || 0

      if (monthlyData[monthKey]) {
        monthlyData[monthKey].registrations_count++
        monthlyData[monthKey].total_revenue += price

        if (reg.payment_status === 'completed') {
          monthlyData[monthKey].confirmed_revenue += price
        }
      }
    })

    return Object.values(monthlyData)
  }

  /**
   * Obtém detalhes de registros financeiros de um evento específico
   */
  static async getEventRegistrationDetails(eventId: string) {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        id,
        full_name,
        email,
        phone_number,
        payment_status,
        payment_method,
        status,
        created_at,
        event:events(id, title, price)
      `)
      .eq('event_id', eventId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return registrations
  }

  /**
   * Obtém estatísticas por método de pagamento
   */
  static async getPaymentMethodStats(startDate?: string, endDate?: string) {
    let query = supabase
      .from('registrations')
      .select(`
        payment_method,
        payment_status,
        event:events(price)
      `)
      .not('payment_method', 'is', null)

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: registrations, error } = await query

    if (error) throw error

    const stats: {
      [key: string]: {
        method: string
        total_transactions: number
        completed_transactions: number
        total_revenue: number
        confirmed_revenue: number
      }
    } = {}

    registrations?.forEach((reg: any) => {
      const method = reg.payment_method || 'Não especificado'
      const price = reg.event?.price || 0

      if (!stats[method]) {
        stats[method] = {
          method,
          total_transactions: 0,
          completed_transactions: 0,
          total_revenue: 0,
          confirmed_revenue: 0,
        }
      }

      stats[method].total_transactions++
      stats[method].total_revenue += price

      if (reg.payment_status === 'completed') {
        stats[method].completed_transactions++
        stats[method].confirmed_revenue += price
      }
    })

    return Object.values(stats)
  }

  /**
   * Obtém resumo dos pagamentos de quotas de artistas
   */
  static async getQuotaPaymentsOverview(
    startDate?: string,
    endDate?: string
  ): Promise<QuotaPaymentOverview> {
    let query = supabase
      .from('artist_quota_payments')
      .select('*')

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: payments, error } = await query

    if (error) throw error

    const overview: QuotaPaymentOverview = {
      total_payments: payments?.length || 0,
      pending_payments: 0,
      approved_payments: 0,
      rejected_payments: 0,
      total_amount: 0,
      approved_amount: 0,
      pending_amount: 0,
      rejected_amount: 0,
    }

    payments?.forEach((payment: any) => {
      const valor = parseFloat(payment.valor) || 0
      overview.total_amount += valor

      switch (payment.status) {
        case 'pendente':
          overview.pending_payments++
          overview.pending_amount += valor
          break
        case 'aprovado':
          overview.approved_payments++
          overview.approved_amount += valor
          break
        case 'rejeitado':
          overview.rejected_payments++
          overview.rejected_amount += valor
          break
      }
    })

    return overview
  }

  /**
   * Obtém lista detalhada dos pagamentos de quotas
   */
  static async getQuotaPaymentsList(
    startDate?: string,
    endDate?: string,
    status?: string
  ): Promise<QuotaPaymentSummary[]> {
    let query = supabase
      .from('artist_quota_payments')
      .select('*')
      .order('created_at', { ascending: false })

    if (startDate) {
      query = query.gte('mes_referencia', startDate)
    }
    if (endDate) {
      query = query.lte('mes_referencia', endDate)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: payments, error } = await query

    if (error) throw error

    // Buscar informações dos artistas e aprovadores separadamente
    const artistIds = [...new Set(payments?.map((p: any) => p.artist_id).filter(Boolean))]
    const approverIds = [...new Set(payments?.map((p: any) => p.aprovado_por).filter(Boolean))]
    const allUserIds = [...new Set([...artistIds, ...approverIds])]

    let usersMap: Record<string, any> = {}
    
    if (allUserIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, name, email')
        .in('id', allUserIds)
      
      if (users) {
        users.forEach((user: any) => {
          usersMap[user.id] = user
        })
      }
    }

    const summaries: QuotaPaymentSummary[] = payments?.map((payment: any) => {
      const artist = usersMap[payment.artist_id]
      const approver = usersMap[payment.aprovado_por]
      
      return {
        payment_id: payment.id,
        artist_id: payment.artist_id,
        artist_name: artist?.name || 'N/A',
        artist_email: artist?.email || 'N/A',
        valor: parseFloat(payment.valor) || 0,
        mes_referencia: payment.mes_referencia,
        metodo_pagamento: payment.metodo_pagamento || 'N/A',
        status: payment.status,
        data_envio: payment.created_at,
        data_aprovacao: payment.data_aprovacao,
        aprovado_por_nome: approver?.name,
        observacoes: payment.observacoes,
        notas_admin: payment.notas_admin,
      }
    }) || []

    return summaries
  }
}
