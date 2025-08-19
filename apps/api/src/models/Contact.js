import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  category: {
    type: String,
    enum: {
      values: ['General Inquiry', 'Reservation Question', 'Menu Question', 'Feedback', 'Complaint', 'Partnership', 'Other'],
      message: 'Please select a valid category'
    },
    default: 'General Inquiry'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved', 'Closed'],
    default: 'New'
  },
  assignedTo: {
    type: String,
    trim: true
  },
  response: {
    type: String,
    trim: true,
    maxlength: [2000, 'Response cannot exceed 2000 characters']
  },
  respondedAt: {
    type: Date
  },
  respondedBy: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ['Website', 'Phone', 'Email', 'Social Media', 'Walk-in'],
    default: 'Website'
  },
  isNewsletterSignup: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
  if (this.respondedAt && this.createdAt) {
    const diffTime = Math.abs(this.respondedAt - this.createdAt);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
  return null;
});

// Virtual for is urgent
contactSchema.virtual('isUrgent').get(function() {
  return this.priority === 'Urgent' || this.category === 'Complaint';
});

// Index for efficient queries
contactSchema.index({ status: 1, priority: 1, createdAt: -1 });
contactSchema.index({ category: 1, status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ assignedTo: 1 });

// Pre-save middleware to set priority based on category
contactSchema.pre('save', function(next) {
  if (this.category === 'Complaint') {
    this.priority = 'High';
  } else if (this.category === 'Reservation Question') {
    this.priority = 'Medium';
  } else if (this.category === 'General Inquiry') {
    this.priority = 'Low';
  }
  next();
});

// Static method to get urgent contacts
contactSchema.statics.getUrgent = function() {
  return this.find({
    $or: [
      { priority: 'Urgent' },
      { priority: 'High' },
      { category: 'Complaint' }
    ],
    status: { $ne: 'Resolved' }
  }).sort({ createdAt: 1 });
};

// Static method to get contacts by status
contactSchema.statics.getByStatus = function(status) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to get contacts by category
contactSchema.statics.getByCategory = function(category) {
  return this.find({ category }).sort({ createdAt: -1 });
};

// Static method to get contacts by priority
contactSchema.statics.getByPriority = function(priority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

// Instance method to mark as resolved
contactSchema.methods.markResolved = function(response, respondedBy) {
  this.status = 'Resolved';
  this.response = response;
  this.respondedBy = respondedBy;
  this.respondedAt = new Date();
  return this.save();
};

// Instance method to assign to staff member
contactSchema.methods.assignTo = function(staffMember) {
  this.assignedTo = staffMember;
  this.status = 'In Progress';
  return this.save();
};

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
