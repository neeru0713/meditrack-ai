import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedPaths = ['/dashboard', '/vitals', '/medications', '/appointments', '/symptoms'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtected = protectedPaths.some((p) => path.startsWith(p)) || path.startsWith('/api');
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (isProtected && !token && !path.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
