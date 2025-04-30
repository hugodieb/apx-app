import { middleware as realMiddleware } from "./middlewares/auth";
import { middleware as mockMiddleware } from "./middlewares/mock";

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/cliente/:path*", "/prestador/:path*"],
};

export function middleware(req: import("next/server").NextRequest) {
  return isMock ? mockMiddleware(req) : realMiddleware(req);
}
