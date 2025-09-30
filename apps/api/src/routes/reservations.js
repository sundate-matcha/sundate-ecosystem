import express from 'express'
import { body, validationResult } from 'express-validator'
import Reservation from '../models/Reservation.js'
import TableCategory from '../models/TableCategory.js'

const router = express.Router()

// Validation middleware
const validateReservation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('phone')
    .matches(/^[\+]?[0-9][\d]{10,12}$/)
    .withMessage('Please provide a valid phone number'),
  body('date')
    .isISO8601()
    .custom(value => {
      const date = new Date(value)
      const now = new Date()
      if (date <= now) {
        throw new Error('Reservation date must be in the future')
      }
      return true
    }),
  body('time').isLength({ min: 1 }).withMessage('Time is required'),
  body('guests').isInt({ min: 1, max: 20 }).withMessage('Number of guests must be between 1 and 20'),
  body('specialRequests')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Special requests cannot exceed 500 characters'),
  body('notes').optional().isLength({ max: 200 }).withMessage('Notes cannot exceed 200 characters')
]

// GET /api/reservations - Get all reservations (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, date, sortBy = 'date', sortOrder = 'asc' } = req.query

    const query = {}
    if (status) query.status = status
    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.date = { $gte: startDate, $lt: endDate }
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const reservations = await Reservation.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    const total = await Reservation.countDocuments(query)

    res.json({
      reservations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations', message: error.message })
  }
})

// GET /api/reservations/:id - Get a specific reservation
router.get('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }
    res.json(reservation)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation', message: error.message })
  }
})

// POST /api/reservations - Create a new reservation
router.post('/', validateReservation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const { name, email, phone, date, time, tableCategory: tableCategoryId, guests, specialRequests } = req.body

    // Get the capacity of the table category
    const tableCategory = await TableCategory.findById(tableCategoryId)

    // Check availability
    const availability = await Reservation.checkAvailability(date, time, tableCategory.capacity ?? 0, guests)
    if (!availability.available) {
      return res.status(400).json({
        error: 'Reservation not available',
        message: `Sorry, we cannot accommodate ${guests} guests at ${time} on ${new Date(date).toLocaleDateString()}. Current occupancy: ${availability.currentOccupancy}/${availability.remainingCapacity + availability.currentOccupancy}`,
        availability
      })
    }

    // Check for existing reservation by same person at same time
    const existingReservation = await Reservation.findOne({
      email,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] }
    })

    if (existingReservation) {
      return res.status(400).json({
        error: 'Duplicate reservation',
        message: 'You already have a reservation at this time'
      })
    }

    // Create reservation
    const reservation = new Reservation({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequests
    })

    await reservation.save()

    // Send confirmation email (would implement email service here)
    // await sendReservationConfirmation(reservation);

    res.status(201).json({
      confirmationNumber: reservation._id.toString().slice(-8).toUpperCase(),
      message: 'Reservation created successfully',
      reservation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation', message: error.message })
  }
})

// PUT /api/reservations/:id - Update a reservation
router.put('/:id', validateReservation, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      })
    }

    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    // Check if reservation can be modified
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({
        error: 'Cannot modify reservation',
        message: 'This reservation cannot be modified'
      })
    }

    // Check availability for new time/date if changed
    if (
      req.body.date !== reservation.date ||
      req.body.time !== reservation.time ||
      req.body.guests !== reservation.guests
    ) {
      const availability = await Reservation.checkAvailability(
        req.body.date || reservation.date,
        req.body.time || reservation.time,
        req.body.guests || reservation.guests
      )

      if (!availability.available) {
        return res.status(400).json({
          error: 'Reservation not available',
          message: 'The requested time/date is not available',
          availability
        })
      }
    }

    // Update reservation
    Object.assign(reservation, req.body)
    await reservation.save()

    res.json({
      message: 'Reservation updated successfully',
      reservation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation', message: error.message })
  }
})

// PATCH /api/reservations/:id/confirm - Confirm a reservation
router.patch('/:id/confirm', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    if (reservation.status !== 'pending') {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'Only pending reservations can be confirmed'
      })
    }

    await reservation.confirm()

    res.json({
      message: 'Reservation confirmed successfully',
      reservation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to confirm reservation', message: error.message })
  }
})

// PATCH /api/reservations/:id/cancel - Cancel a reservation
router.patch('/:id/cancel', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({
        error: 'Invalid action',
        message: 'This reservation cannot be cancelled'
      })
    }

    await reservation.cancel()

    res.json({
      message: 'Reservation cancelled successfully',
      reservation
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel reservation', message: error.message })
  }
})

// DELETE /api/reservations/:id - Delete a reservation
router.delete('/:id', async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' })
    }

    await Reservation.findByIdAndDelete(req.params.id)

    res.json({
      message: 'Reservation deleted successfully'
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation', message: error.message })
  }
})

// GET /api/reservations/availability/check - Check availability
router.get('/availability/check', async (req, res) => {
  try {
    const { date, time, guests } = req.query

    if (!date || !time || !guests) {
      return res.status(400).json({
        error: 'Missing parameters',
        message: 'Date, time, and guests are required'
      })
    }

    const availability = await Reservation.checkAvailability(date, time, parseInt(guests))

    res.json({
      date,
      time,
      guests: parseInt(guests),
      ...availability
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to check availability', message: error.message })
  }
})

export default router
