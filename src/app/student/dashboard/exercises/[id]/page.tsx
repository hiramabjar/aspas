'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExercisePDFDownload } from '@/components/exercises/ExercisePDF'
import { AudioPlayer } from '@/components/exercises/AudioPlayer'
import { DictationExercise } from '@/components/exercises/DictationExercise'
import { ReadingExercise } from '@/components/exercises/ReadingExercise'
import { ListeningExercise } from '@/components/exercises/ListeningExercise'
import type { Exercise } from '@/types/exercise'
import { useToast } from '@/components/ui/use-toast'

interface ExerciseResults {
  score: number
  correctCount: number
  totalQuestions: number
  attempt: any
  progress: any
}

export default function ExercisePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [results, setResults] = useState<ExerciseResults | null>(null)

  const { data: exercise, isLoading } = useQuery<Exercise>({
    queryKey: ['exercise', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/exercises/${params.id}`)
      if (!response.ok) {
        throw new Error('Erro ao carregar exercício')
      }
      return response.json()
    }
  })

  const handleSubmit = async (answers: Array<{ questionId: string; answer: string }>) => {
    try {
      const response = await fetch(`/api/exercises/${params.id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao enviar respostas')
      }

      const results = await response.json()
      setResults(results)
      toast({
        title: "Sucesso",
        description: "Respostas enviadas com sucesso!",
      })
    } catch (error) {
      console.error('Erro ao enviar respostas:', error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao enviar respostas",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-500">Carregando exercício...</p>
        </div>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-center text-gray-500">Exercício não encontrado</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{exercise.title}</h1>
        <p className="text-gray-600">{exercise.description}</p>
      </div>

      {exercise.type === 'reading' && (
        <ReadingExercise
          exercise={exercise}
          onSubmit={handleSubmit}
        />
      )}
      
      {exercise.type === 'listening' && (
        <ListeningExercise
          id={exercise.id}
          title={exercise.title}
          description={exercise.description}
          content={exercise.content}
          audioUrl={exercise.audioUrl}
          questions={exercise.questions.map(q => ({
            ...q,
            options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
          }))}
          onComplete={async (score, answers) => {
            const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
              questionId,
              answer
            }))
            await handleSubmit(formattedAnswers)
          }}
        />
      )}
      
      {exercise.type === 'dictation' && (
        <DictationExercise
          exercise={exercise}
          onSubmit={handleSubmit}
        />
      )}

      {results && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados</h2>
          <div className="space-y-2">
            <p>Pontuação: {results.score}%</p>
            <p>Respostas corretas: {results.correctCount} de {results.totalQuestions}</p>
          </div>
        </Card>
      )}
    </div>
  )
} 