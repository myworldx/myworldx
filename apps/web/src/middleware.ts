import { type NextRequest, NextResponse } from 'next/server'
import { getValidSubdomain } from './utils/getValidSubDomain'

const PUBLIC_FILE = /\.(.*)$/

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  if (PUBLIC_FILE.test(url.pathname) || url.pathname.includes('_next')) return

  const host = req.headers.get('host')

  const subdomain = getValidSubdomain(host)
  if (subdomain) {
    console.log(`>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`)
    url.pathname = `/${subdomain}${url.pathname}`
  }

  return NextResponse.rewrite(url)
}
