import { NextResponse } from 'next/server'

// Middleware just checks for the auth token cookie — no env vars needed here
const AUTH_TOKEN = 'wedding-planner-authenticated'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Always allow login page and API routes
  if (
    pathname === '/login' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.includes('favicon')
  ) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const auth = request.cookies.get('auth')
  if (auth?.value === AUTH_TOKEN) {
    return NextResponse.next()
  }

  // Redirect to login
  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('from', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
