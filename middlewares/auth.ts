import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value
  console.log("token-real", token);
  const pathname = request.nextUrl.pathname

  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/config")

  if (isProtected && !token) {
    const loginUrl = new URL("/", request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/config/:path*"],
}
