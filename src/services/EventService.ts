import Event, { IEvent } from '../models/Event'
import Registration, { IRegistration } from '../models/Registration'
import Testimonial, { ITestimonial } from '../models/Testimonial'

export class EventService {
  static async createEvent(eventData: Partial<IEvent>): Promise<IEvent> {
    const event = new Event(eventData)
    await event.save()
    return event
  }

  static async getEvents(filters?: { category?: string; status?: string }): Promise<IEvent[]> {
    let query = Event.find()

    if (filters?.category) {
      query = query.where('category').equals(filters.category)
    }

    if (filters?.status) {
      query = query.where('status').equals(filters.status)
    }

    return await query.populate('organizer', 'name email').sort({ date: 1 })
  }

  static async getEventById(id: string): Promise<IEvent | null> {
    return await Event.findById(id)
      .populate('organizer', 'name email')
      .populate('registrations')
  }

  static async updateEvent(id: string, updates: Partial<IEvent>): Promise<IEvent | null> {
    return await Event.findByIdAndUpdate(id, updates, { new: true })
  }

  static async deleteEvent(id: string): Promise<boolean> {
    const result = await Event.findByIdAndDelete(id)
    return !!result
  }

  static async searchEvents(query: string): Promise<IEvent[]> {
    return await Event.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } },
      ],
    })
  }

  static async registerUserForEvent(userId: string, eventId: string): Promise<IRegistration> {
    const event = await Event.findById(eventId)
    if (!event) {
      throw new Error('Event not found')
    }

    if (event.availableSpots <= 0) {
      throw new Error('No available spots for this event')
    }

    const existingRegistration = await Registration.findOne({ user: userId, event: eventId })
    if (existingRegistration) {
      throw new Error('User already registered for this event')
    }

    const registration = new Registration({
      user: userId,
      event: eventId,
      paymentStatus: event.isFree ? 'completed' : 'pending',
    })

    await registration.save()

    // Update event attendees
    event.attendees += 1
    event.availableSpots = event.capacity - event.attendees
    await event.save()

    return registration
  }

  static async cancelRegistration(registrationId: string): Promise<boolean> {
    const registration = await Registration.findById(registrationId)
    if (!registration) {
      throw new Error('Registration not found')
    }

    registration.status = 'cancelled'
    await registration.save()

    // Update event attendees
    const event = await Event.findById(registration.event)
    if (event) {
      event.attendees = Math.max(0, event.attendees - 1)
      event.availableSpots = event.capacity - event.attendees
      await event.save()
    }

    return true
  }

  static async getEventRegistrations(eventId: string): Promise<IRegistration[]> {
    return await Registration.find({ event: eventId })
      .populate('user', 'name email')
      .sort({ registrationDate: -1 })
  }

  static async getUserRegistrations(userId: string): Promise<IRegistration[]> {
    return await Registration.find({ user: userId })
      .populate('event', 'title date location')
      .sort({ registrationDate: -1 })
  }

  static async addTestimonial(
    userId: string,
    eventId: string,
    rating: number,
    comment: string
  ): Promise<ITestimonial> {
    const testimonial = new Testimonial({
      author: userId,
      event: eventId,
      rating,
      comment,
    })

    await testimonial.save()
    return testimonial
  }

  static async getEventTestimonials(eventId: string): Promise<ITestimonial[]> {
    return await Testimonial.find({ event: eventId, isApproved: true })
      .populate('author', 'name profileImage')
      .sort({ createdAt: -1 })
  }

  static async approveTestimonial(testimonialId: string): Promise<ITestimonial | null> {
    return await Testimonial.findByIdAndUpdate(testimonialId, { isApproved: true }, { new: true })
  }
}
