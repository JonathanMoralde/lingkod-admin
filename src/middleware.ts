import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AdminUserDetails } from "./app/context/AuthContext";

// List of protected routes with allowed positions
const protectedRoutes = [
  {
    path: "/lingkod/officer-management",
    allowedPositions: ["Captain", "Secretary"],
  },
  { path: "/lingkod/residents", allowedPositions: ["Captain", "Secretary"] },
  { path: "/lingkod/household", allowedPositions: ["Captain", "Secretary"] },
  { path: "/lingkod/request", allowedPositions: ["Captain", "Secretary"] },
  { path: "/lingkod/reports", allowedPositions: ["Captain", "Secretary"] },
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve userDetails from cookies (or another storage method)
  const userDetailsCookie = request.cookies.get("userDetails");

  // Safely parse the cookie value
  const userDetails: AdminUserDetails = userDetailsCookie
    ? JSON.parse(userDetailsCookie.value)
    : null;

  // Check if the current path matches any protected routes
  for (const route of protectedRoutes) {
    if (pathname.startsWith(route.path)) {
      if (!route.allowedPositions.includes(userDetails.position)) {
        // Redirect unauthorized users to the dashboard or login page
        return NextResponse.redirect(
          new URL("/lingkod/dashboard", request.url)
        );
      }
    }
  }

  // Allow the request to continue if authorized
  return NextResponse.next();
}

export const config = {
  matcher: ["/lingkod/:path*"], // Apply middleware to routes under /lingkod/
};
