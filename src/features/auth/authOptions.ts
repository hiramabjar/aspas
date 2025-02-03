import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/database/prisma'
import { comparePassword } from '@/lib/auth/password-utils'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são necessários')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Usuário não encontrado')
        }

        const isPasswordValid = await comparePassword(credentials.password, user.password)

        if (!isPasswordValid) {
          throw new Error('Senha incorreta')
        }

        return {
          id: user.id,
          email: user.email || '',
          name: user.name || '',
          role: user.role
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    error: '/auth/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string
      }
      return session
    },
    async redirect({ url, baseUrl, token }) {
      // Se a URL for relativa, adicione o baseUrl
      const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url
      
      // Se for uma URL do mesmo site
      if (fullUrl.startsWith(baseUrl)) {
        // Redireciona para o dashboard apropriado baseado no papel do usuário
        if (token?.role === 'admin') {
          return `${baseUrl}/admin/dashboard`
        }
        return `${baseUrl}/student/dashboard`
      }
      return fullUrl
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

export const config = {
  api: {
    bodyParser: false
  }
} 