import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Exercise } from '@/types/exercise'

const exerciseSchema = z.object({
  type: z.enum(['reading', 'listening', 'dictation']),
  language: z.enum(['en', 'es', 'de', 'it', 'fr']),
  level: z.string(),
  content: z.string().min(10),
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string()
  })).optional(),
  audioUrl: z.string().optional()
})

type ExerciseFormProps = {
  initialData?: Exercise
  onSubmit: (values: z.infer<typeof exerciseSchema>) => Promise<void>
}

export function ExerciseForm({ initialData, onSubmit }: ExerciseFormProps) {
  const form = useForm<z.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: initialData ? {
      type: initialData.type,
      language: initialData.language.name.toLowerCase() as 'en' | 'es' | 'de' | 'it' | 'fr',
      level: initialData.level.name,
      content: initialData.content,
      questions: initialData.questions.map(q => ({
        question: q.question,
        options: JSON.parse(q.options as string),
        correctAnswer: q.correctAnswer
      })),
      audioUrl: initialData.audioUrl
    } : {
      type: 'reading',
      language: 'en',
      level: 'A1',
      content: '',
      questions: []
    }
  })

  const handleSelectChange = (field: keyof z.infer<typeof exerciseSchema>) => (value: string) => {
    form.setValue(field, value as any)
  }

  const handleAudioUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    // Implementar lógica de upload de áudio
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select onValueChange={handleSelectChange('type')} defaultValue={form.watch('type')}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de Exercício" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reading">Leitura</SelectItem>
            <SelectItem value="listening">Listening</SelectItem>
            <SelectItem value="dictation">Ditado</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleSelectChange('language')} defaultValue={form.watch('language')}>
          <SelectTrigger>
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">Inglês</SelectItem>
            <SelectItem value="es">Espanhol</SelectItem>
            <SelectItem value="de">Alemão</SelectItem>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="fr">Francês</SelectItem>
          </SelectContent>
        </Select>

        <Input {...form.register('level')} placeholder="Nível (ex: A1, B2)" />
        
        {form.watch('type') === 'dictation' && (
          <Input 
            type="file" 
            accept="audio/*"
            onChange={(e) => handleAudioUpload(e.target.files)}
          />
        )}
      </div>

      <Textarea
        {...form.register('content')}
        placeholder="Conteúdo do exercício"
        rows={6}
      />

      <Button type="submit">
        {initialData ? 'Atualizar' : 'Criar'} Exercício
      </Button>
    </form>
  )
} 