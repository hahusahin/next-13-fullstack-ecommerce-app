import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/ordersummary", "/order/:path*", "/admin/:path*"],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  if (!token)
    return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
  // return NextResponse.redirect(url)

  return NextResponse.next();
}
