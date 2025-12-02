import { supabase } from '../config/database'
import { IEvent, IEventInput, calculateAvailableSpots } from '../models/Event'
import { IRegistration, IRegistrationInput } from '../models/Registration'
import { ITestimonial, ITestimonialInput } from '../models/Testimonial'
import { EmailService } from './EmailService'
import { SMSService } from './SMSService'
import { ValidationError, ConflictError, NotFoundError } from '../utils/errors'

export class EventService {
  // Helper function to determine event status based on date
  private static getEventStatus(eventDate: string): 'upcoming' | 'ongoing' | 'completed' {
    const event = new Date(eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (event < today) {
      return 'completed'
    }
    return 'upcoming'
  }

  // Calculate event status based on current date (without updating DB)
  private static calculateEventStatus(event: IEvent): IEvent {
    const newStatus = this.getEventStatus(event.date)
    
    // If status is cancelled, keep it
    if (event.status === 'cancelled') {
      return event
    }
    
    // Return event with calculated status
    return {
      ...event,
      status: newStatus
    }
  }

  static async createEvent(eventData: IEventInput): Promise<IEvent> {
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Enviar notificações para todos os inscritos da newsletter
    try {
      const { NewsletterService } = await import('./NewsletterService')
      const subscribers = await NewsletterService.getSubscribers()
      
      if (subscribers.length > 0) {
        const subscriberEmails = subscribers.map(sub => sub.email)
        
        // Formatar data e hora para exibição
        const eventDate = new Date(event.date).toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        const eventTime = event.time || 'A definir'
        
        // Enviar emails em background (não esperar conclusão)
        EmailService.sendBulkNewEventNotifications(
          subscriberEmails,
          event.title,
          event.description,
          eventDate,
          eventTime,
          event.location,
          event.category,
          event.image_url,
          event.price,
          event.is_free
        ).catch(error => {
          console.error('Erro ao enviar notificações em massa:', error)
        })
        
        console.log(`✅ Evento criado! Notificações sendo enviadas para ${subscribers.length} inscritos...`)
      }
    } catch (error) {
      console.error('Erro ao processar notificações de newsletter:', error)
      // Não bloquear a criação do evento se houver erro nas notificações
    }

    return event
  }

  static async getEvents(filters?: { category?: string; status?: string }): Promise<IEvent[]> {
    let query = supabase.from('events').select('*')

    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    const { data: events, error } = await query.order('date', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    // Calculate status for each event based on current date
    const updatedEvents = (events || []).map(event => this.calculateEventStatus(event))

    return updatedEvents
  }

  static async getEventById(id: string): Promise<IEvent | null> {
    const { data: event, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    // Calculate status if needed
    return this.calculateEventStatus(event)
  }

  static async updateEvent(id: string, updates: Partial<IEvent>): Promise<IEvent | null> {
    const { data: event, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return null
    }

    return event
  }

  static async deleteEvent(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    return !error
  }

  static async searchEvents(searchQuery: string): Promise<IEvent[]> {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`)

    if (error) {
      throw new Error(error.message)
    }

    return events || []
  }

  static async registerUserForEvent(
    userId: string | undefined,
    eventId: string,
    registrationData?: {
      full_name?: string
      email?: string
      phone_number?: string
      payment_method?: string
      proof_url?: string
    }
  ): Promise<IRegistration> {
    // Get event
    const event = await this.getEventById(eventId)
    if (!event) {
      throw new NotFoundError('Event not found')
    }

    // Validate available spots
    if (event.available_spots <= 0 || event.attendees >= event.capacity) {
      throw new ValidationError('No available spots for this event')
    }

    // Check for existing registration by name to prevent duplicates
    if (registrationData?.full_name) {
      const { data: existingRegistration } = await supabase
        .from('registrations')
        .select('id')
        .eq('full_name', registrationData.full_name)
        .eq('event_id', eventId)
        .single()

      if (existingRegistration) {
        throw new ConflictError('Este nome já está registrado para este evento. Você pode se inscrever em outros eventos, mas apenas uma vez por evento.')
      }
    }

    // Determine payment status based on event type and provided data
    let paymentStatus: 'completed' | 'pending' | 'failed' = 'completed'
    if (!event.is_free) {
      // If event is not free and payment proof is provided, set to pending
      if (registrationData?.proof_url) {
        paymentStatus = 'pending'
      } else {
        paymentStatus = 'pending'
      }
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        payment_status: paymentStatus,
        full_name: registrationData?.full_name,
        email: registrationData?.email,
        phone_number: registrationData?.phone_number,
        payment_method: registrationData?.payment_method,
        proof_url: registrationData?.proof_url,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Update event attendees - ensure it doesn't exceed capacity
    const newAttendees = Math.min(event.attendees + 1, event.capacity)
    await this.updateEvent(eventId, {
      attendees: newAttendees,
      available_spots: calculateAvailableSpots(event.capacity, newAttendees),
    })

    // Send registration confirmation email
    if (registration.email && registration.full_name) {
      try {
        await EmailService.sendRegistrationEmail(
          registration.email,
          registration.full_name,
          event.title,
          event.date,
          event.time,
          event.location
        )
      } catch (emailError) {
        // Don't throw error, just log it - the registration was created successfully
      }
    }

    // Send registration SMS if phone number is provided
    if (registration.phone_number && registration.full_name) {
      try {
        await SMSService.sendRegistrationSMS(
          registration.phone_number,
          registration.full_name,
          event.title,
          event.date,
          event.time,
          event.location
        )
      } catch (smsError) {
        // Don't throw error, just log it - the registration was created successfully
      }
    }

    return registration
  }

  static async cancelRegistration(registrationId: string): Promise<boolean> {
    // Get registration
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('*')
      .eq('id', registrationId)
      .single()

    if (regError || !registration) {
      throw new Error('Registration not found')
    }

    // Update registration status
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ status: 'cancelled' })
      .eq('id', registrationId)

    if (updateError) {
      throw new Error(updateError.message)
    }

    // Update event attendees
    const event = await this.getEventById(registration.event_id)
    if (event) {
      const newAttendees = Math.max(0, event.attendees - 1)
      await this.updateEvent(registration.event_id, {
        attendees: newAttendees,
        available_spots: calculateAvailableSpots(event.capacity, newAttendees),
      })
    }

    return true
  }

  static async getEventRegistrations(eventId: string): Promise<IRegistration[]> {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .order('registration_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return registrations || []
  }

  static async getUserRegistrations(userId: string): Promise<IRegistration[]> {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('user_id', userId)
      .order('registration_date', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return registrations || []
  }

  static async addTestimonial(
    userId: string,
    eventId: string,
    rating: number,
    comment: string
  ): Promise<ITestimonial> {
    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .insert({
        authorId: userId,
        eventId,
        rating,
        comment,
        isApproved: false,
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return testimonial
  }

  static async getEventTestimonials(eventId: string): Promise<ITestimonial[]> {
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('eventId', eventId)
      .eq('isApproved', true)
      .order('createdAt', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return testimonials || []
  }

  static async approveTestimonial(testimonialId: string): Promise<ITestimonial | null> {
    const { data: testimonial, error } = await supabase
      .from('testimonials')
      .update({ isApproved: true })
      .eq('id', testimonialId)
      .select()
      .single()

    if (error) {
      return null
    }

    return testimonial
  }
}
