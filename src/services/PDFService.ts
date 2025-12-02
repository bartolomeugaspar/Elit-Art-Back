import PDFDocument from 'pdfkit';
import { IEvent } from '../models/Event';
import { IRegistration } from '../models/Registration';
import axios from 'axios';

export class PDFService {
  static async generateEventRegistrationsPDF(
    event: IEvent,
    registrations: IRegistration[]
  ): Promise<PDFKit.PDFDocument> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Lista de Inscritos - ${event.title}`,
        Author: 'ELIT\'ARTE',
        Subject: 'Lista de Participantes',
      }
    });

    // Header com logo/título
    try {
      const response = await axios.get('https://elit-arte.vercel.app/icon.jpeg', {
        responseType: 'arraybuffer'
      });
      const imageBuffer = Buffer.from(response.data);
      
      // Adicionar logo centralizado
      doc.image(imageBuffer, (doc.page.width - 80) / 2, 40, {
        width: 80,
        height: 80
      });
      doc.moveDown(6);
    } catch (error) {
      console.error('Erro ao carregar logo:', error);
      // Fallback para texto se a imagem falhar
      doc
        .fontSize(20)
        .fillColor('#8B4513')
        .text('ELIT\'ARTE', { align: 'center' })
        .moveDown(0.5);
    }

    doc
      .fontSize(16)
      .fillColor('#2D1810')
      .text('Lista de Inscritos', { align: 'center' })
      .moveDown(1);

    // Informações do Evento
    doc
      .fontSize(14)
      .fillColor('#654321')
      .text('Informações do Evento', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .fillColor('#2D1810')
      .text(`Evento: ${event.title}`, { continued: false })
      .text(`Categoria: ${event.category}`)
      .text(`Data: ${new Date(event.date).toLocaleDateString('pt-BR')}`)
      .text(`Hora: ${event.time || 'Não especificada'}`)
      .text(`Local: ${event.location}`)
      .text(`Capacidade: ${event.capacity} participantes`)
      .text(`Inscritos: ${registrations.length} participantes`)
      .moveDown(1.5);

    // Linha separadora
    doc
      .strokeColor('#DAA520')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1);

    // Título da lista
    doc
      .fontSize(14)
      .fillColor('#654321')
      .text('Lista de Participantes', { underline: true })
      .moveDown(0.5);

    // Cabeçalho da tabela
    const tableTop = doc.y;
    const colWidths = {
      num: 40,
      name: 180,
      email: 160,
      phone: 100,
      status: 80
    };

    doc
      .fontSize(10)
      .fillColor('#FFFFFF')
      .rect(50, tableTop, 500, 25)
      .fill('#8B4513');

    doc
      .fillColor('#FFFFFF')
      .text('#', 55, tableTop + 8, { width: colWidths.num })
      .text('Nome', 95, tableTop + 8, { width: colWidths.name })
      .text('Email', 275, tableTop + 8, { width: colWidths.email })
      .text('Telefone', 435, tableTop + 8, { width: colWidths.phone });

    let yPos = tableTop + 35;

    // Adicionar participantes
    registrations.forEach((registration, index) => {
      // Verificar se precisa de nova página
      if (yPos > 720) {
        doc.addPage();
        yPos = 50;
      }

      // Linha alternada
      if (index % 2 === 0) {
        doc
          .rect(50, yPos - 5, 500, 25)
          .fill('#F5F5F5');
      }

      // Dados do participante
      doc
        .fontSize(9)
        .fillColor('#2D1810')
        .text(String(index + 1), 55, yPos, { width: colWidths.num })
        .text(registration.full_name || 'N/A', 95, yPos, { 
          width: colWidths.name,
          ellipsis: true 
        })
        .text(registration.email || 'N/A', 275, yPos, { 
          width: colWidths.email,
          ellipsis: true 
        })
        .text(registration.phone_number || 'N/A', 435, yPos, { 
          width: colWidths.phone 
        });

      yPos += 25;
    });

    // Rodapé
    doc
      .moveDown(2)
      .fontSize(10)
      .fillColor('#654321')
      .text(
        `Documento gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
        50,
        750,
        { align: 'center' }
      );

    doc
      .fontSize(8)
      .fillColor('#8B4513')
      .text('© 2025 Elit\'Arte - Todos os direitos reservados', 50, 765, { align: 'center' });

    return doc;
  }

  static async generateEventRegistrationsDetailedPDF(
    event: IEvent,
    registrations: IRegistration[]
  ): Promise<PDFKit.PDFDocument> {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Lista Detalhada de Inscritos - ${event.title}`,
        Author: 'Elit\'Arte',
        Subject: 'Lista Detalhada de Participantes',
      }
    });

    // Header
    try {
      const response = await axios.get('https://elit-arte.vercel.app/icon.jpeg', {
        responseType: 'arraybuffer'
      });
      const imageBuffer = Buffer.from(response.data);
      
      // Adicionar logo centralizado
      doc.image(imageBuffer, (doc.page.width - 100) / 2, 40, {
        width: 100,
        height: 100
      });
      doc.moveDown(7);
    } catch (error) {
      console.error('Erro ao carregar logo:', error);
      // Fallback para texto se a imagem falhar
      doc
        .fontSize(24)
        .fillColor('#8B4513')
        .text('Elit\'Arte', { align: 'center' })
        .moveDown(0.5);
    }

    doc
      .fontSize(18)
      .fillColor('#2D1810')
      .text('Lista Detalhada de Inscritos', { align: 'center' })
      .moveDown(1);

    // Informações do Evento
    doc
      .fontSize(14)
      .fillColor('#654321')
      .text('Informações do Evento', { underline: true })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .fillColor('#2D1810')
      .text(`Evento: ${event.title}`)
      .text(`Categoria: ${event.category}`)
      .text(`Data: ${new Date(event.date).toLocaleDateString('pt-BR')}`)
      .text(`Hora: ${event.time || 'Não especificada'}`)
      .text(`Local: ${event.location}`)
      .text(`Total de Inscritos: ${registrations.length}`)
      .moveDown(1.5);

    // Participantes (um por página ou seção)
    registrations.forEach((registration, index) => {
      if (index > 0) {
        doc
          .strokeColor('#DAA520')
          .lineWidth(1)
          .moveTo(50, doc.y)
          .lineTo(550, doc.y)
          .stroke()
          .moveDown(1);
      }

      // Verificar se precisa de nova página
      if (doc.y > 650) {
        doc.addPage();
      }

      doc
        .fontSize(12)
        .fillColor('#8B4513')
        .text(`Participante ${index + 1}`, { underline: true })
        .moveDown(0.5);

      doc
        .fontSize(10)
        .fillColor('#2D1810')
        .text(`Nome: ${registration.full_name || 'N/A'}`)
        .text(`Email: ${registration.email || 'N/A'}`)
        .text(`Telefone: ${registration.phone_number || 'N/A'}`)
        .text(`Status: ${registration.status === 'registered' ? 'Registrado' : registration.status === 'attended' ? 'Participou' : 'Cancelado'}`)
        .text(`Data de Inscrição: ${new Date(registration.created_at).toLocaleDateString('pt-BR')} às ${new Date(registration.created_at).toLocaleTimeString('pt-BR')}`)
        .moveDown(1);
    });

    // Rodapé
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(8)
        .fillColor('#654321')
        .text(
          `Página ${i + 1} de ${pageCount} | Gerado em ${new Date().toLocaleDateString('pt-BR')}`,
          50,
          760,
          { align: 'center' }
        );
    }

    return doc;
  }
}
