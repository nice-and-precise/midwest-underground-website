import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Fixed on desktop, hidden on mobile */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <DashboardSidebar user={session.user} />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
