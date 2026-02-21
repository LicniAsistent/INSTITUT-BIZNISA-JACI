import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Protect admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/community/:path*'],
};
