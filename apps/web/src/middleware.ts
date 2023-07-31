import { type NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Add CORS headers
  request.headers.set('Access-Control-Allow-Origin', '*')
  request.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  request.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization')

  // If it was an OPTIONS request, send response early with 200 status
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
    })
  }

  return NextResponse.next()
}
