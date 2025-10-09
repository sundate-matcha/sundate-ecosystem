import mongoose from 'mongoose'

const reservationLogSchema = new mongoose.Schema(
  {
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: [true, 'Reservation ID is required'],
      index: true
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'confirmed', 'cancelled', 'deleted', 'status_changed'],
      required: [true, 'Action is required']
    },
    previousStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed']
    },
    newStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed']
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    metadata: {
      ipAddress: String,
      userAgent: String,
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      source: {
        type: String,
        enum: ['web', 'mobile', 'api', 'admin', 'system'],
        default: 'api'
      }
    },
    details: {
      type: String,
      trim: true,
      maxlength: [1000, 'Details cannot exceed 1000 characters']
    },
    notificationSent: {
      type: Boolean,
      default: false
    },
    notificationStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'not_applicable'],
      default: 'pending'
    },
    notificationError: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

// Indexes for efficient queries
reservationLogSchema.index({ reservationId: 1, createdAt: -1 })
reservationLogSchema.index({ action: 1 })
reservationLogSchema.index({ createdAt: -1 })
reservationLogSchema.index({ 'metadata.userId': 1 })

// Virtual for formatted timestamp
reservationLogSchema.virtual('formattedTimestamp').get(function () {
  return this.createdAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
})

// Static method to get logs for a reservation
reservationLogSchema.statics.getReservationLogs = async function (reservationId, limit = 50) {
  return this.find({ reservationId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('metadata.userId', 'email name')
}

// Static method to get recent logs
reservationLogSchema.statics.getRecentLogs = async function (limit = 100, action = null) {
  const query = {}
  if (action) {
    query.action = action
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('reservationId')
    .populate('metadata.userId', 'email name')
}

// Static method to get logs by date range
reservationLogSchema.statics.getLogsByDateRange = async function (startDate, endDate) {
  return this.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  })
    .sort({ createdAt: -1 })
    .populate('reservationId')
}

const ReservationLog = mongoose.model('ReservationLog', reservationLogSchema)

export default ReservationLog
