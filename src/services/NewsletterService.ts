import Newsletter, { INewsletter } from '../models/Newsletter'

export class NewsletterService {
  static async subscribe(email: string): Promise<INewsletter> {
    let subscriber = await Newsletter.findOne({ email })

    if (subscriber) {
      if (subscriber.isSubscribed) {
        throw new Error('Email already subscribed')
      }
      subscriber.isSubscribed = true
      subscriber.subscribedAt = new Date()
      subscriber.unsubscribedAt = undefined
      await subscriber.save()
      return subscriber
    }

    subscriber = new Newsletter({
      email,
      isSubscribed: true,
      subscribedAt: new Date(),
    })

    await subscriber.save()
    return subscriber
  }

  static async unsubscribe(email: string): Promise<INewsletter | null> {
    return await Newsletter.findOneAndUpdate(
      { email },
      {
        isSubscribed: false,
        unsubscribedAt: new Date(),
      },
      { new: true }
    )
  }

  static async getSubscribers(): Promise<INewsletter[]> {
    return await Newsletter.find({ isSubscribed: true })
  }

  static async getSubscriberCount(): Promise<number> {
    return await Newsletter.countDocuments({ isSubscribed: true })
  }
}
