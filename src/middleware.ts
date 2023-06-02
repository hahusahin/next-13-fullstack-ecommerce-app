export { default } from "next-auth/middleware";

// Add paths that you want to protect here
export const config = {
  matcher: ["/profile", "/reviews/:path*"]
}
