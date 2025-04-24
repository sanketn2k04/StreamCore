import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("accessToken");
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  if (pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    if (authToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes
  const protectedPaths = ["/upload", "/history"];
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!authToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/upload/:path*", "/history/:path*", "/login", "/signup"],
};
