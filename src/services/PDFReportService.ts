import PDFDocument from 'pdfkit'
import { Response } from 'express'
import {
  FinancialOverview,
  EventFinancialSummary,
  MonthlyRevenue,
  QuotaPaymentOverview,
  QuotaPaymentSummary,
} from './FinancialReportService'

export class PDFReportService {
  /**
   * Gera PDF do relatório financeiro completo
   */
  static async generateFinancialReport(
    res: Response,
    overview: FinancialOverview,
    eventSummaries: EventFinancialSummary[],
    monthlyRevenue: MonthlyRevenue[],
    quotasOverview?: QuotaPaymentOverview,
    quotaPayments?: QuotaPaymentSummary[],
    startDate?: string,
    endDate?: string
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50 })

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`
    )

    // Pipe the PDF to the response
    doc.pipe(res)

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text("Elit'Arte - Relatório Financeiro", {
      align: 'center',
    })

    doc.moveDown()

    // Date range
    if (startDate || endDate) {
      doc.fontSize(10).font('Helvetica')
      const dateText = `Período: ${startDate || 'Início'} até ${endDate || 'Hoje'}`
      doc.text(dateText, { align: 'center' })
    }

    doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, {
      align: 'center',
    })

    doc.moveDown(2)

    // ============== RESUMO GERAL ==============
    doc.fontSize(16).font('Helvetica-Bold').text('Resumo Geral', { underline: true })
    doc.moveDown()

    doc.fontSize(11).font('Helvetica')

    const generalData = [
      ['Total de Inscrições:', overview.total_registrations.toString()],
      ['Inscrições Confirmadas:', overview.confirmed_registrations.toString()],
      ['Inscrições Pendentes:', overview.pending_registrations.toString()],
      ['Eventos com Receita:', overview.events_with_revenue.toString()],
      ['Receita Total:', this.formatCurrency(overview.total_revenue)],
      ['Receita Confirmada:', this.formatCurrency(overview.confirmed_revenue)],
      ['Receita Pendente:', this.formatCurrency(overview.pending_revenue)],
    ]

    this.drawTable(doc, generalData, 100, doc.y)

    doc.moveDown(2)

    // ============== PAGAMENTOS DE QUOTAS ==============
    if (quotasOverview) {
      doc.fontSize(16).font('Helvetica-Bold').text('Pagamentos de Quotas de Artistas', {
        underline: true,
      })
      doc.moveDown()

      doc.fontSize(11).font('Helvetica')

      const quotasData = [
        ['Total de Pagamentos:', quotasOverview.total_payments.toString()],
        ['Pagamentos Pendentes:', quotasOverview.pending_payments.toString()],
        ['Pagamentos Aprovados:', quotasOverview.approved_payments.toString()],
        ['Pagamentos Rejeitados:', quotasOverview.rejected_payments.toString()],
        ['Valor Total:', this.formatCurrency(quotasOverview.total_amount)],
        ['Valor Aprovado:', this.formatCurrency(quotasOverview.approved_amount)],
        ['Valor Pendente:', this.formatCurrency(quotasOverview.pending_amount)],
        ['Valor Rejeitado:', this.formatCurrency(quotasOverview.rejected_amount)],
      ]

      this.drawTable(doc, quotasData, 100, doc.y)

      doc.moveDown(2)

      // Detalhes dos pagamentos de quotas
      if (quotaPayments && quotaPayments.length > 0) {
        this.checkPageBreak(doc)

        doc.fontSize(14).font('Helvetica-Bold').text('Detalhes dos Pagamentos de Quotas', {
          underline: true,
        })
        doc.moveDown()

        quotaPayments.forEach((payment, index) => {
          this.checkPageBreak(doc, 120)

          doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${payment.artist_name}`)
          doc.fontSize(10).font('Helvetica')
          doc.text(`Email: ${payment.artist_email}`)
          doc.text(`Mês de Referência: ${this.formatMonthYear(payment.mes_referencia)}`)
          doc.text(`Valor: ${this.formatCurrency(payment.valor)}`)
          doc.text(`Método de Pagamento: ${payment.metodo_pagamento}`)
          doc.text(`Status: ${this.translateStatus(payment.status)}`)
          doc.text(`Data de Envio: ${new Date(payment.data_envio).toLocaleDateString('pt-PT')}`)

          if (payment.data_aprovacao) {
            doc.text(
              `Data de Aprovação: ${new Date(payment.data_aprovacao).toLocaleDateString('pt-PT')}`
            )
          }

          if (payment.aprovado_por_nome) {
            doc.text(`Aprovado por: ${payment.aprovado_por_nome}`)
          }

          if (payment.observacoes) {
            doc.text(`Observações: ${payment.observacoes}`)
          }

          if (payment.notas_admin) {
            doc.text(`Notas do Admin: ${payment.notas_admin}`)
          }

          doc.moveDown()
        })
      }
    }

    // ============== RECEITAS MENSAIS ==============
    this.checkPageBreak(doc)

    doc.fontSize(16).font('Helvetica-Bold').text('Receitas Mensais', { underline: true })
    doc.moveDown()

    monthlyRevenue.forEach((month) => {
      this.checkPageBreak(doc)

      doc.fontSize(12).font('Helvetica-Bold').text(`${month.month} ${month.year}`)
      doc.fontSize(10).font('Helvetica')
      doc.text(`Inscrições: ${month.registrations_count}`)
      doc.text(`Receita Total: ${this.formatCurrency(month.total_revenue)}`)
      doc.text(`Receita Confirmada: ${this.formatCurrency(month.confirmed_revenue)}`)
      doc.moveDown()
    })

    // ============== RESUMO POR EVENTO ==============
    if (eventSummaries.length > 0) {
      doc.addPage()

      doc.fontSize(16).font('Helvetica-Bold').text('Resumo por Evento', { underline: true })
      doc.moveDown()

      eventSummaries.forEach((event) => {
        this.checkPageBreak(doc, 150)

        doc.fontSize(12).font('Helvetica-Bold').text(event.event_title)
        doc.fontSize(10).font('Helvetica')
        doc.text(`Data: ${new Date(event.event_date).toLocaleDateString('pt-PT')}`)
        doc.text(`Categoria: ${event.event_category}`)
        doc.text(`Preço: ${this.formatCurrency(event.event_price)}`)
        doc.text(`Total de Inscrições: ${event.total_registrations}`)
        doc.text(`Confirmadas: ${event.confirmed_registrations}`)
        doc.text(`Pendentes: ${event.pending_registrations}`)
        doc.text(`Canceladas: ${event.cancelled_registrations}`)
        doc.text(`Receita Total: ${this.formatCurrency(event.total_revenue)}`)
        doc.text(`Receita Confirmada: ${this.formatCurrency(event.confirmed_revenue)}`)
        doc.text(`Receita Pendente: ${this.formatCurrency(event.pending_revenue)}`)
        doc.moveDown(1.5)
      })
    }

    // Finalize the PDF
    doc.end()
  }

  /**
   * Gera PDF apenas dos pagamentos de quotas
   */
  static async generateQuotasReport(
    res: Response,
    overview: QuotaPaymentOverview,
    payments: QuotaPaymentSummary[],
    startDate?: string,
    endDate?: string
  ): Promise<void> {
    const doc = new PDFDocument({ margin: 50 })

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=relatorio-quotas-${new Date().toISOString().split('T')[0]}.pdf`
    )

    doc.pipe(res)

    // Title
    doc.fontSize(20).font('Helvetica-Bold').text("Elit'Arte - Relatório de Quotas de Artistas", {
      align: 'center',
    })

    doc.moveDown()

    if (startDate || endDate) {
      doc.fontSize(10).font('Helvetica')
      const dateText = `Período: ${startDate || 'Início'} até ${endDate || 'Hoje'}`
      doc.text(dateText, { align: 'center' })
    }

    doc.fontSize(10).text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, {
      align: 'center',
    })

    doc.moveDown(2)

    // Resumo
    doc.fontSize(16).font('Helvetica-Bold').text('Resumo Geral', { underline: true })
    doc.moveDown()

    doc.fontSize(11).font('Helvetica')

    const quotasData = [
      ['Total de Pagamentos:', overview.total_payments.toString()],
      ['Pagamentos Pendentes:', overview.pending_payments.toString()],
      ['Pagamentos Aprovados:', overview.approved_payments.toString()],
      ['Pagamentos Rejeitados:', overview.rejected_payments.toString()],
      ['Valor Total:', this.formatCurrency(overview.total_amount)],
      ['Valor Aprovado:', this.formatCurrency(overview.approved_amount)],
      ['Valor Pendente:', this.formatCurrency(overview.pending_amount)],
      ['Valor Rejeitado:', this.formatCurrency(overview.rejected_amount)],
    ]

    this.drawTable(doc, quotasData, 100, doc.y)

    doc.moveDown(2)

    // Detalhes
    if (payments.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').text('Detalhes dos Pagamentos', { underline: true })
      doc.moveDown()

      payments.forEach((payment, index) => {
        this.checkPageBreak(doc, 120)

        doc.fontSize(11).font('Helvetica-Bold').text(`${index + 1}. ${payment.artist_name}`)
        doc.fontSize(10).font('Helvetica')
        doc.text(`Email: ${payment.artist_email}`)
        doc.text(`Mês de Referência: ${this.formatMonthYear(payment.mes_referencia)}`)
        doc.text(`Valor: ${this.formatCurrency(payment.valor)}`)
        doc.text(`Método de Pagamento: ${payment.metodo_pagamento}`)
        doc.text(`Status: ${this.translateStatus(payment.status)}`)
        doc.text(`Data de Envio: ${new Date(payment.data_envio).toLocaleDateString('pt-PT')}`)

        if (payment.data_aprovacao) {
          doc.text(
            `Data de Aprovação: ${new Date(payment.data_aprovacao).toLocaleDateString('pt-PT')}`
          )
        }

        if (payment.aprovado_por_nome) {
          doc.text(`Aprovado por: ${payment.aprovado_por_nome}`)
        }

        if (payment.observacoes) {
          doc.text(`Observações: ${payment.observacoes}`)
        }

        if (payment.notas_admin) {
          doc.text(`Notas do Admin: ${payment.notas_admin}`)
        }

        doc.moveDown()
      })
    } else {
      doc.fontSize(11).font('Helvetica').text('Nenhum pagamento encontrado no período.')
    }

    doc.end()
  }

  // ============== HELPER FUNCTIONS ==============

  /**
   * Formata valor em moeda
   */
  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(value)
  }

  /**
   * Formata mês e ano
   */
  private static formatMonthYear(dateString: string): string {
    const [year, month] = dateString.split('-')
    const date = new Date(parseInt(year), parseInt(month) - 1)
    return date.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })
  }

  /**
   * Traduz status
   */
  private static translateStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      pendente: 'Pendente',
      aprovado: 'Aprovado',
      rejeitado: 'Rejeitado',
      completed: 'Completo',
      pending: 'Pendente',
      pending_approval: 'Aguardando Aprovação',
      cancelled: 'Cancelado',
    }
    return statusMap[status] || status
  }

  /**
   * Verifica se precisa de quebra de página
   */
  private static checkPageBreak(doc: PDFKit.PDFDocument, requiredSpace = 100): void {
    if (doc.y > doc.page.height - doc.page.margins.bottom - requiredSpace) {
      doc.addPage()
    }
  }

  /**
   * Desenha uma tabela simples
   */
  private static drawTable(
    doc: PDFKit.PDFDocument,
    data: string[][],
    startX: number,
    startY: number
  ): void {
    const lineHeight = 20
    let currentY = startY

    data.forEach((row) => {
      doc.font('Helvetica-Bold').text(row[0], startX, currentY, { continued: true, width: 200 })
      doc.font('Helvetica').text(row[1], { align: 'left' })
      currentY += lineHeight
    })
  }
}
