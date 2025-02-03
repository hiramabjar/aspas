import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciais inválidas')
        }

        // Credenciais do administrador
        const adminUser = {
          email: 'admin@example.com',
          password: 'admin123'
        }

        // Verifica se é o administrador
        if (credentials.email === adminUser.email && credentials.password === adminUser.password) {
          return {
            id: '1',
            email: adminUser.email,
            name: 'Admin User',
            role: 'admin'
          }
        }

        // Aqui você implementaria a verificação com o banco de dados para outros usuários
        // Por enquanto, vamos usar um usuário de exemplo
        const studentUser = {
          email: 'student@example.com',
          password: 'student123'
        }

        if (credentials.email === studentUser.email && credentials.password === studentUser.password) {
          return {
            id: '2',
            email: studentUser.email,
            name: 'Student User',
            role: 'student'
          }
        }

        throw new Error('Credenciais inválidas')
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'admin' | 'student'
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST } 