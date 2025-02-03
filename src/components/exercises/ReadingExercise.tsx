import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { DownloadPdfButton } from './DownloadPdfButton'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import type { Exercise } from '@/types/exercise'
import { BookOpen } from 'lucide-react'

interface ReadingExerciseProps {
  exercise: Exercise
  onSubmit: (answers: Array<{ questionId: string; answer: string }>) => void
}

export function ReadingExercise({ exercise, onSubmit }: ReadingExerciseProps) {
  const { toast } = useToast()
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(exercise.questions.length).fill(''))
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswers.some(answer => !answer)) {
      toast({
        title: "Atenção",
        description: "Por favor, responda todas as questões antes de enviar.",
        variant: "destructive"
      })
      return
    }

    const formattedAnswers = exercise.questions.map((question, index) => ({
      questionId: question.id,
      answer: selectedAnswers[index]
    }))

    try {
      onSubmit(formattedAnswers)
      setShowResults(true)
      toast({
        title: "Sucesso",
        description: "Respostas enviadas com sucesso!",
        variant: "default"
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar respostas. Tente novamente.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-[#382D4B] border-[#4A3B5C] p-6 shadow-lg">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#2D2440] border border-[#4A3B5C]">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Exercício de Leitura</h2>
              <p className="text-[#B794C0]">{exercise.description}</p>
            </div>
          </div>
          <DownloadPdfButton
            title={exercise.title}
            content={exercise.content}
            description={exercise.description}
          />
        </div>

        <div className="bg-[#2D2440] border border-[#4A3B5C] rounded-xl p-6 mb-6">
          <p className="text-white whitespace-pre-wrap">{exercise.content}</p>
        </div>
      </Card>

      <div className="space-y-4">
        {exercise.questions.map((question, index) => {
          const options = JSON.parse(question.options)
          return (
            <Card key={question.id} className="bg-[#382D4B] border-[#4A3B5C] p-6 shadow-lg">
              <p className="font-semibold text-white mb-4 text-lg">
                {index + 1}. {question.question}
              </p>
              <RadioGroup
                value={selectedAnswers[index]}
                onValueChange={(value: string) => {
                  const newAnswers = [...selectedAnswers]
                  newAnswers[index] = value
                  setSelectedAnswers(newAnswers)
                }}
                className="space-y-2"
              >
                {options.map((option: string, optIndex: number) => (
                  <div
                    key={optIndex}
                    className="flex items-center space-x-3 p-3 rounded-lg bg-[#2D2440] border border-[#4A3B5C] hover:border-[#6D5A88] transition-all duration-200"
                  >
                    <RadioGroupItem
                      value={option}
                      id={`q${index}-opt${optIndex}`}
                      className="border-[#6D5A88] text-white"
                    />
                    <Label
                      htmlFor={`q${index}-opt${optIndex}`}
                      className="text-white cursor-pointer flex-1"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {showResults && (
                <div className="mt-4 p-3 rounded-lg border bg-[#2D2440] border-[#4A3B5C]">
                  <p className={`text-sm ${
                    selectedAnswers[index] === question.correctAnswer
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}>
                    {selectedAnswers[index] === question.correctAnswer
                      ? '✓ Resposta correta!'
                      : `✗ Resposta incorreta. A resposta correta é: ${question.correctAnswer}`}
                  </p>
                </div>
              )}
            </Card>
          )
        })}
      </div>

      {!showResults && (
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium px-6 py-2.5 rounded-xl transition-colors duration-200"
          >
            Enviar Respostas
          </Button>
        </div>
      )}
    </div>
  )
} 