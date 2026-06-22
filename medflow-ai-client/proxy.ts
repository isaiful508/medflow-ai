import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/"];

const ROUTE_ACCESS: Record<string, string[]> = {
  "/dashboard": ["patient", "doctor", "admin"],
  "/ai-checker": ["patient"],
  "/appointments": ["patient", "doctor"],
  "/video-call": ["patient", "doctor"],
  "/chat": ["patient", "doctor"],
  "/profile": ["patient", "doctor", "admin"],
  "/analytics": ["doctor", "admin"],
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname)) {
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Block all protected routes without a token
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Decode token and check role against route
  try {
    const decoded = jwtDecode<{ role?: string }>(token);
    const userRole = decoded.role ?? "patient";

    const matchedPrefix = Object.keys(ROUTE_ACCESS).find((prefix) =>
      pathname.startsWith(prefix),
    );

    if (matchedPrefix) {
      const allowedRoles = ROUTE_ACCESS[matchedPrefix];
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("accessToken");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
