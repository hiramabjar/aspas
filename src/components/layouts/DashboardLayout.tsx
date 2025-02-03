'use client'

import { Sidebar } from '../dashboard/Sidebar'
import { Header } from '../dashboard/Header'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--background)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-light)]" />
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 bg-[var(--background)] text-[var(--text)]">
          {children}
        </main>
      </div>
    </div>
  )
} 