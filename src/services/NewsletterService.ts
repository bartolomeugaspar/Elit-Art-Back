import { supabase } from '../config/database'
import { INewsletter, INewsletterInput } from '../models/Newsletter'

export class NewsletterService {
  static async subscribe(email: string): Promise<INewsletter> {
    // Check if subscriber exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter')
      .select('*')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      if (existingSubscriber.isSubscribed) {
        throw new Error('Email already subscribed')
      }
      // Resubscribe
      const { data: subscriber, error } = await supabase
        .from('newsletter')
        .update({
          isSubscribed: true,
          subscribedAt: new Date(),
          unsubscribedAt: null,
        })
        .eq('email', email)
        .select()
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return subscriber
    }

    // Create new subscriber
    const { data: subscriber, error } = await supabase
      .from('newsletter')
      .insert({
        email,
        isSubscribed: true,
        subscribedAt: new Date(),
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    return subscriber
  }

  static async unsubscribe(email: string): Promise<INewsletter | null> {
    const { data: subscriber, error } = await supabase
      .from('newsletter')
      .update({
        isSubscribed: false,
        unsubscribedAt: new Date(),
      })
      .eq('email', email)
      .select()
      .single()

    if (error) {
      return null
    }

    return subscriber
  }

  static async getSubscribers(): Promise<INewsletter[]> {
    const { data: subscribers, error } = await supabase
      .from('newsletter')
      .select('*')
      .eq('isSubscribed', true)

    if (error) {
      throw new Error(error.message)
    }

    return subscribers || []
  }

  static async getSubscriberCount(): Promise<number> {
    const { count, error } = await supabase
      .from('newsletter')
      .select('*', { count: 'exact', head: true })
      .eq('isSubscribed', true)

    if (error) {
      throw new Error(error.message)
    }

    return count || 0
  }
}
