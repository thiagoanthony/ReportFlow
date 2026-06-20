import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith(".")) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace(/\.+$/, "");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
