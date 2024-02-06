import NextAuth from 'next-auth'
import { authConfig } from './auth.config'

export default NextAuth(authConfig).auth

// Мы добавляем небольшое дополнительное правило (конфигурацию), говорящее, что аутентификация должна применяться к большинству путей, но не к путям, которые включают «api», «_next/static», «_next/image» или имеют расширение файла «.png». ."
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}
