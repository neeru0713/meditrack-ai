import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

const protectedPaths = ['/dashboard', '/vitals', '/medications', '/appointments', '/symptoms'];

export default auth(async (req: NextRequest) => {
  const path = req.nextUrl.pathname;
  const isProtected = protectedPaths.some((p) => path.startsWith(p)) || path.startsWith('/api');

  if (isProtected && !req.auth && !path.startsWith('/api/auth')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
