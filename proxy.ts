import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = request.nextUrl.pathname === "/admin/login"
  
  if (!isAdminRoute) {
    return NextResponse.next()
  }

  const token = request.cookies.get("authjs.session-token") || request.cookies.get("__Secure-authjs.session-token")
  
  if (isAdminRoute && !isLoginPage && !token) {
    const loginUrl = new URL("/admin/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
  
  if (isLoginPage && token) {
    const adminUrl = new URL("/admin", request.url)
    return NextResponse.redirect(adminUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
