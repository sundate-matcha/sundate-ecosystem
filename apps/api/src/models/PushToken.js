import mongoose from 'mongoose'

const pushTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false // Allow anonymous users to register tokens
    },
    token: {
      type: String,
      required: [true, 'Push token is required'],
      unique: true,
      trim: true
    },
    deviceId: {
      type: String,
      trim: true,
      required: [true, 'Device ID is required']
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web'],
      required: [true, 'Platform is required']
    },
    deviceInfo: {
      type: String,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    failureCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

// Index for efficient queries
pushTokenSchema.index({ token: 1 })
pushTokenSchema.index({ userId: 1 })
pushTokenSchema.index({ isActive: 1 })
pushTokenSchema.index({ deviceId: 1 })

// Method to mark token as failed
pushTokenSchema.methods.markFailure = async function () {
  this.failureCount += 1
  if (this.failureCount >= 3) {
    this.isActive = false
  }
  return this.save()
}

// Method to mark token as successful
pushTokenSchema.methods.markSuccess = async function () {
  this.failureCount = 0
  this.lastUsed = new Date()
  this.isActive = true
  return this.save()
}

// Static method to get active tokens
pushTokenSchema.statics.getActiveTokens = async function (userId = null) {
  const query = { isActive: true }
  if (userId) {
    query.userId = userId
  }
  return await this.find(query)
}

// Static method to deactivate old tokens (not used in 30 days)
pushTokenSchema.statics.deactivateOldTokens = async function () {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  return this.updateMany(
    { lastUsed: { $lt: thirtyDaysAgo }, isActive: true },
    { isActive: false }
  )
}

const PushToken = mongoose.model('PushToken', pushTokenSchema)

export default PushToken
