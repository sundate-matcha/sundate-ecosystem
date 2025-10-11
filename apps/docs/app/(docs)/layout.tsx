import { Github, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { Sidebar } from '@/components/Sidebar'
import { API_URL } from '@/lib/constants'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-green-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      {/* Header */}
      <header className="bg-white/60 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-[#fff8de] rounded-lg flex items-center justify-center">
                <Image src="/logo.png" alt="Sundate Matcha" width={36} height={36} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Sundate Matcha API</h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Coffee Shop Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/sundate-matcha/sundate-ecosystem/tree/main/apps/docs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <Github className="w-5 h-5" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href={`${API_URL}health`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                <ExternalLink className="w-5 h-5" />
                <span className="hidden sm:inline">API Status</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar />

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
