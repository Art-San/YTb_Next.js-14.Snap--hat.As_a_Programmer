import { authConfig } from './auth.config'
import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Goggle from 'next-auth/providers/google'
import { connectToMongoDB } from './lib/db'
import User from './models/userModel'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
    Goggle({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET
    })
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session }) {
      try {
        await connectToMongoDB()
        if (session.user) {
          const user = await User.findOne({ email: session.user.email })
          if (user) {
            session.user._id = user._id
            session.user.image = user.avatar
            return session
          } else {
            throw new Error('User not found')
          }
        } else {
          throw new Error('Invalid session')
        }
      } catch (error) {
        console.log(error)
        throw new Error('Invalid session')
      }
    },
    async signIn({ account, profile }) {
      try {
        await connectToMongoDB()
        let user = await User.findOne({ email: profile?.email })

        if (!user) {
          // Создание нового пользователя
          user = await User.create({
            username: profile?.login || profile?.given_name,
            email: profile?.email,
            fullName: profile?.name,
            avatar: profile?.avatar_url || profile?.picture
          })
          await user.save()
        }

        // Дополнительная  логика, если необходима

        return true // Успешный вход
      } catch (error) {
        console.error('Error signing in:', error)
        // Возвращайте более подробное сообщение об ошибке, если это возможно
        return false
      }
    }
    // async signIn({ account, profile }) {
    //   console.log('account?.provider', account?.provider)
    //   console.log('profile', profile)
    //   if (account?.provider === 'github') {
    //     await connectToMongoDB()

    //     try {
    //       const user = await User.findOne({ email: profile?.email })

    //       // signup the user if not found
    //       if (!user) {
    //         const newUser = await User.create({
    //           username: profile?.login,
    //           email: profile?.email,
    //           fullName: profile?.name,
    //           avatar: profile?.avatar_url
    //         })

    //         await newUser.save()
    //       }
    //       return true // indicate successful sign-in
    //     } catch (error) {
    //       console.log(error)
    //       return false // indicate failed sign-in
    //     }
    //   } else if (account?.provider === 'google') {
    //     await connectToMongoDB()
    //     try {
    //       const user = await User.findOne({ email: profile?.email })

    //       if (!user) {
    //         const newUser = await User.create({
    //           username: profile?.given_name,
    //           email: profile?.email,
    //           fullName: profile?.name,
    //           avatar: profile?.picture
    //         })

    //         await newUser.save()
    //       }

    //       return true
    //     } catch (error) {
    //       console.log(error)
    //       return false
    //     }
    //   }
    //   console.log('auth signIn')
    //   return false // указать неудачный вход в систему
    // }
  }
})
