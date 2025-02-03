import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { AudioPlayer } from './AudioPlayer'
import { Play, Pause, RotateCcw, Volume2, Volume1, VolumeX, FastForward, Mic } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { DownloadPdfButton } from './DownloadPdfButton'
import type { Exercise } from '@/types/exercise'

interface DictationExerciseProps {
  exercise: Exercise
  onSubmit: (answers: Array<{ questionId: string; answer: string }>) => void
}

export function DictationExercise({ exercise, onSubmit }: DictationExerciseProps) {
  const { toast } = useToast()
  const [answers, setAnswers] = useState<string[]>(Array(exercise.questions.length).fill(''))
  const [showResults, setShowResults] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [volume, setVolume] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!exercise.audioUrl) {
      // Configurar a síntese de voz como fallback
      utteranceRef.current = new SpeechSynthesisUtterance(exercise.content)
      utteranceRef.current.lang = exercise.language.code
      utteranceRef.current.rate = playbackRate
      utteranceRef.current.volume = volume
      
      return () => {
        if (utteranceRef.current) {
          speechSynthesis.cancel()
        }
      }
    }
  }, [exercise.content, exercise.language.code, exercise.audioUrl, playbackRate, volume])

  const playAudio = () => {
    if (!utteranceRef.current) return

    if (isPlaying) {
      speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      utteranceRef.current.onend = () => setIsPlaying(false)
      speechSynthesis.speak(utteranceRef.current)
      setIsPlaying(true)
    }
  }

  const restartAudio = () => {
    if (utteranceRef.current) {
      speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentTime(0)
      setTimeout(() => {
        speechSynthesis.speak(utteranceRef.current!)
        setIsPlaying(true)
      }, 100)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume
    }
  }

  const handlePlaybackRateChange = (newRate: number) => {
    setPlaybackRate(newRate)
    if (utteranceRef.current) {
      utteranceRef.current.rate = newRate
    }
  }

  const handleSubmit = () => {
    if (answers.some(answer => !answer)) {
      toast({
        title: "Atenção",
        description: "Por favor, responda todas as questões antes de enviar.",
        variant: "destructive"
      })
      return
    }

    // Criar array de respostas no formato esperado
    const formattedAnswers = exercise.questions.map((question, index) => ({
      questionId: question.id,
      answer: answers[index]
    }))

    // Enviar respostas para pontuação
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
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Exercício de Ditado</h2>
              <p className="text-[#B794C0]">{exercise.description}</p>
            </div>
          </div>
          <DownloadPdfButton
            title={exercise.title}
            content={exercise.content}
            description={exercise.description}
          />
        </div>

        <div className="bg-[#2D2440] border border-[#4A3B5C] rounded-xl p-6">
          {exercise.audioUrl ? (
            <AudioPlayer 
              audioUrl={exercise.audioUrl}
              onPlaybackRateChange={handlePlaybackRateChange}
              onVolumeChange={handleVolumeChange}
              className="bg-[#382D4B] border border-[#4A3B5C] shadow-lg"
            />
          ) : (
            <div className="space-y-4">
              {/* Controles principais */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={playAudio}
                  className="w-10 h-10 bg-[#382D4B] border-[#4A3B5C] hover:bg-[#2D2440] hover:border-[#6D5A88] text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={restartAudio}
                  className="w-10 h-10 bg-[#382D4B] border-[#4A3B5C] hover:bg-[#2D2440] hover:border-[#6D5A88] text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Controles de volume e velocidade */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 flex-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleVolumeChange(volume === 0 ? 1 : 0)}
                    className="w-8 h-8 text-white hover:bg-[#2D2440]"
                  >
                    {volume === 0 ? <VolumeX className="h-4 w-4" /> : 
                     volume < 0.5 ? <Volume1 className="h-4 w-4" /> : 
                     <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => handleVolumeChange(value[0])}
                    max={1}
                    step={0.1}
                    className="w-24"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <FastForward className="h-4 w-4 text-[#B794C0]" />
                  <Slider
                    value={[playbackRate]}
                    onValueChange={(value) => handlePlaybackRateChange(value[0])}
                    min={0.5}
                    max={2}
                    step={0.25}
                    className="w-24"
                  />
                  <span className="text-sm text-[#B794C0] w-12">
                    {playbackRate}x
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        {exercise.questions.map((question, index) => (
          <Card key={question.id} className="bg-[#382D4B] border-[#4A3B5C] p-6 shadow-lg">
            <div className="space-y-4">
              <label className="block text-white text-lg font-semibold">
                {index + 1}. Digite o que você ouviu:
              </label>
              <Input
                value={answers[index]}
                onChange={(e) => {
                  const newAnswers = [...answers]
                  newAnswers[index] = e.target.value
                  setAnswers(newAnswers)
                }}
                placeholder="Digite sua resposta aqui..."
                className="w-full bg-[#2D2440] border-[#4A3B5C] text-white placeholder-[#B794C0] focus:border-[#6D5A88] focus:ring-[#6D5A88]"
              />
              {showResults && (
                <div className="p-3 rounded-lg border bg-[#2D2440] border-[#4A3B5C]">
                  <p className={`text-sm ${
                    answers[index].toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }`}>
                    {answers[index].toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()
                      ? '✓ Resposta correta!'
                      : `✗ Resposta incorreta. A resposta correta é: ${question.correctAnswer}`}
                  </p>
                </div>
              )}
            </div>
          </Card>
        ))}
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