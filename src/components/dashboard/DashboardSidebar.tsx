'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  FolderKanban,
  Activity,
  FileText,
  Wrench,
  Camera,
  AlertTriangle,
  Users,
  DollarSign,
  BarChart3,
  FileCheck,
  Ruler,
  LogOut
} from 'lucide-react'

interface DashboardSidebarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
  }
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
  },
  {
    name: 'Bore Logs',
    href: '/dashboard/bore-logs',
    icon: Activity,
  },
  {
    name: 'Field Reports',
    href: '/dashboard/field-reports',
    icon: FileText,
  },
  {
    name: 'Takeoff & Estimating',
    href: '/dashboard/takeoff.html',
    icon: Ruler,
    external: true,
  },
  {
    name: '811 Tickets',
    href: '/dashboard/811-tickets',
    icon: AlertTriangle,
  },
  {
    name: 'Equipment',
    href: '/dashboard/equipment',
    icon: Wrench,
  },
  {
    name: 'Photos',
    href: '/dashboard/photos',
    icon: Camera,
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
  },
  {
    name: 'Financials',
    href: '/dashboard/financials',
    icon: DollarSign,
  },
  {
    name: 'Inspections',
    href: '/dashboard/inspections',
    icon: FileCheck,
  },
  {
    name: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/login' })
  }

  return (
    <aside className="flex h-full flex-col bg-gray-800 text-white">
      {/* Logo/Brand Section */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700 px-6">
        <Link href="/dashboard" className="text-xl font-bold text-white hover:text-gray-200">
          Midwest Underground
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold">
            {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-sm font-medium">
              {user.name || user.email?.split('@')[0] || 'User'}
            </div>
            <div className="truncate text-xs text-gray-400">
              {user.role || 'USER'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = item.external
              ? false
              : pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href + '/'))

            if (item.external) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </a>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sign Out Button */}
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
