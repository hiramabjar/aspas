import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/features/auth/authOptions'
import prisma from '@/lib/database/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    // Buscar os top 5 alunos com base nas tentativas de exercícios
    const topStudents = await prisma.user.findMany({
      where: {
        role: 'student',
        exerciseAttempts: {
          some: {} // Pelo menos uma tentativa
        }
      },
      select: {
        id: true,
        name: true,
        image: true,
        exerciseAttempts: {
          where: {
            completed: true
          },
          select: {
            score: true
          }
        }
      },
      orderBy: {
        exerciseAttempts: {
          _count: 'desc'
        }
      },
      take: 5
    })

    // Calcular estatísticas para cada aluno
    const formattedTopStudents = topStudents.map(student => {
      const completedExercises = student.exerciseAttempts.length
      const totalScore = student.exerciseAttempts.reduce((acc, attempt) => acc + attempt.score, 0)
      const averageScore = completedExercises > 0 ? Math.round(totalScore / completedExercises) : 0

      return {
        id: student.id,
        name: student.name || 'Aluno',
        image: student.image,
        score: averageScore,
        completedExercises
      }
    })

    // Ordenar por score e depois por número de exercícios completados
    const sortedTopStudents = formattedTopStudents.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score
      }
      return b.completedExercises - a.completedExercises
    })

    return NextResponse.json(sortedTopStudents)
  } catch (error) {
    console.error('Erro ao buscar top alunos:', error)
    return new NextResponse('Erro interno do servidor', { status: 500 })
  }
} 