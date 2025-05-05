import { NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/cliente", "/prestador", "/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoginRoute =
    pathname === "/cliente/login" ||
    pathname === "/prestador/login" ||
    pathname === "/admin/login"

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (!isProtected || isLoginRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get("access_token")?.value
  if (!token) {
    // token fake base64: email:senha:type
    const fakeEmail = "fake@email.com"
    const fakePassword = "123456"
    const fakeType = pathname.includes("/cliente")
      ? "cliente"
      : pathname.includes("/prestador")
        ? "prestador"
        : "admin"

    const fakeToken = btoa(`${fakeEmail}:${fakePassword}:${fakeType}`)

    const response = NextResponse.next()
    response.cookies.set("access_token", fakeToken, {
      path: "/",
      maxAge: 60 * 60,
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/cliente/:path*", "/prestador/:path*", "/admin/:path*"],
}
