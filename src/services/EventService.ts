import { supabase } from '../config/database'
import { IEvent, IEventInput, calculateAvailableSpots } from '../models/Event'
import { IRegistration, IRegistrationInput } from '../models/Registration'
import { ITestimonial, ITestimonialInput } from '../models/Testimonial'

export class EventService {
  static async createEvent(eventData: IEventInput): Promise<IEvent> {
    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
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

    return events || []
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

    return event
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

  static async registerUserForEvent(userId: string, eventId: string): Promise<IRegistration> {
    // Get event
    const event = await this.getEventById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    // Validate available spots
    if (event.availableSpots <= 0 || event.attendees >= event.capacity) {
      throw new Error('No available spots for this event')
    }

    // Check existing registration
    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('userId', userId)
      .eq('eventId', eventId)
      .single()

    if (existingRegistration) {
      throw new Error('User already registered for this event')
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        userId,
        eventId,
        paymentStatus: event.isFree ? 'completed' : 'pending',
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
      availableSpots: calculateAvailableSpots(event.capacity, newAttendees),
    })

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
    const event = await this.getEventById(registration.eventId)
    if (event) {
      const newAttendees = Math.max(0, event.attendees - 1)
      await this.updateEvent(registration.eventId, {
        attendees: newAttendees,
        availableSpots: calculateAvailableSpots(event.capacity, newAttendees),
      })
    }

    return true
  }

  static async getEventRegistrations(eventId: string): Promise<IRegistration[]> {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('eventId', eventId)
      .order('registrationDate', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return registrations || []
  }

  static async getUserRegistrations(userId: string): Promise<IRegistration[]> {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .eq('userId', userId)
      .order('registrationDate', { ascending: false })

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
