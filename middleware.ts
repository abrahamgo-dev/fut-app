import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Forwards the current pathname to Server Components as a request header —
// the standard Next.js workaround for layouts not receiving pathname as a
// prop. Used by app/(panel)/layout.tsx to know whether the current route is
// the profile-completion page itself, so its redirect doesn't loop forever.
// Deliberately does nothing else here (no auth/DB calls) since middleware
// runs on the Edge runtime, where Prisma isn't available.
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/panel/:path*", "/reservar/:path*"],
};
