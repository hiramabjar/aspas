// Por enquanto vamos apenas exportar uma função mock
export async function textToSpeech(text: string, language: string): Promise<string> {
  // No futuro, você pode implementar um serviço de text-to-speech diferente aqui
  // Por enquanto, retornamos uma URL falsa
  return `https://example.com/audio/${language}/${encodeURIComponent(text)}.mp3`
} 