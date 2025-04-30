import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  console.log("token-fake", token);
  if (!token) {
    const fakeToken = btoa("fake@email.com:123456:cliente");

    const response = NextResponse.next();
    response.cookies.set("access_token", fakeToken, {
      path: "/",
      maxAge: 3600, // 1h
    });

    return response;
  }

  return NextResponse.next();
}
