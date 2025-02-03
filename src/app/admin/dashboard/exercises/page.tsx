'use client'

import Link from 'next/link'
import { BookOpen, Headphones, Eye, Trash2, Edit, Mic, Search } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Exercise } from '@/types/exercise'

export default function ExercisesPage() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['exercises'] })
  }, [queryClient])

  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ['exercises'],
    queryFn: async () => {
      const response = await fetch('/api/exercises')
      if (!response.ok) {
        throw new Error('Erro ao carregar exercícios')
      }
      return response.json()
    },
    staleTime: 0,
    refetchOnMount: true
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este exercício?')) {
      return
    }

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar exercício')
      }

      await queryClient.invalidateQueries({ queryKey: ['exercises'] })
      toast.success('Exercício deletado com sucesso!')
    } catch (error) {
      toast.error('Erro ao deletar exercício')
      console.error('Erro:', error)
    }
  }

  const filteredExercises = exercises?.filter(exercise => 
    exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getExerciseTypeDetails = (type: string) => {
    switch (type) {
      case 'reading':
        return {
          label: 'Leitura',
          icon: BookOpen,
          bgColor: 'bg-emerald-500',
          textColor: 'text-emerald-100',
          bgLight: 'bg-emerald-100',
          textDark: 'text-emerald-800',
          buttonColor: 'bg-emerald-600 hover:bg-emerald-700'
        }
      case 'listening':
        return {
          label: 'Listening',
          icon: Headphones,
          bgColor: 'bg-blue-500',
          textColor: 'text-blue-100',
          bgLight: 'bg-blue-100',
          textDark: 'text-blue-800',
          buttonColor: 'bg-blue-600 hover:bg-blue-700'
        }
      default:
        return {
          label: 'Ditado',
          icon: Mic,
          bgColor: 'bg-purple-500',
          textColor: 'text-purple-100',
          bgLight: 'bg-purple-100',
          textDark: 'text-purple-800',
          buttonColor: 'bg-purple-600 hover:bg-purple-700'
        }
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#2D2438]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D7C5DF]" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#2D2438] min-h-screen">
      {/* Header com Busca e Botões */}
      <div className="mb-8 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#E5D5F2]">Exercícios</h1>
          <div className="flex gap-4">
            <Link href="/admin/dashboard/exercises/new/reading">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-emerald-500/20 transition-all duration-200">
                <BookOpen className="w-5 h-5 mr-2" />
                Novo Exercício de Leitura
              </Button>
            </Link>
            <Link href="/admin/dashboard/exercises/new/listening">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/20 transition-all duration-200">
                <Headphones className="w-5 h-5 mr-2" />
                Novo Exercício de Listening
              </Button>
            </Link>
            <Link href="/admin/dashboard/exercises/new/dictation">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-purple-500/20 transition-all duration-200">
                <Mic className="w-5 h-5 mr-2" />
                Novo Exercício de Ditado
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de Busca */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B794C0] w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar exercícios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#4A3B5C] border border-[#563763] rounded-xl text-[#E5D5F2] placeholder-[#B794C0] focus:outline-none focus:ring-2 focus:ring-[#8B6C9C] transition-all duration-200"
          />
        </div>
      </div>

      {/* Grid de Exercícios */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredExercises?.map((exercise) => {
          const typeDetails = getExerciseTypeDetails(exercise.type)
          const TypeIcon = typeDetails.icon

          return (
            <Card 
              key={exercise.id} 
              className="bg-[#4A3B5C] border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold text-[#E5D5F2] line-clamp-1">
                        {exercise.title}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs ${typeDetails.bgLight} ${typeDetails.textDark} font-medium`}>
                        {typeDetails.label}
                      </span>
                    </div>
                    <p className="text-[#B794C0] line-clamp-2">
                      {exercise.description}
                    </p>
                  </div>
                  <div className={`ml-4 p-3 rounded-xl ${typeDetails.bgColor} bg-opacity-20 flex-shrink-0`}>
                    <TypeIcon className={`w-5 h-5 ${typeDetails.textColor}`} />
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-2 p-4 bg-[#2D2438] rounded-xl border border-[#563763] bg-opacity-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#B794C0]">Idioma:</span>
                      <span className="text-sm text-[#E5D5F2] bg-[#563763] px-3 py-1 rounded-full">
                        {exercise.language.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#B794C0]">Nível:</span>
                      <span className="text-sm text-[#E5D5F2] bg-[#563763] px-3 py-1 rounded-full">
                        {exercise.level.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-2 border-t border-[#563763] pt-4">
                  <Button 
                    variant="ghost"
                    size="sm" 
                    className="flex items-center gap-2 text-[#B794C0] hover:text-[#E5D5F2] hover:bg-[#563763]"
                    onClick={() => router.push(`/admin/dashboard/exercises/${exercise.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm" 
                    className="flex items-center gap-2 text-[#B794C0] hover:text-[#E5D5F2] hover:bg-[#563763]"
                    onClick={() => router.push(`/admin/dashboard/exercises/${exercise.id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(exercise.id)}
                    className="flex items-center gap-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredExercises?.length === 0 && (
        <Card className="p-12 text-center bg-[#4A3B5C] border-none shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <BookOpen className="w-12 h-12 text-[#B794C0]" />
            <p className="text-[#E5D5F2] text-lg">Nenhum exercício encontrado</p>
          </div>
        </Card>
      )}
    </div>
  )
} 