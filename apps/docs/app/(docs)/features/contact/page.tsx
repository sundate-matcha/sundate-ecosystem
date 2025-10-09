import { EndpointCard } from '@/components/EndpointCard'

export const metadata = {
  title: 'Contact API - Sundate Matcha API Documentation',
  description: 'Handle customer inquiries, feedback, and support requests'
}

// Submit Contact Form
const submitContactFormParams = [
  { name: 'name', type: 'string', required: true, description: 'Customer name (2-100 chars)' },
  { name: 'email', type: 'string', required: true, description: 'Customer email' },
  { name: 'subject', type: 'string', required: true, description: 'Subject (5-200 chars)' },
  { name: 'message', type: 'string', required: true, description: 'Message content (10-2000 chars)' },
  { name: 'phone', type: 'string', required: false, description: 'Phone number' },
  { name: 'category', type: 'string', required: false, description: 'Inquiry category' },
  { name: 'source', type: 'string', required: false, description: 'Contact source' },
  { name: 'isNewsletterSignup', type: 'boolean', required: false, description: 'Newsletter signup flag' }
]

const submitContactFormResponse = `{
  "message": "Contact submission received successfully",
  "contact": {...},
  "referenceNumber": "CONT12345"
}`

// Get Contact Statistics
const getContactStatsResponse = `{
  "totalContacts": 156,
  "newContacts": 23,
  "inProgressContacts": 8,
  "resolvedContacts": 125,
  "urgentContacts": 5,
  "categoryStats": [...],
  "priorityStats": [...],
  "monthlyTrend": [...]
}`

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Contact API</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Handle customer inquiries, feedback, and support requests.
        </p>
      </div>

      <div className="space-y-6">
        <EndpointCard
          method="POST"
          path="/api/contact"
          title="Submit Contact Form"
          description="Submit a new contact form with customer inquiry or feedback."
          parameters={submitContactFormParams}
          responseExample={submitContactFormResponse}
        />

        <EndpointCard
          method="GET"
          path="/api/contact/stats"
          title="Get Contact Statistics"
          description="Retrieve contact form statistics and analytics (admin only)."
          parameters={[]}
          responseExample={getContactStatsResponse}
        />
      </div>
    </div>
  )
}
