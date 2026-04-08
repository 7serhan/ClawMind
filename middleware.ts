import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // CSRF protection: require custom header on mutating requests
  if (request.method === "PUT" || request.method === "POST" || request.method === "DELETE") {
    const csrfHeader = request.headers.get("x-clawmind-request")
    if (csrfHeader !== "1") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
