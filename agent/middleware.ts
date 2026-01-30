// agent/middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware check:", {
    pathname,
    hasAccessToken: !!accessToken,
    cookieNames: request.cookies.getAll().map(c => c.name),
  });

  // If NOT logged in → block protected routes
  if (!accessToken && pathname !== "/login") {
    console.log("❌ No token, redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in → prevent visiting login again
  if (accessToken && pathname === "/login") {
    console.log("✅ Has token, redirecting to /");
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("✅ Middleware passed");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};