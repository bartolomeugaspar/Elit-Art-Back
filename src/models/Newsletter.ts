import mongoose, { Schema, Document } from 'mongoose'

export interface INewsletter extends Document {
  email: string
  isSubscribed: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    isSubscribed: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<INewsletter>('Newsletter', newsletterSchema)
