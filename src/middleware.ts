import { type NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/welcome", "/verify", "/profile-setup", "/credentials"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("pliq-session");
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!token && !isAuthRoute && pathname !== "/") {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|icons|sw.js).*)",
  ],
};
