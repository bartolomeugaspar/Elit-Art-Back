import mongoose, { Schema, Document } from 'mongoose'

export interface IRegistration extends Document {
  user: mongoose.Types.ObjectId
  event: mongoose.Types.ObjectId
  status: 'registered' | 'attended' | 'cancelled'
  registrationDate: Date
  paymentStatus: 'pending' | 'completed' | 'failed'
  paymentMethod?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const registrationSchema = new Schema<IRegistration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered',
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
  },
  {
    timestamps: true,
  }
)

// Ensure unique registration per user per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true })

export default mongoose.model<IRegistration>('Registration', registrationSchema)
