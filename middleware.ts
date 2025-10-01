// middleware.ts

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const authPaths = ["/login", "/register"];
  const publicPaths = ["/"]; // static public routes

  const publicPatterns = [
    /^\/[^/]+\/available-jobs$/, // matches /:company-name/available-jobs
  ];

  if (token) {
    if (authPaths.includes(pathname)) {
      return NextResponse.redirect(new URL(`/${token.id}/dashboard`, req.url));
    }
  }

  if (!token) {
    const isPublic =
      publicPaths.includes(pathname) ||
      publicPatterns.some((pattern) => pattern.test(pathname));

    const isProtectedRoute = !authPaths.includes(pathname) && !isPublic;

    if (isProtectedRoute) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
