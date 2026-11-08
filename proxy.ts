import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server"

import { componentFromPath, countRegistryFetch } from "@/lib/install-count"

// Runs only for /r/*, the files `npx shadcn add` downloads. The count is sent after the response,
// so installs are never slowed down.
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const name = componentFromPath(request.nextUrl.pathname)
  if (name && request.method === "GET") {
    event.waitUntil(countRegistryFetch(name, request.headers.get("user-agent")))
  }
  return NextResponse.next()
}

export const config = {
  matcher: "/r/:path*",
}
