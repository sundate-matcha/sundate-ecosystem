import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('phone')
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number'),
  body('category')
    .optional()
    .isIn(['General Inquiry', 'Reservation Question', 'Menu Question', 'Feedback', 'Complaint', 'Partnership', 'Other'])
    .withMessage('Please select a valid category'),
  body('source')
    .optional()
    .isIn(['Website', 'Phone', 'Email', 'Social Media', 'Walk-in'])
    .withMessage('Please select a valid source'),
  body('isNewsletterSignup')
    .optional()
    .isBoolean()
    .withMessage('Newsletter signup must be a boolean value')
];

// GET /api/contact - Get all contact submissions (admin only)
router.get('/', async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      category, 
      assignedTo,
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const query = {};
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Filter by priority
    if (priority) {
      query.priority = priority;
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by assigned staff member
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const contacts = await Contact.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Contact.countDocuments(query);
    
    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      filters: {
        status,
        priority,
        category,
        assignedTo
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts', message: error.message });
  }
});

// GET /api/contact/urgent - Get urgent contacts (admin only)
router.get('/urgent', async (req, res) => {
  try {
    const urgentContacts = await Contact.getUrgent();
    res.json(urgentContacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch urgent contacts', message: error.message });
  }
});

// GET /api/contact/stats - Get contact statistics (admin only)
router.get('/stats', async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const newContacts = await Contact.countDocuments({ status: 'New' });
    const inProgressContacts = await Contact.countDocuments({ status: 'In Progress' });
    const resolvedContacts = await Contact.countDocuments({ status: 'Resolved' });
    const urgentContacts = await Contact.countDocuments({ 
      $or: [
        { priority: 'Urgent' },
        { priority: 'High' },
        { category: 'Complaint' }
      ],
      status: { $ne: 'Resolved' }
    });
    
    // Category breakdown
    const categoryStats = await Contact.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Priority breakdown
    const priorityStats = await Contact.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Monthly trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyTrend = await Contact.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { 
        $group: { 
          _id: { 
            year: { $year: '$createdAt' }, 
            month: { $month: '$createdAt' } 
          }, 
          count: { $sum: 1 } 
        } 
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      totalContacts,
      newContacts,
      inProgressContacts,
      resolvedContacts,
      urgentContacts,
      categoryStats,
      priorityStats,
      monthlyTrend
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact statistics', message: error.message });
  }
});

// GET /api/contact/:id - Get a specific contact submission
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact', message: error.message });
  }
});

// POST /api/contact - Create a new contact submission
router.post('/', validateContact, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const { 
      name, 
      email, 
      phone, 
      subject, 
      message, 
      category, 
      source, 
      isNewsletterSignup 
    } = req.body;
    
    // Create contact submission
    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
      category,
      source,
      isNewsletterSignup,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    await contact.save();
    
    // Send notification email (would implement email service here)
    // await sendContactNotification(contact);
    
    // If newsletter signup, add to newsletter list (would implement newsletter service here)
    if (isNewsletterSignup) {
      // await addToNewsletter(email, name);
    }
    
    res.status(201).json({
      message: 'Contact submission received successfully',
      contact,
      referenceNumber: contact._id.toString().slice(-8).toUpperCase()
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form', message: error.message });
  }
});

// PUT /api/contact/:id - Update a contact submission (admin only)
router.put('/:id', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    Object.assign(contact, req.body);
    await contact.save();
    
    res.json({
      message: 'Contact updated successfully',
      contact
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact', message: error.message });
  }
});

// PATCH /api/contact/:id/assign - Assign contact to staff member (admin only)
router.patch('/:id/assign', async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    if (!assignedTo) {
      return res.status(400).json({ error: 'Staff member name is required' });
    }
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await contact.assignTo(assignedTo);
    
    res.json({
      message: 'Contact assigned successfully',
      contact
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to assign contact', message: error.message });
  }
});

// PATCH /api/contact/:id/resolve - Mark contact as resolved (admin only)
router.patch('/:id/resolve', async (req, res) => {
  try {
    const { response, respondedBy } = req.body;
    
    if (!response || !respondedBy) {
      return res.status(400).json({ error: 'Response and responder name are required' });
    }
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await contact.markResolved(response, respondedBy);
    
    // Send response email to customer (would implement email service here)
    // await sendContactResponse(contact);
    
    res.json({
      message: 'Contact marked as resolved successfully',
      contact
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve contact', message: error.message });
  }
});

// PATCH /api/contact/:id/status - Update contact status (admin only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const validStatuses = ['New', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    contact.status = status;
    await contact.save();
    
    res.json({
      message: 'Contact status updated successfully',
      contact
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to update contact status', message: error.message });
  }
});

// DELETE /api/contact/:id - Delete a contact submission (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    await Contact.findByIdAndDelete(req.params.id);
    
    res.json({
      message: 'Contact deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete contact', message: error.message });
  }
});

export default router;
