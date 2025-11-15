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
      if (existingSubscriber.is_subscribed) {
        throw new Error('Email already subscribed')
      }
      // Resubscribe
      const { data: subscriber, error } = await supabase
        .from('newsletter')
        .update({
          is_subscribed: true,
          subscribed_at: new Date(),
          unsubscribed_at: null,
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
        is_subscribed: true,
        subscribed_at: new Date(),
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
        is_subscribed: false,
        unsubscribed_at: new Date(),
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
      .eq('is_subscribed', true)

    if (error) {
      throw new Error(error.message)
    }

    return subscribers || []
  }

  static async getSubscriberCount(): Promise<number> {
    const { count, error } = await supabase
      .from('newsletter')
      .select('*', { count: 'exact', head: true })
      .eq('is_subscribed', true)

    if (error) {
      throw new Error(error.message)
    }

    return count || 0
  }

  static async deleteSubscriber(id: string): Promise<void> {
    const { error } = await supabase
      .from('newsletter')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }
}
