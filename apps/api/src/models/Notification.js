import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be null for broadcast notifications
      index: true
    },
    type: {
      type: String,
      enum: [
        'reservation_created',
        'reservation_confirmed',
        'reservation_cancelled',
        'reservation_updated',
        'reservation_reminder',
        'system',
        'promotional'
      ],
      required: [true, 'Notification type is required']
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    body: {
      type: String,
      required: [true, 'Notification body is required'],
      trim: true,
      maxlength: [500, 'Body cannot exceed 500 characters']
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation'
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal'
    },
    isTimeSensitive: {
      // send as soon as possible
      type: Boolean,
      default: false
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: {
      type: Date
    },
    isSent: {
      type: Boolean,
      default: false
    },
    sentAt: {
      type: Date
    },
    isArchived: {
      type: Boolean,
      default: false
    },
    archivedAt: {
      type: Date
    },
    actionUrl: {
      type: String,
      trim: true
    },
    icon: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// Indexes for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
notificationSchema.index({ userId: 1, isArchived: 1, createdAt: -1 })
notificationSchema.index({ createdAt: -1 })
notificationSchema.index({ isTimeSensitive: 1, createdAt: -1 })

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function () {
  const now = new Date()
  const diff = now - this.createdAt
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return this.createdAt.toLocaleDateString()
})

// Instance method to mark as read
notificationSchema.methods.markAsRead = async function () {
  if (!this.isRead) {
    this.isRead = true
    this.readAt = new Date()
    return this.save()
  }
  return this
}

// Instance method to mark as unread
notificationSchema.methods.markAsUnread = async function () {
  if (this.isRead) {
    this.isRead = false
    this.readAt = null
    return this.save()
  }
  return this
}

// Instance method to archive notification
notificationSchema.methods.archive = async function () {
  if (!this.isArchived) {
    this.isArchived = true
    this.archivedAt = new Date()
    return this.save()
  }
  return this
}

// Instance method to unarchive notification
notificationSchema.methods.unarchive = async function () {
  if (this.isArchived) {
    this.isArchived = false
    this.archivedAt = null
    return this.save()
  }
  return this
}

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function (userId) {
  return this.countDocuments({
    userId,
    isRead: false,
    isArchived: false
  })
}

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = async function (
  userId,
  options = {}
) {
  const {
    page = 1,
    limit = 20,
    includeRead = true,
    includeArchived = false,
    type = null,
    prioritizeTimeSensitive = true
  } = options

  const query = { userId }

  if (!includeRead) {
    query.isRead = false
  }

  if (!includeArchived) {
    query.isArchived = false
  }

  if (type) {
    query.type = type
  }

  // Sort by time-sensitive first, then by creation date
  const sortOrder = prioritizeTimeSensitive 
    ? { isTimeSensitive: -1, createdAt: -1 }
    : { createdAt: -1 }

  const notifications = await this.find(query)
    .sort(sortOrder)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('reservationId')
    .exec()

  const total = await this.countDocuments(query)

  return {
    notifications,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
    unreadCount: await this.getUnreadCount(userId)
  }
}

// Static method to get time-sensitive notifications
notificationSchema.statics.getTimeSensitiveNotifications = async function (
  userId = null,
  options = {}
) {
  const {
    page = 1,
    limit = 20,
    includeRead = true,
    includeArchived = false
  } = options

  const query = { isTimeSensitive: true }

  if (userId) {
    query.userId = userId
  }

  if (!includeRead) {
    query.isRead = false
  }

  if (!includeArchived) {
    query.isArchived = false
  }

  const notifications = await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('reservationId')
    .exec()

  const total = await this.countDocuments(query)

  return {
    notifications,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page)
  }
}

// Static method to mark all as read for user
notificationSchema.statics.markAllAsRead = async function (userId) {
  return this.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  )
}

// Static method to delete old notifications
notificationSchema.statics.deleteOldNotifications = async function (daysOld = 30) {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysOld)

  return this.deleteMany({
    createdAt: { $lt: cutoffDate },
    isArchived: true
  })
}

// Static method to create notification
notificationSchema.statics.createNotification = async function (notificationData) {
  const notification = new this(notificationData)
  await notification.save()
  return notification
}

// Static method to create broadcast notification (for all users)
notificationSchema.statics.createBroadcast = async function (notificationData) {
  // This creates a template that can be used for all users
  // In practice, you might want to create individual notifications per user
  const notification = new this({
    ...notificationData,
    userId: null // Broadcast to all
  })
  await notification.save()
  return notification
}

// Pre-save middleware to set sentAt if isSent is true
notificationSchema.pre('save', function (next) {
  if (this.isModified('isSent') && this.isSent && !this.sentAt) {
    this.sentAt = new Date()
  }
  next()
})

const Notification = mongoose.model('Notification', notificationSchema)

export default Notification
