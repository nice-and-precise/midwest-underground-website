import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // Validate credentials exist
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Verify password with bcrypt
        const isValidPassword = await compare(
          credentials.password as string,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Invalid email or password')
        }

        // Return user object (password excluded)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          crew: null // Crew is not stored in the User model but can be added later
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/login',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add custom fields to JWT token on sign in
      if (user) {
        token.id = user.id
        token.role = user.role
        token.crew = user.crew
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields to session from token
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role as string
        session.user.crew = token.crew as string | null
      }
      return session
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'development-secret-change-in-production'
})
