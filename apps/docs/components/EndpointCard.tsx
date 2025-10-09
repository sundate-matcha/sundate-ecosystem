import { cn } from '@/lib/utils'

interface Parameter {
  name: string
  type: string
  required?: boolean
  description: string
}

interface EndpointCardProps {
  method: string
  path: string
  title: string
  description: string
  parameters?: Parameter[]
  responseExample?: string
}

export function EndpointCard({
  method,
  path,
  title,
  description,
  parameters = [],
  responseExample
}: EndpointCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700">
      <div className="flex items-center space-x-3 mb-4">
        <span className={cn('method', method.toLowerCase())}>{method}</span>
        <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-700 px-3 py-1 rounded">{path}</code>
      </div>

      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>

      <p className="text-neutral-600 dark:text-neutral-400 mb-4">{description}</p>

      {parameters.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Parameters</h4>
          <div className="space-y-2">
            {parameters.map(param => (
              <div key={param.name} className="flex items-start space-x-3">
                <code className="text-sm font-mono bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded min-w-[80px]">
                  {param.name}
                </code>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{param.type}</span>
                    {param.required && (
                      <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{param.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {responseExample && (
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">Response Example</h4>
          <pre className="text-sm bg-neutral-100 dark:bg-neutral-700 p-4 rounded overflow-x-auto">
            {responseExample}
          </pre>
        </div>
      )}
    </div>
  )
}

