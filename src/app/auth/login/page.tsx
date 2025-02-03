"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import "./styles.css"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import toast from "react-hot-toast"

export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const email = formData.get('email')
      const password = formData.get('password')

      // Verificação de admin
      if (email === 'admin@example.com' && password === 'admin123') {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast.error('Credenciais inválidas')
          return
        }

        toast.success('Login de administrador realizado com sucesso!')
        router.push('/admin/dashboard')
        return
      }

      // Login normal para outros usuários
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error('Credenciais inválidas')
        return
      }

      toast.success('Login realizado com sucesso!')
      router.push('/student/dashboard')
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      {/* Background Image */}
      <div className="login-background">
        <Image
          src="/images/4.png"
          alt="Magical glowing book"
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="login-overlay" />
      </div>

      <div className="login-container">
        {/* Logo with magical effect */}
        <div className="login-logo-container">
          <div className="absolute inset-0 animate-pulse-slow">
            <Image
              src="/images/12-removebg-preview.png"
              alt="Aspas Logo"
              fill
              className="object-contain filter drop-shadow-[0_0_15px_rgba(139,108,156,0.7)]"
              priority
              quality={100}
            />
          </div>
          <Image
            src="/images/12-removebg-preview.png"
            alt="Aspas Logo"
            fill
            className="object-contain relative z-10 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
            priority
            quality={100}
          />
        </div>

        <Card className="login-card">
          <div className="space-y-6">
            {/* Título e Subtítulo */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white">Área do Aluno</h1>
              <p className="text-white/80">Entre para continuar sua jornada de aprendizado</p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-white">
                  E-mail
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  className="login-input"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-white">
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="login-input"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Links */}
            <div className="space-y-2 text-center">
              <Link
                href="/auth/forgot-password"
                className="login-link text-sm block"
              >
                Esqueceu sua senha?
              </Link>
              <p className="text-white/80">
                Não tem uma conta?{" "}
                <Link href="/auth/register" className="login-link font-semibold">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}

