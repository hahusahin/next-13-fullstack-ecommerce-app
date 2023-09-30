import { NextRequest, NextResponse } from "next/server";
import { decode } from "next-auth/jwt";

const authRotes = ["/account", "/shipping", "/ordersummary"];
const adminRoutes = ["/admin/products", "/admin/users"];

// middleware for auth routes
export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if ([...authRotes, ...adminRoutes].includes(path)) {
    const session = request.cookies.get("next-auth.session-token");

    if (!session) {
      return NextResponse.redirect(
        new URL(`/api/auth/signin?callbackUrl=/`, request.nextUrl.origin)
      );
    }

    if (adminRoutes.includes(path)) {
      const decoded = await decode({
        token: session.value,
        secret: process.env.NEXTAUTH_SECRET as string,
      });

      if (decoded?.role != "ADMIN") {
        return NextResponse.redirect(new URL(`/`, request.nextUrl.origin));
      }
    }
  }

  return NextResponse.next();
}
