import { Session } from 'next-auth'
import { NextRequest } from 'next/server'
import { connectToMongoDB } from './lib/db'
import User from './models/userModel'

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  providers: [],
  callbacks: {
    // не работает она тут, только там
    // async session({ session }: { session: Session }) {
    //   try {
    //     await connectToMongoDB()
    //     if (session.user) {
    //       const user = await User.findOne({ email: session.user.email })
    //       if (user) {
    //         session.user._id = user._id
    //         return session
    //       } else {
    //         throw new Error('User not found')
    //       }
    //     } else {
    //       throw new Error('Invalid session')
    //     }
    //   } catch (error) {
    //     console.log(error)
    //     throw new Error('Invalid session')
    //   }
    // },
    async authorized({
      auth,
      request
    }: {
      auth: Session | null
      request: NextRequest
    }) {
      const user = auth?.user

      const isVisitingChatPage = request.nextUrl.pathname.startsWith('/chat')

      const isVisitingAuthPage =
        request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/signup')

      if (!user && isVisitingChatPage) {
        return false
      }

      if (user && isVisitingAuthPage) {
        return Response.redirect(new URL('/chat', request.nextUrl))
      }

      return true
    }
  }
}
