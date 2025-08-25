import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
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
    required: [true, 'Date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Reservation date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Time is required'],
    // TODO: the allowed time slots are dynamic, so we need to comment this out for now
    // enum: {
    //   values: ['6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'],
    //   message: 'Please select a valid time slot'
    // }
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
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  tableNumber: {
    type: Number,
    min: 1
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [200, 'Notes cannot exceed 200 characters']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for formatted date
reservationSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time
reservationSchema.virtual('formattedTime').get(function() {
  return this.time;
});

// Index for efficient queries
reservationSchema.index({ date: 1, time: 1, status: 1 });
reservationSchema.index({ email: 1 });
reservationSchema.index({ status: 1 });

// Pre-save middleware to validate date and time combination
reservationSchema.pre('save', function(next) {
  // Check if the date is a valid day (not Sunday for example)
  const dayOfWeek = this.date.getDay();
  if (dayOfWeek === 0) { // Sunday
    this.invalidate('date', 'We are closed on Sundays');
  }
  
  // Check if the time is within business hours
  const hour = parseInt(this.time.split(':')[0]);
  const isPM = this.time.includes('PM');
  const actualHour = isPM && hour !== 12 ? hour + 12 : hour;
  
  if (actualHour < 18 || actualHour > 21) { // 6 PM to 9 PM
    this.invalidate('time', 'Please select a time between 6:00 PM and 9:00 PM');
  }
  
  next();
});

// Static method to check availability
reservationSchema.statics.checkAvailability = async function(date, time, guests) {
  const existingReservations = await this.find({
    date: date,
    time: time,
    status: { $in: ['pending', 'confirmed'] }
  });
  
  const totalGuests = existingReservations.reduce((sum, res) => sum + res.guests, 0);
  const maxCapacity = 50; // Assuming 50 is the maximum capacity
  
  return {
    available: (totalGuests + guests) <= maxCapacity,
    currentOccupancy: totalGuests,
    remainingCapacity: maxCapacity - totalGuests
  };
};

// Instance method to confirm reservation
reservationSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

// Instance method to cancel reservation
reservationSchema.methods.cancel = function() {
  this.status = 'cancelled';
  return this.save();
};

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;
