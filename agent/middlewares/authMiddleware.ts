// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const pathname = request.nextUrl.pathname;

  // Define pages that should have layout
  const layoutPages = [
    "/dashboard",
    "/events",
    "/conversations",
    "/inventory",
    "/calendar",
    "/analytics",
    "/settings",
    "/profile",
  ];

  // Check if current path should have layout
  const shouldHaveLayout = layoutPages.some((page) =>
    pathname.startsWith(page)
  );

  // Add a header to indicate layout requirement
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-show-layout", shouldHaveLayout ? "true" : "false");

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};