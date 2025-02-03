import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const LANGUAGES = [
  {
    id: 'en',
    name: 'Inglês',
    code: 'en-US'
  },
  {
    id: 'es',
    name: 'Espanhol',
    code: 'es-ES'
  },
  {
    id: 'de',
    name: 'Alemão',
    code: 'de-DE'
  },
  {
    id: 'it',
    name: 'Italiano',
    code: 'it-IT'
  },
  {
    id: 'fr',
    name: 'Francês',
    code: 'fr-FR'
  }
]

const LEVELS = [
  {
    id: 'beginner',
    name: 'Iniciante',
    code: 'BEG'
  },
  {
    id: 'intermediate',
    name: 'Intermediário',
    code: 'INT'
  },
  {
    id: 'advanced',
    name: 'Avançado',
    code: 'ADV'
  }
]

async function main() {
  try {
    console.log('Starting seed...')

    // Criar níveis primeiro
    for (const level of LEVELS) {
      await prisma.level.upsert({
        where: { id: level.id },
        update: {
          name: level.name,
          code: level.code
        },
        create: {
          id: level.id,
          name: level.name,
          code: level.code
        }
      })
    }

    // Criar idiomas
    for (const language of LANGUAGES) {
      await prisma.language.upsert({
        where: { id: language.id },
        update: {
          name: language.name,
          code: language.code
        },
        create: {
          id: language.id,
          name: language.name,
          code: language.code
        }
      })
    }

    // Criar usuário admin
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@aspas.com' },
      update: {},
      create: {
        email: 'admin@aspas.com',
        name: 'Administrador',
        password: adminPassword,
        role: 'ADMIN'
      },
    })

    // Criar usuário estudante
    const studentPassword = await bcrypt.hash('student123', 12)
    const student = await prisma.user.upsert({
      where: { email: 'student@aspas.com' },
      update: {},
      create: {
        email: 'student@aspas.com',
        name: 'Estudante',
        password: studentPassword,
        role: 'STUDENT',
        studentProfile: {
          create: {
            enrollments: {
              create: {
                languageId: 'en',
                levelId: 'beginner'
              }
            }
          }
        }
      },
    })

    // Criar módulos
    const readingModule = await prisma.module.upsert({
      where: { id: 'reading-module' },
      update: {
        name: 'Exercícios de Leitura',
        description: 'Módulo para exercícios de leitura e compreensão de texto'
      },
      create: {
        id: 'reading-module',
        name: 'Exercícios de Leitura',
        description: 'Módulo para exercícios de leitura e compreensão de texto',
        order: 1
      }
    })

    const listeningModule = await prisma.module.upsert({
      where: { id: 'listening-module' },
      update: {
        name: 'Exercícios de Listening',
        description: 'Módulo para exercícios de compreensão auditiva'
      },
      create: {
        id: 'listening-module',
        name: 'Exercícios de Listening',
        description: 'Módulo para exercícios de compreensão auditiva',
        order: 2
      }
    })

    console.log('Seed completed successfully:', {
      admin,
      student,
      languages: await prisma.language.findMany(),
      levels: await prisma.level.findMany(),
      modules: await prisma.module.findMany()
    })

    console.log('Seed executado com sucesso!')
  } catch (error) {
    console.error('Erro durante o seed:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  }) 