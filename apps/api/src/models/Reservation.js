import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      // required: [true, 'Email is required'], // currently not required
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
      // validate manually in the pre-save middleware
    },
    time: {
      type: String,
      required: [true, 'Time slot is required'],
      validate: {
        validator: function (value) {
          return value.match(/^[0-9]{2}:[0-9]{2}$/)
        },
        message: 'Time slot must be in the format HH:mm'
      }
    },
    tableCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TableCategory',
      required: [true, 'Table category is required']
    },
    guests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Minimum 1 guest required'],
      max: [20, 'Maximum 20 guests allowed']
    },
    specialRequests: {
      type: String,
      trim: true,
      maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending'
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [200, 'Notes cannot exceed 200 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Virtual for formatted date
reservationSchema.virtual('formattedDate').get(function () {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Virtual for formatted time
reservationSchema.virtual('formattedTime').get(function () {
  return this.time
})

// Index for efficient queries
reservationSchema.index({ date: 1, time: 1 })
reservationSchema.index({ status: 1 })

// Pre-save middleware to validate date and time combination
reservationSchema.pre('save', function (next) {
  // check if the date is in the future
  const message = 'Reservation must be in the future'
  if (this.date < new Date()) {
    this.invalidate('date', message)
  } else if (this.date == new Date()) {
    const now = new Date()
    const [hours, minutes] = this.time.split(':').map(Number)
    if (hours < now.getHours() || (hours == now.getHours() && minutes <= now.getMinutes())) {
      this.invalidate('time', message)
    }
  }
  next()
})

// Static method to check availability
reservationSchema.statics.checkAvailability = async function (date, time, capacity = 1, guests = 1) {
  const existingReservations = await this.find({
    date: date,
    time: time,
    status: { $ne: 'cancelled' }
  })

  const totalGuests = existingReservations.reduce((sum, res) => sum + res.guests, 0)
  const maxCapacity = capacity

  return {
    available: totalGuests + guests <= maxCapacity,
    currentOccupancy: totalGuests,
    remainingCapacity: maxCapacity - totalGuests
  }
}

// Instance method to confirm reservation
reservationSchema.methods.confirm = function () {
  this.status = 'confirmed'
  return this.save()
}

// Instance method to cancel reservation
reservationSchema.methods.cancel = function () {
  this.status = 'cancelled'
  return this.save()
}

const Reservation = mongoose.model('Reservation', reservationSchema)

export default Reservation
