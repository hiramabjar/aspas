import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
  try {
    // Criar idioma e nível primeiro
    const language = await prisma.language.create({
      data: {
        name: 'English',
        code: 'en'
      }
    })

    const level = await prisma.level.create({
      data: {
        name: 'Beginner',
        code: 'A1'
      }
    })

    // Criar módulo
    const module = await prisma.module.create({
      data: {
        name: 'Introduction',
        description: 'Introduction to English',
        order: 1
      }
    })

    // Leitura do arquivo de áudio
    const audioPath = path.join(process.cwd(), 'path/to/your/audio/files', 'audio.mp3')
    const audioData = fs.readFileSync(audioPath)

    // Criar exercício com áudio
    const exercise = await prisma.exercise.create({
      data: {
        title: 'Título do Exercício',
        description: 'Descrição do Exercício',
        content: 'Conteúdo do exercício',
        type: 'listening',
        languageId: language.id,
        levelId: level.id,
        moduleId: module.id,
        audioUrl: 'path/to/audio.mp3'
      },
    })

    console.log('Exercício criado com sucesso:', exercise.id)
  } catch (error) {
    console.error('Erro ao criar exercício:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 