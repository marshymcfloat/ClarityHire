import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const authPaths = ["/login", "/register"];
  const staticPublicPaths = ["/"];
  const publicJobsPattern = /^\/([^/]+)\/available-jobs$/;

  const protectedPathPattern = /^\/([^/]+)\//;
  const protectedPathMatch = pathname.match(protectedPathPattern);

  if (!token) {
    const isStaticPublic = staticPublicPaths.includes(pathname);
    const isAuthPath = authPaths.includes(pathname);
    const isPublicJobsPage = publicJobsPattern.test(pathname);

    if (isStaticPublic || isAuthPath || isPublicJobsPage) {
      return NextResponse.next();
    }

    const protectedPathPattern = /^\/([^/]+)\//;
    const protectedPathMatch = pathname.match(protectedPathPattern);

    if (protectedPathMatch) {
      const companySlug = protectedPathMatch[1];
      const redirectUrl = new URL(`/${companySlug}/available-jobs`, req.url);

      redirectUrl.searchParams.set("showLogin", "true");

      console.log(
        `Unauthorized access to ${pathname}. Redirecting to ${redirectUrl.href}`
      );
      return NextResponse.redirect(redirectUrl);
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);

    loginUrl.searchParams.set("showLogin", "true");

    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    if (authPaths.includes(pathname)) {
      const companySlug = protectedPathMatch![1];
      const redirectUrl = new URL(`/${companySlug}/available-jobs`, req.url);

      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
