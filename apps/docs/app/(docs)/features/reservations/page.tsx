import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Reservations API - Sundate Matcha API Documentation',
  description: 'Manage table reservations, check availability, and handle guest requests'
}

// Get All Reservations
const getAllReservationsParams = [
  { name: 'page', type: 'number', description: 'Page number (default: 1)' },
  { name: 'limit', type: 'number', description: 'Items per page (default: 10)' },
  { name: 'status', type: 'string', description: 'Filter by reservation status' },
  { name: 'date', type: 'string', description: 'Filter by specific date' },
  { name: 'sortBy', type: 'string', description: 'Sort field (default: date)' },
  { name: 'sortOrder', type: 'string', description: 'Sort order: asc/desc (default: asc)' }
]

const getAllReservationsResponse = `{
  "reservations": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 48
}`

// Create Reservation
const createReservationParams = [
  { name: 'name', type: 'string', required: true, description: 'Customer name (2-100 chars)' },
  { name: 'phone', type: 'string', required: true, description: 'Phone number (10-12 digits)' },
  { name: 'date', type: 'string', required: true, description: 'Reservation date (ISO 8601, no Sundays)' },
  { name: 'time', type: 'string', required: true, description: 'Time slot in HH:mm format' },
  { name: 'tableCategory', type: 'string', required: true, description: 'Table category ID (ObjectId)' },
  { name: 'guests', type: 'number', required: true, description: 'Number of guests (1-20)' },
  { name: 'email', type: 'string', required: false, description: 'Customer email (optional)' },
  { name: 'specialRequests', type: 'string', required: false, description: 'Special requests (max 500 chars)' },
  { name: 'notes', type: 'string', required: false, description: 'Additional notes (max 200 chars)' }
]

const createReservationResponse = `{
  "message": "Reservation created successfully",
  "reservation": {...},
  "confirmationNumber": "ABC12345"
}`

// Check Availability
const checkAvailabilityParams = [
  { name: 'date', type: 'string', required: true, description: 'Date to check' },
  { name: 'time', type: 'string', required: true, description: 'Time slot to check' },
  { name: 'guests', type: 'number', required: true, description: 'Number of guests' }
]

const checkAvailabilityResponse = `{
  "date": "2024-01-15",
  "time": "19:00",
  "guests": 4,
  "available": true,
  "currentOccupancy": 12,
  "remainingCapacity": 8
}`

// Get Reservation by ID
const getReservationByIdParams = [
  { name: 'id', type: 'string', required: true, description: 'Reservation ID' }
]

const getReservationByIdResponse = `{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "date": "2024-01-15T00:00:00.000Z",
  "time": "19:00",
  "tableCategory": "507f1f77bcf86cd799439012",
  "guests": 4,
  "status": "pending",
  "specialRequests": "Window seat preferred",
  "notes": "",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}`

// Update Reservation
const updateReservationParams = [
  { name: 'id', type: 'string', required: true, description: 'Reservation ID' },
  { name: 'name', type: 'string', required: false, description: 'Customer name (2-100 chars)' },
  { name: 'phone', type: 'string', required: false, description: 'Phone number (10-12 digits)' },
  { name: 'date', type: 'string', required: false, description: 'Reservation date (ISO 8601)' },
  { name: 'time', type: 'string', required: false, description: 'Time slot in HH:mm format' },
  { name: 'tableCategory', type: 'string', required: false, description: 'Table category ID' },
  { name: 'guests', type: 'number', required: false, description: 'Number of guests (1-20)' },
  { name: 'email', type: 'string', required: false, description: 'Customer email' },
  { name: 'specialRequests', type: 'string', required: false, description: 'Special requests (max 500 chars)' },
  { name: 'notes', type: 'string', required: false, description: 'Additional notes (max 200 chars)' }
]

const updateReservationResponse = `{
  "message": "Reservation updated successfully",
  "reservation": {...}
}`

// Confirm Reservation
const confirmReservationParams = [
  { name: 'id', type: 'string', required: true, description: 'Reservation ID' }
]

const confirmReservationResponse = `{
  "message": "Reservation confirmed successfully",
  "reservation": {...}
}`

// Cancel Reservation
const cancelReservationParams = [
  { name: 'id', type: 'string', required: true, description: 'Reservation ID' }
]

const cancelReservationResponse = `{
  "message": "Reservation cancelled successfully",
  "reservation": {...}
}`

// Delete Reservation
const deleteReservationParams = [
  { name: 'id', type: 'string', required: true, description: 'Reservation ID' }
]

const deleteReservationResponse = `{
  "message": "Reservation deleted successfully"
}`

export default function ReservationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Reservations API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Manage table reservations, check availability, and handle guest requests.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="GET"
          path="/api/reservations"
          title="Get All Reservations"
          description="Retrieve a paginated list of all reservations with filtering and sorting options."
          parameters={getAllReservationsParams}
          responseExample={getAllReservationsResponse}
        />

        <EndpointCard
          method="POST"
          path="/api/reservations"
          title="Create Reservation"
          description="Create a new table reservation with validation and availability checking."
          parameters={createReservationParams}
          responseExample={createReservationResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/reservations/availability/check"
          title="Check Availability"
          description="Check if a specific time slot is available for a given number of guests."
          parameters={checkAvailabilityParams}
          responseExample={checkAvailabilityResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/reservations/:id"
          title="Get Reservation by ID"
          description="Retrieve a specific reservation by its ID."
          parameters={getReservationByIdParams}
          responseExample={getReservationByIdResponse}
        />

        <EndpointCard
          method="PUT"
          path="/api/reservations/:id"
          title="Update Reservation"
          description="Update an existing reservation. Cannot modify cancelled or completed reservations."
          parameters={updateReservationParams}
          responseExample={updateReservationResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/reservations/:id/confirm"
          title="Confirm Reservation"
          description="Confirm a pending reservation. Only pending reservations can be confirmed."
          parameters={confirmReservationParams}
          responseExample={confirmReservationResponse}
        />

        <EndpointCard
          method="PATCH"
          path="/api/reservations/:id/cancel"
          title="Cancel Reservation"
          description="Cancel a reservation. Cannot cancel already cancelled or completed reservations."
          parameters={cancelReservationParams}
          responseExample={cancelReservationResponse}
        />

        <EndpointCard
          method="DELETE"
          path="/api/reservations/:id"
          title="Delete Reservation"
          description="Permanently delete a reservation from the system."
          parameters={deleteReservationParams}
          responseExample={deleteReservationResponse}
        />
      </div>
    </div>
  )
}
