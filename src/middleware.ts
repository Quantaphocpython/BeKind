import createMiddleware from 'next-intl/middleware'
import { routing } from './configs/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Skip all paths that should not be internationalized
  //matcher: ["/((?!api|_next|.*\\..*).*)"],
  matcher: ['/((?!api|_next|_vercel\\..*).*)'], // this solved: Unable to find `next-intl` locale because the middleware didn't run on this request.
}
