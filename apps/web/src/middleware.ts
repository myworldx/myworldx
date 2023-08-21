import { type NextRequest, NextResponse } from 'next/server'

export default async function middleware(req: NextRequest) {
  return
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
