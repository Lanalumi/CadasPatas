import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '')
        const password = String(credentials?.password ?? '')

        // Fake fixed credentials
        if (email === 'admin@cadaspatas.com' && password === '123456') {
          return {
            id: 'mock-admin',
            name: 'Admin',
            email: 'admin@cadaspatas.com',
          }
        }

        return null
      },
    }),
  ],
})
