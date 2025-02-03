import prisma from '@/lib/database/prisma'

async function seedExercises() {
  try {
    // Primeiro, buscar um idioma e nível para associar
    const english = await prisma.language.findFirst({
      where: { code: 'EN' }
    });
    
    const beginnerLevel = await prisma.level.findFirst({
      where: { code: 'A1' }
    });

    if (!english || !beginnerLevel) {
      throw new Error('Idioma ou nível não encontrado');
    }

    // Criar exercícios
    const exercises = await Promise.all([
      prisma.exercise.create({
        data: {
          title: 'Present Simple - Exercício 1',
          description: 'Complete as frases com o Present Simple correto',
          content: 'I ___ (to be) a student.\nShe ___ (to work) at a hospital.',
          type: 'fill_blanks',
          languageId: english.id,
          levelId: beginnerLevel.id,
          questions: {
            create: [
              {
                question: 'I ___ (to be) a student.',
                options: JSON.stringify(['am', 'is', 'are']),
                correctAnswer: 'am'
              },
              {
                question: 'She ___ (to work) at a hospital.',
                options: JSON.stringify(['work', 'works', 'working']),
                correctAnswer: 'works'
              }
            ]
          }
        }
      }),
      prisma.exercise.create({
        data: {
          title: 'Vocabulário - Família',
          description: 'Escolha a palavra correta para cada membro da família',
          content: 'Multiple choice exercise about family members',
          type: 'multiple_choice',
          languageId: english.id,
          levelId: beginnerLevel.id,
          questions: {
            create: [
              {
                question: 'What is the female parent called?',
                options: JSON.stringify(['mother', 'father', 'sister', 'brother']),
                correctAnswer: 'mother'
              },
              {
                question: 'What is the male parent called?',
                options: JSON.stringify(['mother', 'father', 'sister', 'brother']),
                correctAnswer: 'father'
              }
            ]
          }
        }
      })
    ]);

    console.log('Exercícios cadastrados com sucesso!');
  } catch (error) {
    console.error('Erro ao cadastrar exercícios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedExercises(); 