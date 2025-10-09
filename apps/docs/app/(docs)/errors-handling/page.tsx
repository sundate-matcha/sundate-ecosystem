export const metadata = {
  title: 'Error Handling - Sundate Matcha API Documentation',
  description: 'Understand how the API handles errors and how to respond to them in your applications'
}

export default function ErrorsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">Error Handling</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Understand how the API handles errors and how to respond to them in your applications.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">HTTP Status Codes</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-green-600 dark:text-green-400">200</span>
              <span className="text-neutral-600 dark:text-neutral-400">Success</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-blue-600 dark:text-blue-400">201</span>
              <span className="text-neutral-600 dark:text-neutral-400">Created</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-yellow-600 dark:text-yellow-400">400</span>
              <span className="text-neutral-600 dark:text-neutral-400">Bad Request</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">401</span>
              <span className="text-neutral-600 dark:text-neutral-400">Unauthorized</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">404</span>
              <span className="text-neutral-600 dark:text-neutral-400">Not Found</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-16 text-sm font-mono text-red-600 dark:text-red-400">500</span>
              <span className="text-neutral-600 dark:text-neutral-400">Internal Server Error</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Error Response Format</h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">All error responses follow a consistent format:</p>
          <pre className="text-sm bg-neutral-100 dark:bg-neutral-700 p-4 rounded overflow-x-auto">
            {`{
  "error": "Error type description",
  "message": "Detailed error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Field-specific error message"
    }
  ]
}`}
          </pre>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">Common Error Scenarios</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Validation Errors (400)</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                When request data fails validation, you&apos;ll receive detailed field-specific error messages.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Authentication Errors (401)</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Invalid or missing API key will result in an authentication error.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">Rate Limiting (429)</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Exceeding rate limits will result in a 429 status with retry-after header.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

