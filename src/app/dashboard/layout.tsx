import { DashboardLayout as DashboardContainer } from '@/components/layouts/DashboardLayout'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/features/auth/authOptions'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }

  return <DashboardContainer>{children}</DashboardContainer>
} 