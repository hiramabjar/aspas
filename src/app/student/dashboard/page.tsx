'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ProgressOverview } from '@/components/dashboard/ProgressOverview'
import { RecentActivities } from '@/components/dashboard/RecentActivities'
import { BarChart3, Clock, TrendingUp } from 'lucide-react'

interface Activity {
  title: string
  type: 'Reading' | 'Listening'
  time: string
  score: number
}

export default function StudentDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  const recentActivities: Activity[] = [
    {
      title: "My Wonderful Family",
      type: "Reading",
      time: "há cerca de 22 horas",
      score: 100
    },
    {
      title: "David is planning a Vacation",
      type: "Listening",
      time: "há cerca de 22 horas",
      score: 100
    },
    {
      title: "aaaaa",
      type: "Reading",
      time: "há cerca de 22 horas",
      score: 100
    }
  ]

  useEffect(() => {
    if (!session || session.user.role !== 'student') {
      router.push('/auth/login')
    }
  }, [session, router])

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Meu Dashboard</h1>
          <p className="text-[#E5D5F2]">Acompanhe seu progresso e atividades recentes</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Seção de Progresso */}
        <div className="bg-[#382D4B] rounded-2xl p-6 shadow-lg border border-[#4A3B5C]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[#4A3B5C]">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Meu Progresso</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-[#2D2440] rounded-xl p-5 border border-[#4A3B5C] group hover:border-[#6D5A88] transition-all duration-300">
              <h3 className="text-[#B794C0] text-sm font-medium mb-2">Exercícios Completados</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white">3/3</span>
                <div className="h-1.5 w-24 bg-[#4A3B5C] rounded-full overflow-hidden">
                  <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#2D2440] rounded-xl p-5 border border-[#4A3B5C] group hover:border-[#6D5A88] transition-all duration-300">
              <h3 className="text-[#B794C0] text-sm font-medium mb-2">Média de Pontuação</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white">100%</span>
                <div className="flex items-center text-emerald-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Excelente</span>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 bg-[#2D2440] rounded-xl p-5 border border-[#4A3B5C] group hover:border-[#6D5A88] transition-all duration-300">
              <h3 className="text-[#B794C0] text-sm font-medium mb-2">Sequência de Dias</h3>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-white">0 dias</span>
                <div className="flex gap-1.5">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#4A3B5C] group-hover:bg-[#6D5A88] transition-colors duration-300"
                    >
                      <span className="text-sm font-medium text-white">{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Atividades Recentes */}
        <div className="bg-[#382D4B] rounded-2xl p-6 shadow-lg border border-[#4A3B5C]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-[#4A3B5C]">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Atividades Recentes</h2>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-[#2D2440] rounded-xl p-5 border border-[#4A3B5C] group hover:border-[#6D5A88] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-white">{activity.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activity.type === 'Reading' 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {activity.type}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[#B794C0] text-sm">{activity.time}</span>
                  <span className="text-2xl font-bold text-white">{activity.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#4A3B5C] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500" 
                    style={{ width: `${activity.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 