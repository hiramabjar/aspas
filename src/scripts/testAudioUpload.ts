import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function testAudioUpload() {
  try {
    // Caminho absoluto para o arquivo de áudio
    const audioPath = path.join(__dirname, '..', '..', 'public', 'audio', 'test-audio.mp3')
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(audioPath)) {
      console.error('Arquivo de áudio não encontrado:', audioPath)
      return
    }

    console.log('Lendo arquivo de áudio:', audioPath)
    
    // Copiar o arquivo para a pasta public/audio se não existir
    const publicAudioPath = path.join(process.cwd(), 'public', 'audio', 'test-audio.mp3')
    if (!fs.existsSync(publicAudioPath)) {
      fs.copyFileSync(audioPath, publicAudioPath)
    }

    // Atualizar exercício existente com a URL do áudio
    const updatedExercise = await prisma.exercise.update({
      where: {
        id: 'cm6k1u7qt00014yfcy1t5yqv4'
      },
      data: {
        audioUrl: '/audio/test-audio.mp3'
      }
    })

    console.log('URL do áudio atualizada com sucesso:', updatedExercise.id)

    // Verificar se a URL do áudio foi salva
    const checkExercise = await prisma.exercise.findUnique({
      where: {
        id: 'cm6k1u7qt00014yfcy1t5yqv4'
      },
      select: {
        audioUrl: true
      }
    })

    if (checkExercise?.audioUrl) {
      console.log('URL do áudio encontrada no banco de dados:', checkExercise.audioUrl)
    } else {
      console.log('URL do áudio não encontrada no banco de dados')
    }

  } catch (error) {
    console.error('Erro no teste de áudio:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Executar o teste
testAudioUpload() 