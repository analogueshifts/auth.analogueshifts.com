import { NextRequest, NextResponse } from "next/server";

// The Google OAuth redirect_uri configured on the backend is hardcoded to
// this host. Cookies (incl. the "app" identifier set on first load) don't
// carry across auth.analogueshifts.app and auth.analogueshifts.com, so a
// session that starts on the wrong host loses its app identifier partway
// through login. Force every request onto the canonical host before any
// page logic (or cookie-setting) runs.
const CANONICAL_HOST = "auth.analogueshifts.com";
const NON_CANONICAL_HOST = "auth.analogueshifts.app";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0];

  if (hostname === NON_CANONICAL_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
