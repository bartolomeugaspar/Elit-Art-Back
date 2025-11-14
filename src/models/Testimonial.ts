import mongoose, { Schema, Document } from 'mongoose'

export interface ITestimonial extends Document {
  author: mongoose.Types.ObjectId
  event: mongoose.Types.ObjectId
  rating: number
  comment: string
  isApproved: boolean
  createdAt: Date
  updatedAt: Date
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Please provide a comment'],
      maxlength: [1000, 'Comment cannot be more than 1000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<ITestimonial>('Testimonial', testimonialSchema)
