import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'
import { routing } from './configs/i18n/routing'

const middleware = createMiddleware(routing)

export default function middlewareWithDebug(request: NextRequest) {
  const url = request.nextUrl
  console.log('Middleware - URL:', url.pathname)
  console.log('Middleware - Locale from URL:', url.pathname.split('/')[1])

  const response = middleware(request)

  // Log headers after middleware
  response.headers.forEach((value, key) => {
    if (key === 'x-next-intl-locale') {
      console.log('Middleware - Set header:', key, value)
    }
  })

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
