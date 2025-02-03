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

    // Buscar exercícios completados recentemente
    const recentExercises = await prisma.exerciseAttempt.findMany({
      take: 5,
      orderBy: {
        completedAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        exercise: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    // Buscar novos alunos
    const recentStudents = await prisma.user.findMany({
      where: {
        role: 'student'
      },
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        image: true,
        createdAt: true
      }
    })

    // Combinar e ordenar todas as atividades
    const activities = [
      ...recentExercises.map(attempt => ({
        id: attempt.id,
        type: 'exercise_completed',
        description: `${attempt.user.name} completou o exercício "${attempt.exercise.title}"`,
        timestamp: attempt.completedAt,
        user: {
          name: attempt.user.name,
          image: attempt.user.image
        }
      })),
      ...recentStudents.map(student => ({
        id: student.id,
        type: 'student_joined',
        description: `${student.name} se juntou à plataforma`,
        timestamp: student.createdAt,
        user: {
          name: student.name,
          image: student.image
        }
      }))
    ].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 5)

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Erro ao buscar atividades recentes:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar atividades recentes' },
      { status: 500 }
    )
  }
} 