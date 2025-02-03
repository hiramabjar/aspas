'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { BarChart3, Clock, Users, BookOpen, TrendingUp, Star, Award } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

interface Activity {
  id: string
  type: 'exercise_completed' | 'student_joined' | 'exercise_created'
  description: string
  timestamp: string
  user: {
    name: string
    image?: string
  }
}

interface TopStudent {
  id: string
  name: string
  score: number
  completedExercises: number
  image?: string
}

interface DashboardStats {
  activeStudents: {
    total: number
    change: number
  }
  totalExercises: {
    total: number
    change: number
  }
  completionRate: {
    rate: number
    change: number
  }
  averageTime: {
    minutes: number
    change: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user?.role !== 'admin')) {
      router.replace('/auth/login')
    }
  }, [session, status, router])

  // Buscar estatísticas do dashboard
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) {
        throw new Error('Falha ao carregar estatísticas')
      }
      return response.json()
    },
    enabled: !!session
  })

  // Buscar atividades recentes
  const { data: activities, isLoading: isLoadingActivities } = useQuery<Activity[]>({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const response = await fetch('/api/activities/recent')
      if (!response.ok) {
        throw new Error('Falha ao carregar atividades recentes')
      }
      return response.json()
    },
    enabled: !!session
  })

  // Buscar top alunos
  const { data: topStudents, isLoading: isLoadingStudents } = useQuery<TopStudent[]>({
    queryKey: ['top-students'],
    queryFn: async () => {
      const response = await fetch('/api/students/top')
      if (!response.ok) {
        throw new Error('Falha ao carregar top alunos')
      }
      return response.json()
    },
    enabled: !!session
  })

  if (status === 'loading' || isLoadingActivities || isLoadingStudents || isLoadingStats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary-light)]" />
      </div>
    )
  }

  const statsCards = [
    {
      title: 'Alunos Ativos',
      value: stats?.activeStudents.total.toString() || '0',
      change: stats?.activeStudents.change !== undefined ? (stats.activeStudents.change > 0 ? `+${stats.activeStudents.change}` : stats.activeStudents.change.toString()) : '0',
      icon: Users,
      iconClass: 'text-[#D7C5DF]',
      bgClass: 'bg-[#4A3B5C]'
    },
    {
      title: 'Total de Exercícios',
      value: stats?.totalExercises.total.toString() || '0',
      change: stats?.totalExercises.change !== undefined ? (stats.totalExercises.change > 0 ? `+${stats.totalExercises.change}` : stats.totalExercises.change.toString()) : '0',
      icon: BookOpen,
      iconClass: 'text-[#B794C0]',
      bgClass: 'bg-[#563763]'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${stats?.completionRate.rate || 0}%`,
      change: stats?.completionRate.change !== undefined ? `${stats.completionRate.change > 0 ? '+' : ''}${stats.completionRate.change}%` : '0%',
      icon: TrendingUp,
      iconClass: 'text-[#E5D5F2]',
      bgClass: 'bg-[#4A3B5C]'
    },
    {
      title: 'Tempo Médio',
      value: `${stats?.averageTime.minutes || 0}min`,
      change: stats?.averageTime.change !== undefined ? `${stats.averageTime.change > 0 ? '+' : ''}${stats.averageTime.change}min` : '0min',
      icon: Clock,
      iconClass: 'text-[#D7C5DF]',
      bgClass: 'bg-[#563763]'
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#E5D5F2] mb-8">Dashboard Administrativo</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card 
            key={stat.title} 
            className={`p-6 border-none shadow-lg ${stat.bgClass} hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm bg-opacity-95`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-[#2D2438] bg-opacity-50">
                <stat.icon className={`w-6 h-6 ${stat.iconClass}`} />
              </div>
              <div>
                <p className="text-sm text-[#B794C0]">{stat.title}</p>
                <p className="text-2xl font-bold text-[#E5D5F2]">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stat.change} vs. mês anterior
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activities & Top Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="bg-[#4A3B5C] border-none shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-6 text-[#E5D5F2] flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#B794C0]" />
            Atividades Recentes
          </h2>
          <div className="space-y-4">
            {activities && activities.length > 0 ? (
              activities.map((activity) => (
                <div 
                  key={activity.id}
                  className="p-4 bg-[#2D2438] rounded-xl border border-[#563763] bg-opacity-50 hover:bg-opacity-70 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[#E5D5F2]">{activity.description}</p>
                    <span className="text-sm text-[#B794C0]">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-[#2D2438] rounded-xl border border-[#563763] bg-opacity-50">
                <p className="text-[#B794C0]">Nenhuma atividade recente</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="bg-[#4A3B5C] border-none shadow-lg p-6 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-bold mb-6 text-[#E5D5F2] flex items-center gap-2">
            <Award className="w-6 h-6 text-[#B794C0]" />
            Top Alunos
          </h2>
          <div className="space-y-4">
            {topStudents && topStudents.length > 0 ? (
              topStudents.map((student, index) => (
                <div 
                  key={student.id}
                  className="p-4 bg-[#2D2438] rounded-xl border border-[#563763] bg-opacity-50 hover:bg-opacity-70 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#563763]">
                        {index === 0 ? (
                          <Award className="w-4 h-4 text-yellow-400" />
                        ) : index === 1 ? (
                          <Award className="w-4 h-4 text-gray-300" />
                        ) : index === 2 ? (
                          <Award className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Star className="w-4 h-4 text-[#E5D5F2]" />
                        )}
                      </div>
                      <div>
                        <p className="text-[#E5D5F2] font-medium flex items-center gap-2">
                          {student.name}
                          {index === 0 && (
                            <span className="text-xs bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-400/30">
                              Top #1
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-[#B794C0]">
                          {student.completedExercises} exercícios concluídos
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#E5D5F2]">{student.score}%</p>
                      <p className="text-sm text-[#B794C0]">Score Médio</p>
                    </div>
                  </div>
                  <div className="mt-3 h-1.5 w-full bg-[#4A3B5C] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500" 
                      style={{ width: `${student.score}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-[#2D2438] rounded-xl border border-[#563763] bg-opacity-50">
                <p className="text-[#B794C0]">Nenhum aluno encontrado</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
} 