import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/auth-options'
import prisma from '@/lib/database/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar total de alunos ativos e mudança em relação ao mês anterior
    const currentDate = new Date()
    const lastMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1))

    const activeStudentsNow = await prisma.user.count({
      where: {
        role: 'student'
      }
    })

    const activeStudentsLastMonth = await prisma.user.count({
      where: {
        role: 'student',
        createdAt: {
          lt: lastMonth
        }
      }
    })

    // Buscar total de exercícios e mudança
    const totalExercisesNow = await prisma.exercise.count()
    const totalExercisesLastMonth = await prisma.exercise.count({
      where: {
        createdAt: {
          lt: lastMonth
        }
      }
    })

    // Calcular taxa de conclusão
    const totalProgress = await prisma.exerciseProgress.count({
      where: {
        startedAt: {
          gte: lastMonth
        }
      }
    })

    const completedProgress = await prisma.exerciseProgress.count({
      where: {
        status: 'COMPLETED',
        startedAt: {
          gte: lastMonth
        }
      }
    })

    const completionRateNow = totalProgress > 0 
      ? Math.round((completedProgress / totalProgress) * 100)
      : 0

    // Taxa do mês anterior
    const totalProgressLastMonth = await prisma.exerciseProgress.count({
      where: {
        startedAt: {
          lt: lastMonth,
          gte: new Date(lastMonth.setMonth(lastMonth.getMonth() - 1))
        }
      }
    })

    const completedProgressLastMonth = await prisma.exerciseProgress.count({
      where: {
        status: 'COMPLETED',
        startedAt: {
          lt: lastMonth,
          gte: new Date(lastMonth.setMonth(lastMonth.getMonth() - 1))
        }
      }
    })

    const completionRateLastMonth = totalProgressLastMonth > 0
      ? Math.round((completedProgressLastMonth / totalProgressLastMonth) * 100)
      : 0

    // Calcular tempo médio (usando score como aproximação do tempo)
    const progress = await prisma.exerciseProgress.findMany({
      where: {
        status: 'COMPLETED',
        startedAt: {
          gte: lastMonth
        }
      },
      select: {
        score: true
      }
    })

    const averageTimeNow = progress.length > 0
      ? Math.round(progress.reduce((acc, curr) => acc + (curr.score || 0), 0) / progress.length)
      : 0

    // Tempo médio do mês anterior
    const progressLastMonth = await prisma.exerciseProgress.findMany({
      where: {
        status: 'COMPLETED',
        startedAt: {
          lt: lastMonth,
          gte: new Date(lastMonth.setMonth(lastMonth.getMonth() - 1))
        }
      },
      select: {
        score: true
      }
    })

    const averageTimeLastMonth = progressLastMonth.length > 0
      ? Math.round(progressLastMonth.reduce((acc, curr) => acc + (curr.score || 0), 0) / progressLastMonth.length)
      : 0

    // Montar objeto de resposta
    const stats = {
      activeStudents: {
        total: activeStudentsNow,
        change: activeStudentsNow - activeStudentsLastMonth
      },
      totalExercises: {
        total: totalExercisesNow,
        change: totalExercisesNow - totalExercisesLastMonth
      },
      completionRate: {
        rate: completionRateNow,
        change: completionRateNow - completionRateLastMonth
      },
      averageTime: {
        minutes: averageTimeNow,
        change: averageTimeNow - averageTimeLastMonth
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erro ao buscar estatísticas do dashboard:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas do dashboard' },
      { status: 500 }
    )
  }
} 