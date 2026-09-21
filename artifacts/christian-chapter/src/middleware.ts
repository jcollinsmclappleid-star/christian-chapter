import { unsealData } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import type { AdminSession } from "@/lib/admin-session";

const COOKIE_NAME = "cc_admin";

function sessionPassword(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set to 32+ characters in production.");
  }
  return "dev-placeholder-must-be-32-chars-long!!";
}

const SESSION_SECRET = sessionPassword();

const PUBLIC_ADMIN_PATHS = ["/admin/login", "/api/admin/login"];

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
}

function isPublicAdminPath(pathname: string) {
  return PUBLIC_ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isAdminPath(pathname)) return NextResponse.next();
  if (isPublicAdminPath(pathname)) return NextResponse.next();

  const cookieValue = request.cookies.get(COOKIE_NAME)?.value;

  if (!cookieValue) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const session = await unsealData<AdminSession>(cookieValue, {
      password: SESSION_SECRET,
    });
    if (!session?.admin?.loggedIn) {
      throw new Error("Not logged in");
    }
  } catch {
    const isApi = pathname.startsWith("/api/");
    if (isApi) {
      const res = NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      res.cookies.delete(COOKIE_NAME);
      return res;
    }
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete(COOKIE_NAME);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
