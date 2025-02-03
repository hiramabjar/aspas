"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BookOpen, Headphones, Mic } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2D2438] p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-white animate-float">Bem-vindo à "Escola de Idiomas"</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Aprimore suas habilidades linguísticas com nossos exercícios interativos de leitura, escuta e ditado
          </p>
        </header>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Reading Card */}
          <Card className="p-6 bg-[#4A3B5C] shadow-lg hover:shadow-xl transition-shadow border-[#8B6C9C] border">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#8B6C9C] rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Exercícios de Leitura</h2>
              <p className="text-white/80">
                Pratique sua compreensão textual com uma variedade de textos e questões interativas
              </p>
            </div>
          </Card>

          {/* Listening Card */}
          <Card className="p-6 bg-[#4A3B5C] shadow-lg hover:shadow-xl transition-shadow border-[#8B6C9C] border">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#8B6C9C] rounded-full flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Exercícios de Escuta</h2>
              <p className="text-white/80">Desenvolva sua compreensão auditiva com áudios e exercícios práticos</p>
            </div>
          </Card>

          {/* Dictation Card */}
          <Card className="p-6 bg-[#4A3B5C] shadow-lg hover:shadow-xl transition-shadow border-[#8B6C9C] border">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-[#8B6C9C] rounded-full flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-white">Exercícios de Ditado</h2>
              <p className="text-white/80">Aprimore sua escrita e compreensão com exercícios de ditado interativos</p>
            </div>
          </Card>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link href="/auth/login">
            <Button className="px-8 py-6 text-lg bg-[#8B6C9C] hover:bg-[#9d7eb0] text-white font-bold transition-colors">
              Acessar Sistema
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center text-white/70 mt-12">
          <p>&copy; 2024 Escola de Idiomas. Todos os direitos reservados.</p>
        </footer>
      </div>
    </main>
  )
}

