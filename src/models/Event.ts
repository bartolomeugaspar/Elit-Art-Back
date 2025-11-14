import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  title: string
  description: string
  fullDescription?: string
  category: 'Workshop' | 'Exposição' | 'Masterclass' | 'Networking'
  date: string
  time: string
  location: string
  image: string
  images?: string[]
  capacity: number
  attendees: number
  availableSpots: number
  price: number
  isFree: boolean
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  organizer: mongoose.Types.ObjectId
  registrations: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: [true, 'Please provide an event title'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    fullDescription: {
      type: String,
      maxlength: [5000, 'Full description cannot be more than 5000 characters'],
    },
    category: {
      type: String,
      enum: ['Workshop', 'Exposição', 'Masterclass', 'Networking'],
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Please provide an event date'],
    },
    time: {
      type: String,
      required: [true, 'Please provide an event time'],
    },
    location: {
      type: String,
      required: [true, 'Please provide an event location'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an event image'],
    },
    images: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide event capacity'],
      min: [1, 'Capacity must be at least 1'],
    },
    attendees: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableSpots: {
      type: Number,
      default: function (this: IEvent) {
        return this.capacity - this.attendees
      },
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    isFree: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    registrations: {
      type: [Schema.Types.ObjectId],
      ref: 'Registration',
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Update availableSpots before saving
eventSchema.pre('save', function (next) {
  this.availableSpots = this.capacity - this.attendees
  next()
})

export default mongoose.model<IEvent>('Event', eventSchema)
