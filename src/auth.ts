import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      authorize: async (credentials) => {
        // In production, this would validate against database:
        // const user = await prisma.user.findUnique({
        //   where: { email: credentials.email }
        // })
        // const isValid = await bcrypt.compare(credentials.password, user.password)

        // Mock users for development
        const mockUsers = [
          {
            id: '1',
            name: 'John Smith',
            email: 'jsmith@midwestunderground.com',
            password: 'admin123', // In production, this would be hashed
            role: 'admin',
            crew: 'Crew A'
          },
          {
            id: '2',
            name: 'Mike Johnson',
            email: 'mjohnson@midwestunderground.com',
            password: 'operator123',
            role: 'operator',
            crew: 'Crew A'
          },
          {
            id: '3',
            name: 'Tom Anderson',
            email: 'tanderson@willmarmu.gov',
            password: 'client123',
            role: 'client',
            crew: null
          }
        ]

        const user = mockUsers.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Return user object (password excluded)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          crew: user.crew
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
      // Add custom fields to JWT token
      if (user) {
        token.role = user.role
        token.crew = user.crew
      }
      return token
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (session.user) {
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
  secret: process.env.AUTH_SECRET || 'development-secret-change-in-production'
})
