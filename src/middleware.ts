import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Retrieve the token from cookies
  const token = request.cookies.get("authToken");

  const url = request.nextUrl.clone();

  // If the user is not authenticated, redirect them to the login page ("/")
  if (!token) {
    if (url.pathname.startsWith("/lingkod")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If the user is authenticated and tries to access the login page ("/"), redirect them to the dashboard
  if (token && url.pathname === "/") {
    return NextResponse.redirect(new URL("/lingkod/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lingkod/:path*", "/"],
};
// export const config = {
//   matcher: [
//     "/lingkod/dashboard",
//     "/lingkod/residents",
//     "/lingkod/request",
//     "/lingkod/reports",
//     "/lingkod/events",
//     "/lingkod/bill",
//   ],
// };
