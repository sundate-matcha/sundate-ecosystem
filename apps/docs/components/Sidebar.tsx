'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpen,
  Calendar,
  UtensilsCrossed,
  MessageSquare,
  Zap,
  Shield,
  Settings,
  Menu,
  X,
  Play,
  Table,
  Bell,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'overview', label: 'Overview', icon: BookOpen, href: '/', level: 0 },
  {
    id: 'features',
    label: 'Features',
    icon: Settings,
    level: 0,
    children: [
      { id: 'reservations', label: 'Reservations', icon: Calendar, href: '/features/reservations' },
      { id: 'menu', label: 'Menu', icon: UtensilsCrossed, href: '/features/menu' },
      { id: 'contact', label: 'Contact', icon: MessageSquare, href: '/features/contact' },
      { id: 'table-categories', label: 'Table Categories', icon: Table, href: '/features/table-categories' },
      { id: 'authentication', label: 'Authentication', icon: Shield, href: '/features/authentication' },
      { id: 'admin-menu', label: 'Admin Menu', icon: Settings, href: '/features/admin-menu' },
      { id: 'notifications', label: 'Notifications', icon: Bell, href: '/features/notifications' },
      { id: 'push-tokens', label: 'Push Tokens', icon: Smartphone, href: '/features/push-tokens' }
    ]
  },
  { id: 'errors-handling', label: 'Error Handling', icon: Zap, href: '/errors-handling', level: 0 },
  { id: 'api-testing', label: 'API Testing', icon: Play, href: '/api-testing', level: 0 }
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedFeatures, setExpandedFeatures] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Auto-expand features section when a child item is active
  useEffect(() => {
    const activeChildPaths = [
      '/features/reservations',
      '/features/menu',
      '/features/contact',
      '/features/table-categories',
      '/features/authentication',
      '/features/admin-menu',
      '/features/notifications',
      '/features/push-tokens'
    ]
    if (activeChildPaths.includes(pathname)) {
      setExpandedFeatures(true)
    }
  }, [pathname])

  const renderNavigationItem = (section: any, isChild: boolean = false) => {
    const Icon = section.icon
    const isActive = pathname === section.href

    if (section.children) {
      const childPaths = ['/reservations', '/menu', '/contact', '/table-categories', '/authentication', '/admin-menu', '/notifications', '/push-tokens']
      const isFeaturesExpanded = expandedFeatures || childPaths.includes(pathname)

      return (
        <div key={section.id}>
          <button
            onClick={() => setExpandedFeatures(!expandedFeatures)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all text-md',
              'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
            )}>
            <div className="flex items-center space-x-3">
              <Icon className="w-5 h-5" />
              <span className="font-medium">{section.label}</span>
            </div>
            <svg
              className={cn('w-4 h-4 transition-transform', isFeaturesExpanded ? 'rotate-180' : '')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isFeaturesExpanded && (
            <div className="ml-4 mt-2 space-y-1 border-l border-neutral-200 dark:border-neutral-700 pl-2">
              {section.children.map((child: any) => renderNavigationItem(child, true))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={section.id}
        href={section.href}
        onClick={() => setMobileNavOpen(false)}
        className={cn(
          'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-md relative',
          isActive
            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500 shadow-sm'
            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
        )}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{section.label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setMobileNavOpen(!mobileNavOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors">
        {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Navigation Overlay */}
      {mobileNavOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile Navigation Sidebar */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 transform transition-transform duration-300 ease-in-out shadow-2xl',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Navigation</h2>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {sections.map(section => renderNavigationItem(section))}
        </nav>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden lg:block lg:col-span-1">
        <nav className="sticky top-24 space-y-2">{sections.map(section => renderNavigationItem(section))}</nav>
      </aside>
    </>
  )
}
