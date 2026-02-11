import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// If the user visits the website, we will first check if the user has an refresh token
export async function middleware(request: NextRequest) {

  const token = request.cookies.get('refresh_token')?.value;

  const isAuthPage = request.nextUrl.pathname = "/";

  if (!token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/home", request.url))
  }

  return NextResponse.next();

}

export const config = {
  matcher: [
    // Will not check the cookie if the paths match with one of these
    // /api, /_next, /static
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};