'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BookOpen, Search, Headphones, Mic } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const getExerciseIcon = (type: string) => {
  switch (type) {
    case 'reading':
      return <BookOpen className="w-5 h-5 text-emerald-600" />
    case 'listening':
      return <Headphones className="w-5 h-5 text-blue-600" />
    case 'dictation':
      return <Mic className="w-5 h-5 text-purple-600" />
    default:
      return <BookOpen className="w-5 h-5 text-gray-600" />
  }
}

const getExerciseTypeColor = (type: string) => {
  switch (type) {
    case 'reading':
      return 'bg-emerald-100 text-emerald-800'
    case 'listening':
      return 'bg-blue-100 text-blue-800'
    case 'dictation':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getExerciseTypeName = (type: string) => {
  switch (type) {
    case 'reading':
      return 'Leitura'
    case 'listening':
      return 'Listening'
    case 'dictation':
      return 'Ditado'
    default:
      return 'Exercício'
  }
}

export default function StudentExercisesPage() {
  const [search, setSearch] = useState('')
  const router = useRouter()

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const response = await fetch('/api/exercises')
      if (!response.ok) throw new Error('Failed to fetch exercises')
      return response.json()
    }
  })

  const filteredExercises = exercises?.filter((exercise: any) =>
    exercise.title.toLowerCase().includes(search.toLowerCase()) ||
    exercise.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Exercícios</h1>
      <p className="text-[#E5D5F2] mb-6">Explore nossa coleção de exercícios interativos</p>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B794C0] w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar exercícios..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#2D2440] border border-[#4A3B5C] rounded-xl text-white placeholder-[#B794C0] focus:outline-none focus:border-[#6D5A88] focus:ring-1 focus:ring-[#6D5A88] transition-all duration-200"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6]"></div>
        </div>
      ) : filteredExercises?.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExercises.map((exercise: any) => (
            <div
              key={exercise.id}
              className="bg-[#382D4B] rounded-xl border border-[#4A3B5C] group hover:border-[#6D5A88] transition-all duration-300 overflow-hidden shadow-lg"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white line-clamp-1 mb-2 group-hover:text-[#E5D5F2] transition-colors duration-200">
                      {exercise.title}
                    </h2>
                    <p className="text-[#B794C0] line-clamp-2 mb-4">
                      {exercise.description}
                    </p>
                  </div>
                  <div className="ml-4 p-3 rounded-xl bg-[#2D2440] border border-[#4A3B5C] group-hover:border-[#6D5A88] transition-all duration-300">
                    {getExerciseIcon(exercise.type)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#B794C0]">Tipo:</span>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                      exercise.type === 'reading'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : exercise.type === 'listening'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {getExerciseTypeName(exercise.type)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#B794C0]">Idioma:</span>
                    <span className="text-sm text-white">{exercise.language.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-[#B794C0]">Nível:</span>
                    <span className="text-sm text-white">{exercise.level.name}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link href={`/student/dashboard/exercises/${exercise.id}`} className="block">
                    <button className="w-full bg-[#2D2440] text-white font-medium py-2.5 rounded-xl border border-[#4A3B5C] hover:border-[#6D5A88] hover:bg-[#4A3B5C] transition-all duration-300">
                      Iniciar Exercício
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-[#2D2440] border border-[#4A3B5C] flex items-center justify-center">
            <Search className="w-8 h-8 text-[#B794C0]" />
          </div>
          <p className="text-[#B794C0] text-lg">Nenhum exercício encontrado</p>
        </div>
      )}
    </div>
  )
} 